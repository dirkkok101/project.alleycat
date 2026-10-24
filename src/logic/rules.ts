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

// Per-level tables. Shapes follow the 1984 PC game's data segment (see
// research_notes/.../original_mechanics_deep.md), rescaled to our 1280x720 screen.
const pick = <T>(table: readonly T[], l: number): T => table[l];

export interface Difficulty {
  windowOpenEvery: number; // seconds between window openings (cat on the fence or higher)
  windowOpenFor: number; // seconds a window stays fully open
  throwKills: boolean; // a thrown object costs a life (from level 2; knock-only before)
  fenceCampSeconds: number; // loitering on the fence this long brings a drop from above
  dogSpeed: number;
  broomSpeed: number;
  broomChase: number; // 0..1 how eagerly the broom hunts the cat over footprints
  roomDogChance: number; // per second, while the cat is on a room's floor
  fishCount: number;
  eelCount: number; // eels at the start; every fish eaten brings one more
  maxEels: number;
  airSeconds: number;
  cheeseMice: number;
  shyRadius: number; // cheese mice duck when the cat comes this close (px)
  sleepingDogs: number;
  dogWakeRadius: number; // px; standing this close to a sleeping dog stirs it
  helpings: number; // bites per dog dish
  spiderSpeed: number;
  birdFleeRadius: number;
  cupids: number;
  rivals: number;
  rivalChase: number; // 0..1 how often a rival heads for the cat
  giftDistractSeconds: number;
  sweetheartSpeed: number; // she strolls away along the top row until reached
}

export function difficulty(level: number): Difficulty {
  const l = clampLevel(level);
  return {
    windowOpenEvery: 2.2 - l * 0.15,
    windowOpenFor: pick([3.1, 2.6, 2.2, 1.8, 1.5, 1.7, 1.2, 1.6], l),
    throwKills: l >= 2,
    fenceCampSeconds: 4,
    dogSpeed: 150 + l * 18,
    broomSpeed: 80 + l * 16,
    broomChase: Math.min(1, (16 + l * 16) / 128),
    roomDogChance: 0.04 + l * 0.04,
    fishCount: Math.min(12, 8 + l),
    eelCount: pick([1, 2, 2, 3, 3, 4, 4, 5], l),
    maxEels: pick([4, 5, 5, 6, 6, 7, 7, 8], l),
    airSeconds: 15.8 - l * 0.87,
    cheeseMice: 4 + Math.floor(l / 3),
    shyRadius: pick([60, 140, 180, 220, 220, 260, 260, 260], l),
    sleepingDogs: pick([4, 4, 5, 5, 6, 6, 7, 7], l),
    dogWakeRadius: 110 + l * 10,
    helpings: Math.min(4, 1 + l),
    spiderSpeed: 70 + l * 45,
    birdFleeRadius: 120 + l * 30,
    cupids: 1 + Math.floor(l / 4),
    rivals: Math.min(6, 2 + Math.floor(l / 2)),
    rivalChase: Math.min(0.75, (16 + l * 25) / 256),
    giftDistractSeconds: 30 - l * 3.2,
    sweetheartSpeed: 30 + l * 10,
  };
}

/**
 * Cheese tunnels: hole i connects to CHEESE_PAIRS[level & 3][i]. Pairs are
 * deliberately not neighbours, a "secret map" players learn (from the original).
 */
const PAIR_LISTS: [number, number][][] = [
  [[0, 15], [1, 6], [2, 9], [3, 11], [4, 10], [5, 12], [7, 14], [8, 13]],
  [[0, 14], [1, 11], [2, 6], [3, 15], [4, 12], [5, 10], [7, 9], [8, 13]],
  [[0, 7], [1, 9], [2, 12], [3, 13], [4, 11], [5, 15], [6, 10], [8, 14]],
  [[0, 2], [1, 13], [3, 14], [4, 15], [5, 6], [7, 11], [8, 12], [9, 10]],
];

export function cheesePartner(level: number, hole: number): number {
  for (const [a, b] of PAIR_LISTS[clampLevel(level) & 3]) {
    if (a === hole) return b;
    if (b === hole) return a;
  }
  return hole;
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
  /** Each room won since the last kiss puts another gift in the love scene. */
  roomsSinceKiss: number;
  roomHistory: RoomId[];
  roomsWon: number;
  kisses: number;
  combo: number;
  lastCatchAt: number; // seconds
  /** One-off events this run (onboarding beats, hints already shown). */
  seen: string[];
  /** Onboarding gives one free bulldog bump per run. */
  saveUsed: boolean;
  /** Index of the alley window the sweetheart waits in (-1 = not chosen yet). */
  herWindow: number;
}

export function newSession(skill = 0): Session {
  return {
    score: 0,
    lives: START_LIVES,
    level: clampLevel(skill),
    skill,
    loveUnlocked: false,
    hasGift: false,
    roomsSinceKiss: 0,
    roomHistory: [],
    roomsWon: 0,
    kisses: 0,
    combo: 0,
    lastCatchAt: -999,
    seen: [],
    saveUsed: false,
    herWindow: -1,
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
  s.roomsSinceKiss += 1;
  s.loveUnlocked = true;
  return points;
}

export function winLove(s: Session, elapsedSeconds: number): number {
  const points = loveScore(s.level, s.hasGift, elapsedSeconds);
  s.score += points;
  s.kisses += 1;
  s.roomsSinceKiss = 0;
  s.lives = Math.min(MAX_LIVES, s.lives + 1);
  s.level = clampLevel(s.level + 1);
  s.loveUnlocked = false;
  s.hasGift = false;
  s.herWindow = -1;
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
