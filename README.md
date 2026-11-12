# Renaissance Lexicon

Diccionario de inglés original para **E-Actividad 4.1 — Aplicar conocimientos en ejercicio práctico de JS**, curso **FrontEndIVIVFI2026C**, Universidad Valle del Momboy. JavaScript Edition. Cierre indicado: **14 de noviembre de 2026, 23:59**, hora de Venezuela. Ponderación: 15 %.

Busca una palabra en inglés y consulta sus definiciones, categorías gramaticales, ejemplos, sinónimos, fonética, audio y fuentes cuando Dictionary API los proporciona. La interfaz está en español; el contenido del diccionario permanece en inglés.

- Repositorio canónico: https://github.com/mmorfe-engineer/renaissance-js-uvm-e4-1
- Publicación prevista: `https://mmorfe-engineer.github.io/renaissance-js-uvm-e4-1/`. **Todavía no acreditada como desplegada.**
- Equipo: `mmorfe-engineer` y `morfemartin`. La contribución independiente del segundo integrante sigue pendiente; consultar [colaboración](docs/COLABORACION.md).

## Ejecutar

Requiere Node.js 22 o posterior para los scripts de desarrollo. La aplicación no tiene dependencias de ejecución, frameworks ni compilación.

```sh
npm start
```

Abrir `http://127.0.0.1:4173`. No abrir el HTML con `file://`: los módulos ES necesitan un servidor HTTP. También funciona con cualquier alojamiento estático, incluso en un subdirectorio. El navegador necesita conexión a Internet para consultar Dictionary API y reproducir audio remoto; las cinco fuentes tipográficas se incluyen localmente.

## Usar

1. Escribir una palabra inglesa, como `hello`, `learn` o `serendipity`.
2. Esperar una pausa de 450 ms, pulsar Enter o usar Buscar. Enviar el formulario cancela el temporizador para evitar duplicados.
3. Leer los resultados y pulsar Escuchar si hay audio. Un sinónimo inicia otra consulta.
4. Escoger tema Sistema, Claro u Oscuro y una de cinco familias de lectura. Las preferencias persisten si el navegador permite `localStorage`.

Se admiten letras inglesas, espacios interiores, guiones y apóstrofos entre palabras, hasta 80 caracteres. Espacios exteriores y mayúsculas se normalizan. No es un traductor ni un diccionario de español. Las palabras sugeridas son accesos de búsqueda; no contienen resultados precargados.

## JavaScript que se evalúa

```text
input → debounce (450 ms) → validación → fetch + async/await
      → normalización de arrays/objetos → creación dinámica del DOM
```

El formulario permite consulta inmediata. `AbortController` y un contador de generación impiden que respuestas antiguas sustituyan consultas recientes. Un límite de 12 segundos evita cargas indefinidas. Los errores distinguen ausencia de palabra, fallo HTTP, respuesta inválida y red. El DOM usa `textContent`, nunca HTML suministrado por la API.

| Archivo | Responsabilidad |
|---|---|
| `index.html` | HTML5 semántico, formulario y preferencias |
| `css/styles.css` | Diseño original, cinco familias, temas, responsive y foco |
| `js/app.js` | Eventos, debounce, validación, estados y concurrencia |
| `js/api.js` | `fetch`, HTTP, JSON y normalización |
| `js/ui.js` | DOM, resultados, sinónimos, audio y anuncios accesibles |
| `js/preferences.js` | `matchMedia`, temas y almacenamiento tolerante a fallos |
| `js/utils.js` | Debounce cancelable, validación y URLs HTTPS |
| `tests/` | Pruebas de lógica y datos sintéticos exclusivos de pruebas |
| `scripts/` | Servidor, pruebas de navegador, publicación y ZIP |
| `.github/workflows/` | Verificación y despliegue preparados |

## Verificar

```sh
npm test
npm install --ignore-scripts
npx playwright install --with-deps chromium
npm run test:browser
node scripts/live-check.mjs
```

`npm test` usa únicamente el runner nativo de Node. Playwright y axe son dependencias de desarrollo. Las pruebas de navegador cubren respuestas controladas; `live-check.mjs` consulta el servicio y audio reales. No confundir datos de prueba con resultados de producción. Los informes y capturas se escriben en `artifacts/`.

En esta sesión pasaron las **18 pruebas de lógica y preferencias**. El entorno impidió abrir sockets locales y arrancar Chromium. **Responsive, axe, audio real y publicación todavía no se acreditan como verificados.** Detalle en [VALIDACION](docs/VALIDACION.md).

## Publicar y entregar

Activar **Settings → Pages → Source → GitHub Actions** desde una cuenta administradora. El workflow de Pages despliega después de una verificación exitosa en `main`, o manualmente. Publica solo `index.html`, `css/`, `js/` y `assets/`; luego ejecuta una búsqueda contra la URL publicada.

```sh
npm run package
```

Produce `dist/renaissance-lexicon-e4-1.zip` y un manifiesto SHA-256 de los archivos. No incluye Git, dependencias ni secretos. El video de ambos integrantes debe grabarse y adjuntarse/enlazarse antes de entregar; existe un guion de 8:45, no una grabación terminada.

- [Arquitectura](docs/ARQUITECTURA.md)
- [Matriz académica](docs/RUBRICA.md)
- [Validación y límites de evidencia](docs/VALIDACION.md)
- [Tarea real del segundo integrante](docs/COLABORACION.md)
- [Guion del video](docs/GUIA_VIDEO.md)
- [Entrega y pendientes](docs/ENTREGA.md)
- [Referencias y licencias](REFERENCIAS.md)

Implementación creada para este ejercicio, sin copiar soluciones de Internet. Los proyectos donantes se inspeccionaron en solo lectura para continuidad visual y documental. No se trasladó código de aplicación, Git, backend, datos ni secretos de ellos. Las tipografías conservan sus licencias en `assets/fonts/`.
