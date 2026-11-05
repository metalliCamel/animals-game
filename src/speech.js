// Czytanie na głos przez syntezator przeglądarki (polski głos, jeśli jest dostępny).
//
// Kwestie nie przerywają się nawzajem: trafiają do kolejki i są czytane do końca, jedna po drugiej.
// Żeby kolejka nie rosła, gdy dziecko klika szybko, czekać mogą najwyżej dwie kwestie
// (starsze oczekujące są pomijane, ta czytana teraz zawsze kończy się w całości).
// Długi tekst jest dzielony na zdania, bo Chrome potrafi uciąć wypowiedź po kilkunastu sekundach.
// onStart / onEnd pozwalają pokazać dymek dokładnie wtedy, gdy jego tekst jest czytany.
//
// Tryb czytania (opts.pre): przed zdaniem piesek czyta powoli pojedyncze słowa z dymka,
// każde z własnym onStart (podświetlenie słowa), po pauzie opts.pause na samodzielną próbę.

const MAX_PENDING = 2;
let enabled = true;
let plVoice = null;
let queue = [];
let current = null;
let keepAlive = [];

const synth = (() => { try { return window.speechSynthesis || null; } catch (e) { return null; } })();

function pickVoice() {
  try { plVoice = synth.getVoices().find((v) => /^pl/i.test(v.lang)) || null; } catch (e) { /* brak głosów */ }
}
if (synth) { pickVoice(); try { synth.onvoiceschanged = pickVoice; } catch (e) { /* ok */ } }

// Przybliżony czas czytania (gdy syntezatora nie ma albo głos jest wyłączony)
const estimate = (text, rate = 0.9) => Math.max(700, text.split(/\s+/).length * 420 * (0.9 / rate));

function chunks(text) {
  const parts = text.match(/[^.!?]+[.!?]*/g) || [text];
  return parts.map((p) => p.trim()).filter(Boolean);
}
const call = (fn) => { try { fn && fn(); } catch (e) { /* ok */ } };

function finish(item) {
  if (item.done) return;
  item.done = true;
  clearTimeout(item.timer);
  call(item.onEnd);
  if (current === item) current = null;
  pump();
}

// Kolejne fragmenty kwestii: słowa trybu czytania, potem zdania. Każdy próbuje mówić naprawdę;
// gdy przeglądarka nie zacznie w ciągu sekundy, reszta kwestii tylko odmierza czas.
function speakItem(item) {
  current = item;
  const segs = [...(item.pre || []), ...chunks(item.text).map((t) => ({ text: t, rate: 0.9 }))];
  let i = 0;
  let silent = !enabled || !synth;
  let shown = false;
  const show = () => { if (!shown) { shown = true; call(item.onStart); } };
  if (item.pre) show(); // w trybie czytania dymek jest widoczny już w czasie pauzy

  const next = () => {
    if (item.done) return;
    if (i >= segs.length) { finish(item); return; }
    const seg = segs[i++];
    if (!seg.text) { call(seg.onStart); next(); return; } // znacznik bez mowy (np. „wszystkie słowa przeczytane”)
    if (silent) {
      show(); call(seg.onStart);
      item.timer = setTimeout(next, estimate(seg.text, seg.rate));
      return;
    }
    const u = new SpeechSynthesisUtterance(seg.text);
    u.lang = 'pl-PL';
    if (plVoice) u.voice = plVoice;
    u.rate = seg.rate || 0.9;
    u.pitch = 1.15;
    let began = false;
    u.onstart = () => { began = true; show(); call(seg.onStart); };
    u.onend = () => {
      keepAlive = keepAlive.filter((x) => x !== u);
      clearTimeout(item.timer);
      if (u.handled) return;
      u.handled = true;
      item.timer = setTimeout(next, seg.gap || 0);
    };
    u.onerror = u.onend;
    keepAlive.push(u); // Chrome gubi zdarzenia, gdy obiekt wypowiedzi zostanie posprzątany z pamięci
    clearTimeout(item.timer);
    // Nie ruszyło w ciągu sekundy: przechodzimy na odmierzanie czasu.
    // Ruszyło, ale zgubiło koniec: zabezpieczenie po podwójnym czasie czytania.
    item.timer = setTimeout(() => {
      if (u.handled) return;
      if (!began) {
        u.handled = true;
        silent = true;
        try { synth.cancel(); } catch (e) { /* ok */ }
        show(); call(seg.onStart);
        item.timer = setTimeout(next, estimate(seg.text, seg.rate));
        return;
      }
      item.timer = setTimeout(() => { if (!u.handled) { u.handled = true; next(); } }, estimate(seg.text, seg.rate) * 2 + 3000);
    }, 1200);
    try { synth.speak(u); } catch (e) { silent = true; u.handled = true; next(); }
  };

  if (item.pause) item.timer = setTimeout(next, item.pause);
  else next();
}

function pump() {
  if (current || !queue.length) return;
  speakItem(queue.shift());
}

// Tekst do przeczytania. opts: { onStart, onEnd, interrupt, pre: [{ text, rate, onStart, gap }], pause }
export function say(text, opts = {}) {
  if (!text && !opts.pre) { call(opts.onStart); return; }
  if (!enabled || !synth) {
    // Bez głosu dymek pojawia się od razu; podświetlanie słów i tak idzie po kolei
    if (!opts.pre) {
      call(opts.onStart);
      if (opts.onEnd) setTimeout(opts.onEnd, estimate(text || ''));
      return;
    }
  }
  if (opts.interrupt) stopSpeech();
  // Ta sama kwestia już czeka albo właśnie jest czytana: nie powtarzamy
  if (!opts.pre && ((current && current.text === text) || queue.some((q) => q.text === text))) {
    call(opts.onStart);
    return;
  }
  queue.push({ text: text || '', onStart: opts.onStart, onEnd: opts.onEnd, pre: opts.pre, pause: opts.pause });
  while (queue.length > MAX_PENDING) {
    const dropped = queue.shift();
    call(dropped.onEnd);
  }
  pump();
}

// Czy coś jest teraz czytane albo czeka w kolejce
export function speaking() { return !!current || queue.length > 0; }

export function stopSpeech() {
  queue = [];
  const c = current;
  current = null;
  if (c) { c.done = true; clearTimeout(c.timer); }
  try { synth && synth.cancel(); } catch (e) { /* ok */ }
}

export function setSound(on) { enabled = on; if (!on) stopSpeech(); }
export function soundOn() { return enabled; }
