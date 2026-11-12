# Colaboración auténtica

Propietario: `mmorfe-engineer`. Segundo integrante: `morfemartin`. No crear repositorios alternativos ni duplicar la invitación existente.

## Acceso observado

El 12 de noviembre de 2026 el conector GitHub informó que la cuenta autenticada era `morfemartin`. La lectura del repositorio canónico devolvió permisos efectivos `push: true`, `pull: true`. Esto acredita acceso de escritura de la cuenta conectada. El endpoint específico de permisos del colaborador devolvió 403 por límites de la integración, por lo que no se afirma haber inspeccionado directamente la invitación.

La publicación principal mediante ese conector se dejó pendiente para no confundir el trabajo asistido de esta sesión con la tarea independiente del segundo integrante. No se cambiaron `user.name` ni `user.email`, no se fabricaron autores ni commits y no se enviaron invitaciones.

Posteriormente el usuario confirmó la conexión principal como `mmorfe-engineer` y autorizó la publicación. La verificación de esa conexión devolvió `Unknown tool`, por lo que el bloqueo actual es la disponibilidad de las herramientas, no una solicitud pendiente de cambiar la cuenta. La rama propuesta aún no pudo crearse.

## Tarea real para morfemartin

Rama propuesta: **`collaboration/morfemartin-responsive-a11y`**. Todavía no creada en el remoto.

Objetivo: ejecutar y completar la validación responsive y de accesibilidad; reproducir problemas reales, corregirlos cuando corresponda y aportar evidencia propia.

1. Desde su sesión autenticada, clonar el repositorio canónico cuando tenga el código, actualizar `main` y crear la rama indicada.
2. Ejecutar `npm test`, instalar dependencias de prueba y ejecutar `npm run test:browser` y `node scripts/live-check.mjs`.
3. Revisar a 320, 375, 768, 1024 y 1440 px, ambos temas, cinco fuentes, zoom 200 %, navegación completa con teclado y audio. Escuchar realmente al menos una pronunciación.
4. Revisar con lector de pantalla la etiqueta de búsqueda, el anuncio de carga, el resultado, la validación y el botón de audio. Registrar herramienta, versión, fecha y resultado sin afirmar pruebas no realizadas.
5. Si hay un fallo, corregir el código y comprobar el escenario; si no hay fallos, aportar la revisión reproducible y sus evidencias en `docs/REVISION_MORFEMARTIN.md`.
6. Crear commits propios y abrir un pull request hacia `main`, con resultados y capturas, desde su cuenta real. No aceptar un commit vacío, un cambio cosmético inventado o una atribución escrita por otro como evidencia de participación.
7. Explicar en el video su revisión y el JavaScript de preferencias/audio o las correcciones realizadas. La participación debe ser real y entendida.

```sh
git clone https://github.com/mmorfe-engineer/renaissance-js-uvm-e4-1.git
cd renaissance-js-uvm-e4-1
git switch main
git pull --ff-only origin main
git switch -c collaboration/morfemartin-responsive-a11y
npm test
npm install --ignore-scripts
npx playwright install --with-deps chromium
npm run test:browser
node scripts/live-check.mjs
```

La identidad Git debe corresponder a la persona que ejecuta el trabajo y a un correo verificado en su propia cuenta. Cada integrante verifica su configuración; este proyecto no la sustituye automáticamente.

## Criterio de integración

Revisar diff y resultados, resolver fallos, conservar el autor real y fusionar solo después de confirmar que el PR cumple la tarea. La entrega requiere evidencia verificable de ambos integrantes. Una rama o este documento por sí solos no acreditan participación.
