// Music as compact data. All melodies are original compositions for this
// remake. Pattern grammar is documented in pattern.ts (parsePattern).
//   note names ('F#5'), chord-tone degrees ('0' root, '1' third, '2' fifth,
//   '3' next tone / octave ...) relative to the current chord, '*' whole
//   chord, '-' hold, '.' rest, '|' bar line. Drum lines use one char per step.

import type { InstrumentName } from './instruments';

export type MusicTrack = 'title' | 'alley' | 'room' | 'fishbowl' | 'love' | 'gameover';

export interface PartDef {
  inst: InstrumentName | 'drums';
  pattern: string;
  /** Steps per token (2 = eighth notes when stepsPerBeat is 4). */
  res?: number;
  vol: number;
  /** Octave for degree / chord tokens. */
  oct?: number;
  transpose?: number;
  /** Reverb / delay send levels (0..1). */
  rev?: number;
  dly?: number;
  pan?: number;
}

export interface TrackDef {
  bpm: number;
  stepsPerBeat: number;
  stepsPerBar: number;
  /** Swing amount (0..1/3) and swung subdivision in steps. */
  swing?: number;
  swingUnit?: number;
  /** One chord (or several, splitting the bar) per bar. Sets the loop length. */
  chords: string;
  loop: boolean;
  /** Tempo-synced delay time in steps. */
  delaySteps: number;
  parts: PartDef[];
}

/** Repeat a bar-pattern string n times. */
const rep = (bars: string, n: number) => Array(n).fill(bars).join(' | ');
/** '.' bars, i.e. n bars of silence. */
const rest = (n: number) => rep('.', n);

// ----------------------------------------------------------------------------
// TITLE — C major, 120 BPM. Bright, singable, Kirby-simple.

const titleMelody = [
  'E5 - G5 - C6 - G5 -',
  'A5 - G5 - E5 - - -',
  'F5 - A5 - C6 - A5 -',
  'B5 - A5 - G5 - - -',
  'E5 - G5 - C6 - D6 -',
  'E6 - D6 C6 A5 - - -',
  'A5 - C6 - B5 - D6 -',
  'C6 - - - - - . .',
  'A5 - C6 - F6 - C6 -',
  'B5 - D6 - G6 - D6 -',
  'G5 - B5 - E6 - B5 -',
  'C6 - - - A5 - . .',
  'A5 - C6 - A5 - F5 -',
  'G5 - B5 - D6 - B5 -',
  'A5 - F5 - D6 - B5 -',
  'C6 - - - - - . .',
];

const title: TrackDef = {
  bpm: 120,
  stepsPerBeat: 4,
  stepsPerBar: 16,
  chords: 'C | Am | F | G | C | Am | F G | C | F | G | Em | Am | F | G | Dm7 G | C',
  loop: true,
  delaySteps: 3,
  parts: [
    { inst: 'lead', pattern: titleMelody.join(' | '), res: 2, vol: 0.16, rev: 0.25, dly: 0.18 },
    { inst: 'bell', pattern: rest(8) + ' | ' + titleMelody.slice(8).join(' | '), res: 2, vol: 0.06, transpose: 12, rev: 0.3, pan: 0.3 },
    { inst: 'pluck', pattern: '0 1 2 3 4 3 2 1', res: 2, oct: 4, vol: 0.06, dly: 0.25, pan: -0.3 },
    { inst: 'bass', pattern: '0 . 2 . 3 . 2 .', res: 2, oct: 2, vol: 0.3 },
    { inst: 'pad', pattern: '* - - - * - - -', res: 2, oct: 4, vol: 0.035, rev: 0.4 },
    { inst: 'drums', pattern: 'k.......k.k.....', vol: 0.45 },
    { inst: 'drums', pattern: '....s.......s...', vol: 0.22, rev: 0.15 },
    { inst: 'drums', pattern: 'h.h.h.h.h.h.h.h.', vol: 0.06, pan: 0.2 },
  ],
};

// ----------------------------------------------------------------------------
// ALLEY — F major, 128 BPM, light 8th swing. The main motif: a sneaky, bouncy
// "tip-toe" figure that rises through the chord.

const alleyMelody = [
  'C5 . F5 A5 . G5 F5 .',
  'D5 . F5 A5 . C6 A5 .',
  'D5 . G5 Bb5 . A5 G5 .',
  'E5 . G5 . C6 - - .',
  'C5 . F5 A5 . G5 F5 .',
  'D5 . F5 A5 . D6 C6 .',
  'Bb5 . A5 G5 . E5 G5 .',
  'F5 - - . . . A5 Bb5',
  'D6 . C6 Bb5 . F5 D5 .',
  'C6 . A5 F5 . C5 . .',
  'D6 . C6 Bb5 . F5 Bb5 .',
  'C6 - - . E5 F5 G5 .',
  'A5 . F5 D5 . A5 . .',
  'C6 . A5 E5 . C6 . .',
  'Bb5 . A5 G5 . F5 E5 .',
  'G5 - - . E5 . G5 .',
];

const alley: TrackDef = {
  bpm: 128,
  stepsPerBeat: 4,
  stepsPerBar: 16,
  swing: 0.22,
  swingUnit: 2,
  chords: 'F | Dm | Gm | C | F | Dm | Gm C | F | Bb | F | Bb | C | Dm | Am | Gm | C',
  loop: true,
  delaySteps: 3,
  parts: [
    { inst: 'lead', pattern: alleyMelody.join(' | '), res: 2, vol: 0.16, rev: 0.2, dly: 0.15 },
    { inst: 'bass', pattern: '0 . . 2 3 . 2 . | 0 . 2 . 3 2 1 .', res: 2, oct: 2, vol: 0.32 },
    { inst: 'epiano', pattern: '. . * . . . * .', res: 2, oct: 4, vol: 0.06, rev: 0.25, pan: -0.2 },
    { inst: 'bell', pattern: '. | . | . | . . . . 4 3 2 .', res: 2, oct: 5, vol: 0.07, rev: 0.35, pan: 0.35 },
    { inst: 'pluck', pattern: rest(8) + ' | ' + rep('3 2 1 2 3 4 3 2', 8), res: 2, oct: 4, vol: 0.05, dly: 0.3, pan: 0.25 },
    { inst: 'drums', pattern: 'k.......k.....k.', vol: 0.45 },
    { inst: 'drums', pattern: '....s.......s...', vol: 0.22, rev: 0.12 },
    { inst: 'drums', pattern: 'h.h.h.h.h.h.h.hh', vol: 0.06, pan: 0.2 },
  ],
};

// ----------------------------------------------------------------------------
// ROOM — G major, 144 BPM, straight and busy for the mini-game rooms.

const roomMelody = [
  'D5 G5 B5 G5 D6 - B5 -',
  'E5 G5 B5 G5 E6 - B5 -',
  'C6 B5 A5 G5 E5 - G5 -',
  'F#5 - A5 - D6 - . .',
  'D5 G5 B5 G5 D6 - B5 -',
  'E6 D6 B5 G5 E5 - G5 -',
  'A5 B5 C6 A5 F#5 G5 A5 F#5',
  'G5 - - - . . D5 E5',
  'E5 G5 C6 - B5 C6 E6 -',
  'D6 - A5 - F#5 - A5 -',
  'B5 - D6 - F#6 - D6 -',
  'E6 - - - B5 - G5 -',
  'C6 - E6 - G6 - E6 C6',
  'D6 - C6 - B5 - A5 -',
  'B5 - G5 - E5 - G5 -',
  'A5 - C6 - D6 - F#5 -',
];

const room: TrackDef = {
  bpm: 144,
  stepsPerBeat: 4,
  stepsPerBar: 16,
  swing: 0.08,
  swingUnit: 1,
  chords: 'G | Em | C | D | G | Em | C D | G | C | D | Bm | Em | C | D | G Em | Am D',
  loop: true,
  delaySteps: 3,
  parts: [
    { inst: 'lead', pattern: roomMelody.join(' | '), res: 2, vol: 0.15, rev: 0.15, dly: 0.12 },
    { inst: 'pluck', pattern: '0 1 2 3 1 2 3 4 0 1 2 3 1 2 3 4', oct: 4, vol: 0.05, pan: -0.3, dly: 0.15 },
    { inst: 'bass', pattern: '0 . 0 3 . 0 2 .', res: 2, oct: 2, vol: 0.32 },
    { inst: 'epiano', pattern: '. * . * . * . *', res: 2, oct: 4, vol: 0.045, pan: 0.25, rev: 0.2 },
    { inst: 'bell', pattern: rest(8) + ' | ' + roomMelody.slice(8).join(' | '), res: 2, vol: 0.05, transpose: 12, rev: 0.3, pan: 0.35 },
    { inst: 'drums', pattern: 'k...k...k...k...', vol: 0.42 },
    { inst: 'drums', pattern: '....s.......s..s', vol: 0.22, rev: 0.12 },
    { inst: 'drums', pattern: 'h.o.h.o.h.o.h.oh', vol: 0.055, pan: 0.2 },
  ],
};

// ----------------------------------------------------------------------------
// FISHBOWL — D major, 140 BPM. Marimba, bubbles and a soft shaker.

const fishMelody = [
  'A5 . F#5 . A5 B5 A5 .',
  'F#5 . D5 . F#5 A5 F#5 .',
  'G5 . B5 . D6 . B5 .',
  'A5 - C#6 - E6 - . .',
  'A5 . F#5 . A5 B5 A5 .',
  'D6 . B5 . F#5 A5 B5 .',
  'G5 . B5 . A5 . C#6 .',
  'D6 - - . . . . .',
  'B5 . G5 . D5 . G5 B5',
  'C#6 . A5 . E5 . A5 C#6',
  'A5 . F#5 . C#5 . F#5 A5',
  'B5 - - . D6 - - .',
  'D6 . B5 . G5 . B5 D6',
  'E6 . C#6 . A5 . C#6 E6',
  'F#6 - D6 - B5 - D6 -',
  'E6 - - . C#6 - A5 .',
];

const fishbowl: TrackDef = {
  bpm: 140,
  stepsPerBeat: 4,
  stepsPerBar: 16,
  swing: 0.12,
  swingUnit: 1,
  chords: 'D | Bm | G | A | D | Bm | Em A | D | G | A | F#m | Bm | G | A | D Bm | Em A',
  loop: true,
  delaySteps: 3,
  parts: [
    { inst: 'marimba', pattern: fishMelody.join(' | '), res: 2, vol: 0.3, rev: 0.2, dly: 0.2 },
    { inst: 'marimba', pattern: '0 2 3 2 0 2 3 2', res: 2, oct: 4, vol: 0.13, pan: -0.3 },
    { inst: 'blip', pattern: '. . . 4 . . 3 . | . 2 . . . . . 4', res: 2, oct: 5, vol: 0.12, rev: 0.3, dly: 0.3, pan: 0.4 },
    { inst: 'bass', pattern: '0 . . 2 . . 3 .', res: 2, oct: 2, vol: 0.3 },
    { inst: 'bell', pattern: '. | . | . | 4 . 3 . 2 . . .', res: 2, oct: 5, vol: 0.06, rev: 0.35, pan: 0.3 },
    { inst: 'drums', pattern: 'k.......k..k....', vol: 0.38 },
    { inst: 'drums', pattern: '....c.......c...', vol: 0.18, rev: 0.15 },
    { inst: 'drums', pattern: '...r..r....r..r.', vol: 0.05, pan: -0.25 },
    { inst: 'drums', pattern: '..h...h...h...h.', vol: 0.05, pan: 0.25 },
  ],
};

// ----------------------------------------------------------------------------
// LOVE — F major, 6/8 waltz, eighth-note steps at 96 quarter-BPM. Opens with
// an original triplet "wedding fanfare" figure (a nod to the tradition, not a
// quote of any specific march).

const loveMelody = [
  'C5 C5 C5 F5 - -',
  'C5 C5 C5 G5 - -',
  'A5 - F5 D5 - F5',
  'F5 - D5 Bb4 - -',
  'A4 - C5 F5 - A5',
  'Bb5 - A5 G5 - D5',
  'E5 - G5 C6 - Bb5',
  'A5 - - G5 - -',
  'D6 - C6 Bb5 - F5',
  'A5 - - C6 - -',
  'Bb5 - A5 G5 - D5',
  'F5 - - A5 - -',
  'D6 - C6 Bb5 - D6',
  'C6 - A5 F5 - A5',
  'G5 - Bb5 E5 - G5',
  'F5 - - - - .',
];

const love: TrackDef = {
  bpm: 96,
  stepsPerBeat: 2,
  stepsPerBar: 6,
  chords: 'F | C | Dm | Bb | F | Gm | C | C7 | Bb | F | Gm | Dm | Bb | F | Gm C | F',
  loop: true,
  delaySteps: 2,
  parts: [
    { inst: 'lead', pattern: loveMelody.join(' | '), vol: 0.14, rev: 0.35, dly: 0.2 },
    { inst: 'bell', pattern: rest(8) + ' | ' + loveMelody.slice(8).join(' | '), vol: 0.05, transpose: 12, rev: 0.4, pan: 0.3 },
    { inst: 'bass', pattern: '0 . . 2 . .', oct: 2, vol: 0.3 },
    { inst: 'epiano', pattern: '. * * . * *', oct: 4, vol: 0.045, rev: 0.3, pan: -0.2 },
    { inst: 'pad', pattern: '* - - - - -', oct: 4, vol: 0.03, rev: 0.5 },
    { inst: 'drums', pattern: 'k.....', vol: 0.3 },
    { inst: 'drums', pattern: '..h..h', vol: 0.04, pan: 0.2 },
  ],
};

// ----------------------------------------------------------------------------
// GAME OVER — short, sad-but-cute; minor descent resolving to a major chord.

const gameover: TrackDef = {
  bpm: 100,
  stepsPerBeat: 4,
  stepsPerBar: 16,
  chords: 'Cm | Fm | G7 | C',
  loop: false,
  delaySteps: 3,
  parts: [
    { inst: 'lead', pattern: 'G5 - Eb5 - C5 - G4 - | Ab5 - F5 - C5 - Ab4 - | F5 - D5 - B4 - G4 - | C5 - - - - - - .', res: 2, vol: 0.16, rev: 0.35, dly: 0.2 },
    { inst: 'bass', pattern: '0 - - - 2 - - - | 0 - - - 2 - - - | 0 - - - 2 - - - | 0 - - - - - - .', res: 2, oct: 2, vol: 0.3 },
    { inst: 'pad', pattern: '* - - - - - - -', res: 2, oct: 4, vol: 0.035, rev: 0.4 },
    { inst: 'bell', pattern: '. | . | . | 0 . 1 . 2 . 4 .', res: 2, oct: 5, vol: 0.08, rev: 0.4 },
  ],
};

export const TRACKS: Record<MusicTrack, TrackDef> = { title, alley, room, fishbowl, love, gameover };

export const TRACK_NAMES = Object.keys(TRACKS) as MusicTrack[];
