# 2× backgrounds

Each file in `out/bg2x/` is **2560×1440**, JPEG quality 88, same filename as `out/bg/`.

Alignment check: the delivered JPEG was downscaled with Lanczos to 1280×720 and compared to the original. **MAD** is the mean absolute difference per channel (0–255). A redraw was kept when the mean MAD was at most 12, phase correlation peaked at a shift of (0, 0), and the edge-map overlay showed windows, brick courses, and floor lines on the same pixels. Otherwise the file is a Lanczos upscale of the original plus a gentle unsharp mask (radius 1.2, amount 45%, threshold 2).

The redraws came back at 1280×720, on the same pixel grid, with cleaner line contrast. Kept redraws were then Lanczos-resized to 2560×1440. Every delivered file still phase-correlates at (0, 0).

| File | Method | MAD R | MAD G | MAD B | Mean |
|---|---|---:|---:|---:|---:|
| bg_alley.jpg | image_edit, then Lanczos resize | 9.05 | 7.43 | 9.03 | 8.50 |
| bg_bedroom.jpg | image_edit, then Lanczos resize | 4.06 | 2.00 | 2.76 | 2.94 |
| bg_dogroom.jpg | image_edit, then Lanczos resize | 2.16 | 1.80 | 2.00 | 1.99 |
| bg_kitchen.jpg | image_edit, then Lanczos resize | 10.72 | 8.37 | 6.25 | 8.44 |
| bg_library.jpg | image_edit, then Lanczos resize | 3.73 | 3.64 | 3.03 | 3.47 |
| bg_livingroom.jpg | image_edit, then Lanczos resize | 6.42 | 6.35 | 5.76 | 6.18 |
| bg_love.jpg | image_edit, then Lanczos resize | 4.59 | 1.70 | 1.80 | 2.70 |
| bg_title.jpg | image_edit, then Lanczos resize | 10.70 | 10.47 | 9.18 | 10.12 |
| bg_underwater.jpg | Lanczos 2× + unsharp | 0.21 | 0.18 | 0.21 | 0.20 |

## Why underwater was not a redraw

The underwater redraw’s whole-image mean MAD was 4.92, but the floor band was 18–22 and the edge overlay showed a stack of horizontal lines that are not in the original. Vertical slices through that floor correlated negatively with the source (best lags about 130–160 px). That redraw was discarded. The file above is the original, upscaled.

## What the kept redraws changed

Brick courses, checker tiles, sidewalk seams, and window frames stay on the source grid (row and column correlation lags of 0). The extra MAD on alley, kitchen, and title is darker mortar, grout, and ink on those same edges, which is what shows up as thin fringes on the edge overlay. Bedroom, dog room, and love are within a few levels of the source. No windows, floor lines, or objects moved, appeared, or disappeared on the files that shipped.
