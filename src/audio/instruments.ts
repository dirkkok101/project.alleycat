// Synth voices built from short-lived Web Audio nodes. Every function works on
// a BaseAudioContext so the same code drives live music and offline SFX
// rendering. Envelopes always start at 0 and end with a setTarget release to
// ~0 before the sources stop, so notes never click.

import { midiToFreq } from './pattern';

interface Kit {
  noise: AudioBuffer;
  pulse12: PeriodicWave;
  pulse25: PeriodicWave;
}

const kits = new WeakMap<BaseAudioContext, Kit>();

function pulseWave(c: BaseAudioContext, duty: number): PeriodicWave {
  const n = 64;
  const real = new Float32Array(n);
  const imag = new Float32Array(n);
  for (let i = 1; i < n; i++) real[i] = (2 / (i * Math.PI)) * Math.sin(i * Math.PI * duty);
  return c.createPeriodicWave(real, imag);
}

export function kit(c: BaseAudioContext): Kit {
  let k = kits.get(c);
  if (!k) {
    const noise = c.createBuffer(1, Math.floor(c.sampleRate * 2), c.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    k = { noise, pulse12: pulseWave(c, 0.125), pulse25: pulseWave(c, 0.25) };
    kits.set(c, k);
  }
  return k;
}

export type Wave = OscillatorType | 'pulse12' | 'pulse25';

function makeOsc(c: BaseAudioContext, wave: Wave): OscillatorNode {
  const o = c.createOscillator();
  if (wave === 'pulse12') o.setPeriodicWave(kit(c).pulse12);
  else if (wave === 'pulse25') o.setPeriodicWave(kit(c).pulse25);
  else o.type = wave;
  return o;
}

/**
 * ADSR on a gain param using only setValue/linearRamp/setTarget. Returns the
 * time by which the release has decayed to silence (safe stop time).
 */
export function adsr(
  g: AudioParam,
  t: number,
  peak: number,
  a: number,
  d: number,
  sus: number,
  gate: number,
  rel: number,
): number {
  const attackEnd = t + Math.max(0.001, a);
  const releaseAt = Math.max(attackEnd + 0.001, t + gate);
  g.setValueAtTime(0, t);
  g.linearRampToValueAtTime(peak, attackEnd);
  g.setTargetAtTime(peak * sus, attackEnd, Math.max(0.001, d / 3));
  g.setTargetAtTime(0, releaseAt, Math.max(0.002, rel / 4));
  return releaseAt + rel * 2.2;
}

/** Percussive envelope: quick attack, exponential-ish decay with time constant `tau`. */
export function perc(g: AudioParam, t: number, peak: number, a: number, tau: number): number {
  g.setValueAtTime(0, t);
  g.linearRampToValueAtTime(peak, t + Math.max(0.001, a));
  g.setTargetAtTime(0, t + Math.max(0.001, a), tau);
  return t + a + tau * 9;
}

export interface ToneOpts {
  wave?: Wave;
  /** Start frequency (Hz). */
  f: number;
  /** Optional glide points [timeOffset, freq] applied with exponential ramps. */
  glide?: Array<[number, number]>;
  t?: number;
  peak?: number;
  a?: number;
  /** Percussive decay time constant; if absent an ADSR with `gate` is used. */
  tau?: number;
  gate?: number;
  sus?: number;
  d?: number;
  rel?: number;
  detune?: number;
  vibrato?: { rate: number; depth: number; delay?: number };
  filter?: { type: BiquadFilterType; f: number; q?: number; to?: number; toAt?: number };
}

/** General-purpose oscillator voice (used heavily by SFX). Returns end time. */
export function tone(c: BaseAudioContext, out: AudioNode, o: ToneOpts): number {
  const t = o.t ?? 0;
  const osc = makeOsc(c, o.wave ?? 'square');
  osc.frequency.setValueAtTime(o.f, t);
  for (const [dt, f] of o.glide ?? []) osc.frequency.exponentialRampToValueAtTime(Math.max(1, f), t + dt);
  if (o.detune) osc.detune.setValueAtTime(o.detune, t);
  const g = c.createGain();
  const peak = o.peak ?? 0.5;
  const end =
    o.tau !== undefined
      ? perc(g.gain, t, peak, o.a ?? 0.002, o.tau)
      : adsr(g.gain, t, peak, o.a ?? 0.004, o.d ?? 0.05, o.sus ?? 0.7, o.gate ?? 0.1, o.rel ?? 0.04);
  let node: AudioNode = osc;
  if (o.filter) {
    const bq = c.createBiquadFilter();
    bq.type = o.filter.type;
    bq.frequency.setValueAtTime(o.filter.f, t);
    if (o.filter.to) bq.frequency.exponentialRampToValueAtTime(o.filter.to, t + (o.filter.toAt ?? 0.1));
    bq.Q.setValueAtTime(o.filter.q ?? 1, t);
    osc.connect(bq);
    node = bq;
  }
  if (o.vibrato) {
    const lfo = c.createOscillator();
    const depth = c.createGain();
    lfo.frequency.setValueAtTime(o.vibrato.rate, t);
    const vd = t + (o.vibrato.delay ?? 0);
    depth.gain.setValueAtTime(0, t);
    depth.gain.setValueAtTime(0, vd);
    depth.gain.linearRampToValueAtTime(o.vibrato.depth, vd + 0.12);
    lfo.connect(depth).connect(osc.frequency);
    lfo.start(t);
    lfo.stop(end);
  }
  node.connect(g).connect(out);
  osc.start(t);
  osc.stop(end);
  return end;
}

export interface NoiseOpts {
  t?: number;
  peak?: number;
  a?: number;
  tau?: number;
  gate?: number;
  rel?: number;
  filter: { type: BiquadFilterType; f: number; q?: number; glide?: Array<[number, number]> };
}

/** Filtered white-noise burst. Returns end time. */
export function noise(c: BaseAudioContext, out: AudioNode, o: NoiseOpts): number {
  const t = o.t ?? 0;
  const src = c.createBufferSource();
  src.buffer = kit(c).noise;
  const bq = c.createBiquadFilter();
  bq.type = o.filter.type;
  bq.frequency.setValueAtTime(o.filter.f, t);
  for (const [dt, f] of o.filter.glide ?? []) bq.frequency.exponentialRampToValueAtTime(f, t + dt);
  bq.Q.setValueAtTime(o.filter.q ?? 1, t);
  const g = c.createGain();
  const peak = o.peak ?? 0.5;
  const end =
    o.tau !== undefined
      ? perc(g.gain, t, peak, o.a ?? 0.001, o.tau)
      : adsr(g.gain, t, peak, o.a ?? 0.005, 0.05, 1, o.gate ?? 0.1, o.rel ?? 0.05);
  src.connect(bq).connect(g).connect(out);
  src.start(t, Math.random() * 1.5);
  src.stop(end);
  return end;
}

// ---------------------------------------------------------------------------
// Music instruments. Signature: (ctx, out, time, midi, durationSec, velocity)
// Each returns the time its last node stops (used for voice accounting).

export type NoteVoice = (c: BaseAudioContext, out: AudioNode, t: number, midi: number, dur: number, vel: number) => number;

/** Square/pulse lead with delayed vibrato — the PC-speaker nod. */
const lead: NoteVoice = (c, out, t, midi, dur, vel) => {
  const f = midiToFreq(midi);
  return tone(c, out, {
    wave: 'pulse25',
    f,
    t,
    peak: vel,
    a: 0.004,
    d: 0.12,
    sus: 0.6,
    gate: dur * 0.92,
    rel: 0.07,
    filter: { type: 'lowpass', f: 3600, q: 0.7 },
    vibrato: dur > 0.3 ? { rate: 5.5, depth: f * 0.007, delay: 0.14 } : undefined,
  });
};

/** Thin 12.5% pulse pluck for arpeggios. */
const pluck: NoteVoice = (c, out, t, midi, dur, vel) =>
  tone(c, out, {
    wave: 'pulse12',
    f: midiToFreq(midi),
    t,
    peak: vel,
    a: 0.002,
    d: 0.09,
    sus: 0.15,
    gate: Math.min(dur, 0.12),
    rel: 0.05,
    filter: { type: 'lowpass', f: 6000, to: 1800, toAt: 0.12, q: 1 },
  });

/** Round triangle bass with a touch of filtered saw for presence on small speakers. */
const bass: NoteVoice = (c, out, t, midi, dur, vel) => {
  const f = midiToFreq(midi);
  const gate = dur * 0.85;
  const e1 = tone(c, out, { wave: 'triangle', f, t, peak: vel, a: 0.004, d: 0.2, sus: 0.75, gate, rel: 0.05 });
  tone(c, out, {
    wave: 'sawtooth',
    f,
    t,
    peak: vel * 0.25,
    a: 0.004,
    d: 0.15,
    sus: 0.5,
    gate,
    rel: 0.05,
    filter: { type: 'lowpass', f: 1400, to: 380, toAt: 0.15, q: 2 },
  });
  return e1;
};

/** Pulsing resonant saw bass for the danger stem. */
const dangerBass: NoteVoice = (c, out, t, midi, dur, vel) =>
  tone(c, out, {
    wave: 'sawtooth',
    f: midiToFreq(midi),
    t,
    peak: vel,
    a: 0.003,
    d: 0.08,
    sus: 0.3,
    gate: dur * 0.6,
    rel: 0.04,
    filter: { type: 'lowpass', f: 900, to: 220, toAt: 0.12, q: 6 },
  });

/** Two-operator FM electric piano: a bright tine that mellows quickly. */
const epiano: NoteVoice = (c, out, t, midi, dur, vel) => {
  const f = midiToFreq(midi);
  const car = c.createOscillator();
  const mod = c.createOscillator();
  const idx = c.createGain();
  const g = c.createGain();
  car.frequency.setValueAtTime(f, t);
  mod.frequency.setValueAtTime(f, t);
  idx.gain.setValueAtTime(f * 1.6, t);
  idx.gain.setTargetAtTime(f * 0.25, t, 0.12);
  const end = adsr(g.gain, t, vel, 0.003, 1.2, 0.35, dur * 0.95, 0.18);
  mod.connect(idx).connect(car.frequency);
  car.connect(g).connect(out);
  car.start(t);
  mod.start(t);
  car.stop(end);
  mod.stop(end);
  return end;
};

/** Soft detuned-saw pad through a lowpass. */
const pad: NoteVoice = (c, out, t, midi, dur, vel) => {
  const f = midiToFreq(midi);
  const bq = c.createBiquadFilter();
  bq.type = 'lowpass';
  bq.frequency.setValueAtTime(900, t);
  bq.frequency.linearRampToValueAtTime(1600, t + Math.min(dur, 1));
  bq.Q.setValueAtTime(0.6, t);
  const g = c.createGain();
  const end = adsr(g.gain, t, vel, 0.18, 0.4, 0.85, dur, 0.45);
  for (const cents of [-8, 8]) {
    const o = c.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(f, t);
    o.detune.setValueAtTime(cents, t);
    o.connect(bq);
    o.start(t);
    o.stop(end);
  }
  bq.connect(g).connect(out);
  return end;
};

/** Glockenspiel-like bell: sine + inharmonic partials that die fast. */
const bell: NoteVoice = (c, out, t, midi, _dur, vel) => {
  const f = midiToFreq(midi);
  const e = tone(c, out, { wave: 'sine', f, t, peak: vel, a: 0.001, tau: 0.32 });
  tone(c, out, { wave: 'sine', f: f * 2.76, t, peak: vel * 0.35, a: 0.001, tau: 0.09 });
  tone(c, out, { wave: 'sine', f: f * 5.4, t, peak: vel * 0.15, a: 0.001, tau: 0.03 });
  return e;
};

/** Marimba: woody fundamental with a 4th-harmonic knock. */
const marimba: NoteVoice = (c, out, t, midi, _dur, vel) => {
  const f = midiToFreq(midi);
  const e = tone(c, out, { wave: 'sine', f, t, peak: vel, a: 0.002, tau: 0.13 });
  tone(c, out, { wave: 'sine', f: f * 3.99, t, peak: vel * 0.3, a: 0.001, tau: 0.025 });
  tone(c, out, { wave: 'triangle', f: f * 10.2, t, peak: vel * 0.06, a: 0.001, tau: 0.008 });
  return e;
};

/** Bubbly upward sine bloop. */
const blip: NoteVoice = (c, out, t, midi, _dur, vel) => {
  const f = midiToFreq(midi);
  return tone(c, out, { wave: 'sine', f: f * 0.6, glide: [[0.05, f * 1.15]], t, peak: vel, a: 0.004, tau: 0.04 });
};

export type InstrumentName = 'lead' | 'pluck' | 'bass' | 'dangerBass' | 'epiano' | 'pad' | 'bell' | 'marimba' | 'blip';

export const INSTRUMENTS: Record<InstrumentName, NoteVoice> = {
  lead,
  pluck,
  bass,
  dangerBass,
  epiano,
  pad,
  bell,
  marimba,
  blip,
};

/**
 * Drum kit. k kick, s snare, c clap, h closed hat, o open hat, r rim, t low tom.
 * Returns end time, or 0 for an unknown hit character.
 */
export function drum(c: BaseAudioContext, out: AudioNode, t: number, hit: string, vel: number): number {
  switch (hit) {
    case 'k': {
      noise(c, out, { t, peak: vel * 0.25, tau: 0.003, filter: { type: 'highpass', f: 2500 } });
      return tone(c, out, { wave: 'sine', f: 160, glide: [[0.11, 44]], t, peak: vel, a: 0.002, tau: 0.09 });
    }
    case 's': {
      tone(c, out, { wave: 'triangle', f: 210, glide: [[0.05, 160]], t, peak: vel * 0.5, a: 0.001, tau: 0.035 });
      return noise(c, out, { t, peak: vel * 0.7, tau: 0.055, filter: { type: 'highpass', f: 1100, q: 0.7 } });
    }
    case 'c': {
      let e = 0;
      for (let i = 0; i < 3; i++) {
        e = noise(c, out, { t: t + i * 0.011, peak: vel * 0.5, tau: 0.008, filter: { type: 'bandpass', f: 1400, q: 1.5 } });
      }
      return Math.max(e, noise(c, out, { t: t + 0.033, peak: vel * 0.5, tau: 0.06, filter: { type: 'bandpass', f: 1300, q: 1.2 } }));
    }
    case 'h':
      return noise(c, out, { t, peak: vel, tau: 0.016, filter: { type: 'highpass', f: 7500, q: 0.8 } });
    case 'o':
      return noise(c, out, { t, peak: vel, tau: 0.08, filter: { type: 'highpass', f: 7000, q: 0.8 } });
    case 'r': {
      tone(c, out, { wave: 'triangle', f: 820, t, peak: vel * 0.5, a: 0.001, tau: 0.012 });
      return tone(c, out, { wave: 'sine', f: 1750, t, peak: vel, a: 0.001, tau: 0.014 });
    }
    case 't':
      return tone(c, out, { wave: 'sine', f: 220, glide: [[0.15, 120]], t, peak: vel, a: 0.002, tau: 0.08 });
    default:
      return 0;
  }
}

/** Generated reverb impulse: decaying noise, slightly darker as it decays. */
export function makeImpulse(c: BaseAudioContext, seconds: number, decay: number, channels = 2): AudioBuffer {
  const len = Math.floor(c.sampleRate * seconds);
  const buf = c.createBuffer(channels, len, c.sampleRate);
  for (let ch = 0; ch < channels; ch++) {
    const d = buf.getChannelData(ch);
    let lp = 0;
    for (let i = 0; i < len; i++) {
      const x = i / len;
      // One-pole lowpass whose cutoff closes over time: bright early, dark tail.
      const k = 0.85 - 0.6 * x;
      lp = lp + k * (Math.random() * 2 - 1 - lp);
      d[i] = lp * Math.pow(1 - x, decay);
    }
  }
  return buf;
}
