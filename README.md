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

## Góry

Drugi region, otwierany drogowskazem na mapie doliny po urodzinach kotka. Miejsca: Hala, Schronisko, Jaskinia, Szczyt.

6. **Dzwonek owieczki** (góry) – owieczka zgubiła dzwonek. Wełna od owieczki → świstak w schronisku daje za nią latarkę → latarka rozświetla ciemną jaskinię, nietoperz zdradza, że dzwonek zabrała orlica, a w jaskini leży kryształ → orlica na szczycie wymienia dzwonek na kryształ → dzwonek wraca na halę.

7. **Kto podkrada kanapki?** – zagadka detektywistyczna. Okruszki ze stolika świstaka prowadzą nad jezioro, na kamieniu jest wskazówka (rude futerko albo czarno-białe pióro, losowo), a kozica podpowiada, kto takie ma. Podejrzani: lis w jaskini i sroka na szczycie. Sprawca był głodny, więc Hania dzieli się z nim kanapką, a on oddaje koszyk.
8. **Mostek dla koziołka** – burza zepsuła mostek nad strumieniem. Deska ze schroniska (trzeba wybrać najdłuższą), lina od owieczek na hali (najpierw znaleźć schowane jagniątko) i dwa płaskie kamienie z jaskini (płaskie, nie okrągłe). Mostek rośnie z każdą częścią, a na końcu koziołek przechodzi do mamy.
9. **Koncert na szczycie** – orlica daje nutki-zaproszenia dla owieczki (dzwonek), kozicy (bębenek) i świstaka, który zgubił gwizdek. Gwizdka szuka się słuchem w jaskini. Na koniec gra pamięciowa o zachodzie słońca: muzycy grają melodię, a Hania ją powtarza (2, 3 i 4 dźwięki). Ta przygoda zamyka góry.

Miejsca w górach: Hala, Schronisko, Jaskinia, Jezioro, Szczyt. Drogowskaz „Dalej” czeka na następną krainę.

Regiony i ich miejsca są w `src/world.js`, przygody wieloetapowe w `src/quests/`. Wspólny wygląd górskich miejsc i spokojne sceny (gdy w miejscu nie ma zadania) są w `src/quests/mountains.js`. Dźwięki instrumentów są generowane w `src/sound.js` (Web Audio, bez plików).

## Zapisy

- Ekran startowy: **Graj dalej** (ostatni zapis), **Nowa gra**, **Wczytaj grę**.
- Trzy niezależne zapisy, każdy z własnym pieskiem. Usuwanie i zastępowanie pytają o potwierdzenie na stronie.
- Gra zapisuje się sama przy każdej zmianie: miejsce, w którym jest piesek, plecak i postęp każdej przygody. Po wyjściu w połowie (przycisk Menu, zamknięcie karty) **Graj dalej** wraca dokładnie do tej samej sceny.
- Zapis z pierwszej wersji gry jest automatycznie przenoszony do pierwszego miejsca.

## Plaża i Wulkan (otwarte krainy)

Otwierają się po koncercie w górach: drogowskaz „Plaża” na mapie gór, a z plaży drogowskaz „Wulkan”. W środku wszystkie miejsca i wszystkie cztery przygody są dostępne od razu i można je robić w dowolnej kolejności. Przedmioty krążą między krainami.

- **Plaża:** Plaża (krab, zamek z piasku), Molo (pelikan, mewa), Rafa (ośmiornica, pingwin), Latarnia (foka).
- **Wulkan:** Dżungla (papuga, małpka), Gorące źródła (żółw), Jaskinia lawy (salamandra), Krater (legwan, wulkan).

Przygody:

10. **Kto zburzył zamek?** – trzech podejrzanych (foka, mewa, pingwin), sprawca losowy. Każda wskazówka (ma dziób / nie lata / jest szary) wyklucza jedno zwierzątko, więc trzeba zebrać dwie. Wskazówki są w dwóch z trzech miejsc (zamek, pelikan, ośmiornica), trzecie nic nie wie. Na końcu zamek buduje się od największej części.
11. **Latarnia nie świeci** – trzy kawałki szybki o różnych kształtach: trójkąt zakopany w piasku, kwadrat za policzenie ryb u pelikana, koło od papugi w zamian za muszlę od ośmiornicy. Każdy kawałek pasuje tylko do swojego miejsca w ramce. Ognisty kamyk od salamandry trzeba nieść w wiaderku kraba.
12. **Tęczowy wybuch** – małpka daje bambus za dokładnie tyle bananów, ile pokazuje. Bambusem zdejmuje się głaz z wulkanu. Trzy kolorowe kamienie (lawa, źródła, rafa) trzeba dać wulkanowi w kolejności z malowidła w jaskini lawy.
13. **Jajko papugi** – gra „ciepło–zimno” w paprociach, potem gniazdko w ciepłym piasku: liście od małpki, białe piórko od mewy (nie szare, nie czarne), jajko. Trzy kliknięcia ogrzewają jajko i wykluwa się pisklę.

Na mapach obu krain jest **tablica zadań**: każda przygoda z listą postępu i obrazkami miejsc, gdzie teraz trzeba iść.

Technicznie: `src/quests/islands.js` trzyma plansze ośmiu miejsc i składa jedną scenę z „części” wszystkich aktywnych przygód. Każda część rejestruje reakcje `talk` (rozmowa), `item` (podany przedmiot), `intro`, `hint` i `hold`, z priorytetami. Ważne reakcje mają priorytet 0 lub wyższy, a przypomnienia ujemny, żeby nie zasłaniały innych przygód.

## Lista zadań i mowa

- **Co trzeba zrobić?** – pasek zadania u góry każdej sceny (z ikonką listy) i lista zadania na mapie są klikalne. Otwierają okienko z każdym potrzebnym przedmiotem i krokiem: obrazek, podpis, znaczek ✓ (mam), ✕ (odpada) albo szare tło (jeszcze nie), oraz miejsca, do których trzeba teraz iść. Kliknięcie nazwy zadania albo przedmiotu czyta je na głos. W Plaży i Wulkanie to samo okienko otwiera przycisk „Zadania” na mapie. Podpisy pochodzą z pola `label` w `checklist()` każdej przygody.
- **Mowa w kolejce** (`src/speech.js`) – kwestie nie przerywają się nawzajem ani przy zmianie ekranu. Czekać mogą najwyżej dwie (starsze oczekujące są pomijane, bieżąca zawsze kończy się w całości). Dymek pokazuje się, gdy zaczyna się czytanie jego tekstu. Długie teksty są dzielone na zdania (obejście ucinania mowy w Chrome). Gdy syntezator nie ruszy w ciągu sekundy, gra tylko odmierza czas czytania.
