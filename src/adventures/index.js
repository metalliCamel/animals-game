// Lista miejsc na mapie i przygód. Nowa przygoda = nowy plik + wpis tutaj.
import yarn from './yarn.js';
import parcel from './parcel.js';

export const ADVENTURES = { yarn, parcel };

// x, y w procentach planszy mapy. Miejsce odblokowuje się po przygodzie z `after`.
export const PLACES = [
  { id: 'laka', label: 'Łąka', icon: 'bush', x: 18, y: 70, adventure: 'yarn' },
  { id: 'staw', label: 'Staw', icon: 'duck', x: 42, y: 38, adventure: 'parcel', after: 'yarn' },
  { id: 'farma', label: 'Farma', icon: 'barn', x: 68, y: 66, soon: true },
  { id: 'las', label: 'Las', icon: 'tree', x: 84, y: 30, soon: true },
];
