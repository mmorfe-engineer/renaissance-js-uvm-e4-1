# Cumplimiento del pliego · fuente canónica

Los identificadores TR son códigos internos de trazabilidad creados para este proyecto y no forman parte de la numeración oficial del enunciado de la Universidad Valle del Momboy.

La matriz recoge los requisitos del enunciado suministrado por el usuario para E-Actividad 4.1, opción #2. Las formulaciones son fieles; no se presentan como citas literales de un documento oficial no adjunto. Los requisitos de presentación añadidos en el contrato de cierre no se atribuyen al profesor.

VERIFICADO significa evidencia suficiente para el alcance descrito. PENDIENTE requiere ejecución/documento adicional. BLOQUEADO identifica una dependencia que impide comprobar el comportamiento real. NO APLICA se reserva para requisitos ajenos a la opción; no se usa para evitar incumplimientos.

| ID interno | Requisito literal/fiel del profesor | Implementación | Evidencia verificable | Estado |
|---|---|---|---|---|
| TR-01 | Aplicar conocimientos en un ejercicio práctico de JavaScript | Módulos ES del diccionario | [Unitarias](evidencias/cierre/unit-report.json), [navegador](evidencias/cierre/browser-report.json) | VERIFICADO |
| TR-02 | Utilizar JavaScript para crear interfaces | Estados y resultados creados por DOM en ui.js | Browser: resultado dinámico, carga, errores, sinónimos e inyección segura | VERIFICADO |
| TR-03 | Mostrar ejemplos claros de HTML5 | Formulario, main, section, article, encabezados y labels | index.html y axe/teclado en [sitio real](evidencias/cierre/public-report.json) | VERIFICADO |
| TR-04 | CSS personalizado | css/styles.css, variables, layout y foco | Recursos públicos comparados por SHA-256; capturas reales | VERIFICADO |
| TR-05 | Diseño responsive web | Media queries y controles adaptativos | Browser y sitio real: 320, 375, 768, 1024, 1440 px sin overflow | VERIFICADO |
| TR-06 | Sintaxis JavaScript evaluable | Constantes, funciones, eventos, arrays, objetos y asincronía | Enlaces de código en README y ejecución de suites | VERIFICADO |
| TR-07 | Proporcionar enlace al repositorio GitHub | Repositorio público canónico | [Repositorio](https://github.com/mmorfe-engineer/renaissance-js-uvm-e4-1) y footer | VERIFICADO |
| TR-08 | Evidenciar avance con commits de los integrantes | Historial principal y rama del colaborador | [PR #1](https://github.com/mmorfe-engineer/renaissance-js-uvm-e4-1/pull/1), dos commits preservados con author/committer morfemartin | VERIFICADO |
| TR-09 | Equipo de máximo cuatro integrantes | Dos integrantes humanos | Ficha académica y Contributors; historial de ambos | VERIFICADO |
| TR-10 | Entregar video explicativo | Guion y reparto por trabajo real | GUIA_VIDEO; grabación y URL no suministradas | PENDIENTE |
| TR-11 | Explicar funcionamiento de la aplicación en video | Demo prevista de búsqueda y preferencias | Guion; requiere video real | PENDIENTE |
| TR-12 | Explicar el código en video | Recorrido por módulos y eventos | Guion; requiere video real | PENDIENTE |
| TR-13 | Dar énfasis al código en la explicación | Bloques de debounce, fetch, datos, DOM y audio | Guion orientado al código; requiere grabación | PENDIENTE |
| TR-14 | Video de máximo diez minutos | Guion objetivo 8:45 | Duración del archivo real aún no comprobable | PENDIENTE |
| TR-15 | No copiar ejercicios de Internet | Implementación para esta actividad, referencias y licencias | Historial incremental, revisión de fuentes y REFERENCIAS; evidencia de procedencia, no certificación universal de originalidad | VERIFICADO |
| TR-16 | Opción #2: utilizar Dictionary API | fetch al endpoint público de entradas en inglés | Consulta real hello HTTP 200; public-report.json | VERIFICADO |
| TR-17 | Implementar un diccionario web | Buscador y resultados dinámicos | Sitio público, captura resultado-real y suite browser | VERIFICADO |
| TR-18 | Mostrar verbos y partes de la oración | meanings.partOfSpeech y etiquetas en español | Caso verbo en browser y categorías reales de hello | VERIFICADO |
| TR-19 | Mostrar significados | Listas de definiciones | Búsqueda pública real y normalización comprobadas | VERIFICADO |
| TR-20 | Mostrar sinónimos | Sinónimos de categoría/definición y botones de consulta | Browser: sinónimo inicia otra búsqueda | VERIFICADO |
| TR-21 | Mostrar pronunciación textual | Colección de fonéticas | Normalización, DOM y captura de hello | VERIFICADO |
| TR-22 | Reproducir audio de pronunciación | Alternativas suministradas, fallback y reintento | Implementación y audio simulado aprobados; recursos reales fallan externamente, sin reproducción acreditada | BLOQUEADO |
| TR-23 | Usar botón de reproducción personalizado | .audio-button, play(), estado y mensajes | Browser: invocación, fallback, fallo total, cancelación y foco | VERIFICADO |
| TR-24 | Ocultar controles nativos de audio | audio.hidden; sin atributo controls | Aserción de navegador y DOM público | VERIFICADO |
| TR-25 | Aplicar debounce al escribir | 450 ms, cancelación al enviar/limpiar | Casos temporizados unitarios y browser | VERIFICADO |
| TR-26 | Mostrar fuentes devueltas por la API | sourceUrls y licencia de entrada | Normalización segura y links de resultado real | VERIFICADO |
| TR-27 | Tema claro | Preferencia light y variables CSS | Browser y captura desktop-claro pública | VERIFICADO |
| TR-28 | Tema oscuro | Preferencia dark y variables CSS | Browser y captura desktop-oscuro pública | VERIFICADO |
| TR-29 | Tema del sistema | matchMedia y listener de cambios | Browser y public-check con emulación del sistema | VERIFICADO |
| TR-30 | Permitir cinco tipografías | Cinco archivos locales y selector | Familias efectivas distintas y persistencia comprobadas | VERIFICADO |
| TR-31 | Responsive en la opción diccionario | Controles y contenido sin overflow | Cinco viewports en browser y sitio público | VERIFICADO |
| TR-32 | Accesibilidad | Labels, regiones de estado, foco y teclado | Axe y teclado automatizados aprobados; lector de pantalla, zoom 200 % y revisión humana completa pendientes | PENDIENTE |

## Límites y entrega

El estado de TR-22 se refiere al proveedor/red en las ejecuciones registradas; no demuestra un defecto de la aplicación. El fallo 403 de Codespaces se conserva en la revisión original del colaborador, sin sustituirlo por un éxito posterior de otro entorno.

Las comprobaciones manuales no ejecutadas permanecen pendientes. Los gráficos de cumplimiento se generan leyendo esta tabla, sin cifras escritas manualmente. Video, duración real y entrega manual en UVM no quedan completados por publicar el repositorio.

La evidencia de ejecución identifica el commit de código evaluado. El HEAD documental final, deployment, recursos públicos y ZIP se relacionan en dist/FINAL_DELIVERY.json al final de la fase, evitando referencias circulares dentro del propio commit.
