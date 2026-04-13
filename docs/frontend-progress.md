# Frontend Migration Progress

Fecha de inicio: 2026-03-09
Rama de trabajo: `feat/frontend-migration-phase0-1`

## Fase 0 - Preparacion

Estado: `DONE`

- `DONE` Rama de migracion creada: `feat/frontend-migration-phase0-1`.
- `DONE` `VITE_API_BASE_URL` verificada en `.env.development` y `.env.example` con `http://localhost:3000`.
- `DONE` Verificacion de Swagger `http://localhost:3000/api` disponible (status 200).
- `DONE` Archivo de tracking creado: `docs/frontend-progress.md`.

## Fase 1 - Contratos y tipos

Estado: `DONE`

- `DONE` Tipos alineados con backend para endpoints prioritarios:
  - `AdminDashboardStatsDto`
  - `SessionStudentsResponseDto`
  - `FullSessionDetailsDto`
- `DONE` `SubjectDetails` actualizado con campos de estado/auditoria (`is_active`, `created_at`, `updated_at`) como opcionales para compatibilidad.
- `DONE` Ajuste de contratos para nullables/optional:
  - `LoginDto` usa `username` requerido y `email` opcional solo para compatibilidad legacy.
  - `CreateDirectSessionDto` ajustado a campos opcionales compatibles con contrato documentado.
  - `SessionStudentJoinType` restringido a valores esperados.
- `DONE` Login frontend alineado al payload real del backend (`POST /auth/login` con `username` + `password`) sin romper compatibilidad de UI.
- `DONE` Normalizacion de payload de dashboard admin para compatibilidad UI (`sessions_count` -> `request_count` y `advisory_count`).
- `DONE` Consolidacion de tipos para evitar drift: `src/types/backend.ts` ahora reexporta desde `src/api/types.ts`.

## Fase 2 - Capa API (services/client)

Estado: `DONE`

- `DONE` Cliente para `GET /users/admin/dashboard/stats` en `src/api/endpoints/admin.ts`.
- `DONE` Cliente para `GET /advisories/sessions/:sessionId/students` en `src/api/endpoints/attendance.ts`.
- `DONE` Cliente para `GET /advisories/sessions/:sessionId` en `src/api/endpoints/advisories.ts` (`getSessionDetails`).
- `DONE` Cliente para `PATCH /subject-details/:id/toggle-status` en `src/api/endpoints/subjectDetails.ts`.
- `DONE` Validacion de manejo de errores HTTP 400/401/403/404 y priorizacion de mensajes de backend en `src/api/client.ts`.

## Fase 3 - UI por modulos

Estado: `DONE`

- `DONE` Admin Dashboard conectado a stats reales con mapeo estable de payload.
- `DONE` Session Details (professor): dialog de detalle completo conectado a `GET /advisories/sessions/:sessionId`.
- `DONE` Session Students (professor): lista/conteos/asistencia operando con `GET /advisories/sessions/:sessionId/students`.
- `DONE` Subject Details Admin: activacion/desactivacion en `SubjectDetailsManager` con `toggle-status`.
- `DONE` Notificaciones admin: nueva pantalla `AdminNotificationsPage` con preferencias, historial y plantillas (toggle/create/delete).

## Fase 4 - Flujos funcionales por rol

Estado: `DONE`

- `DONE` Student: flujo de solicitud/seguimiento/invitaciones alineado con contratos backend (estatus y fechas de revision).
- `DONE` Professor: flujo de revisar/aprobar/rechazar solicitudes corregido (`rejection_reason` en rechazo) y gestion de sesiones/asistencia activa.
- `DONE` Admin: gestion de usuarios, subject-details, dashboard y notificaciones/templates disponible en UI.
- `DONE` Escenario cross-career validado en frontend: no existe filtro por carrera en creacion de solicitudes; se listan asignaciones activas profesor-materia independientemente de carrera.

## Fase 5 - QA y estabilizacion

Estado: `DONE_WITH_PARTIAL_BLOCKER`

- `BLOCKED` Pruebas manuales guiadas con `docs/API_TESTING_GUIDE.md` no ejecutadas en entorno local por backend no disponible (`/api` inaccesible).
- `DONE` Estados de carga/vacio/error revisados en pantallas criticas de student/professor/admin durante la migracion.
- `DONE` Permisos por rol en rutas protegidas verificados en `App.tsx` y `ProtectedRoute`.
- `DONE` Correcciones de regresiones de navegacion y contratos:
  - colisiones de exports en `src/api/endpoints/index.ts`
  - handler inexistente en `UserManagementTable`
  - firma de `valueGetter` en `VenueManagementTable`
  - estandarizacion de DTOs de advisory requests en student/professor
  - compatibilidad de `Grid` en Admin Dashboard
- `DONE` Validaciones tecnicas:
  - `npm run lint`: `SUCCESS`
  - `npm run build`: `SUCCESS`

## Validaciones

- `npm run lint`: `SUCCESS` (exit code 0).
- `npm run build`: `SUCCESS`.

## Fase 6 - Cierre

Estado: `DONE_WITH_PARTIAL_EVIDENCE`

- `DONE` Changelog frontend actualizado en `docs/frontend-changelog.md`.
- `DONE` Resumen tecnico de PR con riesgos conocidos en `docs/frontend-pr-summary.md`.
- `IN_PROGRESS` Evidencia multimedia (capturas/video) pendiente de ejecucion manual con backend activo.
- `DONE` Evidencia tecnica consolidada en `docs/frontend-migration-evidence.md`.

## Notas

- Cuando el backend este arriba, repetir validacion de Swagger y registrar evidencia de acceso con usuario seed.
- Se priorizo payload esperado del backend documentado para stats y sesiones.
