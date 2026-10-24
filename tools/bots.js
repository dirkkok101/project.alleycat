// Injected by tools/playtest.mjs: target pickers for the `chase` step.
// Each returns {x, y} for the cat to steer toward, or null to stop.
window.__bots = {
  underwater() {
    const s = window.__scene();
    if (!s || s.scene.key !== 'Underwater') return null;
    const c = window.__state().cat;
    if (s.air < 0.35) return { x: c.x, y: 60 };
    const fish = s.fish.filter((f) => f.alive);
    fish.sort((a, b) => Math.hypot(a.img.x - c.x, a.img.y - c.y) - Math.hypot(b.img.x - c.x, b.img.y - c.y));
    return fish[0] ? fish[0].img : null;
  },
};
const nearest = (list) => {
  const c = window.__state().cat;
  list.sort((a, b) => Math.hypot(a.x - c.x, a.y - c.y) - Math.hypot(b.x - c.x, b.y - c.y));
  return list[0] ?? null;
};
Object.assign(window.__bots, {
  cheese() {
    const s = window.__scene();
    if (s?.scene.key !== 'Cheese' || s.done) return null;
    const m = nearest(s.holes.filter((h) => h.mouse.visible && h.until !== Infinity).map((h) => ({ x: h.x, y: h.y - 14 })));
    return m ?? { x: 680, y: 560 };
  },
  bookcase() {
    const s = window.__scene();
    if (s?.scene.key !== 'Bookcase' || s.done) return null;
    return nearest(s.ferns.filter((f) => f.visible).map((f) => ({ x: f.x, y: f.y - 20 })));
  },
  birdcage() {
    const s = window.__scene();
    if (s?.scene.key !== 'Birdcage' || s.done) return null;
    if (s.phase === 'caged') return { x: s.cage.x - 50, y: s.cage.y - 50 };
    return { x: s.bird.x, y: s.bird.y };
  },
  dogs() {
    const s = window.__scene();
    if (s?.scene.key !== 'Dogs' || s.done) return null;
    return nearest(s.dishes.filter((d) => d.left > 0).map((d) => ({ x: d.img.x, y: d.img.y - 20, eat: true })));
  },
  love() {
    const s = window.__scene();
    if (s?.scene.key !== 'Love' || s.done) return null;
    return { x: s.girl.x, y: s.girl.y - 30 };
  },
});
// Remove hazards from the current room (reachability checks).
window.__calm = () => {
  const s = window.__scene();
  s.spiders = [];
  s.dog = undefined;
  s.broom = undefined;
  s.rivals = [];
  s.cupids = [];
  return true;
};
window.__bots.alley = () => {
  const s = window.__scene();
  if (s?.scene.key !== 'Alley' || s.done) return null;
  const open = s.windows.filter((w) => w.open);
  const t = nearest(open.map((w) => ({ x: w.img.x, y: w.img.y - 10 })));
  return t ?? { x: 640, y: 420 };
};
window.__bots.auto = () => {
  const key = window.__state().scene;
  const pick = { Alley: 'alley', Cheese: 'cheese', Bookcase: 'bookcase', Birdcage: 'birdcage', Dogs: 'dogs', Love: 'love', Underwater: 'underwater' }[key];
  if (key === 'Fishbowl') {
    const s = window.__scene();
    return { x: s.bowl.x, y: s.bowl.y - 200 };
  }
  if (key === 'GameOver' || key === 'Title') return null;
  const t = pick ? window.__bots[pick]() : null;
  return t ?? { x: 640, y: 600 };
};
