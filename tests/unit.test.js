import test from 'node:test';
import assert from 'node:assert/strict';
import { debounce, validateWord, safeUrl } from '../js/utils.js';
import { lookupWord, normalizeEntries, DictionaryError } from '../js/api.js';
import { setTimeout as wait } from 'node:timers/promises';
import { initPreferences } from '../js/preferences.js';

test('valida espacios, mayúsculas, apóstrofos y guiones sin permitir símbolos arbitrarios', () => {
  for (const [raw, expected] of [[' Hello ', 'hello'], ["Mother-in-law", 'mother-in-law'], ['rock   and roll', 'rock and roll'], ['can’t', "can't"]]) {
    assert.deepEqual(validateWord(raw), { word: expected, error: '' });
  }
  assert.deepEqual(validateWord('  '), { word: '', error: '' });
  for (const invalid of ['123', '<script>', 'café', '-hello', 'hello--world', 'a'.repeat(81)]) assert.ok(validateWord(invalid).error);
});

test('debounce ejecuta una sola consulta con el último valor, después de la pausa', async () => {
  const calls = []; const delayed = debounce(value => calls.push(value), 40);
  delayed('h'); await wait(10); delayed('he'); await wait(10); delayed('hello');
  assert.deepEqual(calls, []); await wait(65); assert.deepEqual(calls, ['hello']);
});

test('cancelar debounce evita consultas al enviar o limpiar', async () => {
  let called = false; const delayed = debounce(() => { called = true; }, 20);
  delayed(); delayed.cancel(); await wait(40); assert.equal(called, false);
});

test('URLs de audio y fuentes excluyen protocolos inseguros y entradas inválidas', () => {
  assert.equal(safeUrl('//example.com/a.mp3'), 'https://example.com/a.mp3');
  assert.equal(safeUrl('https://example.com/word'), 'https://example.com/word');
  for (const url of ['', null, {}, 'javascript:alert(1)', 'http://example.com', '/relative', 'data:text/html,x']) assert.equal(safeUrl(url), '');
});

test('normaliza múltiples entradas, fonéticas, verbos, ejemplos y sinónimos sin duplicar', () => {
  const entries = normalizeEntries([{ word: 'hello', phonetic: '/h/', phonetics: [{ text: '/h/' }, { text: '/e/', audio: '//example.com/hello.mp3' }], meanings: [{ partOfSpeech: 'verb', synonyms: ['greet'], definitions: [{ definition: 'To greet.', example: 'They helloed.', synonyms: ['greet', 'welcome'] }] }], sourceUrls: ['https://example.com/hello', 'javascript:x'], license: { name: 'CC BY-SA', url: 'https://example.com/license' } }, { word: 'hello' }]);
  assert.equal(entries.length, 2); assert.deepEqual(entries[0].phonetics, ['/h/', '/e/']);
  assert.equal(entries[0].audio, 'https://example.com/hello.mp3');
  assert.equal(entries[0].meanings[0].partOfSpeech, 'verb');
  assert.deepEqual(entries[0].meanings[0].synonyms, ['greet', 'welcome']);
  assert.equal(entries[0].meanings[0].definitions[0].example, 'They helloed.');
  assert.deepEqual(entries[0].sources, ['https://example.com/hello']);
});

test('tolera campos ausentes y formas inesperadas sin romper el normalizador', () => {
  for (const value of [null, {}, [], [null, 42, {}]]) assert.deepEqual(normalizeEntries(value), []);
  const [entry] = normalizeEntries([{ word: 'test', phonetics: [null, { audio: 'javascript:x' }], meanings: [null, { definitions: [null, {}, { definition: 'Valid' }] }], license: {} }]);
  assert.equal(entry.audio, ''); assert.deepEqual(entry.phonetics, []); assert.equal(entry.license, null);
  assert.equal(entry.meanings[0].definitions.length, 1);
});

test('fetch codifica la palabra, propaga signal y procesa JSON', async t => {
  const controller = new AbortController();
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.ok(url.endsWith('ice%20cream')); assert.equal(options.signal, controller.signal);
    return new Response(JSON.stringify([{ word: 'ice cream' }]));
  });
  assert.equal((await lookupWord('ice cream', controller.signal))[0].word, 'ice cream');
});

for (const [status, kind] of [[404, 'not-found'], [429, 'api'], [500, 'api']]) {
  test(`HTTP ${status} produce un error comprensible de tipo ${kind}`, async t => {
    t.mock.method(globalThis, 'fetch', async () => new Response('{}', { status }));
    await assert.rejects(lookupWord('word'), error => error instanceof DictionaryError && error.kind === kind);
  });
}
test('distingue red desconectada de solicitud cancelada', async t => {
  t.mock.method(globalThis, 'fetch', async () => { throw new TypeError('offline'); });
  await assert.rejects(lookupWord('hello'), { kind: 'network' });
  globalThis.fetch = async () => { throw new DOMException('cancelled', 'AbortError'); };
  await assert.rejects(lookupWord('hello'), { name: 'AbortError' });
});
test('rechaza JSON ilegible y respuestas sin entradas válidas', async t => {
  t.mock.method(globalThis, 'fetch', async () => new Response('not JSON'));
  await assert.rejects(lookupWord('hello'), { kind: 'api' });
  globalThis.fetch = async () => new Response('{}');
  await assert.rejects(lookupWord('hello'), { kind: 'api' });
});

function preferencesEnvironment(t, { saved = null, dark = false, blocked = false } = {}) {
  const events = {};
  const elements = Object.fromEntries(['#theme', '#font'].map(selector => [selector, { value: '', addEventListener(name, callback) { events[`${selector}:${name}`] = callback; } }]));
  const root = { dataset: {} }; const media = { matches: dark, addEventListener(name, callback) { events.media = callback; } };
  const original = Object.getOwnPropertyDescriptors(globalThis); const writes = [];
  Object.defineProperties(globalThis, {
    document: { configurable: true, value: { documentElement: root, querySelector: selector => elements[selector] } },
    window: { configurable: true, value: { matchMedia: () => media } },
    localStorage: { configurable: true, value: { getItem() { if (blocked) throw new Error('blocked'); return saved; }, setItem(key, value) { if (blocked) throw new Error('blocked'); writes.push({ key, value: JSON.parse(value) }); } } }
  });
  t.after(() => { for (const key of ['document', 'window', 'localStorage']) { if (original[key]) Object.defineProperty(globalThis, key, original[key]); else delete globalThis[key]; } });
  initPreferences();
  return { root, media, elements, writes, change(selector, value) { elements[selector].value = value; events[`${selector}:change`](); }, system(dark) { media.matches = dark; events.media(); } };
}
test('tema inicial sigue al sistema y actualiza cambios del SO', t => {
  const env = preferencesEnvironment(t, { dark: true });
  assert.equal(env.root.dataset.theme, 'dark'); assert.equal(env.elements['#theme'].value, 'system');
  env.system(false); assert.equal(env.root.dataset.theme, 'light');
});
test('elección manual tiene prioridad y persiste tema y fuente', t => {
  const env = preferencesEnvironment(t);
  env.change('#theme', 'dark'); env.system(false); assert.equal(env.root.dataset.theme, 'dark');
  for (const font of ['editorial', 'classic', 'sans', 'humanist', 'mono']) { env.change('#font', font); assert.equal(env.root.dataset.font, font); }
  assert.deepEqual(env.writes.at(-1).value, { theme: 'dark', font: 'mono' });
  env.change('#theme', 'system'); assert.equal(env.root.dataset.theme, 'light');
});
test('restaura preferencias permitidas y descarta JSON inválido o valores desconocidos', t => {
  const env = preferencesEnvironment(t, { saved: JSON.stringify({ theme: 'dark', font: 'mono' }) });
  assert.equal(env.root.dataset.theme, 'dark'); assert.equal(env.root.dataset.font, 'mono');
});
test('almacenamiento bloqueado mantiene cambios funcionales durante la sesión', t => {
  const env = preferencesEnvironment(t, { blocked: true });
  env.change('#theme', 'dark'); env.change('#font', 'sans');
  assert.equal(env.root.dataset.theme, 'dark'); assert.equal(env.root.dataset.font, 'sans');
});
for (const saved of ['{broken', JSON.stringify({ theme: 'unknown', font: 'unknown' })]) {
  test(`preferencias corruptas usan valores por defecto: ${saved}`, t => {
    const env = preferencesEnvironment(t, { saved });
    assert.equal(env.root.dataset.theme, 'light'); assert.equal(env.root.dataset.font, 'editorial');
  });
}


test('conserva pronunciaciones HTTPS únicas con fuente y licencia, sin URLs inseguras', () => {
  const [entry] = normalizeEntries([{ word: 'hello', phonetics: [
    { audio: 'https://audio.example.test/first.mp3', text: '/one/', sourceUrl: 'https://example.test/source', license: { name: 'CC BY', url: 'https://example.test/license' } },
    { audio: 'https://audio.example.test/first.mp3' },
    { audio: '//audio.example.test/second.mp3', text: '/two/' },
    { audio: 'javascript:alert(1)' }, { audio: 'http://example.test/insecure.mp3' }, null
  ] }]);
  assert.equal(entry.pronunciations.length, 2);
  assert.equal(entry.audio, entry.pronunciations[0].url);
  assert.deepEqual(entry.pronunciations[0], { url: 'https://audio.example.test/first.mp3', text: '/one/', sourceUrl: 'https://example.test/source', license: { name: 'CC BY', url: 'https://example.test/license' } });
  assert.equal(entry.pronunciations[1].url, 'https://audio.example.test/second.mp3');
});

test('sin pronunciaciones válidas conserva una colección vacía', () => {
  for (const phonetics of [undefined, [], [null, { audio: 'data:audio/mp3,x' }]]) {
    const [entry] = normalizeEntries([{ word: 'hello', phonetics }]);
    assert.deepEqual(entry.pronunciations, []); assert.equal(entry.audio, '');
  }
});
