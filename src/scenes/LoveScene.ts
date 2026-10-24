import Phaser from 'phaser';
import { AudioEngine } from '../audio';
import { fitHeight } from '../assets';
import { banner, fadeIn, hearts, hitStop, popText, puff, shake, sparkles, wipeTo } from '../fx';
import { Controls } from '../input';
import { difficulty, failLove, loveMultiplier, timeBonus, winLove, type Difficulty } from '../logic/rules';
import { Cat } from '../objects/Cat';
import { oneWay } from '../objects/platforms';
import { game } from '../state';

const ROWS = 7;
const COLS = 14;
const ROW_Y0 = 650;
const ROW_STEP = 78;
const COL_X0 = 70;
const COL_STEP = 88;

interface Heart {
  img: Phaser.GameObjects.Image;
  zone: Phaser.GameObjects.Zone;
  whole: boolean;
}

interface Flyer {
  img: Phaser.GameObjects.Image;
  dir: number;
  row: number;
  speed: number;
}

/** The love scene: climb the hearts to your sweetheart. */
export class LoveScene extends Phaser.Scene {
  private cat!: Cat;
  private ctrl!: Controls;
  private diff!: Difficulty;
  private hearts: Heart[][] = [];
  private cupids: Flyer[] = [];
  private rivals: Flyer[] = [];
  private gift?: Phaser.GameObjects.Image;
  private girl!: Phaser.GameObjects.Image;
  private done = false;
  private elapsed = 0;

  constructor() {
    super('Love');
  }

  create(): void {
    this.done = false;
    this.elapsed = 0;
    this.hearts = [];
    this.cupids = [];
    this.rivals = [];
    this.diff = difficulty(game.session.level);
    this.physics.world.setBounds(0, -200, 1280, 1200);
    this.add.image(640, 360, 'bg_love').setDisplaySize(1280, 720).setDepth(-10);

    const ledges = this.physics.add.staticGroup();
    for (let r = 0; r < ROWS; r++) {
      const row: Heart[] = [];
      const y = ROW_Y0 - r * ROW_STEP;
      for (let c = 0; c < COLS; c++) {
        const x = COL_X0 + c * COL_STEP + (r % 2 ? COL_STEP / 2 : 0);
        if (x > 1250) continue;
        const img = fitHeight(this.add.image(x, y, 'heart').setDepth(5), 40);
        const zone = this.add.zone(x, y - 14, 52, 10);
        ledges.add(zone);
        const h = { img, zone, whole: true };
        // A few start broken so there is always some route-finding.
        if (r > 0 && Math.random() < 0.18) this.setHeart(h, false);
        row.push(h);
        this.tweens.add({ targets: img, y: y - 3, duration: 900 + Math.random() * 400, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
      }
      this.hearts.push(row);
    }

    // Sweetheart on a cloud at the top.
    const gx = 300 + Math.random() * 680;
    const cloud = this.add.ellipse(gx, 112, 220, 50, 0xffffff, 0.9).setDepth(4);
    ledges.add(this.add.zone(gx, 96, 200, 10));
    this.tweens.add({ targets: cloud, scaleX: 1.04, duration: 1500, yoyo: true, repeat: -1 });
    this.girl = fitHeight(this.add.image(gx + 40, 96, 'girlcat').setOrigin(0.5, 1).setDepth(6), 80);
    this.tweens.add({ targets: this.girl, angle: 5, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.time.addEvent({ delay: 1400, loop: true, callback: () => hearts(this, this.girl.x, this.girl.y - 60, 1) });

    this.cat = new Cat(this, 120, ROW_Y0 - 50);
    this.cat.body.setCollideWorldBounds(false);
    this.ctrl = new Controls(this);
    this.physics.add.collider(this.cat.phys, ledges, undefined, (a, b) => {
      const zone = b as Phaser.GameObjects.Zone;
      const h = this.findHeart(zone);
      if (h && !h.whole) return false;
      return oneWay(this.cat)(a, b);
    });

    // Gift waits on the bottom row.
    if (!game.session.hasGift) {
      const gr = this.hearts[0][8 + Math.floor(Math.random() * 4)];
      this.gift = fitHeight(this.add.image(gr.img.x, gr.img.y - 22, 'gift').setDepth(30), 36);
      this.tweens.add({ targets: this.gift, y: this.gift.y - 8, duration: 500, yoyo: true, repeat: -1 });
    }

    for (let i = 0; i < this.diff.cupids; i++) {
      const img = fitHeight(this.add.image(i % 2 ? 1300 : -20, 0, 'cupid').setDepth(40), 56);
      this.cupids.push({ img, dir: i % 2 ? -1 : 1, row: 1 + Math.floor(Math.random() * (ROWS - 1)), speed: 120 + this.diff.dogSpeed * 0.3 });
    }
    for (let i = 0; i < this.diff.rivals; i++) {
      const row = 2 + ((i * 2) % (ROWS - 2));
      const img = fitHeight(this.add.image(200 + Math.random() * 800, ROW_Y0 - row * ROW_STEP - 18, 'rivalcat').setOrigin(0.5, 1).setDepth(35), 56);
      this.rivals.push({ img, dir: Math.random() < 0.5 ? -1 : 1, row, speed: 70 + game.session.level * 10 });
    }

    this.scene.launch('Hud');
    this.scene.bringToTop('Hud');
    AudioEngine.get().playMusic('love');
    fadeIn(this);
    banner(this, 'Love is in the air!', `Climb to your sweetheart · grab the gift for x${loveMultiplier(game.session.level, true)}`, '#ffb3d9');
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.registry.set('bonus', null));
  }

  private findHeart(zone: Phaser.GameObjects.Zone): Heart | undefined {
    for (const row of this.hearts) for (const h of row) if (h.zone === zone) return h;
    return undefined;
  }

  private setHeart(h: Heart, whole: boolean): void {
    h.whole = whole;
    h.img.setTexture(whole ? 'heart' : 'heart_broken');
    fitHeight(h.img, 40);
    h.img.setAlpha(whole ? 1 : 0.55);
  }

  update(_t: number, deltaMs: number): void {
    const dt = deltaMs / 1000;
    this.ctrl.update();
    this.cat.update(this.ctrl, dt);
    if (this.done) return;
    this.elapsed += dt;
    this.registry.set('bonus', timeBonus(this.elapsed / 2));

    // Cupids sweep a row and flip the hearts they pass over.
    for (const c of this.cupids) {
      const prevX = c.img.x;
      c.img.x += c.dir * c.speed * dt;
      c.img.y = ROW_Y0 - c.row * ROW_STEP - 50 + Math.sin(this.time.now / 200) * 8;
      c.img.setFlipX(c.dir < 0);
      if (c.img.x < -60 || c.img.x > 1340) {
        c.dir *= -1;
        c.row = 1 + Math.floor(Math.random() * (ROWS - 1));
      }
      for (const h of this.hearts[c.row]) {
        if ((h.img.x - prevX) * (h.img.x - c.img.x) <= 0 && Math.random() < 0.5) {
          this.setHeart(h, !h.whole);
          AudioEngine.get().play(h.whole ? 'heart' : 'heartBreak', { volume: 0.35, pan: (h.img.x - 640) / 640 });
          sparkles(this, h.img.x, h.img.y, 3, 0xffb3d9);
        }
      }
    }

    // Rival toms pace their row; bumping one knocks you down unless you bribe him.
    for (const r of this.rivals) {
      if (!r.img.visible) continue;
      r.img.x += r.dir * r.speed * dt;
      if (r.img.x < 60 || r.img.x > 1220) r.dir *= -1;
      r.img.setFlipX(r.dir > 0); // art faces left
      if (!this.cat.invulnerable && Math.abs(r.img.x - this.cat.x) < 46 && Math.abs(r.img.y - 25 - this.cat.y) < 40) {
        if (game.session.hasGift) {
          game.session.hasGift = false;
          AudioEngine.get().play('gift');
          popText(this, r.img.x, r.img.y - 70, 'For me?! 💝', '#ffb3d9');
          hearts(this, r.img.x, r.img.y - 40, 6);
          this.tweens.add({ targets: r.img, y: -100, alpha: 0, duration: 900, onComplete: () => r.img.setVisible(false) });
        } else {
          AudioEngine.get().play('hit');
          AudioEngine.get().play('growl', { volume: 0.5 });
          shake(this, 0.006);
          this.cat.knock(Math.sign(this.cat.x - r.img.x) || 1, 150, 500);
          this.cat.dropUntil = this.time.now + 350;
          this.cat.hurtFlash(1000);
        }
      }
    }

    if (this.gift?.visible && Math.abs(this.gift.x - this.cat.x) < 40 && Math.abs(this.gift.y - this.cat.y) < 40) {
      this.gift.setVisible(false);
      game.session.hasGift = true;
      AudioEngine.get().play('gift');
      sparkles(this, this.gift.x, this.gift.y, 12, 0x55ffff);
      popText(this, this.gift.x, this.gift.y - 30, 'Gift! x2', '#55ffff');
    }

    if (Math.abs(this.girl.x - this.cat.x) < 60 && Math.abs(this.girl.y - 30 - this.cat.y) < 50) this.kiss();
    if (this.cat.y > 760) this.fall();
  }

  private kiss(): void {
    this.done = true;
    const pts = winLove(game.session, this.elapsed);
    this.cat.frozen = true;
    this.cat.body.setVelocity(0, 0);
    this.cat.setPose('cat_happy');
    hitStop(this, 150);
    hearts(this, this.girl.x - 20, this.girl.y - 40, 24);
    sparkles(this, this.girl.x - 20, this.girl.y - 40, 20, 0xffb3d9);
    const audio = AudioEngine.get();
    audio.play('kiss');
    audio.duck(2500);
    this.time.delayedCall(400, () => audio.play('lifeUp'));
    banner(this, 'Mwah! 💋', `+${pts.toLocaleString()} · extra life · level ${game.session.level + 1}!`, '#ffb3d9');
    popText(this, this.cat.x, this.cat.y - 80, `+${pts.toLocaleString()}`, '#ffe36e', 44);
    this.time.delayedCall(2600, () => wipeTo(this, 'Alley', { from: 'kiss' }));
  }

  private fall(): void {
    this.done = true;
    failLove(game.session);
    AudioEngine.get().play('fall');
    puff(this, this.cat.x, 700, 8, 0xffb3d9);
    banner(this, 'Heartbroken…', 'Win another room to try again', '#ff9ec7');
    this.time.delayedCall(1600, () => wipeTo(this, 'Alley', { from: 'fell' }));
  }
}
