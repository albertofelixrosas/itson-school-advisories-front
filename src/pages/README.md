# 📄 Pages

Páginas principales de la aplicación organizadas por rol.

## 📁 Estructura

### `auth/`
Páginas de autenticación:
- `LoginPage.tsx` - Página de login
- `UnauthorizedPage.tsx` - Página de acceso denegado

### `student/`
Páginas para rol STUDENT:
- `StudentDashboard.tsx` - Dashboard principal
- `MyRequestsPage.tsx` - Mis solicitudes de asesoría
- `MyInvitationsPage.tsx` - Mis invitaciones
- `MySchedulePage.tsx` - Mi calendario de sesiones

### `professor/`
Páginas para rol PROFESSOR:
- `ProfessorDashboard.tsx` - Dashboard principal
- `PendingRequestsPage.tsx` - Solicitudes pendientes de revisión
- `CreateSessionPage.tsx` - Crear nueva sesión
- `MyAvailabilityPage.tsx` - Gestión de disponibilidad
- `ManageSessionsPage.tsx` - Gestionar sesiones

### `admin/`
Páginas para rol ADMIN:
- `AdminDashboard.tsx` - Dashboard con estadísticas
- `UserManagementPage.tsx` - CRUD de usuarios
- `SubjectManagementPage.tsx` - CRUD de materias
- `VenueManagementPage.tsx` - CRUD de sedes/locations
- `EmailTemplatesPage.tsx` - Editor de plantillas de email

## 🔐 Protección de Rutas

Todas las páginas (excepto auth) deben estar protegidas con `ProtectedRoute` y roles específicos.
