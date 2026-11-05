// Świat gry: regiony (osobne mapy), ich miejsca i przygody wieloetapowe.
import { PLACES as DOLINA } from './adventures/index.js';
import party from './quests/party.js';
import bell from './quests/bell.js';
import sandwich from './quests/sandwich.js';
import bridge from './quests/bridge.js';
import concert from './quests/concert.js';

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
      { to: null, label: 'Dalej', icon: 'question', x: 93, y: 64, soon: true, lockedText: 'Za górami czeka nowa kraina. Wkrótce tam pójdziemy!' },
    ],
  },
};

export const ALL_PLACES = [...DOLINA, ...GORY];
export const placeRegion = (placeId) => (DOLINA.some((p) => p.id === placeId) ? 'dolina' : 'gory');

// Kolejność ma znaczenie: pierwsza pasująca przygoda wieloetapowa wygrywa
export const QUESTS = [party, bell, sandwich, bridge, concert];
