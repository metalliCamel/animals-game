// Przygoda 2: Paczka dla kaczki (staw). Typ: dostarcz właściwej osobie.
// Na paczce jest rysunek adresata, więc dziecko „czyta” obrazek, a nie napis.
export default {
  id: 'parcel',
  title: 'Paczka dla kaczki',
  bg: 'pond',
  walk: { maxB: 25, click: 40 },
  dog: { x: 30, b: 8 },
  sticker: 'duckHat',
  winText: 'Kaczka ma nowy kapelusz. Dostajesz gwiazdkę listonosza!',
  entities: [
    { id: 'reeds1', art: 'reeds', x: 34, b: 38, w: 6, deco: true },
    { id: 'reeds2', art: 'reeds', x: 95, b: 36, w: 6, deco: true },
    { id: 'owl', art: 'owl', x: 12, b: 16, w: 12, label: 'Sowa listonoszka' },
    { id: 'duck', art: 'duck', x: 58, b: 34, w: 13, label: 'Kaczka' },
    { id: 'frog', art: 'frog', x: 80, b: 30, w: 12, label: 'Żabka' },
    { id: 'hedgehog', art: 'hedgehog', x: 46, b: 10, w: 13, label: 'Jeżyk' },
  ],
  start(api) {
    const n = api.name;
    let got = false;
    let done = false;

    api.chip('parcel', 'Odbierz paczkę');
    api.say('dog', 'Jaki ładny staw!', `Hau! Ale ładny staw! Ciekawe, kto tu mieszka.`);
    api.later(3800, () => api.say('owl', 'Mam paczkę!', `Huu huu! Jestem sowa listonoszka. Mam paczkę, ale zmęczyły mi się skrzydełka. Pomożesz mi, ${n}?`, 'parcel'));
    api.hint('owl', 'Tutaj!', 'Huu huu! Tutaj jestem, przy pieńku. Kliknij mnie!');

    api.on('owl', () => {
      if (done) { api.say('owl', 'Dziękuję!', 'Huu! Dziękuję za pomoc!'); return; }
      if (got) { api.say('owl', 'Kto na rysunku?', 'Zanieś paczkę. Popatrz, kto jest narysowany na paczce!', 'duckIcon'); return; }
      got = true;
      api.carry('parcel');
      api.hop('owl');
      api.chip('duckIcon', 'Zanieś paczkę');
      api.say('owl', 'Spójrz na rysunek!', 'Dziękuję! Spójrz na paczkę. Narysowałam na niej, dla kogo jest!', 'duckIcon');
      api.hint('duck', 'Kwa kwa!', 'Kwa kwa! Czy ktoś ma paczkę dla mnie?');
    });

    const others = {
      frog: {
        idle: ['Kum kum!', 'Kum kum! Cześć! Lubię skakać po liściach.'],
        wrong: ['Nie dla mnie!', 'Kum kum! To nie dla mnie. Na paczce jest ktoś inny!'],
      },
      hedgehog: {
        idle: ['Cześć!', 'Prych prych! Cześć! Szukam jabłuszek.'],
        wrong: ['Nie dla mnie!', 'Prych! To nie dla mnie. Popatrz na rysunek!'],
      },
    };
    for (const id of Object.keys(others)) {
      api.on(id, () => {
        const [s, f] = api.carrying === 'parcel' ? others[id].wrong : others[id].idle;
        api.shake(id);
        api.say(id, s, f, api.carrying === 'parcel' ? 'duckIcon' : null);
      });
    }

    api.on('duck', async () => {
      if (done) { api.say('duck', 'Kwa kwa!', 'Kwa kwa! Podoba ci się mój kapelusz?'); return; }
      if (api.carrying !== 'parcel') {
        api.say('duck', 'Czekam na paczkę', 'Kwa kwa! Czekam na paczkę od sowy. Ciekawe, gdzie ona jest?', 'parcel');
        return;
      }
      done = true;
      api.carry(null);
      api.sparkles('duck');
      api.say('duck', 'To dla mnie!', `Kwa kwa! To dla mnie! Dziękuję, ${n}!`, 'parcel');
      await api.wait(1600);
      api.setArt('duck', 'duckHat');
      api.hop('duck');
      api.sparkles('duck', '#E2525C');
      api.chip('duckIcon', 'Gotowe!', true);
      api.say('duck', 'Nowy kapelusz!', 'Ojej! Nowy kapelusz! Jestem najładniejszą kaczką na stawie!');
      api.win(3400);
    });
  },
};
