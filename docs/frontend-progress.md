# Frontend Migration Progress

Fecha de inicio: 2026-03-09
Rama de trabajo: `feat/frontend-migration-phase0-1`

## Fase 0 - Preparacion

Estado: `COMPLETED_WITH_BLOCKER`

- `DONE` Rama de migracion creada: `feat/frontend-migration-phase0-1`.
- `DONE` `VITE_API_BASE_URL` verificada en `.env.development` y `.env.example` con `http://localhost:3000`.
- `BLOCKED` Verificacion de Swagger `http://localhost:3000/api` no disponible (conexion rechazada en entorno local).
- `DONE` Archivo de tracking creado: `docs/frontend-progress.md`.

## Fase 1 - Contratos y tipos

Estado: `DONE`

- `DONE` Tipos alineados con backend para endpoints prioritarios:
  - `AdminDashboardStatsDto`
  - `SessionStudentsResponseDto`
  - `FullSessionDetailsDto`
- `DONE` `SubjectDetails` actualizado con campos de estado/auditoria (`is_active`, `created_at`, `updated_at`) como opcionales para compatibilidad.
- `DONE` Ajuste de contratos para nullables/optional:
  - `LoginDto` mantiene `email` requerido y permite `username` opcional para compatibilidad de payload.
  - `CreateDirectSessionDto` ajustado a campos opcionales compatibles con contrato documentado.
  - `SessionStudentJoinType` restringido a valores esperados.
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

## Validaciones

- `npm run lint`: `SUCCESS` (exit code 0).
- `npm run build`: `FAILED` por errores preexistentes fuera del alcance de Fase 0/3 (colisiones en barrel exports, errores de componentes admin y tipado MUI Grid del proyecto base).

## Notas

- Cuando el backend este arriba, repetir validacion de Swagger y registrar evidencia de acceso con usuario seed.
- Se priorizo payload esperado del backend documentado para stats y sesiones.
