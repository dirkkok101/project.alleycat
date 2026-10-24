import Phaser from 'phaser';
import { settings } from './state';

export const FONT = 'Fredoka, "Arial Rounded MT Bold", sans-serif';

export const COLORS = {
  cyan: 0x55ffff,
  magenta: 0xff55ff,
  white: 0xffffff,
  ink: 0x1b1433,
  pink: 0xff7eb6,
  gold: 0xffd34d,
};

export function shake(scene: Phaser.Scene, intensity = 0.006, ms = 160): void {
  if (settings.reduceMotion) return;
  scene.cameras.main.shake(ms, intensity);
}

/** A short freeze that makes impacts land. */
export function hitStop(scene: Phaser.Scene, ms = 60): void {
  if (settings.reduceMotion) return;
  scene.physics.world.pause();
  scene.time.delayedCall(ms, () => scene.physics.world.resume());
}

export function popText(scene: Phaser.Scene, x: number, y: number, text: string, color = '#ffffff', size = 34): void {
  const t = scene.add
    .text(x, y, text, { fontFamily: FONT, fontSize: `${size}px`, color, stroke: '#1b1433', strokeThickness: 7 })
    .setOrigin(0.5)
    .setDepth(900)
    .setScale(0.3);
  scene.tweens.add({ targets: t, scale: 1, duration: 180, ease: 'Back.Out' });
  scene.tweens.add({ targets: t, y: y - 60, alpha: 0, delay: 450, duration: 500, onComplete: () => t.destroy() });
}

export function sparkles(scene: Phaser.Scene, x: number, y: number, count = 10, tint = 0xffffff): void {
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const d = 40 + Math.random() * 50;
    const s = scene.add.image(x, y, 'sparkle').setDepth(850).setTint(tint);
    s.setScale((14 + Math.random() * 14) / s.height);
    scene.tweens.add({
      targets: s,
      x: x + Math.cos(a) * d,
      y: y + Math.sin(a) * d,
      angle: 180,
      alpha: 0,
      duration: 420 + Math.random() * 200,
      ease: 'Cubic.Out',
      onComplete: () => s.destroy(),
    });
  }
}

export function puff(scene: Phaser.Scene, x: number, y: number, count = 6, tint = 0xe8e0ff): void {
  for (let i = 0; i < count; i++) {
    const c = scene.add.circle(x, y, 6 + Math.random() * 6, tint, 0.8).setDepth(840);
    scene.tweens.add({
      targets: c,
      x: x + (Math.random() - 0.5) * 70,
      y: y - Math.random() * 24,
      scale: 0.2,
      alpha: 0,
      duration: 350 + Math.random() * 200,
      onComplete: () => c.destroy(),
    });
  }
}

export function hearts(scene: Phaser.Scene, x: number, y: number, count = 8): void {
  for (let i = 0; i < count; i++) {
    const h = scene.add.image(x, y, 'heart').setDepth(860);
    h.setScale((18 + Math.random() * 18) / h.height);
    scene.tweens.add({
      targets: h,
      x: x + (Math.random() - 0.5) * 220,
      y: y - 80 - Math.random() * 160,
      alpha: 0,
      angle: (Math.random() - 0.5) * 60,
      duration: 900 + Math.random() * 500,
      ease: 'Sine.Out',
      onComplete: () => h.destroy(),
    });
  }
}

/** Cute iris-wipe transition into another scene. */
export function wipeTo(scene: Phaser.Scene, key: string, data?: object): void {
  if ((scene as Phaser.Scene & { __leaving?: boolean }).__leaving) return;
  (scene as Phaser.Scene & { __leaving?: boolean }).__leaving = true;
  const cam = scene.cameras.main;
  cam.fadeOut(260, 27, 20, 51);
  cam.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => scene.scene.start(key, data));
}

export function fadeIn(scene: Phaser.Scene): void {
  (scene as Phaser.Scene & { __leaving?: boolean }).__leaving = false;
  scene.cameras.main.fadeIn(260, 27, 20, 51);
}

export function banner(scene: Phaser.Scene, text: string, sub?: string, color = '#ffffff'): void {
  if (import.meta.env.DEV) ((window as unknown as { __banners: string[] }).__banners ??= []).push(`${scene.scene.key}: ${text}`);
  const t = scene.add
    .text(640, 300, text, { fontFamily: FONT, fontSize: '72px', color, stroke: '#1b1433', strokeThickness: 12, align: 'center' })
    .setOrigin(0.5)
    .setDepth(950)
    .setScale(0);
  scene.tweens.add({ targets: t, scale: 1, duration: 380, ease: 'Back.Out' });
  scene.tweens.add({ targets: t, alpha: 0, delay: 1500, duration: 400, onComplete: () => t.destroy() });
  if (sub) {
    const s = scene.add
      .text(640, 375, sub, { fontFamily: FONT, fontSize: '30px', color: '#ffffff', stroke: '#1b1433', strokeThickness: 7, align: 'center' })
      .setOrigin(0.5)
      .setDepth(950)
      .setAlpha(0);
    scene.tweens.add({ targets: s, alpha: 1, delay: 200, duration: 250 });
    scene.tweens.add({ targets: s, alpha: 0, delay: 1500, duration: 400, onComplete: () => s.destroy() });
  }
}
