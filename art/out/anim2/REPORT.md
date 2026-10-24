# Keyframe cycles

Each pose is an `image_edit` of the base sprite (the cat from `out/cat/cat_run1.png`, the bulldog from `out/creatures/bulldog_walk1.png`), drawn on a flat green field and keyed to straight alpha. Frames in a set share one canvas, one eye anchor, and one foot baseline. Nothing was mirrored. Every eye sits to the right of the body, so every frame faces right.

## Cat gallop

Six frames. Play at **12 fps** (the cycle is 0.5 s).

| File | Pose |
|---|---|
| `cat_run_00.png` | Full extension. Body long and level, front paws far forward, hind paws far back, tail straight behind, airborne. |
| `cat_run_01.png` | Front paws land. Chest drops, the back slopes down toward the nose, hind legs fold in. |
| `cat_run_02.png` | Gather. All four paws bunched under the belly, back round, tail curled up. |
| `cat_run_03.png` | Push. Hind legs drive back out, front paws reach forward, body opens. |
| `cat_run_04.png` | Rising flight. One front paw lifts with the pads showing, the other reaches forward, hind legs stay back. |
| `cat_run_05.png` | Reach. Both pairs extended, body long and level, a step short of frame 00. |

- Canvas: **454×235**
- Opaque height: 199–212 px, spread **6.4%** of the median (203.5)
- Feet baseline: y = 222 on every frame
- Eye anchor: x = 362

Widths run 431, 295, 231, 275, 338, 376, then back to 431. The silhouette shrinks into the gather and opens back out to the stretch.

Flip test. Frame 00 is the long airborne stretch with the tail level. Frame 01 drops the front paws and tips the chest down, and the hind legs come in. Frame 02 packs every paw under the belly, rounds the back, and curls the tail up. Frame 03 pushes the hind legs back out and reaches the front paws forward, and the tail comes down. Frame 04 lifts one front paw and lengthens the reach. Frame 05 stretches both pairs farther, still short of frame 00. Frame 05 leads into frame 00 by extending the same paws a little more. The head stays on the anchor. No leg vanishes or swaps sides.

## Bulldog trot

Four frames. Play at **8 fps** (the cycle is 0.5 s).

| File | Pose |
|---|---|
| `bulldog_walk_00.png` | Wide stride. One front paw reaches far ahead of the chest, one hind paw reaches far behind. |
| `bulldog_walk_01.png` | Passing. Legs under the body and straighter, so the chest sits higher. |
| `bulldog_walk_02.png` | Opposite beat. Front paws are back under the chest, behind the nose, and the hind legs drive straight back. The body is low. |
| `bulldog_walk_03.png` | Passing. Paws bunched under the ribs, body off the low lunge. |

- Canvas: **435×226**
- Opaque height: 190–203 px, spread **6.6%** of the median (196)
- Feet baseline: y = 213 on every frame
- Eye anchor: x = 284

Frame 01 is the tallest (203 px), which is the higher passing pose.

Flip test. Frame 00 is the long reach, a paw ahead of the chest and a paw behind the rump. Frame 01 pulls every leg in under the body and the dog stands taller. Frame 02 keeps the front paws back under the chest and sends the hind legs straight back, so the nose leads and the body is low. Frame 03 gathers the paws under the ribs again. Frame 03 leads into frame 00 when the front paw shoots forward and a hind paw reaches back. The face stays pointed right on every frame.

## Checks

- All ten files are RGBA PNG. Corners are fully transparent. No ground, cast shadow, or text.
- Green key fringe is removed. The cyan collar and magenta bell are intact.
- Facing: right on every frame. No frame needed a mirror.
- Opaque-height spread is 6.4% (cat) and 6.6% (bulldog), inside the 8% band.

## Defects

- The gather (cat frame 02) was drawn with a taller arched back. It is scaled to 94% of the iris match so the set stays inside the height band. That head is slightly smaller than the other five.
- The low bulldog lunge (frame 02) was a little short. It is scaled to 103% of the eye match. Edits that asked for the other front paw to lead kept redrawing frame 00's stride, so frame 02 is the opposite silhouette that held: nose in front, front paws recovered, hind legs driving back. It is not a perfect swap of which near-side paw is forward.
- Outlines are cel-shaded and dark, and the frames were downscaled from the edits. They are a little softer than the original base PNGs.
- The cat's tail curls up on the gather and sits level on the other five frames. The rise and fall is that one beat, not a smooth wave through every frame.
