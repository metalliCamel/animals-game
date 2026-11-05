// Czytanie na głos przez syntezator przeglądarki (polski głos, jeśli jest dostępny).
//
// Kwestie nie przerywają się nawzajem: trafiają do kolejki i są czytane do końca, jedna po drugiej.
// Żeby kolejka nie rosła, gdy dziecko klika szybko, czekać mogą najwyżej dwie kwestie
// (starsze oczekujące są pomijane, ta czytana teraz zawsze kończy się w całości).
// Długi tekst jest dzielony na zdania, bo Chrome potrafi uciąć wypowiedź po kilkunastu sekundach.
// onStart / onEnd pozwalają pokazać dymek dokładnie wtedy, gdy jego tekst jest czytany.

const MAX_PENDING = 2;
let enabled = true;
let plVoice = null;
let queue = [];
let current = null;
let keepAlive = [];
let silent = false; // ostatnia kwestia nie ruszyła (brak głosów, blokada): wtedy tylko odmierzamy czas czytania

const synth = (() => { try { return window.speechSynthesis || null; } catch (e) { return null; } })();

function pickVoice() {
  try { plVoice = synth.getVoices().find((v) => /^pl/i.test(v.lang)) || null; } catch (e) { /* brak głosów */ }
}
if (synth) { pickVoice(); try { synth.onvoiceschanged = pickVoice; } catch (e) { /* ok */ } }

// Przybliżony czas czytania (gdy syntezatora nie ma albo głos jest wyłączony)
const estimate = (text) => Math.max(1800, text.split(/\s+/).length * 420);

function chunks(text) {
  const parts = text.match(/[^.!?]+[.!?]*/g) || [text];
  return parts.map((p) => p.trim()).filter(Boolean);
}

function finish(item) {
  if (item.done) return;
  item.done = true;
  clearTimeout(item.watchdog);
  try { item.onEnd && item.onEnd(); } catch (e) { /* ok */ }
  if (current === item) current = null;
  pump();
}

function speakItem(item) {
  current = item;
  // Każda kwestia próbuje mówić od nowa; „silent” dotyczy tylko tej, która nie ruszyła
  const parts = chunks(item.text);
  let i = 0;
  let started = false;
  // Zabezpieczenie: gdyby przeglądarka zgubiła zdarzenie końca, kolejka i tak ruszy dalej
  const arm = (ms) => { clearTimeout(item.watchdog); item.watchdog = setTimeout(() => { try { synth.cancel(); } catch (e) { /* ok */ } finish(item); }, ms); };
  const next = () => {
    if (item.done) return;
    if (i >= parts.length) { finish(item); return; }
    const u = new SpeechSynthesisUtterance(parts[i++]);
    u.lang = 'pl-PL';
    if (plVoice) u.voice = plVoice;
    u.rate = 0.9;
    u.pitch = 1.15;
    u.onstart = () => { silent = false; if (!started) { started = true; try { item.onStart && item.onStart(); } catch (e) { /* ok */ } } };
    u.onend = () => { keepAlive = keepAlive.filter((x) => x !== u); next(); };
    u.onerror = u.onend;
    keepAlive.push(u); // Chrome gubi zdarzenia, gdy obiekt wypowiedzi zostanie posprzątany z pamięci
    arm(estimate(u.text) * 2.5 + 4000);
    try { synth.speak(u); } catch (e) { finish(item); }
  };
  next();
  // Gdy przeglądarka nie zacznie mówić (np. brak głosów), dymek i tak się pojawi
  setTimeout(() => {
    if (started || item.done) return;
    started = true;
    silent = true;
    try { synth.cancel(); } catch (e) { /* ok */ }
    try { item.onStart && item.onStart(); } catch (e) { /* ok */ }
    clearTimeout(item.watchdog);
    item.watchdog = setTimeout(() => finish(item), estimate(item.text));
  }, 1200);
}

function pump() {
  if (current || !queue.length) return;
  speakItem(queue.shift());
}

// Tekst do przeczytania. opts: { onStart, onEnd, interrupt }
export function say(text, opts = {}) {
  if (!text) { opts.onStart && opts.onStart(); return; }
  if (!enabled || !synth) {
    opts.onStart && opts.onStart();
    if (opts.onEnd) setTimeout(opts.onEnd, estimate(text));
    return;
  }
  if (opts.interrupt) stopSpeech();
  // Ta sama kwestia już czeka albo właśnie jest czytana: nie powtarzamy
  if ((current && current.text === text) || queue.some((q) => q.text === text)) {
    opts.onStart && opts.onStart();
    return;
  }
  queue.push({ text, onStart: opts.onStart, onEnd: opts.onEnd });
  while (queue.length > MAX_PENDING) {
    const dropped = queue.shift();
    dropped.onEnd && dropped.onEnd();
  }
  pump();
}

// Czy coś jest teraz czytane albo czeka w kolejce
export function speaking() { return !!current || queue.length > 0; }

export function stopSpeech() {
  queue = [];
  const c = current;
  current = null;
  if (c) { c.done = true; clearTimeout(c.watchdog); }
  try { synth && synth.cancel(); } catch (e) { /* ok */ }
}

export function setSound(on) { enabled = on; if (!on) stopSpeech(); }
export function soundOn() { return enabled; }
