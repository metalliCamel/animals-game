import './style.css';
import { ART } from './art.js';
import { say, setSound, soundOn } from './speech.js';
import { loadSave, writeSave } from './save.js';
import { runScene } from './scene.js';
import { runMap } from './map.js';
import { ADVENTURES, PLACES, FRIENDS } from './adventures/index.js';

const $ = (s) => document.querySelector(s);
const world = $('#world');
const nameScreen = $('#nameScreen');
const endScreen = $('#endScreen');
const nameInput = $('#nameInput');
const mapBtn = $('#mapBtn');
const albumBtn = $('#albumBtn');
const albumScreen = $('#albumScreen');

const save = loadSave();
// Plecak współdzielony przez wszystkie miejsca i zapisywany razem z grą
const bag = {
  get items() { return save.bag; },
  set items(v) { save.bag = v; },
  save() { writeSave(save); },
};
let destroy = null;
let current = null; // { place, adventure }

function clear() { if (destroy) destroy(); destroy = null; }

function showMap(extra = {}) {
  clear();
  endScreen.hidden = true;
  albumScreen.hidden = true;
  mapBtn.hidden = true;
  albumBtn.hidden = false;
  destroy = runMap(world, { save, at: current?.place.id, onPick: startPlace, ...extra });
}

function startPlace(place) {
  clear();
  current = { place, adventure: ADVENTURES[place.adventure] };
  mapBtn.hidden = false;
  albumBtn.hidden = true;
  destroy = runScene(world, current.adventure, { name: save.name, bag, onWin });
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
  albumBtn.hidden = true;
  albumScreen.hidden = true;
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

// Album przyjaciół
function showAlbum() {
  const cards = $('#cards');
  cards.innerHTML = '';
  let count = 0;
  for (const f of FRIENDS) {
    const met = !f.soon && save.done.includes(f.adventure);
    if (met) count++;
    const c = document.createElement('button');
    c.type = 'button';
    c.className = 'card' + (met ? ' met' : '');
    c.innerHTML = met
      ? `<span class="card-pic">${ART[f.art]}</span><span class="card-star">${ART.star}</span><span class="card-name">${f.name}</span>`
      : `<span class="card-pic">${ART.question}</span><span class="card-name">${f.place}</span>`;
    c.addEventListener('click', () => {
      if (met) say(`${f.name}. ${f.line}`);
      else if (f.soon) say(`${f.place}. Tu jeszcze budujemy. Wkrótce poznasz nowego przyjaciela!`);
      else say(`${f.place}. Pomóż tam zwierzątku, a pojawi się w albumie!`);
    });
    cards.appendChild(c);
  }
  albumScreen.hidden = false;
  const words = ['', 'jednego przyjaciela', 'dwóch przyjaciół', 'trzech przyjaciół', 'czterech przyjaciół', 'pięciu przyjaciół'];
  say(count ? `Twój album! Masz już ${words[count] || count + ' przyjaciół'}. Kliknij obrazek.` : 'Twój album jest pusty. Pomóż zwierzątkom, a pojawią się tutaj!');
}
albumBtn.addEventListener('click', showAlbum);
$('#albumClose').addEventListener('click', () => { albumScreen.hidden = true; });

// Start: jeśli piesek ma już imię, od razu mapa
if (save.name) showMap({ greet: true });
else askName();
