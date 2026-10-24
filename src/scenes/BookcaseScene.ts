import Phaser from 'phaser';
import { AudioEngine } from '../audio';
import { fitHeight } from '../assets';
import { popText, sparkles } from '../fx';
import { FLOOR_Y, RoomScene } from './RoomScene';

// Wall shelves as [x, y, width]; staggered so there are several routes up.
const SHELVES: [number, number, number][] = [
  [330, 560, 220], [640, 520, 200], [950, 560, 220],
  [480, 420, 200], [800, 420, 200], [1150, 450, 180],
  [300, 300, 200], [640, 310, 180], [980, 300, 200],
  [460, 180, 200], [820, 180, 200], [1160, 200, 160],
];
const FERN_SPOTS: [number, number][] = [
  [460, 180], [820, 180], [1160, 200], [300, 300], [980, 300],
];

interface Spider {
  img: Phaser.GameObjects.Image;
  thread: Phaser.GameObjects.Graphics;
  x: number;
  y: number;
  t: number;
  dir: number;
  drop: 0 | 1 | 2; // 0 = on the ceiling, 1 = dropping, 2 = climbing back
}

/** Room 3: collect the potted ferns from the high shelves; mind the spider. */
export class BookcaseScene extends RoomScene {
  readonly roomId = 'bookcase' as const;
  readonly bgKey = 'bg_library' as const;
  readonly title = 'Bookshelf Climb';
  readonly hint = 'Grab all 3 ferns · don\'t touch the spider!';
  private ferns: Phaser.GameObjects.Image[] = [];
  private spiders: Spider[] = [];
  private got = 0;

  constructor() {
    super('Bookcase');
  }

  protected buildRoom(): void {
    this.ferns = [];
    this.spiders = [];
    this.got = 0;
    for (const [x, y, w] of SHELVES) {
      const s = this.add.image(x, y, 'shelf').setOrigin(0.5, 0).setDepth(-2);
      s.setScale(w / s.width, Math.min(w / s.width, 18 / s.height));
      const books = fitHeight(this.add.image(x - w * 0.25, y + 2, 'books_row').setOrigin(0.5, 1).setDepth(-3), 34);
      books.setAlpha(0.95);
      this.addLedge(x, y, w);
    }
    const spots = Phaser.Utils.Array.Shuffle([...FERN_SPOTS]).slice(0, 3);
    for (const [x, y] of spots) {
      const f = fitHeight(this.add.image(x + 40, y, 'fernpot').setOrigin(0.5, 1).setDepth(50), 46);
      this.tweens.add({ targets: f, angle: 4, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
      this.ferns.push(f);
    }
    const count = this.diff.cupids; // 1 at low levels, more later
    for (let i = 0; i < count; i++) {
      const thread = this.add.graphics().setDepth(40);
      const img = fitHeight(this.add.image(400 + i * 400, 80, 'spider').setDepth(41), 64);
      this.spiders.push({ img, thread, x: 400 + i * 400, y: 80, t: 0, dir: i % 2 ? -1 : 1, drop: 0 });
    }
  }

  protected updateRoom(dt: number): void {
    for (const sp of this.spiders) {
      if (this.asleep) continue;
      sp.t += dt;
      // Scuttles along the ceiling toward the cat, drops when overhead, then climbs back.
      if (sp.drop === 0) {
        const dx = this.cat.x - sp.x;
        sp.dir = Math.sign(dx) || sp.dir;
        sp.x += sp.dir * Math.min(Math.abs(dx), this.diff.spiderSpeed * dt);
        if (Math.abs(dx) < 24 && sp.t > 1) {
          sp.drop = 1;
          sp.t = 0;
        }
      } else if (sp.drop === 1) {
        sp.y = Math.min(sp.y + 420 * dt, Math.min(this.cat.y + 30, FLOOR_Y - 40));
        if (sp.t > 1.1) sp.drop = 2;
      } else {
        sp.y = Math.max(80, sp.y - 260 * dt);
        if (sp.y <= 80) {
          sp.drop = 0;
          sp.t = 0;
        }
      }
      const reach = sp.y;
      sp.img.setPosition(sp.x, reach);
      sp.img.setAngle(Math.sin(this.time.now / 80) * (sp.drop === 0 ? 10 : 4));
      sp.thread.clear();
      sp.thread.lineStyle(2, 0xffffff, 0.6);
      sp.thread.lineBetween(sp.x, 0, sp.x, reach - 20);
      if (sp.drop !== 0 && !this.cat.invulnerable && Math.abs(sp.img.x - this.cat.x) < 40 && Math.abs(sp.img.y - this.cat.y) < 40) {
        AudioEngine.get().play('hit');
        this.loseLife('Eek! A spider!');
        return;
      }
    }
    for (const f of this.ferns) {
      if (!f.visible) continue;
      if (Math.abs(f.x - this.cat.x) < 40 && Math.abs(f.y - 20 - this.cat.y) < 45) {
        f.setVisible(false);
        this.got++;
        this.progress();
        AudioEngine.get().play('collect', { pitch: 1 + this.got * 0.15 });
        sparkles(this, f.x, f.y - 20, 12, 0x8dff9a);
        popText(this, f.x, f.y - 40, `${this.got}/3`, '#8dff9a');
        if (this.got >= 3) this.win();
      }
    }
  }
}
