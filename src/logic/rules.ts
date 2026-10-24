// Pure game rules: no Phaser imports so they can be unit-tested.
// Numbers are shaped after the 1984 PC game (see reports/) but tuned for arcade play.

export type RoomId = 'fishbowl' | 'bookcase' | 'cheese' | 'birdcage' | 'dogs';

export const MAX_LEVEL = 7;
export const START_LIVES = 3;
export const MAX_LIVES = 9;

export const SKILLS = ['Kitten', 'House Cat', 'Tomcat', 'Alley Cat'] as const;

/** Washing-line mice: the higher the line, the more they are worth. */
export const LINE_MOUSE_POINTS = [50, 70, 90] as const;

export const ROOM_BONUS: Record<RoomId | 'love', number> = {
  fishbowl: 3000,
  bookcase: 2000,
  cheese: 1500,
  birdcage: 3500,
  dogs: 2500,
  love: 4000,
};

/** Seconds until a room's speed bonus has fully drained. */
export const TIME_BONUS_SECONDS = 75;
export const TIME_BONUS_MAX = 2700;

export function timeBonus(elapsedSeconds: number): number {
  const left = Math.max(0, 1 - elapsedSeconds / TIME_BONUS_SECONDS);
  return Math.round((TIME_BONUS_MAX * left) / 10) * 10;
}

export function roomScore(room: RoomId, elapsedSeconds: number): number {
  return ROOM_BONUS[room] + timeBonus(elapsedSeconds);
}

/** Love-scene multiplier grows with level; carrying a gift doubles it. */
export function loveMultiplier(level: number, hasGift: boolean): number {
  const base = 1 + 2 * clampLevel(level);
  return hasGift ? base * 2 : base;
}

export function loveScore(level: number, hasGift: boolean, elapsedSeconds: number): number {
  return (ROOM_BONUS.love + timeBonus(elapsedSeconds / 2)) * loveMultiplier(level, hasGift);
}

/** Combo: consecutive catches inside the window multiply line-mouse points. */
export const COMBO_WINDOW_SECONDS = 3;
export function comboMultiplier(chain: number): number {
  return Math.min(5, Math.max(1, chain));
}

export function clampLevel(level: number): number {
  return Math.max(0, Math.min(MAX_LEVEL, Math.floor(level)));
}

export interface Difficulty {
  windowOpenEvery: number; // seconds between window openings
  windowOpenFor: number; // seconds a window stays open
  throwChance: number; // 0..1 chance an opened window throws something
  dogSpeed: number;
  broomSpeed: number;
  broomChase: number; // 0..1 how eagerly the broom hunts the cat over footprints
  roomDogDelay: number; // seconds before the dog barges into a room
  fishCount: number;
  eelCount: number;
  cheeseMice: number;
  sleepingDogs: number;
  helpings: number; // bites per dog dish
  spiderSpeed: number;
  cupids: number;
  rivals: number;
  gifts: number;
}

export function difficulty(level: number): Difficulty {
  const l = clampLevel(level);
  return {
    windowOpenEvery: 2.6 - l * 0.2,
    windowOpenFor: 5.5 - l * 0.4,
    throwChance: 0.25 + l * 0.08,
    dogSpeed: 150 + l * 18,
    broomSpeed: 70 + l * 14,
    broomChase: Math.min(1, (16 + l * 16) / 128),
    roomDogDelay: 28 - l * 2.5,
    fishCount: 5 + Math.floor(l / 2),
    eelCount: 1 + Math.floor((l + 1) / 3),
    cheeseMice: 5 + Math.floor(l / 2),
    sleepingDogs: Math.min(6, 3 + Math.floor(l / 2)),
    helpings: Math.min(4, 1 + l),
    spiderSpeed: 60 + l * 12,
    cupids: 1 + Math.floor(l / 3),
    rivals: 1 + Math.floor(l / 2),
    gifts: 1,
  };
}

/** Rooms on offer grow with level so new players learn them one at a time. */
const ROOM_POOLS: RoomId[][] = [
  ['cheese', 'cheese', 'fishbowl', 'fishbowl'],
  ['bookcase', 'bookcase', 'birdcage', 'birdcage'],
  ['dogs', 'dogs', 'cheese', 'fishbowl'],
  ['fishbowl', 'bookcase', 'cheese', 'birdcage', 'dogs'],
];

export function roomPool(level: number): RoomId[] {
  return ROOM_POOLS[Math.min(3, clampLevel(level))];
}

/**
 * Pick the next room. Never the same room three times running, and
 * prefer rooms not yet won this level so players see variety.
 */
export function pickRoom(level: number, history: RoomId[], rand: () => number): RoomId {
  const pool = roomPool(level);
  const last2 = history.slice(-2);
  const banned = last2.length === 2 && last2[0] === last2[1] ? last2[0] : undefined;
  const options = pool.filter((r) => r !== banned);
  return options[Math.floor(rand() * options.length) % options.length];
}

export interface Session {
  score: number;
  lives: number;
  level: number;
  skill: number;
  loveUnlocked: boolean; // a room was won since the last love scene attempt
  hasGift: boolean;
  roomHistory: RoomId[];
  roomsWon: number;
  kisses: number;
  combo: number;
  lastCatchAt: number; // seconds
}

export function newSession(skill = 0): Session {
  return {
    score: 0,
    lives: START_LIVES,
    level: clampLevel(skill),
    skill,
    loveUnlocked: false,
    hasGift: false,
    roomHistory: [],
    roomsWon: 0,
    kisses: 0,
    combo: 0,
    lastCatchAt: -999,
  };
}

/** Registers a line-mouse catch and returns the points awarded. */
export function catchLineMouse(s: Session, lineIndex: number, now: number): number {
  s.combo = now - s.lastCatchAt <= COMBO_WINDOW_SECONDS ? s.combo + 1 : 1;
  s.lastCatchAt = now;
  const points = LINE_MOUSE_POINTS[Math.max(0, Math.min(2, lineIndex))] * comboMultiplier(s.combo);
  s.score += points;
  return points;
}

export function winRoom(s: Session, room: RoomId, elapsedSeconds: number): number {
  const points = roomScore(room, elapsedSeconds);
  s.score += points;
  s.roomsWon += 1;
  s.loveUnlocked = true;
  return points;
}

export function winLove(s: Session, elapsedSeconds: number): number {
  const points = loveScore(s.level, s.hasGift, elapsedSeconds);
  s.score += points;
  s.kisses += 1;
  s.lives = Math.min(MAX_LIVES, s.lives + 1);
  s.level = clampLevel(s.level + 1);
  s.loveUnlocked = false;
  s.hasGift = false;
  return points;
}

/** Falling out of the love scene costs no life, but a new room must be won first. */
export function failLove(s: Session): void {
  s.loveUnlocked = false;
  s.hasGift = false;
}

/** Returns true when the game is over. */
export function loseLife(s: Session): boolean {
  s.lives -= 1;
  s.combo = 0;
  return s.lives <= 0;
}

export const HISCORE_KEY = 'alleycat.hiscore';

export function readHiScore(storage: Pick<Storage, 'getItem'> | undefined): number {
  try {
    const v = Number(storage?.getItem(HISCORE_KEY) ?? 0);
    return Number.isFinite(v) ? v : 0;
  } catch {
    return 0;
  }
}

export function writeHiScore(storage: Pick<Storage, 'setItem'> | undefined, score: number): void {
  try {
    storage?.setItem(HISCORE_KEY, String(score));
  } catch {
    // private mode / blocked storage: high score just isn't persisted
  }
}
