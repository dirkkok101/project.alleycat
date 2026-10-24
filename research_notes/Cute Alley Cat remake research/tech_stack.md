# Tech Stack for a Browser TypeScript "Alley Cat" Remake (as of 2026-10-24)

Data snapshot: GitHub REST API (`api.github.com/repos/...`), npm registry (`registry.npmjs.org/<pkg>/latest`), npm downloads API (last month, 2026-09-23 to 2026-10-22), and Bundlephobia API, all queried 2026-10-24. Where a claim comes from memory and was not checked in this session, it is listed under Inferences and labelled "(unverified this session)".

## Engine/framework comparison and recommendation

### Takeaway
**Recommendation: Phaser 4 (v4.2.1, MIT).** It went stable in April 2026 and is the only option checked here that ships scenes, Arcade physics with a fixed step, tweens, particles, tilemaps (Tiled), audio and input together, with first-party TypeScript types and an official Vite + TS template. The costs are the largest bundle (~356 KB gzip, full build) and a freshly rewritten renderer, so some v3-era tutorials and plugins no longer apply. **Alternatives:** Excalibur (TS-native, smaller, but still 0.x with breaking changes), LittleJS (tiny, very active, has arcade physics, Tiled JSON and touch/gamepad, but a smaller ecosystem), and PixiJS v8 (a renderer only, so you build physics, scenes and audio yourself). KAPLAY's stable line has not had a release since June 2025, with v4000 still in alpha. Godot web export rules out C#, and GDScript rules out TypeScript.

### Cited Findings

**Version/activity snapshot**

| Engine | Latest stable (date) | GitHub stars | Last push | npm downloads/month | Licence | Bundlephobia min / gzip |
|---|---|---|---|---|---|---|
| Phaser | v4.2.1 (2026-07-09) | 40,554 | 2026-08-21 | 1,908,079 | MIT | 1,375 KB / 356 KB |
| PixiJS | v8.22.0 (2026-10-01) | 48,447 | 2026-10-22 | 4,917,220 | MIT | 925 KB / 265 KB |
| Excalibur | v0.32.0 (2025-12-23) | 2,359 | 2026-10-22 | 42,141 | BSD-2-Clause | 571 KB / 145 KB |
| KAPLAY | 3001.0.19 (2025-06-15); `next` = 4000.0.0-alpha.27.1 (2026-05-12) | 1,814 | 2026-10-22 | 37,043 | MIT | 184 KB / 67 KB |
| LittleJS | v1.28.0 (2026-10-20) | 4,345 | 2026-10-20 | 7,659 | MIT | 410 KB / 142 KB |
| Godot | 4.7.2-stable (2026-08-18) | 118,997 | 2026-10-23 | n/a | MIT | n/a (wasm + pck) |

Sources: [Phaser releases](https://github.com/phaserjs/phaser/releases), [PixiJS releases](https://github.com/pixijs/pixijs/releases), [Excalibur releases](https://github.com/excaliburjs/Excalibur/releases), [KAPLAY releases](https://github.com/kaplayjs/kaplay/releases), [LittleJS releases](https://github.com/KilledByAPixel/LittleJS/releases), [Godot releases](https://github.com/godotengine/godot/releases), [npm registry](https://registry.npmjs.org/), [npm downloads API](https://api.npmjs.org/downloads/point/last-month/phaser), [Bundlephobia](https://bundlephobia.com/package/phaser@4.2.1)

**Phaser 3 vs 4 status**
- Phaser 4.0.0 shipped as stable on 2026-04-10 after a run of release candidates (rc.1 2025-04-01 through rc.7 2026-03-25). It was followed by 4.1.0 (2026-04-30), 4.2.0 (2026-06-19) and 4.2.1 (2026-07-09). The last Phaser 3 release on the GitHub releases list is v3.90.0 (2025-05-23). npm `latest` is now 4.2.1. — [Phaser GitHub releases](https://github.com/phaserjs/phaser/releases), [npm phaser](https://www.npmjs.com/package/phaser)
- In v4 the WebGL renderer was "rebuilt from the ground up": render nodes replace pipelines, FX and Masks merge into a single Filter system, and new SpriteGPULayer and TilemapGPULayer objects arrived. The repo also ships 28 AI-agent "skill" files, one of them a v3-to-v4 migration skill. — [Phaser v4.0.0 release notes](https://github.com/phaserjs/phaser/releases/tag/v4.0.0)
- Removed in v4: Mesh/Plane, custom v3 pipelines, BitmapMask, Geom.Point (use Vector2), Camera3D/Layer3D, setTintFill, and the bundled Spine plugins (no longer updated). The Canvas renderer is "deprecated", so WebGL is the recommended path. Tilemaps and particles remain. — [Phaser v3→v4 Migration Guide](https://raw.githubusercontent.com/phaserjs/phaser/master/changelog/v4/4.0/MIGRATION-GUIDE.md)
- According to the README, the core includes a scene-based architecture, loader, animation, input, cameras, tilemaps, particles, tweens, and "built-in physics (Arcade and Matter.js)". TypeScript definitions ship in `types/` and are referenced from package.json. — [Phaser README](https://github.com/phaserjs/phaser)
- README sizes: `phaser.min.js` is 1.29 MB raw / 345 KB gzip, `phaser-arcade.min.js` is 1.18 MB / 313 KB gzip, and custom builds can exclude features. — [Phaser README](https://github.com/phaserjs/phaser)
- Phaser 4.1 docs: ArcadeWorldConfig has `fps` (default 60), `fixedStep` (default true) and `timeScale`. — [Phaser API docs: Types.Physics.Arcade](https://docs.phaser.io/api-documentation/typedef/types-physics-arcade)
- Phaser 4 has no official statement on Phaser 3 maintenance or end-of-life in the README or the migration guide. — [Phaser README](https://github.com/phaserjs/phaser), [Migration Guide](https://raw.githubusercontent.com/phaserjs/phaser/master/changelog/v4/4.0/MIGRATION-GUIDE.md)

**Excalibur**
- Written in TypeScript and "batteries included". It is still 0.x: "breaking changes will occur in new releases", and plugins "may be a little rough around the edges". The 1.0 roadmap is tracked in an issue. — [Excalibur README](https://github.com/excaliburjs/Excalibur)
- The docs cover Actions, Graphics, Input, Physics, Tile Maps, UI, ECS, Screen & Viewport and Plugins. — [Excalibur docs](https://excaliburjs.com/docs/)
- First-party map plugins are current: `@excaliburjs/plugin-tiled` 0.32.0 and `@excaliburjs/plugin-ldtk` 0.32.1. — [npm registry](https://www.npmjs.com/package/@excaliburjs/plugin-ldtk)

**LittleJS**
- Hybrid WebGL2 + Canvas2D renderer. Built in: arcade physics with fast tilemap collision, one-way platforms and raycasting, optional Box2D (WASM), a particle system with a designer tool, ZzFX procedural sound plus mp3/ogg/wav, and mouse/keyboard/gamepad/touch input with an on-screen gamepad. Levels load and save as Tiled JSON. Full TypeScript/module support. The full build is about 135 KB gzip, and a small bundled 2D game is about 26 KB gzip. Newgrounds/Wavedash medals and leaderboards. — [LittleJS README](https://github.com/KilledByAPixel/LittleJS)
- Very active: v1.27.0, 1.27.1 and 1.28.0 all came out within October 2026. — [LittleJS releases](https://github.com/KilledByAPixel/LittleJS/releases)

**KAPLAY**
- A component-based, "fun-first" JS/TS library with `area()`/`body()` physics components and an online KAPLAYGROUND with more than 90 examples. — [KAPLAY README](https://github.com/kaplayjs/kaplay)
- npm dist-tags: `latest` = 3001.0.19 (last stable release 2025-06-15), `next` = 4000.0.0-alpha.27.1. The v4000 line has been in alpha through 2026. — [npm registry kaplay](https://registry.npmjs.org/kaplay), [KAPLAY releases](https://github.com/kaplayjs/kaplay/releases)

**Godot web export**
- 4.7 docs: "Projects written in C# using Godot 4 currently cannot be exported to the web" (they point to Godot 3 for C# on web). Only the Compatibility (WebGL 2) renderer works, and there is no WebGPU yet. Threaded builds need cross-origin-isolation headers. The single-threaded default since 4.3 works better on hosts like itch.io. The wasm/pck files are large. Web builds run slower on mobile than native builds, and Safari has WebGL 2 issues. The default Sample audio mode lacks effects. — [Godot 4.7 Exporting for the Web](https://docs.godotengine.org/en/4.7/tutorials/export/exporting_for_web.html)
- Forum threads in 2026 say C# web export work is still ongoing and may miss 4.7 (community, not official). — [Godot forum](https://forum.godotengine.org/t/is-there-an-update-on-exporting-c-projects-to-web/128821)

### Inferences
- **Fit for Alley Cat:** single-screen scenes, sprite-sheet animation, simple AABB platform physics (bouncing on fences, climbing, jumping in windows), particles, tweens and scene transitions all map directly onto built-in Phaser systems (Scene, Arcade, Tweens, Particles, camera fades). With Excalibur or LittleJS, scenes and transitions are a bit more DIY. With PixiJS you write physics, scene management and audio yourself (Pixi is a renderer; `@pixi/sound` is a separate package; unverified this session).
- **Pixel-art scaling:** Phaser's game config `pixelArt: true` (nearest-neighbour, roundPixels) plus Scale Manager `mode: Phaser.Scale.FIT, autoCenter: CENTER_BOTH` gives letterboxed integer-ish scaling out of the box (API from Phaser 3, unverified in v4 docs this session; the v4 migration guide doesn't list Scale Manager as changed). Excalibur has `pixelArt: true` and DisplayMode.FitScreen (unverified this session). LittleJS uses a fixed-size canvas option (unverified this session).
- **Bundle size** barely matters for this game. ~356 KB gzip of Phaser is smaller than a few audio files, and Bundlephobia measures the whole package, not a tree-shaken Vite build.
- **Mobile performance:** every option is WebGL-batched and easily handles a single-screen sprite game. I found no 2026 benchmarks comparing them. Godot web is the weakest on mobile, by its own docs.
- **Risk notes for Phaser 4:** the renderer is about six months out of RC, so expect occasional regressions (v4.1 and 4.2 came within three months of 4.0). Third-party v3 plugins may need porting. Alley Cat needs none of the removed features (Mesh, BitmapMask, Spine).
- **TypeScript quality ranking (inference):** Excalibur (written in TS) ≈ LittleJS (ships .d.ts from source) ≥ Phaser (large generated `phaser.d.ts`, good coverage) ≈ PixiJS (written in TS) > KAPLAY (TS types fine, but the API is global/component-string heavy). Godot can't be scripted in TS.
- **Plain Canvas/WebGL:** a viable, tiny-bundle option for a game this small, but you'd rebuild animation, tweening, audio unlock, input and scaling yourself. LittleJS is effectively a "thin engine" and gives most of that benefit at ~26 KB gzip.

### Gaps
- No primary-source statement on Phaser 3.x end-of-life or LTS policy.
- No 2025–2026 independent benchmark comparing these engines on mobile.
- Did not verify Phaser 4 Scale Manager, `pixelArt` config or gamepad plugin pages directly in v4 docs (the docs only confirm v4.1.0 coverage for Arcade config).
- No reliable 2025–2026 comparison article found and read in full. Third-party roundups weren't used.

## Build tooling, testing, deployment, PWA

### Takeaway
Scaffold with `npm create @phaserjs/game@latest` (Vite + TS), or clone `phaserjs/template-vite-ts`. The template pins Phaser 4.0.0 and Vite 6 and includes a telemetry ping script, so bump Phaser and Vite to current and use the `-nolog` scripts. Test pure logic with Vitest and smoke-test the canvas with Playwright. Deploy `dist/` as static files to GitHub Pages, Cloudflare (Workers static assets for new projects), and itch.io (zip with `index.html`). Add `vite-plugin-pwa` for offline use.

### Cited Findings
- The `npm create @phaserjs/game@latest` CLI offers Vite, Rollup, Parcel, Webpack, ESBuild, Import Map and Bun, plus framework templates (React, Vue, Angular, Svelte and others), with TS variants "when available". — [phaserjs/create-game](https://github.com/phaserjs/create-game)
- `phaserjs/template-vite-ts` package.json pins `phaser: 4.0.0`, `vite: ^6.3.1` and `typescript: ~5.7.2`, and was last pushed 2026-04-21. Its `dev`/`build` scripts run `log.js`, which sends an HTTPS GET to `gryzor.co/v/<event>/<phaserVersion>/<packageName>`. Use the `dev-nolog`/`build-nolog` scripts to avoid it. — [template-vite-ts package.json](https://github.com/phaserjs/template-vite-ts/blob/main/package.json), [log.js](https://github.com/phaserjs/template-vite-ts/blob/main/log.js)
- Current tool versions on npm (2026-10-24): vite 8.3.5, vitest 5.0.5, @playwright/test 1.64.1, typescript 7.0.2, wrangler 4.152.0, vite-plugin-pwa 2.0.0. — [npm registry](https://www.npmjs.com/)
- Excalibur's own repo uses Playwright for unit and visual tests (`npx playwright install --with-deps`) and BrowserStack for cross-browser testing. That precedent supports Playwright for canvas-game e2e. — [Excalibur README](https://github.com/excaliburjs/Excalibur)
- itch.io HTML5: the ZIP must contain `index.html`. Limits are 500 MB extracted, at most 1,000 files, 200 MB per file and 240-character paths, and file names are case-sensitive. Modes are Embed (fixed viewport) or Click-to-launch fullscreen. A "Mobile Friendly" flag forces fullscreen on mobile. — [itch.io HTML5 docs](https://itch.io/docs/creators/html5)
- Cloudflare: static asset requests are free on both Pages and Workers, and "Workers has a distinctly broader set of features". A migration guide from Pages to Workers static assets exists. — [Cloudflare docs: Migrate from Pages](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/). Third-party 2026 articles say Cloudflare steers new projects to Workers while Pages remains supported. — [flaviocopes](https://flaviocopes.com/cloudflare-pages-vs-workers/), [mecanik.dev](https://mecanik.dev/en/posts/cloudflare-pages-vs-workers-which-to-use-in-2026/)
- Godot single-threaded web export avoids the COOP/COEP header requirements and suits itch.io. Its PWA option adds a service worker. — [Godot 4.7 web export docs](https://docs.godotengine.org/en/4.7/tutorials/export/exporting_for_web.html)

### Inferences
- Set Vite `base: './'` so one build works under a GitHub Pages subpath, on itch.io's iframe CDN and on Cloudflare (common practice, unverified this session).
- GitHub Pages: deploy `dist/` via the official `actions/deploy-pages` workflow (unverified this session).
- Testing split: keep physics and rules as pure TS modules (no Phaser import) and unit-test them in Vitest under the Node environment. Use Playwright to load the built game and assert on a debug hook such as `window.__game.state`, or use screenshot comparisons. Avoid running Phaser under jsdom.
- PWA: `vite-plugin-pwa` with `generateSW` precaching of sprites and audio gives offline play. Disable it or scope it for the itch.io build, because itch serves from its own CDN in an iframe.

### Gaps
- Didn't verify whether `create-game` currently scaffolds Phaser 4.2.x or 4.0.0, or whether its templates also include the telemetry script.
- No Cloudflare first-party sentence saying "start new projects on Workers" was found on the fetched page.

## Architecture tips

### Takeaway
Use a fixed-timestep simulation (60 Hz, accumulator), kept in pure TS separate from rendering. Map raw inputs (keyboard, gamepad, touch) to an abstract action state. Render at a fixed logical resolution (e.g. 320×200, matching CGA-era Alley Cat) with nearest-neighbour FIT/letterbox scaling. Keep high scores in try/catch-guarded localStorage. Add an optional leaderboard behind a tiny serverless endpoint.

### Cited Findings
- Phaser Arcade physics already runs on a fixed step by default (`fixedStep: true`, `fps: 60`). — [Phaser API docs](https://docs.phaser.io/api-documentation/typedef/types-physics-arcade)
- Browser constraints that apply to any engine: audio needs a user gesture first (autoplay blocking), and fullscreen and pointer lock need an input event. — [Godot 4.7 web export docs](https://docs.godotengine.org/en/4.7/tutorials/export/exporting_for_web.html)
- LittleJS includes an on-screen gamepad for touch devices, plus built-in Newgrounds leaderboards and medals. — [LittleJS README](https://github.com/KilledByAPixel/LittleJS)

### Inferences
- **Fixed timestep:** either rely on Arcade's `fixedStep`, or (for full testability) run your own `simulate(state, input, dt=1/60)` from an accumulator inside the Phaser `update(time, delta)`. Clamp delta (e.g. max 250 ms) to avoid a "spiral of death" after tab switches. Render interpolation is optional at 60 Hz.
- **Logic/render split:** a `GameState` plus pure `step()` functions (cat movement, fence/window logic, dog AI, scoring) and a thin Phaser "view" that syncs sprites from state. This makes deterministic Vitest tests and input-replay tests possible.
- **Input:** one `InputActions { left, right, jump, ... }` struct fed from Phaser keyboard, `this.input.gamepad` and virtual touch buttons, which decouples bindings and tests.
- **Responsive scaling:** a fixed logical resolution, `pixelArt: true`, `Scale.FIT` + `CENTER_BOTH` (letterbox), CSS `image-rendering: pixelated`. Optionally snap to integer zoom for crisp pixels.
- **Save data:** a versioned JSON key (e.g. `alleycat.v1`) in localStorage, wrapped in try/catch (private mode and quota errors), with a schema version for migrations.
- **Online leaderboard (optional):** a Cloudflare Worker + D1/KV endpoint fits naturally if you host on Workers static assets. Treat client-submitted scores as untrusted (rate-limit, sanity-check the score against play time). Newgrounds is an alternative if you use LittleJS or target that portal.

### Gaps
- No primary sources fetched on fixed-timestep patterns (e.g. "Fix Your Timestep" by Glenn Fiedler) or on Phaser 4 Scale Manager specifics in this session.

## Level/scene editing: Tiled or LDtk

### Takeaway
**Tiled** is the safer default. It is actively released (1.12.2, May 2026), Phaser loads Tiled JSON natively, and LittleJS also reads Tiled JSON. **LDtk** is good for entity-rich levels but hasn't had a tagged release since January 2024. It's well supported in Excalibur (first-party plugin), but in Phaser it needs a community loader or a custom JSON parser. For Alley Cat's few hand-made single-screen scenes, a code- or JSON-defined layout plus Tiled for background tiles is enough.

### Cited Findings
- Tiled latest: v1.12.2 (2026-05-27), and v1.12.1 (2026-03-25). — [Tiled releases](https://github.com/mapeditor/tiled/releases)
- LDtk latest tagged release: v1.5.3 (2024-01-15). The repo has 4,344 stars and was last pushed 2026-10-23. — [LDtk releases](https://github.com/deepnight/ldtk/releases)
- Excalibur has first-party `@excaliburjs/plugin-tiled` 0.32.0 and `@excaliburjs/plugin-ldtk` 0.32.1. — [npm](https://www.npmjs.com/package/@excaliburjs/plugin-tiled)
- LittleJS loads and saves 2D levels as Tiled JSON. — [LittleJS README](https://github.com/KilledByAPixel/LittleJS)
- Phaser 4 keeps tilemaps, and adds TilemapGPULayer, which renders a whole layer as one quad. — [Phaser v4.0.0 release notes](https://github.com/phaserjs/phaser/releases/tag/v4.0.0), [Migration Guide](https://raw.githubusercontent.com/phaserjs/phaser/master/changelog/v4/4.0/MIGRATION-GUIDE.md)

### Inferences
- In Phaser: `this.load.tilemapTiledJSON()` → `make.tilemap()` → `createLayer()` → `setCollisionByProperty()` is the established flow (Phaser 3 API, presumed unchanged in v4, unverified this session). Use Tiled object layers for spawn points, windows and fence segments.
- Alley Cat scenes (alley/fence, apartment rooms, dog pound) are few and static, so a heavyweight editor pipeline is optional. Start with Tiled only if you want designers to tweak layouts.

### Gaps
- Didn't verify the current state of community Phaser LDtk loaders.
