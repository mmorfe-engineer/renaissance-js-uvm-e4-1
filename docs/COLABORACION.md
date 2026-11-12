# Colaboración auténtica

Propietario: `mmorfe-engineer`. Segundo integrante: `morfemartin`. No crear repositorios alternativos ni duplicar la invitación existente.

## Acceso e historial verificados · 2026-11-12

La CLI autenticada es `mmorfe-engineer` (ID 234090349). GitHub devuelve `permission: write`, `role_name: write` y `push: true` para `morfemartin` (ID 223161775). No se duplicaron invitaciones. La lista de contributors contiene únicamente a `mmorfe-engineer`, con el commit inicial `2b90387`; esto acredita acceso del colaborador, **no su contribución**.

El commit inicial se publicó antes de recibir la política de distribución, y contiene también la interfaz implementada previamente. No se reescribirá la historia para fingir un reparto anterior. La [política vinculante](CONTRATO_MAESTRO.md) queda incorporada antes del siguiente commit. La identidad Git local del propietario se confirmó con nombre y correo de su cuenta; no se configuró ninguna identidad del colaborador.

## Bloque funcional reservado: pronunciación resiliente y accesible

**Responsable exclusivo de la implementación pendiente: `morfemartin`.** Rama a crear desde su propio entorno: `feature/ui-accessibility-morfemartin`.

Hallazgo reproducible: la API de `hello` devuelve definiciones HTTP 200 y URLs de audio, pero el primer recurso `hello-au.mp3` devolvió HTTP 404 al cliente Playwright y 403 a curl. El control anuncia el fallo correctamente, pero solo conserva una pronunciación. No se declara audio real aprobado.

Archivos: `js/api.js` (conservar pronunciaciones HTTPS alternativas con sus datos), `js/ui.js` (selección o reintento de alternativas iniciado por el usuario, estado de reproducción accesible), `css/styles.css` (layout móvil, foco y estados de ese control), `tests/unit.test.js`, `scripts/browser-check.mjs` y `docs/REVISION_MORFEMARTIN.md`.

Objetivo: ofrecer alternativas reales suministradas por Dictionary API, sin fabricar URLs ni ocultar fallos, con interacción de teclado clara. Si todos los recursos fallan, informar el problema y permitir reintentar sin bloquear la consulta. No introducir autoplay ni proveedores inventados.

Criterios de terminado:

- Cambio funcional identificable en el manejo de pronunciaciones y su interfaz, con validación de URLs y pruebas de primera alternativa fallida, alternativa disponible y fallo total.
- Botón/selector accesible, foco visible, estado anunciado, controles de al menos 44 px y sin overflow en 320, 375, 768, 1024 y 1440 px; revisar temas y cinco fuentes.
- Ejecutar pruebas de lógica y navegador; verificar audio real y registrar honestamente restricciones externas. Revisar zoom 200 %, teclado y lector de pantalla; documentar herramientas y resultados.
- Crear commits propios, push y PR real desde `morfemartin`. Integrar con merge normal preservando sus commits; comparar autorías antes y después. No squash ni reatribución.

La implementación de este bloque queda pendiente: el propietario solo documentó el hallazgo y mejoró el diagnóstico de la prueba en vivo. No realizó el cambio de interfaz reservado.

## Tarea real para morfemartin

Rama: **`feature/ui-accessibility-morfemartin`**, a crear por el colaborador desde su entorno real. La revisión siguiente complementa el bloque funcional reservado.

Objetivo: ejecutar y completar la validación responsive y de accesibilidad; reproducir problemas reales, corregirlos cuando corresponda y aportar evidencia propia.

1. Desde su sesión autenticada, clonar el repositorio canónico cuando tenga el código, actualizar `main` y crear la rama indicada.
2. Ejecutar `npm test`, instalar dependencias de prueba y ejecutar `npm run test:browser` y `node scripts/live-check.mjs`.
3. Revisar a 320, 375, 768, 1024 y 1440 px, ambos temas, cinco fuentes, zoom 200 %, navegación completa con teclado y audio. Escuchar realmente al menos una pronunciación.
4. Revisar con lector de pantalla la etiqueta de búsqueda, el anuncio de carga, el resultado, la validación y el botón de audio. Registrar herramienta, versión, fecha y resultado sin afirmar pruebas no realizadas.
5. Si hay un fallo, corregir el código y comprobar el escenario; además del cambio funcional reservado, aportar la revisión reproducible y sus evidencias en `docs/REVISION_MORFEMARTIN.md`.
6. Crear commits propios y abrir un pull request hacia `main`, con resultados y capturas, desde su cuenta real. No aceptar un commit vacío, un cambio cosmético inventado o una atribución escrita por otro como evidencia de participación.
7. Explicar en el video su revisión y el JavaScript de preferencias/audio o las correcciones realizadas. La participación debe ser real y entendida.

```sh
git clone https://github.com/mmorfe-engineer/renaissance-js-uvm-e4-1.git
cd renaissance-js-uvm-e4-1
git switch main
git pull --ff-only origin main
git switch -c feature/ui-accessibility-morfemartin
npm test
npm install --ignore-scripts
npx playwright install --with-deps chromium
npm run test:browser
node scripts/live-check.mjs
```

La identidad Git debe corresponder a la persona que ejecuta el trabajo y a un correo verificado en su propia cuenta. Cada integrante verifica su configuración; este proyecto no la sustituye automáticamente.

## Criterio de integración

Revisar diff y resultados, resolver fallos, conservar el autor real y fusionar solo después de confirmar que el PR cumple la tarea. La entrega requiere evidencia verificable de ambos integrantes. Una rama o este documento por sí solos no acreditan participación.
