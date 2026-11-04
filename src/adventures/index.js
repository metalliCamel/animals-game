// Lista miejsc na mapie i przygód. Nowa przygoda = nowy plik + wpis tutaj.
import yarn from './yarn.js';
import parcel from './parcel.js';
import carrots from './carrots.js';

export const ADVENTURES = { yarn, parcel, carrots };

// x, y w procentach planszy mapy. Miejsce odblokowuje się po przygodzie z `after`.
export const PLACES = [
  { id: 'laka', label: 'Łąka', icon: 'bush', x: 18, y: 70, adventure: 'yarn' },
  { id: 'staw', label: 'Staw', icon: 'duck', x: 42, y: 38, adventure: 'parcel', after: 'yarn' },
  { id: 'farma', label: 'Farma', icon: 'barn', x: 68, y: 66, adventure: 'carrots', after: 'parcel' },
  { id: 'las', label: 'Las', icon: 'tree', x: 84, y: 30, soon: true },
];

// Album: przyjaciel, którego poznaje się w przygodzie. `soon` = jeszcze nie ma tej przygody.
export const FRIENDS = [
  { adventure: 'yarn', art: 'cat', name: 'Kotek', place: 'Łąka', line: 'Kotek bawi się kłębkiem.' },
  { adventure: 'parcel', art: 'duckHat', name: 'Kaczka', place: 'Staw', line: 'Kaczka ma piękny kapelusz.' },
  { adventure: 'carrots', art: 'rabbit', name: 'Królik', place: 'Farma', line: 'Królik ma nowe marchewki.' },
  { soon: true, place: 'Las' },
];
