import { describe, expect, it } from 'vitest';
import {
  catchLineMouse,
  difficulty,
  failLove,
  loseLife,
  loveMultiplier,
  MAX_LEVEL,
  MAX_LIVES,
  newSession,
  pickRoom,
  readHiScore,
  roomPool,
  timeBonus,
  winLove,
  winRoom,
} from './rules';

describe('time bonus', () => {
  it('starts at max and drains to zero without going negative', () => {
    expect(timeBonus(0)).toBe(2700);
    expect(timeBonus(37.5)).toBe(1350);
    expect(timeBonus(75)).toBe(0);
    expect(timeBonus(500)).toBe(0);
  });
});

describe('line mice and combos', () => {
  it('pays more for higher lines and multiplies quick chains', () => {
    const s = newSession();
    expect(catchLineMouse(s, 0, 10)).toBe(50);
    expect(catchLineMouse(s, 2, 11)).toBe(180);
    expect(catchLineMouse(s, 1, 12)).toBe(210);
    expect(catchLineMouse(s, 1, 20)).toBe(70); // chain broken
    expect(s.score).toBe(510);
  });
});

describe('room and love flow', () => {
  it('winning a room unlocks love; kissing gives a life and a level', () => {
    const s = newSession(1);
    expect(s.loveUnlocked).toBe(false);
    winRoom(s, 'cheese', 0);
    expect(s.score).toBe(1500 + 2700);
    expect(s.loveUnlocked).toBe(true);
    s.hasGift = true;
    const pts = winLove(s, 0);
    expect(pts).toBe((4000 + 2700) * loveMultiplier(1, true));
    expect(s.lives).toBe(4);
    expect(s.level).toBe(2);
    expect(s.loveUnlocked).toBe(false);
    expect(s.hasGift).toBe(false);
  });

  it('failing love costs no life but relocks it', () => {
    const s = newSession();
    winRoom(s, 'dogs', 10);
    failLove(s);
    expect(s.lives).toBe(3);
    expect(s.loveUnlocked).toBe(false);
  });

  it('caps lives and level', () => {
    const s = newSession(3);
    s.lives = MAX_LIVES;
    for (let i = 0; i < 10; i++) {
      s.loveUnlocked = true;
      winLove(s, 0);
    }
    expect(s.lives).toBe(MAX_LIVES);
    expect(s.level).toBe(MAX_LEVEL);
  });

  it('reports game over on the last life', () => {
    const s = newSession();
    expect(loseLife(s)).toBe(false);
    expect(loseLife(s)).toBe(false);
    expect(loseLife(s)).toBe(true);
  });
});

describe('difficulty and room selection', () => {
  it('gets harder with level', () => {
    expect(difficulty(7).dogSpeed).toBeGreaterThan(difficulty(0).dogSpeed);
    expect(difficulty(7).windowOpenFor).toBeLessThan(difficulty(0).windowOpenFor);
    expect(difficulty(99)).toEqual(difficulty(7));
  });

  it('offers every room from level 3 up', () => {
    expect(new Set(roomPool(3)).size).toBe(5);
    expect(new Set(roomPool(7)).size).toBe(5);
  });

  it('never picks the same room three times in a row', () => {
    let i = 0;
    const seq = [0, 0, 0, 0.99, 0.5];
    const rand = () => seq[i++ % seq.length];
    expect(pickRoom(0, ['cheese', 'cheese'], rand)).not.toBe('cheese');
  });
});

describe('high score storage', () => {
  it('survives broken storage', () => {
    const broken = {
      getItem: () => {
        throw new Error('blocked');
      },
    };
    expect(readHiScore(broken)).toBe(0);
    expect(readHiScore(undefined)).toBe(0);
  });
});
