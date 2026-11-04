// Świat gry: regiony (osobne mapy), ich miejsca i przygody wieloetapowe.
import { PLACES as DOLINA } from './adventures/index.js';
import party from './quests/party.js';
import bell from './quests/bell.js';

// Miejsca w górach nie mają osobnych przygód: żyją przygodą wieloetapową „Dzwonek owieczki”.
const GORY = [
  { questDone: 'bell', id: 'hala', label: 'Hala', icon: 'sheep', x: 18, y: 72 },
  { questDone: 'bell', id: 'schronisko', label: 'Schronisko', icon: 'hut', x: 42, y: 50 },
  { questDone: 'bell', id: 'jaskinia', label: 'Jaskinia', icon: 'cave', x: 66, y: 72 },
  { questDone: 'bell', id: 'szczyt', label: 'Szczyt', icon: 'peak', x: 82, y: 26 },
];

export const REGIONS = {
  dolina: {
    id: 'dolina', title: 'Dolina', theme: 'valley', places: DOLINA,
    gate: { to: 'gory', label: 'Góry', icon: 'peak', x: 93, y: 70, after: 'party', lockedText: 'Droga w góry otworzy się po urodzinach kotka.' },
  },
  gory: {
    id: 'gory', title: 'Góry', theme: 'mountains', places: GORY,
    gate: { to: 'dolina', label: 'Dolina', icon: 'bush', x: 7, y: 40 },
  },
};

export const ALL_PLACES = [...DOLINA, ...GORY];
export const placeRegion = (placeId) => (DOLINA.some((p) => p.id === placeId) ? 'dolina' : 'gory');

// Kolejność ma znaczenie: pierwsza pasująca przygoda wieloetapowa wygrywa
export const QUESTS = [party, bell];
