import Phaser from 'phaser';

/**
 * Render scale. The world is always 1280x720; on HiDPI or large screens the
 * canvas is drawn at 2x and every camera zooms 2x, so the browser never has to
 * upscale (blur) the picture.
 */
export const RES = window.devicePixelRatio > 1 || window.innerWidth > 1400 ? 2 : 1;

export function setupCamera(scene: Phaser.Scene): void {
  const cam = scene.cameras.main;
  cam.setZoom(RES);
  cam.centerOn(640, 360);
}

// Text is rasterised to a texture, so it needs the same resolution boost.
const factory = Phaser.GameObjects.GameObjectFactory.prototype;
const addText = factory.text;
factory.text = function (this: Phaser.GameObjects.GameObjectFactory, ...args: Parameters<typeof addText>) {
  return addText.apply(this, args).setResolution(RES);
};
