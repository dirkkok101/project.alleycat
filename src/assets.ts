import Phaser from 'phaser';

// Every texture key maps to public/assets/<key>.<ext>. Missing files get a
// generated placeholder so the game stays playable while art is in progress.
export const SPRITES = [
  'cat_idle', 'cat_run1', 'cat_run2', 'cat_jump', 'cat_fall', 'cat_hurt', 'cat_swim', 'cat_happy', 'cat_climb',
  'girlcat', 'rivalcat',
  'bulldog_walk1', 'bulldog_walk2', 'bulldog_bark',
  'mouse_run1', 'mouse_run2', 'mouse_peek',
  'goldfish', 'eel', 'spider', 'canary', 'canary_fly', 'sleepdog', 'angrydog', 'cupid', 'broom',
  'shoe', 'boot', 'clock', 'phone', 'book',
  'fishbowl', 'table', 'trashcan', 'fence', 'window_closed', 'window_open', 'window_love',
  'shelf', 'books_row', 'fernpot', 'cheese', 'birdcage', 'dish_full', 'dish_empty',
  'heart', 'heart_broken', 'gift', 'shirt', 'sock', 'pants', 'pebbles', 'bubble', 'sparkle', 'pawprint', 'moon',
] as const;

export const BACKGROUNDS = [
  'bg_alley', 'bg_title', 'bg_livingroom', 'bg_underwater', 'bg_library', 'bg_kitchen', 'bg_bedroom', 'bg_dogroom', 'bg_love',
] as const;

export type SpriteKey = (typeof SPRITES)[number];
export type BgKey = (typeof BACKGROUNDS)[number];

const PLACEHOLDER_COLORS: Record<string, number> = {
  cat: 0x2b2550, girlcat: 0xfff1e0, rivalcat: 0xff9a3c, bulldog: 0x9a9aa8, mouse: 0xb8b8c8,
  goldfish: 0xff8a2a, eel: 0xc8e040, spider: 0x8a4ad0, canary: 0xffe040, sleepdog: 0xa0703a, angrydog: 0xa0703a,
  cupid: 0xffd0e0, broom: 0xd8b060, heart: 0xff4a7a, gift: 0x40e0e0, bg: 0x3a2f6a,
};

export function preloadAll(scene: Phaser.Scene): void {
  for (const key of SPRITES) scene.load.image(key, `assets/${key}.png`);
  for (const key of BACKGROUNDS) scene.load.image(key, `assets/${key}.jpg`);
  scene.load.on(Phaser.Loader.Events.FILE_LOAD_ERROR, (file: Phaser.Loader.File) => {
    makePlaceholder(scene, file.key);
  });
}

function makePlaceholder(scene: Phaser.Scene, key: string): void {
  if (scene.textures.exists(key)) scene.textures.remove(key);
  const isBg = key.startsWith('bg_');
  const prefix = Object.keys(PLACEHOLDER_COLORS).find((p) => key.startsWith(p));
  const color = isBg ? PLACEHOLDER_COLORS.bg : (prefix ? PLACEHOLDER_COLORS[prefix] : 0xc0a0ff);
  const w = isBg ? 1280 : 128;
  const h = isBg ? 720 : 128;
  const g = scene.make.graphics({}, false);
  g.fillStyle(color, 1);
  if (isBg) {
    g.fillRect(0, 0, w, h);
    g.fillStyle(0x000000, 0.15);
    for (let x = 0; x < w; x += 80) g.fillRect(x, 0, 40, h);
  } else {
    g.fillRoundedRect(4, 4, w - 8, h - 8, 28);
    g.lineStyle(6, 0x1a1030, 1);
    g.strokeRoundedRect(4, 4, w - 8, h - 8, 28);
  }
  g.generateTexture(key, w, h);
  g.destroy();
}

/** Scale an image uniformly so its displayed height is h. */
export function fitHeight<T extends Phaser.GameObjects.Components.Transform & { height: number }>(obj: T, h: number): T {
  const s = h / obj.height;
  obj.setScale(s, s);
  return obj;
}

export function fitWidth<T extends Phaser.GameObjects.Components.Transform & { width: number }>(obj: T, w: number): T {
  const s = w / obj.width;
  obj.setScale(s, s);
  return obj;
}
