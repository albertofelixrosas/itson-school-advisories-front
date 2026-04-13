# Prompt Para GitHub Copilot (Ejecucion Del Plan Frontend)

Copia y pega este prompt en el proyecto React para que Copilot ejecute la migracion por fases.

---

Actua como un ingeniero senior de frontend especializado en React + TypeScript.

Contexto:
- Estoy migrando el frontend para alinearlo con cambios recientes del backend (NestJS).
- Debes usar como fuentes de verdad estos archivos del backend:
  - `../school-advisories-back/TODO/frontend-migration-checklist.md`
  - `../school-advisories-back/docs/frontend-integration/backend-api-reference.md`
  - `../school-advisories-back/docs/frontend-integration/backend-types.ts`
  - `../school-advisories-back/IMPLEMENTATION_SUMMARY.md`
  - `../school-advisories-back/CAMBIOS_APLICADOS.md`
- Endpoints nuevos/prioritarios:
  - `GET /users/admin/dashboard/stats`
  - `GET /advisories/sessions/:sessionId/students`
  - `GET /advisories/sessions/:sessionId`
  - `PATCH /subject-details/:id/toggle-status`
- Reglas de dominio importantes:
  - Un profesor puede impartir multiples materias.
  - Un profesor no esta obligado a pertenecer a una carrera para impartir asesoria.
  - Existen materias compartidas entre carreras (cross-career).

Objetivo:
- Implementar la migracion completa de frontend en fases pequenas, con cambios seguros y verificables.
- Actualizar progreso en checklist durante la ejecucion.

Forma de trabajo obligatoria:
1. Antes de editar, analiza el estado actual del frontend (estructura, cliente API, tipos, pantallas por rol).
2. Ejecuta por fases (Fase 0 a Fase 6) segun `frontend-migration-checklist.md`.
3. En cada fase:
   - Explica breve que vas a cambiar.
   - Aplica cambios en codigo.
   - Ejecuta validacion (typecheck, lint, tests/build si existen).
   - Marca tareas completadas en el checklist.
4. Si algo no cuadra entre tipos documentados y payload real, prioriza payload real y documenta la diferencia.
5. No rompas comportamiento existente que no este en alcance.
6. Mantener codigo limpio, tipado estricto y manejo de errores de red/roles.

Entregables por fase:
- Lista de archivos modificados.
- Resumen de cambios funcionales.
- Resultado de validaciones (errores o exito).
- Actualizacion de checklist (tareas en DONE/IN_PROGRESS/BLOCKED).

Criterios de calidad:
- Sin errores TypeScript al terminar.
- Rutas protegidas correctas por rol (student/professor/admin).
- Estados de UI cubiertos: loading, empty, error, success.
- Integracion completa de endpoints prioritarios.

Empieza ahora con:
- Fase 0 y Fase 1 completas.
- Luego espera confirmacion para continuar con Fase 2.
