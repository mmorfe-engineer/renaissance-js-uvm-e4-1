const THEMES = ['system', 'light', 'dark'];
const FONTS = ['editorial', 'classic', 'sans', 'humanist', 'mono'];
const KEY = 'renaissance-lexicon-preferences';

export function initPreferences() {
  const themeSelect = document.querySelector('#theme');
  const fontSelect = document.querySelector('#font');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { /* La lectura sigue funcionando si el almacenamiento está bloqueado. */ }
  let theme = THEMES.includes(saved.theme) ? saved.theme : 'system';
  let font = FONTS.includes(saved.font) ? saved.font : 'editorial';
  function apply() {
    document.documentElement.dataset.theme = theme === 'system' ? (systemTheme.matches ? 'dark' : 'light') : theme;
    document.documentElement.dataset.font = font;
    themeSelect.value = theme;
    fontSelect.value = font;
  }
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify({ theme, font })); } catch { /* Preferencia válida durante esta sesión. */ }
  }
  themeSelect.addEventListener('change', () => { theme = themeSelect.value; apply(); persist(); });
  fontSelect.addEventListener('change', () => { font = fontSelect.value; apply(); persist(); });
  systemTheme.addEventListener('change', () => { if (theme === 'system') apply(); });
  apply();
}
