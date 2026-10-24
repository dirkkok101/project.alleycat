import '@fontsource/fredoka/latin-600.css';
import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { TitleScene } from './scenes/TitleScene';
import { HudScene } from './scenes/HudScene';
import { AlleyScene } from './scenes/AlleyScene';
import { FishbowlScene } from './scenes/FishbowlScene';
import { UnderwaterScene } from './scenes/UnderwaterScene';
import { BookcaseScene } from './scenes/BookcaseScene';
import { CheeseScene } from './scenes/CheeseScene';
import { BirdcageScene } from './scenes/BirdcageScene';
import { DogsScene } from './scenes/DogsScene';
import { LoveScene } from './scenes/LoveScene';
import { GameOverScene } from './scenes/GameOverScene';
import { installDebug } from './debug';
import { AudioEngine } from './audio';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 1280,
  height: 720,
  backgroundColor: '#1b1433',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  input: { gamepad: true },
  audio: { noAudio: true },
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: 0, y: 2000 }, fps: 60, debug: false },
  },
  scene: [
    BootScene, TitleScene, AlleyScene, FishbowlScene, UnderwaterScene, BookcaseScene,
    CheeseScene, BirdcageScene, DogsScene, LoveScene, GameOverScene, HudScene,
  ],
});

// Unlock audio inside a real DOM gesture; Phaser's own input events arrive a frame later,
// outside the gesture, which iOS Safari rejects.
const unlockAudio = () => void AudioEngine.get().unlock().catch(() => undefined);
window.addEventListener('pointerdown', unlockAudio, { once: true });
window.addEventListener('keydown', unlockAudio, { once: true });

if (import.meta.env.DEV) installDebug(game);
