// Scripted play-test against the dev server.
// usage: node tools/playtest.mjs <outDir> "<step>;<step>;..."
// steps: start | wait <ms> | press <Key> | hold <Key> <ms> | down <Key> | up <Key>
//        | jump <ms> | goto <Scene> | shot <name> | state | eval <js> | session <json>
import { chromium } from 'playwright';

const [outDir, script = 'start;wait 1500;shot alley;state'] = process.argv.slice(2);
const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.addInitScript({ path: new URL('./bots.js', import.meta.url).pathname });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.goto(process.env.URL ?? 'http://localhost:5173/');
await page.waitForFunction(() => window.__state?.().scene === 'Title', null, { timeout: 15000 });

const log = (...a) => console.log(...a);
for (const raw of script.split(script.includes('\n') ? '\n' : ';').map((s) => s.trim()).filter(Boolean)) {
  const [cmd, ...args] = raw.split(' ');
  switch (cmd) {
    case 'start':
      await page.keyboard.press('Space');
      await page.waitForFunction(() => window.__state().scene === 'Alley', null, { timeout: 5000 });
      await page.waitForTimeout(600);
      break;
    case 'wait': await page.waitForTimeout(Number(args[0])); break;
    case 'press': await page.keyboard.press(args[0]); break;
    case 'down': await page.keyboard.down(args[0]); break;
    case 'up': await page.keyboard.up(args[0]); break;
    case 'hold':
      await page.keyboard.down(args[0]);
      await page.waitForTimeout(Number(args[1]));
      await page.keyboard.up(args[0]);
      break;
    case 'jump':
      await page.keyboard.down('Space');
      await page.waitForTimeout(Number(args[0] ?? 300));
      await page.keyboard.up('Space');
      break;
    case 'goto':
      await page.evaluate(([k, d]) => window.__goto(k, d ? JSON.parse(d) : undefined), [args[0], args[1]]);
      await page.waitForTimeout(700);
      break;
    case 'walk': {
      // walk <x> [jumpAtStart]: steer toward x using real key presses
      const target = Number(args[0]);
      const t0 = Date.now();
      let key = null;
      while (Date.now() - t0 < 6000) {
        const st = await page.evaluate(() => window.__state().cat);
        if (!st) break;
        const want = Math.abs(st.x - target) < 18 ? null : st.x < target ? 'ArrowRight' : 'ArrowLeft';
        if (want !== key) {
          if (key) await page.keyboard.up(key);
          if (want) await page.keyboard.down(want);
          key = want;
        }
        if (!want) break;
        await page.waitForTimeout(16);
      }
      if (key) await page.keyboard.up(key);
      break;
    }
    case 'chase':
    case 'hop': {
      // chase <ms> <js expr returning {x,y} or null>: 4-way steer toward a moving target
      const ms = Number(args[0]);
      const expr = args.slice(1).join(' ');
      const t0 = Date.now();
      const held = new Set();
      const set = async (k, on) => {
        if (on && !held.has(k)) { await page.keyboard.down(k); held.add(k); }
        if (!on && held.has(k)) { await page.keyboard.up(k); held.delete(k); }
      };
      while (Date.now() - t0 < ms) {
        const r = await page.evaluate((e) => {
          const t = eval(e);
          const c = window.__state().cat;
          return t && c ? { dx: t.x - c.x, dy: t.y - c.y, ground: c.ground, eat: !!t.eat } : null;
        }, expr);
        if (!r) {
          // Between scenes there is no cat; only stop for good on game over.
          if (cmd === 'chase' || (await page.evaluate(() => window.__state().scene)) === 'GameOver') break;
          for (const k of [...held]) await set(k, false);
          await page.waitForTimeout(100);
          continue;
        }
        await set('ArrowRight', r.dx > 15);
        await set('ArrowLeft', r.dx < -15);
        if (cmd === 'chase') {
          await set('ArrowDown', r.dy > 15);
          await set('ArrowUp', r.dy < -15);
        } else {
          // platformer: hop when the target is above, drop through when below
          await set('Space', r.dy < -40 && (r.ground ? !held.has('Space') : held.has('Space')));
          await set('ArrowDown', (r.dy > 60 && r.ground && Math.abs(r.dx) < 120) || (r.eat && Math.abs(r.dx) < 30));
        }
        await page.waitForTimeout(16);
      }
      for (const k of [...held]) await page.keyboard.up(k);
      break;
    }
    case 'session':
      await page.evaluate((j) => Object.assign(window.__session.session, JSON.parse(j)), args.join(' '));
      break;
    case 'shot': await page.screenshot({ path: `${outDir}/${args[0]}.png` }); log('shot', args[0]); break;
    case 'state': log(JSON.stringify(await page.evaluate(() => window.__state()))); break;
    case 'eval': log(JSON.stringify(await page.evaluate(args.join(' ')))); break;
    default: throw new Error(`unknown step ${raw}`);
  }
}
if (errors.length) log('ERRORS:', errors.join('\n'));
await browser.close();
