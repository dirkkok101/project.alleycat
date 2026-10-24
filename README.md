# Alley Cat: Remeow!

A free, open-source, cute modern-arcade fan remake of the 1984 IBM PC classic *Alley Cat* (Bill Williams / Synapse Software), playable in the browser.

Hop the fence, prowl the washing lines catching mice, dodge the bulldog and the stuff people throw at you, and leap into open windows for five mini-game rooms. Win a room and a sweetheart calls from a window glowing pink: climb the hearts past cupids and rival toms for a kiss, an extra life and the next level.

## Play

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
npm test         # rules unit tests
```

Controls: ←/→ (or A/D) move · Space/↑/Z jump (hold for higher; a running start jumps much higher) · ↓ drop through lines, eat, and tunnel through the cheese · P pause · M mute. Gamepads and touch screens work too.

## Rooms

| Room | Goal |
|---|---|
| Fishbowl | Jump into the bowl, then eat every fish underwater; dodge eels, surface for air |
| Bookshelf | Collect three ferns from the high shelves; avoid the dangling spider |
| Cheese | Catch the shy mice peeking from 16 holes; they duck when you get close, so press ↓ in a hole to tunnel out of its secret partner hole |
| Birdcage | Shove the cage off the table, then catch the canary |
| Sleeping dogs | Empty every dish (hold ↓) on the floor and shelf without lingering near the dogs |

The broom never hurts you, but it flies after you and sweeps you toward the window. Every moment on a room's floor risks the bulldog barging in.

In the alley, every window that opens throws something at you (from level 3 a hit costs a life), windows only open while you're up on the fence or higher, and you enter one by dropping into it. Each room won adds a gift to the love scene; a gift keeps a rival busy for a while.

New players get a gentle first night on Kitten: sitting mice to learn jumping, one window that stays open, hazards that wait until you've tried the goal, and one free bulldog bump. Rules follow the original's per-level tables (see `research_notes/Cute Alley Cat remake research/original_mechanics_deep.md`).

## Project layout

- `src/logic/rules.ts`: pure scoring, difficulty and room-selection rules, with Vitest tests
- `src/scenes/`: one Phaser scene per screen
- `src/objects/`: the cat controller and shared hazards
- `src/audio/`: procedural Web Audio music and SFX
- `art/`: asset manifest, style reference and generation output; `tools/sync-art.sh` copies finished art into `public/assets`
- `reports/`: background research

See `ASSETS.md` for asset provenance. Code is MIT licensed. *Alley Cat* is a trademark/copyright of its respective owners; this is an unaffiliated, non-commercial tribute.
