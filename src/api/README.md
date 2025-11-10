# 📡 API Layer

Esta carpeta contiene toda la configuración y lógica relacionada con la comunicación con el backend.

## 📁 Estructura

### `client.ts`
Cliente Axios configurado con:
- Base URL del backend
- Interceptores de request (agregar JWT)
- Interceptores de response (refresh token automático)
- Manejo de errores global

### `types.ts`
Tipos TypeScript copiados del backend:
- Interfaces de entidades (User, Advisory, AdvisoryRequest, etc.)
- DTOs (CreateAdvisoryRequestDto, LoginDto, etc.)
- Enums (UserRole, AdvisoryStatus, etc.)

### `endpoints/`
Funciones organizadas por dominio que llaman a la API:
- `auth.ts` - Login, logout, refresh token
- `advisories.ts` - CRUD de asesorías
- `users.ts` - Gestión de usuarios
- `subjects.ts` - Gestión de materias
- `notifications.ts` - Sistema de notificaciones

### `hooks/`
Custom hooks de React Query para cada endpoint:
- `useAuth.ts` - Hooks de autenticación
- `useAdvisories.ts` - Hooks para asesorías
- `useUsers.ts` - Hooks para usuarios
