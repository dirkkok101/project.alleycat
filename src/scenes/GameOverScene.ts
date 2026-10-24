import Phaser from 'phaser';
import { AudioEngine } from '../audio';
import { fitHeight } from '../assets';
import { FONT, fadeIn, sparkles, wipeTo } from '../fx';
import { game } from '../state';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create(): void {
    this.scene.stop('Hud');
    const s = game.session;
    const isNew = game.commitHiScore();
    this.add.image(640, 360, 'bg_title').setDisplaySize(1280, 720);
    this.add.rectangle(640, 360, 1280, 720, 0x1b1433, 0.55);
    this.add
      .text(640, 150, 'GAME OVER', { fontFamily: FONT, fontSize: '110px', color: '#ff55ff', stroke: '#1b1433', strokeThickness: 14 })
      .setOrigin(0.5);
    const cat = fitHeight(this.add.image(640, 330, 'cat_hurt'), 140);
    this.tweens.add({ targets: cat, angle: 6, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.add
      .text(640, 450, `Score ${s.score.toLocaleString()}`, { fontFamily: FONT, fontSize: '54px', color: '#ffffff', stroke: '#1b1433', strokeThickness: 10 })
      .setOrigin(0.5);
    this.add
      .text(640, 510, `Rooms won ${s.roomsWon} · Kisses ${s.kisses}`, { fontFamily: FONT, fontSize: '30px', color: '#d8d0ff' })
      .setOrigin(0.5);
    if (isNew) {
      const t = this.add
        .text(640, 570, 'NEW HIGH SCORE!', { fontFamily: FONT, fontSize: '46px', color: '#ffe36e', stroke: '#1b1433', strokeThickness: 9 })
        .setOrigin(0.5);
      this.tweens.add({ targets: t, scale: 1.12, duration: 400, yoyo: true, repeat: -1 });
      this.time.addEvent({ delay: 500, loop: true, callback: () => sparkles(this, 640 + (Math.random() - 0.5) * 500, 570, 8, 0xffe36e) });
    } else {
      this.add.text(640, 570, `High score ${game.hiScore.toLocaleString()}`, { fontFamily: FONT, fontSize: '32px', color: '#ffffff' }).setOrigin(0.5);
    }
    const prompt = this.add
      .text(640, 650, 'Press SPACE or tap to try again', { fontFamily: FONT, fontSize: '34px', color: '#55ffff', stroke: '#1b1433', strokeThickness: 8 })
      .setOrigin(0.5);
    this.tweens.add({ targets: prompt, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });

    AudioEngine.get().playMusic('gameover', 200);
    // Small delay so a held jump key doesn't skip the screen.
    this.time.delayedCall(900, () => {
      this.input.keyboard!.once('keydown-SPACE', () => wipeTo(this, 'Title'));
      this.input.once('pointerdown', () => wipeTo(this, 'Title'));
    });
    fadeIn(this);
  }
}
