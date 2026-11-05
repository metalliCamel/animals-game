// Świat gry: regiony (osobne mapy), ich miejsca i przygody wieloetapowe.
import { PLACES as DOLINA } from './adventures/index.js';
import party from './quests/party.js';
import bell from './quests/bell.js';
import sandwich from './quests/sandwich.js';
import bridge from './quests/bridge.js';
import concert from './quests/concert.js';
import castle from './quests/castle.js';
import lighthouse from './quests/lighthouse.js';
import rainbow from './quests/rainbow.js';
import egg from './quests/egg.js';

// Plaża i Wulkan: otwarte krainy po koncercie w górach. Wszystkie miejsca i przygody naraz.
const PLAZA = [
  { id: 'plaza', label: 'Plaża', icon: 'castleIcon', x: 18, y: 72 },
  { id: 'molo', label: 'Molo', icon: 'boat', x: 40, y: 44 },
  { id: 'rafa', label: 'Rafa', icon: 'octopus', x: 62, y: 74 },
  { id: 'latarnia', label: 'Latarnia', icon: 'lighthouseIcon', x: 82, y: 36 },
];
const WULKAN = [
  { id: 'dzungla', label: 'Dżungla', icon: 'palm', x: 20, y: 70 },
  { id: 'zrodla', label: 'Gorące źródła', icon: 'hotPool', x: 42, y: 44 },
  { id: 'lawa', label: 'Jaskinia lawy', icon: 'redCrystals', x: 62, y: 74 },
  { id: 'krater', label: 'Krater', icon: 'volcanoIcon', x: 82, y: 30 },
];
export const OPEN_QUESTS = [castle, lighthouse, rainbow, egg];

// Miejsca w górach nie mają osobnych przygód: żyją przygodami wieloetapowymi.
// Gwiazdka na miejscu pojawia się po ostatniej górskiej przygodzie (koncercie).
const GORY = [
  { questDone: 'concert', id: 'hala', label: 'Hala', icon: 'sheep', x: 16, y: 74 },
  { questDone: 'concert', id: 'schronisko', label: 'Schronisko', icon: 'hut', x: 36, y: 50 },
  { questDone: 'concert', id: 'jaskinia', label: 'Jaskinia', icon: 'cave', x: 56, y: 74 },
  { questDone: 'concert', id: 'jezioro', label: 'Jezioro', icon: 'kid', x: 70, y: 46 },
  { questDone: 'concert', id: 'szczyt', label: 'Szczyt', icon: 'peak', x: 86, y: 22 },
];

export const REGIONS = {
  dolina: {
    id: 'dolina', title: 'Dolina', theme: 'valley', places: DOLINA,
    gates: [{ to: 'gory', label: 'Góry', icon: 'peak', x: 93, y: 70, after: 'party', lockedText: 'Droga w góry otworzy się po urodzinach kotka.' }],
  },
  gory: {
    id: 'gory', title: 'Góry', theme: 'mountains', places: GORY,
    gates: [
      { to: 'dolina', label: 'Dolina', icon: 'bush', x: 7, y: 40 },
      { to: 'plaza', label: 'Plaża', icon: 'shell', x: 93, y: 64, after: 'concert', lockedText: 'Za górami czeka morze! Droga otworzy się po koncercie na szczycie.' },
    ],
  },
  plaza: {
    id: 'plaza', title: 'Plaża', theme: 'beach', places: PLAZA, open: true,
    gates: [
      { to: 'gory', label: 'Góry', icon: 'peak', x: 7, y: 40 },
      { to: 'wulkan', label: 'Wulkan', icon: 'volcanoIcon', x: 93, y: 66 },
    ],
  },
  wulkan: {
    id: 'wulkan', title: 'Wulkan', theme: 'volcano', places: WULKAN, open: true,
    gates: [{ to: 'plaza', label: 'Plaża', icon: 'shell', x: 7, y: 40 }],
  },
};

export const ALL_PLACES = [...DOLINA, ...GORY, ...PLAZA, ...WULKAN];
export const placeRegion = (placeId) => Object.values(REGIONS).find((r) => r.places.some((p) => p.id === placeId))?.id || 'dolina';

// Kolejność ma znaczenie: pierwsza pasująca przygoda wieloetapowa wygrywa
export const QUESTS = [party, bell, sandwich, bridge, concert];
