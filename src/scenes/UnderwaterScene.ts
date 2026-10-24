import Phaser from 'phaser';
import { AudioEngine } from '../audio';
import { fitHeight, fitWidth } from '../assets';
import { popText, sparkles } from '../fx';
import { RoomScene } from './RoomScene';

const SURFACE_Y = 120;
const AIR_SECONDS = 14;

interface Fish {
  img: Phaser.GameObjects.Image;
  vx: number;
  vy: number;
  alive: boolean;
}

/** Room 2: inside the bowl. Eat every fish, dodge eels, come up for air. */
export class UnderwaterScene extends RoomScene {
  readonly roomId = 'underwater' as const;
  readonly bgKey = 'bg_underwater' as const;
  readonly title = 'Splash!';
  readonly hint = 'Eat all the fish · avoid eels · surface for air';
  protected music = 'fishbowl' as const;
  protected useBroom = false;
  protected useDog = false;
  protected useWindow = false;
  private fish: Fish[] = [];
  private eels: { img: Phaser.GameObjects.Image; dir: number; baseY: number; t: number; speed: number }[] = [];
  private air = 1;
  private lastBubble = 0;
  private surfaced = false;

  constructor() {
    super('Underwater');
  }

  protected buildRoom(): void {
    this.fish = [];
    this.eels = [];
    this.air = 1;
    this.physics.world.setBounds(30, SURFACE_Y - 70, 1220, 630);
    this.cat.setMode('swim');
    this.cat.body.reset(640, 200);
    this.add.rectangle(640, SURFACE_Y - 70, 1280, 140, 0xbff6ff, 0.35).setOrigin(0.5, 0).setDepth(-5);
    this.add.rectangle(640, SURFACE_Y, 1280, 4, 0xffffff, 0.6).setDepth(-5);
    fitWidth(this.add.image(640, 720, 'pebbles').setOrigin(0.5, 1).setDepth(-4), 1300);

    for (let i = 0; i < this.diff.fishCount; i++) {
      const img = fitHeight(this.add.image(200 + Math.random() * 900, 260 + Math.random() * 340, 'goldfish').setDepth(300), 40);
      this.fish.push({ img, vx: (Math.random() < 0.5 ? -1 : 1) * (60 + Math.random() * 60), vy: 0, alive: true });
    }
    for (let i = 0; i < this.diff.eelCount; i++) {
      const baseY = 300 + i * 140 + Math.random() * 60;
      const img = fitHeight(this.add.image(i % 2 ? 1300 : -20, baseY, 'eel').setDepth(310), 50);
      this.eels.push({ img, dir: i % 2 ? -1 : 1, baseY, t: Math.random() * 10, speed: 110 + this.diff.spiderSpeed * 0.6 });
    }
    // Ambient bubbles
    this.time.addEvent({
      delay: 400,
      loop: true,
      callback: () => {
        const b = this.add.image(Math.random() * 1280, 720, 'bubble').setDepth(-3).setAlpha(0.7);
        b.setScale((8 + Math.random() * 14) / b.height);
        this.tweens.add({ targets: b, y: SURFACE_Y, x: b.x + (Math.random() - 0.5) * 60, duration: 3000 + Math.random() * 2000, onComplete: () => b.destroy() });
      },
    });
  }

  protected updateRoom(dt: number): void {
    const cat = this.cat;
    // Air
    if (cat.y < SURFACE_Y + 10) {
      if (!this.surfaced && this.air < 0.9) AudioEngine.get().play('gulp');
      this.surfaced = true;
      this.air = Math.min(1, this.air + dt * 0.8);
    } else {
      this.surfaced = false;
      this.air -= dt / AIR_SECONDS;
    }
    this.registry.set('air', this.air);
    if (this.air < 0.3 && this.time.now - this.lastBubble > 600) {
      this.lastBubble = this.time.now;
      AudioEngine.get().play('tick', { volume: 0.5 });
    }
    if (this.air <= 0) {
      this.loseLife('Out of air!');
      return;
    }
    // Keep the cat from flying out of the water.
    if (cat.y < SURFACE_Y - 30 && cat.body.velocity.y < 0) cat.body.setVelocityY(cat.body.velocity.y * 0.85);

    for (const f of this.fish) {
      if (!f.alive) continue;
      const d = Phaser.Math.Distance.Between(f.img.x, f.img.y, cat.x, cat.y);
      // Fish dart away when the cat is close.
      if (d < 180) {
        f.vx += Math.sign(f.img.x - cat.x) * 300 * dt;
        f.vy += Math.sign(f.img.y - cat.y) * 200 * dt;
      } else if (Math.random() < 0.01) {
        f.vx = (Math.random() < 0.5 ? -1 : 1) * (60 + Math.random() * 60);
        f.vy = (Math.random() - 0.5) * 60;
      }
      f.vx = Phaser.Math.Clamp(f.vx, -190, 190);
      f.vy = Phaser.Math.Clamp(f.vy, -120, 120);
      f.img.x += f.vx * dt;
      f.img.y += f.vy * dt;
      if (f.img.x < 60 || f.img.x > 1220) f.vx = -f.vx;
      if (f.img.y < SURFACE_Y + 60 || f.img.y > 640) f.vy = -f.vy;
      f.img.x = Phaser.Math.Clamp(f.img.x, 60, 1220);
      f.img.y = Phaser.Math.Clamp(f.img.y, SURFACE_Y + 60, 640);
      f.img.setFlipX(f.vx < 0);
      if (d < 46 && !cat.stunned) {
        f.alive = false;
        AudioEngine.get().play('eat');
        sparkles(this, f.img.x, f.img.y, 8, 0xffb070);
        popText(this, f.img.x, f.img.y - 20, 'nom!', '#ffb070', 28);
        this.tweens.add({ targets: f.img, scale: 0, duration: 200, onComplete: () => f.img.setVisible(false) });
        if (this.fish.every((x) => !x.alive)) {
          this.registry.set('air', null);
          this.win();
        }
      }
    }

    for (const e of this.eels) {
      e.t += dt;
      e.img.x += e.dir * e.speed * dt;
      e.img.y = e.baseY + Math.sin(e.t * 2) * 40;
      if (e.img.x < -60) e.dir = 1;
      if (e.img.x > 1340) e.dir = -1;
      e.img.setFlipX(e.dir < 0);
      e.img.setTint(Math.sin(e.t * 12) > 0.6 ? 0xffffaa : 0xffffff);
      if (Math.abs(e.img.x - cat.x) < 55 && Math.abs(e.img.y - cat.y) < 30 && !cat.invulnerable) {
        AudioEngine.get().play('zap');
        this.loseLife('Bzzzt! Eel zap!');
        return;
      }
    }
  }
}
