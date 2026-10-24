// AudioEngine: one AudioContext, a small mixing graph, pre-rendered SFX and
// the look-ahead music scheduler.
//
// Graph:
//   music players ─┬─────────────► musicIn ─► duck ─► musicVol ─┐
//                  ├─► reverbSend ─► convolver ──► musicIn       ├─► master(mute) ─► compressor ─► limiter ─► trim ─► analyser ─► out
//                  └─► delaySend ─► delay ⟲ lp ──► musicIn       │
//   sfx voices ─► (pan) ─► sfxVol ───────────────────────────────┘

import { makeImpulse } from './instruments';
import { TRACKS, type MusicTrack } from './music';
import { Player, VoicePool } from './sequencer';
import { SFX, SFX_NAMES, type SfxName, renderSfx } from './sfx';

export interface PlayOpts {
  pitch?: number;
  volume?: number;
  pan?: number;
}

const MUTE_KEY = 'alleycat.muted';
const MUSIC_BASE = 0.6;
const SFX_BASE = 0.8;
const DUCK_GAIN = 0.4; // ≈ -8 dB
const HURRY_MUL = 1.12;
const MAX_MUSIC_VOICES = 48;
const MAX_SFX_VOICES = 12;
const MAX_SFX_PER_NAME = 4;
const TICK_MS = 25;

interface Graph {
  ctx: AudioContext;
  master: GainNode;
  musicIn: GainNode;
  duck: GainNode;
  musicVol: GainNode;
  sfxVol: GainNode;
  reverbSend: GainNode;
  delaySend: GainNode;
  delay: DelayNode;
  analyser: AnalyserNode;
}

interface SfxVoice {
  name: SfxName;
  src: AudioBufferSourceNode;
  gain: GainNode;
}

type NavigatorWithSession = Navigator & { audioSession?: { type: string } };

function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

export class AudioEngine {
  private static instance: AudioEngine | null = null;

  static get(): AudioEngine {
    return (AudioEngine.instance ??= new AudioEngine());
  }

  private g: Graph | null = null;
  private unlockPromise: Promise<void> | null = null;
  private running = false;
  private buffers = new Map<SfxName, AudioBuffer>();
  private sfxVoices: SfxVoice[] = [];
  private players: Player[] = [];
  private current: Player | null = null;
  private pendingTrack: { track: MusicTrack; fadeMs: number } | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private lookahead = 0.12;
  private musicPool = new VoicePool(MAX_MUSIC_VOICES);
  private danger = false;
  private hurry = false;
  private _muted = readMuted();
  private musicVolume = 1;
  private sfxVolume = 1;

  private constructor() {
    if (typeof document !== 'undefined') {
      // Background tabs throttle timers to >=1 s; widen the window so music doesn't gap.
      document.addEventListener('visibilitychange', () => {
        this.lookahead = document.hidden ? 1.5 : 0.12;
        // The game loop pauses in a hidden tab, so the music should too.
        const ctx = this.g?.ctx;
        if (!ctx) return;
        if (document.hidden && ctx.state === 'running') void ctx.suspend();
        else if (!document.hidden && ctx.state === 'suspended') void ctx.resume();
      });
    }
  }

  get muted(): boolean {
    return this._muted;
  }

  set muted(m: boolean) {
    this.setMuted(m);
  }

  /** Master output analyser (for meters / debugging). Null until unlocked. */
  get analyser(): AnalyserNode | null {
    return this.g?.analyser ?? null;
  }

  /** True once the context is running and SFX are rendered. */
  get ready(): boolean {
    return this.running && this.buffers.size === SFX_NAMES.length;
  }

  /** Call from the first user gesture (and again after iOS interruptions). */
  unlock(): Promise<void> {
    try {
      const session = (navigator as NavigatorWithSession).audioSession;
      // iOS 17+: 'playback' makes Web Audio ignore the hardware silent switch.
      if (session) session.type = 'playback';
    } catch {
      /* not supported */
    }
    const g = (this.g ??= this.buildGraph());
    // resume() must be called synchronously inside the gesture handler.
    const resumed = g.ctx.state === 'running' ? Promise.resolve() : g.ctx.resume();
    if (!this.unlockPromise) {
      // Older iOS also needs a buffer started inside the gesture.
      const silent = g.ctx.createBufferSource();
      silent.buffer = g.ctx.createBuffer(1, 1, g.ctx.sampleRate);
      silent.connect(g.ctx.destination);
      silent.start();
      this.unlockPromise = resumed.then(async () => {
        this.running = true;
        this.applyMuted(true);
        if (this.pendingTrack) {
          const { track, fadeMs } = this.pendingTrack;
          this.pendingTrack = null;
          this.playMusic(track, fadeMs);
        }
        await this.renderAll(g.ctx.sampleRate);
      });
      return this.unlockPromise;
    }
    return resumed.then(() => this.unlockPromise ?? undefined);
  }

  play(name: SfxName, opts: PlayOpts = {}): void {
    const g = this.g;
    const buf = this.buffers.get(name);
    if (!g || !buf || this._muted || g.ctx.state !== 'running') return;
    const { ctx } = g;
    const now = ctx.currentTime;
    const def = SFX[name];

    // Voice caps: drop the oldest instance of this sound, then the oldest overall.
    const same = this.sfxVoices.filter((v) => v.name === name);
    if (same.length >= MAX_SFX_PER_NAME) this.killSfx(same[0], now);
    if (this.sfxVoices.length >= MAX_SFX_VOICES) this.killSfx(this.sfxVoices[0], now);

    const src = ctx.createBufferSource();
    src.buffer = buf;
    const rate = opts.pitch ?? (def.vary === false ? 1 : 1 + (Math.random() * 2 - 1) * 0.05);
    src.playbackRate.setValueAtTime(Math.max(0.1, rate), now);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(Math.max(0, opts.volume ?? 1), now);
    src.connect(gain);
    if (opts.pan) {
      const p = ctx.createStereoPanner();
      p.pan.setValueAtTime(Math.max(-1, Math.min(1, opts.pan)), now);
      gain.connect(p).connect(g.sfxVol);
    } else {
      gain.connect(g.sfxVol);
    }
    const voice: SfxVoice = { name, src, gain };
    this.sfxVoices.push(voice);
    src.onended = () => {
      gain.disconnect();
      const i = this.sfxVoices.indexOf(voice);
      if (i >= 0) this.sfxVoices.splice(i, 1);
    };
    src.start(now);
  }

  playMusic(track: MusicTrack, fadeMs = 600): void {
    const g = this.g;
    if (!g || !this.running) {
      this.pendingTrack = { track, fadeMs };
      return;
    }
    if (this.current && this.current.name === track && this.current.stopAt === Infinity) return;
    const { ctx } = g;
    const hadMusic = this.current !== null;
    this.current?.fadeOut(fadeMs);
    const def = TRACKS[track];
    const player = new Player(
      track,
      ctx,
      def,
      { out: g.musicIn, reverb: g.reverbSend, delay: g.delaySend },
      this.musicPool,
      () => (this.hurry ? HURRY_MUL : 1),
      this.danger,
      ctx.currentTime + 0.06,
    );
    if (hadMusic && fadeMs > 0) player.fadeIn(fadeMs * 0.5);
    // Tempo-synced echo; set once per track (moving delayTime mid-note warbles pitch).
    const delayTime = Math.min(1.9, def.delaySteps * (60 / def.bpm / def.stepsPerBeat));
    g.delay.delayTime.setTargetAtTime(delayTime, ctx.currentTime, 0.05);
    this.players.push(player);
    this.current = player;
    this.ensureTimer();
    this.tick();
  }

  stopMusic(fadeMs = 600): void {
    this.pendingTrack = null;
    this.current?.fadeOut(fadeMs);
    this.current = null;
  }

  setLayer(layer: 'danger', on: boolean): void {
    if (layer !== 'danger' || this.danger === on) return;
    this.danger = on;
    for (const p of this.players) p.setDanger(on);
  }

  /** Speeds music up ~12% from the next bar line (also applies to tracks started while on). */
  setHurry(on: boolean): void {
    this.hurry = on;
  }

  duck(ms = 800): void {
    const g = this.g;
    if (!g) return;
    const now = g.ctx.currentTime;
    const p = g.duck.gain;
    p.cancelScheduledValues(now);
    p.setValueAtTime(p.value, now);
    p.setTargetAtTime(DUCK_GAIN, now, 0.02);
    p.setTargetAtTime(1, now + ms / 1000, 0.15);
  }

  setMuted(m: boolean): void {
    this._muted = m;
    try {
      localStorage.setItem(MUTE_KEY, m ? '1' : '0');
    } catch {
      /* storage unavailable (private mode etc.) */
    }
    this.applyMuted(false);
  }

  setMusicVolume(v: number): void {
    this.musicVolume = Math.max(0, Math.min(1, v));
    const g = this.g;
    if (g) g.musicVol.gain.setTargetAtTime(this.musicVolume * MUSIC_BASE, g.ctx.currentTime, 0.05);
  }

  setSfxVolume(v: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, v));
    const g = this.g;
    if (g) g.sfxVol.gain.setTargetAtTime(this.sfxVolume * SFX_BASE, g.ctx.currentTime, 0.05);
  }

  // -------------------------------------------------------------------------

  private applyMuted(immediate: boolean) {
    const g = this.g;
    if (!g) return;
    const now = g.ctx.currentTime;
    const target = this._muted ? 0 : 1;
    g.master.gain.cancelScheduledValues(now);
    if (immediate) g.master.gain.setValueAtTime(target, now);
    else g.master.gain.setTargetAtTime(target, now, 0.03);
  }

  private killSfx(v: SfxVoice, now: number) {
    v.gain.gain.cancelScheduledValues(now);
    v.gain.gain.setValueAtTime(v.gain.gain.value, now);
    v.gain.gain.setTargetAtTime(0, now, 0.008);
    v.src.stop(now + 0.05);
    const i = this.sfxVoices.indexOf(v);
    if (i >= 0) this.sfxVoices.splice(i, 1);
  }

  private async renderAll(sampleRate: number) {
    if (this.buffers.size === SFX_NAMES.length) return;
    const results = await Promise.all(SFX_NAMES.map((n) => renderSfx(SFX[n], sampleRate)));
    SFX_NAMES.forEach((n, i) => this.buffers.set(n, results[i]));
  }

  private ensureTimer() {
    this.timer ??= setInterval(() => this.tick(), TICK_MS);
  }

  private tick() {
    const g = this.g;
    if (!g) return;
    const now = g.ctx.currentTime;
    const until = now + this.lookahead;
    for (const p of this.players) p.schedule(until);
    // One-shot tracks (game over) release "current" when they end so they can replay.
    if (this.current && this.current.stopAt !== Infinity && this.current.stopAt <= now) {
      this.current = null;
    }
    this.players = this.players.filter((p) => {
      if (now < p.disposeAt) return true;
      p.dispose();
      return false;
    });
    if (this.players.length === 0 && this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private buildGraph(): Graph {
    const ctx = new AudioContext({ latencyHint: 'interactive' });
    const t = ctx.currentTime;
    const gain = (v: number) => {
      const n = ctx.createGain();
      n.gain.setValueAtTime(v, t);
      return n;
    };

    const master = gain(this._muted ? 0 : 1);
    // Gentle glue compressor. Chromium adds automatic make-up gain, so keep it mild.
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.setValueAtTime(-10, t);
    comp.knee.setValueAtTime(8, t);
    comp.ratio.setValueAtTime(2.5, t);
    comp.attack.setValueAtTime(0.006, t);
    comp.release.setValueAtTime(0.2, t);
    // Brick-wall-ish limiter.
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.setValueAtTime(-2, t);
    limiter.knee.setValueAtTime(0, t);
    limiter.ratio.setValueAtTime(20, t);
    limiter.attack.setValueAtTime(0.001, t);
    limiter.release.setValueAtTime(0.08, t);
    const trim = gain(0.85);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    master.connect(comp).connect(limiter).connect(trim).connect(analyser).connect(ctx.destination);

    const musicIn = gain(1);
    const duck = gain(1);
    const musicVol = gain(this.musicVolume * MUSIC_BASE);
    musicIn.connect(duck).connect(musicVol).connect(master);
    const sfxVol = gain(this.sfxVolume * SFX_BASE);
    sfxVol.connect(master);

    const reverbSend = gain(1);
    const conv = ctx.createConvolver();
    conv.buffer = makeImpulse(ctx, 2.2, 3.2);
    const reverbReturn = gain(0.7);
    reverbSend.connect(conv).connect(reverbReturn).connect(musicIn);

    const delaySend = gain(1);
    const delay = ctx.createDelay(2);
    delay.delayTime.setValueAtTime(0.35, t);
    const fbFilter = ctx.createBiquadFilter();
    fbFilter.type = 'lowpass';
    fbFilter.frequency.setValueAtTime(2600, t);
    const feedback = gain(0.32);
    const delayReturn = gain(0.5);
    delaySend.connect(delay);
    delay.connect(fbFilter).connect(feedback).connect(delay);
    fbFilter.connect(delayReturn).connect(musicIn);

    return { ctx, master, musicIn, duck, musicVol, sfxVol, reverbSend, delaySend, delay, analyser };
  }
}
