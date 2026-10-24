# Batch C — props

30 RGBA PNGs in `out/props/`. Longest side matches the manifest. Sprites are keyed off a flat chroma background (green, or magenta when the prop is green), with a soft colour-distance edge, ~4% padding on each axis, then a Lanczos downscale. `window_open` is an edit of `window_closed`, `window_love` is an edit of `window_open`, `dish_empty` is an edit of `dish_full`, and `heart_broken` is an edit of `heart`. Style anchor: `ref/cat_ref.png`.

| file | pixels | unfixed defects |
|---|---|---|
| shoe.png | 96×62 | none |
| boot.png | 96×79 | none |
| clock.png | 87×96 | none |
| phone.png | 96×79 | none |
| book.png | 94×96 | none |
| fishbowl.png | 256×243 | none |
| table.png | 320×210 | none |
| trashcan.png | 157×192 | none |
| fence.png | 640×160 | plank run is repeated once so the segment is 4:1; the join is hard to see at this size |
| window_closed.png | 135×160 | about 0.84 wide-to-tall, a bit wider than a strict 3:4 |
| window_open.png | 135×160 | same frame and same aspect as `window_closed` |
| window_love.png | 135×160 | same frame and same aspect as `window_closed` |
| shelf.png | 480×60 | grain is stretched slightly (source was about 6.5:1) to reach 8:1 |
| books_row.png | 320×80 | none |
| fernpot.png | 128×124 | none |
| cheese.png | 640×427 | one hole breaks the left edge |
| birdcage.png | 158×256 | none |
| dish_full.png | 128×87 | none |
| dish_empty.png | 128×81 | bowl matches the full dish; shorter only because the kibble mound is gone |
| heart.png | 96×83 | none |
| heart_broken.png | 96×78 | cracked and dulled, but still pink rather than strongly grey |
| gift.png | 91×96 | none |
| shirt.png | 128×119 | none |
| sock.png | 69×96 | none |
| pants.png | 103×128 | none |
| pebbles.png | 640×80 | none |
| bubble.png | 64×63 | none |
| sparkle.png | 64×63 | none |
| pawprint.png | 48×43 | none |
| moon.png | 191×192 | none |
