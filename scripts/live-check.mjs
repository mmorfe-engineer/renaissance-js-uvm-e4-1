import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = fileURLToPath(new URL('../', import.meta.url));
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const errors = []; page.on('pageerror', error => errors.push(error.message));
// LIVE_URL se utiliza para verificar la publicación; sin él, el sitio local se sirve en memoria.
if (!process.env.LIVE_URL) {
  await context.route('https://lexicon.test/**', async route => {
    const pathname = new URL(route.request().url()).pathname;
    const filename = path.join(root, pathname === '/' ? 'index.html' : pathname);
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.ttf': 'font/ttf' };
    await route.fulfill({ contentType: types[path.extname(filename)] || 'text/plain', body: await readFile(filename) });
  });
}
let report;
const externalFailures = [];
try {
  await page.goto(process.env.LIVE_URL || 'https://lexicon.test/');
  const responsePromise = page.waitForResponse(response => response.url().includes('api.dictionaryapi.dev/api/v2/entries/en/hello'));
  await page.locator('#word').fill('hello'); await page.locator('#search-form button').click();
  const response = await responsePromise; assert.equal(response.status(), 200);
  await page.waitForSelector('.entry h2'); assert.equal(await page.locator('.entry h2').first().textContent(), 'hello');
  assert.ok(await page.locator('.definition-list li').count() > 0);
  const audio = page.locator('audio').first(); let audioStatus = 'La API no suministró audio.';
  if (await audio.count()) {
    // La descarga real acredita disponibilidad del recurso, no escucha humana del sonido.
    const resource = await context.request.get(await audio.getAttribute('src'));
    audioStatus = `Recurso de audio HTTP ${resource.status()}`;
    if (!resource.ok()) externalFailures.push({ resource: await audio.getAttribute('src'), status: resource.status() });
    else assert.ok((await resource.body()).length > 0);
    await page.locator('.audio-button').first().click();
    await page.waitForFunction(() => { const a = document.querySelector('audio'); return a && ((!a.paused && a.readyState >= 2) || a.ended || document.querySelector('.audio-message')?.textContent); });
    const audioMessage = await page.locator('.audio-message').first().textContent();
    if (audioMessage) externalFailures.push({ playback: audioMessage });
  }
  assert.deepEqual(errors, []);
  const definitions = await page.locator('.definition-list li').count();
  await mkdir(path.join(root, 'artifacts'), { recursive: true });
  await page.screenshot({ path: path.join(root, 'artifacts/live-hello.png'), fullPage: true });
  await page.locator('#theme').selectOption('dark');
  await page.locator('#font').selectOption('mono');
  await page.reload();
  assert.equal(await page.locator('#theme').inputValue(), 'dark');
  assert.equal(await page.locator('#font').inputValue(), 'mono');
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await mkdir(path.join(root, 'artifacts'), { recursive: true });
  report = { status: externalFailures.length ? 'failed-external-audio' : 'passed', date: new Date().toISOString(), url: page.url(), apiStatus: response.status(), definitions, audioStatus, externalFailures, preferences: 'Tema oscuro y fuente mono persistieron tras recargar', errors };
  if (externalFailures.length) process.exitCode = 1;
  console.log(JSON.stringify(report));
} catch (error) {
  report = { status: 'failed', date: new Date().toISOString(), error: error.message, errors };
  console.error(error.message); process.exitCode = 1;
} finally {
  await mkdir(path.join(root, 'artifacts'), { recursive: true });
  await writeFile(path.join(root, 'artifacts/live-report.json'), JSON.stringify(report, null, 2));
  await browser.close();
}
