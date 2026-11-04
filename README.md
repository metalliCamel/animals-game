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
- `src/art.js` – grafiki postaci (SVG)
- `src/save.js` – zapis postępu w przeglądarce

## Przygody

1. **Zgubiony kłębek** (Łąka) – kotek zgubił kłębek wełny w krzaczkach.
2. **Paczka dla kaczki** (Staw) – sowa listonoszka prosi o dostarczenie paczki; adresata pokazuje obrazek na paczce.

Wkrótce: Farma, Las.
