import Phaser from 'phaser';
import { AudioEngine } from '../audio';
import { fitHeight } from '../assets';
import { banner, fadeIn, hearts, hitStop, popText, puff, shake, sparkles, wipeTo } from '../fx';
import { Controls } from '../input';
import { catchLineMouse, difficulty, loseLife, pickRoom, type Difficulty, type RoomId } from '../logic/rules';
import { Cat } from '../objects/Cat';
import { Bulldog } from '../objects/Hazards';
import { catIn, oneWay } from '../objects/platforms';
import { game } from '../state';

const GROUND_Y = 702;
const FENCE_Y = 560;
const LINE_YS = [440, 310, 180]; // bottom, middle, top washing line
const WINDOW_ROWS = [372, 242, 112];
const WINDOW_XS = [190, 490, 790, 1090];
const CAN_XS = [120, 560, 1000];

export const ROOM_SCENES: Record<RoomId, string> = {
  fishbowl: 'Fishbowl',
  bookcase: 'Bookcase',
  cheese: 'Cheese',
  birdcage: 'Birdcage',
  dogs: 'Dogs',
};

interface AlleyWindow {
  img: Phaser.GameObjects.Image;
  zone: Phaser.GameObjects.Zone;
  open: boolean;
  love: boolean;
  closeAt: number;
  row: number;
}

interface LineMouse {
  img: Phaser.GameObjects.Image;
  line: number;
  dir: number;
  alive: boolean;
  respawnAt: number;
  phase: number;
}

interface Thrown {
  img: Phaser.GameObjects.Image;
  body: Phaser.Physics.Arcade.Body;
}

export class AlleyScene extends Phaser.Scene {
  private cat!: Cat;
  private ctrl!: Controls;
  private diff!: Difficulty;
  private dog!: Bulldog;
  private windows: AlleyWindow[] = [];
  private mice: LineMouse[] = [];
  private thrown: Thrown[] = [];
  private lines: { g: Phaser.GameObjects.Graphics; y: number; sag: number; vel: number }[] = [];
  private nextWindowAt = 0;
  private groundTime = 0;
  private airTime = 0;
  private done = false;
  private from = 'start';
  private elapsed = 0;
  private loveCallAt = 0;

  constructor() {
    super('Alley');
  }

  init(data: { from?: string }): void {
    this.from = data?.from ?? 'start';
  }

  create(): void {
    this.done = false;
    this.windows = [];
    this.mice = [];
    this.thrown = [];
    this.lines = [];
    this.elapsed = 0;
    this.nextWindowAt = 0;
    this.loveCallAt = 0;
    this.groundTime = 0;
    this.airTime = 0;
    this.diff = difficulty(game.session.level);
    this.physics.world.setBounds(0, -300, 1280, 1020);

    this.add.image(640, 360, 'bg_alley').setDisplaySize(1280, 720).setDepth(-20);
    const moon = fitHeight(this.add.image(1180, 70, 'moon').setDepth(-15), 110);
    this.tweens.add({ targets: moon, angle: 6, duration: 2400, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.time.addEvent({
      delay: 700,
      loop: true,
      callback: () => sparkles(this, Math.random() * 1280, Math.random() * 60, 1, 0xfff8c0),
    });

    const solids = this.physics.add.staticGroup();
    const ledges = this.physics.add.staticGroup();
    solids.add(this.add.zone(640, GROUND_Y + 40, 1400, 80));

    // Windows (decor + entry zones)
    for (let r = 0; r < WINDOW_ROWS.length; r++) {
      for (const x of WINDOW_XS) {
        const img = fitHeight(this.add.image(x, WINDOW_ROWS[r], 'window_closed').setDepth(-8), 100);
        const zone = this.add.zone(x, WINDOW_ROWS[r] - 8, 56, 52);
        this.windows.push({ img, zone, open: false, love: false, closeAt: 0, row: r });
      }
    }

    // Washing lines are one-way ledges that sag when the cat lands.
    LINE_YS.forEach((y, i) => {
      const g = this.add.graphics().setDepth(-4);
      this.lines.push({ g, y, sag: 0, vel: 0 });
      ledges.add(this.add.zone(640, y + 6, 1280, 12));
      const clothes = ['shirt', 'sock', 'pants'];
      [340, 640, 940].forEach((x, j) => {
        const c = fitHeight(this.add.image(x + (i % 2) * 40, y + 2, clothes[(i + j) % 3]).setOrigin(0.5, 0).setDepth(-3), 52);
        this.tweens.add({ targets: c, angle: 5, duration: 1200 + j * 200, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
      });
    });

    // Fence top + trash cans
    for (let x = -20; x < 1280; x += 600) {
      const f = this.add.image(x, FENCE_Y - 6, 'fence').setOrigin(0, 0).setDepth(-2);
      f.setDisplaySize(660, 118);
    }
    ledges.add(this.add.zone(640, FENCE_Y + 6, 1280, 12));
    for (const x of CAN_XS) {
      const can = fitHeight(this.add.image(x, GROUND_Y, 'trashcan').setOrigin(0.5, 1).setDepth(10), 92);
      solids.add(this.add.zone(x, GROUND_Y - 44, can.displayWidth * 0.8, 88));
    }

    // Cat placement depends on where we came from.
    const fromRoom = this.from !== 'start';
    this.cat = new Cat(this, fromRoom ? 640 : 300, fromRoom ? FENCE_Y - 40 : GROUND_Y - 40);
    this.ctrl = new Controls(this);
    this.physics.add.collider(this.cat.phys, solids);
    this.physics.add.collider(this.cat.phys, ledges, undefined, oneWay(this.cat));

    // Line mice
    LINE_YS.forEach((y, i) => {
      const img = fitHeight(this.add.image(Math.random() * 1200 + 40, y, 'mouse_run1').setOrigin(0.5, 1).setDepth(20), 40);
      this.mice.push({ img, line: i, dir: Math.random() < 0.5 ? 1 : -1, alive: true, respawnAt: 0, phase: 0 });
    });

    this.dog = new Bulldog(this, GROUND_Y, this.diff.dogSpeed);

    if (game.session.loveUnlocked) this.setLoveWindow();

    this.scene.launch('Hud');
    this.scene.bringToTop('Hud');
    const audio = AudioEngine.get();
    audio.playMusic('alley');
    audio.setLayer('danger', false);
    audio.setHurry(false);
    fadeIn(this);
    if (this.from === 'start') banner(this, 'Meow-velous night!', 'Catch mice on the lines · jump into open windows');
    else if (this.from === 'win') banner(this, 'A sweetheart calls!', 'Find the window with the pink glow 💗', '#ffb3d9');
    if (fromRoom) this.cat.hurtFlash(1200);
  }

  private setLoveWindow(): void {
    const top = this.windows.filter((w) => w.row >= 1);
    const w = top[Math.floor(Math.random() * top.length)];
    w.love = true;
    w.open = true;
    w.img.setTexture('window_love');
    fitHeight(w.img, 100);
    this.tweens.add({ targets: w.img, scale: w.img.scale * 1.07, duration: 500, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
  }

  update(_t: number, deltaMs: number): void {
    const dt = deltaMs / 1000;
    this.ctrl.update();
    this.cat.update(this.ctrl, dt);
    this.updateLines(dt);
    if (this.done) return;
    this.elapsed += dt;

    this.updateWindows();
    this.updateMice(dt);
    this.updateThrown();
    this.updateDog(dt);
    this.checkWindowEntry();
  }

  private updateLines(dt: number): void {
    for (let i = 0; i < this.lines.length; i++) {
      const l = this.lines[i];
      const standing = this.cat.onGround && Math.abs(this.cat.bottom - l.y) < 8;
      const target = standing ? 10 : 0;
      // Damped spring so the line wobbles when landed on.
      l.vel += ((target - l.sag) * 120 - l.vel * 8) * dt;
      l.sag += l.vel * dt;
      const px = standing ? this.cat.x : 640;
      l.g.clear();
      l.g.lineStyle(3, 0xf0e8ff, 0.9);
      l.g.beginPath();
      l.g.moveTo(0, l.y);
      for (let x = 0; x <= 1280; x += 32) {
        const d = Math.max(0, 1 - Math.abs(x - px) / 500);
        l.g.lineTo(x, l.y + 4 * Math.sin((x / 1280) * Math.PI) + l.sag * d);
      }
      l.g.strokePath();
    }
  }

  private updateWindows(): void {
    const now = this.elapsed;
    if (now >= this.nextWindowAt) {
      this.nextWindowAt = now + this.diff.windowOpenEvery * (0.7 + Math.random() * 0.6);
      const closed = this.windows.filter((w) => !w.open);
      const w = closed[Math.floor(Math.random() * closed.length)];
      if (w) {
        w.open = true;
        w.closeAt = now + this.diff.windowOpenFor;
        w.img.setTexture('window_open');
        fitHeight(w.img, 100);
        const s = w.img.scale;
        w.img.setScale(s * 0.8, s * 1.15);
        this.tweens.add({ targets: w.img, scaleX: s, scaleY: s, duration: 260, ease: 'Back.Out' });
        sparkles(this, w.img.x, w.img.y, 5, 0xffe9a8);
        AudioEngine.get().play('windowOpen', { volume: 0.5, pan: (w.img.x - 640) / 640 });
        if (Math.random() < this.diff.throwChance) this.time.delayedCall(500 + Math.random() * 900, () => this.throwFrom(w));
      }
    }
    for (const w of this.windows) {
      if (w.open && !w.love && now >= w.closeAt) {
        w.open = false;
        w.img.setTexture('window_closed');
        fitHeight(w.img, 100);
      }
    }
    if (game.session.loveUnlocked && this.elapsed > this.loveCallAt) {
      this.loveCallAt = this.elapsed + 4;
      const lw = this.windows.find((w) => w.love);
      if (lw) {
        hearts(this, lw.img.x, lw.img.y, 3);
        AudioEngine.get().play('meow', { pitch: 1.35, volume: 0.5, pan: (lw.img.x - 640) / 640 });
      }
    }
  }

  private throwFrom(w: AlleyWindow): void {
    if (!w.open || this.done) return;
    const kinds = ['shoe', 'boot', 'clock', 'phone', 'book'];
    const img = fitHeight(this.add.image(w.img.x, w.img.y, kinds[Math.floor(Math.random() * kinds.length)]).setDepth(600), 40);
    this.physics.add.existing(img);
    const body = img.body as Phaser.Physics.Arcade.Body;
    body.setGravityY(-1200);
    // Lob towards the cat, the human isn't a great shot.
    const dx = this.cat.x - w.img.x + (Math.random() - 0.5) * 200;
    body.setVelocity(Phaser.Math.Clamp(dx * 0.9, -380, 380), -260);
    body.setAngularVelocity((Math.random() < 0.5 ? -1 : 1) * 400);
    this.thrown.push({ img, body });
    AudioEngine.get().play('throw', { pan: (w.img.x - 640) / 640 });
  }

  private updateThrown(): void {
    for (let i = this.thrown.length - 1; i >= 0; i--) {
      const t = this.thrown[i];
      if (t.img.y > 760) {
        t.img.destroy();
        this.thrown.splice(i, 1);
        continue;
      }
      if (!this.cat.invulnerable && !this.cat.stunned && this.physics.overlap(t.img, this.cat.phys)) {
        AudioEngine.get().play('hit');
        AudioEngine.get().play('meow', { pitch: 0.8 });
        shake(this, 0.008);
        hitStop(this, 70);
        sparkles(this, this.cat.x, this.cat.y - 20, 6, 0xffff80);
        this.cat.knock(Math.sign(t.body.velocity.x) || 1, 200, 800);
        this.cat.dropUntil = this.time.now + 400; // knocked off the line
        this.cat.hurtFlash(1200);
        t.body.setVelocity(-t.body.velocity.x * 0.5, -300);
      }
    }
  }

  private updateMice(dt: number): void {
    const speed = 80 + game.session.level * 12;
    for (const m of this.mice) {
      if (!m.alive) {
        if (this.elapsed >= m.respawnAt) {
          m.alive = true;
          m.dir = Math.random() < 0.5 ? 1 : -1;
          m.img.setPosition(m.dir > 0 ? -20 : 1300, LINE_YS[m.line]).setVisible(true).setAlpha(1);
        }
        continue;
      }
      // Mice scurry, pause, and flee when the cat gets close.
      const near = Math.abs(this.cat.x - m.img.x) < 160 && Math.abs(this.cat.bottom - LINE_YS[m.line]) < 60;
      if (near) m.dir = Math.sign(m.img.x - this.cat.x) || m.dir;
      m.phase += dt * (near ? 16 : 10);
      m.img.x += m.dir * speed * (near ? 1.6 : 1) * dt;
      if (m.img.x < 20) m.dir = 1;
      if (m.img.x > 1260) m.dir = -1;
      m.img.setTexture(Math.floor(m.phase) % 2 ? 'mouse_run2' : 'mouse_run1');
      fitHeight(m.img, 40);
      m.img.setFlipX(m.dir < 0);
      m.img.y = LINE_YS[m.line] + this.lines[m.line].sag * Math.max(0, 1 - Math.abs(m.img.x - this.cat.x) / 500);

      const dx = Math.abs(this.cat.x - m.img.x);
      const dy = Math.abs(this.cat.y - (m.img.y - 14));
      if (dx < 40 && dy < 40 && !this.cat.stunned) {
        m.alive = false;
        m.respawnAt = this.elapsed + 3;
        const pts = catchLineMouse(game.session, m.line, this.time.now / 1000);
        const combo = game.session.combo;
        AudioEngine.get().play(combo > 1 ? 'combo' : 'catch', { pitch: 1 + (combo - 1) * 0.12 });
        AudioEngine.get().play('squeak');
        popText(this, m.img.x, m.img.y - 30, combo > 1 ? `+${pts} x${combo}!` : `+${pts}`, combo > 1 ? '#ff9ef0' : '#ffffff');
        sparkles(this, m.img.x, m.img.y - 10, 8, 0xffffff);
        hitStop(this, 50);
        this.tweens.add({ targets: m.img, y: m.img.y - 40, alpha: 0, angle: 360, duration: 400, onComplete: () => m.img.setVisible(false) });
      }
    }
  }

  private updateDog(dt: number): void {
    const onGround = this.cat.onGround && this.cat.bottom >= GROUND_Y - 100;
    const onStreet = this.cat.onGround && this.cat.bottom >= GROUND_Y - 4;
    if (onGround) {
      this.groundTime += dt;
      this.airTime = 0;
    } else {
      this.airTime += dt;
      this.groundTime = 0;
    }
    if (!this.dog.active && this.groundTime > 1 && this.elapsed > 4) this.dog.enter(this.cat.x);
    if (this.dog.active && this.airTime > 2.5) this.dog.leave();
    if (this.dog.update(this.cat, onStreet)) this.die();
  }

  private checkWindowEntry(): void {
    if (this.cat.stunned) return;
    for (const w of this.windows) {
      if (!w.open) continue;
      if (!catIn(this.cat, w.zone)) continue;
      this.enterWindow(w);
      return;
    }
  }

  private enterWindow(w: AlleyWindow): void {
    this.done = true;
    const audio = AudioEngine.get();
    audio.play('enterRoom');
    audio.setLayer('danger', false);
    this.cat.frozen = true;
    this.cat.posed = true;
    this.cat.body.setVelocity(0, 0);
    this.cat.body.setAllowGravity(false);
    this.tweens.add({ targets: this.cat.img, x: w.img.x, y: w.img.y + 30, scale: 0.01, duration: 350, ease: 'Back.In' });
    puff(this, w.img.x, w.img.y + 20, 6);
    if (w.love) {
      this.time.delayedCall(380, () => wipeTo(this, 'Love'));
      return;
    }
    const room = pickRoom(game.session.level, game.session.roomHistory, Math.random);
    this.time.delayedCall(380, () => wipeTo(this, ROOM_SCENES[room]));
  }

  private die(): void {
    if (this.done) return;
    this.done = true;
    shake(this, 0.014, 320);
    hitStop(this, 140);
    const audio = AudioEngine.get();
    audio.play('growl');
    audio.play('lifeLost');
    const over = loseLife(game.session);
    banner(this, 'Woof! Caught!', over ? '' : `${game.session.lives} ${game.session.lives === 1 ? 'life' : 'lives'} left`, '#ff9ec7');
    this.cat.die(() => {
      if (over) wipeTo(this, 'GameOver');
      else this.scene.restart({ from: 'respawn' });
    });
  }
}
