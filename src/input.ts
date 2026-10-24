import Phaser from 'phaser';

// Key state is tracked globally so a key held through a scene change keeps working.
const held = new Set<string>();
// No preventDefault here: Phaser ignores events that are already default-prevented.
window.addEventListener('keydown', (e) => held.add(e.code));
window.addEventListener('keyup', (e) => held.delete(e.code));
window.addEventListener('blur', () => held.clear());

/**
 * Keyboard + gamepad + on-screen touch, merged into one set of actions.
 * Call update() once per frame before reading.
 */
export class Controls {
  left = false;
  right = false;
  up = false;
  down = false;
  jump = false;
  jumpPressed = false;
  downPressed = false;
  upPressed = false;

  private touch = { left: false, right: false, jump: false, down: false };
  private prev = { jump: false, down: false, up: false };

  constructor(private scene: Phaser.Scene) {
    // Fresh scene: anything already held counts as held, but not as a new press.
    this.prev.jump = this.prev.down = this.prev.up = true;
    if (scene.sys.game.device.input.touch) this.buildTouchPad();
  }

  update(): void {
    const k = (...codes: string[]) => codes.some((c) => held.has(c));
    const pad = this.scene.input.gamepad?.total ? this.scene.input.gamepad.getPad(0) : undefined;
    const ax = pad ? pad.leftStick.x : 0;
    const ay = pad ? pad.leftStick.y : 0;
    this.left = k('ArrowLeft', 'KeyA') || this.touch.left || ax < -0.4 || !!pad?.left;
    this.right = k('ArrowRight', 'KeyD') || this.touch.right || ax > 0.4 || !!pad?.right;
    this.up = k('ArrowUp', 'KeyW') || ay < -0.5 || !!pad?.up;
    this.down = k('ArrowDown', 'KeyS') || this.touch.down || ay > 0.5 || !!pad?.down;
    this.jump = k('Space', 'KeyZ', 'KeyX') || this.up || this.touch.jump || !!pad?.A || !!pad?.B;
    this.jumpPressed = this.jump && !this.prev.jump;
    this.downPressed = this.down && !this.prev.down;
    this.upPressed = this.up && !this.prev.up;
    this.prev.jump = this.jump;
    this.prev.down = this.down;
    this.prev.up = this.up;
  }

  private buildTouchPad(): void {
    const s = this.scene;
    s.input.addPointer(3);
    const mk = (x: number, y: number, label: string, prop: keyof Controls['touch']) => {
      const c = s.add.circle(x, y, 58, 0xffffff, 0.16).setStrokeStyle(4, 0xffffff, 0.35).setDepth(1000);
      s.add.text(x, y, label, { fontFamily: 'Fredoka', fontSize: '44px', color: '#ffffff' })
        .setOrigin(0.5).setAlpha(0.6).setDepth(1001);
      c.setInteractive();
      c.on('pointerdown', () => (this.touch[prop] = true));
      c.on('pointerup', () => (this.touch[prop] = false));
      c.on('pointerout', () => (this.touch[prop] = false));
    };
    mk(90, 630, '◀', 'left');
    mk(230, 630, '▶', 'right');
    mk(1190, 600, '▲', 'jump');
    mk(1060, 650, '▼', 'down');
  }
}
