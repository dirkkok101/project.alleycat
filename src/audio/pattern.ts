// Pure music-data helpers: note names, chord symbols, pattern strings, swing.
// Kept free of Web Audio so it can be unit-tested.

const NOTE_OFFSETS: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

/** 'C4' -> 60, 'F#5' -> 78, 'Bb3' -> 58. Returns NaN for malformed input. */
export function noteToMidi(name: string): number {
  const m = /^([A-G])([#b]?)(-?\d)$/.exec(name);
  if (!m) return NaN;
  const acc = m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0;
  return NOTE_OFFSETS[m[1]] + acc + (Number(m[3]) + 1) * 12;
}

export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export interface Chord {
  /** Pitch class of the root, 0 = C. */
  root: number;
  intervals: number[];
}

const QUALITIES: Record<string, number[]> = {
  '': [0, 4, 7],
  m: [0, 3, 7],
  '7': [0, 4, 7, 10],
  maj7: [0, 4, 7, 11],
  m7: [0, 3, 7, 10],
  sus4: [0, 5, 7],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
};

/** 'C', 'F#m', 'Bb7', 'Ebmaj7' ... */
export function parseChord(sym: string): Chord {
  const m = /^([A-G])([#b]?)(.*)$/.exec(sym);
  const intervals = m ? QUALITIES[m[3]] : undefined;
  if (!m || !intervals) throw new Error(`Bad chord symbol: ${sym}`);
  const acc = m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0;
  return { root: (NOTE_OFFSETS[m[1]] + acc + 12) % 12, intervals };
}

/**
 * MIDI note for chord tone `index` (0 = root, 1 = next tone ...), wrapping
 * upward an octave past the last tone. `octave` follows note-name numbering
 * (root of a C chord at octave 4 is C4 = 60).
 */
export function chordTone(chord: Chord, index: number, octave: number): number {
  const n = chord.intervals.length;
  const oct = Math.floor(index / n);
  const i = ((index % n) + n) % n;
  return chord.root + (octave + 1) * 12 + chord.intervals[i] + oct * 12;
}

/** One chord per bar ('|' separated); several space-separated symbols split a bar evenly. */
export function parseChordLine(line: string): Chord[][] {
  return line
    .split('|')
    .map((bar) => bar.trim())
    .filter((bar) => bar.length > 0)
    .map((bar) => bar.split(/\s+/).map(parseChord));
}

export function chordAt(bars: Chord[][], bar: number, stepInBar: number, stepsPerBar: number): Chord {
  const slots = bars[bar % bars.length];
  return slots[Math.min(slots.length - 1, Math.floor((stepInBar * slots.length) / stepsPerBar))];
}

export type Token =
  | { kind: 'note'; midi: number }
  | { kind: 'degree'; index: number }
  | { kind: 'chord' }
  | { kind: 'hit'; ch: string };

export interface PatternEvent {
  /** Step offset from the start of the pattern (in sequencer steps). */
  step: number;
  /** Length in sequencer steps. */
  len: number;
  token: Token;
}

export interface ParsedPattern {
  bars: number;
  events: PatternEvent[];
}

function parseToken(raw: string): Token {
  if (raw === '*') return { kind: 'chord' };
  if (/^-?\d+$/.test(raw)) return { kind: 'degree', index: Number(raw) };
  const midi = noteToMidi(raw);
  if (!Number.isNaN(midi)) return { kind: 'note', midi };
  if (raw.length === 1) return { kind: 'hit', ch: raw };
  throw new Error(`Bad pattern token: ${raw}`);
}

/**
 * Pattern grammar: bars separated by '|'. Inside a bar, tokens are split on
 * whitespace, or per character when the bar has no whitespace and is not a
 * single note name (drum lines).
 * '.' = rest, '-' = hold previous note. Other tokens: note name ('F#5'),
 * chord-tone degree ('0'..'9'), '*' = whole chord, single char = drum hit.
 * Each token spans `res` steps; short bars are padded with rests.
 */
export function parsePattern(src: string, stepsPerBar: number, res = 1): ParsedPattern {
  const bars = src
    .split('|')
    .map((b) => b.trim())
    .filter((b) => b.length > 0);
  const events: PatternEvent[] = [];
  let last: PatternEvent | null = null;
  bars.forEach((bar, barIndex) => {
    // A lone note name ('G5') is one token, not a drum line.
    const spaced = /\s/.test(bar) || !Number.isNaN(noteToMidi(bar));
    const tokens = spaced ? bar.split(/\s+/) : bar.split('');
    if (tokens.length * res > stepsPerBar) {
      throw new Error(`Bar ${barIndex + 1} too long (${tokens.length} tokens): ${bar}`);
    }
    tokens.forEach((raw, i) => {
      const step = barIndex * stepsPerBar + i * res;
      if (raw === '.') {
        last = null;
      } else if (raw === '-') {
        if (last) last.len += res;
      } else {
        last = { step, len: res, token: parseToken(raw) };
        events.push(last);
      }
    });
    // Padding rests end any held note at the bar line.
    if (tokens.length * res < stepsPerBar) last = null;
  });
  return { bars: Math.max(1, bars.length), events };
}

/**
 * Swing as a time offset (in steps) for a step position. `unit` is the swung
 * subdivision in steps (1 = 16ths, 2 = 8ths at 4 steps/beat); `amount` 0..1
 * where 1/3 is a full triplet shuffle. Pair boundaries are never moved, so
 * bar lines stay exact.
 */
export function swingOffset(step: number, unit: number, amount: number): number {
  if (amount === 0) return 0;
  const p = step % (2 * unit);
  const mapped = p < unit ? p * (1 + amount) : unit * (1 + amount) + (p - unit) * (1 - amount);
  return mapped - p;
}

/** Deterministic PRNG so pre-rendered SFX are identical on every load. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
