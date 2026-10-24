import type Phaser from 'phaser';
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
