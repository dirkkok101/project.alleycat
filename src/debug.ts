import type Phaser from 'phaser';
import { game as session } from './state';

// Dev-only hooks for automated play-testing from a headless browser.
const CODES: Record<string, number> = {
  ArrowLeft: 37, ArrowUp: 38, ArrowRight: 39, ArrowDown: 40, Space: 32, Enter: 13, KeyM: 77, KeyZ: 90,
};

function fire(type: 'keydown' | 'keyup', code: string): void {
  const e = new KeyboardEvent(type, { code, key: code === 'Space' ? ' ' : code, bubbles: true });
  Object.defineProperty(e, 'keyCode', { get: () => CODES[code] });
  Object.defineProperty(e, 'which', { get: () => CODES[code] });
  window.dispatchEvent(e);
}

export function installDebug(g: Phaser.Game): void {
  const activeScene = () => g.scene.getScenes(true).find((s) => s.scene.key !== 'Hud');
  Object.assign(window, {
    __keys: {
      down: (c: string) => fire('keydown', c),
      up: (c: string) => fire('keyup', c),
      hold: (c: string, ms: number) => {
        fire('keydown', c);
        setTimeout(() => fire('keyup', c), ms);
      },
    },
    __state: () => {
      const s = activeScene() as (Phaser.Scene & { cat?: { x: number; y: number; onGround: boolean } }) | undefined;
      const cat = s?.cat;
      return {
        scene: s?.scene.key,
        cat: cat ? { x: Math.round(cat.x), y: Math.round(cat.y), ground: cat.onGround, stun: (cat as unknown as { stunned: boolean }).stunned } : null,
        session: { ...session.session },
      };
    },
    __goto: (key: string, data?: object) => {
      const s = activeScene();
      if (s) s.scene.start(key, data);
    },
    __session: session,
    __scene: () => activeScene(),
  });
}
