# Pies na Tropie

Przygodowa gra w przeglądarce dla Hani (6 lat). Piesek, któremu Hania sama nadaje imię, pomaga zwierzętom: szuka zgubionych rzeczy, dostarcza paczki i rozwiązuje proste zagadki.

## Zasady projektowe

- Sterowanie tylko myszką (klik = piesek tam idzie).
- Teksty krótkie, drukowanymi literami, zawsze czytane na głos (Web Speech API, `pl-PL`).
- Nie da się przegrać. Zamiast kar są podpowiedzi.
- Przygody po 5–10 minut, z nagrodą na końcu.

## Uruchomienie

```bash
npm install
npm run dev      # lokalnie na http://localhost:5173
npm run build    # build do dist/
```

## Deploy

Vercel wykrywa Vite automatycznie: zaimportuj repo w Vercel (Framework: Vite, build: `npm run build`, output: `dist`). Każdy push na `main` publikuje nową wersję.

## Struktura

- `src/scene.js` – silnik przygody (ruch pieska, dymki, podpowiedzi, wygrana)
- `src/map.js` – mapa świata i odblokowywanie miejsc
- `src/adventures/` – jedna przygoda = jeden plik; lista miejsc w `index.js`
- `src/quests/` – przygody wieloetapowe: scena dla każdego miejsca, stan w `save.flags`, funkcja `todo` do znaczników na mapie
- `src/art.js` – grafiki postaci (SVG)
- `src/save.js` – zapis postępu w przeglądarce

## Przygody

1. **Zgubiony kłębek** (Łąka) – kotek zgubił kłębek wełny w krzaczkach.
2. **Paczka dla kaczki** (Staw) – sowa listonoszka prosi o dostarczenie paczki; adresata pokazuje obrazek na paczce.
3. **Kto zjadł marchewki?** (Farma) – zagadka: ślady kopytek i druga wskazówka (biała sierść albo błoto) wskazują sprawcę, losowo kozę albo świnkę.

4. **Orzechy na zimę** (Las) – zebranie trzech orzechów do plecaka i oddanie ich wiewiórce.

5. **Urodziny kotka** (wszystkie miejsca) – przygoda wieloetapowa po ukończeniu lasu. Zaproszenia od kotka trzeba roznieść kaczce, królikowi i wiewiórce, jajka są w gniazdku na farmie, a kwiatki daje żabka w zamian za czerwonego grzybka z lasu. Na końcu przyjęcie na łące. Baloniki na mapie pokazują, gdzie jest coś do zrobienia.

Album przyjaciół (z mapy) zbiera zwierzątka z ukończonych przygód.

## Plecak

Trwały ekwipunek pieska (`save.bag`), wspólny dla wszystkich miejsc i zapisywany w przeglądarce. W przygodzie:

- `api.bag.add('nut', 'log')` – przedmiot leci z miejsca na planszy do plecaka,
- `api.bag.has(id, n)`, `api.bag.count(id)`, `api.bag.take(id, n)`,
- `api.held` – przedmiot, który dziecko wyjęło z plecaka i piesek trzyma w pysku.

Nowe przedmioty dopisuje się w `src/items.js`. Na plecaku opierają się przyszłe przygody wieloetapowe, w których coś znalezione w jednym miejscu rozwiązuje zagadkę w innym (do tego służy też `save.flags`).
