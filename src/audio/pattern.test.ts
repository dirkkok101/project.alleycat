import { describe, expect, it } from 'vitest';
import { TRACKS } from './music';
import { chordTone, midiToFreq, noteToMidi, parseChord, parseChordLine, parsePattern, swingOffset } from './pattern';

describe('notes', () => {
  it('maps note names to MIDI', () => {
    expect(noteToMidi('C4')).toBe(60);
    expect(noteToMidi('A4')).toBe(69);
    expect(noteToMidi('F#5')).toBe(78);
    expect(noteToMidi('Bb3')).toBe(58);
    expect(noteToMidi('nope')).toBeNaN();
  });
  it('maps MIDI to frequency', () => {
    expect(midiToFreq(69)).toBeCloseTo(440);
    expect(midiToFreq(60)).toBeCloseTo(261.626, 2);
  });
});

describe('chords', () => {
  it('parses symbols and resolves chord tones with octave wrap', () => {
    const am = parseChord('Am');
    expect(am).toEqual({ root: 9, intervals: [0, 3, 7] });
    expect(chordTone(am, 0, 3)).toBe(noteToMidi('A3'));
    expect(chordTone(am, 3, 3)).toBe(noteToMidi('A4'));
    expect(chordTone(parseChord('Bb7'), 3, 2)).toBe(noteToMidi('Ab3'));
    expect(parseChordLine('C | F G').map((b) => b.length)).toEqual([1, 2]);
    expect(() => parseChord('Cxyz')).toThrow();
  });
});

describe('patterns', () => {
  it('parses holds, rests, padding and drum lines', () => {
    const p = parsePattern('C5 - . E5 | G5', 8, 2);
    expect(p.bars).toBe(2);
    expect(p.events.map((e) => [e.step, e.len])).toEqual([
      [0, 4],
      [6, 2],
      [8, 2],
    ]);
    const d = parsePattern('k..s', 4);
    expect(d.events.map((e) => e.token)).toEqual([
      { kind: 'hit', ch: 'k' },
      { kind: 'hit', ch: 's' },
    ]);
    expect(() => parsePattern('a b c', 2)).toThrow();
  });

  it('swing never moves pair boundaries', () => {
    expect(swingOffset(0, 2, 0.3)).toBe(0);
    expect(swingOffset(4, 2, 0.3)).toBe(0);
    expect(swingOffset(2, 2, 0.3)).toBeCloseTo(0.6);
    expect(swingOffset(1, 1, 0)).toBe(0);
  });

  it('every track pattern parses and fits its bar length', () => {
    for (const [name, t] of Object.entries(TRACKS)) {
      const bars = parseChordLine(t.chords).length;
      expect(bars, name).toBeGreaterThan(0);
      for (const part of t.parts) {
        const p = parsePattern(part.pattern, t.stepsPerBar, part.res ?? 1);
        expect(bars % p.bars, `${name}/${part.inst} bars ${p.bars}`).toBe(0);
        for (const ev of p.events) if (ev.token.kind === 'note') expect(ev.token.midi).not.toBeNaN();
      }
    }
  });
});
