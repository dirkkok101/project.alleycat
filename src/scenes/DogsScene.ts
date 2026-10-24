import Phaser from 'phaser';
import { AudioEngine } from '../audio';
import { fitHeight } from '../assets';
import { FONT, popText, sparkles } from '../fx';
import { FLOOR_Y, RoomScene } from './RoomScene';

interface Dog {
  img: Phaser.GameObjects.Image;
  zzz: Phaser.GameObjects.Text;
  noise: number;
  growled: boolean;
}

interface Dish {
  img: Phaser.GameObjects.Image;
  left: number;
  bite: number;
}

/** Room 6: tiptoe between sleeping dogs and empty every dish without waking them. */
export class DogsScene extends RoomScene {
  readonly roomId = 'dogs' as const;
  readonly bgKey = 'bg_dogroom' as const;
  readonly title = 'Shhh… Sleeping Dogs';
  readonly hint = 'Hold ↓ on a dish to eat · sneak, don\'t stomp!';
  protected useBroom = false;
  protected useDog = false;
  private dogs: Dog[] = [];
  private dishes: Dish[] = [];
  private wasOnGround = true;

  constructor() {
    super('Dogs');
  }

  protected buildRoom(): void {
    this.dogs = [];
    this.dishes = [];
    const n = this.diff.sleepingDogs;
    const left = 260;
    const span = 1180 - left;
    const step = span / (n + 0.5);
    for (let i = 0; i <= n; i++) {
      const x = left + i * step;
      const dish = fitHeight(this.add.image(x, FLOOR_Y + 2, 'dish_full').setOrigin(0.5, 1).setDepth(30), 46);
      this.dishes.push({ img: dish, left: this.diff.helpings, bite: 0 });
      if (i < n) {
        const dx = x + step / 2;
        const img = fitHeight(this.add.image(dx, FLOOR_Y + 4, 'sleepdog').setOrigin(0.5, 1).setDepth(20), 86);
        this.tweens.add({ targets: img, scaleY: img.scaleY * 1.04, duration: 1100 + i * 90, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
        const zzz = this.add
          .text(dx + 20, FLOOR_Y - 100, 'z', { fontFamily: FONT, fontSize: '26px', color: '#ffffff', stroke: '#1b1433', strokeThickness: 5 })
          .setOrigin(0.5);
        this.dogs.push({ img, zzz, noise: 0, growled: false });
      }
    }
    // Shelves above give a quiet route over the pack.
    for (let i = 0; i < 3; i++) {
      const x = 360 + i * 330;
      const s = this.add.image(x, 470, 'shelf').setOrigin(0.5, 0).setDepth(-2);
      s.setScale(200 / s.width, Math.min(200 / s.width, 18 / s.height));
      this.addLedge(x, 470, 200);
    }
    this.time.addEvent({ delay: 2600, loop: true, callback: () => AudioEngine.get().play('snore', { volume: 0.35 }) });
  }

  protected updateRoom(dt: number): void {
    const cat = this.cat;
    const onFloor = cat.onGround && cat.bottom >= FLOOR_Y - 4;
    const speed = Math.abs(cat.body.velocity.x);
    const landed = cat.onGround && !this.wasOnGround;
    this.wasOnGround = cat.onGround;

    // Eating
    let eating = false;
    for (const d of this.dishes) {
      if (d.left <= 0 || !onFloor || !this.ctrl.down || Math.abs(d.img.x - cat.x) > 36) continue;
      eating = true;
      d.bite += dt;
      if (d.bite >= 0.55) {
        d.bite = 0;
        d.left--;
        AudioEngine.get().play('eat');
        cat.squash(1.15, 0.9);
        sparkles(this, d.img.x, d.img.y - 20, 5, 0xffd08a);
        if (d.left <= 0) {
          d.img.setTexture('dish_empty');
          fitHeight(d.img, 46);
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
      const near = Math.abs(dog.img.x - cat.x) < 150 && cat.bottom > FLOOR_Y - 140;
      let n = -0.22 * dt;
      if (near) {
        if (landed) n += 0.35; // thumping down next to a dog is loud
        if (onFloor && speed > 140) n += 0.9 * dt; // running
        if (eating) n += 0.08 * dt;
      }
      // Light sleepers at higher levels.
      if (n > 0) n *= 1.3 + this.diff.broomChase;
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
