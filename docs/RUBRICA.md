# Matriz de cobertura académica

Fuente normativa: contrato aportado por el usuario para E-Actividad 4.1, FrontEndIVIVFI2026C, UVM. La marca «implementado» describe código presente, no verificación de navegador.

| Requisito | Implementación | Evidencia/estado |
|---|---|---|
| HTML5 y CSS personalizado | `index.html`, `css/styles.css` | Implementados, sin framework |
| JavaScript visible y sintaxis | `js/*.js` | Módulos ES; comprobación de sintaxis local |
| Buscador y validación | `app.js`, `utils.js` | Pruebas de normalización y entrada inválida pasan |
| Debounce real | `utils.js`, 450 ms en `app.js` | Pruebas temporizadas y cancelación pasan |
| Fetch, async/await, errores | `api.js` | Pruebas HTTP 404/429/500, red, JSON y abort pasan |
| Estados inicial/carga/resultado/ausente/error | `app.js`, `ui.js` | Implementados; suite de navegador preparada |
| Palabra y fonética | `normalizeEntries`, `renderEntries` | Datos ausentes tolerados; pruebas de normalización pasan |
| Significados, categorías y verbos | `api.js`, `ui.js` | Se conservan todas las categorías; prueba de verbo pasa |
| Definiciones y ejemplos | `ui.js` | Listas y citas dinámicas; prueba de datos pasa |
| Sinónimos | `api.js`, `ui.js` | De significado y definición; búsqueda interactiva implementada |
| Fuentes retornadas | `sourceUrls`, sección fuentes | Solo enlaces HTTPS seguros; prueba pasa |
| Audio y botón personalizado | `ui.js` | Elemento audio oculto, play/ended/error, sin autoplay; verificación pendiente |
| Claro, oscuro y sistema | `preferences.js`, CSS | Implementados; pruebas de navegador preparadas |
| Cinco tipografías reales | CSS, `assets/fonts/` | Cinco archivos distintos y licencias incluidos |
| Persistencia tolerante a fallos | `preferences.js` | Implementada; suite cubre storage bloqueado |
| Responsive | CSS | Suite preparada para cinco anchos; ejecución pendiente |
| Accesibilidad | HTML/CSS/UI | Semántica y teclado implementados; axe/inspección visual pendientes |
| Renderizado dinámico | `ui.js` | API se inserta mediante DOM; no hay resultados ficticios en HTML |
| Repositorio GitHub | URL canónica en footer/README | Remoto confirmado; publicación de código pendiente |
| Avance de ambos integrantes | `docs/COLABORACION.md` | Tarea independiente preparada; commits reales pendientes |
| Video ≤10 minutos | `docs/GUIA_VIDEO.md` | Guion 8:45; grabación de ambos integrantes pendiente |
| Publicación funcional | Workflows de calidad y Pages | Preparados; despliegue y verificación pública pendientes |
| Originalidad | Código creado para esta actividad | Solo documentación oficial y donantes en lectura |

**No se declara completada la entrega académica** hasta contar con pruebas de navegador, URL pública verificada, historial auténtico de ambos integrantes y video final.
