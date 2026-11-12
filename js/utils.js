/** Una sola ejecución tras una pausa; cancel() sirve al enviar o vaciar el formulario. */
export function debounce(callback, delay = 450) {
  let timer;
  function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  }
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}

export function validateWord(raw) {
  const word = raw.trim().replace(/\s+/g, ' ').replaceAll('’', "'").toLowerCase();
  if (!word) return { word: '', error: '' };
  if (word.length > 80 || !/^[a-z]+(?:[ '-][a-z]+)*$/i.test(word)) {
    return { word, error: 'Usa letras del inglés; se permiten espacios, guiones y apóstrofos entre palabras (máximo 80 caracteres).' };
  }
  return { word, error: '' };
}

/** Solo URLs web seguras; nunca javascript:, data: o protocolos arbitrarios de la API. */
export function safeUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const url = new URL(value.startsWith('//') ? `https:${value}` : value);
    return url.protocol === 'https:' ? url.href : '';
  } catch { return ''; }
}
