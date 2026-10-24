import Phaser from 'phaser';
import { AudioEngine } from '../audio';
import { fitHeight } from '../assets';
import { FONT, puff } from '../fx';
import type { Cat } from './Cat';

/**
 * The mischievous broom: never kills, but sweeps pawprints and shoves the
 * cat around (sometimes right out of the window).
 */
export class Broom {
  readonly img: Phaser.GameObjects.Image;
  readonly body: Phaser.Physics.Arcade.Body;
  private prints: Phaser.GameObjects.Image[] = [];
  private lastPrintX = 0;
  private wanderDir = 1;
  private nextThink = 0;
  private hitCooldown = 0;

  constructor(
    private scene: Phaser.Scene,
    x: number,
    private floorY: number,
    private speed: number,
    private chase: number,
  ) {
    this.img = fitHeight(scene.add.image(x, floorY, 'broom').setOrigin(0.5, 1).setDepth(400), 104);
    scene.physics.add.existing(this.img);
    this.body = this.img.body as Phaser.Physics.Arcade.Body;
    this.body.setAllowGravity(false);
    // Only the bristles push; the handle is decoration so the cat can hop over.
    this.body.setSize(this.img.width * 0.45, this.img.height * 0.4);
    this.body.setOffset(this.img.width * 0.275, this.img.height * 0.6);
  }

  update(cat: Cat, onFloor: boolean, onShove: (dir: number) => void): void {
    const now = this.scene.time.now;
    this.trackPrints(cat, onFloor);

    if (now > this.nextThink) {
      this.nextThink = now + 400;
      const print = this.prints[0];
      if (print) this.wanderDir = Math.sign(print.x - this.img.x) || 1;
      else if (onFloor && Math.random() < this.chase + 0.25) this.wanderDir = Math.sign(cat.x - this.img.x) || 1;
      else if (Math.random() < 0.3) this.wanderDir *= -1;
    }
    if (this.img.x < 140) this.wanderDir = 1;
    if (this.img.x > 1200) this.wanderDir = -1;
    this.body.setVelocityX(this.wanderDir * this.speed);
    this.img.setFlipX(this.wanderDir < 0);
    // Sweeping wobble
    this.img.setAngle(Math.sin(now / 90) * 8);

    for (let i = this.prints.length - 1; i >= 0; i--) {
      if (Math.abs(this.prints[i].x - this.img.x) < 20) {
        puff(this.scene, this.prints[i].x, this.floorY - 4, 3, 0xd8c8a0);
        this.prints[i].destroy();
        this.prints.splice(i, 1);
      }
    }

    if (now > this.hitCooldown && !cat.invulnerable && this.scene.physics.overlap(this.img, cat.phys)) {
      this.hitCooldown = now + 1400;
      const dir = this.wanderDir;
      AudioEngine.get().play('sweep');
      cat.knock(dir, 340, 450);
      // Back off briefly so the cat gets a window to hop over.
      this.wanderDir *= -1;
      this.nextThink = now + 900;
      onShove(dir);
    }
  }

  private trackPrints(cat: Cat, onFloor: boolean): void {
    if (!onFloor || !cat.onGround) return;
    if (Math.abs(cat.x - this.lastPrintX) < 70) return;
    this.lastPrintX = cat.x;
    const p = this.scene.add.image(cat.x, this.floorY - 3, 'pawprint').setDepth(5).setAlpha(0.7);
    p.setScale(16 / p.height);
    this.prints.push(p);
    if (this.prints.length > 8) this.prints.shift()?.destroy();
  }
}

/** Grumpy bulldog that trots across the ground. Touching it costs a life. */
export class Bulldog {
  readonly img: Phaser.GameObjects.Image;
  readonly body: Phaser.Physics.Arcade.Body;
  active = false;
  pending = false;
  leaving = false;
  private dir = 1;
  private frame = 0;
  private barkAt = 0;

  constructor(private scene: Phaser.Scene, private floorY: number, private speed: number) {
    this.img = fitHeight(scene.add.image(-200, floorY, 'bulldog_walk1').setOrigin(0.5, 1).setDepth(450), 96);
    scene.physics.add.existing(this.img);
    this.body = this.img.body as Phaser.Physics.Arcade.Body;
    this.body.setAllowGravity(false);
    this.body.setSize(this.img.width * 0.7, this.img.height * 0.6);
    this.body.setOffset(this.img.width * 0.15, this.img.height * 0.4);
    this.img.setVisible(false);
  }

  /** Bark a warning from the side furthest from x, then charge in a moment later. */
  enter(towardX: number): void {
    if (this.active || this.pending) return;
    this.pending = true;
    const dir = towardX > 640 ? -1 : 1;
    const edgeX = dir > 0 ? 50 : 1230;
    const warn = this.scene.add
      .text(edgeX, this.floorY - 70, dir > 0 ? 'WOOF! ▶' : '◀ WOOF!', { fontFamily: FONT, fontSize: '30px', color: '#ff9ec7', stroke: '#1b1433', strokeThickness: 7 })
      .setOrigin(dir > 0 ? 0 : 1, 0.5)
      .setDepth(900);
    this.scene.tweens.add({ targets: warn, scale: 1.15, duration: 150, yoyo: true, repeat: 3 });
    AudioEngine.get().play('bark', { pan: dir > 0 ? -0.8 : 0.8 });
    AudioEngine.get().setLayer('danger', true);
    this.scene.time.delayedCall(1100, () => {
      warn.destroy();
      this.pending = false;
      this.active = true;
      this.leaving = false;
      this.dir = dir;
      this.img.setPosition(dir > 0 ? -80 : 1360, this.floorY).setVisible(true);
      this.barkAt = 0;
    });
  }

  update(cat: Cat, catOnGround: boolean): boolean {
    if (!this.active) return false;
    const now = this.scene.time.now;
    // Chase the cat while it is on the ground, otherwise trot across and leave.
    if (!this.leaving && catOnGround && Math.abs(cat.x - this.img.x) < 500) this.dir = Math.sign(cat.x - this.img.x) || this.dir;
    this.body.setVelocityX(this.dir * this.speed);
    this.frame += (this.speed / 60) * 0.03;
    const barking = now < this.barkAt + 300;
    this.img.setTexture(barking ? 'bulldog_bark' : Math.floor(this.frame) % 2 ? 'bulldog_walk2' : 'bulldog_walk1');
    fitHeight(this.img, 96);
    this.img.setFlipX(this.dir < 0);
    this.img.y = this.floorY - Math.abs(Math.sin(this.frame * Math.PI)) * 3;
    if (now > this.barkAt + 2500 && Math.abs(cat.x - this.img.x) < 300) {
      this.barkAt = now;
      AudioEngine.get().play('bark', { volume: 0.7 });
    }
    if (this.img.x < -150 || this.img.x > 1430) {
      this.active = false;
      this.img.setVisible(false);
      this.body.setVelocity(0, 0);
      AudioEngine.get().setLayer('danger', false);
      return false;
    }
    return !cat.invulnerable && this.scene.physics.overlap(this.img, cat.phys);
  }

  leave(): void {
    if (!this.active) return;
    this.leaving = true;
    this.dir = this.img.x < 640 ? -1 : 1;
  }
}
