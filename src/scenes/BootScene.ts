import Phaser from 'phaser';
import { setupCamera } from '../display';
import { preloadAll } from '../assets';
import { FONT } from '../fx';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload(): void {
    setupCamera(this);
    const bar = this.add.rectangle(640, 380, 4, 18, 0x55ffff).setOrigin(0, 0.5);
    this.add.rectangle(640, 380, 404, 26).setStrokeStyle(3, 0xff55ff).setOrigin(0.5);
    bar.x = 440;
    this.add.text(640, 330, 'loading purrs…', { fontFamily: FONT, fontSize: '28px', color: '#ffffff' }).setOrigin(0.5);
    this.load.on(Phaser.Loader.Events.PROGRESS, (p: number) => (bar.width = 400 * p));
    preloadAll(this);
  }

  async create(): Promise<void> {
    try {
      await document.fonts.load(`600 32px Fredoka`);
    } catch {
      // fall back to system rounded font
    }
    this.scene.start('Title');
  }
}
