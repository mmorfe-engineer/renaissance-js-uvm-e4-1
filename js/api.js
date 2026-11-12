import { safeUrl } from './utils.js';

const ENDPOINT = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
const array = value => Array.isArray(value) ? value : [];
const text = value => typeof value === 'string' ? value.trim() : '';
const strings = values => [...new Set(array(values).map(text).filter(Boolean))];

export class DictionaryError extends Error {
  constructor(kind, message) { super(message); this.name = 'DictionaryError'; this.kind = kind; }
}

/** Adaptación explícita de arrays/objetos externos a los datos que dibuja la interfaz. */
export function normalizeEntries(payload) {
  return array(payload).filter(entry => entry && text(entry.word)).map(entry => {
    const phonetics = array(entry.phonetics).filter(Boolean);
    const seenAudio = new Set();
    const pronunciations = phonetics.flatMap(item => {
      const url = safeUrl(item.audio);
      if (!url || seenAudio.has(url)) return [];
      seenAudio.add(url);
      return [{ url, text: text(item.text), sourceUrl: safeUrl(item.sourceUrl),
        license: item.license && text(item.license.name)
          ? { name: text(item.license.name), url: safeUrl(item.license.url) } : null }];
    });
    return {
      word: text(entry.word),
      phonetics: strings([entry.phonetic, ...phonetics.map(item => item.text)]),
      pronunciations,
      audio: pronunciations[0]?.url || '', // Compatibilidad con consumidores existentes.
      meanings: array(entry.meanings).filter(Boolean).map(meaning => {
        const definitions = array(meaning.definitions).filter(item => item && text(item.definition)).map(item => ({
          definition: text(item.definition), example: text(item.example), synonyms: strings(item.synonyms)
        }));
        return {
          partOfSpeech: text(meaning.partOfSpeech) || 'other', definitions,
          synonyms: strings([...array(meaning.synonyms), ...definitions.flatMap(item => item.synonyms)])
        };
      }),
      sources: strings(array(entry.sourceUrls).map(safeUrl)),
      license: entry.license && text(entry.license.name) ? { name: text(entry.license.name), url: safeUrl(entry.license.url) } : null
    };
  });
}

export async function lookupWord(word, signal) {
  let response;
  try { response = await fetch(`${ENDPOINT}${encodeURIComponent(word)}`, { signal, headers: { Accept: 'application/json' } }); }
  catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new DictionaryError('network', 'No pudimos conectar con el diccionario. Revisa tu conexión e inténtalo otra vez.');
  }
  if (response.status === 404) throw new DictionaryError('not-found', 'No encontramos esta palabra. Revisa cómo se escribe o prueba otra palabra en inglés.');
  if (!response.ok) throw new DictionaryError('api', response.status === 429 ? 'El diccionario recibió demasiadas consultas. Espera un momento y vuelve a intentar.' : 'El diccionario no está disponible en este momento. Inténtalo de nuevo más tarde.');
  let payload;
  try { payload = await response.json(); }
  catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new DictionaryError('api', 'El diccionario devolvió una respuesta que no se puede leer. Inténtalo de nuevo.');
  }
  const entries = normalizeEntries(payload);
  if (!entries.length) throw new DictionaryError('api', 'El diccionario devolvió una respuesta sin entradas válidas. Inténtalo de nuevo.');
  return entries;
}
