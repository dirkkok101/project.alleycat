import Phaser from 'phaser';
import { AudioEngine } from '../audio';
import { fitHeight } from '../assets';
import { hitStop, popText, sparkles } from '../fx';
import { FLOOR_Y, RoomScene } from './RoomScene';

const CHEESE_W = 560;
const CHEESE_H = 300;

interface Hole {
  x: number;
  y: number;
  mouse: Phaser.GameObjects.Image;
  until: number;
}

/** Room 4: mice pop out of the cheese holes; pounce on them. */
export class CheeseScene extends RoomScene {
  readonly roomId = 'cheese' as const;
  readonly bgKey = 'bg_kitchen' as const;
  readonly title = 'Say Cheese!';
  readonly hint = 'Pounce on the mice peeking out of the holes';
  private holes: Hole[] = [];
  private caught = 0;
  private needed = 5;
  private nextPeek = 0;
  private counter!: Phaser.GameObjects.Text;

  constructor() {
    super('Cheese');
  }

  protected buildRoom(): void {
    this.holes = [];
    this.caught = 0;
    this.needed = this.diff.cheeseMice;
    this.nextPeek = 1;
    const cx = 680;
    const cheese = this.add.image(cx, FLOOR_Y, 'cheese').setOrigin(0.5, 1).setDepth(-2);
    cheese.setDisplaySize(CHEESE_W, CHEESE_H);
    this.addLedge(cx, FLOOR_Y - CHEESE_H + 30, CHEESE_W * 0.85);
    // Counters on both sides give a way up to the top row of holes.
    for (const x of [170, 1160]) {
      const t = fitHeight(this.add.image(x, FLOOR_Y, 'table').setOrigin(0.5, 1).setDepth(-2), 170);
      this.addLedge(x, FLOOR_Y - 170 + 8, t.displayWidth * 0.9);
    }
    const spots: [number, number][] = [
      [-170, -205], [0, -215], [170, -205],
      [-200, -90], [0, -100], [200, -90],
    ];
    for (const [dx, dy] of spots) {
      const x = cx + dx;
      const y = FLOOR_Y + dy;
      this.add.ellipse(x, y, 58, 44, 0x6b4a10, 0.85).setDepth(-1);
      const mouse = fitHeight(this.add.image(x, y + 6, 'mouse_peek').setOrigin(0.5, 1).setDepth(-1), 44).setVisible(false);
      this.holes.push({ x, y, mouse, until: 0 });
    }
    this.counter = this.add
      .text(cx, FLOOR_Y - CHEESE_H - 40, '', { fontFamily: 'Fredoka', fontSize: '30px', color: '#ffffff', stroke: '#1b1433', strokeThickness: 7 })
      .setOrigin(0.5);
    this.updateCounter();
  }

  private updateCounter(): void {
    this.counter.setText(`🐭 ${this.caught} / ${this.needed}`);
  }

  protected updateRoom(): void {
    const now = this.elapsed;
    if (now >= this.nextPeek) {
      const free = this.holes.filter((h) => !h.mouse.visible);
      const h = free[Math.floor(Math.random() * free.length)];
      if (h) {
        h.until = now + Math.max(1.1, 2.3 - this.diff.broomChase);
        h.mouse.setVisible(true).setY(h.y + 30);
        this.tweens.add({ targets: h.mouse, y: h.y + 6, duration: 160, ease: 'Back.Out' });
        AudioEngine.get().play('squeak', { volume: 0.5, pan: (h.x - 640) / 640 });
      }
      this.nextPeek = now + 0.8 + Math.random() * 0.9;
    }
    for (const h of this.holes) {
      if (!h.mouse.visible) continue;
      if (now >= h.until) {
        this.tweens.add({ targets: h.mouse, y: h.y + 30, duration: 120, onComplete: () => h.mouse.setVisible(false) });
        h.until = Infinity;
        continue;
      }
      if (h.until !== Infinity && Math.abs(h.x - this.cat.x) < 44 && Math.abs(h.y - 14 - this.cat.y) < 46 && !this.cat.stunned) {
        h.until = Infinity;
        h.mouse.setVisible(false);
        this.caught++;
        this.updateCounter();
        AudioEngine.get().play('catch', { pitch: 1 + this.caught * 0.06 });
        AudioEngine.get().play('squeak');
        hitStop(this, 60);
        sparkles(this, h.x, h.y, 10);
        popText(this, h.x, h.y - 30, 'Got it!', '#ffe36e');
        if (this.caught >= this.needed) this.win();
      }
    }
  }
}
