import Phaser from 'phaser';
import { AudioEngine } from '../audio';
import { fitHeight } from '../assets';
import { FONT, popText, sparkles } from '../fx';
import { hint } from '../tutorial';
import { FLOOR_Y, RoomScene } from './RoomScene';

const SHELF_Y = 512;
// 12 fixed spots on two tiers, like the original; dogs take some, dishes the rest.
const SPOTS: [number, number][] = [
  [300, FLOOR_Y], [460, FLOOR_Y], [620, FLOOR_Y], [780, FLOOR_Y], [940, FLOOR_Y], [1100, FLOOR_Y],
  [330, SHELF_Y], [470, SHELF_Y], [610, SHELF_Y], [790, SHELF_Y], [930, SHELF_Y], [1070, SHELF_Y],
];

interface Dog {
  img: Phaser.GameObjects.Image;
  tier: number;
  zzz: Phaser.GameObjects.Text;
  noise: number;
  growled: boolean;
}

interface Dish {
  img: Phaser.GameObjects.Image;
  tier: number;
  left: number;
  bite: number;
}

/** Room 6: tiptoe between sleeping dogs and empty every dish without waking them. */
export class DogsScene extends RoomScene {
  readonly roomId = 'dogs' as const;
  readonly bgKey = 'bg_dogroom' as const;
  readonly title = 'Shhh… Sleeping Dogs';
  readonly hint = 'Empty every dish · tiptoe!';
  protected useBroom = false;
  protected useDog = false;
  private dogs: Dog[] = [];
  private dishes: Dish[] = [];
  private wasOnGround = true;
  private idleOnDish = 0;
  private eatUi!: Phaser.GameObjects.Graphics;
  private eatArrow!: Phaser.GameObjects.Text;

  constructor() {
    super('Dogs');
  }

  protected buildRoom(): void {
    this.dogs = [];
    this.dishes = [];
    this.idleOnDish = 0;
    this.wasOnGround = true;
    this.eatUi = this.add.graphics().setDepth(700);
    this.eatArrow = this.add
      .text(0, 0, '↓', { fontFamily: FONT, fontSize: '22px', color: '#ffffff' })
      .setOrigin(0.5)
      .setDepth(701)
      .setVisible(false);
    // Two long shelves form the upper tier.
    for (const [x, w] of [[470, 440], [930, 440]] as const) {
      const sh = this.add.image(x, SHELF_Y, 'shelf').setOrigin(0.5, 0).setDepth(-2);
      sh.setScale(w / sh.width, Math.min(w / sh.width, 18 / sh.height));
      this.addLedge(x, SHELF_Y, w);
    }
    // A stool to reach the shelves without a long run-up.
    const stool = fitHeight(this.add.image(200, FLOOR_Y, 'table').setOrigin(0.5, 1).setDepth(-2), 70);
    this.addLedge(200, FLOOR_Y - 70 + 6, stool.displayWidth * 0.9);

    const order = Phaser.Utils.Array.Shuffle([...SPOTS.keys()]);
    const dogSpots = new Set(order.slice(0, this.diff.sleepingDogs));
    SPOTS.forEach(([x, tier], i) => {
      if (dogSpots.has(i)) {
        const img = fitHeight(this.add.image(x, tier + 4, 'sleepdog').setOrigin(0.5, 1).setDepth(20), 78);
        this.tweens.add({ targets: img, scaleY: img.scaleY * 1.04, duration: 1100 + i * 90, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
        const zzz = this.add
          .text(x + 20, tier - 92, 'z', { fontFamily: FONT, fontSize: '26px', color: '#ffffff', stroke: '#1b1433', strokeThickness: 5 })
          .setOrigin(0.5);
        this.dogs.push({ img, tier, zzz, noise: 0, growled: false });
      } else {
        const img = fitHeight(this.add.image(x, tier + 2, 'dish_full').setOrigin(0.5, 1).setDepth(30), 44);
        this.dishes.push({ img, tier, left: this.diff.helpings, bite: 0 });
      }
    });
    this.time.addEvent({ delay: 2600, loop: true, callback: () => AudioEngine.get().play('snore', { volume: 0.35 }) });
  }

  /** Show which bowl is in reach, with a ring filling up as the cat eats. */
  private drawEatUi(d: Dish | undefined): void {
    const g = this.eatUi;
    g.clear();
    for (const x of this.dishes) x.img.setTint(0xffffff);
    if (!d) return;
    d.img.setTint(0xfff2b0);
    const x = d.img.x;
    const y = d.img.y - 118; // above the cat's head
    g.fillStyle(0x1b1433, 0.6).fillCircle(x, y, 16);
    g.lineStyle(5, 0xffd08a, 1);
    g.beginPath();
    g.arc(x, y, 13, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, d.bite / 0.55), false);
    g.strokePath();
    g.fillStyle(0xffffff, 1);
    for (let i = 0; i < d.left; i++) g.fillCircle(x - (d.left - 1) * 5 + i * 10, y + 24, 3);
    this.eatArrow.setPosition(x, y).setVisible(d.bite === 0);
  }

  protected updateRoom(dt: number): void {
    const cat = this.cat;
    const onTier = (tier: number) => cat.onGround && Math.abs(cat.bottom - tier) < 8;
    const speed = Math.abs(cat.body.velocity.x);
    const landed = cat.onGround && !this.wasOnGround;
    this.wasOnGround = cat.onGround;

    // The cat eats with its mouth, which is ahead of its body: measure from the head,
    // and be generous, so lining the face up with the bowl just works.
    const mouthX = cat.x + cat.facing * 24;
    const reach = this.dishes
      .filter((d) => d.left > 0 && onTier(d.tier) && Math.min(Math.abs(d.img.x - mouthX), Math.abs(d.img.x - cat.x)) < 46)
      .sort((a, b) => Math.abs(a.img.x - mouthX) - Math.abs(b.img.x - mouthX))[0];
    const onDish = !!reach;
    this.drawEatUi(reach);
    // On a dish, ↓ means eat, not drop through the shelf.
    if (onDish) cat.dropUntil = 0;
    this.idleOnDish = onDish && !this.ctrl.down ? this.idleOnDish + dt : 0;
    if (this.idleOnDish > 1.5) hint(this, cat.x, cat.y - 90, 'Hold ↓ to eat', 'eat');

    // Eating
    let eating = false;
    for (const d of this.dishes) {
      if (d !== reach || !this.ctrl.down) continue;
      eating = true;
      d.bite += dt;
      if (d.bite >= 0.55) {
        d.bite = 0;
        d.left--;
        this.progress();
        AudioEngine.get().play('eat');
        cat.squash(1.15, 0.9);
        sparkles(this, d.img.x, d.img.y - 20, 5, 0xffd08a);
        if (d.left <= 0) {
          d.img.setTexture('dish_empty');
          fitHeight(d.img, 44);
          popText(this, d.img.x, d.img.y - 50, 'Yum!', '#ffd08a');
          AudioEngine.get().play('collect');
          if (this.dishes.every((x) => x.left <= 0)) {
            this.win();
            return;
          }
        }
      }
    }

    for (const dog of this.dogs) {
      // Dogs only sense a cat on their own tier, within a radius that grows with level.
      const near = onTier(dog.tier) && Math.abs(dog.img.x - cat.x) < this.diff.dogWakeRadius;
      let n = -0.25 * dt;
      if (near) {
        n = 0.3 * dt; // just being close stirs them (about 3 s at level 1)
        if (landed) n += 0.25; // thumping down next to a dog is loud
        if (speed > 140) n += 0.8 * dt; // running
        if (eating) n += 0.1 * dt;
        // Light sleepers at higher levels.
        n *= 1 + this.diff.broomChase * 0.6;
      }
      dog.noise = Phaser.Math.Clamp(dog.noise + n, 0, 1);
      dog.zzz.setText(dog.noise > 0.65 ? '!?' : dog.noise > 0.35 ? 'z?' : 'z z z'.slice(0, 1 + Math.floor((this.time.now / 600) % 3) * 2));
      dog.zzz.setColor(dog.noise > 0.65 ? '#ff7a9e' : '#ffffff');
      dog.img.setTint(dog.noise > 0.65 ? 0xffd0d0 : 0xffffff);
      if (dog.noise > 0.65 && !dog.growled) {
        dog.growled = true;
        AudioEngine.get().play('growl', { volume: 0.7 });
      }
      if (dog.noise < 0.4) dog.growled = false;
      if (dog.noise >= 1 && !cat.invulnerable) {
        dog.img.setTexture('angrydog');
        fitHeight(dog.img, 80);
        dog.img.setFlipX(cat.x < dog.img.x);
        AudioEngine.get().play('bark');
        this.tweens.add({ targets: dog.img, x: cat.x, y: cat.bottom, duration: 220 });
        this.loseLife('The dog woke up!');
        return;
      }
    }
  }
}
