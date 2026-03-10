# Frontend Changelog

## 2026-03-09 - Frontend Migration (Fase 0 a Fase 6)

### Added
- Capa API para endpoints prioritarios:
  - `GET /users/admin/dashboard/stats`
  - `GET /advisories/sessions/:sessionId/students`
  - `GET /advisories/sessions/:sessionId`
  - `PATCH /subject-details/:id/toggle-status`
- Pantalla admin de notificaciones:
  - Ruta: `/admin/notifications`
  - Preferencias de notificacion
  - Historial de notificaciones
  - Gestion de plantillas (crear/eliminar/activar-desactivar)
- Detalle completo de sesion en flujo profesor (modal desde `ManageSessionsPage`).

### Changed
- Alineacion de tipos/DTOs con backend para contratos actuales:
  - `SubjectDetails` (`is_active`, `created_at`, `updated_at`)
  - DTOs de dashboard/sesiones/notificaciones
  - Correcciones de nullables y campos opcionales
- Flujos student/professor ajustados a contrato real:
  - Estados de solicitudes en formato canonico (`PENDING`, `APPROVED`, etc.)
  - Rechazo de solicitudes con `rejection_reason`
  - Fechas de revision con `reviewed_at`
- Manejo de errores HTTP mejorado en cliente API:
  - Prioriza mensajes del backend para `400/401/403/404`
- Estabilizacion de build/lint:
  - Correccion de colisiones de export en `src/api/endpoints/index.ts`
  - Correcciones de UI/handlers en tablas admin
  - Compatibilidad de Grid en dashboard admin con la version instalada de MUI

### Fixed
- Colisiones de simbolos exportados en barrel de endpoints.
- Referencias a propiedades no existentes en DTOs (`username` en tipos publicos de usuario).
- Inconsistencias de tipos legacy de solicitudes (`advisoryRequests.types.ts` vs tipos canonicos).

### Validation
- `npm run lint`: OK
- `npm run build`: OK

### Notes
- Las pruebas manuales guiadas contra backend (`docs/API_TESTING_GUIDE.md`) siguen condicionadas a disponibilidad del backend local.
