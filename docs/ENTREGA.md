# Entrega y auditoría final

**Estado: implementación publicada y verificada con limitaciones; entrega académica incompleta.** Pendientes sustanciales: contribución auténtica de `morfemartin`, audio real, revisiones manuales, video e identificación académica.

## Publicación y autoría

- Repositorio: https://github.com/mmorfe-engineer/renaissance-js-uvm-e4-1.
- Pages: https://mmorfe-engineer.github.io/renaissance-js-uvm-e4-1/.
- Rama: `main`. Origin fetch/push: `https://github.com/mmorfe-engineer/renaissance-js-uvm-e4-1.git`.
- Propietario autenticado: `mmorfe-engineer`, ID 234090349, nombre de perfil MARTIN MORFE FLORES. Commits del propietario usan el correo de su cuenta, sin metadata del colaborador.
- Commit inicial: `2b90387`, implementación existente, pruebas, documentación y plantillas. Publicado antes de recibir la nueva política de distribución; incluye la interfaz que ya existía. No se reescribió para aparentar otro reparto.
- Política vinculante incorporada antes de los commits siguientes: [CONTRATO_MAESTRO](CONTRATO_MAESTRO.md).
- `morfemartin`: acceso **write** confirmado mediante GitHub; **ningún commit ni PR suyo integrado** al comprobar el historial. No declarar cumplido el requisito de ambos autores.
- Bloque funcional reservado: pronunciaciones alternativas con interacción accesible y revisión responsive; archivos y criterios en [COLABORACION](COLABORACION.md). Rama que debe crear desde su entorno: `feature/ui-accessibility-morfemartin`.
- Integración pendiente mediante PR normal, conservando commits y autores; sin squash que elimine la evidencia. No se envió ningún mensaje, invitación ni PR en nombre del colaborador.

El HEAD final y su deployment se registran en `dist/FINAL_DELIVERY.json` al cerrar la verificación, fuera del ZIP para evitar una referencia circular al commit que contiene este documento. También se obtienen con `git rev-parse HEAD` y `gh run list`.

## Evidencia y pruebas

- `npm test`: **18/18 aprobadas**.
- `npm run test:browser`: **30/30 aprobadas**, Chromium 153.0.8010.12; sin excepciones JS.
- Responsive a 320, 375, 768, 1024 y 1440 px: sin overflow y controles visibles de al menos 44 px.
- Tres auditorías axe WCAG A/AA: sin infracciones detectadas. Teclado y preferencias aprobados. No equivale a certificación integral.
- Búsqueda pública real `hello`: Dictionary API **HTTP 200**, **7 definiciones**, preferencias persistentes tras recarga.
- Audio real: **HTTP 404** en Playwright; error anunciado por la interfaz. La prueba en vivo devuelve **código 1**, `failed-external-audio`. No se afirma reproducción ni escucha humana.
- Deployment inicial **success**: https://github.com/mmorfe-engineer/renaissance-js-uvm-e4-1/actions/runs/43284501043. Datos y capturas en [evidencias](evidencias/).
- Detalle reproducible y límites: [VALIDACION](VALIDACION.md).

## Configuración de Pages

Pages publica nativamente desde `main`, carpeta `/`, con HTTPS. `.nojekyll` conserva el sitio estático. El token CLI carece de permiso `workflow`, y el primer intento de push con workflows fue rechazado sin publicar esa versión. Las plantillas se conservaron en `scripts/workflows/`; no se afirma que estén activas ni que exista CI de calidad automática remota. El workflow nativo de Pages sí proporciona evidencia de build/deploy. Las pruebas de calidad se ejecutaron localmente.

## Artefactos finales

- `dist/renaissance-lexicon-e4-1.zip`: fuentes, documentación, evidencias y pruebas; sin Git, dependencias ni configuración de sesión.
- `dist/SHA256SUMS.json`: SHA-256 de cada archivo incluido.
- `dist/renaissance-lexicon-e4-1.zip.sha256`: SHA-256 del ZIP final.
- `dist/FINAL_DELIVERY.json`: HEAD, deployment y comprobación final de correspondencia ZIP/Git/recursos publicados.
- `dist/site/`: copia estática de index, CSS, JavaScript y assets, generada con `node scripts/prepare-site.mjs`.

El ZIP debe regenerarse tras cada cambio fuente/documental. La comprobación final compara el contenido descomprimido con los archivos versionados del HEAD publicado y verifica los bytes de todos los recursos del sitio por HTTPS. El hash del ZIP se comunica fuera de su propio contenido para evitar circularidad.

## Checklist

- [x] Implementación, lógica, preferencias y documentación disponibles.
- [x] Git habilitado, origin canónico e identidad del propietario verificados.
- [x] Código principal publicado sin simular autoría del colaborador.
- [x] Pages habilitado, deployment inicial exitoso y sitio visitado con navegador real.
- [x] 18 pruebas de lógica y 30 comprobaciones de navegador aprobadas.
- [x] Búsqueda y preferencias verificadas en la URL pública.
- [x] Política de distribución incorporada y bloque funcional reservado al colaborador.
- [ ] Pronunciación remota reproducida y escuchada satisfactoriamente.
- [ ] Trabajo funcional, commits auténticos y PR de `morfemartin` integrados y autorías verificadas en GitHub.
- [ ] Revisión manual completa: zoom 200 %, lector de pantalla, escucha y escenarios UI del colaborador.
- [ ] Video real de ambos integrantes de máximo 10 minutos y URL revisados; el guion 8:45 no es una grabación.
- [ ] Identificadores y nombres académicos formales de ambos confirmados para la entrega.
- [ ] Resto del contrato original, si existe tras la sección 19 recibida parcialmente, reconciliado.
- [ ] Entrega formal realizada en la plataforma académica.

Estos pendientes requieren intervención humana o trabajo desde el entorno auténtico del colaborador. La publicación técnica no cierra por sí sola la entrega académica.
