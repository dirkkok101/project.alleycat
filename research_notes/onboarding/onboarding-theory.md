# New-Player Onboarding Through Play: Theory, Cases, and Corsair's Opening

*Prepared for Dirk Kok, 24 Oct 2026 (SAST). Companion to `game-design-research.md`.*

**The problem.** A new player lands in a menu-driven, Pirates!-style town and doesn't know what to do. This file collects what practitioners say about easing players in through play, then applies it to Corsair.

**Method note.**
- YouTube sources were read through captions only. Nothing was downloaded.
- Some GDC captions were rate-limited, so I used write-ups of those talks and say so in the table.
- Everything here is paraphrased. Quotes are under a sentence.

---

## 1. Source table

| # | Title | Creator | URL | Engagement |
|---|---|---|---|---|
| 1 | Design Club – SMB Level 1-1 | Extra History | https://www.youtube.com/watch?v=ZH2wGpEZVgE | seed video |
| 2 | Miyamoto on World 1-1 | Eurogamer (Miyamoto, Tezuka) | https://www.youtube.com/watch?v=zRGRJRUWafY | primary interview |
| 3 | Half-Life 2's Invisible Tutorial | GMTK | https://www.youtube.com/watch?v=MMggqenxuZc | 1.41M views |
| 4 | Valve's "Secret Weapon" (Portal and HL2 playtesting) | GMTK | https://www.youtube.com/watch?v=9Yomqk0C6kE | 1.93M |
| 5 | Super Mario 3D World's 4 Step Level Design | GMTK | https://www.youtube.com/watch?v=dBmIkEvEBtA | 1.04M |
| 6 | The Structure of Fun (Hayashida interview) | Game Developer / Gamasutra | https://www.gamedeveloper.com/design/the-structure-of-fun-learning-from-i-super-mario-3d-land-i-s-director | primary interview |
| 7 | Tutorials 101 | Extra Credits | https://www.youtube.com/watch?v=BCPcn-Q5nKE | 504k |
| 8 | Can We Improve Tutorials for Complex Games? | GMTK | https://www.youtube.com/watch?v=-GV814cWiAw | 1.59M |
| 9 | 10 tutorial tips (George Fan, PvZ) | Game Developer; GDC Vault | https://www.gamedeveloper.com/design/gdc-2012-10-tutorial-tips-from-i-plants-vs-zombies-i-creator-george-fan | GDC talk (YouTube re-upload 62k) |
| 10 | The Gamer's Brain Part 2: UX of Onboarding | Celia Hodent, GDC | https://www.youtube.com/watch?v=Paf6B1jleCo | 22k |
| 11 | FTUE – First Time User Experience | Eric Santana, NZGDC 2021 | https://www.youtube.com/watch?v=NxbvSH4ROYA | 1.4k |
| 12 | Games have the best onboarding flows ("time-to-fun") | Jonathan Lai (@Tocelot) | https://x.com/Tocelot/status/1399752363389296641 | ~1.6k likes |
| 13 | Optimizing your tutorial and first session | Alexandre Macmillan | https://alexandremacmillan.com/2018/11/28/optimizing-your-tutorial-and-your-first-session/ | practitioner blog |
| 14 | Player lifecycle metrics | Second Stage Academy | https://secondstage.io | industry guide |
| 15 | Achievements and completion rates | ScienceDirect (Entertainment Computing) | https://www.sciencedirect.com/science/article/abs/pii/S1875952118300181 | academic |
| 16 | How Nintendo Solved Zelda's Open World Problem | GMTK | https://www.youtube.com/watch?v=CZzcVs8tNfE | 3.15M |
| 17 | Directing Exploration | Design Doc | https://www.youtube.com/watch?v=rrL3iG_uacw | 98k |
| 18 | Guidance vs Hand-Holding | Design Doc | https://www.youtube.com/watch?v=ZIs5189lmRA | 261k |
| 19 | How to Keep Players Engaged | GMTK | https://www.youtube.com/watch?v=hbzGO_Qonu0 | 2.77M |
| 20 | Psychology of Game Design (first 50 minutes) | Sid Meier, GDC 2010 (notes by Ada Chen Rekhi) | https://www.adachen.com/gdc10-notes-sid-meier-on-why-everything-you-know-is-wrong/ | GDC video 136k |
| 21 | Interesting Decisions | Sid Meier, GDC 2012 | https://www.gamedeveloper.com/design/gdc-2012-sid-meier-on-how-to-see-games-as-sets-of-interesting-decisions | GDC video 68k |
| 22 | Sid Meier's Pirates! (2004): opening and structure | Wikipedia; GameFAQs guide | https://en.wikipedia.org/wiki/Sid_Meier%27s_Pirates!_(2004_video_game) · https://gamefaqs.gamespot.com/pc/915017-sid-meiers-pirates/faqs/34143 | reference |
| 23 | Sea of Thieves gets a charming tutorial (Maiden Voyage) | Polygon; PC Gamer | https://www.polygon.com/2019/12/11/21011278/sea-of-thieves-maiden-voyage-tutorial-mode-new-players/ · https://www.pcgamer.com/sea-of-thieves-gets-a-tutorial-to-help-new-players-set-sail/ | press |
| 24 | Visual Adventures on Sea of Thieves (Q&A on no tutorial) | Rare, GDC 2018 | https://gameindustrylibrary.com/documents/visual-adventures-on-sea-of-thieves | talk transcript |
| 25 | AC IV Black Flag Sequence 01 | Prima Games; Wikipedia | https://primagames.com/eguides/assassins-creed-iv-black-flag-eguide/walkthrough/sequence-01 | reference |
| 26 | Elite Dangerous – New Player Experience | ObsidianAnt | https://www.youtube.com/watch?v=RXu_Bk4y0Ww | 70k |
| 27 | Sunless Sea's Best Mechanic and Why It Works | Cogwatch (Rock Paper Shotgun) | https://www.youtube.com/watch?v=_r6VtUW9504 | 54k |
| 28 | Stardew Valley UI/UX and quests analysis | Game Design Lab (teemo.dev) | https://teemo.dev/game-design/stardew-valley/systems/ui-ux-design/ | analysis |
| 29 | Bannerlord new-player complaints | r/mountandblade and r/Bannerlord threads | https://www.reddit.com/r/mountandblade/comments/edkzcq/bannerlord_needs_to_be_sooo_much_more_beginner/ | community |
| 30 | Darkest Dungeon: the Hamlet | Official wiki | https://darkestdungeon.wiki.gg/wiki/Hamlet | reference |
| 31 | Nocturne's tutorial dungeon (thread) | @J0ezah | https://x.com/J0ezah/status/1771843998887354387 | ~630 likes |
| 32 | Playtesting: Avoiding Evil Data | Adriaan de Jongh, GDC | https://www.youtube.com/watch?v=6EUeYu0aPn4 | 19k |
| 33 | The Chemistry of Game Design | Daniel Cook | https://lostgarden.com/2021/03/13/the-chemistry-of-game-design-2/ | canonical essay |
| 34 | Ten Principles for Good Level Design | Dan Taylor, GDC | https://www.gdcvault.com/play/1019023/Ten-Principles-for-Good-Level | 547k (summary used) |

---

## 2. Theory, organised by principle

### P1. The first session is the product, so measure time-to-fun
- **FTUE scope.** The first-time user experience is everything in the first session: install, loading, menus, cutscenes and tutorial (Santana). Every game has one whether or not anyone designed it.
- **Drop-off evidence.**
  - Hodent shows Warframe keeping about 80% of players past hour one. In other words, even a hit loses roughly a fifth during onboarding, and weaker games lose far more.
  - Benchmarks commonly cited for mobile and live games: FTUE completion of 60–90% and D1 retention of 40–50% (Second Stage, Macmillan). The biggest relative churn often comes right when the tutorial ends and open play begins.
  - Steam achievement studies find only a small minority finish games, so the opening carries a disproportionate share of a game's impression.
- **Time-to-fun** (Lai). Top mobile games deliver fun in under a minute. CoD Mobile asks only for a name, then drops you straight into action.
- **Meier's first-50-minutes rule.** The opening should be very compelling, preview the whole game's fun, and reward generously.
- **Windows to plan for:**
  - **First 1–5 minutes:** hook and the first meaningful action.
  - **First 10 minutes:** the core loop completed once.
  - **First 30 minutes:** the loop repeated two or three times, plus the first self-chosen goal.
  - **First hour:** a long-term goal is visible.

### P2. Hook first, explain later (in medias res, then motivation)
- Open on the fantasy, not on setup. CoD Mobile starts in action. Black Flag opens mid-naval battle before the shipwreck. HL2's tram ride sells the world without asking for any input.
- Santana: alternate spectacle with small interactions so neither drags.
- Hodent: motivation is a precondition for attention. Children solved a counting task years earlier when the tokens were candy they could keep. Give players a reason before you give them instructions.
- Valve: testers took Portal for a tutorial until GLaDOS gave the test chambers a motive.

### P3. Invisible tutorials: layout, affordance, isolation
- **SMB 1-1** (Extra History, Miyamoto):
  - Each element teaches one thing and the space forces you to engage with it.
  - Small Mario exists so that growing feels good.
  - The Goomba exists because kicking a Koopa shell was too hard for a first enemy.
  - Pits are placed so early falls teach without much cost.
  - Miyamoto built 1-1 after the later levels, once he knew what it needed to teach.
- **Half-Life 2:** threats are previewed behind barriers, then delivered. A new tool is taught by putting the problem in front of you.
- **Portal:** the whole game is a ramped tutorial. Clean walls make cues readable.
- **Isolation principle** (Design Doc): introduce alone, then develop, then combine.
- **Affordances** (Hodent): physical, cognitive, sensory and functional. Signifiers are what make an affordance visible. False affordances, like a Fortnite axe that can't chop trees, actively mis-teach.

### P4. Kishōtenketsu as a lesson template
- Hayashida's four beats: introduce safely, develop without the net, twist, then conclude.
- One idea per section. The twist keeps learning fresh, and the conclusion lets the player show mastery.
- Useful far beyond platformers: apply it to each new system, such as the first broadside, the first trade or the first boarding.

### P5. Progressive disclosure and gradual unlocking
- **Willingness to learn rises with investment** (Fan). PvZ withholds money until about level 10 and the Zen Garden until late. Its first shop visit lets you buy only one item.
- **Inverted pyramid of decisions** (Shelley): few choices first, widening as competence grows.
- **Progressive UI:**
  - Mini Metro reveals UI as it becomes needed.
  - Animal Crossing's tool wheel is earned.
  - Fortnite's HUD shows empty slots that promise future gadgets (Hodent).
  - Darkest Dungeon's Hamlet unlocks its buildings week by week after a short guided expedition, so the hub town grows as you need it. This is a direct precedent for Corsair.
- **Anti-extreme:** don't lock systems for 20 hours (FF13).

### P6. A guided first objective and a clear next action
- Players need a short-term goal, a mid-term goal and a long-term goal stacked together (Hodent's Pokémon example; GMTK on Stardew).
- **Stardew day one:**
  - Lewis's seeds plus a journal quest teach the whole farm loop: till, plant, water, harvest, sell.
  - The "meet everyone" quest maps the town and introduces friendship.
  - The 100g reward teaches where quests live.
- **Santana:** walk the core loop two or three times before going hands-off.
- **Pirates! (2004):**
  - The backstory supplies a lifelong goal (rescue your family, revenge on the Marquis).
  - The first game after install presets everything to easiest.
  - On low difficulty, an easy merchant spawns just outside the first port after you talk to the governor. That is a quiet guided first objective.
  - The weakness is that the town itself is a flat menu of equal options.
- **BotW:** Nintendo found towers alone made players follow rails or wander. Landmarks with clear benefits create a pull and leave the player in charge. The triangle rule uses terrain to hide and reveal.

### P7. Contextual, just-in-time prompts vs front-loaded tutorials
- Hodent's eye-tracking showed players skip loading-screen text and miss prompts while busy fighting. Teach with context and meaning, at most three things at once, with the why first.
- Fortnite's door lesson only stuck once it became a concrete problem: a wall stood between you and your objective, so you needed a door.
- PvZ: about 8 words on screen at most; passive messages that don't pause; adaptive hints only for players doing it wrong.
- Elite Dangerous (2019): context-sensitive voiced training that reacts to what you already did ("you've already stowed weapons") and ends by granting a pilot's licence. The weakness is that veterans can't replay it.
- Sea of Thieves:
  - Launched with no tutorial, on the strength of studio tests where fans worked things out.
  - Players complained about having to run "seminars" for friends.
  - Maiden Voyage (2019) added an optional, replayable in-world island: you wake on a beach, the Pirate Lord gives small tasks, and a sloop drill comes last before you sail through the Shroud into the main world.
  - The lesson: discovery suits groups with an experienced friend, while solo newcomers need a guided on-ramp.
- Spread reminders over time and vary their context, because memory decays (Hodent's forgetting curve). Remind players right when they need to recall something.

### P8. Safe sandboxes and cheap failure
- Hodent: never punish while players are learning. Fortnite alpha data showed early deaths predicted quitting.
- CoD Mobile fills early matches with bots so new players win and gain confidence, then brings in real people gradually (Lai).
- Miyamoto's safe pits. Mario's short retries.
- Meier: players read setbacks as unfair unless they understand why. So make early setbacks rare and clearly explained.
- Sunless Sea shows the other side: harsh failure and tedium can be meaningful, but only once the player has bought into the fantasy. Its creator admits the opening hours suffered for it.

### P9. Motivation and agency in the opening
- Self-determination theory (Hodent): competence, autonomy and relatedness. Early wins build competence. A real choice early gives autonomy. A companion or mentor gives relatedness.
- Meier: give players interesting decisions with tradeoffs as soon as possible, and acknowledge every choice with feedback.
- Pirate knowledge is already in players' heads (Meier names pirates explicitly), so lean on it: everyone knows what plunder, a governor and a tavern are.
- Show the lock before the key (Hodent's Zelda grapple example). Tease the governor's mansion or the fort before they're usable.

### P10. Turning menu-hub towns into guided play
Synthesised from Darkest Dungeon, Stardew, Pirates!, Sea of Thieves outposts and PvZ's shop:
1. **Stage the hub.** On the first visit only 1–3 services are open, each with a reason to use it now. The rest are visibly present but closed, with an in-world explanation.
2. **Arrive with a need.** Damaged hull, prize cargo, short of crew. A need turns each menu into the answer to a problem.
3. **Use a diegetic guide** (quartermaster, harbourmaster) who speaks one line at the door of each building. No text boxes before you enter.
4. **Use a short errand list,** three items at most, shown in-world (the quartermaster's slate).
5. **The exit hook:** before leaving, the tavern plants a rumour that becomes a landmark on the map.
6. **Unlock services through play.** The governor opens after your first prize. The shipwright's upgrades open after your first repair. The fence opens after you are first spotted smuggling.
7. **Leave the town as a menu for veterans.** A "skip guide" option and fast access after the first visit.

### P11. Playtesting onboarding
- **Silent observation** (Miyamoto, Valve, Extra Credits). Never explain. Watch body language and where players look.
- **Test the right audience in the right setting.** De Jongh warns that 5-minute event demos mislead for longer games. Valve's hardcore FPS testers gave misleading notes on the GLaDOS fight.
- **Comprehension questions over satisfaction questions** (Hodent). Ask "what was the objective, and why?" rather than "was it clear?", since players almost always say yes to the latter.
- **Treat testers' fixes as symptoms, not solutions** (Valve, de Jongh). De Jongh uses no surveys at all.
- **Recorded at-home sessions** (PlaytestCloud-style; Santana, de Jongh). They show the real first 30 minutes, taps and drags included.
- **Instrument a step funnel** (Santana). Find the node with the steep drop and fix the overload there (20 boosters cut to 3).
- **Designs are hypotheses; test weekly** (Valve, Ambinder).

---

## 3. Case studies

| Game | What it does | Lesson for Corsair |
|---|---|---|
| **Super Mario Bros. 1-1** | Wordless lessons carried by layout. Safe first threat. Grow-to-reward. | Each sea lesson should be one obvious situation. |
| **Half-Life 2 / Portal** | Preview a threat safely, then confront it. Ramp one notch at a time. Find the motivation through playtesting. | Show the enemy frigate at a distance before the fight. |
| **BotW Great Plateau** | A bounded, safe starter region. Landmarks with benefits. The exit is gated by a single tool (the paraglider). | A bounded starter archipelago, gated by a seaworthy ship. |
| **Sea of Thieves** | Pure discovery at launch, then an optional, replayable diegetic island tutorial with a mentor that ends by sailing into the world. | A mentor, an island, a sloop drill, and an exit through a fog bank. Keep it replayable. |
| **AC IV Black Flag** | Opens mid-naval battle and shipwreck. Gives you the wheel with steering, cannons and explosive barrels before any town. Ship upgrades come later. | Start at sea mid-action. Defer upgrades. |
| **Sid Meier's Pirates!** | Backstory supplies a lifelong goal. Mutiny makes you captain. Easiest presets on the first run. Easy merchant outside port. But the town is a flat menu. | Keep the goal and the mutiny. Stage the town. |
| **Mount & Blade: Bannerlord** | A thin tutorial, then a vast sandbox. Many players don't know what to do next. The campaign mode adds a main quest. | Sandboxes need a mid-term quest thread from the start. |
| **Sunless Sea** | Ports are text menus. The voyage between them supplies dread and meaning. Harsh early game. | Travel can carry meaning, but soften the first hour. |
| **Elite Dangerous (2019 NPE)** | Short, voiced, reactive training ending in a licence. | Reactive mentor lines. A ceremonial "letter of marque" as graduation. |
| **Stardew Valley** | Gift plus journal quest teaches the full loop on day one. A "meet everyone" quest maps the town. | The first port as a quest that maps the town. |
| **Darkest Dungeon** | A short guided expedition, then a hub whose buildings unlock week by week. | Unlock town services over time. |
| **Plants vs. Zombies** | One plant, one lane, one coin. Money only after about 10 levels. Adaptive hints. | Unlock trade goods one at a time. Hint only on mistakes. |
| **CoD Mobile** | Seconds to action. One control per overlay. Bot matches you win. | An easy guaranteed first prize, with challenge rising slowly. |
| **Fortnite (Hodent)** | Context plus meaning for teaching doors. A broken gun teaches that items can't be repaired. HUD slots promise future gadgets. | Teach through a forced, meaningful moment, such as a mast breaking that teaches repair. |

---

## 4. Anti-patterns

1. **The menu town as the first screen:** six equal options and no need. This is Corsair's current risk.
2. **Front-loaded tutorials:** text walls, loading-screen lectures, control diagrams.
3. **Teaching in chaos.** Prompts during combat get ignored (Hodent's eye-tracking).
4. **"Click here" arrows** that produce compliance without understanding (Vollmer).
5. **Punishing deaths or permanent losses** in the first 30 minutes.
6. **A sandbox with no pull.** Total freedom and no next action (Bannerlord complaints, BotW's aimless 20%).
7. **Over-railing:** a long, unskippable hand-held sequence, or systems locked for hours.
8. **False or invisible signifiers:** a tiny badge, an icon with no meaning, an unclear end-turn icon (the hourglass in Troy).
9. **More than about 3 new concepts at once.** Showing every option at the first encounter (20 boosters).
10. **Monetisation, customisation or account setup before the fun.**
11. **A tutorial that can't be skipped or revisited,** or no in-game reference.
12. **A cliff at the tutorial's end.** The jump from guided to open play is the biggest churn point.
13. **Playtesting by survey,** or with the wrong audience or setting.
14. **Designing onboarding last-minute and separate from the game** (Extra Credits). Miyamoto built the first level last, but designed it as part of the game.

---

## 5. Applying this to Corsair's opening

The goal is to replace "spawn in a menu town" with an opening where the player gets these within 10 minutes:
- feels like a captain
- completes sail, fight, board, sell, repair and recruit at least once
- leaves port with a self-chosen goal

The town is reached as the answer to a need, and it opens progressively.

### Concept A: "Mutiny Under Fire" (start at sea, mid-action)
- **0:00 Hook.** Cold open on a merchant brig being chased at dusk. The player is the first mate. A two-line backstory (Pirates!-style family debt or revenge hook) plays over the action, not before it.
- **0:30 Steering.** The brutal captain falls to a chain-shot hit. The crew turn to you and you take the wheel. The only lesson is steering, taught by pointing the bow at a gap between two rocks. One prompt, under 8 words. The wind direction is shown by the sails and by spray. No UI yet.
- **2:00 Wind.** Develop: run downwind to gain speed, a lesson discovered because the pursuer falls behind. Twist: the gap narrows and you must turn across the wind and feel the slowdown. Cheap failure: scraping a rock costs hull, not the run.
- **4:00 Broadside, isolated.** A small, slow pursuing sloop pulls alongside. The broadside prompt appears only when the target sits in the firing arc. The enemy is visibly weak and the win is guaranteed (the CoD bot-match idea).
- **6:00 Boarding.** Grapple and a short duel, fixed to an easy difficulty. Hint text appears only if you fail twice (PvZ's adaptive hints).
- **8:00 Reward and need.** You capture the sloop and its cargo of sugar. The crew elect you captain. Your hull is holed, the crew is thin, and you hold cargo you can't eat. The quartermaster says the nearest friendly port pays well for sugar, and a landmark (lighthouse smoke) appears on the horizon. The map opens here for the first time.
- **Teaches:** steering, wind, broadside, boarding, capture.
- **Defers:** trade prices, navigation charts, ship upgrades, reputation.
- **Why it works:**
  - Hook first; the fun arrives within 30 seconds.
  - Each lesson is a mini kishōtenketsu.
  - Black Flag's opening, played as Pirates!'s mutiny.
  - The town is now a destination with three needs attached.

### Concept B: "The Quartermaster's Slate" (the first port as a guided objective)
This follows A, or works as an alternative start that drops you in harbour after a short sail-in.
- **Arrival.** Docking is a short, guided manoeuvre (the harbourmaster's boat leads you in). The town view opens with only three services lit:
  - the **Merchant** (sell the sugar),
  - the **Shipwright** (patch the hull),
  - the **Tavern** (recruit crew).
- **Closed but visible.** The Governor's mansion, the fort, the moneylender and the fence are present but closed, each with a one-line in-world reason: "His Excellency receives captains of standing." This is the lock-before-key tease.
- **The slate.** The quartermaster's slate lists those three tasks in-world (three items, matching working-memory limits). Order is free, which gives the player a small sense of autonomy.
- **Merchant.** Sell sugar. The price screen highlights only sugar. A second, cheap good (rum) is offered for "the next port over", which teaches the buy-low/sell-high idea in a single comparison. The full price table unlocks after the first trade.
- **Shipwright.** One repair button. Upgrades are greyed out with "come back with more coin": the empty-slot motivation.
- **Tavern.** Recruit. The barkeep gives one rumour: a treasure fleet, a lost sister, or a smuggler's cove. This becomes the first self-chosen objective, with map pins. The rumour is the exit hook.
- **After the slate.** On completion the governor sends for you, because word of your prize spread. That opens the Letter of Marque, the first long-term faction goal. Later services unlock on in-world triggers (Darkest Dungeon style).
- **Veterans** can open "Captain's Ledger, skip guidance" at the dock, and every service opens at once.
- **Why it works:**
  - It turns the menu town into a need-driven errand and walks the core loop once.
  - It gives short, mid and long-term goals in one visit (Stardew and Santana).
  - It cuts the first screen from about 7 options to 3.

### Concept C: "Smuggler's Cove" (a bounded starter archipelago, the Great Plateau approach)
- **Start.** You wash ashore after a wreck, with a battered cutter and two crew, in a small, sheltered archipelago ringed by reef and fog (Sea of Thieves' Maiden Voyage island plus BotW's Great Plateau).
- **Everything is visible from the beach:**
  - a fishing village (a mini-port with only a trader and a repair dock),
  - a smoke column from a wreck (salvage),
  - a lighthouse (vantage point: climbing it reveals the archipelago on your chart),
  - a smuggler's lugger anchored near a sandbar (the first fight),
  - a second village on the far island where the same cargo sells for more (trade taught by geography).
- **Free order, gentle pull.** Each landmark gives a clear benefit (BotW's design): the wreck gives cannon, the lighthouse gives the chart, the lugger gives a prize and crew, and the trade run gives coin.
- **Wind lessons by geography.** Reef channels form natural courses. Running aground just bumps you and costs time, never the ship.
- **The exit gate** is diegetic. The reef pass needs a seaworthy ship: repaired hull, cannons fitted, enough crew. When you sail through the fog bank, a short stinger shows the full Caribbean and the first major port, whose governor's letter is your goal.
- **Replayable from the menu** as "Smuggler's Cove" for practice (the Maiden Voyage lesson). Skippable on later careers.
- **Why it works:**
  - Agency and discovery for sandbox fans, with no aimless wandering.
  - It teaches the full loop in a safe space.
  - The graduation moment is earned. Pirates!'s freedom, with a tutorial region built around it.

**Recommendation:** combine A and B as the default opening: about 8 minutes of action at sea, then the slate-guided first port. Offer C as a "practice waters" mode or an alternate start. Prototype A as a greybox first and test it silently with 5 newcomers.

**Suggested FTUE funnel for Corsair:**
1. Game launched
2. First steer (under 30 seconds)
3. First broadside
4. Boarding won
5. Docked
6. Slate tasks 1/2/3
7. Rumour accepted
8. Left port
9. First self-chosen voyage at 30 minutes
10. Session 2 (D1)

Watch the step from 8 to 9 most closely; it's the cliff where guidance ends.

---

## 6. Onboarding review checklist

**Hook and time-to-fun**
- [ ] The first meaningful input comes within 30–60 seconds. No account, settings or long cutscene first.
- [ ] The core fantasy (being a captain at sea) is felt within 5 minutes.
- [ ] The core loop (sail, fight or trade, port, sail) is completed once by about 10 minutes and two or three times by 30.

**Teaching**
- [ ] Every new mechanic is introduced in isolation and safely, then developed, then twisted.
- [ ] No moment introduces more than 3 new concepts. No teaching happens during chaos.
- [ ] Layout and affordance teach first. Prompts are in-world, 8 words or fewer, passive, and adaptive (shown only on mistakes).
- [ ] No false or invisible signifiers. Icons use pirate and real-world conventions.
- [ ] The why comes before the how. Testers can state their objective and its purpose.

**Pull and agency**
- [ ] A clear next action is always available, as a landmark, slate or rumour, not just a quest-log entry.
- [ ] Short, mid and long-term goals are all visible by the end of the first port.
- [ ] There's at least one real choice with a tradeoff in the first 15 minutes.
- [ ] Locks are shown before keys: closed services are visible with reasons.

**Safety**
- [ ] No permanent loss or punishing death in the first 30 minutes. Failure costs seconds.
- [ ] The first fight is beatable by a novice, and its difficulty is hidden.

**Progressive disclosure**
- [ ] The first visit to a hub or town shows 3 or fewer active services, tied to the player's current needs.
- [ ] Each deferred system has a named in-world unlock trigger.
- [ ] Systems aren't locked for so long that veterans get bored. There's a skip option.

**Transition and reference**
- [ ] The tutorial-to-open-play transition hands over a self-chosen goal (no cliff).
- [ ] There's a replayable practice mode and a searchable in-game reference (a captain's log or codex).
- [ ] Spaced reminders fire on the first real need to recall a skill.

**Measurement and testing**
- [ ] The step funnel is instrumented (see above), with a target for each step.
- [ ] 5–8 genuine newcomers have been tested silently and recorded, in a realistic setting.
- [ ] Comprehension questions are used, not "was it clear?". Testers' fixes are logged as symptoms.
- [ ] The test has been re-run after each change to the opening.
