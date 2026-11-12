const results = document.querySelector('#results');
const status = document.querySelector('#status');
let audioElements = [];
let audioCleanups = [];
const POS = { noun: 'sustantivo', verb: 'verbo', adjective: 'adjetivo', adverb: 'adverbio', pronoun: 'pronombre', preposition: 'preposición', conjunction: 'conjunción', interjection: 'interjección', exclamation: 'exclamación', determiner: 'determinante', other: 'otra categoría' };

function node(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text; // La API nunca se interpreta como HTML.
  return element;
}
function wordButton(word, onSearch) {
  const button = node('button', 'word-link', word);
  button.type = 'button'; button.lang = 'en';
  button.addEventListener('click', () => onSearch(word));
  return button;
}
export function announce(message) { status.textContent = message; }
export function stopAudio() {
  audioCleanups.forEach(dispose => dispose());
  audioCleanups = [];
  audioElements.forEach(audio => { audio.pause(); audio.removeAttribute('src'); audio.load(); });
  audioElements = [];
}
function clear() { stopAudio(); results.replaceChildren(); results.setAttribute('aria-busy', 'false'); }

export function renderInitial(onSearch) {
  clear();
  const section = node('section', 'empty-state');
  const glyph = node('span', 'empty-glyph', 'Aa'); glyph.setAttribute('aria-hidden', 'true');
  section.append(glyph, node('h2', '', 'Tu próxima palabra está aquí.'), node('p', '', 'Escribe en el buscador o empieza con una de estas palabras.'));
  const suggestions = node('div', 'suggestions');
  ['serendipity', 'hello', 'learn'].forEach(word => suggestions.append(wordButton(word, onSearch)));
  section.append(suggestions); results.append(section);
}
export function renderLoading(word) {
  clear(); results.setAttribute('aria-busy', 'true');
  const section = node('section', 'state-message');
  const heading = node('h2', '', 'Buscando tu palabra…');
  const dot = node('span', 'loading-dot'); dot.setAttribute('aria-hidden', 'true'); heading.prepend(dot);
  section.append(heading, node('p', '', `Consultando «${word}» en Dictionary API.`)); results.append(section);
  announce(`Buscando ${word}.`);
}
export function renderError(kind, message, onRetry) {
  clear();
  const section = node('section', 'state-message');
  section.append(node('h2', '', kind === 'not-found' ? 'Una palabra por descubrir.' : 'No pudimos completar la búsqueda.'), node('p', '', message));
  if (kind !== 'not-found') {
    const retry = node('button', 'word-link', 'Volver a intentar'); retry.type = 'button';
    retry.addEventListener('click', onRetry); section.append(retry);
  }
  results.append(section); announce(message);
}
function audioControl(entry, index) {
  const group = node('div', 'audio-control');
  const choices = entry.pronunciations || (entry.audio ? [{ url: entry.audio }] : []);
  if (!choices.length) { group.append(node('p', 'audio-note', 'Sin audio disponible')); return group; }
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', `Pronunciaciones de ${entry.word}`);
  const audio = document.createElement('audio');
  audio.preload = 'none'; audio.src = choices[0].url; audio.hidden = true;
  audioElements.push(audio);
  const label = node('label', 'audio-label', 'Pronunciación');
  const select = document.createElement('select'); select.className = 'audio-select';
  select.id = `pronunciation-${index}`; label.htmlFor = select.id;
  choices.forEach((choice, i) => {
    const option = node('option', '', `${i + 1} de ${choices.length}${choice.text ? ` · ${choice.text}` : ''}`);
    option.value = String(i); select.append(option);
  });
  const button = node('button', 'audio-button', '▶ Escuchar'); button.type = 'button';
  button.setAttribute('aria-label', `Escuchar pronunciación de ${entry.word}`);
  const message = node('p', 'audio-message'); message.id = `audio-message-${index}`;
  message.setAttribute('role', 'status'); message.setAttribute('aria-atomic', 'true');
  button.setAttribute('aria-describedby', message.id); select.setAttribute('aria-describedby', message.id);
  let generation = 0; let alive = true; let busy = false; let cancelAttempt;
  function reset() {
    busy = false; button.setAttribute('aria-disabled', 'false');
    group.setAttribute('aria-busy', 'false'); button.textContent = '▶ Escuchar';
  }
  function cancel() {
    generation++; cancelAttempt?.(); cancelAttempt = undefined;
    audio.pause(); reset();
  }
  audioCleanups.push(() => { alive = false; cancel(); });
  // aria-disabled conserva el foco; la guarda busy evita duplicados por teclado/click.
  reset();
  select.addEventListener('change', () => {
    cancel(); audio.src = choices[Number(select.value)].url;
    message.textContent = 'Pronunciación seleccionada. Pulsa Escuchar.';
  });
  audio.addEventListener('ended', () => { if (alive && !busy) reset(); });
  audio.addEventListener('error', () => {
    if (alive && !busy && audio.hasAttribute('src')) {
      message.textContent = 'No se pudo reproducir el audio. Puedes volver a intentarlo.'; reset();
    }
  });
  function playAttempt() {
    return new Promise((resolve, reject) => {
      let settled = false;
      const finish = error => {
        if (settled) return;
        settled = true;
        clearTimeout(timer); audio.removeEventListener('error', failed);
        cancelAttempt = undefined; error ? reject(error) : resolve();
      };
      const failed = () => finish(new Error('media-error'));
      const timer = setTimeout(() => finish(new Error('media-timeout')), 8000);
      cancelAttempt = () => finish(new DOMException('cancelled', 'AbortError'));
      audio.addEventListener('error', failed, { once: true });
      try { Promise.resolve(audio.play()).then(() => finish(), finish); } catch (error) { finish(error); }
    });
  }
  button.addEventListener('click', async () => {
    if (busy || !alive) return;
    cancel(); const current = generation; busy = true;
    button.setAttribute('aria-disabled', 'true'); group.setAttribute('aria-busy', 'true');
    button.textContent = 'Reproduciendo…'; message.textContent = '';
    audioElements.forEach(other => { if (other !== audio) { other.pause(); other.dispatchEvent(new Event('ended')); } });
    const start = Number(select.value);
    for (let offset = 0; offset < choices.length; offset++) {
      if (!alive || current !== generation) return;
      const selected = (start + offset) % choices.length;
      select.value = String(selected); audio.src = choices[selected].url;
      audio.currentTime = 0;
      try {
        await playAttempt();
        if (!alive || current !== generation) return;
        busy = false; group.setAttribute('aria-busy', 'false');
        button.setAttribute('aria-disabled', 'false'); button.textContent = '▶ Escuchar';
        message.textContent = offset ? `Reproduciendo alternativa ${selected + 1} de ${choices.length}.` : '';
        return;
      } catch (error) {
        if (!alive || current !== generation) return;
        audio.pause();
        if (error.name === 'NotAllowedError') {
          message.textContent = 'El navegador bloqueó el audio. Pulsa Escuchar para reintentar.'; reset(); return;
        }
      }
    }
    message.textContent = 'No se pudo reproducir el audio. Se probaron todas las alternativas. Puedes volver a intentarlo.';
    reset();
  });
  if (choices.length > 1) group.append(label, select);
  group.append(button, audio, message); return group;
}
export function renderEntries(entries, onSearch) {
  clear();
  entries.forEach((entry, index) => {
    const article = node('article', 'entry'); article.setAttribute('aria-labelledby', `entry-${index}`);
    const header = node('header', 'entry-heading');
    const titleGroup = node('div'); const heading = node('h2', '', entry.word); heading.id = `entry-${index}`; heading.lang = 'en';
    titleGroup.append(heading);
    const phonetic = node('p', 'phonetic', entry.phonetics.join(' · ') || 'Fonética no disponible'); phonetic.lang = entry.phonetics.length ? 'en' : 'es';
    titleGroup.append(phonetic); header.append(titleGroup, audioControl(entry, index)); article.append(header);
    if (!entry.meanings.length) article.append(node('p', 'audio-note', 'La API no suministró significados para esta entrada.'));
    entry.meanings.forEach(meaning => {
      const section = node('section', 'meaning');
      const title = node('h3', '', `${meaning.partOfSpeech} · ${POS[meaning.partOfSpeech] || 'categoría gramatical'}`); section.append(title);
      const list = node('ol', 'definition-list'); list.lang = 'en';
      meaning.definitions.forEach(item => {
        const li = node('li'); li.append(node('p', '', item.definition));
        if (item.example) li.append(node('blockquote', '', item.example)); list.append(li);
      });
      section.append(list);
      if (!meaning.definitions.length) section.append(node('p', 'audio-note', 'Sin definiciones disponibles en esta categoría.'));
      if (meaning.synonyms.length) {
        const synonyms = node('div', 'synonyms'); synonyms.append(node('span', '', 'Sinónimos'));
        meaning.synonyms.forEach(word => synonyms.append(wordButton(word, onSearch))); section.append(synonyms);
      }
      article.append(section);
    });
    const sources = node('section', 'source-list'); sources.append(node('h3', '', 'Fuentes de esta entrada'));
    if (entry.sources.length) {
      const list = node('ul');
      entry.sources.forEach(url => { const li = node('li'); const link = node('a', '', url); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; li.append(link); list.append(li); }); sources.append(list);
    } else sources.append(node('p', '', 'La API no suministró enlaces de origen.'));
    if (entry.license) {
      const license = node('p', 'license', 'Licencia de la entrada: ');
      if (entry.license.url) { const link = node('a', '', entry.license.name); link.href = entry.license.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; license.append(link); }
      else license.append(document.createTextNode(entry.license.name));
      sources.append(license);
    }
    article.append(sources); results.append(article);
  });
  announce(`${entries.length} ${entries.length === 1 ? 'entrada encontrada' : 'entradas encontradas'} para ${entries[0].word}.`);
}
