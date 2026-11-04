// Czytanie na głos przez syntezator przeglądarki (polski głos, jeśli jest dostępny).
let enabled = true;
let plVoice = null;

function pickVoice() {
  try {
    const voices = speechSynthesis.getVoices();
    plVoice = voices.find((v) => /^pl/i.test(v.lang)) || null;
  } catch (e) { /* brak syntezatora */ }
}
try { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; } catch (e) { /* brak syntezatora */ }

export function say(text) {
  if (!enabled || !text) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'pl-PL';
    if (plVoice) u.voice = plVoice;
    u.rate = 0.9;
    u.pitch = 1.15;
    speechSynthesis.speak(u);
  } catch (e) { /* brak syntezatora */ }
}

export function stopSpeech() {
  try { speechSynthesis.cancel(); } catch (e) { /* brak syntezatora */ }
}

export function setSound(on) { enabled = on; if (!on) stopSpeech(); }
export function soundOn() { return enabled; }
