import Phaser from 'phaser';
import { AudioEngine } from '../audio';
import { puff } from '../fx';
import type { Controls } from '../input';

const SIZE = 88; // displayed longest side of the cat art
const RUN_SPEED = 320;
const GROUND_ACCEL = 2600;
// Like the original, a running start is what gets you high: little air steering.
const AIR_ACCEL = 650;
const GROUND_DECEL = 3000;
const AIR_DECEL = 260;
const STAND_JUMP = 725;
const RUN_JUMP = 870;
const COYOTE_MS = 110;
const BUFFER_MS = 130;

export type CatMode = 'platform' | 'swim';

/**
 * The hero. Physics lives on an invisible zone so the art can squash and
 * stretch freely without resizing the body.
 */
export class Cat {
  readonly phys: Phaser.GameObjects.Zone;
  readonly body: Phaser.Physics.Arcade.Body;
  readonly img: Phaser.GameObjects.Image;
  facing = 1;
  mode: CatMode = 'platform';
  stunnedUntil = 0;
  invulnUntil = 0;
  dropUntil = 0;
  frozen = false;
  /** A scene tween is animating the art; leave it alone. */
  posed = false;
  dead = false;

  private lastGroundAt = -9999;
  private lastJumpPressAt = -9999;
  private jumpCut = false;
  private wasOnGround = false;
  private runPhase = 0;
  private sx = 1;
  private sy = 1;
  private sqTween?: Phaser.Tweens.Tween;

  constructor(private scene: Phaser.Scene, x: number, y: number) {
    this.phys = scene.add.zone(x, y, 44, 46);
    scene.physics.add.existing(this.phys);
    this.body = this.phys.body as Phaser.Physics.Arcade.Body;
    this.body.setCollideWorldBounds(true);
    this.body.setMaxVelocity(900, 1100);
    this.img = scene.add.image(x, y, 'cat_idle').setOrigin(0.5, 1).setDepth(500);
    this.setPose('cat_idle');
  }

  get x(): number {
    return this.body.center.x;
  }
  get y(): number {
    return this.body.center.y;
  }
  get bottom(): number {
    return this.body.bottom;
  }
  get onGround(): boolean {
    return this.body.blocked.down || this.body.touching.down;
  }
  get stunned(): boolean {
    return this.scene.time.now < this.stunnedUntil;
  }
  get invulnerable(): boolean {
    return this.scene.time.now < this.invulnUntil || this.dead;
  }
  get dropping(): boolean {
    return this.scene.time.now < this.dropUntil;
  }

  setMode(mode: CatMode): void {
    this.mode = mode;
    this.body.setGravityY(mode === 'swim' ? -1650 : 0);
    this.body.setDrag(mode === 'swim' ? 260 : 0, mode === 'swim' ? 260 : 0);
  }

  update(ctrl: Controls, _dt: number): void {
    const now = this.scene.time.now;
    if (this.dead) {
      this.syncImage();
      return;
    }
    if (this.frozen) {
      this.body.setVelocityX(0);
      this.syncImage();
      return;
    }
    if (this.mode === 'swim') this.updateSwim(ctrl);
    else this.updatePlatform(ctrl, now);
    this.syncImage();
  }

  private updatePlatform(ctrl: Controls, now: number): void {
    const b = this.body;
    const onGround = this.onGround;
    if (onGround) this.lastGroundAt = now;

    if (onGround && !this.wasOnGround && b.velocity.y >= 0) this.land();
    this.wasOnGround = onGround;

    if (this.stunned) {
      b.setAccelerationX(0);
      return;
    }

    const dir = (ctrl.right ? 1 : 0) - (ctrl.left ? 1 : 0);
    if (dir !== 0) {
      this.facing = dir;
      const turning = Math.sign(b.velocity.x) !== dir && Math.abs(b.velocity.x) > 10;
      const accel = (onGround ? GROUND_ACCEL : AIR_ACCEL) * (turning ? 1.8 : 1);
      b.setAccelerationX(dir * accel);
      b.setMaxVelocityX(ctrl.down && onGround ? RUN_SPEED * 0.4 : RUN_SPEED);
    } else {
      b.setAccelerationX(0);
      const v = b.velocity.x;
      const dv = (onGround ? GROUND_DECEL : AIR_DECEL) * (1 / 60);
      b.setVelocityX(Math.abs(v) <= dv ? 0 : v - Math.sign(v) * dv);
    }

    if (ctrl.jumpPressed) this.lastJumpPressAt = now;
    const canJump = now - this.lastGroundAt <= COYOTE_MS;
    if (now - this.lastJumpPressAt <= BUFFER_MS && canJump && !(ctrl.down && onGround)) {
      this.doJump();
    }

    // Variable jump height: releasing early cuts the rise.
    if (!ctrl.jump && b.velocity.y < -200 && !this.jumpCut) {
      b.setVelocityY(b.velocity.y * 0.5);
      this.jumpCut = true;
    }
    // Floaty apex while jump is held, as in Celeste.
    b.setGravityY(ctrl.jump && Math.abs(b.velocity.y) < 140 ? -900 : 0);

    if (ctrl.downPressed && onGround) this.dropUntil = now + 220;
  }

  private updateSwim(ctrl: Controls): void {
    const b = this.body;
    if (this.stunned) {
      b.setAcceleration(0, 0);
      return;
    }
    const dx = (ctrl.right ? 1 : 0) - (ctrl.left ? 1 : 0);
    const dy = (ctrl.down ? 1 : 0) - (ctrl.up ? 1 : 0);
    if (dx) this.facing = dx;
    b.setMaxVelocity(270, 300);
    b.setAcceleration(dx * 900, dy * 700);
    if (ctrl.jumpPressed) {
      b.setVelocityY(Math.min(b.velocity.y, -260));
      AudioEngine.get().play('bubble');
      this.squash(0.8, 1.2);
    }
  }

  doJump(power = 1): void {
    const b = this.body;
    const run = Phaser.Math.Clamp(Math.abs(b.velocity.x) / RUN_SPEED, 0, 1);
    b.setVelocityY(-(STAND_JUMP + (RUN_JUMP - STAND_JUMP) * run) * power);
    this.lastGroundAt = -9999;
    this.lastJumpPressAt = -9999;
    this.jumpCut = false;
    this.squash(0.7, 1.3);
    puff(this.scene, this.x, this.bottom, 4);
    AudioEngine.get().play('jump');
  }

  /** Spring-assisted jump (trash can lids, etc). */
  bounce(power: number): void {
    this.doJump(power);
    this.jumpCut = true;
  }

  private land(): void {
    this.squash(1.3, 0.72);
    if (this.scene.time.now - this.lastGroundAt > 200) {
      puff(this.scene, this.x, this.bottom, 5);
      AudioEngine.get().play('land', { volume: 0.6 });
    }
  }

  squash(sx: number, sy: number): void {
    this.sqTween?.stop();
    this.sx = sx;
    this.sy = sy;
    this.sqTween = this.scene.tweens.add({ targets: this, sx: 1, sy: 1, duration: 220, ease: 'Back.Out' });
  }

  /** Knocked by something: stunned and shoved, but not killed. */
  knock(dirX: number, upward = 420, stunMs = 650): void {
    if (this.dead) return;
    this.stunnedUntil = this.scene.time.now + stunMs;
    this.body.setAccelerationX(0);
    this.body.setVelocity(dirX * 380, -upward);
    this.squash(1.25, 0.8);
  }

  hurtFlash(ms = 1500): void {
    this.invulnUntil = this.scene.time.now + ms;
    this.scene.tweens.add({ targets: this.img, alpha: 0.35, yoyo: true, repeat: Math.floor(ms / 160), duration: 80, onComplete: () => this.img.setAlpha(1) });
  }

  /** Cartoon death hop; calls back once off screen. */
  die(onDone: () => void): void {
    if (this.dead) return;
    this.dead = true;
    this.body.setAcceleration(0, 0);
    this.body.setGravityY(0);
    this.body.checkCollision.none = true;
    this.body.setCollideWorldBounds(false);
    this.body.setVelocity(0, -700);
    this.setPose('cat_hurt');
    this.scene.tweens.add({ targets: this.img, angle: 540, duration: 1200 });
    this.scene.time.delayedCall(1300, onDone);
  }

  setPose(key: string): void {
    if (this.img.texture.key !== key) this.img.setTexture(key);
  }

  private syncImage(): void {
    if (this.posed) return;
    const b = this.body;
    let pose = 'cat_idle';
    if (this.dead || this.stunned) pose = 'cat_hurt';
    else if (this.mode === 'swim') pose = 'cat_swim';
    else if (!this.onGround) pose = b.velocity.y < 0 ? 'cat_jump' : 'cat_fall';
    else if (Math.abs(b.velocity.x) > 30) {
      this.runPhase += Math.abs(b.velocity.x) * 0.0006 * 16;
      pose = Math.floor(this.runPhase) % 2 === 0 ? 'cat_run1' : 'cat_run2';
    }
    if (!this.frozen || this.dead) this.setPose(pose);

    const base = SIZE / Math.max(this.img.width, this.img.height);
    // A little bob while running sells the gait even with two frames.
    const bob = pose.startsWith('cat_run') ? Math.abs(Math.sin(this.runPhase * Math.PI)) * 4 : 0;
    this.img.setScale(base * this.sx * (this.facing < 0 ? -1 : 1), base * this.sy);
    this.img.setPosition(b.center.x, b.bottom + 3 - bob);
    if (this.mode === 'swim' && !this.dead) this.img.setAngle(Phaser.Math.Clamp(b.velocity.y * 0.04, -20, 20) * this.facing);
    else if (!this.dead) this.img.setAngle(this.onGround ? 0 : Phaser.Math.Clamp(b.velocity.y * 0.012, -10, 12) * this.facing);
  }
}
