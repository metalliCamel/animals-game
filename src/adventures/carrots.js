// Przygoda 3: Kto zjadł marchewki? (farma). Typ: zagadka.
// Dwie wskazówki zawężają podejrzanych. Sprawca jest losowany (koza albo świnka),
// więc za każdym razem trzeba patrzeć na wskazówki, a nie zgadywać z pamięci.
export default {
  id: 'carrots',
  title: 'Kto zjadł marchewki?',
  bg: 'farm',
  walk: { maxB: 34, click: 46 },
  dog: { x: 40, b: 6 },
  sticker: 'carrot',
  winText: 'Zagadka rozwiązana! Dostajesz gwiazdkę detektywa!',
  entities: [
    { id: 'barn', art: 'barn', x: 84, b: 44, w: 20, deco: true },
    { id: 'tree', art: 'tree', x: 6, b: 42, w: 14, deco: true },
    { id: 'rabbit', art: 'rabbit', x: 13, b: 20, w: 9, label: 'Królik' },
    { id: 'patch', art: 'patchEmpty', x: 28, b: 12, w: 20, label: 'Grządka z marchewkami' },
    { id: 'fence', art: 'fence', x: 60, b: 36, w: 14, label: 'Płotek' },
    { id: 'chicken', art: 'chicken', x: 46, b: 26, w: 8, label: 'Kura' },
    { id: 'pig', art: 'pig', x: 72, b: 12, w: 14, label: 'Świnka' },
    { id: 'goat', art: 'goat', x: 88, b: 20, w: 12, label: 'Koza' },
  ],
  start(api) {
    const n = api.name;
    const culprit = api.pick(['goat', 'pig']);
    const clueB = culprit === 'goat'
      ? { art: 'fur', fence: 'fenceFur', short: 'Biała sierść!', full: 'Na płotku jest biała sierść! Kto ma białą sierść?' }
      : { art: 'mud', fence: 'fenceMud', short: 'Błoto!', full: 'Na płotku jest błoto! Kto lubi chlapać się w błocie?' };
    let gotA = false;
    let gotB = false;
    let done = false;

    api.setArt('fence', clueB.fence);
    api.chip('magnifier', 'Szukaj wskazówek');
    api.say('rabbit', 'Gdzie marchewki?', 'Ojej! Ktoś zjadł wszystkie moje marchewki! Kto to zrobił?', 'carrot');
    api.later(4600, () => api.say('dog', 'Jestem detektywem!', `Hau! Jestem ${n}, psi detektyw! Poszukajmy wskazówek. Zacznijmy od grządki.`, 'magnifier'));
    api.hint('patch', 'Zajrzyj na grządkę', 'Psst! Obwąchaj grządkę z marchewkami!', 'rabbit');

    function nextHint() {
      if (!gotA) api.hint('patch', 'Zajrzyj na grządkę', 'Obwąchaj grządkę z marchewkami!', 'rabbit');
      else if (!gotB) api.hint('fence', 'Płotek!', 'Coś jest na płotku. Zobacz!', 'rabbit');
      else api.hint(culprit, 'Kto to był?', 'Popatrz na wskazówki u góry. Kto pasuje?', 'rabbit');
    }

    function bothFound() {
      api.chip('magnifier', 'Kto to zrobił?');
      api.later(2800, () => api.say('dog', 'Kto to zrobił?', 'Mamy dwie wskazówki! Kliknij zwierzątko, które zjadło marchewki.', 'magnifier'));
    }

    api.on('patch', () => {
      if (done) { api.say('rabbit', 'Rosną!', 'Moje marchewki znowu rosną!', 'carrot'); return; }
      if (gotA) { api.say('dog', 'Już tu byliśmy', 'Tu już znaleźliśmy ślady kopytek.', 'hoof'); return; }
      gotA = true;
      api.shake('patch');
      api.spawn('trail', 'hoofTrail', 50, 9, 24);
      api.clue('hoof');
      api.sparkles('patch');
      api.say('dog', 'Ślady kopytek!', 'Niuch niuch! Ślady kopytek! Kto ma kopytka?', 'hoof');
      if (gotB) bothFound();
      nextHint();
    });

    api.on('fence', () => {
      if (done) return;
      if (gotB) { api.say('dog', 'Już to mamy', 'Tę wskazówkę już mamy.', clueB.art); return; }
      gotB = true;
      api.shake('fence');
      api.clue(clueB.art);
      api.sparkles('fence');
      api.say('dog', clueB.short, clueB.full, clueB.art);
      if (gotA) bothFound();
      nextHint();
    });

    api.on('rabbit', () => {
      if (done) { api.say('rabbit', 'Dziękuję!', `Dziękuję, ${n}! Jesteś super detektywem!`, 'carrot'); return; }
      api.say('rabbit', 'Pomóż mi!', 'Pomóż mi znaleźć, kto zjadł marchewki. Szukaj wskazówek!', 'magnifier');
    });

    const idle = {
      chicken: ['Ko ko!', 'Ko ko! Nic nie widziałam. Szukaj wskazówek!'],
      pig: ['Chrum chrum!', 'Chrum chrum! Ja tylko leżałam w błotku.'],
      goat: ['Mee!', 'Mee! Ja tylko skubałam trawkę.'],
    };
    const notMe = {
      chicken: ['To nie ja!', 'Ko ko! To nie ja! Ja mam pazurki, a nie kopytka.'],
      pig: ['To nie ja!', 'Chrum! To nie ja! Ja nie mam białej sierści.'],
      goat: ['To nie ja!', 'Mee! To nie ja! Ja nie chlapię się w błocie.'],
    };

    for (const id of ['chicken', 'pig', 'goat']) {
      api.on(id, async () => {
        if (done) { api.say(id, ...idle[id]); return; }
        api.shake(id);
        if (!gotA || !gotB) { api.say(id, idle[id][0], idle[id][1]); return; }
        if (id !== culprit) { api.fade(id); api.say(id, ...notMe[id]); return; }
        done = true;
        api.hint(null);
        api.say(id, 'To ja...', `${id === 'goat' ? 'Mee' : 'Chrum'}... To ja. Przepraszam! Były takie pyszne. Pomogę posadzić nowe!`, 'carrot');
        await api.wait(3800);
        api.setArt('patch', 'patchFull');
        api.sparkles('patch', '#F08A24');
        api.sparkles('patch');
        api.hop('rabbit');
        api.chip('carrot', 'Gotowe!', true);
        api.say('rabbit', 'Hura! Marchewki!', `Hura! Nowe marchewki! Dziękuję, ${n}! Jesteś super detektywem!`, 'carrot');
        api.win(3600);
      });
    }
  },
};
