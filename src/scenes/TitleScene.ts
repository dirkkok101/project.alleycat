import Phaser from 'phaser';
import { AudioEngine } from '../audio';
import { fitHeight } from '../assets';
import { FONT, fadeIn, hearts, wipeTo } from '../fx';
import { SKILLS } from '../logic/rules';
import { game } from '../state';

export class TitleScene extends Phaser.Scene {
  private skill = 0;
  private skillText!: Phaser.GameObjects.Text;
  private started = false;

  constructor() {
    super('Title');
  }

  create(): void {
    this.started = false;
    this.scene.stop('Hud');
    this.add.image(640, 360, 'bg_title').setDisplaySize(1280, 720);
    this.add.rectangle(640, 360, 1280, 720, 0x1b1433, 0.25);

    const logo = this.add.container(640, 170);
    const shadow = this.add.text(6, 8, 'ALLEY CAT', { fontFamily: FONT, fontSize: '128px', color: '#ff55ff' }).setOrigin(0.5);
    const main = this.add
      .text(0, 0, 'ALLEY CAT', { fontFamily: FONT, fontSize: '128px', color: '#55ffff', stroke: '#1b1433', strokeThickness: 14 })
      .setOrigin(0.5);
    const sub = this.add
      .text(170, 78, 'Remeow!', { fontFamily: FONT, fontSize: '52px', color: '#ffffff', stroke: '#ff55ff', strokeThickness: 10 })
      .setOrigin(0.5)
      .setAngle(-8);
    logo.add([shadow, main, sub]);
    this.tweens.add({ targets: logo, y: 180, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.tweens.add({ targets: sub, scale: 1.08, duration: 500, yoyo: true, repeat: -1, ease: 'Sine.InOut' });

    const cat = fitHeight(this.add.image(470, 470, 'cat_idle'), 150);
    this.tweens.add({ targets: cat, y: 460, scaleY: cat.scaleY * 1.04, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    const girl = fitHeight(this.add.image(810, 470, 'girlcat'), 150);
    this.tweens.add({ targets: girl, angle: 4, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.time.addEvent({ delay: 1600, loop: true, callback: () => hearts(this, 640, 440, 2) });

    this.skillText = this.add
      .text(640, 580, '', { fontFamily: FONT, fontSize: '34px', color: '#ffffff', stroke: '#1b1433', strokeThickness: 8 })
      .setOrigin(0.5);
    this.updateSkill();
    const prompt = this.add
      .text(640, 640, 'Press SPACE or tap to play', { fontFamily: FONT, fontSize: '38px', color: '#ffe36e', stroke: '#1b1433', strokeThickness: 8 })
      .setOrigin(0.5);
    this.tweens.add({ targets: prompt, alpha: 0.35, duration: 600, yoyo: true, repeat: -1 });
    this.add
      .text(640, 690, '←→ move · SPACE/↑ jump · ↓ drop/sneak · M mute', { fontFamily: FONT, fontSize: '20px', color: '#d8d0ff' })
      .setOrigin(0.5);
    this.add
      .text(1260, 16, `HI ${game.hiScore.toLocaleString()}`, { fontFamily: FONT, fontSize: '26px', color: '#ffffff', stroke: '#1b1433', strokeThickness: 6 })
      .setOrigin(1, 0);

    const kb = this.input.keyboard!;
    kb.on('keydown-LEFT', () => this.changeSkill(-1));
    kb.on('keydown-RIGHT', () => this.changeSkill(1));
    kb.on('keydown-SPACE', () => this.start());
    kb.on('keydown-ENTER', () => this.start());
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      if (p.y > 555 && p.y < 605) this.changeSkill(p.x < 640 ? -1 : 1);
      else this.start();
    });
    fadeIn(this);
    AudioEngine.get().playMusic('title');
  }

  private changeSkill(d: number): void {
    this.skill = Phaser.Math.Clamp(this.skill + d, 0, SKILLS.length - 1);
    this.updateSkill();
    AudioEngine.get().play('uiSelect');
  }

  private updateSkill(): void {
    this.skillText.setText(`◀  Start as: ${SKILLS[this.skill]}  ▶`);
  }

  private start(): void {
    if (this.started) return;
    this.started = true;
    const audio = AudioEngine.get();
    // Never block the start on audio: a refused unlock just means a silent game.
    audio.unlock().then(() => {
      audio.play('uiStart');
      audio.play('meow');
    }, () => undefined);
    game.reset(this.skill);
    wipeTo(this, 'Alley', { from: 'start' });
  }
}
