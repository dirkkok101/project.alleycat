// Dev-only audition page (/audio-test.html): buttons for every SFX and track.

import { AudioEngine, type MusicTrack, type SfxName } from './index';
import { TRACK_NAMES } from './music';
import { SFX_NAMES } from './sfx';

const audio = AudioEngine.get();
const $ = (id: string) => document.getElementById(id) as HTMLElement;
const status = $('status');

function button(parent: HTMLElement, label: string, onClick: (b: HTMLButtonElement) => void) {
  const b = document.createElement('button');
  b.textContent = label;
  b.addEventListener('click', () => {
    void audio.unlock().then(() => {
      status.textContent = 'Audio running' + (audio.ready ? ', SFX rendered.' : '...');
    });
    onClick(b);
  });
  parent.appendChild(b);
  return b;
}

function toggle(parent: HTMLElement, label: string, initial: boolean, apply: (on: boolean) => void) {
  let on = initial;
  const b = button(parent, label, () => {
    on = !on;
    b.setAttribute('aria-pressed', String(on));
    apply(on);
  });
  b.setAttribute('aria-pressed', String(on));
}

const music = $('music');
for (const t of TRACK_NAMES) button(music, t, () => audio.playMusic(t as MusicTrack));
button(music, 'stop', () => audio.stopMusic());

const layers = $('layers');
toggle(layers, 'danger', false, (on) => audio.setLayer('danger', on));
toggle(layers, 'hurry', false, (on) => audio.setHurry(on));
toggle(layers, 'mute', audio.muted, (on) => audio.setMuted(on));
button(layers, 'duck', () => audio.duck());

($('musicVol') as HTMLInputElement).addEventListener('input', (e) => audio.setMusicVolume(Number((e.target as HTMLInputElement).value)));
($('sfxVol') as HTMLInputElement).addEventListener('input', (e) => audio.setSfxVolume(Number((e.target as HTMLInputElement).value)));

const sfx = $('sfx');
for (const name of SFX_NAMES) {
  if (name === 'combo') continue;
  button(sfx, name, () => audio.play(name as SfxName));
}
let combo = 0;
button(sfx, 'combo (rising)', () => {
  audio.play('combo', { pitch: Math.pow(2, (combo * 2) / 12) });
  combo = (combo + 1) % 8;
});
button(sfx, 'meow L/R', () => {
  audio.play('meow', { pan: -0.8 });
  setTimeout(() => audio.play('meow', { pan: 0.8 }), 400);
});

// Peak meter on the master output.
const bar = $('meter').firstElementChild as HTMLElement;
const peakEl = $('peak');
let held = 0;
let buf: Float32Array<ArrayBuffer> | null = null;
function meter() {
  const a = audio.analyser;
  if (a) {
    buf ??= new Float32Array(a.fftSize);
    a.getFloatTimeDomainData(buf);
    let p = 0;
    for (let i = 0; i < buf.length; i++) p = Math.max(p, Math.abs(buf[i]));
    held = Math.max(p, held * 0.97);
    bar.style.width = `${Math.min(100, held * 100)}%`;
    peakEl.textContent = `peak: ${held.toFixed(3)}`;
  }
  requestAnimationFrame(meter);
}
requestAnimationFrame(meter);
