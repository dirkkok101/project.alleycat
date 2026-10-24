# Animation frames

Video-first cycles. Each base was pinned as both the first and last frame of a 6s locked-camera clip (side view, facing right, flat green plate), harvested at 12 fps, then keyed to straight alpha and registered. One scale per set, body anchor on the horizontal centre, feet on one baseline. Longest canvas side is 320 px. All files are RGBA PNG with transparent corners and no ground, shadow, or text.

## Cat run

Lively bound: stretch, tuck, open, stretch, tuck, open, back to stretch.

| File | Source frame | Pose |
|---|---|---|
| `cat_run_00.png` | 0 | Full stretch, paws forward and back |
| `cat_run_01.png` | 1 | Limbs pulling in, tail rising |
| `cat_run_02.png` | 2 | Tucked flight, tail up |
| `cat_run_03.png` | 4 | Opening, body a little taller |
| `cat_run_04.png` | 5 | Extended stride |
| `cat_run_05.png` | 7 | Gathering under the body |
| `cat_run_06.png` | 8 | Second tuck, tail up |
| `cat_run_07.png` | 9 | Opening toward the stretch |

- Canvas: **320×170**
- Intended playback: **12 fps** (cycle ≈ 0.67 s)
- Opaque height: 156–162 px, spread **3.8%** of the median
- Feet baseline: y = 165 on every frame
- Horizontal anchor: x = 158.8–159.7

Loop: frame 07 is mid-opening and lands on frame 00’s full stretch. The head stays put; only the legs and tail change.

## Cat idle

Gentle breath, one blink, tail out and back.

| File | Source frame | Pose |
|---|---|---|
| `cat_idle_00.png` | 0 | Stand, eyes open, tail curled up |
| `cat_idle_01.png` | 7 | Same stand, belly slightly fuller (inhale) |
| `cat_idle_02.png` | 24 | Eyes shut, tail straight out |
| `cat_idle_03.png` | 25 | Eyes open, tail at the low point of the swish |
| `cat_idle_04.png` | 26 | Tail curling back up |
| `cat_idle_05.png` | 27 | Tail up, matching the stand |

- Canvas: **320×176**
- Intended playback: **6 fps** (cycle = 1.0 s). The blink holds for one frame.
- Opaque height: **167 px on every frame**, spread **0%**
- Feet baseline: y = 170 on every frame
- Horizontal anchor: x = 158.9–159.6

Loop: frame 05 and frame 00 are both the curled-tail stand with open eyes.

## Bulldog walk

Near-side step: reach, pass, lift, plant.

| File | Source frame | Pose |
|---|---|---|
| `bulldog_walk_00.png` | 0 | Front paw forward and down |
| `bulldog_walk_01.png` | 5 | Front paw reaches farther forward |
| `bulldog_walk_02.png` | 10 | Front paw lifted under the chest |
| `bulldog_walk_03.png` | 15 | Front paw lifted and reaching |
| `bulldog_walk_04.png` | 21 | Paw coming back under the body |
| `bulldog_walk_05.png` | 25 | Compact plant, hind paw forward |

- Canvas: **320×175**
- Intended playback: **8 fps** (cycle = 0.75 s)
- Opaque height: 161–166 px, spread **3.0%** of the median
- Feet baseline: y = 170 on every frame
- Horizontal anchor: x = 159.1–159.7

Loop: frame 05’s planted paw steps forward into frame 00.

## Defects

- Edges are softer than the source sprites. The frames come from compressed video and were not redrawn, so the ink line is slightly fuzzy.
- Idle swish onset is abrupt. The tail goes from a high curl (frame 01) to fully extended (frame 02) in one frame, on the same frame as the blink. The return through frames 03–05 eases back. The inhale is only a few pixels of belly between frames 00 and 01.
- The run reads as a two-beat bound. Frames 02 and 06 are both tucks; the cel shading does not show a clear left/right leg swap.
- The bulldog clip never settled into a perfectly even period. The 05→00 join moves the hind paw a little faster than the steps inside the cycle. Far-side legs stay mostly hidden, which matches the base sprite.
