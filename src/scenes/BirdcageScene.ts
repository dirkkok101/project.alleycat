import Phaser from 'phaser';
import { AudioEngine } from '../audio';
import { fitHeight } from '../assets';
import { hitStop, popText, puff, shake, sparkles } from '../fx';
import { FLOOR_Y, RoomScene } from './RoomScene';

const TABLE_X = 760;
const TABLE_H = 160;
const TABLE_W = 300;

/** Room 5: shove the birdcage off the table, then catch the canary. */
export class BirdcageScene extends RoomScene {
  readonly roomId = 'birdcage' as const;
  readonly bgKey = 'bg_bedroom' as const;
  readonly title = 'Tweet Tweet!';
  readonly hint = 'Push the cage off the table, then catch the bird';
  private cage!: Phaser.GameObjects.Image;
  private bird!: Phaser.GameObjects.Image;
  private phase: 'caged' | 'falling' | 'free' = 'caged';
  private pushCooldown = 0;
  private target = new Phaser.Math.Vector2();
  private restUntil = 0;
  private tableTop = FLOOR_Y - TABLE_H;
  private perches: [number, number][] = [];

  constructor() {
    super('Birdcage');
  }

  protected buildRoom(): void {
    this.phase = 'caged';
    this.pushCooldown = 0;
    const table = this.add.image(TABLE_X, FLOOR_Y, 'table').setOrigin(0.5, 1).setDepth(-2);
    table.setDisplaySize(TABLE_W, TABLE_H);
    this.addLedge(TABLE_X, this.tableTop + 8, TABLE_W * 0.95);
    this.cage = fitHeight(this.add.image(TABLE_X, this.tableTop + 10, 'birdcage').setOrigin(0.5, 1).setDepth(20), 120);
    this.bird = fitHeight(this.add.image(this.cage.x, this.cage.y - 45, 'canary').setDepth(19), 34);
    this.perches = [];
    for (const [x, y, w] of [[330, 470, 200], [1130, 440, 200], [560, 330, 180], [980, 300, 180], [760, 190, 160]] as const) {
      const s = this.add.image(x, y, 'shelf').setOrigin(0.5, 0).setDepth(-2);
      s.setScale(w / s.width, Math.min(w / s.width, 18 / s.height));
      this.addLedge(x, y, w);
      this.perches.push([x, y]);
    }
  }

  protected updateRoom(dt: number): void {
    if (this.phase === 'caged') this.updateCage();
    else if (this.phase === 'free') this.updateBird(dt);
    if (this.phase === 'caged') {
      this.bird.setPosition(this.cage.x, this.cage.y - 45 + Math.sin(this.time.now / 200) * 3);
    }
  }

  private updateCage(): void {
    const cat = this.cat;
    const dx = cat.x - this.cage.x;
    const dy = Math.abs(cat.y - (this.cage.y - 50));
    if (this.time.now < this.pushCooldown || dy > 60 || Math.abs(dx) > 60) return;
    const dir = dx < 0 ? 1 : -1; // push away from the cat
    this.pushCooldown = this.time.now + 500;
    const step = 34;
    this.tweens.add({ targets: this.cage, x: this.cage.x + dir * step, duration: 120, ease: 'Quad.Out' });
    this.tweens.add({ targets: this.cage, angle: dir * 8, duration: 80, yoyo: true });
    AudioEngine.get().play('push');
    AudioEngine.get().play('tweet', { volume: 0.6 });
    puff(this, this.cage.x - dir * 40, this.cage.y - 10, 4);
    // Each shove bounces the cat back, like the original.
    cat.knock(-dir, 260, 300);
    if (Math.abs(this.cage.x + dir * step - TABLE_X) > TABLE_W / 2) this.dropCage(dir);
  }

  private dropCage(dir: number): void {
    this.phase = 'falling';
    this.tweens.add({ targets: this.cage, x: this.cage.x + dir * 70, duration: 500 });
    this.tweens.add({
      targets: this.cage,
      y: FLOOR_Y,
      angle: dir * 80,
      duration: 500,
      ease: 'Quad.In',
      onComplete: () => {
        shake(this, 0.01);
        AudioEngine.get().play('thud');
        puff(this, this.cage.x, FLOOR_Y - 10, 10);
        this.phase = 'free';
        this.pickTarget();
        popText(this, this.cage.x, FLOOR_Y - 120, 'Free bird!', '#fff07a');
      },
    });
  }

  private pickTarget(): void {
    // Sometimes perch on a shelf (an easy catch), sometimes flutter in the air.
    if (Math.random() < 0.35) {
      const [x, y] = this.perches[Math.floor(Math.random() * this.perches.length)];
      this.target.set(x + (Math.random() - 0.5) * 80, y - 16);
      this.restUntil = -1;
    } else {
      this.target.set(120 + Math.random() * 1040, 150 + Math.random() * 400);
      this.restUntil = 0;
    }
  }

  private updateBird(dt: number): void {
    const b = this.bird;
    const speed = 170 + this.diff.dogSpeed * 0.4;
    const d = Phaser.Math.Distance.Between(b.x, b.y, this.target.x, this.target.y);
    const now = this.elapsed;
    if (d < 6) {
      if (this.restUntil === -1) this.restUntil = now + 1.2 + Math.random();
      if (this.restUntil > 0 && now < this.restUntil) {
        b.setTexture('canary');
        fitHeight(b, 34);
      } else this.pickTarget();
    } else {
      const k = Math.min(1, (speed * dt) / d);
      b.x += (this.target.x - b.x) * k;
      b.y += (this.target.y - b.y) * k + Math.sin(this.time.now / 70) * 0.8;
      b.setFlipX(this.target.x < b.x);
      b.setTexture(Math.floor(this.time.now / 90) % 2 ? 'canary_fly' : 'canary');
      fitHeight(b, 34);
    }
    // Startled: flee when the cat comes close and is airborne.
    const cd = Phaser.Math.Distance.Between(b.x, b.y, this.cat.x, this.cat.y);
    if (cd < 150 && this.restUntil !== -1 && Math.random() < 0.02) this.pickTarget();
    if (cd < 44 && !this.cat.stunned) {
      AudioEngine.get().play('tweet');
      hitStop(this, 90);
      sparkles(this, b.x, b.y, 14, 0xfff07a);
      b.setVisible(false);
      this.win();
    }
  }
}
