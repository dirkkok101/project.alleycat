import Phaser from 'phaser';
import type { Cat } from './Cat';

type Bodyish = { body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | null };

/**
 * Collide-process filter for one-way ledges: only land on them from above,
 * and let the cat drop through when it asks to.
 */
export function oneWay(cat: Cat) {
  return (_a: unknown, ledge: unknown): boolean => {
    const lb = (ledge as Bodyish).body;
    if (!lb || cat.dropping || cat.dead) return false;
    const b = cat.body;
    return b.velocity.y >= 0 && b.prev.y + b.height <= lb.top + 6;
  };
}

/** True when the cat's body overlaps a (body-less) trigger zone. */
export function catIn(cat: Cat, zone: Phaser.GameObjects.Zone): boolean {
  const b = cat.body;
  const zx = zone.x - zone.width / 2;
  const zy = zone.y - zone.height / 2;
  return b.right > zx && b.x < zx + zone.width && b.bottom > zy && b.y < zy + zone.height;
}

/**
 * The one touch rule for pickups and hazards: the cat's body against the
 * target sprite's bounds, inset by `inset` (fraction of each side) because
 * sprites carry transparent padding and rounded shapes. A negative inset
 * grows the box, for deliberately generous targets.
 */
export function catTouches(cat: Cat, target: Phaser.GameObjects.Image, inset = 0.15): boolean {
  if (!target.visible) return false;
  const r = target.getBounds();
  const dx = r.width * inset;
  const dy = r.height * inset;
  const b = cat.body;
  const hit = b.right > r.x + dx && b.x < r.right - dx && b.bottom > r.y + dy && b.y < r.bottom - dy;
  if (cat.debugDraw) cat.debugDraw(r.x + dx, r.y + dy, r.width - 2 * dx, r.height - 2 * dy, hit);
  return hit;
}
