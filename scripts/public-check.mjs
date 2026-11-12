import { chromium } from 'playwright';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';

const url = process.env.LIVE_URL || 'https://mmorfe-engineer.github.io/renaissance-js-uvm-e4-1/';
const save = process.env.SAVE_EVIDENCE === '1';
const output = save ? 'docs/assets/screenshots' : 'artifacts/public';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const page = await context.newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const report = { date: new Date().toISOString(), sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), url, browser: browser.version(), checks: [], failures: [], audioResources: [], screenshots: [], manual: { zoom200: 'PENDIENTE', screenReader: 'PENDIENTE', humanListening: 'PENDIENTE', fullHumanKeyboardReview: 'PENDIENTE' } };
async function check(name, fn) { try { const data = await fn(); report.checks.push({ name, ...(data || {}) }); } catch (e) { report.failures.push({ name, error: e.message }); } }
async function shot(name) { await page.screenshot({ path: `${output}/${name}.png`, fullPage: true }); report.screenshots.push(`${output}/${name}.png`); }
const require = createRequire(import.meta.url);
const axe = await readFile(require.resolve('axe-core/axe.min.js'), 'utf8');
async function audit() { await page.addScriptTag({ content: axe }); const result = await page.evaluate(async () => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })); assert.equal(result.violations.length, 0, JSON.stringify(result.violations.map(v => v.id))); return { violations: result.violations.length }; }
try {
  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  report.httpStatus = response.status(); assert.equal(response.status(), 200);
  await check('Axe: inicio público', audit);
  await check('Teclado automatizado: enlace de salto y foco principal', async () => { await page.keyboard.press('Tab'); assert.equal(await page.locator(':focus').textContent(), 'Saltar al diccionario'); await page.keyboard.press('Enter'); assert.equal(await page.locator(':focus').getAttribute('id'), 'main'); });
  const pending = page.waitForResponse(r => r.url().includes('/api/v2/entries/en/hello'), { timeout: 20000 }).catch(e => ({ error: e.message }));
  await page.locator('#word').fill('hello'); await page.locator('#word').press('Enter');
  const api = await pending;
  if (api.error) report.api = { status: 'BLOQUEADO', error: api.error };
  else {
    report.api = { httpStatus: api.status(), status: api.ok() ? 'VERIFICADO' : 'BLOQUEADO' };
    if (api.ok()) {
      await page.waitForSelector('.entry h2');
      await check('Búsqueda pública real y definiciones', async () => { assert.equal(await page.locator('.entry h2').first().textContent(), 'hello'); report.api.definitions = await page.locator('.definition-list li').count(); assert.ok(report.api.definitions > 0); });
      await page.locator('#results').screenshot({ path: `${output}/resultado-real.png` }); report.screenshots.push(`${output}/resultado-real.png`);
      const payload = await api.json();
      const urls = [...new Set(payload.flatMap(entry => (entry.phonetics || []).map(item => item.audio)).filter(item => typeof item === 'string' && item.startsWith('https://')))];
      for (const audioUrl of urls) {
        try { const r = await context.request.get(audioUrl, { timeout: 10000 }); report.audioResources.push({ url: audioUrl, httpStatus: r.status(), contentType: r.headers()['content-type'], bytes: (await r.body()).length }); }
        catch (e) { report.audioResources.push({ url: audioUrl, error: e.message }); }
      }
      if (await page.locator('.audio-button').count()) {
        await page.locator('.audio-button').first().focus(); await page.keyboard.press('Enter');
        await page.waitForFunction(() => document.querySelector('.audio-control')?.getAttribute('aria-busy') === 'false', null, { timeout: Math.max(20000, urls.length * 9000) });
        report.playback = await page.locator('audio').first().evaluate(a => ({ url: a.src, readyState: a.readyState, paused: a.paused, ended: a.ended }));
        report.playback.message = await page.locator('.audio-message').first().textContent();
        report.playback.status = report.playback.readyState >= 2 && (!report.playback.paused || report.playback.ended) ? 'VERIFICADO' : 'BLOQUEADO';
        await page.locator('.audio-control').first().screenshot({ path: `${output}/pronunciaciones.png` }); report.screenshots.push(`${output}/pronunciaciones.png`);
      }
    }
  }
  await page.locator('#theme').selectOption('light'); await shot('desktop-claro');
  await page.locator('#theme').selectOption('dark'); await shot('desktop-oscuro');
  await check('Axe: resultado público oscuro', audit);
  await page.setViewportSize({ width: 375, height: 812 }); await page.locator('#theme').selectOption('light'); await shot('movil');
  await check('Axe: resultado público móvil', audit);
  await check('Responsive público: cinco viewports', async () => { for (const width of [320,375,768,1024,1440]) { await page.setViewportSize({ width, height: 1000 }); assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow ${width}`); for (const selector of ['#word','#font','#theme','.audio-button','.audio-select']) { const loc = page.locator(selector).first(); if (await loc.count()) { const b = await loc.boundingBox(); assert.ok(b.x >= 0 && b.x + b.width <= width + 1 && b.height >= 44, `${width}: ${selector}`); } } } return { widths: [320,375,768,1024,1440] }; });
  await check('Preferencias públicas: cinco fuentes, tres temas y persistencia', async () => {
    const families = new Set();
    for (const font of ['editorial','classic','sans','humanist','mono']) { await page.locator('#font').selectOption(font); await page.evaluate(() => document.fonts.ready); families.add(await page.locator('h1').evaluate(e => getComputedStyle(e).fontFamily)); }
    assert.equal(families.size, 5);
    await page.locator('#theme').selectOption('system'); await page.emulateMedia({ colorScheme:'dark' }); await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
    await page.locator('#theme').selectOption('light'); assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
    await page.locator('#theme').selectOption('dark'); await page.reload(); assert.equal(await page.locator('#theme').inputValue(),'dark'); assert.equal(await page.locator('#font').inputValue(),'mono');
  });
  await check('Sin excepciones JavaScript en sitio público', async () => assert.deepEqual(errors, []));
} catch (e) { report.failures.push({ name: 'Public check', error: e.message }); }
finally {
  report.errors = errors;
  report.status = report.failures.length ? 'failed' : report.api?.status !== 'VERIFICADO' || report.playback?.status !== 'VERIFICADO' ? 'partial-external-service' : 'passed';
  await mkdir('artifacts', { recursive: true });
  await writeFile('artifacts/public-report.json', JSON.stringify(report, null, 2)+'\n');
  if (save) await writeFile('docs/evidencias/cierre/public-report.json', JSON.stringify(report, null, 2)+'\n');
  console.log(JSON.stringify(report)); await browser.close();
}
if (report.status !== 'passed') process.exitCode = 1;
