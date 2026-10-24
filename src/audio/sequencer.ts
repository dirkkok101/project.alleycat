// Look-ahead music player ("a tale of two clocks"): a JS timer wakes every
// ~25 ms and schedules every step that falls inside the look-ahead window on
// the AudioContext clock, so timing is sample-accurate regardless of jank.

import { INSTRUMENTS, drum } from './instruments';
import type { MusicTrack, PartDef, TrackDef } from './music';
import { type Chord, type PatternEvent, chordAt, chordTone, parseChordLine, parsePattern, swingOffset } from './pattern';

export interface MusicBuses {
  /** Dry music input (pre duck / volume). */
  out: AudioNode;
  reverb: AudioNode;
  delay: AudioNode;
}

/** Shared voice budget across all players. */
export class VoicePool {
  private ends: number[] = [];
  constructor(readonly max: number) {}
  /** Returns false when the pool is full at time `now`. */
  available(now: number): boolean {
    if (this.ends.length >= this.max) this.ends = this.ends.filter((e) => e > now);
    return this.ends.length < this.max;
  }
  add(end: number) {
    this.ends.push(end);
  }
}

interface CompiledPart {
  def: PartDef;
  /** Events bucketed by step within the part's own loop. */
  byStep: Map<number, PatternEvent[]>;
  loopSteps: number;
  input: GainNode;
  nodes: AudioNode[];
}

/** Generic tension stem from the chord chart: pulsing saw bass + driving kick + offbeat hats. */
function dangerParts(track: TrackDef): PartDef[] {
  if (track.stepsPerBar === 6) {
    return [
      { inst: 'dangerBass', pattern: '0 0 0 0 0 0', oct: 2, vol: 0.16 },
      { inst: 'drums', pattern: 'k..k..', vol: 0.3 },
      { inst: 'drums', pattern: 't.....|...t..', vol: 0.12 },
    ];
  }
  return [
    { inst: 'dangerBass', pattern: '0 0 0 0 0 0 0 0', res: 2, oct: 2, vol: 0.16 },
    { inst: 'drums', pattern: 'k...k...k...k...', vol: 0.28 },
    { inst: 'drums', pattern: '..o...o...o...o.', vol: 0.05, pan: -0.2 },
    { inst: 'drums', pattern: '.|.|.|............t.t.', vol: 0.12 },
  ];
}

export class Player {
  readonly output: GainNode;
  private readonly dangerGain: GainNode;
  private readonly parts: CompiledPart[] = [];
  private readonly chords: Chord[][];
  private readonly totalSteps: number;
  private readonly baseStepDur: number;
  private stepDur: number;
  private step = 0;
  private nextTime: number;
  /** No steps are scheduled at or after this time (set by fadeOut / end of a one-shot). */
  stopAt = Infinity;
  /** Time after which the player can be disposed. */
  disposeAt = Infinity;

  constructor(
    readonly name: MusicTrack,
    private readonly ctx: AudioContext,
    private readonly track: TrackDef,
    buses: MusicBuses,
    private readonly voices: VoicePool,
    private readonly tempoMul: () => number,
    danger: boolean,
    startAt: number,
  ) {
    this.chords = parseChordLine(track.chords);
    this.totalSteps = this.chords.length * track.stepsPerBar;
    this.baseStepDur = 60 / track.bpm / track.stepsPerBeat;
    this.stepDur = this.baseStepDur / tempoMul();
    this.nextTime = startAt;

    this.output = ctx.createGain();
    this.output.connect(buses.out);
    this.dangerGain = ctx.createGain();
    this.dangerGain.gain.setValueAtTime(danger ? 1 : 0, ctx.currentTime);
    this.dangerGain.connect(this.output);

    const build = (def: PartDef, dest: AudioNode) => {
      const pat = parsePattern(def.pattern, track.stepsPerBar, def.res ?? 1);
      const byStep = new Map<number, PatternEvent[]>();
      for (const ev of pat.events) {
        const list = byStep.get(ev.step) ?? [];
        list.push(ev);
        byStep.set(ev.step, list);
      }
      const input = ctx.createGain();
      input.gain.setValueAtTime(def.vol, ctx.currentTime);
      const nodes: AudioNode[] = [input];
      let tail: AudioNode = input;
      if (def.pan) {
        const p = ctx.createStereoPanner();
        p.pan.setValueAtTime(def.pan, ctx.currentTime);
        input.connect(p);
        nodes.push(p);
        tail = p;
      }
      tail.connect(dest);
      for (const [amt, bus] of [
        [def.rev, buses.reverb],
        [def.dly, buses.delay],
      ] as const) {
        if (!amt) continue;
        const send = ctx.createGain();
        send.gain.setValueAtTime(amt, ctx.currentTime);
        tail.connect(send).connect(bus);
        nodes.push(send);
      }
      this.parts.push({ def, byStep, loopSteps: pat.bars * track.stepsPerBar, input, nodes });
    };
    for (const def of track.parts) build(def, this.output);
    if (track.loop) for (const def of dangerParts(track)) build(def, this.dangerGain);
  }

  get stepDuration(): number {
    return this.stepDur;
  }

  setDanger(on: boolean) {
    const now = this.ctx.currentTime;
    this.dangerGain.gain.cancelScheduledValues(now);
    this.dangerGain.gain.setValueAtTime(this.dangerGain.gain.value, now);
    this.dangerGain.gain.setTargetAtTime(on ? 1 : 0, now, on ? 0.25 : 0.4);
  }

  fadeIn(ms: number) {
    const t = this.nextTime;
    this.output.gain.setValueAtTime(0, t);
    this.output.gain.linearRampToValueAtTime(1, t + Math.max(0.01, ms / 1000));
  }

  fadeOut(ms: number) {
    const now = this.ctx.currentTime;
    const end = now + Math.max(0.01, ms / 1000);
    const g = this.output.gain;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(0, end);
    this.stopAt = Math.min(this.stopAt, end);
    this.disposeAt = end + 0.5;
  }

  /** Schedule all steps that start before `until`. */
  schedule(until: number) {
    const now = this.ctx.currentTime;
    // Fell behind (e.g. tab throttled): skip ahead rather than bursting notes.
    if (this.nextTime < now - 0.05) this.nextTime = now + 0.02;
    while (this.nextTime < until && this.nextTime < this.stopAt) {
      const stepInBar = this.step % this.track.stepsPerBar;
      if (stepInBar === 0) this.stepDur = this.baseStepDur / this.tempoMul();
      if (!this.track.loop && this.step >= this.totalSteps) {
        this.stopAt = this.nextTime;
        this.disposeAt = this.nextTime + 3;
        break;
      }
      this.scheduleStep(this.step, this.nextTime);
      this.nextTime += this.stepDur;
      this.step++;
    }
  }

  private scheduleStep(step: number, time: number) {
    const { track } = this;
    const swing = swingOffset(step % track.stepsPerBar, track.swingUnit ?? 1, track.swing ?? 0);
    const t = time + swing * this.stepDur;
    const songStep = step % this.totalSteps;
    const bar = Math.floor(songStep / track.stepsPerBar);
    const stepInBar = songStep % track.stepsPerBar;
    for (const part of this.parts) {
      const events = part.byStep.get(step % part.loopSteps);
      if (!events) continue;
      for (const ev of events) {
        if (!this.voices.available(this.ctx.currentTime)) return;
        const dur = ev.len * this.stepDur;
        const def = part.def;
        const tok = ev.token;
        if (def.inst === 'drums') {
          if (tok.kind === 'hit') this.voices.add(drum(this.ctx, part.input, t, tok.ch, 1));
          continue;
        }
        const voice = INSTRUMENTS[def.inst];
        const chord = chordAt(this.chords, bar, stepInBar, track.stepsPerBar);
        const oct = def.oct ?? 4;
        const tr = def.transpose ?? 0;
        if (tok.kind === 'note') {
          this.voices.add(voice(this.ctx, part.input, t, tok.midi + tr, dur, 1));
        } else if (tok.kind === 'degree') {
          this.voices.add(voice(this.ctx, part.input, t, chordTone(chord, tok.index, oct) + tr, dur, 1));
        } else if (tok.kind === 'chord') {
          for (let i = 0; i < chord.intervals.length; i++) {
            this.voices.add(voice(this.ctx, part.input, t, chordTone(chord, i, oct) + tr, dur, 1));
          }
        }
      }
    }
  }

  dispose() {
    this.output.disconnect();
    this.dangerGain.disconnect();
    for (const p of this.parts) for (const n of p.nodes) n.disconnect();
  }
}
