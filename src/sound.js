// Proste dźwięki instrumentów z Web Audio (bez plików). Dźwięk działa po pierwszym kliknięciu.
import { soundOn } from './speech.js';

let ctx = null;
function ac() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; }
  }
  if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function env(c, g, t, peak, dur) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
}

const VOICES = {
  // dzwonek owieczki: dwa jasne tony
  bell(c, t) {
    for (const [f, d] of [[1318, 0.9], [1975, 0.6]]) {
      const o = c.createOscillator(); const g = c.createGain();
      o.type = 'sine'; o.frequency.value = f; env(c, g, t, 0.25, d);
      o.connect(g).connect(c.destination); o.start(t); o.stop(t + d);
    }
  },
  // gwizdek świstaka: ton idący w górę
  whistle(c, t) {
    const o = c.createOscillator(); const g = c.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(1100, t); o.frequency.exponentialRampToValueAtTime(1900, t + 0.35);
    env(c, g, t, 0.22, 0.45); o.connect(g).connect(c.destination); o.start(t); o.stop(t + 0.5);
  },
  // bębenek kozicy: niski, krótki
  drum(c, t) {
    const o = c.createOscillator(); const g = c.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(180, t); o.frequency.exponentialRampToValueAtTime(60, t + 0.3);
    env(c, g, t, 0.6, 0.35); o.connect(g).connect(c.destination); o.start(t); o.stop(t + 0.4);
  },
  // ćwierkanie (dla zabawy)
  chirp(c, t) {
    const o = c.createOscillator(); const g = c.createGain();
    o.type = 'triangle'; o.frequency.setValueAtTime(2200, t); o.frequency.exponentialRampToValueAtTime(3000, t + 0.08);
    env(c, g, t, 0.15, 0.12); o.connect(g).connect(c.destination); o.start(t); o.stop(t + 0.15);
  },
  // krótki „puk” przy pustym kamieniu
  knock(c, t) {
    const o = c.createOscillator(); const g = c.createGain();
    o.type = 'square'; o.frequency.value = 140; env(c, g, t, 0.08, 0.08);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + 0.1);
  },
};

export function tone(name) {
  if (!soundOn()) return;
  const c = ac();
  if (!c || !VOICES[name]) return;
  try { VOICES[name](c, c.currentTime + 0.01); } catch (e) { /* brak dźwięku */ }
}
