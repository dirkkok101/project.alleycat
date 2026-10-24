import Phaser from 'phaser';
import { AudioEngine } from '../audio';
import { FONT } from '../fx';
import { game } from '../state';

const STYLE = { fontFamily: FONT, fontSize: '28px', color: '#ffffff', stroke: '#1b1433', strokeThickness: 7 };

/** Score, lives, level, bonus timer and air meter, drawn over gameplay. */
export class HudScene extends Phaser.Scene {
  private scoreText!: Phaser.GameObjects.Text;
  private hiText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private bonusText!: Phaser.GameObjects.Text;
  private lives: Phaser.GameObjects.Image[] = [];
  private gift!: Phaser.GameObjects.Image;
  private airBar!: Phaser.GameObjects.Rectangle;
  private airBack!: Phaser.GameObjects.Rectangle;
  private muteText!: Phaser.GameObjects.Text;
  private shownScore = 0;
  private pauseText!: Phaser.GameObjects.Text;

  constructor() {
    super('Hud');
  }

  create(): void {
    this.shownScore = game.session.score;
    const g = this.add.graphics();
    g.fillStyle(0x1b1433, 0.6);
    g.fillRoundedRect(-20, -20, 1320, 64, 18);
    this.scoreText = this.add.text(16, 6, '', STYLE);
    this.hiText = this.add.text(1110, 10, '', { ...STYLE, fontSize: '22px', color: '#d8d0ff' }).setOrigin(1, 0);
    this.levelText = this.add.text(1264, 10, '', { ...STYLE, fontSize: '22px' }).setOrigin(1, 0);
    this.bonusText = this.add.text(640, 48, '', { ...STYLE, fontSize: '24px', color: '#ffe36e' }).setOrigin(0.5, 0);
    this.lives = [];
    for (let i = 0; i < 9; i++) {
      const img = this.add.image(500 + i * 34, 22, 'heart');
      img.setScale(28 / Math.max(img.width, img.height));
      this.lives.push(img);
    }
    this.gift = this.add.image(820, 22, 'gift').setVisible(false);
    this.gift.setScale(32 / this.gift.height);
    this.airBack = this.add.rectangle(640, 96, 304, 18, 0x1b1433, 0.8).setStrokeStyle(3, 0xffffff).setVisible(false);
    this.airBar = this.add.rectangle(490, 96, 300, 14, 0x55ffff).setOrigin(0, 0.5).setVisible(false);
    this.muteText = this.add.text(1264, 48, '', { ...STYLE, fontSize: '18px' }).setOrigin(1, 0).setInteractive();
    this.muteText.on('pointerdown', () => this.toggleMute());
    this.input.keyboard!.on('keydown-M', () => this.toggleMute());
    this.input.keyboard!.on('keydown-P', () => this.togglePause());
    this.input.keyboard!.on('keydown-ESC', () => this.togglePause());
    this.pauseText = this.add
      .text(640, 360, 'PAUSED\nP to resume', { ...STYLE, fontSize: '64px', align: 'center', backgroundColor: '#1b1433cc', padding: { x: 40, y: 24 } })
      .setOrigin(0.5)
      .setVisible(false);
  }

  private togglePause(): void {
    const gameplay = this.scene.manager.getScenes(false).find((s) => s.scene.key !== 'Hud' && (s.scene.isActive() || s.scene.isPaused()));
    if (!gameplay) return;
    if (gameplay.scene.isPaused()) {
      gameplay.scene.resume();
      this.pauseText.setVisible(false);
    } else {
      gameplay.scene.pause();
      this.pauseText.setVisible(true);
    }
  }

  private toggleMute(): void {
    const a = AudioEngine.get();
    a.setMuted(!a.muted);
  }

  update(): void {
    const s = game.session;
    // Roll the score up instead of snapping, it feels more arcade.
    this.shownScore += Math.ceil((s.score - this.shownScore) * 0.2);
    if (this.shownScore > s.score) this.shownScore = s.score;
    this.scoreText.setText(`SCORE ${this.shownScore.toLocaleString()}`);
    this.hiText.setText(`HI ${Math.max(game.hiScore, s.score).toLocaleString()}`);
    this.levelText.setText(`LV ${s.level + 1}`);
    this.lives.forEach((img, i) => img.setVisible(i < s.lives));
    this.lives.forEach((img, i) => (img.x = 640 - ((s.lives - 1) * 34) / 2 + i * 34));
    this.gift.x = 640 + (s.lives * 34) / 2 + 26;
    this.gift.setVisible(s.hasGift);
    const bonus = this.registry.get('bonus') as number | null;
    this.bonusText.setText(bonus == null ? '' : `BONUS ${bonus.toLocaleString()}`);
    const air = this.registry.get('air') as number | null;
    this.airBack.setVisible(air != null);
    this.airBar.setVisible(air != null);
    if (air != null) {
      this.airBar.width = 300 * Phaser.Math.Clamp(air, 0, 1);
      this.airBar.fillColor = air < 0.3 ? 0xff55ff : 0x55ffff;
    }
    this.muteText.setText(AudioEngine.get().muted ? '🔇 M' : '🔊 M');
  }
}
