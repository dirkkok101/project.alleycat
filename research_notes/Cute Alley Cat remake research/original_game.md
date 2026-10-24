# Alley Cat (Bill Williams / Synapse 1983; IBM PC CGA 1984): Factual Inventory for a Remake

Source-quality note (applies throughout): The most precise PC-specific numbers come from a fan port, **beyondbeneath/vibe-alleycat**. Its README says it was "rebuilt from the program's disassembly" of the IBM PC `CAT.EXE`, and the disassembly is said to rebuild the original "byte for byte". The names and comments in it (table names, room numbers) come from the disassemblers, not from Synapse. It is a strong source for actual code behaviour, but it is not an official one. Its companion disassembly is [gmegidish/alleycat-disassembly](https://github.com/gmegidish/alleycat-disassembly), which was "100% written by LLM, with a lot of guidance from a human". Treat these numbers as "derived from disassembly" and check them in an emulator ([archive.org playable copy](https://archive.org/details/msdos_Alley_Cat_1984)) before relying on them. I could not retrieve the original IBM manual text. Hardcore Gaming 101 (under maintenance), MobyGames (403) and GameFAQs (403) were all unreachable, and web.archive.org was blocked for the fetch tool.

Naming correction: the brief calls the girlfriend "Cleo" and mentions "Heart/love room", a "plant/ivy room" and a "vacuum". None of the sources I reached support those. The player cat is **Freddy** and the girlfriend is **Felicia** ([Wikipedia](https://en.wikipedia.org/wiki/Alley_Cat_(video_game)); [Data Driven Gamer](https://datadrivengamer.blogspot.com/2021/07/game-276-alley-cat.html)). The "plant" item is the ferns or flower vases on top of the bookshelf, not a separate room. The broom is the only household-appliance hazard I found.

## 1. Scene-by-scene inventory (alley + rooms): goals and hazards

### Takeaway
There is one alley hub screen plus six reachable rooms on PC. Room 1 is a fishbowl room that leads into Room 2 (inside the bowl). The others are the bookcase/spider, cheese/mice, birdcage and sleeping dogs. Room 7, the love scene, is reached only after winning a room. A broom that is distracted by footprints is the shared hazard in most rooms.

### Cited Findings
**Alley (hub)**
- One screen. From the top there are three washing lines with rows of windows between them, then a fence, a row of dustbins, and the pavement — [vibe-alleycat README](https://github.com/beyondbeneath/vibe-alleycat)
- There are three mice, one per washing line, and a cat leaping into a mouse catches it — [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat). On Atari, mice on the lines can knock you down, but that is not fatal — [Data Driven Gamer](https://datadrivengamer.blogspot.com/2021/07/game-276-alley-cat.html)
- The dog appears only when the cat is on the ground, and if it reaches the cat a life is lost — [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat). Contact "starts a fight" and costs a life — [Wikipedia](https://en.wikipedia.org/wiki/Alley_Cat_(video_game)). The PC dog is "a cartoony bulldog", while the Atari dog is a terrier — [FRGCB](http://frgcb.blogspot.com/2015/04/alley-cat-synapse-software-1983.html)
- Windows open periodically and objects are thrown out. Wikipedia names "a phone or a shoe" ([Wikipedia](https://en.wikipedia.org/wiki/Alley_Cat_(video_game))). On Atari these are rolling pins, shoes and rotary telephones, and a clean hit makes a "ding!" ([VGJUNK](http://retrovania-vgjunk.blogspot.com/2018/11/alley-cat-atari-800.html))
- On PC, a thrown object that hits the cat knocks it off whatever it was standing on — [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat). Sources conflict on lethality: Data Driven Gamer (Atari) says "garbage thrown close enough kills you" — [DDG](https://datadrivengamer.blogspot.com/2021/07/game-276-alley-cat.html)
- Atari only: a feral cat on a trash can knocks you onto the street, where the dog can get you — [DDG](https://datadrivengamer.blogspot.com/2021/07/game-276-alley-cat.html). I could not confirm whether the PC version has this.
- Jumping into an open window starts a room — [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat)
- The fence shows a two-letter marker that differs by difficulty level on DOS; Atari always shows "HM" — [FRGCB](http://frgcb.blogspot.com/2015/04/alley-cat-synapse-software-1983.html)

**Room 1: fishbowl room (PC naming)**
- You jump into the bowl to enter Room 2 — [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat)
- On Atari you reach the bowl by jumping from the floor to the table. The broom shoos you out the window, and a dog enters if you take too long — [DDG](https://datadrivengamer.blogspot.com/2021/07/game-276-alley-cat.html)

**Room 2: inside the fishbowl**
- Eat all the fish and avoid the electric eels, which cost a life — [Wikipedia](https://en.wikipedia.org/wiki/Alley_Cat_(video_game)); [VGJUNK](http://retrovania-vgjunk.blogspot.com/2018/11/alley-cat-atari-800.html)
- Surface for air to avoid drowning. Freddy "turns purple" when he needs air, which is the Atari cue. The fishbowl has no time limit, and the swimming controls are "heavy and imprecise" — [DDG](https://datadrivengamer.blogspot.com/2021/07/game-276-alley-cat.html)
- On PC this room is never chosen at random; it is reached only through Room 1 — [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat)
- The water is cyan on DOS and green on Atari — [FRGCB](http://frgcb.blogspot.com/2015/04/alley-cat-synapse-software-1983.html)

**Room 3: bookcase / library**
- Collect three ferns from the top of the bookshelf while avoiding a "disproportionately large spider" that drops onto the cat — [Wikipedia](https://en.wikipedia.org/wiki/Alley_Cat_(video_game)); [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat). On Atari you knock down "flower vases" while "dangling spiders" move — [VGJUNK](http://retrovania-vgjunk.blogspot.com/2018/11/alley-cat-atari-800.html)
- DOS has a single spider, the most colourful bookshelf, and a dark purple background — [FRGCB](http://frgcb.blogspot.com/2015/04/alley-cat-synapse-software-1983.html)

**Room 4: cheese / pantry**
- Catch mice that randomly appear in the holes of a large chunk of cheese — [Wikipedia](https://en.wikipedia.org/wiki/Alley_Cat_(video_game))
- Pressing fire near a hole sends Freddy through the cheese tunnels to come out at a different hole (Atari) — [VGJUNK](http://retrovania-vgjunk.blogspot.com/2018/11/alley-cat-atari-800.html)
- On Atari you catch four mice. The pawprints that distract the broom also attract the dog — [DDG](https://datadrivengamer.blogspot.com/2021/07/game-276-alley-cat.html). I did not find a PC mouse count.
- The DOS room is dark red with green cheese and orange accents; the Atari room is blue with brown cheese — [FRGCB](http://frgcb.blogspot.com/2015/04/alley-cat-synapse-software-1983.html)

**Room 5: birdcage / aviary**
- Push the cage off the table, then catch the escaped bird — [Wikipedia](https://en.wikipedia.org/wiki/Alley_Cat_(video_game)); [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat)
- On Atari the bird is on a curtain rail — [VGJUNK](http://retrovania-vgjunk.blogspot.com/2018/11/alley-cat-atari-800.html). Each nudge knocks you to the floor and the dog may enter each time, and it is easy to jump out of the window by accident while chasing the bird — [DDG](https://datadrivengamer.blogspot.com/2021/07/game-276-alley-cat.html)

**Room 6: sleeping dogs / kennel**
- Empty each feeding dish without waking any dog — [Wikipedia](https://en.wikipedia.org/wiki/Alley_Cat_(video_game)). On PC there are twelve dishes, and the number of dogs and helpings per dish depends on difficulty (see §5) — [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat)
- Waking a dog costs a life — [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat). Dogs growl first, so back off — [DDG](https://datadrivengamer.blogspot.com/2021/07/game-276-alley-cat.html)
- On Atari a flying milk carton refills bowls that are not yet empty, and full bowls take longer to drink — [VGJUNK](http://retrovania-vgjunk.blogspot.com/2018/11/alley-cat-atari-800.html); [FRGCB](http://frgcb.blogspot.com/2015/04/alley-cat-synapse-software-1983.html)
- FRGCB says "both versions have seven dogs" — [FRGCB](http://frgcb.blogspot.com/2015/04/alley-cat-synapse-software-1983.html). That conflicts with the disassembly table of 6–9 dogs by difficulty ([vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat)). FRGCB probably only observed one level.
- DOS adds an angry-dog cutscene when you fail the kennel — [FRGCB](http://frgcb.blogspot.com/2015/04/alley-cat-synapse-software-1983.html)

**Shared room hazard: the broom**
- Most rooms have a broom that is always moving. Footprints the cat leaves on the bottom edge keep it busy; with no footprints it chases the cat. It never kills, but it pushes the cat around, sometimes into the dog, the spider, or out of the window — [Wikipedia](https://en.wikipedia.org/wiki/Alley_Cat_(video_game)); [VGJUNK](http://retrovania-vgjunk.blogspot.com/2018/11/alley-cat-atari-800.html)
- Being swept out of the window returns you to the alley — [Greatest Games substack](https://greatestgames.substack.com/p/the-classic-pc-gaming-era-1977-1989-e37)

**Room 7: love scene (Felicia)**
- Seven rows of 16 hearts, each whole or broken at random, with the bottom row always whole — [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat)
- Cherubs on both sides fire heart-shaped arrows diagonally, and these flip hearts between intact and broken. Arrows also make the cat fall. Touching a rival cat drops you to the row below — [Wikipedia](https://en.wikipedia.org/wiki/Alley_Cat_(video_game))
- The rivals are Felicia's "six brothers", who track your horizontal movement (Atari) — [DDG](https://datadrivengamer.blogspot.com/2021/07/game-276-alley-cat.html). On DOS the other cats are orange and the hearts are red and black — [FRGCB](http://frgcb.blogspot.com/2015/04/alley-cat-synapse-software-1983.html)
- Gifts on the bottom row temporarily remove an unfriendly cat — [Wikipedia](https://en.wikipedia.org/wiki/Alley_Cat_(video_game))
- PC gift counts: there are one to eight gifts depending on rooms won, and carrying a gift turns the background blue — [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat)
- Atari gift counts: you carry one at a time and earn more on later entries, "up to a maximum of three" — [DDG](https://datadrivengamer.blogspot.com/2021/07/game-276-alley-cat.html); [VGJUNK](http://retrovania-vgjunk.blogspot.com/2018/11/alley-cat-atari-800.html). The two versions conflict here.
- Falling off the bottom row fails the attempt and sends you back to the alley — [Wikipedia](https://en.wikipedia.org/wiki/Alley_Cat_(video_game)). This failure does not cost a life, but you must win another room before you can try again — [DDG](https://datadrivengamer.blogspot.com/2021/07/game-276-alley-cat.html)
- Endings: the DOS ending shows a heart enveloping the two cats, then heart designs, and the DOS failure shows Freddy's head dropping. The Atari ending has a kiss, floating cats in hearts, and fireworks. DOS also has level transitions with dancing cats — [FRGCB](http://frgcb.blogspot.com/2015/04/alley-cat-synapse-software-1983.html)

### Inferences
- A remake needs six interior room scenes on PC. "Room 1" (fishbowl room with a table) and "Room 2" (underwater) are two scenes making one challenge.
- PC fail cases are the eels, the spider, and waking a dog. Drowning is described in Wikipedia and DDG, but the disassembly summary did not list it, so verify it in an emulator.

### Gaps
- How many windows there are in the alley, and how long they stay open on PC.
- PC mouse count in the cheese room, fish count in the bowl, and the air-meter mechanics.
- Whether PC has the alley feral cat and the milk-carton refill. FRGCB mentions the carton only for Atari.

## 2. Room entry, clearing, love-room trigger and level advance

### Takeaway
The cat enters a room by jumping into a window while it is open. A room is cleared by finishing its task, which awards a base bonus plus a time bonus. Winning any room makes the love scene (Room 7) available. Reaching Felicia awards a life and raises difficulty by one level.

### Cited Findings
- You enter by jumping into an open window — [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat). On the hardest Atari level this is "nearly impossible" because windows stay open only briefly — [FRGCB](http://frgcb.blogspot.com/2015/04/alley-cat-synapse-software-1983.html)
- The PC game picks the room from pools based on `difficulty_level & 3`. Pool 0 is 4,4,1,1; pool 1 is 3,3,5,5; pool 2 is 6,6,4,1. There is a hard pool of 1,3,4,5,6, used at difficulty 3 and 7 and otherwise on certain random bits. A room never comes up three times in a row — [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat). This matches FRGCB's observation that easy DOS levels offer only a few rooms while Atari is fully random — [FRGCB](http://frgcb.blogspot.com/2015/04/alley-cat-synapse-software-1983.html)
- After a room is won, the alley windows show a female cat calling to the player — [Wikipedia](https://en.wikipedia.org/wiki/Alley_Cat_(video_game)). Room 7 is never drawn at random and always follows a won room — [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat)
- Reaching the lady cat wins the scene and gives a life. Each visit raises difficulty by one, up to 7 (the eighth level) — [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat). Wikipedia says the difficulty multiplier rises until "level 30" and then stays constant, with indefinite play — [Wikipedia](https://en.wikipedia.org/wiki/Alley_Cat_(video_game)). This is a conflict: the PC tables cap at index 7, while Wikipedia's figure is uncited and may refer to the displayed level counter or the Atari version.

### Inferences
- Core loop: alley → window → room → win → love scene → (success: +life, difficulty+1, back to alley) or (fall: back to alley, must win another room).

### Gaps
- Whether you can leave a room voluntarily other than by being swept out, and whether being swept out ends the attempt (it does seem to send you to the alley).

## 3. Controls, movement physics, lives, timers, death

### Takeaway
PC controls are the cursor keys, with Alt (or joystick fire) for special actions. Jumps rely on momentum: a standing jump goes high but short, and a running jump goes long. You start with 3 lives (maximum 9). There is no visible countdown; the time bonus counts down from room entry instead.

### Cited Findings
- PC (as documented by the port): "Use the cursor keys to control the cat. The Alt key performs special actions." Ctrl+S toggles sound, Ctrl+R restarts, Ctrl+M opens the menu. At start-up the game asks "Do you want to use a joystick (Y/N)?" — [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat)
- Hidden keys: Ctrl+9 sets lives to nine and Ctrl+Y quits to DOS. The pause box reads "Paws Game:". The game hooks the keyboard interrupt and tracks 22 scan codes — [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat)
- The title screen shows difficulty choices and the controls, and Ctrl+R restarts — [HG101 via search snippet](https://www.hardcoregaming101.net/alley-cat/). This came from a search summary only, because the page was in maintenance.
- Skill levels: Kitten 0, House Cat 1, Tomcat 2, Alley Cat 3 — [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat)
- Standing hops have little horizontal travel, and a running jump needs a fair run-up — [DDG](https://datadrivengamer.blogspot.com/2021/07/game-276-alley-cat.html). Momentum is lost on landing (Atari) — [VGJUNK](http://retrovania-vgjunk.blogspot.com/2018/11/alley-cat-atari-800.html). Freddy accelerates faster when walking in DOS than on Atari, which makes him easier to steer — [FRGCB](http://frgcb.blogspot.com/2015/04/alley-cat-synapse-software-1983.html). A commenter reports that on PC CGA, running, stopping and then jumping immediately gives a long jump — [DDG comments](https://datadrivengamer.blogspot.com/2021/07/game-276-alley-cat.html)
- Lives: start with three, maximum nine. A life is lost to the alley dog or when a room goes wrong (eels, spider, waking dog) — [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat). On Atari an extra life comes "up to nine" — [VGJUNK](http://retrovania-vgjunk.blogspot.com/2018/11/alley-cat-atari-800.html). Running out of lives ends the game — [Wikipedia](https://en.wikipedia.org/wiki/Alley_Cat_(video_game))
- Timing: the time bonus starts counting when you jump in through the window. The time is in BIOS ticks at 18.2 per second, and for the love scene it is counted "from the start of the game or the last love scene". Keyboard reads act only when the tick count has moved by 2 — [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat)
- With the dog on screen, all alley routines run every loop pass; without it, most run every fourth pass. The PC game is therefore effectively CPU-paced and targets a 4.77 MHz CPU — [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat)

### Inferences
- A remake should use a fixed-timestep simulation at roughly 18.2 Hz logic for "authentic" feel, or rescale the tick constants. The original's speed depends on the CPU, so the emulator speed setting matters when you check feel.

### Gaps
- Exact jump arc and velocity values (they are in the disassembly but were not summarised in the sources I reached).
- What "Alt special action" does in each room (probably tunnel entry in the cheese room or nudging the cage; unverified).
- The fishbowl air timer value.

## 4. Scoring

### Takeaway
Every number below comes from the PC disassembly-based port, which is unofficial. No manual or review that I reached gives point values. Atari sources say only that the bonus is based on speed, and the Atari version uses a "cat-o-meter" out of 48 cat-heads.

### Cited Findings (all [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat), derived from disassembly)
- Mouse caught on a washing line: 90, 70 or 50 points for the top, middle or bottom line.
- Room base bonus: Room 2 (fishbowl) 3,000; Room 3 (bookcase) 2,000; Room 4 (cheese) 1,500; Room 5 (birdcage) 3,500; Room 6 (dogs) 2,500; Room 7 (love) 4,000. No bonus is given for Room 1.
- Time bonus, with t in ticks at 18.2/s: Rooms 2–5 use 2 × (1350 − t), so the maximum is 2,700 and it decays to 0 after about 74 s. Room 6 uses 2700 − t (zero after about 148 s). Room 7 uses (10800 − t) / 2 (zero after about 593 s). Whether the result is clamped at 0 is UNVERIFIED.
- Lady cat: (4,000 + time bonus) × a multiplier from the table 1, 3, 5, 7, 9, 11, 13, 15. The multiplier doubles if you carry a gift. I assume it is indexed by difficulty, but that is UNVERIFIED.
- Extra lives come only from the love scene (+1 per kiss). I found no score-threshold extra life — [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat); [Wikipedia](https://en.wikipedia.org/wiki/Alley_Cat_(video_game))
- Wikipedia only says a completed challenge awards points "proportional to the time taken", with no values — [Wikipedia](https://en.wikipedia.org/wiki/Alley_Cat_(video_game))
- Atari "cat-o-meter" scoring: out of 48 cat-heads, based on how fast each event is finished — [VGJUNK](http://retrovania-vgjunk.blogspot.com/2018/11/alley-cat-atari-800.html)

### Inferences
- The decay times (74 s, 148 s, 593 s) are my arithmetic from the formulas.

### Gaps
- Points for eating individual fish, catching a cheese mouse, a fern, or the bird. None of the sources itemise them, so they may only count toward the room bonus.
- How the score is displayed on screen.

## 5. Difficulty ramp

### Takeaway
On PC there are 8 internal difficulty levels (0–7). The starting level is the chosen skill (0–3), and each successful love scene adds one, capped at 7. Throw rate, enemy spawn and chase rate, the dog count in the kennel, and helpings per dish all rise.

### Cited Findings (all [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat), indices 0–7)
- `throw_delay`: 100, 80, 70, 60, 55, 50, 40, 40
- `throw_chance`: 6, 20, 32, 46, 46, 52, 58, 64
- `enemy_spawn_chance`: 2, 4, 8, 12, 16, 24, 32, 64
- `enemy_chase_chance`: 16, 32, 48, 64, 80, 96, 112, 128
- `obj_chase_table`: 8, 32, 64, 128, 160, 192, 208, 240
- Room 6 dogs: 6, 6, 7, 7, 8, 8, 9, 9. Helpings per dish: 1, 2, 3, 4, 4, 4, 4, 4
- The room pool also changes with difficulty (see §2)
- Atari observation: on level four only one trash can reaches the fence, and it must be reached with a running jump from the right edge — [DDG](https://datadrivengamer.blogspot.com/2021/07/game-276-alley-cat.html). Difficulty is gentle at first and rises "after a few kisses" — [Greatest Games](https://greatestgames.substack.com/p/the-classic-pc-gaming-era-1977-1989-e37). The fence marker changes per difficulty level on DOS — [FRGCB](http://frgcb.blogspot.com/2015/04/alley-cat-synapse-software-1983.html)
- Wikipedia's claim that difficulty rises until "level 30" conflicts with the PC cap of 7 (see §2).

### Gaps
- Whether the alley layout (the trash-can arrangement) changes per level on PC as it does on Atari.
- The window-open duration per level.

## 6. Original presentation (graphics and audio)

### Takeaway
The PC version runs in CGA mode 4 (320×200, 4 colours) and switches between the two CGA palettes per scene. Sprites are small; the cat is 24 px wide. Audio is PC-speaker only, with music written by Bill Williams. I found no source naming the tunes.

### Cited Findings
- CGA mode 4: 320×200, four colours, 2 bpp, interlaced memory. Palette 0 is used for rooms 4, 5 and 7, and palette 1 for the title, alley and rooms 1, 2, 3 and 6. Pixels are about 1.2 times taller than wide on a 4:3 monitor — [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat)
  - Palette 0 is green/red/brown(yellow) and palette 1 is cyan/magenta/white. That is standard CGA knowledge, not taken from these sources. This matches FRGCB's description of the cheese room as dark red with green, and the love room hearts as red. So the brief's "cyan/magenta/white/black" is correct only for the alley, title and rooms 1, 2, 3 and 6.
- 177 bitmaps. The title block is 88×29, walking cat frames are 24×10 to 24×14, and the room 7 hearts and cupids are 16×8. Masked drawing uses colour 0 as transparent — [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat)
- Laundry on the lines comes in different sizes on DOS. The Atari version has wood tones, six laundry colours in four shapes, fence peek holes and bones — [FRGCB](http://frgcb.blogspot.com/2015/04/alley-cat-synapse-software-1983.html)
- Level completion on DOS flashes the screen black and green and turns the purple faces white — [FRGCB](http://frgcb.blogspot.com/2015/04/alley-cat-synapse-software-1983.html)
- Audio is PC speaker only, using PIT channel 2. Noise effects come from random divisors or from toggling the speaker bit. The background music plays one note at a time from the main loop, with no interrupt — [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat)
- The DOS theme is a beeper rendition that FRGCB describes as "more cheerful and energetic" than the Atari's slow, "sleazy" version. DOS has at least eight distinct effects and two extra short tunes — [FRGCB](http://frgcb.blogspot.com/2015/04/alley-cat-synapse-software-1983.html)
- Bill Williams composed the music — [Wikipedia](https://en.wikipedia.org/wiki/Alley_Cat_(video_game)). The PC music creates an impression of polyphony by playing notes in different registers close together — [Musiikki journal abstract](https://musiikki.journal.fi/article/view/125644). Search results also say the Atari packaging advertised an "original music score" (search snippet only, not verified).

### Inferences
- The music appears to be an original composition. I found no evidence of a licensed or traditional tune, so a remake should compose its own music "in the style" rather than copy the melody, which may still be under copyright.

### Gaps
- Tune names, note data and a full sound-effect list. The Musiikki PDF has a transcription but I did not read the full text.
- The full sprite sheet. The vibe-alleycat extractor exists, but extracted assets are copyrighted material.

## 7. Atari 8-bit vs IBM PC CGA differences

### Takeaway
The two versions have the same structure and the same five challenge types plus the love scene. PC has fewer colours and smaller sound, but it has easier steering, extra cutscenes, rooms gated by difficulty, a bulldog, a single spider, and up to 8 gifts.

### Cited Findings
- Room selection: random at all times on Atari; on DOS, the easiest levels use a subset of rooms that grows with difficulty — [FRGCB](http://frgcb.blogspot.com/2015/04/alley-cat-synapse-software-1983.html); confirmed by the pool tables in [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat)
- DOS walk acceleration is faster — [FRGCB](http://frgcb.blogspot.com/2015/04/alley-cat-synapse-software-1983.html)
- The alley dog is a terrier on Atari and a bulldog on DOS. The library has multiple spiders on Atari and one on DOS — [FRGCB](http://frgcb.blogspot.com/2015/04/alley-cat-synapse-software-1983.html); [VGJUNK](http://retrovania-vgjunk.blogspot.com/2018/11/alley-cat-atari-800.html)
- DOS adds cutscenes (the angry dog, dancing cats between levels). Atari has the more elaborate ending (kiss, floating cats, fireworks) — [FRGCB](http://frgcb.blogspot.com/2015/04/alley-cat-synapse-software-1983.html)
- Atari has richer sound effects (barks, splashes, hisses) and bluesy music; DOS sounds "like an early 48K Spectrum game" — [FRGCB](http://frgcb.blogspot.com/2015/04/alley-cat-synapse-software-1983.html)
- Gifts: up to 3 on Atari ([DDG](https://datadrivengamer.blogspot.com/2021/07/game-276-alley-cat.html)) versus 1–8 on PC ([vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat))
- The PC game detects a PCjr (machine ID 0xFD) and adjusts for it — [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat). The IBM PC release was a self-booting disk, and IBM published it for the PC and PCjr in 1984 — [Wikipedia](https://en.wikipedia.org/wiki/Alley_Cat_(video_game))
- Reviewer verdicts: FRGCB scored Atari 8/9 and PC 7/9 ([FRGCB](http://frgcb.blogspot.com/2015/04/alley-cat-synapse-software-1983.html)). Another reviewer calls the Atari version "then-superior" ([Greatest Games](https://greatestgames.substack.com/p/the-classic-pc-gaming-era-1977-1989-e37))

### Gaps
- Exact Atari scoring and whether it has the same room bonus values.

## 8. Credits, legal/IP status and fan remakes

### Takeaway
The game is not public domain. It is commonly treated as "abandonware", but that has no legal standing. The copyright owner today is unclear, because the chain runs Synapse → Brøderbund → The Learning Company → later owners, and IBM published the PC version. A remake should use an original name and art, and should not reuse the original code, sprites or music.

### Cited Findings
- Bill Williams designed and composed it, based on a one-screen prototype by John Harris, who handed it over after becoming unhappy with its direction — [Wikipedia](https://en.wikipedia.org/wiki/Alley_Cat_(video_game))
- Williams (born 1960, died 28 May 1998, of cystic fibrosis complications) — [Wikipedia: Bill Williams](https://en.wikipedia.org/wiki/Bill_Williams_(game_designer)); [MobyGames person page via search](https://www.mobygames.com/person/613/bill-williams/). There is a 1989 interview: [YAAM interview](https://vgpavilion.com/mags/1989/02/yaam/yaam-interview-bill-williams), which I did not read.
- Brøderbund bought Synapse in late 1984, and the label was retired in 1985. Wikipedia's infobox lists The Learning Company as successor, but the article does not explain what happened to the catalogue rights — [Wikipedia: Synapse Software](https://en.wikipedia.org/wiki/Synapse_Software)
- The fan port's copyright line reads "Alley Cat © 1984 Synapse Software / IBM. This is a fan port for study and play." — [vibe-alleycat](https://github.com/beyondbeneath/vibe-alleycat)
- MobyGames lists Remeow Edition as "Freeware / Free-to-play / Public Domain". That describes the remake, not the original game — [MobyGames via search](https://www.mobygames.com/game/136704/alley-cat-remeow-edition/)
- Archive.org hosts a playable copy — [archive.org](https://archive.org/details/msdos_Alley_Cat_1984)

**Remakes**
- *Alley Cat 2* (2006) is described as the first fan remake — [Wikipedia](https://en.wikipedia.org/wiki/Alley_Cat_(video_game)); [MobyGames](https://www.mobygames.com/game/alley-cat-2) (403, could not read details)
- *Alley Cat: Remeow Edition* is by Joflof and was released 19 March 2018 ([joflof on X](https://x.com/joflof/status/975043889139781633?lang=en)). One forum dates it to 2017 ([FearLess](https://fearlessrevolution.com/viewtopic.php?t=11608)). It is free and Windows-only, and was written in C++ with Allegro ([search summary](https://lutris.net/games/alley-cat-remeow-edition/)). It adds five new stages, arcade and versus modes, up to 4 simultaneous players, the option to control enemies, many configuration options, new graphics and sound with the originals still available, and an "Arcade cabinet mode" — [Indie Retro News](https://www.indieretronews.com/2018/03/alley-cat-remeow-edition-remake-with.html). Greatest Games calls it "unofficial but the definitive version" and says it includes recreations of the original versions — [Greatest Games](https://greatestgames.substack.com/p/the-classic-pc-gaming-era-1977-1989-e37). It was distributed via Game Jolt — [Indie Retro News](https://www.indieretronews.com/2018/03/alley-cat-remeow-edition-remake-with.html). The author's site joflof.com/alleymore.html now 301-redirects to an unrelated domain (imperialcleaners.us), so the official page appears to be gone (my fetch, 2026-10-24).
- I found no Steam release of Remeow Edition. A Steam search returned only the unrelated *Catlateral Damage: Remeowstered*.
- *Misifu Remeow*, a ZX Spectrum remake that reworks every phase, is on [itch.io](https://jbinary.itch.io/misifu-remeow) and was covered by [Indie Retro News](https://www.indieretronews.com/2021/03/misifu-remeow-if-you-loved-1980s.html)
- *vibe-alleycat* is a port rebuilt from the PC disassembly — [GitHub](https://github.com/beyondbeneath/vibe-alleycat)
- Unrelated games that share the name: Solar Software's *Alley Cat* (C64, 1984) and Graftgold's *Alleykat* (1986) — [Greatest Games](https://greatestgames.substack.com/p/the-classic-pc-gaming-era-1977-1989-e37)
- Original reception: *Antic* (Sept 1985) called it "a challenging and interesting game with something of a storybook quality", with "really superb" graphics, and said it "is simply a lot of fun to play!" — [Wikipedia](https://en.wikipedia.org/wiki/Alley_Cat_(video_game))

### Inferences
- I found no evidence of a takedown against any remake, and Remeow, Misifu and the disassembly ports have stayed up for years. That is weak evidence of tolerance, not a licence.
- The name "Alley Cat" is a common phrase and is shared with unrelated games. A remake titled "Cute Alley Cat" with original assets and new character names is lower-risk than reusing "Freddy/Felicia", the sprites or the music. This is not legal advice.

### Gaps
- The current rights holder, and whether IBM retains any rights to the PC port.
- Reception data for Remeow beyond two blog comments and the Greatest Games praise.
- The Alley Cat 2 (2006) author and its feature list.
