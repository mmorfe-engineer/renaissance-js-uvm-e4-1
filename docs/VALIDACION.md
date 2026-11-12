# Validación · evidencia del 12 de noviembre de 2026

## Ejecutado localmente

Entorno: Linux; Node.js **v26.1.0**, npm **11.13.0**.

`node tests/unit.test.js`: **18 pruebas aprobadas, 0 fallos**. `npm test` también finaliza con código 0; en este entorno el runner presenta el archivo completo como una suite en su resumen, por eso se ejecutó directamente para conservar el detalle de los dieciocho casos.

Casos: validación y normalización de espacios/apóstrofos/guiones; debounce con pausa; cancelación; URLs seguras; múltiples entradas y campos semánticos; datos incompletos; URL codificada y AbortSignal; HTTP 404, 429 y 500; red frente a abort; JSON inválido y respuesta sin entradas. Seis casos adicionales comprueban preferencias: seguimiento del sistema, prioridad y persistencia manual, restauración, almacenamiento bloqueado y dos formas de datos corruptos. Estas pruebas usan un DOM mínimo controlado para preferencias, no un navegador.

La auditoría de fuentes comprobó IDs HTML únicos, asociaciones `for`/`aria-describedby`, existencia de recursos referenciados e imports, sintaxis de los seis módulos y cinco archivos de fuentes distintos. No se detectaron fallos en esas comprobaciones.

`node --check` pasó para `js/app.js`, `js/ui.js`, `scripts/browser-check.mjs` y `scripts/live-check.mjs`. El preparador de sitio generó `dist/site` sin compilación.

## Intentado y bloqueado por el entorno

| Acción | Evidencia | Consecuencia |
|---|---|---|
| Iniciar servidor HTTP local | `listen EPERM: operation not permitted 127.0.0.1:4173` | No se pudo servir una sesión interactiva aquí |
| Arrancar Chromium con Playwright | `sandbox_host_linux.cc:41 ... shutdown: Operation not permitted` | No hay capturas ni comprobación visual local |
| Consultar GitHub por CLI/Git | `Could not resolve host: github.com` | Usar conector conectado si su identidad es apropiada |
| Inicializar Git en workspace | `.git/info/: Read-only file system` | No se pudo configurar `origin`, ramas ni commits locales |
| Consultar API real desde herramienta web | Endpoint no accesible por esa herramienta | No acredita funcionamiento del proveedor en vivo |

No se modificaron protecciones del entorno ni identidades Git para evitar estos bloqueos.

Después de que el usuario confirmó la autenticación principal como `mmorfe-engineer`, se intentó verificarla. Las herramientas de GitHub comenzaron a devolver `Unknown tool` para identidad y lectura del repositorio; el gestor de plugins sí informó GitHub instalado y habilitado. Esto bloquea la integración en esta sesión, pero no demuestra que la autenticación indicada por el usuario sea incorrecta. No se publicaron archivos ni se alteró el remoto.

## Preparado para ejecución en un entorno compatible

`scripts/browser-check.mjs` usa Playwright y axe. Sirve la aplicación desde respuestas controladas del navegador, sin servidor externo. Comprueba debounce, envío sin duplicado, estado inicial/carga, DOM, errores, concurrencia, audio controlado, sinónimos, temas, cinco fuentes, persistencia, almacenamiento bloqueado, teclado e inyección de texto.

Verifica anchos **320, 375, 768, 1024 y 1440**: ausencia de overflow horizontal, controles dentro del viewport, alturas de interacción y capturas. Ejecuta axe WCAG A/AA en inicio, resultado oscuro y resultado móvil claro. Genera `artifacts/browser-report.json` y PNG. **Pendiente de ejecutar; no se afirma que haya pasado.**

`scripts/live-check.mjs` consulta **Dictionary API real** para `hello`, comprueba definición y, si existe, descarga el audio real e intenta reproducirlo. Con `LIVE_URL` verifica el sitio público. Genera informe y captura independientes. **Pendiente de ejecutar con red y navegador disponibles.**

La verificación automática no sustituye revisión visual, zoom, escucha humana ni lector de pantalla. Esas revisiones son parte de la tarea real de `morfemartin`.

## Reproducir

```sh
npm test
npm install --ignore-scripts
npx playwright install --with-deps chromium
npm run test:browser
node scripts/live-check.mjs
LIVE_URL=https://mmorfe-engineer.github.io/renaissance-js-uvm-e4-1/ node scripts/live-check.mjs
```

El último comando solo corresponde cuando exista una publicación. Una API externa caída debe registrarse como tal, sin desactivar pruebas para afirmar éxito.
