import { debounce, validateWord } from './utils.js';
import { lookupWord } from './api.js';
import { initPreferences } from './preferences.js';
import { announce, renderInitial, renderLoading, renderEntries, renderError, stopAudio } from './ui.js';

const form = document.querySelector('#search-form');
const input = document.querySelector('#word');
const validation = document.querySelector('#validation');
let controller;
let generation = 0;
let lastWord = '';
let composing = false;

initPreferences();

function invalidate() {
  generation += 1;
  controller?.abort();
  stopAudio();
}
function showValidation(error) {
  validation.textContent = error;
  validation.hidden = !error;
  input.setAttribute('aria-invalid', String(Boolean(error)));
}
async function search(raw, force = false) {
  const { word, error } = validateWord(raw);
  showValidation(error);
  if (!word || error) {
    invalidate(); lastWord = ''; renderInitial(searchFromButton);
    announce(error || 'Escribe una palabra en inglés para empezar.'); return;
  }
  if (!force && word === lastWord) return;
  invalidate();
  const currentGeneration = generation;
  controller = new AbortController();
  const signal = controller.signal;
  lastWord = word;
  renderLoading(word);
  // Límite para que una conexión detenida no deje la interfaz cargando indefinidamente.
  const controllerForRequest = controller;
  const timeout = setTimeout(() => controllerForRequest.abort(), 12000);
  try {
    const entries = await lookupWord(word, signal);
    if (currentGeneration !== generation) return;
    renderEntries(entries, searchFromButton);
  } catch (error) {
    if (currentGeneration !== generation) return;
    lastWord = '';
    if (error.name === 'AbortError') {
      renderError('network', 'La consulta tardó demasiado. Revisa tu conexión y vuelve a intentar.', () => search(input.value, true));
    } else {
      renderError(error.kind || 'api', error.message, () => search(input.value, true));
    }
  } finally { clearTimeout(timeout); }
}
const delayedSearch = debounce(raw => search(raw), 450);
function searchFromButton(word) {
  delayedSearch.cancel(); input.value = word; search(word, true); input.focus();
}
function handleInput() {
  delayedSearch.cancel();
  invalidate(); lastWord = ''; showValidation('');
  // Se retiran resultados obsoletos durante la pausa, antes incluso del próximo fetch.
  renderInitial(searchFromButton);
  if (!input.value.trim()) { announce('Escribe una palabra en inglés para empezar.'); return; }
  if (!composing) { announce('Esperando a que termines de escribir.'); delayedSearch(input.value); }
}
input.addEventListener('input', handleInput);
input.addEventListener('compositionstart', () => { composing = true; delayedSearch.cancel(); invalidate(); });
input.addEventListener('compositionend', () => { composing = false; handleInput(); });
form.addEventListener('submit', event => {
  event.preventDefault(); if (composing) return;
  delayedSearch.cancel(); search(input.value);
});
renderInitial(searchFromButton);
