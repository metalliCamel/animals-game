// Przygoda 1: Zgubiony kłębek (łąka). Typ: znajdź i przynieś.
export default {
  id: 'yarn',
  title: 'Zgubiony kłębek',
  bg: 'meadow',
  walk: { maxB: 40, click: 48 },
  dog: { x: 22, b: 10 },
  sticker: 'yarn',
  winText: 'Kotek ma swój kłębek. Dostajesz gwiazdkę pomocnika!',
  entities: [
    { id: 'tree', art: 'tree', x: 11, b: 38, w: 22, deco: true },
    { id: 'b0', art: 'bush', x: 30, b: 30, w: 16, label: 'Krzak' },
    { id: 'b1', art: 'bush', x: 52, b: 14, w: 16, label: 'Krzak' },
    { id: 'b2', art: 'bush', x: 66, b: 34, w: 16, label: 'Krzak' },
    { id: 'cat', art: 'cat', x: 86, b: 22, w: 11, label: 'Kotek' },
  ],
  start(api) {
    const n = api.name;
    // Stan jest zapisywany, więc po powrocie wszystko jest tam, gdzie było
    const st = api.state;
    const resumed = !!st.hide;
    if (!st.hide) { st.hide = 'b' + api.random(3); st.searched = []; api.saveState(); }
    const hide = st.hide;
    let done = false;
    st.searched.forEach((id) => api.fade(id));

    if (st.found) {
      api.carry('yarn');
      api.chip('yarn', 'Zanieś kotkowi');
      api.say('dog', 'Do kotka!', 'Hau! Mamy kłębek. Zanieśmy go kotkowi!', 'yarn');
      api.hint('cat', 'Do kotka!', 'Zanieś kłębek kotkowi!', 'dog');
    } else {
      api.chip('yarn', 'Znajdź kłębek');
      if (resumed) {
        api.say('cat', 'Szukamy dalej!', `Miau! Wróciłeś, ${n}! Szukajmy dalej mojego kłębka w krzaczkach.`, 'yarn');
      } else {
        api.say('dog', `Hau! Jestem ${n}!`, `Hau hau! Jestem ${n}! Kliknij gdzieś na trawie, a tam pobiegnę.`);
        api.later(4800, () => api.say('cat', 'Zgubiłam kłębek!', `Miau! Cześć, ${n}! Zgubiłam mój kłębek wełny. Pomożesz mi go znaleźć w krzaczkach?`, 'yarn'));
      }
      api.hint(hide, 'Słyszę szelest!', 'Psst! Ten krzaczek się rusza. Zajrzyj tam!', 'cat');
    }

    const nope = [
      ['Tu nic nie ma', 'Hmm, tu nic nie ma. Szukaj dalej!'],
      ['Pusto', 'Pusto! Może w innym krzaczku?'],
      ['Tylko liście', 'Tylko liście. Szukajmy dalej!'],
    ];

    for (const id of ['b0', 'b1', 'b2']) {
      api.on(id, async () => {
        api.shake(id);
        if (st.found) { api.say('dog', 'Do kotka!', 'Mam już kłębek. Zanieśmy go kotkowi!', 'yarn'); return; }
        if (id !== hide) {
          api.fade(id);
          if (!st.searched.includes(id)) { st.searched.push(id); api.saveState(); }
          const [s, f] = api.pick(nope); api.say('dog', s, f); return;
        }
        st.found = true;
        api.saveState();
        api.hint('cat', 'Do kotka!', 'Zanieś kłębek kotkowi!', 'dog');
        api.sparkles(id);
        await api.popOut(id, 'yarn');
        api.carry('yarn');
        api.chip('yarn', 'Zanieś kotkowi');
        api.say('dog', 'Jest kłębek!', 'Hura! Jest kłębek! Zanieśmy go kotkowi.', 'yarn');
      });
    }

    api.on('cat', () => {
      if (done) return;
      if (api.carrying !== 'yarn') {
        api.say('cat', 'Gdzie kłębek?', 'Miau! Mój kłębek jest gdzieś w krzaczkach. Poszukasz?', 'yarn');
        return;
      }
      done = true;
      api.carry(null);
      api.hop('cat');
      api.sparkles('cat', '#E2525C');
      api.sparkles('cat');
      api.chip('yarn', 'Gotowe!', true);
      api.say('cat', `Dziękuję, ${n}!`, `Mrrr! Dziękuję, ${n}! Jesteś super pomocnikiem!`, 'yarn');
      api.win(3200);
    });
  },
};
