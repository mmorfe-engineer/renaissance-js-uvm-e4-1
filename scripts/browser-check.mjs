import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { fixture } from '../tests/fixtures.js';

// PLAYWRIGHT_MODULE permite usar una instalación existente sin modificar proyectos vecinos.
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'artifacts'); await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const require = createRequire(import.meta.url);
const axeSource = await readFile(require.resolve('axe-core/axe.min.js'), 'utf8');
const context = await browser.newContext({ colorScheme: 'light', reducedMotion: 'reduce' });
const page = await context.newPage();
const failures = []; const checks = []; const jsErrors = []; const calls = [];
page.on('pageerror', error => jsErrors.push(error.message));
const origin = 'https://lexicon.test';
let responseMode = 'success';
// El sitio se sirve desde memoria: no requiere servidor ni una API remota para los casos deterministas.
await context.route('https://lexicon.test/**', async route => {
  const pathname = new URL(route.request().url()).pathname;
  const filename = path.join(root, pathname === '/' ? 'index.html' : pathname);
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.ttf': 'font/ttf' };
  try { await route.fulfill({ status: 200, contentType: types[path.extname(filename)] || 'text/plain', body: await readFile(filename) }); }
  catch { await route.fulfill({ status: 404, body: '' }); }
});
await context.route('https://api.dictionaryapi.dev/**', async route => {
  const word = decodeURIComponent(route.request().url().split('/').at(-1)); calls.push(word);
  if (responseMode === 'network') { await route.abort('failed'); return; }
  if (responseMode === 'slow' || word === 'older') await new Promise(resolve => setTimeout(resolve, word === 'older' ? 1300 : 600));
  const status = responseMode === 'missing' ? 404 : responseMode === 'api' ? 500 : 200;
  const body = responseMode === 'malformed' ? '{broken' : JSON.stringify(responseMode === 'partial' ? [{ word }] : fixture(word, responseMode !== 'no-audio'));
  await route.fulfill({ status, contentType: 'application/json', body }).catch(() => {});
});
await context.route('https://audio.example.test/**', route => route.abort());
async function check(name, run) {
  try { await run(); checks.push(name); console.log(`PASS ${name}`); }
  catch (error) { failures.push({ name, error: error.message }); console.error(`FAIL ${name}: ${error.message}`); }
}
async function search(word, mode = 'success') {
  responseMode = mode;
  await page.locator('#word').fill(word);
  await page.locator('#search-form button').click();
}
async function textIncludes(selector, expected) {
  await page.waitForFunction(([selector, expected]) => document.querySelector(selector)?.textContent.includes(expected), [selector, expected]);
}
async function audit() {
  await page.addScriptTag({ content: axeSource });
  const report = await page.evaluate(async () => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } }));
  assert.deepEqual(report.violations.map(item => ({ id: item.id, nodes: item.nodes.map(n => n.target) })), []);
}
try {
  await page.goto(origin);
  await check('Estado inicial sin consultas ficticias ni automáticas', async () => {
    await textIncludes('#results', 'Tu próxima palabra'); assert.equal(calls.length, 0);
    assert.equal(await page.locator('h1').count(), 1);
  });
  await check('Accesibilidad automática del estado inicial (axe WCAG A/AA)', audit);
  await check('Debounce real: cero peticiones mientras continúa escribiendo y una tras 450 ms', async () => {
    const before = calls.length;
    await page.locator('#word').pressSequentially('hello', { delay: 90 });
    assert.equal(calls.length, before);
    await page.waitForTimeout(600); await textIncludes('.entry h2', 'hello');
    assert.equal(calls.length - before, 1);
  });
  await check('Resultado dinámico: verbo, definición, ejemplo, sinónimos y fuentes', async () => {
    await textIncludes('.meaning h3', 'verbo'); await textIncludes('.definition-list', 'To greet someone.');
    await textIncludes('blockquote', 'They helloed'); assert.equal(await page.locator('.synonyms button').count(), 2);
    assert.equal(await page.locator('.source-list a').first().getAttribute('href'), 'https://en.wiktionary.org/wiki/hello');
  });
  await check('Audio invocado por JavaScript y fallo de reproducción anunciado', async () => {
    await page.evaluate(() => { window.audioCalls = 0; HTMLMediaElement.prototype.play = function() { window.audioCalls++; return Promise.reject(new Error('unavailable')); }; });
    await page.getByRole('button', { name: 'Escuchar pronunciación de hello' }).click();
    await textIncludes('.audio-message', 'No se pudo reproducir'); assert.equal(await page.evaluate(() => window.audioCalls), 1);
    assert.equal(await page.locator('audio').getAttribute('controls'), null);
  });
  await check('Audio reproducido y botón restablecido al finalizar (API multimedia controlada)', async () => {
    await page.evaluate(() => { HTMLMediaElement.prototype.play = function() { setTimeout(() => this.dispatchEvent(new Event('ended')), 80); return Promise.resolve(); }; });
    await page.locator('.audio-button').click(); await page.waitForTimeout(150);
    assert.equal(await page.locator('.audio-button').isEnabled(), true);
    await textIncludes('.audio-button', 'Escuchar');
  });
  await check('Sin audio, fonética o significados: estado parcial legible', async () => {
    await search('partial', 'partial'); await textIncludes('.entry h2', 'partial');
    await textIncludes('.phonetic', 'Fonética no disponible'); await textIncludes('.audio-note', 'Sin audio');
    assert.equal(await page.locator('.audio-button').count(), 0);
  });
  await check('Entrada inválida y vacía no hacen fetch; cancelar pausa no consulta', async () => {
    const before = calls.length; await search('<script>');
    await textIncludes('#validation', 'Usa letras'); await page.waitForTimeout(500);
    await page.locator('#word').fill('word'); await page.locator('#word').fill(''); await page.waitForTimeout(550);
    assert.equal(calls.length, before); assert.equal(await page.locator('#word').getAttribute('aria-invalid'), 'false');
  });
  await check('Enter cancela debounce y no duplica solicitudes', async () => {
    const before = calls.length; responseMode = 'success'; await page.locator('#word').fill('learn'); await page.locator('#word').press('Enter');
    await textIncludes('.entry h2', 'learn'); await page.waitForTimeout(550); assert.equal(calls.length - before, 1);
  });
  await check('Estado loading visible y aria-busy coherente', async () => {
    await search('loading', 'slow'); await textIncludes('#results', 'Buscando tu palabra');
    assert.equal(await page.locator('#results').getAttribute('aria-busy'), 'true');
    await textIncludes('.entry h2', 'loading'); assert.equal(await page.locator('#results').getAttribute('aria-busy'), 'false');
  });
  await check('Una respuesta vieja nunca sobrescribe la búsqueda más reciente', async () => {
    await search('older'); await page.waitForTimeout(60); await search('newer');
    await textIncludes('.entry h2', 'newer'); await page.waitForTimeout(1500); await textIncludes('.entry h2', 'newer');
  });
  for (const [mode, message] of [['missing', 'Una palabra por descubrir'], ['network', 'Revisa tu conexión'], ['api', 'no está disponible'], ['malformed', 'no se puede leer']]) {
    await check(`Error ${mode} distinguido y anunciado`, async () => { await search('failure', mode); await textIncludes('#results', message); assert.notEqual(await page.locator('#status').textContent(), ''); });
  }
  await check('Reintentar recupera la interfaz después del error', async () => {
    responseMode = 'success'; await page.getByRole('button', { name: 'Volver a intentar' }).click(); await textIncludes('.entry h2', 'failure');
  });
  await check('Sinónimo interactivo inicia una búsqueda real', async () => {
    await page.getByRole('button', { name: 'greet', exact: true }).click(); await textIncludes('.entry h2', 'greet');
  });
  await check('Tema sistema sigue cambios del SO; claro y oscuro son explícitos', async () => {
    await page.locator('#theme').selectOption('system'); await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
    await page.locator('#theme').selectOption('light'); await page.emulateMedia({ colorScheme: 'dark' });
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
    await page.locator('#theme').selectOption('dark'); assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    await page.reload(); assert.equal(await page.locator('#theme').inputValue(), 'dark');
  });
  await check('Cinco tipografías efectivas y preferencia persistente', async () => {
    const families = new Set();
    for (const font of ['editorial', 'classic', 'sans', 'humanist', 'mono']) {
      await page.locator('#font').selectOption(font); await page.evaluate(() => document.fonts.ready); families.add(await page.locator('h1').evaluate(element => getComputedStyle(element).fontFamily));
    }
    assert.equal(families.size, 5); await page.reload(); assert.equal(await page.locator('#font').inputValue(), 'mono');
    await page.locator('#font').selectOption('editorial'); await page.locator('#theme').selectOption('light');
  });
  await check('Teclado: enlace de salto y envío del formulario', async () => {
    await page.reload(); await page.keyboard.press('Tab');
    assert.equal(await page.locator(':focus').textContent(), 'Saltar al diccionario');
    await page.keyboard.press('Enter'); assert.equal(await page.locator(':focus').getAttribute('id'), 'main');
    await page.locator('#word').focus(); await page.keyboard.type('keyboard'); await page.keyboard.press('Enter'); await textIncludes('.entry h2', 'keyboard');
  });
  await check('Texto remoto se representa como texto, sin inyección de HTML', async () => {
    await context.route('https://api.dictionaryapi.dev/**', route => route.fulfill({ json: fixture('<img src=x onerror=alert(1)>') }));
    await search('injection'); await textIncludes('.entry h2', '<img'); assert.equal(await page.locator('#results img').count(), 0);
    await context.unroute('https://api.dictionaryapi.dev/**');
  });
  // Estos recursos son sintéticos y solo verifican la lógica, nunca disponibilidad real.
  const alternatives = fixture('alternatives');
  alternatives[0].phonetics = [
    { text: '/one/', audio: 'https://audio.example.test/first.mp3' },
    { text: '/two/', audio: 'https://audio.example.test/second.mp3' }
  ];
  await context.route('https://api.dictionaryapi.dev/**', route => route.fulfill({ json: alternatives }));
  await search('alternatives'); await textIncludes('.entry h2', 'alternatives');
  await check('Primera pronunciación falla: se intenta la alternativa una vez, sin perder foco', async () => {
    await page.evaluate(() => {
      window.attempts = [];
      HTMLMediaElement.prototype.play = function() {
        window.attempts.push(this.src);
        return this.src.endsWith('first.mp3') ? Promise.reject(new Error('unavailable')) : Promise.resolve();
      };
    });
    await page.locator('.audio-button').focus(); await page.keyboard.press('Enter');
    await textIncludes('.audio-message', 'Reproduciendo alternativa 2 de 2');
    assert.equal(await page.locator('.audio-select').inputValue(), '1');
    assert.deepEqual(await page.evaluate(() => window.attempts.map(url => url.split('/').at(-1))), ['first.mp3', 'second.mp3']);
    assert.equal(await page.locator(':focus').getAttribute('class'), 'audio-button');
    assert.equal(await page.locator('audio').getAttribute('controls'), null);
  });
  await check('Fallo total acotado: anuncia alternativas agotadas y permite reintentar', async () => {
    await page.evaluate(() => { window.attempts = []; HTMLMediaElement.prototype.play = function() { window.attempts.push(this.src); return Promise.reject(new Error('offline')); }; });
    await page.locator('.audio-select').selectOption('0'); await page.locator('.audio-button').click();
    await textIncludes('.audio-message', 'Se probaron todas las alternativas');
    assert.equal(await page.evaluate(() => window.attempts.length), 2);
    assert.equal(await page.locator('.audio-button').getAttribute('aria-disabled'), 'false');
    await page.locator('.audio-button').click(); await page.waitForFunction(() => window.attempts.length === 4);
  });
  await check('Cambio de pronunciación cancela un intento pendiente sin reproducción tardía', async () => {
    await page.evaluate(() => { window.attempts = []; HTMLMediaElement.prototype.play = function() { window.attempts.push(this.src); return new Promise(resolve => setTimeout(resolve, 100)); }; });
    await page.locator('.audio-button').click(); await page.locator('.audio-select').selectOption('1');
    await page.waitForTimeout(180);
    assert.equal(await page.locator('.audio-select').inputValue(), '1');
    await textIncludes('.audio-message', 'Pronunciación seleccionada');
    assert.equal(await page.locator('.audio-button').getAttribute('aria-disabled'), 'false');
    assert.equal(await page.evaluate(() => window.attempts.length), 1);
  });
  await check('Nueva consulta retira y cancela el control de audio anterior', async () => {
    await page.evaluate(() => { HTMLMediaElement.prototype.play = () => new Promise(resolve => setTimeout(resolve, 120)); });
    await page.locator('.audio-button').click(); await search('replacement');
    await page.waitForTimeout(220); assert.equal(await page.locator('.audio-message').textContent(), '');
  });
  await check('Selector accesible en cinco viewports, dos temas y cinco tipografías', async () => {
    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 960 });
      for (const theme of ['light', 'dark']) {
        await page.locator('#theme').selectOption(theme);
        for (const font of ['editorial', 'classic', 'sans', 'humanist', 'mono']) {
          await page.locator('#font').selectOption(font); await page.evaluate(() => document.fonts.ready);
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
          for (const selector of ['.audio-select', '.audio-button']) {
            const box = await page.locator(selector).boundingBox();
            assert.ok(box.x >= 0 && box.x + box.width <= width + 1 && box.height >= 44);
          }
        }
      }
    }
    await audit();
    await page.locator('#font').selectOption('editorial'); await page.locator('#theme').selectOption('light');
  });
  await context.unroute('https://api.dictionaryapi.dev/**');
  // Restaurar datos con una única ruta para las capturas responsive.
  await context.route('https://api.dictionaryapi.dev/**', route => route.fulfill({ json: fixture('serendipity') }));
  await search('serendipity'); await textIncludes('.entry h2', 'serendipity');
  for (const width of [320, 375, 768, 1024, 1440]) {
    await check(`Responsive ${width}px sin overflow; controles visibles`, async () => {
      await page.setViewportSize({ width, height: 960 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      for (const selector of ['#word', '#font', '#theme', '.audio-button']) {
        const box = await page.locator(selector).boundingBox(); assert.ok(box.x >= 0 && box.x + box.width <= width + 1); assert.ok(box.height >= 44);
      }
      await page.screenshot({ path: path.join(output, `lexicon-${width}-light.png`), fullPage: true });
    });
  }
  await page.locator('#theme').selectOption('dark');
  await page.screenshot({ path: path.join(output, 'lexicon-1440-dark.png'), fullPage: true });
  await check('Accesibilidad automática del resultado oscuro (axe WCAG A/AA)', audit);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.locator('#theme').selectOption('light');
  await check('Accesibilidad automática del resultado móvil claro (axe WCAG A/AA)', audit);
  await check('Almacenamiento bloqueado no interrumpe aplicación ni preferencias', async () => {
    const blockedPage = await context.newPage();
    await blockedPage.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }); });
    await blockedPage.goto(origin); await blockedPage.locator('#theme').selectOption('dark');
    assert.equal(await blockedPage.locator('html').getAttribute('data-theme'), 'dark'); await blockedPage.close();
  });
  await check('Sin excepciones JavaScript no controladas', async () => assert.deepEqual(jsErrors, []));
} finally {
  await writeFile(path.join(output, 'browser-report.json'), JSON.stringify({ date: new Date().toISOString(), browser: await browser.version(), checks, failures, jsErrors, api: 'Casos con respuestas controladas, no prueba del servicio en vivo.' }, null, 2));
  await browser.close();
}
if (failures.length) process.exitCode = 1;
