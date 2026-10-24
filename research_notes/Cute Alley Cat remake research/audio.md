# Audio Direction and Technology for a Cute Modern-Arcade Alley Cat Remake

Research date: 2026-10-24. About 20 search and fetch calls. Several primary pages (the MobyGames trivia page, the VGMPF Alley Cat page, the Tone.js API docs) returned 403 or 404, so some points rest on secondary sources. These are flagged where they come up.

## Musical direction, references, and how to nod to the original tunes

### Takeaway
I could not confirm the brief's premise that the original Alley Cat used well-known public-domain tunes. The only sourced music credit is an original title theme by Bill Williams. The remake should nod to that theme only after the rights are checked, or quote genuinely public-domain classics. A safer route is a new "Alley Cat"-flavoured motif. For the style, references point to simple, singable melodies (the Kirby approach) over fast, electronic arcade energy (Pac-Man CE DX).

### Cited Findings
- **Release history:** Alley Cat was developed by Synapse Software for the Atari 8-bit (1983) and the IBM PC/PCjr (1984, published by IBM). Bill Williams is credited as both designer and composer — [Wikipedia: Alley Cat (video game)](https://en.wikipedia.org/wiki/Alley_Cat_(video_game)); [Internet Archive DOS listing](https://archive.org/details/msdos_Alley_Cat_1984)
- **Theme recording:** Wikipedia hosts an audio file captioned "Theme song, as played through the IBM PC speaker". It does not say what the melody is, and the gameplay section has no citations — [Wikipedia](https://en.wikipedia.org/wiki/Alley_Cat_(video_game))
- **PCjr rip:** The VGMRips pack lists exactly one song, "Title Screen" (0:52 long with a 0:51 loop). It credits the music to Bill Williams and lists the chip as SN76496 (PCjr) — [VGMRips: Alley Cat (IBM PCjr)](https://vgmrips.net/packs/pack/alley-cat-ibm-pcjr)
- **Atari SFX:** A forum post says Bill Williams himself programmed the Atari version's sound effects (barking, meowing, dog and cat fight, kisses and complaints) — reported via [AtariAge forums](https://atariage.com/forums/tags/synth/) (forum post, secondary)
- **Williams background:** His Atari 8-bit and Amiga games are noted for innovative sound and music, and he studied music in college — [Wikipedia: Bill Williams (game designer)](https://en.wikipedia.org/wiki/Bill_Williams_(game_designer))
- **Similarly named song:** "Alley Cat" (Bent Fabric, 1962) is a separate commercial song with the same title. I found no source linking it to the Synapse game — [Wikipedia: Alley Cat (song)](https://en.wikipedia.org/wiki/Alley_Cat_(song))
- **Public-domain options:** Mendelssohn's Wedding March (1842, from *A Midsummer Night's Dream*) is public domain and has appeared in several DOS-era games, including King's Quest II. It is a natural cue for the "love room" — [VGMPF: Wedding March](https://www.vgmpf.com/Wiki/index.php?title=Wedding_March); [Wikipedia: Wedding March (Mendelssohn)](https://en.wikipedia.org/wiki/Wedding_March_(Mendelssohn))
- **Kirby reference:** Jun Ishikawa, with Hirokazu Ando, defined the Kirby sound. On the Game Boy he "intentionally wrote simple melodies and chords," because complex chords sounded bad on its speaker — [Wikipedia: Jun Ishikawa](https://en.wikipedia.org/wiki/Jun_Ishikawa_(composer)); [Retro XP: music of Kirby's Dream Land 3](https://retroxp.substack.com/p/the-music-of-kirbys-dream-land-3)
- **Pac-Man CE DX reference:** Its music has a "fast paced, techno feel," and an extended arrangement of "Entrance" was made faster to suit the game's frenetic pace. Composer credits disagree between sources: Wikipedia lists Hiroshi Okubo, Hiroyuki Kawada and Junko Ozawa, while Pixelated Audio credits Taku Inoue for "Entrance (DX)" — [Wikipedia: PMCE DX](https://en.wikipedia.org/wiki/Pac-Man_Championship_Edition_DX); [Pixelated Audio PA153](https://pixelatedaudio.com/pacman-ce-dx/); [DekuDeals](https://www.dekudeals.com/items/pac-man-championship-edition-dx-reentrance-bgm)

### Inferences
- **Treat the theme as copyrighted.** The title theme appears to be an original Williams composition, so it is not public domain. A 1983/84 work is still under copyright, and the rights probably sit with Williams or Synapse's successors. Quoting the melody would need permission. An "inspired-by" motif (a jaunty swung shuffle in a similar mood that does not copy the melody) avoids this.
- **Do not borrow the Bent Fabric song.** It is commercial (1962) and unrelated to the game.
- **Classical pieces are fine, recordings are not.** Pre-1900 compositions such as the Mendelssohn Wedding March, Brahms' Lullaby or Offenbach's can-can are public domain as compositions. Any specific recording or arrangement may not be, so perform or arrange them yourself.
- **Suggested style (my synthesis, not sourced):** A "chiptune-hybrid kawaii pop" sound:
  - Square or pulse lead and a PSG-style arpeggio layer as a deliberate nod to the PC speaker.
  - Sitting over warm modern parts: electric piano, slap or synth bass, tight funk drums, glockenspiel or marimba, and light future-funk sidechain.
  - Tempo: alley theme around 120–135 BPM with a swing feel. Mini-games 140–160 BPM. Love room a slower waltz or 6/8, 90–100 BPM. Major keys (F, Bb, C) suit a bright, cute tone.
  - Keep melodies simple and singable, per Ishikawa, because small phone speakers punish dense chords too.
- **One-voice signature:** A PC-speaker-style single square wave could serve as the title-screen "retro mode" or a stinger, linking the remake to the 1984 original.

### Gaps
- **Track list unknown.** I could not get the full original track list (love room, game-over and room jingles). The MobyGames trivia page returned 403, and there seems to be no VGMPF Alley Cat page. Whether the DOS version quoted classical pieces (for example in the love room) is unverified. Before committing to a nod, listen to the Internet Archive DOS build ([archive.org](https://archive.org/details/msdos_Alley_Cat_1984)) and identify each cue by ear.
- **No primary interviews.** I found no sourced interviews on how the Kirby, Neko Atsume or Animal Crossing soundtracks were made. The style descriptors above are my synthesis.

## Adaptive and dynamic music design and its browser implementation

### Takeaway
The game suits a hybrid of three techniques:
- **Horizontal resequencing:** a separate cue for each scene (title, alley, each room, love room, game over).
- **Vertical layering:** stems added for intensity, such as when a dog appears or the timer runs low.
- **Quantized stingers:** short cues for events.

All of this can be built on one Web Audio `AudioContext` that schedules looping `AudioBufferSourceNode`s, each through its own `GainNode`, on the context clock. Alternatively, Tone.js's Transport handles the bar-quantized scheduling.

### Cited Findings
- **Buffers vs streaming:** MDN says media elements are "more common... when you are working with full-length tracks", while decoded buffers suit "shorter, more sample-like tracks". It notes that buffers give "more precision, and more precise manipulation" — [MDN: Web Audio API best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices)
- **Fades on the audio clock:** For timing and scheduling, MDN says "it's best to stick with the AudioParam methods for setting values" (for example `gain.setValueAtTime(...)`) rather than setting `.value` — [MDN best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices)
- **Howler.js streaming:** In Howler.js, `html5: true` forces HTML5 Audio. It is "intended for large audio files" so you don't have to wait for a full download and decode — [howler on npm](https://npmjs.com/package/howler)

### Inferences
- **Layering:**
  - Author each scene loop as 2–4 time-aligned stems of identical length: base, melody, percussion and "danger".
  - Start every stem at the same `ctx.currentTime + offset` with `loop = true`.
  - Mix layers in and out with `gain.linearRampToValueAtTime` over about 0.5–1 bar. Use decoded buffers (not `<audio>`), because sample-accurate sync between stems needs them.
  - Keep music files short (30–60 s loops at 96–128 kbps), so decoding them into buffers is acceptable even on mobile.
- **Transitions:** For horizontal changes, compute the next bar boundary from the context clock and BPM, then crossfade or schedule the new cue there. Tone.js offers this out of the box (Transport time notation such as "@1m"), but I could not verify the current docs URL.
- **Timer pressure, two options:**
  - Change `playbackRate` on the sources. Simple, but it raises pitch, which can be charmingly "cute-arcade".
  - Pre-render "hurry" variants at +10–15% tempo and switch at a bar line. This is the classic "hurry up" technique, cf. Pac-Man CE DX's tempo-driven energy.
  - A pitch-preserving tempo change in real time needs a time-stretch library and is probably not worth it.
- **Stingers:** Room clear, catch, extra life, game over and the love-room heart.
  - Play them as one-shots, optionally quantized to the next beat.
  - Duck the music bus by about 6–10 dB during the stinger with a gain ramp.
  - Write stingers in the same key as the scene music so they fit any moment.
- **Suggested scene map:**
  - Title: a full theme with the retro-mode nod.
  - Alley: base groove plus layers that rise with the number of hazards on screen.
  - Each room: a short loop variant of the main motif, each with its own instrument colour (fishbowl = bubbly marimba, mice/cheese = pizzicato, birdcage = flute or whistle, bookshelf/spider = bassoon "sneaky" line).
  - Love room: a waltz, or an arranged public-domain classical quote.
  - Game over: a 3–5 s jingle that does not loop.

### Gaps
- **No primary talks found.** I could not retrieve GDC talks on adaptive music specifically for Kirby or Pac-Man CE.
- **Tone.js docs not verified.** The TransportClass page I tried returned 404, so check the current API names (`Transport.bpm.rampTo`, `Tone.start()`, and the newer `getTransport()`) against tonejs.github.io.

## SFX list, design tools and variation

### Takeaway
An arcade-style cat game needs about 30–40 short SFX. Most can be built quickly in jsfxr (Unlicense, with commercial use allowed). "Organic" sounds such as meows, barks and splashes are better layered from CC0 recordings (Kenney, Freesound CC0, Sonniss) under a synth transient. Random pitch and volume variation of a few percent per play, plus 2–4 variants per sound, prevents repetition fatigue.

### Cited Findings
- **jsfxr:**
  - What it is: a browser JavaScript port of DrPetter's sfxr.
  - Presets: Pickup/coin, Laser/shoot, Explosion, Powerup, Hit/hurt, Jump, Click, Blip/select, Synth, Tone, Mutate and Random.
  - Export: WAV (44k/22k/11k/8k, 8- or 16-bit) and JSON on the free version. MP3/OGG export is on the Pro version.
  - Licence and runtime: the source is under the Unlicense, the free version "allows unrestricted commercial use," and it can be used as a JS library to render sounds at runtime.
  — [sfxr.me (jsfxr)](https://sfxr.me/)
- **BeepBox:** Browser-based, MIT-licensed source, with songs stored in the URL and MP3 export via lamejs. The README says nothing about who owns the songs you make — [GitHub: johnnesky/beepbox](https://github.com/johnnesky/beepbox)
- **Original game's SFX:** The Atari original had barking, meowing, dog/cat fight, kisses and complaints, so the remake should keep these signature sounds — [AtariAge forums (secondary)](https://atariage.com/forums/tags/synth/)

### Inferences
- **SFX checklist, my synthesis:**
  - Cat: jump (rising chirp), land (soft thump), wall/fence grab, climb tick, fall whoosh, hit/"bonk", short meow (2–4 variants), happy purr/trill, hurt yowl.
  - Alley: trash-can lid clang, window open/close, thrown object (boot, bottle) whoosh and impact, dog bark (2–3 variants) and growl, dog/cat fight "dust cloud" loop, sweeping broom swipe, a cat-girlfriend "mrrp".
  - Rooms: mouse squeak (variants), mouse catch "pop", cheese nibble, fish splash/plop, fish catch, water slosh, electric eel zap, bird flutter/tweet, birdcage swing, spider/bookshelf hit, milk lap, dog-bowl event, room-exit portal.
  - Love room: heart collect, kiss "smooch", gift/obstacle hit, Cupid shoot.
  - Meta: extra life jingle, combo tick with rising pitch per combo step, score count-up blip, timer warning tick (speeding up), level clear, game over.
  - UI: hover, confirm, back, pause/unpause (with a low-pass on the music), toggle, error.
- **Design approach:**
  - Use jsfxr for transients and blips.
  - Use BeepBox or JummBox for jingles and stingers. Bosca Ceoil, LMMS (free), or a DAW (FL Studio, Ableton) with free synths (Vital, Surge XT) for the full music.
  - Layer synth transients over a recorded tail for organic sounds (cartoon meow = recorded meow + pitch-up + short square-wave chirp).
- **Variation in code:** For each play set `source.playbackRate.value = 1 + (Math.random()*2-1)*0.05` (±5%) and a random gain of ±2 dB, and rotate through variants without repeating the last one. Have the combo SFX climb in semitones (`playbackRate = 2 ** (step/12)`).

### Gaps
- **Tool sites not fetched:** ChipTone, Bfxr, Bosca Ceoil, LMMS, Vital, Surge and JummBox were not checked this session. Their names and free status are from general knowledge, so verify their licences and features before citing them.

## Sourcing and licensing

### Takeaway
- **Safe without attribution:** CC0 sources (Kenney, Freesound CC0, OpenGameArt CC0) and the Sonniss GDC bundles.
- **Fine with credits:** CC-BY and OGA-BY.
- **Avoid:** CC-BY-NC and Sampling+ for anything monetised, and CC-BY-SA unless you accept share-alike on the derivative.
- **AI music (Suno/Udio):** The legal ground moved in late 2025 with label settlements and licensing deals. Commercial rights depend on the tier and are framed as granted rights, not clear ownership. Check the current terms before use.

### Cited Findings
- **Kenney:** Assets are "public domain licensed (CC0)," usable commercially, and "Attribution is not required." Kenney asks that its logo not be used — [Kenney support](https://kenney.nl/support). The audio packs are Casino Audio, Sci-fi Sounds, Interface Sounds, Impact Sounds, Voiceover Pack (Fighter), Voiceover Pack, Music Jingles, RPG Audio, Digital Audio and UI Audio — [Kenney audio category](https://kenney.nl/assets/category:Audio)
- **Freesound:**
  - Licences: CC0, CC-BY and CC-BY-NC. The legacy Sampling+ licence is retired and treated as roughly NC.
  - CC0: "you could even sell the sound... but you can't claim you are the author."
  - CC-BY: "always mention the original creators."
  - CC-BY-NC: "you can't earn any money with the piece of work you create."
  - A proper credit names each sound, its author, a link and the licence.
  — [Freesound FAQ](https://freesound.org/help/faq/)
- **OpenGameArt:**
  - Licences: CC0, CC-BY 3.0/4.0, CC-BY-SA 3.0/4.0, OGA-BY 3.0/4.0 and GPL 2.0/3.0. Assets may be used "Even in commercial projects."
  - CC-BY and CC-BY-SA bar DRM distribution; OGA-BY drops that.
  - CC-BY-SA makes derivatives share-alike.
  - Credits should give the asset name, author, licence, URL, and any changes made.
  — [OpenGameArt FAQ](https://opengameart.org/content/faq)
- **Sonniss GDC bundles:**
  - Terms: "royalty-free and commercially usable. No attribution is required... unlimited number of projects".
  - From the 2024 licence, the files may not be used to train AI models or be claimed as your own.
  - The 2026 bundle is 7.47 GB from 17 vendors.
  - These terms come from secondary reports, so check the licence at sonniss.com — [GameDev.tv community (2018)](https://community.gamedev.tv/t/30gb-of-high-quality-royalty-free-sound-effects-the-sonniss-gameaudiogdc-bundle-2018/63406); [GameFromScratch (2024)](https://gamefromscratch.com/sonniss-27-5gb-sound-effect-giveaway-at-gdc-2024/); [rekkerd.org (2026)](https://rekkerd.org/sonniss-releases-gdc-2026-game-audio-bundle/)
- **Udio:**
  - Warner Music Group (WMG) settled with Udio in November 2025, including a licensing deal for a new AI platform launching in 2026. UMG settled with Udio about a month earlier.
  - As of late 2025, Sony was reported as still litigating.
  — [Music Business Worldwide (WMG–Udio)](https://www.musicbusinessworldwide.com/warner-music-settles-udio-lawsuit-strikes-licensing-deal-with-ai-platform); [MBW (UMG–Udio)](https://www.musicbusinessworldwide.com/universal-music-settles-udio-lawsuit-strikes-deal-for-licensed-ai-music-platform); [WinBuzzer](https://winbuzzer.com/2025/11/20/warner-music-group-and-udio-settle-copyright-lawsuit-as-suno-raises-250m-to-fight-on-xcxwbn/)
- **Suno:**
  - WMG settled with Suno, and Suno is due to launch licensed models in 2026 that replace its current ones.
  - Other majors and collecting societies (Koda, GEMA) reportedly continued their claims.
  — [MarketScreener/Reuters](https://uk.marketscreener.com/news/warner-music-group-settles-copyright-case-with-suno-for-licensed-ai-music-ce7d5ed2db8bff22); [Decrypt](https://decrypt.co/349360/warner-music-moves-from-litigation-to-licensing-with-udio)
- **AI commercial use (secondary explainer, June 2026, not legal advice):**
  - Suno's free tier is personal use only; paid tiers grant commercial rights.
  - After the WMG deal, the terms moved from "ownership" toward granted commercial rights.
  - A copyright-vesting disclaimer means the protection you hold may be thin.
  — [Dubspot: AI Music Licensing Explained (2026)](https://blog.dubspot.com/ai-music-licensing-explained-2026)

### Inferences
- **Keep a manifest.** Track every asset in a manifest (file, source URL, author, licence, changes made) from day one. CC-BY and OGA-BY need this, and it makes audits trivial.
- **AI music trade-offs, presented neutrally:**
  - It is fast and cheap for placeholders.
  - The risks: shifting terms, possibly weak copyright protection for purely AI output (which limits your ability to stop copying), and platform or store policies on AI-content disclosure.
  - Many teams use it only for temp tracks and replace it before release.
- **Commissioning:** A freelance chiptune or kawaii-pop composer gives you a unique theme, and you can negotiate exclusive or non-exclusive rights and stems for vertical layering. Specify stems, loop points and BPM in the contract.

### Gaps
- **Market rates unknown.** I found no authoritative pricing for commissioning game music, and itch.io pack licences vary per pack, so check each one individually.
- **AI terms unchecked.** I did not fetch the current Suno or Udio terms of service, and the status as of October 2026 (for example, whether Udio's licensed platform launched and on what terms) is unconfirmed.

## Browser playback technology, autoplay, formats and mobile Safari

### Takeaway
- **Engine:** Use one shared `AudioContext` with a small bus graph (master, music, SFX, UI GainNodes), either directly or via Howler.js.
- **Unlock:** Create or resume the context inside the first click or tap, for example on a "Tap to start" title screen.
- **Formats:** Ship Opus (WebM or Ogg) as primary with an AAC/M4A or MP3 fallback, because Safari's Opus support was historically patchy. iOS Safari is listed as fully supporting Opus only from 18.4.
- **iOS silent switch:** Set `navigator.audioSession.type = "playback"` where supported, so the switch doesn't mute Web Audio. Arguably that respects the user less for a casual game, so make it a deliberate choice.

### Cited Findings
- **Chrome autoplay:** "If an AudioContext is created before the document receives a user gesture, it will be created in the 'suspended' state". Call `resume()` after a gesture. The context also resumes if `start()` is called on an attached node after a gesture. Listen to `statechange` to detect it. Which gestures count is "still to be defined consistently across browsers", so click is recommended. The Media Engagement Index allows autoplay with sound only on desktop, for sites with high engagement — [Chrome for Developers: Autoplay policy](https://developer.chrome.com/blog/autoplay)
- **MDN on unlock and controls:** "Create or resume context from inside a user gesture", with example code for both patterns. MDN recommends `<input type="range">` for volume, a checkbox for mute, and `role="switch"` for audio toggles — [MDN best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices)
- **Howler.js behaviour:**
  - Defaults to Web Audio with an HTML5 Audio fallback, and automatically tries to unlock audio on iOS (`autoUnlock`).
  - Sprites are defined as `{ key: [offsetMs, durationMs, loop?] }`, and the `audiosprite` tool generates compatible sprites.
  - `html5: true` streams large files.
  — [howler on npm](https://npmjs.com/package/howler); [Mozilla Hacks article](https://hacks.mozilla.org/?p=19094)
- **Opus support in Safari:** caniuse marks Safari 11–17.x as "partial" and iOS Safari 18.4+ (up to 26.x/27.x) as "supported". This covers the `<audio>` element only — [caniuse: Opus](https://caniuse.com/opus)
- **Opus history in WebKit:**
  - 2018: Safari could not play Ogg Opus or WebM Opus — [WebKit bug 183852](https://bugs.webkit.org/show_bug.cgi?id=183852)
  - Safari 15: added WebM Opus to `<audio>`, but `decodeAudioData` initially failed — [WebKit bug 226922](https://bugs.webkit.org/show_bug.cgi?id=226922)
  - iOS: `canPlayType` gave inconsistent results; a comment says WebM Opus became consistent across platforms in Safari 17.4 — [WebKit bug 238546](https://bugs.webkit.org/show_bug.cgi?id=238546)
  - Safari 16: a blob-URL WebM Opus bug broke Construct 3 — [WebKit bug 245428](https://bugs.webkit.org/show_bug.cgi?id=245428)
- **iOS mute switch:**
  - Web Audio on iOS defaults to audio session type "ambient", so it is muted by the silent switch while `<audio>` and `<video>` elements are not. Setting `navigator.audioSession.type = "playback"` keeps it audible — [WebKit bug 237322](https://auto-bugs.webkit.org/show_bug.cgi?id=237322); [Jeremy Keith / adactio](https://adactio.com/tags/webaudio)
  - On iOS 17/18, "transient" and "transient-solo" produced no sound from HTMLAudioElement — [WebKit bug 264473](https://bugs.webkit.org/show_bug.cgi?id=264473)
  - The older workaround is the `unmute` library, which loops a silent HTML audio track — [GitHub: swevans/unmute](https://github.com/swevans/unmute)
  - No official Apple documentation was found.

### Inferences
- **Library choice:**
  - Howler.js (small, battle-tested sprites and unlock) is enough for SFX plus simple music.
  - Tone.js adds musical-time scheduling for layered or quantized music, but it is heavier.
  - If the project uses Phaser, its Sound Manager wraps Web Audio and handles the unlock. PixiJS uses the separate `@pixi/sound` package. Neither was verified this session.
  - A hand-rolled thin Web Audio layer (about 200 lines) is also reasonable and gives full control over stems.
- **Formats:** Encode music and SFX as Opus in WebM at 64–96 kbps (music) and 48–64 kbps (SFX), with an M4A (AAC) fallback. Detect support with `canPlayType`, but on iOS also try `decodeAudioData` because `canPlayType` was unreliable there. MP3 is the simplest universal fallback, but it pads start and end with encoder delay, which hurts gapless loops. For loops, prefer Opus/AAC or WAV with loop points set in code (`loopStart`/`loopEnd`).
- **Audio sprites:** Pack SFX into one or two sprite files to reduce HTTP requests and decode calls on mobile.
- **Latency:** Web Audio buffer playback is effectively immediate once decoded. Decode everything up front behind the "Tap to start" screen. Read `AudioContext.baseLatency` and `outputLatency` if timing matters (not verified this session).
- **Settings:**
  - Provide separate Music, SFX and UI sliders plus a master mute. Store them in `localStorage`.
  - Map slider value to gain on a perceptual (dB) curve.
  - On `visibilitychange`, suspend the context so audio doesn't keep playing in a background tab.
- **Ducking:** On stingers or voice, ramp the music bus gain down 6–10 dB over about 50 ms and back up over 300–500 ms. Alternatively, add a `DynamicsCompressorNode` sidechain-like approach, which is harder in Web Audio, so gain ramps are preferred.

### Gaps
- **Not verified this session:** the Phaser and PixiJS sound docs, Opus in WebM vs Ogg containers on iOS 18.4+, and the current `navigator.audioSession` support matrix.

## Loudness and mixing guidelines

### Takeaway
Target about -16 LUFS integrated, with a true peak of -1 dBTP or lower, because the game will be played mostly on laptops and phones in the browser. This matches the IESD/G.A.N.G. mobile recommendation and Audiokinetic's tests. The console standard is -24 LUFS ±2 LU, which is too quiet for web and mobile listening.

### Cited Findings
- **IESD (Independent G.A.N.G.) reference levels:**
  - Console titles: -24 LUFS ±2 LU (ITU-R BS.1770-3), true peak ≤ -1 dBTP.
  - Mobile/handheld: about -16 LUFS with a loudness range of 10–15 LU.
  — [IESD Mix Ref Levels v03.02 (PDF)](https://www.audiogang.org/wp-content/uploads/2015/04/IESD-Mix-Ref-Levels-v03.02.pdf)
- **Origin of -24 LUFS:** It traces back to Sony's ASWG-R001 document — [Designing Sound](https://designingsound.org/2013/02/20/different-loudness-ranges-for-console-and-mobile-games)
- **Audiokinetic tests:** Most samples and music perform well on iOS/Android phones at about -16 LKFS — [Audiokinetic blog](https://blog.audiokinetic.com/loudness-processing-best-practices-series-chapter1-loudness-measurement-part2)
- **Meta:** -16 LUFS for standalone Quest apps and -18 LUFS for PC VR — [Meta developers](https://developers.meta.com/horizon/documentation/unreal/audio-loudness-meter-overview/)
- **Community guidance:** -16 to -20 LUFS with about -1 dB true-peak headroom — [Bugnet blog](https://bugnet.io/blog/how-loud-should-your-game-be)

### Inferences
- **Mix plan:**
  - Normalise music loops to about -18 LUFS-I, so stingers and SFX can sit on top while the overall gameplay mix lands near -16 LUFS.
  - Normalise each SFX by peak or short-term loudness, and set relative levels in code (UI quieter, the catch and the meow prominent).
  - Leave a true-peak ceiling of -1 dBTP on all exported files, because lossy encoding (Opus/AAC) can create inter-sample overs.
  - A final `DynamicsCompressorNode` or limiter on the master bus stops sounds piling up into clipping when many play at once.
- **Measuring:** Use a free LUFS meter (for example Youlean Loudness Meter, or ffmpeg's `loudnorm`/`ebur128` filter, not verified this session) when batch-normalising the assets.

### Gaps
- **No newer revision found.** I could not find an ASWG or IESD revision newer than about 2015, and no web-specific game loudness standard exists that I could locate.
