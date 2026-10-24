import { newSession, readHiScore, writeHiScore } from './logic/rules';

function storage(): Storage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

/** The one running game session, shared by every scene. */
export const game = {
  session: newSession(),
  hiScore: readHiScore(storage()),

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
