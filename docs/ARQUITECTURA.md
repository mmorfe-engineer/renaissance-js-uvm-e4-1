# Arquitectura y decisiones

## Alcance

Aplicación estática independiente de una página, sin backend ni build. HTML5 y CSS personalizado sostienen la presentación; cinco módulos ES muestran el JavaScript evaluable. Se descartó añadir un framework porque no aporta valor a un flujo de búsqueda y lectura. Node sirve para desarrollo, pruebas y empaquetado, no es necesario en producción.

## Flujo explicable

1. El evento `input` cancela la solicitud previa, retira resultados obsoletos y reinicia un temporizador de 450 ms.
2. `debounce` conserva un identificador de temporizador en un cierre. `clearTimeout` evita las ejecuciones intermedias; `cancel()` permite enviar el formulario inmediatamente.
3. La validación convierte a minúsculas, recorta/colapsa espacios y normaliza el apóstrofo tipográfico. Admite palabras y expresiones inglesas con guiones/apóstrofos interiores. Un input vacío vuelve al inicio sin petición.
4. `lookupWord` usa `fetch` con una URL codificada y `signal`. `async/await` separa HTTP, decodificación JSON y errores.
5. `normalizeEntries` recorre arrays y objetos, conserva todas las entradas y definiciones, elimina duplicados de fonéticas/sinónimos/fuentes y crea campos seguros. Los datos ausentes se expresan como arrays vacíos o cadenas vacías.
6. `renderEntries` crea `article`, encabezados, listas, citas, botones y enlaces mediante `document.createElement` y `textContent`. Nunca usa la respuesta como HTML.

## Estados y concurrencia

| Estado | Disparador | Salida |
|---|---|---|
| Inicial | Inicio o entrada vacía | Instrucciones y botones que consultan la API |
| Espera | Usuario escribe | Debounce sin peticiones intermedias |
| Validación | Caracteres o longitud no admitidos | Texto asociado al input y `aria-invalid` |
| Carga | Petición válida | Mensaje visible, `aria-busy` y anuncio breve |
| Resultado | Respuesta JSON válida | Entradas reales renderizadas dinámicamente |
| Sin resultado | HTTP 404 | Mensaje para corregir ortografía |
| Error | Red, HTTP, JSON o timeout | Explicación y reintento |

Abortar ahorra trabajo, pero el contador `generation` también verifica qué respuesta sigue vigente. Esto evita resultados antiguos incluso si la cancelación llega tarde. Una solicitud tiene límite de 12 segundos. Las composiciones IME no disparan consultas parciales.

## Audio

Se conservan todas las URLs HTTPS válidas y únicas de `phonetics[].audio`, con fonética, fuente y licencia. `entry.audio` mantiene la primera como compatibilidad; `entry.pronunciations` alimenta el selector. No se inventan acentos ni proveedores.

El elemento `<audio preload="none" hidden>` no expone controles nativos. Un selector etiquetado aparece si hay alternativas. Al pulsar Escuchar se intenta la selección y luego las restantes una vez, con timeout de 8 segundos por intento. Si el navegador exige otro gesto se informa en lugar de ocultar su política. Un fallo total mantiene el reintento.

La guarda `busy` y `aria-disabled` conservan foco y evitan duplicados; la generación invalida promesas tardías. Cambiar selección o búsqueda cancela y pausa el intento previo. Los estados se anuncian mediante `role=status` y se respeta el fin de reproducción. Disponibilidad HTTP, reproducción en navegador y escucha humana se verifican por separado.

## Preferencias

`matchMedia('(prefers-color-scheme: dark)')` resuelve Sistema y escucha cambios del SO. Claro/Oscuro tienen prioridad explícita. La clave `renaissance-lexicon-preferences` guarda tema y familia. El JSON se valida contra listas permitidas; errores de lectura/escritura no interrumpen el diccionario.

Cinco fuentes reales se incluyen como archivos TTF, con licencias, para evitar que varias opciones terminen en el mismo fallback: Noto Serif, Liberation Serif, Noto Sans, DejaVu Sans y DejaVu Sans Mono. Cambian títulos y contenido de lectura; los controles conservan una tipografía de interfaz consistente. No requieren servicios externos de fuentes.

## Accesibilidad y responsive

Landmarks `header`, `main`, `footer`; enlace de salto; un H1; entradas H2 y categorías/fuentes H3; labels explícitos; botones nativos; foco visible; `role=status` breve; idioma inglés en los datos; `aria-invalid` y descripción de errores. El resultado completo no es una región live para evitar lecturas excesivas. El diseño respeta movimiento reducido y usa colores diferenciados para temas.

Ancho fluido con límite de lectura y media query de 650 px. Los controles tienen al menos 44 px de altura. Texto largo y URLs permiten salto de línea. Las suites ejecutadas comprueban 320, 375, 768, 1024 y 1440 px. Su existencia no sustituye su ejecución: consultar VALIDACION.

## Límites

La disponibilidad, exactitud, licencias y cobertura lingüística de entradas/audio dependen de Dictionary API y sus fuentes. No se implementaron cuentas, traducción, analítica, historial ni backend. Los archivos de fuentes y las definiciones mantienen sus respectivas licencias; no se atribuyen al equipo.
