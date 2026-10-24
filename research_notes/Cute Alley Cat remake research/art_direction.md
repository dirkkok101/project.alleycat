# Art Direction for a Cute, Modern-Arcade Alley Cat Remake (Browser / TypeScript, 2026)

Scope note: 17 searches and fetches. Primary sources were reachable for Celeste's game-feel techniques (Maddy Thorson's own article), Spine pricing (official purchase page), the Aseprite licence (official FAQ), and the Xbox Accessibility Guidelines. The cute-design principles come mostly from tutorials. I could not reach the GDC Vault pages or videos for "Juice it or lose it" and "The Art of Screenshake", so their contents rest on secondary write-ups. Wherever a claim has no source, it is marked as an inference or listed as a gap.

## 1. What visual conventions make game art read as "cute"?

### Takeaway
"Cute" comes from a repeatable recipe, not individual taste. The recipe: a big head on a short body, a big forehead and small jaw, large eyes with big pupils, short stubby limbs with no visible joints, soft rounded outlines with no sharp angles, little detail, and light or pastel colours. Movement adds to it, with waddles and a slight helplessness.

### Cited Findings
- Cuteness "is not about beauty, which depends on personal taste... but about some basic patterns and proportions". The listed patterns are a short body, a big head with a large forehead and small lower jaw, large eyes with big pupils, and short arms, legs and fingers without visible joints. — [Packt, "Planning character's look"](https://www.packtpub.com/en-in/learning/how-to-tutorials/planning-characters-look)
- The same source recommends soft, round contours and says hard, irregular contours with pointed angles work against cuteness. It also says the waddle caused by short legs is "very cute". It ties cuteness to a light sense of helplessness that triggers protective instincts. — [Packt](https://www.packtpub.com/en-in/learning/how-to-tutorials/planning-characters-look)
- "Too many details only disrupts and dilutes the overall picture". Simplifying makes the remaining features stand out. — [Envato Tuts+, "The Elements of Cute Character Design"](https://design.tutsplus.com/articles/the-elements-of-cute-character-design--vector-3533)
- Recommends soft, rounded shapes for approachability, exaggerated proportions (big eyes, small snout), and lighter pastel colours, and applies these to a cat game character specifically. — [Playgama blog (low-authority, generic)](https://playgama.com/blog/general/how-can-i-design-and-animate-a-cute-cat-character-for-my-games-art-style/)
- Construct has a step-by-step tutorial on designing a cute game character. — [Construct.net, "How to game art #4 – Designing a cute character"](https://construct.net/en/tutorials/game-art-designing-cute-930)

### Inferences
- Applied to the cat: a head about 40–50% of total sprite height (chibi range). Big eyes with a single highlight. Small triangular ears with rounded tips. A tail that reads as a separate shape in silhouette. Paws as rounded nubs with no visible knees. Keep the black-cat identity, but render the "black" as a very dark blue or purple so the face and eyes can be shaded, and give it a contrasting rim or outline so it doesn't vanish against night backgrounds.
- Make enemies "cute-grumpy" rather than menacing: a round bulldog, a broom-wielding housewife drawn as a soft silhouette. This keeps the threat readable and the tone consistent. Little Kitty, Big City's faceless humans (below) show one way to depersonalise human obstacles.
- I found no GDC talk on cuteness itself. The sources here are craft tutorials, so treat the rules as heuristics, not research.

### Gaps
- I found no GDC Vault talk specifically on "designing cute". An academic "baby schema" (Kindchenschema, Lorenz) citation was not retrieved, though it is the usual theory behind the heuristics above.

## 2. Reference games and what to borrow from each

### Takeaway
Use Celeste as the game-feel benchmark: its 320x180 base and forgiveness mechanics are documented. Little Kitty, Big City is the closest modern "cute cat in a human city" reference. The rest of the list (Kirby, Neko Atsume, Cat Quest, Pac-Man CE/99, Pico Park) are reasonable references, but I did not retrieve sources on their art direction.

### Cited Findings
- **Celeste**: runs at 320x180. Wall jumps work from 2 px away, "a quarter of a tile". Its forgiveness list: coyote time, jump buffering, halved gravity at the jump peak while jump is held, jump and dash corner correction, semi-solid popping, platform-momentum storage, a wider super-wall-jump window (~5 px, author's estimate), and stamina refunds. — [Maddy Thorson, "Celeste & Forgiveness"](https://maddymakesgames.com/articles/celeste_and_forgiveness/index.html)
- Thorson said they did not invent these techniques. — [GameSpot coverage](https://www.gamespot.com/articles/celeste-dev-explains-how-they-made-their-game-feel/1100-6474775/); [Blizzard Watch](https://blizzardwatch.com/2020/03/13/celeste-developer-game-feel/)
- **Little Kitty, Big City** (Double Dagger Studio): humans have no faces so the world is seen from the cat's point of view. The director, Matt Wood (ex-Valve), said cats treat people more as objects. — [GoNintendo](https://gonintendo.com/contents/22933-little-kitty-big-city-dev-explains-the-game-s-faceless-humans); [Wikipedia](https://en.wikipedia.org/wiki/Little_Kitty,_Big_City)
- A preview credits its "simple but effective aesthetic" and "cute and lively animations" for its charm. — [MobileSyrup preview](https://mobilesyrup.com/2023/06/10/little-kitty-big-city-preview/)
- A tiny team: one animator (Micah Breitweiser) did all the animation, and Wood did much of the art, modelling and level design. — [Little Kitty Big City, About us](https://www.littlekittybigcity.com/about-us); [Pocket Tactics interview](https://www.pockettactics.com/little-kitty-big-city/interview)

### Inferences (unsourced; based on general knowledge of these games, for the writer to frame as suggestions)
- **Kirby**: a round body, minimal features and a strong single colour give an instantly readable silhouette at tiny sizes. Borrow the "round blob plus expressive squash" approach.
- **Neko Atsume**: flat colours, thin outlines and lots of cat-specific idle poses (loafing, grooming, stretching). Borrow for idle animations and room mini-game reactions.
- **Cat Quest**: bright, flat, storybook vector style with heavy cat puns in the UI. Borrow for UI tone and the vector option.
- **Pac-Man Championship Edition / 99**: neon on black, trails, speed-up feedback and combo pops. This is the strongest model for a "modern arcade" look built on the original's black CGA background: bright glow accents on dark backgrounds.
- **Pico Park**: extremely simple shapes and pastel colours, with readability through flat colour coding. Shows how little detail is needed.
- **Stray**: the opposite tone (realistic, moody). Useful only for cat body-language reference, not style.

### Gaps
- I retrieved no primary interviews on art direction for Cat Quest, Neko Atsume, Kirby, Pac-Man CE or Pico Park. The bullets above are not source-backed.

## 3. Pixel art vs vector/hand-drawn vs 3D-to-2D; base resolution

### Takeaway
Default: pixel art at 320x180 (16:9), integer-scaled. That is 6x to 1080p, Celeste's resolution, and closest in spirit to the original 320x200. If the team wants more detail and room for UI, use 640x360 (3x to 1080p). Hi-res vector or hand-drawn art (rendered at device DPI) is the alternative for a "Cat Quest / Neko Atsume" look, at a higher per-frame cost.

### Cited Findings
- 320x180 scales 6x to 1080p and integer-scales "perfectly without relying on black borders or weird stretching". The downside is that it can feel "claustrophobic". It suits platformers where the player sprite is small and the camera scrolls. — [itch.io post](https://itch.io/post/9908179); [Shweep devlog, "Resolving Resolutions"](https://shweep.itch.io/the-machine-that-breathes/devlog/114161/resolving-resolutions)
- 640x360 scales 3x to 1080p and leaves room for more detail. 480x270 (4x) and 384x216 (5x) are other integer options. 480x270 "often doesn't FEEL like a retro resolution unless the characters are enormous". — [Shweep devlog](https://shweep.itch.io/the-machine-that-breathes/devlog/114161/resolving-resolutions); [rpgmaker.net blog](https://rpgmaker.net/games/11197/blog/22259/?&sort=date)
- Celeste uses 320x180. — [Celeste & Forgiveness](https://maddymakesgames.com/articles/celeste_and_forgiveness/index.html)
- General discussion of pixel-perfect scaling pitfalls. — [Godot forum, "Pixel Perfect scaling"](https://forum.godotengine.org/t/pixel-perfect-scaling/16173); [SDL discourse](https://discourse.libsdl.org/t/scaling-resolution-and-pixel-art/21342)

### Inferences
- The original's 320x200 at 16:10 maps naturally to 320x180: same width, 20 rows shorter. Fence, clothesline and window layouts can be ported nearly 1:1 by trimming sky.
- For the browser: render to a fixed low-res offscreen canvas, then scale up by the largest integer that fits, letterboxing the remainder. Set `image-rendering: pixelated` and disable smoothing. Under PixiJS, set the texture scale mode to nearest. Do the integer scaling with `devicePixelRatio` in mind so HiDPI phones don't get fractional blur.
- A hybrid works well: pixel-art world and sprites, with UI text and score pops on a separate hi-res layer. This keeps menus readable and allows smooth tweened UI.
- 3D rendered to 2D (e.g. Blender to sprite sheets) gives consistent rotations but tends toward a "pre-rendered" look that fights cuteness. It also adds a pipeline step. Not recommended for a solo dev unless they're already a 3D artist.
- Vector or skeletal (Spine/DragonBones) suits a hi-res cartoon look. It saves frame-by-frame drawing, but rigged "paper doll" motion can look stiff without care.

### Gaps
- I found no browser-specific (WebGL/Canvas) performance benchmarks comparing pixel art with vector or skeletal art.

## 4. Keeping a CGA homage

### Takeaway
Use CGA palette 1 high intensity (black, light cyan, light magenta, white) as an accent and brand palette: UI frames, title screen, highlights, the cat's eye glint. Also offer an unlockable "CGA Mode" that posterises the whole game to the 4 colours. Don't use it as the main palette, because 4 colours limit cute shading and accessibility.

### Cited Findings
- CGA palette 1 with the intensity bit set = background (usually black), light cyan, light magenta, bright white. — [Vogons forum](https://vogons.org/viewtopic.php?p=21953); [ModdingWiki, CGA Palette](https://moddingwiki.shikadi.net/wiki/CGA_Palette)
- A DOSBox config posted on Vogons uses #000000, #00FFFF, #FF00FF, #FFFFFF for that palette. — [Vogons](https://www.vogons.org/viewtopic.php?p=584316)
- Background: [Wikipedia, Color Graphics Adapter](https://en.wikipedia.org/wiki/Color_Graphics_Adapter)

### Inferences
- The commonly cited RGBI values for the real hardware's light cyan and light magenta are #55FFFF and #FF55FF, not the pure #00FFFF/#FF00FF in the DOSBox config. **Not verified in this session.** Check the Wikipedia CGA page before you fix the hex values.
- Implementation: CGA mode is a cheap full-screen fragment shader or palette-lookup filter. It maps luminance and hue to the nearest of the 4 colours, optionally with ordered dithering. It could unlock after finishing the game, or be on by default in a "1984" attract-mode loop.
- Build the modern palette so the CGA colours sit inside it: night sky in deep navy or violet, cyan and magenta neon signs and windows, warm pastels for interiors. The main palette can then be a curated Lospec palette with 16–32 colours.

### Gaps
- I didn't retrieve a Lospec CGA palette page or a specific recommended Lospec palette for the main game. The writer should treat any specific palette name as a suggestion to check.

## 5. Animation and juice

### Takeaway
Add juice in layers on top of tight, forgiving controls. For controls: coyote time, jump buffer and variable jump height, Celeste-style. For visuals: squash and stretch on jump and land, anticipation frames, dust particles, small screen shake on impacts, brief hit-stop when caught or scoring, parallax skyline layers, a day/night cycle, and tweened UI pops. The canonical sources are the "Juice it or lose it" talk (Jonasson & Purho, 2012) and "The Art of Screenshake" (Jan Willem Nijman, Vlambeer, about 2013).

### Cited Findings
- "Juice it or lose it" was given by Martin Jonasson and Petri Purho. Sources differ on the first venue: one says the Nordic Game Jam (May 2012), another the Nordic Game Conference 2012. It was presented at GDC Europe 2012 in the Independent Games Summit closing session. A Breakout clone was "juiced" live by tweening, stretching and squeezing objects. — [Game Developer, "Is your game juicy enough?"](https://www.gamedeveloper.com/design/video-is-your-game-juicy-enough-); [Game Developer, GDC Europe 2012 top sessions](https://www.gamedeveloper.com/business/gdc-europe-2012-details-the-top-sessions-for-next-week-s-show); [Juicy Break (itch.io)](https://crcdng.itch.io/juicy-break)
- The talk is widely cited in academic game-feel work. — [AAAI AIIDE paper](https://ojs.aaai.org/index.php/AIIDE/article/download/18889/18654/22655)
- Nijman gave "The Art of Screen Shake" about a year after "Juice it or lose it". In a Nuclear Throne breakdown, he shows camera kick and screenshake values for a single pistol shot, with the shake decaying quickly. — [infovore.org, "Making Game Feel"](https://infovore.org/?p=5275)
- Hit-stop: pause the game for a few milliseconds on a big hit so the blow "lands". — [Wayline, Game Feel & Juice lesson](https://www.wayline.io/learn/game-feel/1)
- A basic screen-shake implementation: random camera offsets with a minimum jump distance, fading out over time. — [Oregon State student blog](https://blogs.oregonstate.edu/petekevi/?p=22)
- JS-specific juiciness walkthrough. — [Code inComplete, "JavaScript game foundations: juiciness"](https://codeincomplete.com/articles/javascript-game-foundations-juiciness)
- Celeste's control-side forgiveness: coyote time, jump buffer, half gravity at the apex while jump is held, corner correction, and the rest of the list in section 2. — [Celeste & Forgiveness](https://maddymakesgames.com/articles/celeste_and_forgiveness/index.html)
- Pedro Medeiros (Saint11, Celeste/TowerFall artist) has a free GIF tutorial series that includes "#36 Squash and stretch" and "#35 Motion blur". — [Creative Bloq](https://creativebloq.com/news/artist-makes-animated-gif-tutorials-to-teach-you-pixel-art); [community index](https://ui.lemm.ee/post/2976406) (canonical home: saint11.art / Patreon, not fetched)

### Inferences
- A concrete juice checklist for Alley Cat:
  - **Jump**: 1–2 crouch anticipation frames, a stretch on take-off, a squash on landing, and a dust puff.
  - **Fence wobble**: a tween spring on the fence top when landed on.
  - **Clothesline**: the line sags and bounces under the cat.
  - **Windows**: open with a "pop" tween, plus a sparkle telegraphing which window is enterable.
  - **Mouse catch**: 50–80 ms hit-stop, a score number that scales up 1.3x and settles, and a small screen shake.
  - **Being hit by a thrown shoe or caught by the dog**: a bigger shake, a flash, and a cartoon star particles burst.
  - **Background**: 3–4 parallax layers (far skyline, near buildings, fence row, foreground).
  - **Day/night**: palette-shifted sky gradient plus window lights switching on.
  - **UI**: buttons bounce on hover or press.
- Always offer a "reduce screen shake / flashing" toggle (see section 7).
- In TypeScript: tweening via GSAP, or the engine's own tweens (Phaser has them built in). Particles via the engine's emitter. Shake via camera offset with exponential decay. Specific library versions were not verified in this session.

### Gaps
- I couldn't fetch the GDC Vault videos for either talk, so the contents beyond the summaries above (e.g. Nijman's full list of tricks) are unverified.
- I found no source text for Saint11's squash-and-stretch GIF; only its existence is confirmed.

## 6. Asset pipeline and tools; asset packs and licences; AI art

### Takeaway
Default solo-dev pipeline: draw and animate in Aseprite ($19.99, source-available EULA). Export sprite sheets plus JSON from Aseprite directly, or pack them with a free atlas packer. Load them as atlases in PixiJS or Phaser. Free alternatives: LibreSprite (the pre-2016 GPL fork of Aseprite) and Pixelorama. Krita for painted backgrounds. Inkscape or Figma for vector UI. Spine ($69 Essential / $369 Pro, one-time) only if you choose a skeletal hi-res style. Kenney assets are CC0 and fine for prototyping. AI-generated art carries real copyright and platform-disclosure issues.

### Cited Findings
- **Aseprite** is a proprietary, source-available pixel-art editor. $19.99 is the minimum price for prebuilt binaries. You can compile the source for personal use, but not redistribute it. It was GPLv2 until v1.1.8 (August 2016), then moved to an EULA. — [Aseprite FAQ](https://aseprite.org/faq/); [Wikipedia, Aseprite](https://en.wikipedia.org/wiki/Aseprite)
- **LibreSprite** is the open-source fork created after Aseprite's licence change. Wikipedia tags this "citation needed". — [Wikipedia](https://en.wikipedia.org/wiki/Aseprite)
- **Pixelorama** is free and open source; that source is a user review, so the licence details were not verified. — [AlternativeTo](https://www.alternativeto.net/software/aseprite/about/)
- **Spine**: Essential $69 (listed down from $99), Professional $369 (from $439). Both are one-time purchases with free updates. Essential has no meshes; you can upgrade for the difference in price. Enterprise is required for businesses with ≥$500k annual revenue and is renewed yearly. Licences are per named person. The education licence is not for commercial use. — [Esoteric Software, Purchase Spine](https://esotericsoftware.com/spine-purchase); [Esoteric forum](https://esotericsoftware.com/forum/d/29824-spine-43--2d-animation-buy-form)
- **Kenney**: over 30,000 assets under CC0 1.0 Universal. Free for personal and commercial use. Attribution not required. Paying gives access to source files. — [Defold asset page](https://defold.com/assets/kenney); [Godot forum](https://forum.godotengine.org/t/kenneys-assets-free-and-creative-commons-cc0/36658); [itch.io post](https://itch.io/post/9879907)
- **AI art, copyright**: The US Copyright Office's Part 2 report (Jan 29, 2025) says AI outputs are protectable only where a human author has determined sufficient expressive elements, and that prompts alone are insufficient. Human modifications or arrangements can qualify, assessed case by case. — [Promise Legal summary (secondary, law-firm blog)](https://blog.promise.legal/ai-game-assets-what-studios-own-2026/); [Clyde & Co](https://www.clydeco.com/insights/2025/07/ai-generated-content-in-gaming)
- Thaler v. Perlmutter (D.C. Cir.) held that human authorship is required for copyright. — [Promise Legal](https://blog.promise.legal/ai-game-assets-copyright-steam-disclosure-2026/)
- **Steam AI disclosure**: Steam requires disclosure. One secondary source reports about 8,000 games (~7% of the library) disclosing generative AI use, and some games delisted or forced to change content after backlash. Figures not verified against Valve. — [Promise Legal](https://blog.promise.legal/ai-game-assets-copyright-steam-disclosure-2026/)

### Inferences
- Recommended pipeline:
  1. Prototype with Kenney CC0 placeholder art.
  2. Lock the cat's proportions and palette on a single style sheet: turnaround, expression sheet, 4–6 key poses.
  3. Animate in Aseprite with tags per animation (idle, run, jump, land, climb, hit, celebrate).
  4. Use Aseprite's sprite sheet export with JSON (array or hash) and tags, which PixiJS and Phaser can consume. Use TexturePacker or free packers only if you need multi-sheet packing across many sources.
  5. Keep source `.aseprite` files in Git LFS.
  6. Use a fixed palette file (`.gpl` or `.hex`) shared across all tools.
- itch.io "cute cat" packs vary in licence per pack (CC0, CC-BY, or custom "no resale / no AI training" terms). Read each pack's licence page, and keep a `CREDITS` or licence ledger. I did not check any specific pack's licence.
- AI art, presented neutrally:
  - In favour: fast concepting and moodboards, and exploring a lot of variation for a solo dev.
  - Against: weak copyright protection for unmodified output; Steam disclosure obligations and possible player backlash; it's hard to get frame-to-frame consistency in animation and true pixel-grid output; and the ethical and legal debates over training data are ongoing.
  - Common middle ground: AI only for reference and ideation, with all shipped assets drawn by hand, plus process documentation (sketches, layer history).

### Gaps
- The current Pixelorama licence (believed MIT) and LibreSprite's (believed GPLv2) were not confirmed from primary sources.
- I didn't retrieve DragonBones' status (development stalled per community reports; unverified) or current TexturePacker pricing.
- I didn't fetch Valve's own AI-content policy text.

## 7. Accessibility

### Takeaway
Never carry information by colour alone. Double-code with shape, icon, outline or motion. Keep the cat's silhouette readable against every background (rim light or outline). Offer toggles for screen shake, flashing, and optionally the colours of key elements.

### Cited Findings
- The Xbox Accessibility Guidelines (XAG 103) say to aim for no cue relying on colour alone. Where that can't be avoided, let players choose the colours of individual elements. — [Xbox Accessibility Guideline 103](https://devdocs.xbox.com/gaming/accessibility/xbox-accessibility-guidelines/103)
- "Ensure no essential information is conveyed by a colour alone; reinforce with a symbol or offer a choice of alternative colours." — [Webbie, Guidelines for accessible video games](https://www.webbie.org.uk/blog/?p=115)
- Ian Hamilton: avoid relying on colour difference alone; use "double-coding". — [Colorblind Games](https://colorblindgames.com/2021/08/02/colorblind-gaming-101-some-solutions)
- Identify everywhere colour carries meaning and pair it with an icon, image or border. Consider a colour-blind mode letting players choose key-element colours. — [Can I Play That?](https://caniplaythat.com/?p=8897)
- A single alternative palette often addresses only red-green deficiency. Colour-only status tints are bugs. — [Bugnet, QA testing for colorblind modes](https://bugnet.io/blog/qa-testing-for-colorblind-modes)
- 5–8% of men and ~0.5% of women have some degree of colour blindness. — [IGDA GA-SIG, On Visual Disabilities](https://igda-gasig.org/?p=3406)

### Inferences
- **Black cat vs night scene risk**: give the cat a 1 px light outline or rim and bright eyes. Check it with a greyscale and colour-blind simulation pass (e.g. Aseprite or Krita colour-blind filters, or browser DevTools vision-deficiency emulation).
- **Cyan vs magenta CGA accents**: these are distinguishable for most colour-vision deficiencies by luminance, but still pair them with shape. For example, enterable windows get a sparkle or arrow, not just a colour.
- **Mini-games** (mice, fish, birds): make targets distinct by shape and motion, not hue.
- Add a "reduce motion" setting that scales screen shake and flashes to zero, and a high-contrast outline mode.

### Gaps
- I didn't retrieve the gameaccessibilityguidelines.com page directly. Flash and photosensitivity thresholds (e.g. WCAG's three flashes per second) were not fetched this session.
