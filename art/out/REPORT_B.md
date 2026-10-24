# Batch B — creatures

All files are true-alpha RGBA PNGs in `out/creatures/`. Longest side matches the manifest. Keyed from a flat blue field, tight crop with about 4% padding, then LANCZOS downscale. Variants are edit-chained from their own base.

| file | pixels (W×H) | notes |
|---|---|---|
| bulldog_walk1.png | 256×205 | base; walking, legs apart, facing right |
| bulldog_walk2.png | 256×215 | edit of walk1; legs gathered under the body |
| bulldog_bark.png | 256×205 | edit of walk1; mouth open |
| mouse_run1.png | 128×93 | base; running, facing right |
| mouse_run2.png | 128×94 | edit of run1; other leg phase (body stretched, paws reaching forward) |
| mouse_peek.png | 128×111 | edit of run1; front view, head and two paws |
| goldfish.png | 128×108 | facing right |
| eel.png | 256×96 | horizontal, facing right, lightning markings |
| spider.png | 256×181 | front view, legs out |
| canary.png | 128×122 | base; wings down, facing right |
| canary_fly.png | 123×128 | edit of canary; wings raised |
| sleepdog.png | 256×138 | base; asleep, eyes closed, facing right |
| angrydog.png | 256×210 | edit of sleepdog; standing, angry, facing right |
| cupid.png | 192×174 | flying, facing right, wings and bow |
| broom.png | 151×256 | upright, bristles at the bottom |

## Unfixed defects

- Every bulldog frame has a cyan collar and a magenta bell. Those colours came along from the cat style anchor. They are not in the bulldog description. The collar and bell match across walk1, walk2, and bark.
- The broom’s face is a cheerful open smile. It does not read as a sly smirk.
- The bulldog and the brown puppy are three-quarter views (both eyes visible) with the nose pointing right, rather than a one-eye profile.

No baked backgrounds, no text, and no clipped silhouettes in the delivered files. The peeking mouse’s ledge line and the angry puppy’s motion ticks were removed before export.
