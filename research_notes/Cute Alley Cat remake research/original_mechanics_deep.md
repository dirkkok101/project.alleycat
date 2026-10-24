# Alley Cat (IBM PC, 1984): exact mechanics, scene by scene

This note goes deeper than `original_game.md`. That note already covers the secondary sources (Wikipedia, Data Driven Gamer, FRGCB, VGJUNK, Greatest Games), and I have not repeated them here. Everything below comes from the primary code:

- **Port**: [beyondbeneath/vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat) `js/game.js` at commit `872b710`. It is a routine-by-routine JS port of the disassembly. Line numbers ("game.js L1234") refer to that commit. The port has no per-room files: every room lives in `game.js`, and its section headers follow the original `level_objects.asm`.
- **Disassembly**: [gmegidish/alleycat-disassembly](https://github.com/gmegidish/alleycat-disassembly) at commit `d2754ef`. I cite it as "asm `file:line`".
- **Data tables**: I read these straight from the original data segment that the port ships (`js/assets.js`). Each one is indexed by `difficulty_level` 0–7 unless the text says otherwise.
- **Measured**: I ran the port headless on its virtual 4.77 MHz clock (`tools/headless.js`) and recorded memory. Its loop rates match a reference 8088 emulator to within about 10% (port README §15). Measured numbers are marked **(measured)**. Treat them as ±10%, and remember they depend on what is on screen.

Labels such as `deduct_life` or `show_extra_life` were chosen by the disassemblers, not by Synapse. Where a label is misleading, I say so.

**Units.** 1 tick = 1/18.2 s (BIOS timer). Positions are in original 320×200 pixels. To convert to our 1280×720 canvas, multiply x by 4 and y by 3.6. `cat_y` is the top of the cat's sprite: the alley street is `cat_y` 180 (0xB4), a room floor is also 180, and the fence top is 96 (0x60).

---

## 0. What overturns our earlier notes (read this first)

1. **A thrown object that hits the cat in the alley costs a life.** Each throw sets `deduct_life=1` (asm `level_physics.asm:470`), and a hit decrements `lives_count` when that flag is set (asm `alley.asm:229-233`, `handle_cat_death`). The flag is cleared only if the object lands without hitting anything (asm `level_physics.asm:341`). This settles the conflict noted in `original_game.md`: on PC a hit is lethal, not just a knock-off. The cat is also dazed for 10 ticks and knocked down.
2. **Every window that opens throws exactly one object**, unless one is already falling (game.js L759-L786, `jump_toss_remaining=1`). Our `throwChance` of 0.25–0.81 is roughly 4× too gentle.
3. **Windows open only while the cat is on the fence or higher** (`cat_y <= 0x60`, game.js L743). Standing on the street or a bin never opens a window. **To enter, the cat must be moving down** into the window (`in_level_mode === 1`, game.js L814).
4. **The cheese "tunnels" are an instant teleport from one hole to its paired hole.** Stand on a hole's ledge and press Alt. The cat sinks into that hole, and about 0.2 s later it climbs out of a fixed partner hole elsewhere on the cheese. There are 16 holes in 8 pairs, and the pairing changes with difficulty. There is no free movement inside the cheese. I verified this in the emulator (§4).
5. **The alley's dustbin layout shrinks with difficulty**: 6, 5, 4, 3, 4, 3, 4, 3 bins at levels 0–7, at different positions and heights (§1.4).
6. **The PC version has no feral cat on the bins.** Bin *lids* pop off instead. A lid that touches the cat knocks it off and calls the dog at once (§1.5). Our remake uses lids as springs, which is the opposite.
7. **There is no air control.** The direction is fixed at take-off (§8). **A running jump is both higher and longer** than a standing jump (measured: 61 px rise vs 31–37 px). This contradicts the earlier notes' summary ("a standing jump goes high but short") and the port's comment "the higher the walking speed, the flatter the jump" (game.js L4994). DDG only said that standing hops travel little sideways, which still holds.
8. **Running out of air in the fishbowl is certain death.** At `phase1` the cat is forced to sink (`in_level_mode=1` is "down" in this room, game.js L4727 and L4773-L4775). Input is ignored and the cat is immune until `death_ticks`, about 4 s later. The port's comment "the cat floats up" (L4714) is wrong about the direction; the bubbles rise, the cat does not.
9. **The broom flies.** It moves in x and y (8 px and 2 px per tick) and hunts the cat up onto platforms. When it hits, it throws the cat towards the entrance window, so it can sweep the cat right out of the room. Its homing grows the longer the cat stays in the room (§9).
10. **The dog in a room is a dice roll, not a timer.** It uses the same `enemy_spawn_chance` table as the alley and rolls only while the cat is on the floor (§9).

---

## 1. Alley (hub)

Main loop: game.js L4440-L4464. While the dog is off screen, everything after `update_enemies` (music, washing lines, windows, thrown objects, lids, mice) runs only every 4th pass of the loop (L4449-L4451).

### 1.1 Windows and entering a room
- **12 windows**: 4 columns at x = 24, 104, 184, 264 (`jump_spawn_x_table`) × 3 rows at y = 24, 56, 88 (`jump_spawn_y_table` = 24, 56, 88, 24). Each window is 32×15 (game.js L813). Only one window is open at a time (one `jump_anim_counter`).
- **Opening** (`update_cat_jump`, game.js L734-L801; asm `level_physics.asm:386`): a new window is chosen only when `cat_y <= 0x60`. Each attempt picks `random & 0xF` and gives up if the result is 12 or more, so there are short random gaps between windows. The window animates over 29 steps (counter 0x1D→0), and the code steps it at most once every 13 calls. At step 0xF the window **holds fully open** for `jump_pause_by_diff` ticks while it throws.
- `jump_pause_by_diff` = **45, 36, 27, 18, 9, 18, 1, 18** ticks (2.5 s down to 0.05 s). The table is not monotonic: levels 4 and 6 are the shortest.
- **Measured** (cat on the street with the height gate patched out, dog disabled; real play near the fence will differ slightly):

  | level | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
  |---|---|---|---|---|---|---|---|---|
  | open→closed, median s | 3.14 | 2.65 | 2.15 | 1.65 | 1.42 | 1.68 | 1.14 | 1.69 |
  | enterable span, median s | 2.95 | 2.45 | 1.95 | 1.45 | 1.21 | 1.47 | 0.93 | 1.48 |
  | windows per 60 s | 18 | 22 | 25 | 31 | 39 | 33 | 45 | 33 |

- **Entering** (`check_fish_collision`, game.js L811-L817; asm `enemy.asm:16`): the cat's 24×14 box must overlap the window rect while the window counter is between 5 and 0x18 (the "enterable span" above). The cat must also be **falling**, not transitioning, with `cat_y < 0x60`. In practice you jump past the window and drop into it, or drop into it from the washing line above.
- **Bottom-row windows next to a bin whose lid is off do not open** (game.js L819-L830).
- **Camping on the fence is punished.** After more than 0x48 ticks (4 s) on the fence (`game_mode==1`), `idle_aggro_flag` is set (L746-L747). New windows then open only on the top row, and the thrown object stops drifting once it is above the cat, so it **drops straight onto it** (L692).
- **After a room is won** (`force_level7`), the next window shows the lady cat instead of a person, throws nothing, and leads to the love scene. Fence aggro is also off (L746, L770, L796).

### 1.2 Thrown objects
- One object per opened window (L770-L784), released from a random x within 0–15 px of the window's x and drifting towards the cat. It is one of 4 sprites (`gravity_sprite_ptrs`).
- It falls with acceleration: its y grows by `frame/2` each tick (L704). It stops at `gravity_target_height` = 97, 100, 94, 94, which is **about fence height**. So thrown objects threaten a cat on the lines or the fence, never one on the bins or the street.
- Sideways drift is about 4 px per tick (L695-L701; the speed never actually decays).
- **A hit** (`check_dog_collision`, a misnomer: L833-L852; asm `enemy.asm:69`) dazes the cat for 10 ticks, makes it fall (`enter_building` sets falling), costs **1 life** (asm `alley.asm:229`), and bounces the object away at triple speed.

### 1.3 Washing lines and the line mice
- There are 3 lines. The cat stands on them at `cat_y` 8, 40, 72 (L659). A line scrolls 4 px every `throw_delay` = **100, 80, 70, 60, 55, 50, 40, 40** loop passes, and 4× faster while the cat is high (`cat_y <= 0x60`) (L202-L204). Lines move alternately left and right. A cat standing on laundry is carried along and falls off at the end (L247-L260).
- The cat can stand only where there is laundry (`check_window_landing`, L655-L674). The chance that a new stretch of line is **bare**: `throw_chance` = **6, 20, 32, 46, 46, 52, 58, 64** in 256. There is an extra per-line bare threshold `throw_y_param` = 128, 48, 0 (top, middle, bottom), so the top line is much barer (L314-L331).
- **Mice**: 3, one per line, at y 0, 32, 64. One mouse is updated per tick. Normal speed is 4 px per step, 8 px when the cat is high, and 12 px when chasing (L1246-L1266).
- A mouse level with a standing cat runs at it with chance `obj_chase_table` = **8, 32, 64, 128, 160, 192, 208, 240** in 256.
- A mouse touching a *standing* cat knocks it off the line (dazed for 8 ticks, not lethal). A *leaping* cat catches it for 90, 70 or 50 points (`obj_score` 9, 7, 5 in the tens digit). A caught mouse returns from the far side after 0x36 ticks (3 s) (L1235-L1243, L1314-L1344).

### 1.4 Fence and dustbins (the layout changes with difficulty)
- The fence top is `cat_y` 96 (L569-L582). Bins come in two heights: short (`cat_y` 142) and tall (`cat_y` 134). The street is `cat_y` 180.
- Bin table (`door_position_table`, read from `floor_first_door` for `floor_door_count+1` entries; x = (c & 0x7F) << 2; bit 7 set = tall):

  | level | bins | x positions (T = tall) |
  |---|---|---|
  | 0 | 6 | 24, 64T, 104, 152, 240, 280T |
  | 1 | 5 | 24T, 56T, 96, 160, 272T |
  | 2, 4, 6 | 4 | 24, 64T, 160, 264T |
  | 3, 5, 7 | 3 | 32, 88T, 280 |

  The gaps grow at higher levels, so getting from the street to the fence needs long running jumps. This matches DDG's Atari observation of "only one bin reaches the fence".
- The fence is 84 px above the street. A standing jump rises about 31–37 px and a running jump about 61 px (§8), so **the fence can only be reached from a bin**.

### 1.5 Bin lids (instead of a feral cat)
- `animate_falling` (L1160-L1192; asm `objects.asm:13`): a lid flies up and drops back over 27 steps, one step per tick (about 1.5 s).
- **Whenever the cat stands on a bin, a lid pops every time one is free.** Otherwise a lid pops with chance 5/256 per tick. The lid comes from a random bin, never the same one twice in a row.
- A lid touching the cat sets `fall_hit`. **That skips the dog's spawn roll** (L1016), so the dog comes running at once. A cat perched on something that is hit by a lid is thrown off in a random direction (L4966-L4975).

### 1.6 The bulldog
- `update_enemies` (L975-L1062; asm `enemy.asm:373`). The dog rolls to spawn only while the cat is on the street (`cat_y >= 180`), with chance `enemy_spawn_chance` = **2, 4, 8, 12, 16, 24, 32, 64** in 256 per check (a check every 1–2 ticks), or immediately after a lid hit.
- It enters from the side away from the cat and moves 8 px per step. Each step it turns towards the cat with chance `enemy_chase_chance` = **16, 32, 48, 64, 80, 96, 112, 128** in 256 while the cat is on the street. It leaves when it reaches an edge while the cat is up high.
- **Measured** speed: about 94–98 px/s. The cat's top walking speed is about 288 px/s, so the cat can outrun the dog, but the gaps between bins force it onto the street.
- **Contact** happens when the cat's top is at or below 163 (`cat_y >= 0xA3`) and the cat overlaps the dog (L1106-L1117): a fight cloud, 1 life lost, and the cat restarts at the edge (L1121-L1148).

---

## 2. Room 1: the fishbowl room → Room 2: inside the bowl

**Room 1** (game.js L4564-L4573; layout L1495-L1503): entrance window at (160, 96). The bowl hot-spot is a 16×10 rect at (228, 138) on the table (L2993-L3001). Touching it moves the cat into Room 2, and the time bonus keeps running. Hazards are the broom and the dog. There is no other goal and no life risk apart from the dog.

**Room 2** (L4574-L4584, L2814-L2989; asm `level_objects.asm:690` and on):
- **Win**: eat all **12 fish**. That count does not depend on difficulty. There are 24 objects: 0–11 are fish (8×6) and 12–23 are eels (16×2, very thin).
- **Lanes**: fish swim at y 8, 8, 40, 40, 72, 72, 104, 104, 136, 136, 168, 168 and eels at 24, 24, 56, 56, 88, 88, 120, 120, 152, 152, 168, 168 (`l2_obj_init_y`). Each object bobs ±24 px in its lane. Fish move 4 px per step and eels 2 px. Each turns at random (16/256 chance per step).
- **Eels absent at the start**: `0x351C` = **10, 8, 6, 4, 3, 2, 2, 1**, so **2, 4, 6, 8, 9, 10, 10, 11 eels** are present when you arrive. **Every fish eaten brings one absent eel back** in from the side away from the cat (`reset_caught_objects`, L2891-L2907). The bowl fills with eels as you clear it.
- **Eel touch**: a 13-tick electric flash, then `object_hit` → the room is lost and **1 life** goes (L2826-L2848).
- **Air** (game.js L4711-L4766; the cat refills only at the surface, `y <= 3`, with the breathing sprite, L4780):

  | level | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
  |---|---|---|---|---|---|---|---|---|
  | first warning (colour 1), s | 4.0 | 3.0 | 2.6 | 2.6 | 2.6 | 2.6 | 2.5 | 2.4 |
  | colour 5, s | 7.9 | 5.9 | 5.3 | 5.3 | 5.3 | 5.3 | 5.1 | 4.8 |
  | colour 4, s | 11.9 | 8.9 | 7.9 | 7.9 | 7.9 | 7.9 | 7.6 | 7.3 |
  | **out of air (point of no return)**, s | **15.8** | 11.9 | 10.5 | 10.5 | 10.5 | 10.5 | 10.1 | 9.7 |
  | death, s | 19.8 | 15.8 | 14.5 | 14.5 | 14.5 | 14.5 | 14.1 | 13.6 |

  Once the cat is out of air it sinks, meows with a rising bubble every 6 steps, ignores input, and is immune. Death (and the lost life) follows at the "death" time.
- **Swimming**: `max_swim_speed` = **4, 6, 8, 10, 12, 12, 12, 12**. Higher levels are faster and so more slippery. Max dive step `max_dive_depth` = 3, 3, 4, 4, 4, 4, 4, 4. With no vertical key the cat drifts **upwards** (L4757-L4760). Horizontal speed ramps up, and changing direction resets the ramp.
- There is no broom or dog in Room 2.

## 3. Room 3: the bookcase

Code: L3137-L3309; asm `level_objects.asm:1383`, `:1526`. Entrance at (96, 96).
- **Win**: touch the **3 ferns** at x = 192, 224, 256, y = 24 (`0x37A3`), all without being caught (L3147-L3171).
- **Climbing**: the bookcase is climbable at x 164–280 (0xA4–0x118). There are shelves every 16 px from y 40 to 160, wherever bit 3 of y is set (`check_fence_collision`, L3195-L3205). There are also fixed ledges (platforms #15–28, see the platform dump in §10).
- **Spider** (one), updated every 2 ticks:
  - It patrols the ceiling (y = 8) towards the cat's x at `0x39CC` = **2, 4, 6, 8, 10, 12, 14, 16** px per 2 ticks (about 18–146 px/s).
  - When its x matches the cat's (8-px aligned), it drops 2–5 px per step. It climbs back when it passes below the cat's y, strays more than 48 px sideways, or reaches y = 160.
  - **Touch**: a 9-tick buzz, then `object_hit` → the room is lost and **1 life** goes.
  - **The broom blocks the spider**: overlapping the broom cancels its move (L3263-L3267).
- Broom: steps every 2 ticks in this room (all other rooms: every tick).

## 4. Room 4: the cheese (the user's tunnel question)

Code: L3311-L3529 (`update_level4_state`, `init_level4_bg`, `init_level4_objects`, `update_level4_anim`, `randomize_l4_pos`, `check_l4_proximity`); asm `level_objects.asm:1720-2196`. Entrance window at (264, 96) on the right. Palette 0 (dark red room, green cheese).

### 4.1 Geometry
- The cheese is a wedge of 8×8 tiles: 17 rows from y 32 to 168, starting at x 24. Row widths are 12, 14, 17, 19, 21, 23, 24, 25, 25 … 25, 24 tiles, so it is 96 px wide at the top and about 200 px at the bottom (`0x3CAE`). The top-right edge slopes. Some tiles are randomly decorative pits (48 in 256 chance) and are **not** functional holes.
- The top of the wedge is a staircase of standable steps (platforms #55–60): y 24 (x 24–128), 32 (56–144), 40 (88–160), 48 (120–176), 56 (152–192), 64 (184–208).
- On the right side there are furniture platforms: chair and table, #30–38, at x 228–284 and y 88–152. The cat enters on the table (start (256, 96)).
- **16 functional holes**, each 16×16. Index, the standing spot ("ledge", 12 px wide; `l4_platform_offset` gives y and `l4_obj_x_table` gives x), and the hole's location:

  | hole | ledge x | ledge y | where |
  |---|---|---|---|
  | 0 | 80 | 32 | top surface |
  | 1 | 104 | 32 | top surface |
  | 2 | 120 | 40 | top surface |
  | 3 | 16 | 72 | face, left |
  | 4 | 64 | 64 | face |
  | 5 | 112 | 80 | face |
  | 6 | 32 | 104 | face |
  | 7 | 72 | 96 | face |
  | 8 | 192 | 104 | face, right |
  | 9 | 88 | 120 | face |
  | 10 | 144 | 136 | face |
  | 11 | 128 | 128 | face |
  | 12 | 40 | 144 | face |
  | 13 | 96 | 152 | face |
  | 14 | 24 | 160 | face, bottom-left |
  | 15 | 184 | 160 | face, bottom-right |

  Holes 3–15 are round holes in the front face. Each has a small one-way ledge (type 1, `at_platform`) that the cat can stand on, jump up through, or drop off. So **the cat climbs the face of the cheese by hopping between hole ledges**. Holes 0–2 are openings on the top surface, seen from above (they have a different door sprite, `l3_door_cga_2 = 0x80`).

### 4.2 Going into the cheese (Alt)
`update_level4_state` (L3314-L3354; asm `level_objects.asm:1720`):
- **Conditions**: the cat is standing on a hole ledge (`l3_platform_id` = hole + 1 is set on landing, L639-L642), Alt is held (`joy_button == 0`), the cat is not being shoved by the broom (`!auto_walk`), it is not overlapping the broom, and **at least 0xC ticks (0.66 s) have passed since the last tunnel**.
- **What happens**: a 7-frame door animation, one frame per tick. Three frames play at the entry hole while the cat disappears into it. Then the cat is moved to the **partner hole's** ledge (`x = l4_obj_x_table[p] + 8`, `y = l4_platform_offset[p]`) and four frames play there while it climbs out.
  - During the animation the cat's own update is skipped (L4706) and **broom hits are ignored** (L2779). The tunnel is a short safe moment.
  - **Measured**: hole 13 (100, 152) → hole 8 (200, 104). The cat reappears 0.20 s after the press, and the whole animation takes 0.36 s. Holding Alt tunnels back again after the cooldown.
- **Pairing**: `0x3CC3[(difficulty & 3) * 8 + k]`. The high nibble is the partner of hole 2k and the low nibble the partner of hole 2k+1. All four tables are symmetric, so going back through the exit hole returns you to where you started:

  | difficulty & 3 | pairs |
  |---|---|
  | 0 (levels 0, 4) | 0↔15, 1↔6, 2↔9, 3↔11, 4↔10, 5↔12, 7↔14, 8↔13 |
  | 1 (levels 1, 5) | 0↔14, 1↔11, 2↔6, 3↔15, 4↔12, 5↔10, 7↔9, 8↔13 |
  | 2 (levels 2, 6) | 0↔7, 1↔9, 2↔12, 3↔13, 4↔11, 5↔15, 6↔10, 8↔14 |
  | 3 (levels 3, 7) | 0↔2, 1↔13, 3↔14, 4↔15, 5↔6, 7↔11, 8↔12, 9↔10 |

  The pairs are not geometric neighbours: 0↔15 runs from the top-left to the bottom-right corner. They are a fixed "secret map" that players learn. The emulator confirmed the level 0 table.
- **Answer to the user's memory**: you do go *into* the cheese through a hole and come out of another, but the inside is not a space you move through. It is an instant hop between two fixed holes. The Atari manual wording reported by VGJUNK ("sends Freddy through the cheese tunnels to come out at a different hole") describes the same thing.

### 4.3 Mice
- **4 mice**, each in a different one of the 16 holes (`init_level4_objects`, L3399-L3409). **Catch all 4 to win.** A caught mouse is gone for good, and a mouse icon is drawn in the top bar (L3443).
- **Cycle** (L3414-L3479): the mice are updated in turn, so each one is updated about once every 3 ticks. Each has a countdown, `anim`:
  - At 20 or more (0x14+): hidden.
  - At 0x13, then 0x12: peeks out of the hole.
  - From 0x11 down to 2: sits on the lip, alternating two frames.
  - At 1, then 0: ducks.
  - At 0: it picks a new random free hole and restarts `anim` at 20–27.
- **Measured** (cat far away): each mouse is visible for about 3.3 s at a time, then hidden for 0.1–1.2 s, so all 4 are usually showing.
- **Shyness**: while the cat is within Manhattan distance `|dx|+|dy| < l5_save_buf_ptrs` = **20, 80, 100, 120, 120, 140, 140, 140** px, a sitting mouse jumps to `anim = 1` and a peeking one to `anim = 0`. It is still visible for one or two more updates (about 0.1–0.3 s), then gone (L3449-L3454). At level 0 you can walk right up. From level 2 on, a mouse vanishes as soon as you get within about 100 px, which is nearly half the cheese. **That is why the tunnels matter**: you pop out right next to a mouse, inside its shy radius, and grab it before its next update.
- **Respawn bias**: a new hole is re-rolled up to 32 times if it is within 50 px (Manhattan) of the cat, so mice prefer holes away from you (L3489-L3505).
- **Catching**: the cat's box (24×14) overlaps a visible mouse (16×12) whose `anim < 0x14` (L3424-L3446). It is a touch, not a pounce, and works while the cat is walking, standing or jumping.
- **Broom**: a mouse overlapped by the broom is frozen that update (L3426, L3473).
- **Hazards**: the broom (§9) can knock the cat towards the window, and the floor dog (§9) costs a life. There is no cheese-specific killer.
- Scoring: base bonus 1,500 plus the time bonus (unchanged from the earlier notes).

## 5. Room 5: the birdcage

Code: L3531-L3758; asm `level_objects.asm:2198`, `:2438`. Entrance at (248, 96).
- **Cage** at (144, 134) on the table. Touching it shoves the cat sideways (8 px at a time, up to 32 steps, until it no longer overlaps; ±3 px vertically if it is airborne). The cage then moves **8 px** in the push direction (L3663-L3698).
- Once the cage is outside x 120–168 it falls 5 px per tick to y ≥ 164, and the game loop pauses while it falls (L3700-L3731). That takes **4 pushes** either way: 144 → 112 or 144 → 176.
- If the broom is near the cage while the cat stands on the table (`(cat_y & 0xF8) == 0x88`), the cat is dropped off the table (L3657-L3661).
- **Bird**: released where the cage landed. It moves 4 px in x and 2 px in y per update, about 1.25 updates per tick, inside x 0–309 and y 48–167.
  - With chance 48/256 per update it checks the cat's distance `|dx| + 2|dy|`. If that is within `0x40CE` = **46, 92, 140, 140, 160, 170, 180, 180**, it flees directly away with a chirp.
  - Otherwise it flies between 11 waypoints (`0x40DE`/`0x40F4`) or at random.
  - The broom touching the bird sends it upwards.
- **Win**: touch the bird (8×5 box) without `object_hit`. **Fail**: only the floor dog (life) or being swept out by the broom.

## 6. Room 6: the sleeping bulldogs

Code: L3760-L3973; asm `level_objects.asm:2666`, `:2817`, `:3010`. Entrance at (72, 56). Three full-width shelves at `cat_y` 136, 152 and 168.
- **12 dishes**, at row 136: x 8, 144, 160; row 152: x 40, 56, 120, 224, 288; row 168: x 16, 152, 208, 256. Each holds `l6_obj_init_y_tbl` = **1, 2, 3, 4, 4, 4, 4, 4** helpings. **Empty all 12 to win.**
- **Dogs**: `l6_obj_type` = **6, 6, 7, 7, 8, 8, 9, 9**, placed at random in 12 spots: row 136 at x 44, 124, 196; row 152 at 32, 92, 156, 204, 268; row 168 at 52, 132, 188, 292.
- **Eating (Alt)**: holding Alt walks the cat to the nearest non-empty dish **on its own row**. Within 4 px it eats. One helping takes about 5.3 ticks (0.29 s) (`0x44D0 += 0x30` per tick, one helping per overflow). A full 4-helping dish takes about 1.2 s. Releasing Alt stops.
- **Waking**: every `0x44DC` = **18, 16, 15, 14, 13, 12, 11, 10** ticks, every dog on the **same row** within `0x44EC` = **40, 50, 60, 70, 85, 80, 85, 90** px gains one stir level (0→1→2). A growl or "explosion" sound plays when one reaches 2. At the **next** check a dog already at 2 **wakes**: it chases the cat, there is a fight, the room is lost and **1 life** goes. From level 1 up the angry-dog cut-scene also plays: that is `show_extra_life`, a misnamed routine, L934-L937.
  - So you get about 2–3 check periods near a dog: roughly **2.0–3.0 s at level 0, 1.1–1.6 s at level 7**.
  - When the cat is away, each stirred dog loses one level with chance 56/256 (22%) per check, so it calms down slowly.
- The broom runs here too. While the cat is eating it uses a wider hit box (L3753-L3758).

## 7. Room 7: the love scene

Code: L2413-L2648, L3975-L4174; asm `level_objects.asm:209`, `:3096`, `:3328`; `ui.asm:581`.
- **Hearts**: 7 rows × 16 columns. The cat stands at row y 176 (bottom), 152, 128, 104, 80, 56, 32 (top); the columns run from x 32 to 272. Each heart starts whole or broken at random (50%), except the bottom row, which is all whole. **The cat can stand only on whole hearts.** Walking and jumping use the normal physics, between x 36 and 271 (L367).
- **Cupid** (one at a time, respawning at once): it enters from a side at one of 8 heights, or from the top in one of 10 columns. It moves **5 px across and 2 px down per tick** (91 px/s and 36 px/s). **Every heart it passes flips between whole and broken.** Touching the cat knocks it into a fall (L2419-L2517).
- **Rivals**: one per row, rows 0–5 (6 rivals). Slot 6 on the top row is **the lady cat**. Each rival moves 8 px per update, and all 7 are updated every 3 ticks, so about 48 px/s.
  - While a rival is on the cat's row or above it, each step it heads for the cat's x with chance `l7_heart_y_table` = **16, 32, 48, 64, 96, 128, 192, 192** in 256.
  - Touching the cat knocks it down (it falls) and the rival backs off for 4 steps.
  - **The lady moves away from the cat** until the cat is on the top row (`cat_y < 0x28`). Then she always comes towards it, and touching her wins (L4003-L4011).
  - The bottom-row rival starts out absent for 2 × `l7_heart_sprite_table`, because slot 0 doubles (L3993, L4129). That is about 59 s at level 0 and 15 s at level 7, which is why the bottom row feels safe early on.
- **Gifts**: as many as rooms won since the last kiss (`elapsed_ticks`, a misnomer), at least 1 and at most 8. They lie on the bottom row at x 96, 200, 64, 232, 32, 264, 128, 168.
  - Walk into a gift to carry it (one at a time; the background turns blue). Alt puts it down on the row nearest the cat, at the cat's x, unless it would overlap another gift (L2522-L2589).
  - A rival walking into a placed gift destroys it and **leaves for `l7_heart_sprite_table` = 540, 360, 270, 180, 175, 170, 160, 140 ticks** (29.7 s down to 7.7 s; twice as long for the bottom-row rival), then comes back from the side away from the cat (L3989-L3999, L4082-L4101). The lady also destroys gifts but is never removed.
- **Fail**: falling below the bottom row (`cat_y >= 0xF8`, L4889-L4891). The attempt ends and the cat goes back to the alley. **No life is lost** (`love_scene_outro`, L926), but you must win another room first.
- **Win**: the victory sequence, +1 life (maximum 9), difficulty +1 (maximum 7), and the gift count and love timer reset (L4283-L4295). The bonus is (4000 + (10800 − t)/2) × multiplier, where t is counted from the start of the game or the last kiss. The multiplier is 1, 3, 5 … 15, ×2 when arriving with a gift.

## 8. Controls and physics (all screens except the fishbowl)

- **Keys**: arrows, plus diagonals on Home, PgUp, End and PgDn. The keyboard is read only when the tick count has moved by 2 or more (L479-L483), which makes input coarse, at about 9 Hz.
- **Alt** has only three uses (every `joy_button` site, L510, L2525, L3319, L3862): tunnel in the cheese, walk-and-eat in the dogs room, and put down a gift in the love scene. **Alt does nothing in the alley or rooms 1, 2, 3 and 5.**
- **Walking** (L384-L395): speed resets to 2 px per step on a direction change and grows by 1 every 4 steps up to 8. **Measured**: 0 to top speed in about 0.9 s, top speed **about 288 px/s** (about 1.1 s to cross the screen).
- **Jump** (L4994-L5003): the initial upward velocity is 8 px per step. Horizontal speed at take-off is `if (speed > 2) speed -= 2`, so 8→6, 4→2, 3→1, and 2 or less stays the same. The deceleration `anim_step` is `(walkSpeed ^ 15) << 4`, which is larger for slow walkers, so **a standing jump decays fast and a running jump floats**. Falling speed is capped at 4 px per step (L4869).
  - **Measured arcs**: standing jump peak +31 px, about 0.5 s in the air, 0 px sideways. Short-run jump (0.12 s of walking) +37 px, about 44 px sideways. Full-run jump **+61 px, about 150 px sideways, about 0.7 s**.
- **No air control**: while airborne, input is not read. `update_scroll` keeps the take-off direction (L4859-L4873 vs L4983-L4985). Hitting a screen edge in mid-air kills the horizontal motion.
- **Landing** resets the speed to 2 (L4903), so the run-up starts again from 2 after every landing. Holding Up re-jumps on landing.
- **Platforms are one-way** (landing is checked only while falling, L4879). Down drops the cat through a ledge (L4988-L4989).

## 9. Hazards shared by the rooms

**Broom** (rooms 1, 3, 4, 5 and 6; `tick_thrown_objects`, L2650-L2736; asm `level_objects.asm:348`):
- It steps every tick (every 2 ticks in room 3): **8 px in x and 2 px in y**, within y 0–165. It flies about the room; it is not a floor sweeper.
- **Footprints**: walking on the floor adds a print to that 8-px column, up to 4 deep (L2797-L2808). The broom scans for printed columns, flies to the floor there, and removes one print per sweep frame.
- **Homing**: with no prints, it compares `|dx|/4 + |dy|/2 − (ticks in room)/8` with a drifting random byte. If the value is larger, the broom drifts down. Otherwise it occasionally picks a random direction or heads straight for the cat. **The `ticks/8` term makes it more aggressive the longer you stay** (L2672-L2693).
- **Hit** (L2774-L2781): `start_auto_walk` (L4665-L4687) throws the cat on a recoil walk or jump towards the entrance window. A cat that falls into the entrance rect leaves the room (`check_level_platform`, L611-L616). That ends the attempt but costs **no life**. **Measured** (room 3, idle cat): the broom flew from the floor up to a ledge at y 104, about 0.4 s after it started climbing, and knocked the cat to x 8.
- Broom speed does not change with difficulty. Its harm comes from position and time.

**Dog in rooms** (rooms 1, 3, 4 and 5 every loop; room 6 when a dog wakes): the same `update_enemies` code and tables as the alley. It spawns **only while the cat is on the floor** (`cat_y >= 180`), with `enemy_spawn_chance` per check. That is about 2/256 at level 0, roughly 10 s of floor time on average, and 64/256 at level 7, a fraction of a second. A catch costs **1 life** and ends the room (`object_hit=0xDD`, L987-L992).

**Leaving and re-entry**: falling back into the entrance window leaves the room with no life lost. If no life was lost, the cat reappears in the alley **at the window it used** (`start_in_level`, L4424-L4427 and L4503). After a lost life it starts again at the street edge.

## 10. Difficulty: the complete per-level tables

There are 8 levels (0–7). The game starts at the chosen skill (0–3) and adds +1 per kiss (L4290). Room selection uses `difficulty & 3`, so levels 4–7 reuse the room pools of 0–3 while every other table keeps rising.

| table (addr) | meaning | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|---|---|
| `jump_pause_by_diff` 0x181E | window full-open hold, ticks | 45 | 36 | 27 | 18 | 9 | 18 | 1 | 18 |
| `throw_delay` 0x532 | line scroll interval, loop passes (÷4 when high) | 100 | 80 | 70 | 60 | 55 | 50 | 40 | 40 |
| `throw_chance` 0x2ABA | bare-line chance /256 | 6 | 20 | 32 | 46 | 46 | 52 | 58 | 64 |
| `enemy_spawn_chance` 0x1CD1 | dog spawn /256 per check | 2 | 4 | 8 | 12 | 16 | 24 | 32 | 64 |
| `enemy_chase_chance` 0x1CD9 | dog turn-to-cat /256 | 16 | 32 | 48 | 64 | 80 | 96 | 112 | 128 |
| `obj_chase_table` 0x1F6E | line mouse charges /256 | 8 | 32 | 64 | 128 | 160 | 192 | 208 | 240 |
| `floor_door_count`+1 | alley bins | 6 | 5 | 4 | 3 | 4 | 3 | 4 | 3 |
| `0x351C` | eels absent at start (of 12) | 10 | 8 | 6 | 4 | 3 | 2 | 2 | 1 |
| `level2_phase1_ticks` | air until doom, ticks | 288 | 216 | 192 | 192 | 192 | 192 | 184 | 176 |
| `level2_death_ticks` | drowning, ticks | 360 | 288 | 264 | 264 | 264 | 264 | 256 | 248 |
| `max_swim_speed` | swim cap | 4 | 6 | 8 | 10 | 12 | 12 | 12 | 12 |
| `0x39CC` | spider px per 2 ticks | 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 |
| `l5_save_buf_ptrs` 0x3EDE | cheese mouse shy radius (Manhattan px) | 20 | 80 | 100 | 120 | 120 | 140 | 140 | 140 |
| `0x3CC3` row | cheese hole pairing | A | B | C | D | A | B | C | D |
| `0x40CE` | bird flee radius (|dx|+2|dy|) | 46 | 92 | 140 | 140 | 160 | 170 | 180 | 180 |
| `l6_obj_type` 0x4471 | sleeping dogs | 6 | 6 | 7 | 7 | 8 | 8 | 9 | 9 |
| `l6_obj_init_y_tbl` 0x4479 | helpings per dish | 1 | 2 | 3 | 4 | 4 | 4 | 4 | 4 |
| `0x44DC` | dog stir check period, ticks | 18 | 16 | 15 | 14 | 13 | 12 | 11 | 10 |
| `0x44EC` | dog stir distance, px | 40 | 50 | 60 | 70 | 85 | 80 | 85 | 90 |
| `l7_heart_y_table` 0x45BF | rival chase /256 | 16 | 32 | 48 | 64 | 96 | 128 | 192 | 192 |
| `l7_heart_sprite_table` 0x45C7 | rival away after gift, ticks | 540 | 360 | 270 | 180 | 175 | 170 | 160 | 140 |
| `0x36DC` | love multiplier | 1 | 3 | 5 | 7 | 9 | 11 | 13 | 15 |

Constants that do not change with difficulty: 12 fish; 4 cheese mice in 16 holes; 3 ferns; 4 cage pushes; 12 dishes; 7 heart rows; 1 cupid; 6 rivals plus the lady; broom speed (8 px in x, 2 px in y per tick); dog speed (about 95 px/s); lid behaviour.

**What kills (−1 life), by scene**: alley: dog contact, **thrown-object hit**. Room 2: eel, drowning. Room 3: spider. Rooms 1, 3, 4 and 5: the floor dog. Room 6: a dog that wakes. **No life lost**: broom sweep-out, leaving through the window, falling out of the love scene, a line mouse knocking you off, a lid knock (it only summons the dog).

**Platforms.** Room 4's holes are platforms #39–54 and its top steps are #55–60. To dump any room's platforms, start at `level_platform_index[room]` (a word table) and walk `platform_y_table`, `platform_type_table`, `platform_x_left` (word) and `platform_width_table` (word) until y = 0. Type 0 is solid; type 1 is a one-way perch.

**How I measured.** Everything was run on vibe-alleycat `872b710` with `tools/headless.js` `makeRunner()` (Node, virtual clock), on the original data tables in `js/assets.js`.
- **Start-up**: wait 2 s, then send the keys 0x1C (Enter), 0x31 (N, no joystick), 0x25 (K, Kitten) and 0x39 (Space). Rooms were reached with `forceRoom(n)` and the level with a poke to `difficulty_level`.
- **Patches**:
  - Window timing: removed the `cat_y > 0x60` gate in `update_cat_jump` and the dog's spawn roll.
  - Jump and walk traces: removed the dog's spawn roll.
  - Tunnel and mice tests: stubbed `tick_thrown_objects` and `update_enemies`.
- **Memory sampled**: `jump_anim_counter`, `cat_x`/`cat_y`, `enemy_x`, `l3_door_anim_frame`, `l5_obj_active`, `thrown_obj_x`/`thrown_obj_y` and `level_number`, at 1/200 s to 1/4 s intervals.
- **Caveats**: loop speed depends on what is drawn, so measured seconds are ±10% to ±20%. The broom trace showed the knock towards the entrance side but did not capture a complete exit through the window.

---

## 11. Implications for our remake: how to make it harder

These are ordered by how much they change difficulty and feel, each mapped to existing knobs. Coordinates use ×4 for x and ×3.6 for y.

1. **The alley is not dangerous enough. Make thrown objects real** (`AlleyScene.ts` `throwFrom`, around L336 and L385; `Difficulty.throwChance`).
   - Set `throwChance` to **1.0**: every opened window throws once, unless something is already falling.
   - A hit should cost a life. A gentler middle ground for the Kitten skill: knock off + daze + call the dog.
   - Make objects fall only to fence height, drift towards the cat, and drop straight down after 4 s of fence camping.
   - Replace `windowOpenFor` (5.5 s → 2.7 s) with the original **hold time**, about 2.5 s → 0.5 s (`jump_pause_by_diff`), on top of roughly 0.7 s of opening and closing animation.
   - Open windows **only while the cat is at fence height or above**, and allow entry **only while falling**.
2. **Cut air control and make running matter** (`Cat.ts` `AIR_ACCEL`, `JUMP_VELOCITY`, `doJump`).
   - Lock the horizontal direction at take-off (`AIR_ACCEL` ≈ 0) and remove coyote time, the jump buffer and the floaty apex for a "classic" feel. Or scale them down per skill.
   - Reset speed on landing, and make the running jump ≈ 2× the height and about 3× the distance of a standing jump.
   - This is the single biggest source of the original's challenge, and it makes everything else harder.
3. **Bins thin out per level** (new `binCount` in `difficulty()`, used by the `AlleyScene` can layout): 6 → 5 → 4 → 3 (then alternating 4 and 3), using the x positions in §1.4 ×4. Make the fence reachable only from a bin.
4. **Lids should knock the cat off, not act as springs** (`AlleyScene` can logic / `Cat.bounce`). Standing on a bin pops a lid from another bin. Contact knocks the cat off and summons the dog at once.
5. **Make the cheese room the original puzzle** (`CheeseScene.ts`; `Difficulty.cheeseMice`):
   - **4 mice** (not 5–8) across **16 holes**.
   - Mice stay out about 3.3 s and hide for 0.1–1.2 s.
   - Add a **shy radius** of 20 → 140 orig px Manhattan (×4 ≈ 80 → 560 px). This is the real difficulty.
   - **Alt-tunnels** between paired holes, using the four pairing tables, with a 0.66 s cooldown and broom immunity during the 0.36 s animation.
   - Respawn mice at least 50 orig px from the cat.
   - Climbable hole ledges on the cheese face. This is the mechanic the user remembers. The current 6-spot whack-a-mole has neither the shyness nor the tunnels.
6. **Fishbowl** (`UnderwaterScene.ts` `AIR_SECONDS`; `fishCount`/`eelCount`):
   - **12 fish** at every level.
   - Eels present at the start: **2 → 11**. **+1 eel per fish eaten**.
   - Air from 15.8 s down to 9.7 s, then **guaranteed** death about 4 s later: once out of air the cat sinks, cannot be steered, and cannot recover.
   - Raise the swim speed cap with level (slipperier).
   - Use thin eels on alternating lanes.
7. **Dogs room** (`DogsScene.ts`; `sleepingDogs` 3–6 → **6–9**, helpings already 1–4):
   - 12 fixed dog spots on 3 rows and 12 dishes.
   - Wake **only by same-row proximity** (40 → 90 px orig, ×4) on a check every 1.0 → 0.55 s, with 3 states: stir, growl, wake. Each check away from the dog gives a 22% chance to calm one level.
   - Alt walks to the nearest dish and eats.
8. **Room dog becomes probabilistic and floor-gated** (`RoomScene.ts` `nextDogAt`/`roomDogDelay` → a per-check spawn chance from `enemy_spawn_chance`, rolled only while `onFloor`). Staying off the floor becomes the skill, and footprints (floor walking) become a trade-off. Alley dog: spawn chance is 2 → 64/256 per check, the chance to turn towards the cat is 16 → 128/256, and its speed is about ⅓ of the cat's top speed. The difficulty comes from frequency, not speed, so keep `dogSpeed` modest and raise the frequency instead.
9. **The broom flies and sweeps you out** (`Hazards.ts` `Broom`, `broomChase`): let it move vertically towards the cat on ledges, and make its homing grow with time in the room (`elapsed/8 s` term). A hit flings the cat **towards the entrance window** (a room exit, no life lost) instead of a random shove.
10. **Spider** (`BookcaseScene.ts`): a single ceiling-tracking spider that drops when it is above the cat, horizontal speed 18 → 146 px/s orig (×4), climbing back when it passes the cat or strays more than 48 px. The broom blocks it, which is an interesting synergy to keep. Today we use `diff.cupids` spiders with a sine path.
11. **Birdcage** (`BirdcageScene.ts`): 4 pushes of 8 px (×4 = 32 px). Each push shoves the cat back. The bird's flee radius is 46 → 180 (|dx|+2|dy|) and is rolled about 19% of updates, so it is not always shy.
12. **Love scene** (`LoveScene.ts`; `rivals`, `cupids`, `gifts`):
    - **6 rivals, one per row**, always (not 1–4).
    - Chase chance 16 → 192/256 while the rival is at or above the cat's row.
    - The lady runs away until you reach the top row.
    - **1 cupid** that **flips hearts** along its diagonal.
    - **Gifts** equal to rooms won since the last kiss (1–8). A placed gift removes a rival for 30 s → 7.7 s.
    - 7 rows × 16 hearts with random breaks; falling off costs no life.
13. **Room pools and progression** are already close (`ROOM_POOLS`). The one gap: at levels 4–7 the original cycles back to pools 0–3 by `level & 3` while everything else keeps rising. Levels 3 and 7 always use the all-room pool.
14. **Input cadence** (optional "classic mode"): read input at about 9 Hz and move at about 18 Hz in 8-px steps for an authentic, stiffer feel.

Lower priority and remake-safe: keep our onboarding (`asleep` rooms, free save) for the Kitten skill only, and use the original tables from House Cat up.
