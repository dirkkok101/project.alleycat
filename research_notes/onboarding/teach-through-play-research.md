# Teaching Through Play: Game-Design Research Pack

*Prepared for Dirk Kok. Seeded by Extra History's Design Club video on Super Mario Bros. 1-1. Compiled 24 Oct 2026 (SAST).*

**Core topic.** Teaching a game through level design and play instead of text: the wordless tutorial, affordances, the isolation and kishōtenketsu introduce–develop–twist–conclude structure, just-in-time teaching, and playtesting the result.

**Method.**
- YouTube sources were read from captions only (yt-dlp `--skip-download`, subtitles only). No video or audio was downloaded.
- Some GDC talks hit YouTube rate limits (HTTP 429). For those I used the official GDC Vault page plus an independent write-up, and the table says so.
- X posts came from the x search tools. X search mostly surfaces recent, low-engagement posts, so only the one high-engagement relevant thread (Tocelot) is listed.
- All points are paraphrased. Quotes are kept under a sentence.

---

## 1. Source table

| # | Title | Creator | URL | Views / engagement | Key points (paraphrased) |
|---|---|---|---|---|---|
| 1 | Design Club – Super Mario Bros: Level 1-1 | Extra History (Extra Credits) | https://www.youtube.com/watch?v=ZH2wGpEZVgE | Seed video (2014) | The level is a wordless tutorial. Mario starts on the left with empty space to the right, so "go right" is the obvious move. The ? block's shape and motion invite a hit. The Goomba teaches "this hurts" and then "jump on it". The mushroom bounces off a pipe toward you, so you can hardly miss it. Stepped pipes teach that holding the button jumps higher. Secrets reward both newcomers and veterans. |
| 2 | Super Mario 3D World's 4 Step Level Design | Game Maker's Toolkit (Mark Brown) | https://www.youtube.com/watch?v=dBmIkEvEBtA | 1.04M views / 22k likes | Hayashida's kishōtenketsu has four steps: introduce a mechanic safely, develop it without the safety net, twist it, then conclude. Each level gets one main idea. Galaxy mixed too many gimmicks. Mechanics get thrown away after a level so nothing goes stale. |
| 3 | The Structure of Fun: Learning from Super Mario 3D Land's Director | Gamasutra / Game Developer (Hayashida interview) | https://www.gamedeveloper.com/design/the-structure-of-fun-learning-from-i-super-mario-3d-land-i-s-director | Primary interview | This is the primary source for the four-step model. The third beat (the twist) is the one Hayashida values most, an idea he credits to Miyamoto's comic-strip thinking. |
| 4 | Miyamoto on World 1-1 (Eurogamer) | Eurogamer, with Miyamoto and Tezuka | https://www.youtube.com/watch?v=zRGRJRUWafY | Primary interview (2015) | Starting as small Mario makes growing feel like a reward. The first enemy was going to be a Koopa, but stomping and kicking a shell was too hard for beginners, so they invented the Goomba. Early pits are placed so falling in isolates the lesson or is survivable. Run-jumping is taught gradually. 1-1 was built last, after later levels. Miyamoto watches testers silently and never explains. |
| 5 | Tutorials 101 | Extra Credits | https://www.youtube.com/watch?v=BCPcn-Q5nKE | 504k / 10k | Use less text and teach interactively. Teach just in time, including UI. The tutorial has to be fun because the first 10 minutes decide everything. Watch testers silently. Respect genre conventions. Make teaching skippable and revisitable. Design it while building the game, not at the end. |
| 6 | Can We Improve Tutorials for Complex Games? | GMTK | https://www.youtube.com/watch?v=-GV814cWiAw | 1.59M / 71k | Willingness to learn grows with investment (George Fan). Shelley's inverted pyramid: few decisions early, more later. Frostpunk drip-feeds system tutorials; Mini Metro and Total War reveal UI progressively. Arrows that say "click here" teach nothing. Shorten slow feedback loops. Teach why as well as how. Borrow conventions. Offer several ways to learn. |
| 7 | Half-Life 2's Invisible Tutorial | GMTK | https://www.youtube.com/watch?v=MMggqenxuZc | 1.41M / 45k | Ravenholm's saw blade is taught in seconds with no words. New enemies are first shown behind safe barriers. Environmental foreshadowing (a seesaw) sets up a later puzzle. Puzzles ramp one notch at a time. Any spoken teaching stays inside the fiction. |
| 8 | Teaching Game Mechanics Well – Guidance vs Hand-Holding | Design Doc | https://www.youtube.com/watch?v=ZIs5189lmRA | 261k | The isolation principle: introduce alone, develop, then combine. Locking systems for about 20 hours (FF13) is over-teaching. Bosses that obviously require the dungeon item are too on-the-nose. Balance under-explaining against over-explaining. |
| 9 | Directing Exploration – How Games Guide Players Without Tutorials | Design Doc | https://www.youtube.com/watch?v=rrL3iG_uacw | 98k | The first screen should signal the game's structure (linear, semi-open or open). Mario faces right. Metroid's start leans toward the morph ball, and its blocked gap teaches backtracking. Zelda's dark cave contrast pulls you toward the sword. |
| 10 | How Nintendo Solved Zelda's Open World Problem | GMTK (on the CEDEC 2017 talk) | https://www.youtube.com/watch?v=CZzcVs8tNfE | 3.15M / 115k | When towers and lines were the main guidance, most players just followed them and the rest wandered aimlessly. Nintendo replaced this with attractive landmarks that each offer a clear benefit. The "triangle rule" uses terrain to hide and reveal. The result is a chain of "what's that?" moments. Heatmaps showed players spread out but still reached key places. |
| 11 | Valve's "Secret Weapon" | GMTK | https://www.youtube.com/watch?v=9Yomqk0C6kE | 1.93M / 66k | Treat designs as hypotheses and test weekly. Shut up and watch. Players don't learn under stress and rarely look up. Ignore testers' proposed fixes but take their problems seriously. Testers mistook Portal for a tutorial, which is how GLaDOS became the motivation. Clean white walls fixed missed cues. |
| 12 | How to Keep Players Engaged (Without Being Evil) | GMTK | https://www.youtube.com/watch?v=hbzGO_Qonu0 | 2.77M / 88k | Pace by modulating intensity. Keep supplying novelty. Use mystery and foreshadowing. Stack long-term goals over short milestones (Stardew, Factorio). Let players plan and imagine future power. Keep difficulty in the flow channel. |
| 13 | 10 tutorial tips from Plants vs. Zombies (George Fan, GDC 2012) | Game Developer write-up; GDC Vault talk | https://www.gamedeveloper.com/design/gdc-2012-10-tutorial-tips-from-i-plants-vs-zombies-i-creator-george-fan | GDC YouTube re-upload 62k (captions rate-limited, so the write-up was used) | Blend the tutorial into play and never call it a tutorial. Doing beats reading. Spread mechanics out (money appears only after about 10 levels). One forced action is often enough. Aim for at most about 8 words on screen. Use passive, adaptive hints that only appear for players doing it wrong. Avoid noise. Make visuals explain function. Lean on what players already know. |
| 14 | The Gamer's Brain Part 2: UX of Onboarding and Player Engagement | Celia Hodent, GDC | https://www.youtube.com/watch?v=Paf6B1jleCo | 22k | Learning depends on attention, which is limited (working memory holds about 3 items). Divided attention kills learning. Teach by doing, in context, with meaning. Don't punish while players learn. Explain the why, not only the how. Encoding, storage and recall can each fail and need different fixes. Space and vary repetition. Show the lock before the key. |
| 15 | The Chemistry of Game Design (skill atoms) | Daniel Cook, Lostgarden / Gamasutra | https://lostgarden.com/2021/03/13/the-chemistry-of-game-design-2/ | Canonical essay | A skill atom is decision, action, simulation, feedback, then the player's mental model. Atoms chain into a skill tree that maps prerequisite learning. Track which skills are mastered, partial, unexercised or burned out. Missing feedback breaks the chain. |
| 16 | Ten Principles for Good Level Design | Dan Taylor, GDC | https://www.youtube.com/watch?v=iNEe3KhMvXM · https://www.gdcvault.com/play/1019023/Ten-Principles-for-Good-Level | 547k (captions rate-limited, so summaries were used) | Navigation should be fun. Use clear visual language. Tell stories without words. Make objectives clear but methods open. Keep teaching. Surprise. Empower the player. Support easy, medium and hard routes. Build efficiently. Make the player feel something. |
| 17 | Interesting Decisions | Sid Meier, GDC 2012 | https://www.gamedeveloper.com/design/gdc-2012-sid-meier-on-how-to-see-games-as-sets-of-interesting-decisions | GDC video 68k | Good choices involve tradeoffs, depend on the situation, express play style and have lasting effects. Give enough information. Lean on what players know about the setting; he names pirates explicitly. Always acknowledge a choice with feedback. Cut decisions that don't engage. |
| 18 | The Psychology of Game Design (Everything You Know Is Wrong) | Sid Meier, GDC 2010 | https://www.adachen.com/gdc10-notes-sid-meier-on-why-everything-you-know-is-wrong/ | GDC video 136k | His "first 50 minutes" rule: make the opening compelling, preview all the fun ahead, and reward generously. Players see setbacks as unfair unless they understand them. Shape perceived odds to match intuition. Players expect to win. |
| 19 | Playtesting: Avoiding Evil Data | Adriaan de Jongh (Hidden Folks), GDC | https://www.youtube.com/watch?v=6EUeYu0aPn4 | 19k | "Evil data" is feedback that misleads. Test in a setting that matches how the game is really played; 5-minute event demos can mislead. Testers' fixes and survey answers are second-hand. He uses no surveys. Recorded at-home play sessions are the most honest data source. |
| 20 | FTUE – First Time User Experience | Eric Santana, NZGDC 2021 | https://www.youtube.com/watch?v=NxbvSH4ROYA | 1.4k (practitioner, mobile) | The FTUE is everything in the first session, not only the tutorial. Storyboard it. Alternate spectacle with interaction. Walk the core loop two or three times before letting go. Instrument a step funnel to find drop-off. Fix overload by trimming choices (3 boosters, not 20). Remote recorded tests caught a drag gesture that was redesigned as a tap. |
| 21 | Games have some of the best onboarding flows (thread) | Jonathan Lai (@Tocelot) | https://x.com/Tocelot/status/1399752363389296641 | ~1.6k likes | "Time-to-fun" as a metric. CoD Mobile drops you into action within seconds and teaches one control at a time. Early matches use bots so new players win and build confidence. Monetisation and customisation appear only after the fun. |

---

## 2. Synthesis: principles, frameworks, heuristics

### 2.1 Frameworks

1. **Skill atoms and skill chains** (Cook). Every mechanic is a loop: the player acts, the game responds, the player reads the feedback and updates a mental model. Map the chain of prerequisites so no lesson depends on one you haven't taught. If an atom has no clear feedback, nobody learns it.
2. **Isolation, then development, then combination** (Design Doc, Valve and Half-Life 2 practice). Show a new element alone and safely. Then use it under pressure. Then combine it with older elements.
3. **Kishōtenketsu (introduce, develop, twist, conclude)** (Hayashida via GMTK). Each level or section has one idea. Step 1 is safe, step 2 removes the net, step 3 adds a surprise, and step 4 lets the player show mastery.
4. **Inverted pyramid of decisions** (Shelley via GMTK). Start with very few choices and widen them as the player's competence grows.
5. **Willingness-to-learn curve** (George Fan). Patience for learning is low at minute one and rises with investment. So hold back the peripheral systems.
6. **Attention and working memory** (Hodent). Learning needs focused attention. Plan for about three new things at once at most. Never teach during divided attention or while punishing the player.
7. **Interesting decisions** (Meier). Once the controls are learned, the opening has to offer meaningful tradeoffs quickly. Tie them to knowledge players already have about the fantasy (pirates).

### 2.2 Heuristics

- **Layout over language.** Use space, contrast, motion and placement so the right action is the obvious one (Mario facing right, the Zelda cave, the BotW landmarks).
- **Readable affordances.** What a thing does should show in its form: Peashooter has a mouth, ? blocks bob. Watch for false affordances, such as an axe in Fortnite that can't chop trees.
- **Gate once, early.** Put one unavoidable test of the core skill right at the start (the first Goomba). After that, trust the player.
- **Cheap failure.** Fast retries and survivable mistakes. Don't punish during learning (Hodent's Fortnite data showed players who die early quit more).
- **Shape space so mistakes still teach.** The mushroom bounces off the pipe toward you. A pit that's safe to fall into teaches run-jumping.
- **Safe preview, then the real test.** Show a threat behind glass first (Half-Life 2), then let it reach you.
- **Show the lock before the key.** Tease obstacles before handing out the tool, so the tool lands as a eureka moment (grapple poles in Zelda).
- **Just in time.** Teach a mechanic at the moment it's needed and meaningful, not up front.
- **Explain why, not only how.** Purpose drives attention. Check comprehension by asking players what the objective is and why.
- **Adaptive hints.** Only show help to players who are doing it wrong (PvZ), so competent players get to feel smart.
- **Few words, in-world.** About 8 words on screen at most. Use voices from inside the fiction. Use passive messages that don't pause play.
- **One idea per space, then throw it away** (3D World). Novelty sustains interest.
- **Walk the core loop two or three times early** (Santana). The player should know what the game is within the first session.
- **Build the opening last.** Miyamoto built 1-1 after later levels, once he knew what had to be taught.

### 2.3 Common mistakes

- Text walls, loading-screen essays, and popups that stop play.
- Front-loading every system, or the opposite: locking systems away for hours.
- Arrows saying "click here" that the player follows without understanding.
- Teaching during chaos. In Hodent's Paragon and Fortnite eye-tracking, players never looked at the prompts.
- Punishing deaths in the first minutes.
- False or invisible signifiers, such as a tiny corner mark that players miss.
- Guidance that over-funnels (BotW's early towers) or leaves players aimless with no pull.
- Trusting surveys and testers' suggested fixes. Testing in the wrong setting (5-minute demos for a game meant to be played for hours).

### 2.4 Checklist (short form)

1. Is every mechanic in the opening on the skill chain, with its prerequisites already taught?
2. Is each new element introduced in isolation and safely?
3. Does each element then develop and get a twist?
4. Are there three or fewer new things in any one moment?
5. Can a silent observer see the right action discovered without text?
6. Do failures cost seconds, not minutes?
7. Is there a clear next objective, and do players know why it matters?
8. Is help adaptive and skippable, and can it be found again later?
9. Have you watched new players, at home and in a realistic setting, without explaining?

---

## 3. Draft agent skill: `teach-through-play`

**When to use**
- Designing or reviewing any part of a game where the player meets a mechanic, system or location for the first time: the opening, a new region, a new ship type, a new town service.
- Reviewing a tutorial, FTUE or onboarding flow.
- Diagnosing playtest confusion ("players don't know what to do").
- Also applies to software onboarding, such as Capstone's first-run experience.

**Step-by-step design procedure**
1. **State the player fantasy and the first-session promise.** What should a new player have done and felt by minute 5, 10 and 30? (Use Meier's first-50-minutes rule and time-to-fun.)
2. **Inventory and chain the skills.** List every verb and system. Build Cook's skill chain from it. Tag each skill as core (must be learned in session 1), supporting (learned when it becomes useful) or depth (learned once the player is invested).
3. **Order by the inverted pyramid.** Assign each skill to a moment. Respect the willingness-to-learn curve and the limit of three or fewer new items at a time.
4. **Design each lesson as a mini kishōtenketsu.** Introduce it safely, develop it, twist it, conclude it. Say which space, enemy or object does the teaching.
5. **Choose the teaching channel, in this order of preference:** layout and affordance first; then a forced but meaningful action; then an in-world voice or diegetic prompt; then a passive adaptive hint; text only as a last resort (8 words or fewer).
6. **Add the pull.** Give a clear next objective that carries a why, a visible landmark or lock, and a reward that previews deeper play.
7. **Make failure cheap.** Identify every possible fail state in the opening and make each one recoverable within seconds.
8. **Plan the reveal schedule.** Decide which UI, menus and services start hidden or locked, and the in-world moment that unlocks each one.
9. **Instrument it.** Define funnel steps, a time-to-first-fun target, and the drop-off points to watch.
10. **Playtest silently.** Test 5–8 genuine newcomers in a realistic setting and capture recordings. Afterwards, ask "what were you trying to do, and why?" Log problems, not testers' fixes.
11. **Iterate on the hypotheses,** then build or revise the opening last.

**Review checklist** (output a pass/fail with evidence for each)
- [ ] The first meaningful action happens within 60 seconds. The core fantasy is felt within 5 minutes.
- [ ] Each new mechanic is isolated, then developed, then twisted.
- [ ] There are never more than about 3 new concepts at once, and no teaching happens during chaos.
- [ ] No lesson relies only on text. Prompts are in-world, passive and adaptive.
- [ ] Affordances are readable. No false affordances.
- [ ] Failure in the opening costs 30 seconds or less and isn't punished while the player is learning.
- [ ] A clear next objective with a why is always available.
- [ ] Peripheral systems are deferred, and each one has an unlock moment.
- [ ] Veterans can skip, and there are secrets or optional depth for them.
- [ ] Reference material can be found again later (log, codex).
- [ ] The funnel is instrumented, and a silent playtest plan exists.

**Worked example prompts**
- "Use teach-through-play to design Corsair's first 10 minutes so the player learns sailing, wind and broadsides before reaching a port."
- "Review this onboarding flow (paste the beat sheet) against the teach-through-play checklist and list the failures with fixes."
- "Build a skill chain for Corsair's trading system and propose when each atom is taught."
- "Playtesters say they 'don't know what to do' in the first town. Diagnose this with teach-through-play and propose three fixes, ranked."
- "Apply teach-through-play to Capstone's first-login experience for a mine planner."
