import Phaser from 'phaser';
import { AudioEngine, type MusicTrack } from '../audio';
import type { BgKey } from '../assets';
import { banner, fadeIn, hitStop, popText, shake, sparkles, wipeTo } from '../fx';
import { Controls } from '../input';
import { difficulty, loseLife, timeBonus, winRoom, type Difficulty, type RoomId } from '../logic/rules';
import { Cat } from '../objects/Cat';
import { Broom, Bulldog } from '../objects/Hazards';
import { catIn, oneWay } from '../objects/platforms';
import { game } from '../state';

export const FLOOR_Y = 652;

/**
 * Shared frame for every indoor challenge: background, floor, the window the
 * cat came in through, the broom, the dog that barges in if you dawdle,
 * the speed bonus, and win/lose flow.
 */
export abstract class RoomScene extends Phaser.Scene {
  abstract readonly roomId: RoomId | 'underwater';
  abstract readonly bgKey: BgKey;
  abstract readonly title: string;
  abstract readonly hint: string;
  protected music: MusicTrack = 'room';
  protected useBroom = true;
  protected useDog = true;
  protected useWindow = true;
  /** Bonus timing continues from the fishbowl room into the bowl. */
  protected bonusStartOffset = 0;

  cat!: Cat;
  ctrl!: Controls;
  solids!: Phaser.Physics.Arcade.StaticGroup;
  ledges!: Phaser.Physics.Arcade.StaticGroup;
  diff!: Difficulty;
  broom?: Broom;
  dog?: Bulldog;
  done = false;
  protected elapsed = 0;
  private nextDogAt = 0;
  private dogLeaveAt = 0;
  private enteredAt = 0;
  private windowZone?: Phaser.GameObjects.Zone;

  init(data: { elapsed?: number }): void {
    this.bonusStartOffset = data?.elapsed ?? 0;
  }

  create(): void {
    this.done = false;
    this.elapsed = this.bonusStartOffset;
    this.diff = difficulty(game.session.level);
    this.physics.world.setBounds(0, -200, 1280, 920);
    this.add.image(640, 360, this.bgKey).setDisplaySize(1280, 720).setDepth(-10);

    this.solids = this.physics.add.staticGroup();
    this.ledges = this.physics.add.staticGroup();
    // Floor
    const floor = this.add.zone(640, FLOOR_Y + 40, 1400, 80);
    this.solids.add(floor);

    // Window we came in through, with a sill to land on.
    // Every room background paints its window at the far left (x 10-150, y 150-420).
    if (this.useWindow) {
      this.windowZone = this.add.zone(80, 290, 90, 200);
      const sill = this.add.rectangle(80, 418, 150, 14, 0xf3e3c3).setStrokeStyle(3, 0x5a3a2a).setDepth(-4);
      this.addLedge(sill.x, sill.y - 7, 150);
    }

    this.cat = new Cat(this, 80, 380);
    this.ctrl = new Controls(this);
    this.physics.add.collider(this.cat.phys, this.solids);
    this.physics.add.collider(this.cat.phys, this.ledges, undefined, oneWay(this.cat));

    this.buildRoom();

    if (this.useBroom) this.broom = new Broom(this, 900, FLOOR_Y, this.diff.broomSpeed, this.diff.broomChase);
    if (this.useDog) {
      this.dog = new Bulldog(this, FLOOR_Y, this.diff.dogSpeed * 0.9);
      this.nextDogAt = this.diff.roomDogDelay;
    }

    this.enteredAt = this.time.now;
    AudioEngine.get().playMusic(this.music);
    AudioEngine.get().setLayer('danger', false);
    this.scene.launch('Hud');
    this.scene.bringToTop('Hud');
    this.registry.set('bonus', timeBonus(this.elapsed));
    this.registry.set('air', null);
    fadeIn(this);
    banner(this, this.title, this.hint);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.registry.set('bonus', null);
      this.registry.set('air', null);
    });
  }

  /** One-way platform the cat can jump up through and drop down from. */
  addLedge(x: number, y: number, w: number): Phaser.GameObjects.Zone {
    const z = this.add.zone(x, y + 6, w, 12);
    this.ledges.add(z);
    return z;
  }

  protected abstract buildRoom(): void;
  protected abstract updateRoom(dt: number): void;

  update(_t: number, deltaMs: number): void {
    const dt = deltaMs / 1000;
    this.ctrl.update();
    this.cat.update(this.ctrl, dt);
    if (this.done) return;
    this.elapsed += dt;
    this.registry.set('bonus', timeBonus(this.elapsed));
    AudioEngine.get().setHurry(timeBonus(this.elapsed) < 600);

    const onFloor = this.cat.bottom >= FLOOR_Y - 4;
    this.broom?.update(this.cat, onFloor, (dir) => {
      shake(this, 0.004);
      if (dir < 0 && this.cat.x < 260) this.time.delayedCall(250, () => this.sweptOut());
    });

    if (this.dog) {
      if (!this.dog.active && this.elapsed >= this.nextDogAt) {
        this.dog.enter(this.cat.x);
        this.dogLeaveAt = this.elapsed + 9;
        this.nextDogAt = this.elapsed + 16;
      }
      if (this.dog.active && this.elapsed > this.dogLeaveAt) this.dog.leave();
      if (this.dog.update(this.cat, onFloor && this.cat.onGround)) this.loseLife('The dog got you!');
    }

    // Jumping back out of the window gives up the room.
    if (this.windowZone && this.time.now - this.enteredAt > 1500 && !this.cat.stunned && this.ctrl.left && !this.cat.onGround &&
      catIn(this.cat, this.windowZone)) {
      this.leave(false);
    }

    this.updateRoom(dt);
  }

  win(): void {
    if (this.done) return;
    this.done = true;
    const room = this.roomId === 'underwater' ? 'fishbowl' : this.roomId;
    const pts = winRoom(game.session, room, this.elapsed);
    game.session.roomHistory.push(room);
    this.cat.frozen = true;
    this.cat.setPose('cat_happy');
    this.cat.body.setVelocity(0, 0);
    this.cat.body.setAcceleration(0, 0);
    hitStop(this, 120);
    sparkles(this, this.cat.x, this.cat.y, 18, 0xffe080);
    AudioEngine.get().play('roomClear');
    AudioEngine.get().duck(1600);
    banner(this, 'ROOM CLEAR!', `+${pts.toLocaleString()} — a sweetheart is waiting…`, '#ffe36e');
    popText(this, this.cat.x, this.cat.y - 70, `+${pts}`, '#ffe36e', 40);
    this.time.delayedCall(2200, () => this.leave(true));
  }

  loseLife(reason: string): void {
    if (this.done || this.cat.invulnerable) return;
    this.done = true;
    shake(this, 0.012, 300);
    hitStop(this, 120);
    AudioEngine.get().play('lifeLost');
    AudioEngine.get().setLayer('danger', false);
    const over = loseLife(game.session);
    banner(this, reason, over ? '' : `${game.session.lives} ${game.session.lives === 1 ? 'life' : 'lives'} left`, '#ff9ec7');
    this.cat.die(() => {
      if (over) wipeTo(this, 'GameOver');
      else wipeTo(this, 'Alley', { from: 'room' });
    });
  }

  sweptOut(): void {
    if (this.done) return;
    this.done = true;
    AudioEngine.get().play('meow');
    banner(this, 'Swept out!', 'Shoo, kitty!', '#9ef0ff');
    this.cat.body.setVelocity(-500, -300);
    this.time.delayedCall(900, () => this.leave(false));
  }

  leave(won: boolean): void {
    this.done = true;
    AudioEngine.get().setLayer('danger', false);
    AudioEngine.get().setHurry(false);
    wipeTo(this, 'Alley', { from: won ? 'win' : 'room' });
  }
}
