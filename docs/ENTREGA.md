# Entrega y auditoría de cierre

**Estado: publicación técnica y contribución de ambos integrantes integradas; entrega académica aún incompleta por video, revisiones humanas y audio externo.** Los datos académicos ya están confirmados.

## Acceso y equipo

- Repositorio: https://github.com/mmorfe-engineer/renaissance-js-uvm-e4-1.
- Pages: https://mmorfe-engineer.github.io/renaissance-js-uvm-e4-1/.
- Rama y origin: main; https://github.com/mmorfe-engineer/renaissance-js-uvm-e4-1.git para fetch/push.
- Martin Morfe.°., C.I. 8.263.711, mmorfe-engineer.
- Martin Alejandro Morfe Carballo, C.I. 30.539.018, morfemartin.
- Profesor: Anggelo Huz. Universidad Valle del Momboy. FrontEndIVIVFI2026C · Taller Front End; E-Actividad 4.1, opción #2, ponderación 15 %, cierre 14/11/2026 23:59 Venezuela.

## Historial real

El propietario publicó implementación, integración, pruebas, documentación y Pages. El colaborador aportó dos commits propios en feature/ui-accessibility-morfemartin: 258af14 y 530ed50. PR #1 integrado con merge normal c4ab9c1, sin squash ni cambio de autoría. GitHub confirmó author y committer morfemartin en ambos. [Auditoría](COLABORACION.md).

Los commits documentales de cierre posteriores se identifican en el historial. HEAD final, origen remoto y deployment correspondiente se registran al finalizar en dist/FINAL_DELIVERY.json. No se inserta un hash circular del propio commit en este archivo.

## Evidencias actuales

- 20 unitarias, 35 comprobaciones browser y 8 comprobaciones públicas aprobadas. [Validación](VALIDACION.md) y [fuentes de datos](evidencias/cierre/).
- Responsive: cinco viewports 320–1440 px y controles de al menos 44 px.
- Axe: sin infracciones detectadas en escenarios ejecutados; no certificación WCAG.
- Sitio público: HTTP 200, hello real con siete definiciones y preferencias persistentes.
- Audio: ambas URLs reales HTTP 404. Fallback y mensaje de fallo total funcionan; no reproducción ni escucha acreditadas. live-check conserva código 1.
- Capturas reales de Pages, hero y gráficos versionados en docs/assets. README y matriz reflejan los límites reales.
- Cumplimiento: fuente única [CUMPLIMIENTO_PLIEGO](CUMPLIMIENTO_PLIEGO.md); códigos TR internos, no oficiales. Gráficos derivados automáticamente.

## Deployment

Pages nativo desde main, carpeta /, con HTTPS y .nojekyll. Las plantillas de scripts/workflows no son CI personalizada activa. El deployment de código post-merge consta en [deployment-code.json](evidencias/cierre/deployment-code.json). Después del commit documental final se espera su deployment y se repite la visita pública y comparación de recursos; ese resultado queda en el reporte final externo.

## Artefactos de entrega

- dist/renaissance-lexicon-e4-1.zip: fuentes, documentación, capturas, evidencias y tests versionados.
- dist/SHA256SUMS.json: hashes de cada archivo incluido.
- dist/renaissance-lexicon-e4-1.zip.sha256: hash del ZIP.
- dist/FINAL_DELIVERY.json: rama/HEAD, deployment, commits/autores, pruebas, recursos públicos, links y correspondencia ZIP/Git.
- dist/site/: copia estática del runtime, preparada con node scripts/prepare-site.mjs.

Se regeneran únicamente después de completar los cambios. El ZIP anterior al merge queda obsoleto como entrega actual; los reportes históricos versionados se conservan como evidencia de su momento. El paquete MORFEMARTIN_CONTRIBUTION_PACK es un artefacto de preparación, no el ZIP académico final.

## Pendientes humanos y externos

- **Video real de ambos integrantes**, máximo 10 minutos, funcionamiento y explicación de código; URL y duración aún pendientes. [Guion actualizado](GUIA_VIDEO.md).
- **Revisión humana completa** de teclado/foco, zoom real 200 %, lector de pantalla y escucha. Las pruebas automatizadas aprobadas no los sustituyen.
- **Disponibilidad/reproducción de audio externo**: registrar un recurso realmente operativo cuando el proveedor lo permita; no fabricar URLs ni ocultar el bloqueo actual.
- **Entrega manual en la plataforma UVM** y revisión de acceso al video por el profesor.

Ningún dato académico solicitado permanece pendiente. El requisito de commits de ambos integrantes sí está acreditado. El cierre académico completo requiere resolver los puntos anteriores; la publicación técnica y el ZIP no los reemplazan.
