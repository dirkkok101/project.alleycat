import { AudioEngine } from '../audio';
import { fitHeight } from '../assets';
import { puff, wipeTo } from '../fx';
import { catIn } from '../objects/platforms';
import { FLOOR_Y, RoomScene } from './RoomScene';

const TABLE_X = 1000;
const TABLE_H = 150;

/** Room 1: hop onto the table and dive into the fishbowl. */
export class FishbowlScene extends RoomScene {
  readonly roomId = 'fishbowl' as const;
  readonly bgKey = 'bg_livingroom' as const;
  readonly title = 'Fishbowl!';
  readonly hint = 'Hop up and dive into the bowl';
  private bowlMouth!: Phaser.GameObjects.Zone;
  private bowl!: Phaser.GameObjects.Image;

  constructor() {
    super('Fishbowl');
  }

  protected buildRoom(): void {
    const table = fitHeight(this.add.image(TABLE_X, FLOOR_Y, 'table').setOrigin(0.5, 1).setDepth(-2), TABLE_H);
    this.addLedge(TABLE_X, FLOOR_Y - TABLE_H + 8, table.displayWidth * 0.9);
    this.bowl = fitHeight(this.add.image(TABLE_X + 30, FLOOR_Y - TABLE_H + 12, 'fishbowl').setOrigin(0.5, 1).setDepth(-1), 120);
    this.bowlMouth = this.add.zone(this.bowl.x, this.bowl.y - this.bowl.displayHeight + 10, this.bowl.displayWidth * 0.5, 30);
    // A peek of fish inside the bowl to lure the cat.
    for (let i = 0; i < 3; i++) {
      const f = fitHeight(this.add.image(this.bowl.x - 25 + i * 22, this.bowl.y - 50 + (i % 2) * 18, 'goldfish').setDepth(-1), 18);
      this.tweens.add({ targets: f, x: f.x + 16, duration: 900 + i * 200, yoyo: true, repeat: -1, flipX: true, ease: 'Sine.InOut' });
    }
    // A footstool and a shelf make the route more interesting.
    const stool = fitHeight(this.add.image(560, FLOOR_Y, 'table').setOrigin(0.5, 1).setDepth(-2), 70);
    stool.setScale(stool.scaleX * 0.6, stool.scaleY);
    this.addLedge(560, FLOOR_Y - 70 + 6, stool.displayWidth * 0.9);
    const shelf = this.add.image(760, 400, 'shelf').setDepth(-2);
    shelf.setScale(220 / shelf.width, 220 / shelf.width);
    this.addLedge(760, 400 - shelf.displayHeight / 2, 220);
  }

  protected updateRoom(): void {
    const b = this.cat.body;
    if (b.velocity.y > 0 && catIn(this.cat, this.bowlMouth)) {
      this.done = true;
      AudioEngine.get().play('splash');
      puff(this, this.bowl.x, this.bowlMouth.y, 10, 0x9ef0ff);
      this.cat.frozen = true;
      this.cat.posed = true;
      this.tweens.add({ targets: this.cat.img, y: this.bowl.y - 30, scale: 0.02, duration: 300 });
      this.time.delayedCall(350, () => wipeTo(this, 'Underwater', { elapsed: this.elapsed }));
    }
  }
}
