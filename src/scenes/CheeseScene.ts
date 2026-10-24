import Phaser from 'phaser';
import { AudioEngine } from '../audio';
import { fitHeight } from '../assets';
import { FONT, hitStop, popText, puff, sparkles } from '../fx';
import { cheesePartner } from '../logic/rules';
import { game } from '../state';
import { hint } from '../tutorial';
import { FLOOR_Y, RoomScene } from './RoomScene';

const CX = 680;
const CHEESE_W = 660;
const CHEESE_H = 390;
const TOP_Y = 312; // standable top surface (the high, flat part of the wedge)
const TUNNEL_COOLDOWN_MS = 660;

// 16 holes like the original: 0-2 open on the top surface, 3-15 are round holes
// in the front face, each with a little ledge underneath to stand on.
const HOLES: [number, number][] = [
  [620, TOP_Y], [740, TOP_Y], [860, TOP_Y],
  [450, 380], [580, 380], [710, 380], [860, 392],
  [480, 452], [630, 452], [780, 452], [930, 452],
  [420, 532], [570, 532], [720, 532], [870, 532],
  [640, 612],
];

interface Hole {
  x: number;
  y: number;
  ledgeY: number; // where the cat stands to use the hole
  top: boolean;
}

interface Mouse {
  img: Phaser.GameObjects.Image;
  hole: number;
  visible: boolean;
  timer: number; // seconds until the next state change
  spooked: number; // seconds until a spooked mouse ducks (-1 = calm)
}

/**
 * Room 4: shy mice peek out of the cheese. Get close and they duck, so use
 * the tunnels (↓ in a hole) to pop out right beside them.
 */
export class CheeseScene extends RoomScene {
  readonly roomId = 'cheese' as const;
  readonly bgKey = 'bg_kitchen' as const;
  readonly title = 'Say Cheese!';
  readonly hint = 'Catch the shy mice · ↓ in a hole to tunnel';
  private holes: Hole[] = [];
  private mice: Mouse[] = [];
  private caught = 0;
  private needed = 4;
  private lastTunnel = 0;
  private tunnelling = false;
  private standTime = 0;
  private counter!: Phaser.GameObjects.Text;

  constructor() {
    super('Cheese');
  }

  protected buildRoom(): void {
    this.holes = [];
    this.mice = [];
    this.caught = 0;
    this.needed = this.diff.cheeseMice;
    this.lastTunnel = 0;
    this.tunnelling = false;
    this.standTime = 0;

    const cheese = this.add.image(CX, FLOOR_Y, 'cheese').setOrigin(0.5, 1).setDepth(-2);
    cheese.setDisplaySize(CHEESE_W, CHEESE_H);
    this.addLedge(745, TOP_Y, 330);
    // A counter on the left gives a way up.
    const t = fitHeight(this.add.image(170, FLOOR_Y, 'table').setOrigin(0.5, 1).setDepth(-2), 150);
    this.addLedge(170, FLOOR_Y - 150 + 8, t.displayWidth * 0.9);

    HOLES.forEach(([x, y], i) => {
      const top = i < 3;
      if (top) {
        this.add.ellipse(x, y + 4, 60, 18, 0x4a2f08, 0.9).setDepth(-1);
        this.holes.push({ x, y: y - 6, ledgeY: y, top });
      } else {
        this.add.ellipse(x, y, 58, 44, 0x4a2f08, 0.9).setDepth(-1);
        const lip = this.add.rectangle(x, y + 26, 66, 8, 0xe0a52a).setStrokeStyle(2, 0x8a5a10).setDepth(-1);
        this.addLedge(x, lip.y - 4, 66);
        this.holes.push({ x, y, ledgeY: lip.y - 4, top });
      }
    });

    for (let i = 0; i < this.needed; i++) {
      const img = fitHeight(this.add.image(0, 0, 'mouse_peek').setOrigin(0.5, 1).setDepth(30), 42).setVisible(false);
      const m: Mouse = { img, hole: -1, visible: false, timer: 0.3 + i * 0.4, spooked: -1 };
      this.mice.push(m);
      this.moveMouse(m);
    }

    this.counter = this.add
      .text(CX, TOP_Y - 70, '', { fontFamily: FONT, fontSize: '30px', color: '#ffffff', stroke: '#1b1433', strokeThickness: 7 })
      .setOrigin(0.5);
    this.updateCounter();
  }

  private updateCounter(): void {
    this.counter.setText(`🐭 ${this.caught} / ${this.needed}`);
  }

  /** Pick a free hole, preferring ones away from the cat (as the original does). */
  private moveMouse(m: Mouse): void {
    const taken = new Set(this.mice.filter((o) => o !== m).map((o) => o.hole));
    for (let tries = 0; tries < 32; tries++) {
      const h = Math.floor(Math.random() * this.holes.length);
      if (taken.has(h)) continue;
      m.hole = h;
      if (Phaser.Math.Distance.Between(this.holes[h].x, this.holes[h].y, this.cat.x, this.cat.y) > 200) return;
    }
  }

  protected updateRoom(dt: number): void {
    this.updateTunnels(dt);
    this.updateMice(dt);
  }

  private holeUnderCat(): number {
    const c = this.cat;
    if (!c.onGround) return -1;
    return this.holes.findIndex((h) => Math.abs(c.bottom - h.ledgeY) < 10 && Math.abs(c.x - h.x) < 34);
  }

  private updateTunnels(dt: number): void {
    if (this.tunnelling) return;
    const at = this.holeUnderCat();
    // On a hole, ↓ means tunnel (even during the cooldown), never drop through.
    if (at >= 0) this.cat.dropUntil = 0;
    this.standTime = at >= 0 ? this.standTime + dt : 0;
    if (this.standTime > 1.5) hint(this, this.cat.x, this.cat.y - 90, 'Press ↓ to tunnel!', 'tunnel');
    if (at < 0 || !this.ctrl.downPressed || this.cat.stunned) return;
    if (this.time.now - this.lastTunnel < TUNNEL_COOLDOWN_MS) return;
    this.tunnel(at, cheesePartner(game.session.level, at));
  }

  /** Dive into one hole and pop out of its partner. Safe from the broom meanwhile. */
  private tunnel(from: number, to: number): void {
    const cat = this.cat;
    const a = this.holes[from];
    const b = this.holes[to];
    this.tunnelling = true;
    this.lastTunnel = this.time.now;
    cat.dropUntil = 0;
    cat.frozen = true;
    cat.posed = true;
    cat.invulnUntil = this.time.now + 600;
    cat.body.setVelocity(0, 0);
    cat.body.setAllowGravity(false);
    AudioEngine.get().play('bubble', { pitch: 0.7 });
    puff(this, a.x, a.y, 5, 0xffd060);
    const sx = cat.img.scaleX;
    const sy = cat.img.scaleY;
    this.tweens.add({
      targets: cat.img,
      x: a.x,
      y: a.y + 10,
      scaleX: 0.01,
      scaleY: 0.01,
      duration: 140,
      ease: 'Quad.In',
      onComplete: () => {
        cat.body.reset(b.x, b.ledgeY - cat.body.height / 2 - 1);
        cat.img.setPosition(b.x, b.y + 10);
        AudioEngine.get().play('bubble', { pitch: 1.3 });
        puff(this, b.x, b.y, 5, 0xffd060);
        this.tweens.add({
          targets: cat.img,
          y: b.ledgeY + 3,
          scaleX: sx,
          scaleY: sy,
          duration: 180,
          ease: 'Back.Out',
          onComplete: () => {
            cat.frozen = false;
            cat.posed = false;
            cat.body.setAllowGravity(true);
            this.tunnelling = false;
            // Popping out is a surprise: mice get a fresh reaction window from here.
            for (const m of this.mice) m.spooked = -1;
          },
        });
      },
    });
  }

  private updateMice(dt: number): void {
    const b = this.cat.body;
    const catRect = new Phaser.Geom.Rectangle(b.x, b.y, b.width, b.height);
    for (const m of this.mice) {
      if (m.hole < 0) continue;
      const h = this.holes[m.hole];
      m.timer -= dt;
      if (!m.visible) {
        if (m.timer <= 0) {
          m.visible = true;
          m.timer = 3.3;
          m.spooked = -1;
          m.img.setPosition(h.x, h.y + 30).setVisible(true);
          this.tweens.add({ targets: m.img, y: h.y + 14, duration: 150, ease: 'Back.Out' });
          AudioEngine.get().play('squeak', { volume: 0.4, pan: (h.x - 640) / 640 });
        }
        continue;
      }
      // Touch to catch; it works while walking, standing or mid-jump.
      const r = Phaser.Geom.Rectangle.Inflate(m.img.getBounds(), 4, 4);
      if (!this.tunnelling && !this.cat.stunned && Phaser.Geom.Intersects.RectangleToRectangle(r, catRect)) {
        this.catchMouse(m);
        continue;
      }
      // Shy: once the cat is close it ducks after a short reaction.
      const d = Phaser.Math.Distance.Between(h.x, h.y, this.cat.x, this.cat.y);
      if (m.spooked < 0 && d < this.diff.shyRadius && !this.tunnelling) m.spooked = 0.3;
      if (m.spooked >= 0 && !this.tunnelling) m.spooked -= dt;
      if (m.timer <= 0 || (m.spooked !== -1 && m.spooked <= 0)) this.duck(m);
    }
  }

  private duck(m: Mouse): void {
    m.visible = false;
    m.spooked = -1;
    m.timer = 0.1 + Math.random() * 1.1;
    const img = m.img;
    this.tweens.add({ targets: img, y: img.y + 20, duration: 100, onComplete: () => img.setVisible(false) });
    this.moveMouse(m);
  }

  private catchMouse(m: Mouse): void {
    m.visible = false;
    m.hole = -1;
    m.img.setVisible(false);
    this.caught++;
    this.progress();
    this.updateCounter();
    AudioEngine.get().play('catch', { pitch: 1 + this.caught * 0.08 });
    AudioEngine.get().play('squeak');
    hitStop(this, 60);
    sparkles(this, m.img.x, m.img.y - 10, 10);
    popText(this, m.img.x, m.img.y - 40, 'Got it!', '#ffe36e');
    if (this.caught >= this.needed) this.win();
  }
}
