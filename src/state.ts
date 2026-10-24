import { newSession, readHiScore, writeHiScore } from './logic/rules';

function storage(): Storage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

/** The one running game session, shared by every scene. */
const ONBOARDED_KEY = 'alleycat.onboarded';

export const game = {
  session: newSession(),
  hiScore: readHiScore(storage()),
  onboarded: (() => {
    try {
      return storage()?.getItem(ONBOARDED_KEY) === '1';
    } catch {
      return false;
    }
  })(),

  /** A brand-new player's Kitten run gets the gentle first-night scaffolding. */
  get tutorial(): boolean {
    return this.session.skill === 0 && !this.onboarded;
  },

  markOnboarded(): void {
    this.onboarded = true;
    try {
      storage()?.setItem(ONBOARDED_KEY, '1');
    } catch {
      // not persisted; the next run just gets the tutorial again
    }
  },

  reset(skill: number): void {
    this.session = newSession(skill);
  },

  commitHiScore(): boolean {
    if (this.session.score <= this.hiScore) return false;
    this.hiScore = this.session.score;
    writeHiScore(storage(), this.hiScore);
    return true;
  },
};

export const settings = {
  reduceMotion: (() => {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  })(),
};
