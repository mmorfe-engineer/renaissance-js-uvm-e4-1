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
  const audio = page.locator('audio').first();
  const audioResources = []; let audioStatus = 'La API no suministró audio.';
  if (await audio.count()) {
    const select = page.locator('.audio-select').first();
    const count = await select.count() ? await select.locator('option').count() : 1;
    // Cada URL procede del DOM construido con la respuesta real de Dictionary API.
    for (let i = 0; i < count; i++) {
      if (await select.count()) await select.selectOption(String(i));
      const url = await audio.getAttribute('src');
      try {
        const resource = await context.request.get(url, { timeout: 10000 });
        audioResources.push({ url, status: resource.status(), bytes: (await resource.body()).length,
          contentType: resource.headers()['content-type'] || '' });
      } catch (error) { audioResources.push({ url, error: error.message }); }
    }
    if (await select.count()) await select.selectOption('0');
    await page.locator('.audio-button').first().click();
    await page.waitForFunction(() => document.querySelector('.audio-control')?.getAttribute('aria-busy') === 'false', { }, { timeout: Math.max(15000, count * 9000) });
    const playback = await audio.evaluate(a => ({ url: a.src, readyState: a.readyState, paused: a.paused, ended: a.ended }));
    const selectedResource = audioResources.find(resource => resource.url === playback.url);
    const downloaded = selectedResource?.status >= 200 && selectedResource.status < 300 && selectedResource.bytes > 0 && selectedResource.contentType.toLowerCase().startsWith('audio/');
    const reproduced = playback.readyState >= 2 && (!playback.paused || playback.ended);
    const audioMessage = await page.locator('.audio-message').first().textContent();
    audioStatus = downloaded && reproduced ? 'Recurso real descargado y reproducción confirmada por Chromium; no acredita escucha humana.' : 'No se confirmó descarga y reproducción real.';
    if (!downloaded || !reproduced) externalFailures.push({ playback, audioMessage, downloaded, reproduced });
  } else externalFailures.push({ audio: 'La API no suministró pronunciaciones reproducibles.' });
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
  report = { status: externalFailures.length ? 'failed-external-audio' : 'passed', date: new Date().toISOString(), url: page.url(), apiStatus: response.status(), definitions, audioStatus, audioResources, externalFailures, preferences: 'Tema oscuro y fuente mono persistieron tras recargar', errors };
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
