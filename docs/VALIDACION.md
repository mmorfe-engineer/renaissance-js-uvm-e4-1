# Validación · evidencia del 12 de noviembre de 2026

## Resultados actuales

Entorno Linux, Node v26.1.0, Playwright 1.63.0, Chromium 153.0.8010.12, axe-core 4.10.3.

- `npm test`: **18 pruebas, 18 aprobadas, 0 fallos**. Validación, debounce, URLs, normalización, HTTP, red, abort, JSON y preferencias.
- `npm run test:browser`: **30 comprobaciones aprobadas, 0 fallos, 0 excepciones JS**. Evidencia: [browser-report.json](evidencias/browser-report.json).
- Responsive: sin overflow y controles visibles de al menos 44 px en **320, 375, 768, 1024 y 1440 px**. Capturas de los cinco anchos en `artifacts/`; muestras versionadas en `docs/evidencias/`. Se inspeccionó visualmente la captura móvil de 375 px.
- Axe WCAG A/AA: **0 infracciones detectadas** en inicio, resultado oscuro y resultado móvil claro. Esto no certifica cumplimiento completo de WCAG.
- Teclado, enlace de salto, Enter, cinco fuentes, tema sistema/claro/oscuro, persistencia y almacenamiento bloqueado aprobados en navegador con respuestas controladas.
- Audio controlado: invocación, error, fin de reproducción y recuperación del botón aprobados. Esto no demuestra reproducción de un recurso remoto.

## Sitio y proveedor reales

URL devuelta por Pages y visitada con Chromium: https://mmorfe-engineer.github.io/renaissance-js-uvm-e4-1/.

Deployment inicial exitoso: https://github.com/mmorfe-engineer/renaissance-js-uvm-e4-1/actions/runs/43284501043, fuente `2b90387`. Datos en [deployment-inicial.json](evidencias/deployment-inicial.json).

`LIVE_URL=https://mmorfe-engineer.github.io/renaissance-js-uvm-e4-1/ node scripts/live-check.mjs` obtuvo:

- Dictionary API real: **HTTP 200**, `hello`, **7 definiciones**.
- Preferencias reales: oscuro y mono persistieron tras recargar.
- Excepciones JavaScript: **0**.
- Audio: `hello-au.mp3` devolvió **HTTP 404** en Playwright; el botón anunció «No se pudo reproducir el audio». Curl devolvió HTTP 403 en los recursos AU y UK. No se atribuye una causa definitiva a esta diferencia entre clientes.
- Resultado global de la prueba en vivo: **`failed-external-audio`, código 1**. No se oculta ni convierte el fallo en éxito. Informe: [live-report.json](evidencias/live-report.json); captura real: [live-hello.png](evidencias/live-hello.png).

La prueba conserva el fallo externo y comprueba igualmente búsqueda y preferencias. La mejora funcional de pronunciaciones alternativas está reservada a `morfemartin` en COLABORACION.

## Límites pendientes

Revisión manual con lector de pantalla, zoom 200 %, escucha humana y revisión completa de interfaz por el segundo integrante todavía pendientes. Las pruebas automáticas y una captura inspeccionada no sustituyen esas comprobaciones.

Los bloqueos de la sesión anterior (Git de solo lectura, Chromium, DNS y herramientas ausentes) dejaron de impedir las verificaciones actuales. La instalación de dependencias necesitó autorización por el caché npm de solo lectura; se utilizó `/tmp/renaissance-npm-cache`. La CLI tiene acceso al repositorio y configura Pages, pero su token no incluye scope `workflow`; por ello se usa publicación nativa desde main y las plantillas permanecen en scripts/workflows.

## Reproducir

```sh
npm ci --ignore-scripts
npm test
npx playwright install --with-deps chromium
npm run test:browser
LIVE_URL=https://mmorfe-engineer.github.io/renaissance-js-uvm-e4-1/ node scripts/live-check.mjs
npm run package
```

Los resultados posteriores pueden variar por disponibilidad de servicios externos. Cada ejecución escribe su fecha y resultados; no declarar éxito si devuelve error.
