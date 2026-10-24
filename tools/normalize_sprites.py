"""Put every pose/frame of a character on one shared canvas so swapping frames
never changes the character's size or makes it jump.

Generated poses come from separate image generations, each cropped tightly and
resized on its own, so their pixel scales differ. We rescale every frame so its
opaque area matches the reference pose (a cat covers about the same area in any
pose), then paste all frames bottom-aligned (feet on one baseline) and centred
on their opaque bounding box into one common canvas.

usage: python tools/normalize_sprites.py   (needs Pillow + numpy)
Reads art/out/**, writes public/assets/<name>.png
"""
import json
import math
import pathlib
import sys

import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'assets'

GROUPS = {
    # reference pose first
    'cat': ['cat/cat_idle', 'cat/cat_run1', 'cat/cat_run2', 'cat/cat_jump', 'cat/cat_fall', 'cat/cat_hurt',
            'cat/cat_swim', 'cat/cat_happy', 'cat/cat_climb']
           + [f'anim/cat_run_{i:02d}' for i in range(6)] + [f'anim/cat_idle_{i:02d}' for i in range(6)],
    'bulldog': ['creatures/bulldog_walk1', 'creatures/bulldog_walk2', 'creatures/bulldog_bark']
               + [f'anim/bulldog_walk_{i:02d}' for i in range(4)],
}


def load(rel: str):
    p = ROOT / 'art' / 'out' / f'{rel}.png'
    if not p.exists():
        return None
    im = Image.open(p).convert('RGBA')
    alpha = np.asarray(im)[:, :, 3]
    bbox = im.getbbox()
    return im.crop(bbox), float((alpha > 32).sum())


def main() -> None:
    meta = {}
    for group, rels in GROUPS.items():
        items = [(rel, load(rel)) for rel in rels]
        items = [(rel, it) for rel, it in items if it]
        if not items:
            continue
        ref_area = items[0][1][1]
        scaled = []
        for rel, (im, area) in items:
            k = math.sqrt(ref_area / area)
            w, h = max(1, round(im.width * k)), max(1, round(im.height * k))
            scaled.append((rel, im.resize((w, h), Image.LANCZOS)))
        pad = 8
        cw = max(im.width for _, im in scaled) + pad * 2
        ch = max(im.height for _, im in scaled) + pad * 2
        for rel, im in scaled:
            canvas = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
            canvas.alpha_composite(im, ((cw - im.width) // 2, ch - pad - im.height))
            canvas.save(OUT / f'{pathlib.Path(rel).name}.png')
        ref = scaled[0][1]
        # The game sizes characters by the reference pose, whatever the canvas.
        meta[group] = {'canvas': [cw, ch], 'refHeight': ref.height}
        print(f'{group}: {len(scaled)} frames on {cw}x{ch}; reference pose {ref.width}x{ref.height}')
    (OUT / 'sprite-meta.json').write_text(json.dumps(meta, indent=2) + '\n')


if __name__ == '__main__':
    sys.exit(main())
