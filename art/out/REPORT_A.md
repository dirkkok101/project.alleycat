# Batch A report — hero cat poses

Output folder: `out/cat/`. All files are true-alpha RGBA PNGs, keyed off a flat chroma-green field, cropped with about 4% padding, then scaled with Lanczos so the longest side is 256. Hero poses are edit-chained from `ref/cat_ref.png`. `girlcat.png` and `rivalcat.png` are new characters drawn from that same style anchor.

| file | pixels | unfixed defects |
|---|---|---|
| cat_idle.png | 249×256 | none |
| cat_run1.png | 256×201 | none |
| cat_run2.png | 256×250 | none |
| cat_jump.png | 256×230 | none |
| cat_fall.png | 256×225 | Hind paws trail behind the body. Front paws hang and spread downward, ears are swept back, and the face is startled, in right profile. Three earlier falls were a walk, a two-eye three-quarter, and a stand. |
| cat_hurt.png | 247×256 | none |
| cat_swim.png | 256×239 | none |
| cat_happy.png | 227×256 | none |
| cat_climb.png | 130×256 | none |
| girlcat.png | 224×256 | none |
| rivalcat.png | 256×231 | none |

Corners of every file are fully transparent. No baked ground, cast shadow, or text. Hero sprites face right. `girlcat.png` and `rivalcat.png` face left.
