# Entrega y auditoría final

**Estado: implementación local realizada; entrega académica todavía incompleta.**

## Artefactos

- Fuente: este workspace exclusivo.
- Destino único: https://github.com/mmorfe-engineer/renaissance-js-uvm-e4-1, rama `main`, público.
- ZIP: ejecutar `npm run package`; resultado `dist/renaissance-lexicon-e4-1.zip`.
- Integridad: `dist/SHA256SUMS.json`, con SHA-256 de fuentes y documentación incluidas.
- Sitio preparado: `node scripts/prepare-site.mjs`; resultado `dist/site/`.
- Video: **pendiente de grabación y URL**. Guion en GUIA_VIDEO, duración objetivo 8:45.
- Nombres académicos completos/identificadores de ambos: **pendientes de confirmar para la entrega formal**. Las cuentas GitHub no sustituyen las identidades académicas.

El texto del contrato recibido termina durante la sección 19; no se conocen condiciones posteriores. No se asume una convención de nombre del ZIP ni un formato de entrega que no esté en el enunciado recibido.

## Checklist vinculante

- [x] HTML, CSS y módulos JS originales implementados.
- [x] Búsqueda, debounce, validación, API, estados, normalización y DOM implementados.
- [x] Audio opcional con botón accesible y tratamiento de errores implementado.
- [x] Tres temas, cinco familias locales y persistencia implementados.
- [x] Dieciocho pruebas de lógica y preferencias aprobadas.
- [x] Documentación de arquitectura, rúbrica, validación y guion creada.
- [x] Tarea independiente de revisión preparada para `morfemartin`.
- [ ] Pruebas reales de navegador, responsive, axe, audio/API y revisión manual completadas.
- [ ] Metadatos Git del workspace habilitados; `origin` canónico verificado.
- [ ] Publicación principal desde una identidad autorizada, sin atribución ficticia.
- [ ] Rama/tarea ejecutada y commits auténticos del segundo integrante integrados.
- [ ] GitHub Pages activado por administrador y workflow aprobado.
- [ ] URL pública verificada con búsqueda real, audio y preferencias.
- [ ] Video real con ambos integrantes y duración ≤10 minutos revisado.
- [ ] Identificación académica, artefactos finales y enlaces accesibles revisados.
- [ ] Resto del contrato, si existe, reconciliado antes de declarar finalización.

## Git seguro cuando el entorno permita escribir .git

Inspeccionar primero `git status`, `git remote -v` y el remoto existente. No ejecutar `git init` sobre otro repositorio, sustituir remotes sin inspección ni usar push forzado.

Si continúa siendo un directorio sin Git y el remoto sigue vacío, inicializar `main` y añadir exclusivamente el remote autorizado. Si el remoto ya tiene commits, recuperar e inspeccionar sus archivos e historial antes de integrar el trabajo local. Guardar una copia de las fuentes locales, no sobrescribirlas con un checkout ciego.

Antes de **cada push** verificar que las URLs de fetch y push de `origin` son exactamente `https://github.com/mmorfe-engineer/renaissance-js-uvm-e4-1.git`, comprobar rama y estado, y revisar el diff a publicar. Mantener la identidad real de quien trabaja.

## GitHub Pages

Un administrador debe seleccionar Settings → Pages → Source → GitHub Actions. El workflow publica solo los archivos del sitio. Tras éxito, verificar la URL final realmente devuelta por Pages y ejecutar `live-check.mjs` contra ella. No anunciar como publicada la URL prevista antes de verificarla.

## Cierre académico

La auditoría solo pasa a completada cuando se marquen con evidencia los pendientes anteriores. No cuentan como evidencia un guion sin grabación, una rama sin trabajo propio, pruebas escritas sin ejecutar ni una URL construida por suposición.
