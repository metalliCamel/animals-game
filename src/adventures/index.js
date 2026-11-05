// Lista miejsc na mapie i przygód. Nowa przygoda = nowy plik + wpis tutaj.
import yarn from './yarn.js';
import parcel from './parcel.js';
import carrots from './carrots.js';
import nuts from './nuts.js';

export const ADVENTURES = { yarn, parcel, carrots, nuts };

// x, y w procentach planszy mapy. Miejsce odblokowuje się po przygodzie z `after`.
export const PLACES = [
  { id: 'laka', label: 'Łąka', icon: 'bush', x: 18, y: 70, adventure: 'yarn' },
  { id: 'staw', label: 'Staw', icon: 'duck', x: 42, y: 38, adventure: 'parcel', after: 'yarn' },
  { id: 'farma', label: 'Farma', icon: 'barn', x: 68, y: 66, adventure: 'carrots', after: 'parcel' },
  { id: 'las', label: 'Las', icon: 'pine', x: 84, y: 30, adventure: 'nuts', after: 'carrots' },
];

// Album: przyjaciel, którego poznaje się w przygodzie. `soon` = jeszcze nie ma tej przygody.
export const FRIENDS = [
  { adventure: 'yarn', art: 'cat', name: 'Kotek', place: 'Łąka', line: 'Kotek bawi się kłębkiem.' },
  { adventure: 'parcel', art: 'duckHat', name: 'Kaczka', place: 'Staw', line: 'Kaczka ma piękny kapelusz.' },
  { adventure: 'carrots', art: 'rabbit', name: 'Królik', place: 'Farma', line: 'Królik ma nowe marchewki.' },
  { adventure: 'nuts', art: 'squirrel', name: 'Wiewiórka', place: 'Las', line: 'Wiewiórka ma zapasy na zimę.' },
  { adventure: 'bell', art: 'sheepBell', name: 'Owieczka', place: 'Góry', line: 'Owieczka ma swój dzwonek.' },
  { adventure: 'bell', art: 'marmot', name: 'Świstak', place: 'Góry', line: 'Świstak ma ciepły sweterek z wełny.' },
  { adventure: 'bell', art: 'eagle', name: 'Orlica', place: 'Góry', line: 'Orlica ma piękny kryształ.' },
  { adventure: 'sandwich', art: 'fox', name: 'Lis', place: 'Góry', line: 'Lis z jaskini teraz zawsze pyta, zanim coś weźmie.' },
  { adventure: 'sandwich', art: 'magpie', name: 'Sroka', place: 'Góry', line: 'Sroka ze szczytu lubi błyszczące rzeczy.' },
  { adventure: 'bridge', art: 'chamois', name: 'Kozica', place: 'Góry', line: 'Kozica gra na bębenku.' },
  { adventure: 'bridge', art: 'kid', name: 'Koziołek', place: 'Góry', line: 'Koziołek lubi skakać po kamieniach.' },
  { adventure: 'concert', art: 'bat', name: 'Nietoperz', place: 'Góry', line: 'Nietoperz słyszy każdy dźwięk w jaskini.' },
  { adventure: 'castle', art: 'crab', name: 'Krab', place: 'Plaża', line: 'Krab buduje najpiękniejsze zamki z piasku.' },
  { adventure: 'castle', art: 'seal', name: 'Foka', place: 'Plaża', line: 'Foka lubi zjeżdżać po piasku.' },
  { adventure: 'castle', art: 'gull', name: 'Mewa', place: 'Plaża', line: 'Mewa widzi z góry całe morze.' },
  { adventure: 'castle', art: 'penguin', name: 'Pingwin', place: 'Plaża', line: 'Pingwin lubi chłodną wodę.' },
  { adventure: 'lighthouse', art: 'pelican', name: 'Pelikan', place: 'Plaża', line: 'Pelikan łowi ryby z łódki.' },
  { adventure: 'lighthouse', art: 'octopus', name: 'Ośmiornica', place: 'Plaża', line: 'Ośmiornica ma osiem rączek do pomagania.' },
  { adventure: 'lighthouse', art: 'salamander', name: 'Salamandra', place: 'Wulkan', line: 'Salamandra mieszka w ciepłej jaskini lawy.' },
  { adventure: 'rainbow', art: 'iguana', name: 'Legwan', place: 'Wulkan', line: 'Legwan pilnuje wulkanu.' },
  { adventure: 'rainbow', art: 'monkey', name: 'Małpka', place: 'Wulkan', line: 'Małpka uwielbia banany.' },
  { adventure: 'egg', art: 'tortoise', name: 'Żółw', place: 'Wulkan', line: 'Żółw ma sto lat i wszystko wie.' },
  { adventure: 'egg', art: 'parrot', name: 'Papuga', place: 'Wulkan', line: 'Papuga jest kolorowa jak tęcza.' },
  { adventure: 'egg', art: 'chick', name: 'Papużka', place: 'Wulkan', line: 'Mała papużka dopiero uczy się latać.' },
];
