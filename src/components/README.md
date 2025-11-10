# 🧩 Components

Componentes reutilizables de React organizados por feature y rol.

## 📁 Estructura

### `common/`
Componentes compartidos entre todos los roles:
- `Layout.tsx` - Layout principal con AppBar y Sidebar
- `ProtectedRoute.tsx` - HOC para rutas protegidas
- `LoadingSpinner.tsx` - Indicadores de carga
- `ErrorBoundary.tsx` - Manejo de errores

### `auth/`
Componentes relacionados con autenticación:
- `LoginForm.tsx` - Formulario de login
- `LogoutButton.tsx` - Botón de logout

### `student/`
Componentes específicos para estudiantes:
- Formulario de solicitud de asesoría
- Lista de solicitudes
- Calendario de sesiones

### `professor/`
Componentes específicos para profesores:
- Lista de solicitudes pendientes
- Creación de sesiones
- Gestión de disponibilidad

### `admin/`
Componentes específicos para administradores:
- Gestión de usuarios
- Gestión de materias
- Configuración del sistema

### `forms/`
Formularios reutilizables con React Hook Form

### `tables/`
Tablas y DataGrids de MUI reutilizables

### `calendars/`
Componentes de calendario y date pickers
