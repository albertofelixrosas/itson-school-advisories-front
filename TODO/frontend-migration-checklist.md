# Frontend Migration Checklist (React)

## Objetivo
Actualizar el frontend de React para que quede alineado con los cambios recientes de base de datos y contratos del backend.

## Fuentes de verdad (backend)
- `docs/frontend-integration/backend-api-reference.md`
- `docs/frontend-integration/backend-types.ts`
- `IMPLEMENTATION_SUMMARY.md`
- `CAMBIOS_APLICADOS.md`
- `docs/API_TESTING_GUIDE.md`

## Alcance de cambios prioritarios
- Nuevos endpoints clave:
  - `GET /users/admin/dashboard/stats`
  - `GET /advisories/sessions/:sessionId/students`
  - `GET /advisories/sessions/:sessionId`
  - `PATCH /subject-details/:id/toggle-status`
- Cambios en `subject_details`:
  - Nuevo `is_active`
  - Nuevos `created_at` y `updated_at`
- Flujo de notificaciones ampliado:
  - Preferencias, historial y plantillas
- Datos de seed mas amplios:
  - Mas profesores y estudiantes
  - Profesores con multiples materias
  - Materias compartidas entre carreras

## Definicion de terminado (DoD)
- Todas las vistas criticas consumen contratos actuales del backend sin mocks rotos.
- No hay errores de TypeScript en cliente.
- Flujos por rol (student/professor/admin) cubiertos en QA manual.
- Se valida al menos 1 flujo end-to-end por cada rol.

## Plan por fases (checklist)

### Fase 0 - Preparacion
- [x] Crear rama de trabajo para migracion frontend.
- [x] Actualizar variable `API_BASE_URL` y entorno local.
- [x] Verificar acceso a Swagger (`/api`) y credenciales seed.
- [x] Crear archivo de tracking en el frontend (por ejemplo `docs/frontend-progress.md`).

### Fase 1 - Contratos y tipos
- [x] Copiar/adaptar tipos desde `docs/frontend-integration/backend-types.ts` al frontend.
- [x] Corregir tipos de `SubjectDetails` (incluyendo `is_active`, `created_at`, `updated_at` si aplica en respuestas).
- [x] Ajustar enums de estado (`RequestStatus`, `InvitationStatus`, `AdvisoryStatus`, etc.).
- [x] Revisar normalizadores/parsers para campos opcionales o nullables.

### Fase 2 - Capa API (services/client)
- [x] Implementar cliente para `GET /users/admin/dashboard/stats`.
- [x] Implementar cliente para `GET /advisories/sessions/:sessionId/students`.
- [x] Implementar cliente para `GET /advisories/sessions/:sessionId`.
- [x] Implementar cliente para `PATCH /subject-details/:id/toggle-status`.
- [x] Validar manejo de errores HTTP 400/401/403/404 y mensajes de backend.

### Fase 3 - UI por modulos
- [x] Admin Dashboard: consumir stats reales y mapear widgets.
- [x] Session Details (professor/admin/student): mostrar detalle completo de sesion.
- [x] Session Students (professor/admin): lista, conteos y asistencia.
- [x] Subject Details Admin: boton activar/desactivar (`toggle-status`) con confirmacion.
- [x] Notificaciones: preferencias, historial y (si aplica) templates en panel admin.

### Fase 4 - Flujos funcionales por rol
- [x] Student: solicitud de asesoria, seguimiento de estatus, invitaciones.
- [x] Professor: revisar solicitudes, aprobar/rechazar, crear sesion directa, asistencia.
- [x] Admin: gestionar users, subject-details, dashboard y plantillas.
- [x] Verificar escenario cross-career: profesor atendiendo materias usadas por alumnos de distintas carreras.

### Fase 5 - QA y estabilizacion
- [ ] Pruebas manuales guiadas con `docs/API_TESTING_GUIDE.md`.
- [x] Revisar estados de carga, vacio y error en pantallas criticas.
- [x] Revisar permisos por rol en rutas protegidas.
- [x] Corregir regresiones visuales y de navegacion.
- [x] Ejecutar build y lint del frontend sin errores.

### Fase 6 - Cierre
- [x] Actualizar changelog de frontend.
- [ ] Adjuntar evidencia (capturas o video corto) por flujo principal.
- [x] Preparar PR con resumen tecnico y riesgos conocidos.

## Bitacora de progreso
Usar esta tabla para llevar avance incremental.

| Fecha | Fase | Tarea | Responsable | Estado | Notas |
|---|---|---|---|---|---|
| YYYY-MM-DD | Fase 0 | Inicio de migracion | TBD | TODO | |
| 2026-04-13 | Fase 0 | Verificacion de entorno y Swagger | Copilot | DONE | Rama activa `feat/frontend-migration-phase0-1`, `VITE_API_BASE_URL` confirmado, Swagger `/api` status 200. |
| 2026-04-13 | Fase 1 | Contratos y tipos alineados | Copilot | DONE | Tipos de endpoints prioritarios alineados y login restablecido a correo+contrasena sin regresiones de sesion. |
| 2026-04-13 | Fase 2 | Capa API prioritaria | Copilot | DONE | Endpoints de stats/sessions/toggle-status implementados y error handling 400/401/403/404 validado en cliente. |
| 2026-04-13 | Fase 3 | UI por modulos | Copilot | DONE | Dashboard admin, sesiones y subject-details conectados a endpoints reales; notificaciones admin activas. |
| 2026-04-13 | Fase 4 | Flujos por rol | Copilot | DONE | Flujos student/professor/admin cubiertos con rutas protegidas y caso cross-career considerado. |
| 2026-04-13 | Fase 5 | QA tecnica automatizada | Copilot | IN_PROGRESS | Lint y build en verde; faltan pruebas manuales guiadas con API testing. |
| 2026-04-13 | Fase 6 | Cierre documental | Copilot | IN_PROGRESS | Changelog y resumen PR listos; falta evidencia multimedia de flujos principales. |

Estados sugeridos: `TODO`, `IN_PROGRESS`, `BLOCKED`, `DONE`.

## Riesgos y mitigaciones
- Riesgo: diferencias entre tipos documentados y respuestas reales.
  - Mitigacion: validar payloads reales en Swagger/Postman antes de cerrar cada modulo.
- Riesgo: permisos por rol incompletos en frontend.
  - Mitigacion: matriz de rutas por rol y pruebas con usuarios seed de cada perfil.
- Riesgo: cambios de backend adicionales durante la migracion.
  - Mitigacion: congelar version de contrato por sprint y registrar cambios en bitacora.

## Matriz minima de pruebas manuales
- [ ] Login y refresco de token por rol.
- [ ] Dashboard admin con datos reales.
- [ ] Profesor ve estudiantes por sesion.
- [ ] Profesor crea sesion y registra asistencia.
- [ ] Estudiante ve solicitudes e invitaciones.
- [ ] Admin activa/desactiva subject detail.
