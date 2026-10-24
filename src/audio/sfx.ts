// jsfxr-style sound effects, each a tiny synth patch rendered once into an
// AudioBuffer by an OfflineAudioContext. Times are seconds from 0.

import { INSTRUMENTS, makeImpulse, noise, tone } from './instruments';
import { mulberry32, noteToMidi as n, midiToFreq } from './pattern';

export type SfxName =
  | 'jump' | 'land' | 'meow' | 'squeak' | 'catch' | 'combo' | 'splash' | 'bark' | 'growl' | 'sweep'
  | 'windowOpen' | 'enterRoom' | 'hit' | 'thud' | 'throw' | 'heart' | 'heartBreak' | 'kiss' | 'lifeUp'
  | 'lifeLost' | 'uiSelect' | 'uiStart' | 'bubble' | 'zap' | 'eat' | 'tweet' | 'collect' | 'roomClear'
  | 'gameOver' | 'fall' | 'snore' | 'push' | 'gift' | 'gulp' | 'tick';

export interface SfxDef {
  /** Render length in seconds (must cover the longest release). */
  dur: number;
  /** Peak level the rendered buffer is normalised to. */
  vol?: number;
  /** Apply the default ±5% random pitch. Off for musical stingers that sit on top of the music. */
  vary?: boolean;
  /** Reverb wet level baked into the buffer. */
  reverb?: number;
  render(c: BaseAudioContext, out: AudioNode): void;
}

const f = (name: string) => midiToFreq(n(name));
const { bell } = INSTRUMENTS;

function bellAt(c: BaseAudioContext, out: AudioNode, note: string, t: number, vel: number) {
  bell(c, out, t, n(note), 0.5, vel);
}

function pulseNote(c: BaseAudioContext, out: AudioNode, note: string, t: number, gate: number, peak = 0.45, vib = false) {
  tone(c, out, {
    wave: 'pulse25',
    f: f(note),
    t,
    peak,
    a: 0.003,
    d: 0.08,
    sus: 0.7,
    gate,
    rel: 0.06,
    filter: { type: 'lowpass', f: 5000 },
    vibrato: vib ? { rate: 6, depth: f(note) * 0.012, delay: 0.08 } : undefined,
  });
}

function shimmer(c: BaseAudioContext, out: AudioNode, seed: number, t0: number, span: number, count: number, peak: number) {
  const rnd = mulberry32(seed);
  for (let i = 0; i < count; i++) {
    tone(c, out, { wave: 'sine', f: 2800 + rnd() * 2600, t: t0 + rnd() * span, peak, a: 0.001, tau: 0.025 });
  }
}

export const SFX: Record<SfxName, SfxDef> = {
  jump: {
    dur: 0.25,
    vol: 0.55,
    render(c, out) {
      tone(c, out, { wave: 'pulse25', f: 330, glide: [[0.11, 900]], peak: 0.5, a: 0.002, d: 0.05, sus: 0.8, gate: 0.09, rel: 0.04 });
      tone(c, out, { wave: 'triangle', f: 660, glide: [[0.11, 1800]], peak: 0.15, a: 0.002, tau: 0.04 });
    },
  },
  land: {
    dur: 0.3,
    vol: 0.5,
    render(c, out) {
      tone(c, out, { wave: 'sine', f: 180, glide: [[0.08, 55]], peak: 0.8, a: 0.002, tau: 0.045 });
      noise(c, out, { peak: 0.35, tau: 0.025, filter: { type: 'lowpass', f: 500 } });
    },
  },
  meow: {
    // Kitten "mi-a-ow": pitch dips, rises, falls; formants open then close.
    dur: 0.85,
    vol: 0.7,
    reverb: 0.12,
    render(c, out) {
      const end = 0.62;
      const env = c.createGain();
      env.gain.setValueAtTime(0, 0);
      env.gain.linearRampToValueAtTime(0.9, 0.05);
      env.gain.setTargetAtTime(0.75, 0.05, 0.1);
      env.gain.setTargetAtTime(0, 0.48, 0.045);

      const mouth = c.createBiquadFilter();
      mouth.type = 'lowpass';
      mouth.frequency.setValueAtTime(700, 0);
      mouth.frequency.exponentialRampToValueAtTime(5200, 0.16);
      mouth.frequency.exponentialRampToValueAtTime(1400, end);

      const f1 = c.createBiquadFilter();
      f1.type = 'bandpass';
      f1.Q.setValueAtTime(4, 0);
      f1.frequency.setValueAtTime(750, 0);
      f1.frequency.linearRampToValueAtTime(1150, 0.2);
      f1.frequency.linearRampToValueAtTime(650, end);
      const f2 = c.createBiquadFilter();
      f2.type = 'bandpass';
      f2.Q.setValueAtTime(6, 0);
      f2.frequency.setValueAtTime(1900, 0);
      f2.frequency.linearRampToValueAtTime(2500, 0.15);
      f2.frequency.linearRampToValueAtTime(1300, end);
      const g1 = c.createGain();
      g1.gain.setValueAtTime(1, 0);
      const g2 = c.createGain();
      g2.gain.setValueAtTime(0.55, 0);
      f1.connect(g1).connect(mouth);
      f2.connect(g2).connect(mouth);

      const body = c.createGain();
      body.gain.setValueAtTime(0.18, 0);
      body.connect(mouth);
      mouth.connect(env).connect(out);

      const lfo = c.createOscillator();
      lfo.frequency.setValueAtTime(7, 0);
      const vib = c.createGain();
      vib.gain.setValueAtTime(0, 0);
      vib.gain.setValueAtTime(0, 0.2);
      vib.gain.linearRampToValueAtTime(18, 0.35);
      lfo.connect(vib);

      const pitch = (p: AudioParam) => {
        p.setValueAtTime(640, 0);
        p.linearRampToValueAtTime(570, 0.06);
        p.exponentialRampToValueAtTime(940, 0.26);
        p.exponentialRampToValueAtTime(520, end);
      };
      const voices: Array<[OscillatorType, number, AudioNode[]]> = [
        ['sawtooth', 0, [f1, f2]],
        ['sawtooth', 9, [f1, f2]],
        ['sine', 0, [body]],
      ];
      for (const [type, cents, dests] of voices) {
        const o = c.createOscillator();
        o.type = type;
        pitch(o.frequency);
        o.detune.setValueAtTime(cents, 0);
        vib.connect(o.frequency);
        for (const d of dests) o.connect(d);
        o.start(0);
        o.stop(0.8);
      }
      lfo.start(0);
      lfo.stop(0.8);
    },
  },
  squeak: {
    dur: 0.3,
    vol: 0.45,
    render(c, out) {
      const chirps: Array<[number, number, number]> = [
        [0, 2600, 3600],
        [0.07, 2700, 3700],
        [0.14, 3000, 4300],
      ];
      for (const [t, a, b] of chirps) {
        tone(c, out, { wave: 'sine', f: a, glide: [[0.04, b]], t, peak: 0.5, a: 0.003, tau: 0.018 });
        tone(c, out, { wave: 'triangle', f: a, glide: [[0.04, b]], t, peak: 0.12, a: 0.003, tau: 0.012 });
      }
    },
  },
  catch: {
    dur: 0.9,
    vol: 0.6,
    reverb: 0.2,
    render(c, out) {
      ['C6', 'E6', 'G6', 'C7'].forEach((note, i) => {
        bellAt(c, out, note, i * 0.045, 0.4);
        tone(c, out, { wave: 'pulse12', f: f(note), t: i * 0.045, peak: 0.1, a: 0.002, tau: 0.03 });
      });
    },
  },
  combo: {
    dur: 0.55,
    vol: 0.55,
    reverb: 0.15,
    render(c, out) {
      tone(c, out, { wave: 'pulse25', f: f('E6'), t: 0, peak: 0.35, a: 0.002, tau: 0.035 });
      tone(c, out, { wave: 'pulse25', f: f('B6'), t: 0.05, peak: 0.35, a: 0.002, tau: 0.06 });
      bellAt(c, out, 'B6', 0.05, 0.35);
    },
  },
  splash: {
    dur: 0.8,
    vol: 0.6,
    render(c, out) {
      noise(c, out, { peak: 0.7, a: 0.004, tau: 0.12, filter: { type: 'bandpass', f: 2600, q: 0.8, glide: [[0.35, 500]] } });
      noise(c, out, { peak: 0.4, a: 0.01, tau: 0.18, filter: { type: 'lowpass', f: 900 } });
      const rnd = mulberry32(7);
      for (let i = 0; i < 6; i++) {
        const fr = 400 + rnd() * 700;
        tone(c, out, { wave: 'sine', f: fr, glide: [[0.05, fr * 1.8]], t: 0.05 + rnd() * 0.35, peak: 0.25, a: 0.003, tau: 0.03 });
      }
    },
  },
  bark: {
    dur: 0.55,
    vol: 0.7,
    render(c, out) {
      for (const [t, k] of [[0, 1], [0.2, 0.9]] as const) {
        tone(c, out, {
          wave: 'sawtooth',
          f: 380 * k,
          glide: [[0.025, 500 * k], [0.12, 200 * k]],
          t,
          peak: 0.6,
          a: 0.004,
          d: 0.05,
          sus: 0.8,
          gate: 0.09,
          rel: 0.03,
          filter: { type: 'lowpass', f: 1700, q: 3 },
        });
        tone(c, out, { wave: 'square', f: 190 * k, glide: [[0.12, 100 * k]], t, peak: 0.2, a: 0.004, tau: 0.04 });
        noise(c, out, { t, peak: 0.35, tau: 0.035, filter: { type: 'bandpass', f: 1000, q: 1 } });
      }
    },
  },
  growl: {
    dur: 1.1,
    vol: 0.6,
    render(c, out) {
      const trem = c.createGain();
      trem.gain.setValueAtTime(0.6, 0);
      const lfo = c.createOscillator();
      lfo.frequency.setValueAtTime(24, 0);
      const depth = c.createGain();
      depth.gain.setValueAtTime(0.4, 0);
      lfo.connect(depth).connect(trem.gain);
      lfo.start(0);
      lfo.stop(1.1);
      trem.connect(out);
      tone(c, trem, {
        wave: 'sawtooth',
        f: 70,
        glide: [[0.3, 86], [0.85, 64]],
        peak: 0.7,
        a: 0.06,
        d: 0.1,
        sus: 0.9,
        gate: 0.75,
        rel: 0.1,
        filter: { type: 'lowpass', f: 420, q: 4 },
      });
      noise(c, trem, { peak: 0.45, a: 0.06, gate: 0.75, rel: 0.1, filter: { type: 'lowpass', f: 380 } });
    },
  },
  sweep: {
    dur: 0.5,
    vol: 0.5,
    render(c, out) {
      noise(c, out, { peak: 0.6, a: 0.03, gate: 0.3, rel: 0.06, filter: { type: 'bandpass', f: 500, q: 2, glide: [[0.15, 3000], [0.35, 800]] } });
    },
  },
  windowOpen: {
    dur: 1.0,
    vol: 0.55,
    reverb: 0.2,
    render(c, out) {
      noise(c, out, { peak: 0.25, a: 0.02, gate: 0.18, rel: 0.04, filter: { type: 'lowpass', f: 1200 } });
      tone(c, out, { wave: 'triangle', f: 300, glide: [[0.18, 700]], peak: 0.25, a: 0.01, d: 0.05, sus: 0.8, gate: 0.18, rel: 0.04 });
      bellAt(c, out, 'G6', 0.2, 0.4);
      bellAt(c, out, 'C7', 0.27, 0.4);
    },
  },
  enterRoom: {
    dur: 0.9,
    vol: 0.6,
    vary: false,
    reverb: 0.25,
    render(c, out) {
      ['C5', 'E5', 'G5', 'C6', 'E6'].forEach((note, i) => {
        tone(c, out, { wave: 'pulse25', f: f(note), t: i * 0.04, peak: 0.35, a: 0.002, tau: 0.05 });
      });
      noise(c, out, { peak: 0.2, a: 0.1, gate: 0.2, rel: 0.06, filter: { type: 'highpass', f: 1500, glide: [[0.25, 6000]] } });
      bellAt(c, out, 'G6', 0.22, 0.4);
    },
  },
  hit: {
    dur: 0.35,
    vol: 0.65,
    render(c, out) {
      tone(c, out, { wave: 'square', f: 300, glide: [[0.12, 70]], peak: 0.5, a: 0.002, tau: 0.06, filter: { type: 'lowpass', f: 3000 } });
      noise(c, out, { peak: 0.6, tau: 0.035, filter: { type: 'lowpass', f: 2500 } });
      tone(c, out, { wave: 'sine', f: 90, peak: 0.5, a: 0.002, tau: 0.07 });
    },
  },
  thud: {
    dur: 0.45,
    vol: 0.65,
    render(c, out) {
      tone(c, out, { wave: 'sine', f: 130, glide: [[0.18, 38]], peak: 0.9, a: 0.002, tau: 0.09 });
      noise(c, out, { peak: 0.5, tau: 0.05, filter: { type: 'lowpass', f: 300 } });
    },
  },
  throw: {
    dur: 0.35,
    vol: 0.5,
    render(c, out) {
      noise(c, out, { peak: 0.5, a: 0.03, gate: 0.12, rel: 0.06, filter: { type: 'bandpass', f: 900, q: 1.5, glide: [[0.18, 3500]] } });
      tone(c, out, { wave: 'triangle', f: 500, glide: [[0.1, 900]], peak: 0.2, a: 0.004, tau: 0.05 });
    },
  },
  heart: {
    dur: 1.0,
    vol: 0.6,
    reverb: 0.25,
    render(c, out) {
      ['G5', 'B5', 'D6', 'G6'].forEach((note, i) => bellAt(c, out, note, i * 0.05, 0.4));
      shimmer(c, out, 11, 0.1, 0.4, 8, 0.08);
    },
  },
  heartBreak: {
    dur: 1.0,
    vol: 0.6,
    vary: false,
    render(c, out) {
      noise(c, out, { peak: 0.6, tau: 0.02, filter: { type: 'highpass', f: 2000 } });
      tone(c, out, { wave: 'pulse25', f: 990, glide: [[0.1, 900]], t: 0.05, peak: 0.4, a: 0.003, d: 0.05, sus: 0.7, gate: 0.1, rel: 0.04 });
      tone(c, out, { wave: 'pulse25', f: 700, glide: [[0.1, 620]], t: 0.19, peak: 0.4, a: 0.003, d: 0.05, sus: 0.7, gate: 0.1, rel: 0.04 });
      tone(c, out, {
        wave: 'pulse25',
        f: 494,
        glide: [[0.3, 420]],
        t: 0.33,
        peak: 0.4,
        a: 0.003,
        d: 0.08,
        sus: 0.7,
        gate: 0.3,
        rel: 0.08,
        vibrato: { rate: 7, depth: 12, delay: 0.05 },
      });
    },
  },
  kiss: {
    dur: 0.7,
    vol: 0.6,
    reverb: 0.15,
    render(c, out) {
      // "mw-" swell, then the "-ah" pop and a sparkle.
      tone(c, out, {
        wave: 'triangle',
        f: 500,
        glide: [[0.09, 1400]],
        peak: 0.45,
        a: 0.02,
        d: 0.03,
        sus: 0.9,
        gate: 0.09,
        rel: 0.03,
        filter: { type: 'lowpass', f: 800, to: 3500, toAt: 0.09 },
      });
      tone(c, out, { wave: 'sine', f: 1800, glide: [[0.03, 600]], t: 0.12, peak: 0.7, a: 0.001, tau: 0.015 });
      noise(c, out, { t: 0.12, peak: 0.4, tau: 0.006, filter: { type: 'bandpass', f: 2500, q: 1 } });
      bellAt(c, out, 'E7', 0.17, 0.22);
    },
  },
  lifeUp: {
    dur: 1.1,
    vol: 0.65,
    vary: false,
    reverb: 0.2,
    render(c, out) {
      ['G5', 'C6', 'E6', 'G6'].forEach((note, i) => pulseNote(c, out, note, i * 0.08, 0.07));
      pulseNote(c, out, 'C7', 0.32, 0.38, 0.45, true);
      pulseNote(c, out, 'E6', 0.32, 0.38, 0.22);
      tone(c, out, { wave: 'triangle', f: f('C4'), t: 0.32, peak: 0.4, a: 0.004, d: 0.1, sus: 0.7, gate: 0.38, rel: 0.08 });
      bellAt(c, out, 'C7', 0.32, 0.25);
    },
  },
  lifeLost: {
    dur: 1.3,
    vol: 0.6,
    vary: false,
    render(c, out) {
      tone(c, out, {
        wave: 'pulse25',
        f: 784,
        glide: [[0.5, 196]],
        peak: 0.45,
        a: 0.003,
        d: 0.1,
        sus: 0.8,
        gate: 0.5,
        rel: 0.05,
        vibrato: { rate: 9, depth: 30 },
      });
      pulseNote(c, out, 'E4', 0.6, 0.12, 0.4);
      pulseNote(c, out, 'C4', 0.78, 0.25, 0.4);
      tone(c, out, { wave: 'triangle', f: f('C3'), t: 0.78, peak: 0.4, a: 0.004, d: 0.1, sus: 0.7, gate: 0.25, rel: 0.08 });
    },
  },
  uiSelect: {
    dur: 0.2,
    vol: 0.4,
    render(c, out) {
      tone(c, out, { wave: 'pulse25', f: 1320, peak: 0.4, a: 0.002, tau: 0.025 });
      tone(c, out, { wave: 'pulse25', f: 1760, t: 0.035, peak: 0.4, a: 0.002, tau: 0.035 });
    },
  },
  uiStart: {
    dur: 1.0,
    vol: 0.6,
    vary: false,
    reverb: 0.2,
    render(c, out) {
      (['C6', 'G6', 'C7'] as const).forEach((note, i) => {
        pulseNote(c, out, note, i * 0.06, i === 2 ? 0.2 : 0.05, 0.35);
        bellAt(c, out, note, i * 0.06, 0.3);
      });
    },
  },
  bubble: {
    dur: 0.3,
    vol: 0.5,
    render(c, out) {
      tone(c, out, { wave: 'sine', f: 350, glide: [[0.07, 1100]], peak: 0.7, a: 0.003, tau: 0.03 });
      tone(c, out, { wave: 'sine', f: 500, glide: [[0.06, 1400]], t: 0.09, peak: 0.4, a: 0.003, tau: 0.025 });
    },
  },
  zap: {
    dur: 0.45,
    vol: 0.5,
    render(c, out) {
      // Ring modulation: a sawtooth through a gain whose gain *is* a falling sine.
      const ring = c.createGain();
      ring.gain.setValueAtTime(0, 0);
      const mod = c.createOscillator();
      mod.frequency.setValueAtTime(1400, 0);
      mod.frequency.exponentialRampToValueAtTime(300, 0.3);
      mod.connect(ring.gain);
      const car = c.createOscillator();
      car.type = 'sawtooth';
      car.frequency.setValueAtTime(140, 0);
      const env = c.createGain();
      env.gain.setValueAtTime(0, 0);
      env.gain.linearRampToValueAtTime(0.6, 0.005);
      env.gain.setTargetAtTime(0.4, 0.005, 0.05);
      env.gain.setTargetAtTime(0, 0.28, 0.03);
      car.connect(ring).connect(env).connect(out);
      car.start(0);
      mod.start(0);
      car.stop(0.45);
      mod.stop(0.45);
      tone(c, out, { wave: 'square', f: 880, glide: [[0.3, 110]], peak: 0.15, a: 0.002, d: 0.05, sus: 0.8, gate: 0.28, rel: 0.04 });
    },
  },
  eat: {
    dur: 0.4,
    vol: 0.5,
    render(c, out) {
      for (const t of [0, 0.14]) {
        noise(c, out, { t, peak: 0.5, tau: 0.03, filter: { type: 'lowpass', f: 1800 } });
        tone(c, out, { wave: 'square', f: 260, glide: [[0.06, 140]], t, peak: 0.35, a: 0.002, tau: 0.035, filter: { type: 'lowpass', f: 1500 } });
      }
    },
  },
  tweet: {
    dur: 0.3,
    vol: 0.45,
    render(c, out) {
      for (const t of [0, 0.12]) {
        tone(c, out, {
          wave: 'sine',
          f: 3200,
          glide: [[0.03, 4600], [0.08, 3400]],
          t,
          peak: 0.5,
          a: 0.004,
          d: 0.02,
          sus: 0.9,
          gate: 0.07,
          rel: 0.02,
          vibrato: { rate: 40, depth: 300 },
        });
      }
    },
  },
  collect: {
    dur: 0.6,
    vol: 0.55,
    reverb: 0.15,
    render(c, out) {
      tone(c, out, { wave: 'pulse25', f: f('B5'), peak: 0.4, a: 0.002, tau: 0.035 });
      tone(c, out, { wave: 'pulse25', f: f('E6'), t: 0.07, peak: 0.4, a: 0.002, d: 0.05, sus: 0.6, gate: 0.16, rel: 0.08 });
      bellAt(c, out, 'E7', 0.07, 0.2);
    },
  },
  roomClear: {
    dur: 1.7,
    vol: 0.7,
    vary: false,
    reverb: 0.25,
    render(c, out) {
      ['C5', 'E5', 'G5'].forEach((note, i) => pulseNote(c, out, note, i * 0.09, 0.08));
      pulseNote(c, out, 'C6', 0.27, 0.18);
      pulseNote(c, out, 'G5', 0.5, 0.08);
      pulseNote(c, out, 'C6', 0.6, 0.55, 0.45, true);
      pulseNote(c, out, 'E5', 0.6, 0.55, 0.2);
      pulseNote(c, out, 'G5', 0.6, 0.55, 0.2);
      for (const t of [0.27, 0.6]) {
        tone(c, out, { wave: 'triangle', f: f('C3'), t, peak: 0.5, a: 0.004, d: 0.1, sus: 0.7, gate: t === 0.6 ? 0.55 : 0.18, rel: 0.08 });
      }
      bellAt(c, out, 'C7', 0.6, 0.3);
      bellAt(c, out, 'G7', 0.68, 0.15);
    },
  },
  gameOver: {
    dur: 1.6,
    vol: 0.6,
    vary: false,
    render(c, out) {
      pulseNote(c, out, 'G5', 0, 0.15);
      pulseNote(c, out, 'E5', 0.2, 0.15);
      pulseNote(c, out, 'C5', 0.4, 0.15);
      tone(c, out, {
        wave: 'pulse25',
        f: f('G4'),
        glide: [[0.6, f('C4')]],
        t: 0.6,
        peak: 0.45,
        a: 0.003,
        d: 0.1,
        sus: 0.8,
        gate: 0.6,
        rel: 0.1,
        vibrato: { rate: 6, depth: 6, delay: 0.1 },
      });
      tone(c, out, { wave: 'triangle', f: f('C3'), t: 0.6, peak: 0.4, a: 0.004, d: 0.2, sus: 0.6, gate: 0.6, rel: 0.1 });
    },
  },
  fall: {
    dur: 1.15,
    vol: 0.5,
    render(c, out) {
      const common = { glide: [[0.9, 180]] as Array<[number, number]>, a: 0.01, d: 0.1, sus: 0.9, gate: 0.9, rel: 0.08 };
      tone(c, out, { ...common, wave: 'sine', f: 1400, peak: 0.45, vibrato: { rate: 7, depth: 25 } });
      tone(c, out, { ...common, wave: 'triangle', f: 1400, peak: 0.12, detune: 12 });
    },
  },
  snore: {
    dur: 1.9,
    vol: 0.45,
    render(c, out) {
      noise(c, out, { peak: 0.3, a: 0.5, gate: 0.6, rel: 0.2, filter: { type: 'bandpass', f: 600, q: 2, glide: [[0.6, 900]] } });
      tone(c, out, { wave: 'sawtooth', f: 90, glide: [[0.6, 80]], peak: 0.3, a: 0.4, d: 0.1, sus: 1, gate: 0.6, rel: 0.2, filter: { type: 'lowpass', f: 300, q: 3 } });
      noise(c, out, { t: 0.9, peak: 0.25, a: 0.1, gate: 0.5, rel: 0.3, filter: { type: 'lowpass', f: 1200, glide: [[0.6, 500]] } });
      tone(c, out, { wave: 'sine', f: 1200, glide: [[0.5, 900]], t: 0.9, peak: 0.08, a: 0.1, d: 0.1, sus: 1, gate: 0.5, rel: 0.2 });
    },
  },
  push: {
    dur: 0.35,
    vol: 0.55,
    render(c, out) {
      noise(c, out, { peak: 0.7, a: 0.02, gate: 0.2, rel: 0.05, filter: { type: 'bandpass', f: 350, q: 3 } });
      tone(c, out, { wave: 'square', f: 80, glide: [[0.2, 70]], peak: 0.3, a: 0.01, d: 0.05, sus: 0.8, gate: 0.2, rel: 0.05, filter: { type: 'lowpass', f: 400 } });
    },
  },
  gift: {
    dur: 1.3,
    vol: 0.6,
    vary: false,
    reverb: 0.3,
    render(c, out) {
      ['C6', 'D6', 'E6', 'G6', 'A6', 'C7'].forEach((note, i) => bellAt(c, out, note, i * 0.035, 0.32));
      shimmer(c, out, 23, 0.15, 0.6, 12, 0.07);
    },
  },
  gulp: {
    dur: 0.35,
    vol: 0.5,
    render(c, out) {
      tone(c, out, { wave: 'sine', f: 700, glide: [[0.1, 180]], peak: 0.6, a: 0.003, tau: 0.045 });
      tone(c, out, { wave: 'sine', f: 500, glide: [[0.08, 150]], t: 0.12, peak: 0.5, a: 0.003, tau: 0.035 });
      noise(c, out, { peak: 0.25, tau: 0.015, filter: { type: 'lowpass', f: 600 } });
    },
  },
  tick: {
    dur: 0.08,
    vol: 0.4,
    vary: false,
    render(c, out) {
      tone(c, out, { wave: 'sine', f: 2000, peak: 0.6, a: 0.001, tau: 0.006 });
      tone(c, out, { wave: 'triangle', f: 1000, peak: 0.3, a: 0.001, tau: 0.004 });
      noise(c, out, { peak: 0.3, tau: 0.002, filter: { type: 'highpass', f: 4000 } });
    },
  },
};

export const SFX_NAMES = Object.keys(SFX) as SfxName[];

/** Render one SFX to a normalised mono buffer at the given sample rate. */
export async function renderSfx(def: SfxDef, sampleRate: number): Promise<AudioBuffer> {
  const length = Math.ceil((def.dur + (def.reverb ? 0.6 : 0)) * sampleRate);
  const oc = new OfflineAudioContext(1, length, sampleRate);
  const dry = oc.createGain();
  dry.connect(oc.destination);
  if (def.reverb) {
    const conv = oc.createConvolver();
    conv.buffer = makeImpulse(oc, 0.8, 3, 1);
    const wet = oc.createGain();
    wet.gain.setValueAtTime(def.reverb, 0);
    dry.connect(conv).connect(wet).connect(oc.destination);
  }
  def.render(oc, dry);
  const buf = await oc.startRendering();
  const data = buf.getChannelData(0);
  let peak = 0;
  for (let i = 0; i < data.length; i++) {
    const v = Math.abs(data[i]);
    if (v > peak) peak = v;
  }
  const scale = peak > 0 && Number.isFinite(peak) ? (def.vol ?? 0.7) / peak : 0;
  // Normalise and force a 5 ms fade-out so a truncated tail can never click.
  const fade = Math.min(data.length, Math.floor(sampleRate * 0.005));
  for (let i = 0; i < data.length; i++) {
    const tail = data.length - i;
    data[i] *= scale * (tail < fade ? tail / fade : 1);
  }
  return buf;
}
