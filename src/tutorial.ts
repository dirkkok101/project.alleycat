import Phaser from 'phaser';
import { AudioEngine } from './audio';
import { FONT } from './fx';
import { game } from './state';

export function hasSeen(key: string): boolean {
  return game.session.seen.includes(key);
}

/** True the first time `key` happens this run (and records it). */
export function firstTime(key: string): boolean {
  if (hasSeen(key)) return false;
  game.session.seen.push(key);
  return true;
}

/**
 * Small in-world hint bubble that never pauses play. Shown once per run per
 * key, and only to players who are actually stuck (callers decide when).
 */
export function hint(scene: Phaser.Scene, x: number, y: number, text: string, key: string): void {
  if (!firstTime(`hint:${key}`)) return;
  const t = scene.add
    .text(Phaser.Math.Clamp(x, 140, 1140), Phaser.Math.Clamp(y, 110, 660), text, {
      fontFamily: FONT, fontSize: '26px', color: '#1b1433', backgroundColor: '#fff6d8', padding: { x: 14, y: 8 },
    })
    .setOrigin(0.5)
    .setDepth(960)
    .setScale(0);
  scene.tweens.add({ targets: t, scale: 1, duration: 220, ease: 'Back.Out' });
  scene.tweens.add({ targets: t, y: t.y - 6, duration: 600, yoyo: true, repeat: 4, ease: 'Sine.InOut' });
  scene.tweens.add({ targets: t, alpha: 0, delay: 4200, duration: 400, onComplete: () => t.destroy() });
  AudioEngine.get().play('uiSelect', { volume: 0.5 });
}

/** The onboarding run forgives the first bulldog bump. Returns true if this one was forgiven. */
export function useFreeSave(): boolean {
  if (!game.tutorial || game.session.saveUsed) return false;
  game.session.saveUsed = true;
  return true;
}

/** Dev-only onboarding funnel, read by the playtest tools as window.__funnel. */
export function funnel(step: string): void {
  if (!import.meta.env.DEV) return;
  const w = window as unknown as { __funnel?: { step: string; t: number }[] };
  w.__funnel ??= [];
  if (!w.__funnel.some((f) => f.step === step)) w.__funnel.push({ step, t: Math.round(performance.now()) });
}
