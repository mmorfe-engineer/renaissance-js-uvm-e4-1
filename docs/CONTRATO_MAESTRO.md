# Contrato maestro · política vinculante de autoría

Esta política fue recibida el 12 de noviembre de 2026, después de publicar el commit inicial `2b90387`. Se aplica antes de los siguientes commits. El contrato original solo se recibió hasta parte de la sección 19; este archivo no inventa las secciones ausentes ni sustituye los requisitos académicos registrados en RUBRICA y ENTREGA.

## DISTRIBUCIÓN REAL DE COMMITS

GitHub debe permitir observar el avance y los commits de los dos integrantes reales: `mmorfe-engineer`, propietario e integrante principal, y `morfemartin`, colaborador real. No realizar todos los commits del proyecto desde el propietario ni atribuir artificialmente commits al colaborador. No modificar `git user.name`, `git user.email`, `--author` ni otra metadata para simular participación. La autoría procede de la cuenta y entorno reales de cada integrante.

El propietario puede cerrar estructura, arquitectura JavaScript, Dictionary API, debounce, validaciones, datos, renderizado, estados, errores, integración, testing, documentación técnica, GitHub, Pages y deployment. Cada commit debe representar un incremento real; se prohíben commits vacíos y fragmentación artificial.

Reservar al colaborador un bloque técnico real, coherente y sustancial. Sus áreas preferentes son HTML semántico, CSS y responsive, temas, cinco tipografías, accesibilidad visual y teclado, hover/focus, pronunciación y experiencia UI, pruebas manuales y correcciones derivadas. Debe revisar y probar, modificar cuando corresponda y verificar el comportamiento; volver a guardar archivos no constituye contribución.

Antes de construir nuevos incrementos: inspeccionar los cambios, clasificar el núcleo del propietario, identificar mejoras reservadas, evitar consumir esa contribución y preparar una tarea con archivos, objetivo y criterio de terminado. El estado real prevalece sobre una descripción anterior: el commit inicial ya publicado contiene la interfaz existente. No reescribirlo para aparentar reparto previo.

## Flujo e integración

`main` recibe el trabajo principal. El colaborador acepta el acceso, obtiene el proyecto desde su entorno y crea `feature/ui-accessibility-morfemartin`, modifica, verifica, commitea, hace push y abre PR o entrega su rama. El agente puede preparar la tarea o rama, pero nunca sus commits.

Integrar preferentemente mediante PR con merge normal conservando commits y autoría. No usar squash que elimine evidencia individual, reescribir autores ni hacer cherry-pick que atribuya el trabajo al propietario. Un cherry-pick solo es admisible con razón técnica y autor original conservado. Verificar después ambos autores en GitHub.

No existe un número objetivo de commits. Deben surgir del trabajo real y permitir explicar la evolución. Continuar el trabajo propio, testing y publicación mientras el colaborador trabaja; el requisito «commits de los integrantes» sigue abierto hasta verificar commits auténticos de ambos en el repositorio canónico. Ser collaborator no basta.

El informe final distingue commits y bloque funcional de cada integrante, PR o mecanismo de integración y evidencia de autoría intacta. La tarea concreta reservada está en [COLABORACION](COLABORACION.md).
