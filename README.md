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

## Przygody

1. **Zgubiony kłębek** – kotek zgubił kłębek wełny w krzaczkach.
