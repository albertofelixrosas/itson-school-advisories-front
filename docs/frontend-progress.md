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
  - `LoginDto` ahora acepta `username` o `email`.
  - `CreateDirectSessionDto` ajustado a campos opcionales compatibles con contrato documentado.
  - `SessionStudentJoinType` restringido a valores esperados.
- `DONE` Normalizacion de payload de dashboard admin para compatibilidad UI (`sessions_count` -> `request_count` y `advisory_count`).
- `DONE` Consolidacion de tipos para evitar drift: `src/types/backend.ts` ahora reexporta desde `src/api/types.ts`.

## Validaciones

- `npm run lint`: `SUCCESS` (exit code 0).
- `npm run build`: `FAILED` por errores preexistentes fuera del alcance de Fase 0/1 (colisiones en barrel exports, errores de componentes admin/professor/student, y tipado MUI Grid).

## Notas

- Cuando el backend este arriba, repetir validacion de Swagger y registrar evidencia de acceso con usuario seed.
- Se priorizo payload esperado del backend documentado para stats y sesiones.
