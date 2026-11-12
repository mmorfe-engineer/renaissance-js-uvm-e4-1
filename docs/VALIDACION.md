# Validación posterior al merge

## Ejecución y procedencia

Código de integración: `c4ab9c15763b18fdc07dfc3c162cb959938de73b`, merge normal del PR #1. Entorno Linux, Node v26.1.0, Playwright 1.63.0, Chromium 153.0.8010.12 y axe-core 4.10.3. Informes con fecha real y hashes de los archivos evaluados en [evidencias/cierre](evidencias/cierre/).

- **20 pruebas unitarias aprobadas, 0 fallos**, ejecutadas nuevamente tras integrar. [Informe estructurado](evidencias/cierre/unit-report.json) y [TAP](evidencias/cierre/unit.tap).
- **35 comprobaciones de navegador aprobadas, 0 fallos y 0 excepciones JS**. [Informe](evidencias/cierre/browser-report.json). Usa fixtures exclusivamente de pruebas.
- **8 comprobaciones públicas aprobadas**, con API real sin interceptar y sin fallos de las comprobaciones de UI. [Informe](evidencias/cierre/public-report.json). El resultado global es parcial por audio externo, no un éxito integral.

Los scripts generadores leen los informes y la matriz para producir gráficos; no escriben cantidades de pruebas ni estados a mano. Los cambios documentales posteriores conservan el mismo código de aplicación; el cierre final comprueba sus hashes contra el HEAD y los recursos públicos.

## Qué comprueban las suites

Las unitarias cubren entrada, URLs, debounce, normalización, HTTP 404/429/500, red/abort, JSON y preferencias. Incluyen conservación de pronunciaciones HTTPS únicas con fuente/licencia y ausencia de alternativas válidas.

La suite browser comprueba estados, DOM, sinónimos, concurrencia, entrada por teclado, inyección de texto, preferencias, storage bloqueado y cinco viewports. El bloque de pronunciación prueba primera alternativa fallida y segunda disponible, fallo total y reintento, cambio de selección con promesa pendiente, retirada por nueva consulta, foco y combinaciones de dos temas y cinco fuentes. Estos recursos son simulados, no prueba del proveedor.

## GitHub Pages, API y audio: capas separadas

Sitio visitado: https://mmorfe-engineer.github.io/renaissance-js-uvm-e4-1/.

| Capa | Resultado de esta ejecución |
|---|---|
| Página pública | HTTP 200; UI cargada en Chromium |
| Dictionary API | HTTP 200 para hello, siete definiciones reales |
| Recursos HTTP de audio | hello-au.mp3 y hello-uk.mp3: HTTP 404, text/html; ese cuerpo no cuenta como audio |
| Reproducción del navegador | No acreditada: readyState 0, paused true; estado BLOQUEADO |
| Fallback real | Se intentan las dos alternativas y se anuncia fallo total |
| Prueba auditiva manual del usuario | EJECUTADA sin reproducción audible en cat, house, street y hello; no es reproducción exitosa |

`live-check.mjs` devuelve **1**, `failed-external-audio`. `public-check.mjs` devuelve **1**, `partial-external-service`. Esos códigos se conservan; no se declara que el proveedor funcione porque la interfaz haya pasado las pruebas. [Live report](evidencias/cierre/live-report.json).

El HTTP 403 y timeout originales de Codespaces permanecen en [REVISION_MORFEMARTIN](REVISION_MORFEMARTIN.md). La diferencia entre entornos no demuestra por sí sola un defecto de aplicación ni una causa definitiva del fallo externo.

## Responsive y accesibilidad

Comprobados automáticamente en el sitio público y en pruebas controladas: **320, 375, 768, 1024 y 1440 px**, sin overflow y controles de al menos 44 px. La matriz de temas/fuentes del nuevo control también pasa. Se inspeccionaron visualmente capturas públicas de desktop claro y móvil: contenido legible, control adaptado y mensaje de fallo visible.

Axe: cero infracciones detectadas en los escenarios ejecutados. Las tres auditorías sobre Pages corresponden a inicio, resultado oscuro y resultado móvil. El teclado automatizado comprueba salto al contenido y la suite de pronunciación conserva foco. No se afirma una certificación WCAG.

| Revisión humana | Estado |
|---|---|
| Teclado completo y orden de foco en todos los escenarios | PENDIENTE |
| Zoom real de navegador al 200 % | PENDIENTE |
| Lector de pantalla y anuncios efectivos | PENDIENTE |
| Prueba auditiva manual en cat, house, street y hello | EJECUTADA por el usuario, sin audio audible; calidad perceptual no evaluable |

## Capturas públicas

[Desktop claro](assets/screenshots/desktop-claro.png), [desktop oscuro](assets/screenshots/desktop-oscuro.png), [móvil](assets/screenshots/movil.png), [resultado](assets/screenshots/resultado-real.png) y [pronunciaciones](assets/screenshots/pronunciaciones.png). Procedencia, fecha y navegador en public-report. No son mockups ni respuestas precargadas.

## Reproducir

```sh
npm ci --ignore-scripts
npm test
npx playwright install --with-deps chromium
npm run test:browser
LIVE_URL=https://mmorfe-engineer.github.io/renaissance-js-uvm-e4-1/ node scripts/live-check.mjs
node scripts/public-check.mjs
```

`SAVE_EVIDENCE=1 node scripts/public-check.mjs` actualiza capturas e informe documental. `node scripts/summarize-verification.mjs` ejecuta unitarias, registra sus resultados y toma el browser-report de la ejecución previa. `node scripts/generate-doc-graphics.mjs` regenera SVG desde esos datos y la matriz. No usar informes de otra versión de código sin comprobar hashes.

Después del commit documental final se espera Pages y se repite la comprobación pública. El reporte final en dist registra ese HEAD, deployment, archivos remotos, enlaces y ZIP; no se inserta un hash circular del propio commit en sus archivos.

## Presentación y enlaces

Los tres diagramas Mermaid del README se parsearon y renderizaron en Chromium con Mermaid; [informe](evidencias/cierre/diagrams-report.json). Los SVG locales pasaron parseo XML. Los enlaces Markdown y recursos de imagen se comprobaron contra archivos locales y mediante HTTP; [informe de enlaces](evidencias/cierre/links-report.json). La revisión se repite tras el commit final para registrar el estado publicado.

## Evidencia manual incorporada al cierre técnico

El usuario confirmó pruebas sobre GitHub Pages con **cat, house, street y hello**, sin reproducción audible en ninguno. [Registro de la confirmación](evidencias/cierre/manual-audio-report.json). La fecha de registro corresponde a esta incorporación; no se inventan fecha exacta de observación, navegador ni configuración de audio.

Para hello hay evidencia automatizada independiente de dos URLs HTTP 404. **Para cat, house y street no se midió HTTP y no se les atribuye 404 ni una causa específica.** La observación manual es únicamente ausencia de reproducción audible.

La lógica propia —botón personalizado, reproducción con recurso válido controlado, selección, fallback, reintento, cancelación y fallo total— está implementada y validada por las pruebas de navegador. TR-22 sigue **BLOQUEADO — dependencia externa** porque no se acredita reproducción pública de los recursos suministrados por Dictionary API. No se añadió una segunda API, audio propio ni SpeechSynthesis para fabricar un PASS.

El video queda excluido de esta fase técnica como entregable académico separado. Siguen pendientes la revisión humana completa de teclado/foco, zoom real 200 % y lector de pantalla; no se convierten en PASS por la prueba auditiva.
