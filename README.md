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

Controls: ←/→ (or A/D) move · Space/↑/Z jump (hold for higher) · ↓ drop through lines, sneak, and eat · M mute. Gamepads and touch screens work too.

## Rooms

| Room | Goal |
|---|---|
| Fishbowl | Jump into the bowl, then eat every fish underwater; dodge eels, surface for air |
| Bookshelf | Collect three ferns from the high shelves; avoid the dangling spider |
| Cheese | Pounce on mice peeking out of the cheese holes |
| Birdcage | Shove the cage off the table, then catch the canary |
| Sleeping dogs | Sneak and empty every dish without waking the dogs |

The broom never hurts you, but it shoves you around and can sweep you out of the window. Dawdle and the bulldog barges in.

## Project layout

- `src/logic/rules.ts`: pure scoring, difficulty and room-selection rules, with Vitest tests
- `src/scenes/`: one Phaser scene per screen
- `src/objects/`: the cat controller and shared hazards
- `src/audio/`: procedural Web Audio music and SFX
- `art/`: asset manifest, style reference and generation output; `tools/sync-art.sh` copies finished art into `public/assets`
- `reports/`: background research

See `ASSETS.md` for asset provenance. Code is MIT licensed. *Alley Cat* is a trademark/copyright of its respective owners; this is an unaffiliated, non-commercial tribute.
