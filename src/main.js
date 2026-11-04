import './style.css';
import { ART } from './art.js';
import { say, setSound, soundOn } from './speech.js';
import { loadSave, writeSave } from './save.js';
import { runScene } from './scene.js';
import { runMap } from './map.js';
import { ADVENTURES, PLACES } from './adventures/index.js';

const $ = (s) => document.querySelector(s);
const world = $('#world');
const nameScreen = $('#nameScreen');
const endScreen = $('#endScreen');
const nameInput = $('#nameInput');
const mapBtn = $('#mapBtn');

const save = loadSave();
let destroy = null;
let current = null; // { place, adventure }

function clear() { if (destroy) destroy(); destroy = null; }

function showMap(extra = {}) {
  clear();
  endScreen.hidden = true;
  mapBtn.hidden = true;
  destroy = runMap(world, { save, at: current?.place.id, onPick: startPlace, ...extra });
}

function startPlace(place) {
  clear();
  current = { place, adventure: ADVENTURES[place.adventure] };
  mapBtn.hidden = false;
  destroy = runScene(world, current.adventure, { name: save.name, onWin });
}

function onWin(adv) {
  const first = !save.done.includes(adv.id);
  if (first) { save.done.push(adv.id); writeSave(save); }
  const unlocked = first ? PLACES.find((p) => p.after === adv.id && !p.soon) : null;
  current.unlocked = unlocked ? unlocked.id : null;

  $('#sticker').innerHTML = `${ART.star}<span class="sticker-pic">${ART[adv.sticker]}</span>`;
  $('#endTitle').textContent = `Brawo, ${save.name}!`;
  $('#endText').textContent = adv.winText;
  endScreen.hidden = false;
  say(`Brawo! ${adv.winText}`);
}

// Ekran imienia
$('#namePup').innerHTML = ART.pupFace;
function askName() {
  clear();
  mapBtn.hidden = true;
  endScreen.hidden = true;
  nameScreen.hidden = false;
  nameInput.value = save.name || '';
  setTimeout(() => { try { nameInput.focus({ preventScroll: true }); } catch (e) { /* ok */ } }, 200);
}
function confirmName() {
  let n = nameInput.value.trim() || 'Burek';
  n = n.charAt(0).toUpperCase() + n.slice(1).toLowerCase();
  save.name = n;
  writeSave(save);
  nameScreen.hidden = true;
  say(`Hau hau! Mam na imię ${n}!`);
  setTimeout(() => showMap({ greet: true }), 1800);
}
nameInput.addEventListener('input', () => {
  nameInput.value = nameInput.value.replace(/[^a-ząćęłńóśźżA-ZĄĆĘŁŃÓŚŹŻ ]/g, '');
});
nameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') confirmName(); });
document.querySelectorAll('#sugg button').forEach((b) => {
  b.addEventListener('click', () => { nameInput.value = b.textContent; say(b.textContent); });
});
$('#startBtn').addEventListener('click', confirmName);
$('#renameBtn').addEventListener('click', askName);

// Przyciski
$('#toMapBtn').addEventListener('click', () => showMap({ unlocked: current?.unlocked }));
$('#againBtn').addEventListener('click', () => { endScreen.hidden = true; startPlace(current.place); });
mapBtn.addEventListener('click', () => showMap());
$('#soundBtn').addEventListener('click', (e) => {
  setSound(!soundOn());
  e.currentTarget.textContent = 'Głos: ' + (soundOn() ? 'włączony' : 'wyłączony');
  e.currentTarget.setAttribute('aria-pressed', String(soundOn()));
});

// Start: jeśli piesek ma już imię, od razu mapa
if (save.name) showMap({ greet: true });
else askName();
