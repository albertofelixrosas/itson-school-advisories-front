# Frontend PR Summary

## Title
Frontend migration aligned with backend contracts (Fase 0-6)

## Scope
- Migracion de contratos, endpoints y UI para alineacion con backend NestJS.
- Estabilizacion de tipado estricto TypeScript y pipeline de build/lint.

## Main technical changes
- Tipos/DTOs canonicos sincronizados con backend para solicitudes, sesiones, subject-details y notificaciones.
- Implementacion y uso de endpoints prioritarios en API + UI.
- Nuevas capacidades admin para notificaciones (preferencias, historial, plantillas).
- Correcciones de flujos por rol y escenario cross-career.
- Limpieza de conflictos de exports y errores de compilacion preexistentes.

## Risks known
- Dependencia de disponibilidad del backend para validacion manual E2E completa.
- Posibles variaciones de payload en produccion que requieran ajuste menor de normalizacion.
- Cobertura multimedia (capturas/video) pendiente de ejecucion manual.

## Mitigations
- Contratos tipados y centralizados para detectar drift temprano.
- Manejo de errores HTTP robusto y mensajes backend priorizados.
- Checklist y bitacora actualizados por fase para trazabilidad.

## Validation performed
- `npm run lint`: PASS
- `npm run build`: PASS

## Manual QA pending (backend required)
- Login/refresh por rol
- Dashboard admin con datos reales
- Profesor: estudiantes por sesion + asistencia
- Estudiante: solicitudes e invitaciones
- Admin: toggle de subject detail
