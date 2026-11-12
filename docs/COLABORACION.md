# Colaboración auténtica e integración

El equipo está formado por **Martin Morfe.°.** (`mmorfe-engineer`, C.I. 8.263.711) y **Martin Alejandro Morfe Carballo** (`morfemartin`, C.I. 30.539.018). Los nombres académicos fueron suministrados por el usuario, sin deducirlos de perfiles.

## Reparto funcional

| Integrante | Trabajo visible |
|---|---|
| mmorfe-engineer | Implementación principal, núcleo JS, API, debounce, validación, DOM, preferencias iniciales, integración, tests, documentación y Pages |
| morfemartin | Pronunciaciones alternativas, selección/fallback/reintento, cancelación de audio, foco, mensajes accesibles, CSS responsive y ampliación de pruebas/revisión |

El commit inicial del propietario contenía la interfaz existente. El bloque posterior del colaborador aporta comportamiento nuevo y verificable; no es una reatribución retroactiva.

## PR y commits preservados

[PR #1](https://github.com/mmorfe-engineer/renaissance-js-uvm-e4-1/pull/1), rama `feature/ui-accessibility-morfemartin` hacia `main`, integrado mediante merge normal en `c4ab9c15763b18fdc07dfc3c162cb959938de73b`.

- `258af14457e74b76fd4145665550d890a2e8ab91`: Add accessible pronunciation alternatives and bounded audio fallback.
- `530ed50bcd11d3e79ebe8a045c3fe52705027351`: Verify pronunciation resources and document interface accessibility review.

GitHub devolvió **author.login = morfemartin y committer.login = morfemartin** en ambos objetos de commit. Ambos son ancestros del merge. No se hizo squash, cherry-pick ni reescritura de autores. La autenticación de integración fue `mmorfe-engineer`.

Evidencia: [PR integrado](evidencias/cierre/pr-1.json). Los objetos remotos se vuelven a comprobar al generar el informe final. El permiso write por sí solo no fue utilizado como prueba de contribución.

## Evidencias del colaborador

[Revisión original](REVISION_MORFEMARTIN.md), [browser-report](evidencias/morfemartin/browser-report.json) y [live-report](evidencias/morfemartin/live-report.json) se conservan sin alterar. Registran pruebas de su rama y limitaciones de Codespaces: API HTTP 403 y timeout de espera.

## Revalidación posterior

Las suites se ejecutaron de nuevo después del merge. Los resultados vigentes están en [VALIDACION](VALIDACION.md) y `docs/evidencias/cierre/`. Las comprobaciones manuales pendientes en la revisión del colaborador no se convierten en PASS por inferencia. El requisito de historial de ambos integrantes está acreditado; el audio externo y la revisión humana completa tienen estados independientes.
