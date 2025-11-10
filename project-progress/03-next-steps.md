# 🎯 Next Steps - Roadmap de Desarrollo

**Última actualización:** 10 de Noviembre, 2025  
**Estado actual:** Dependencias instaladas ✅

---

## 📋 FASE 1: Configuración Base (ACTUAL)

### 1.1 Crear Variables de Entorno ✅ COMPLETADO
**Prioridad:** 🔴 ALTA  
**Archivos creados:**
- ✅ `.env.development` - Configuración para desarrollo
- ✅ `.env.production` - Configuración para producción
- ✅ `.env.example` - Template documentado

**Variables configuradas:**
- API Configuration (base URL, timeout)
- JWT Authentication (storage keys, expiry buffer)
- App Configuration (name, version, environment)
- Feature Flags (notifications, real-time, analytics, debug)
- Theme Configuration (mode, colors)
- Localization (locale español, timezone Mexico)

---

### 1.2 Crear Estructura de Carpetas ✅ COMPLETADO
**Prioridad:** 🔴 ALTA

**Estructura creada:**
- ✅ 21 carpetas organizadas por layer y feature
- ✅ 10 archivos README.md con documentación
- ✅ Estructura basada en documentación oficial del proyecto
- ✅ Organización híbrida: feature-first + type-first

**Carpetas principales:**
- `api/` - Layer de comunicación con backend
- `components/` - Componentes React por rol (8 subcarpetas)
- `pages/` - Páginas principales por rol (4 subcarpetas)
- `contexts/` - React Contexts
- `hooks/` - Custom hooks
- `store/` - Zustand stores
- `utils/` - Utilidades puras
- `theme/` - Configuración MUI
- `types/` - Tipos TypeScript
- `config/` - Configuración centralizada

---

### 1.3 Copiar Tipos del Backend ✅ COMPLETADO
**Prioridad:** 🔴 ALTA

**Completado:**
- ✅ Copiado `/docs/frontend-integration/backend-types.ts` → `/src/api/types.ts`
- ✅ ~40 interfaces y tipos integrados
- ✅ 6 enums del backend disponibles
- ✅ Type safety completo en la aplicación

**Tipos incluidos:**
- Enums (UserRole, RequestStatus, InvitationStatus, etc.)
- Core Entities (User, Subject, Advisory, etc.)
- DTOs (Login, Create/Update para todas las entidades)
- Response Types (AdvisoryRequestResponse, etc.)
- Utility Types (ApiResponse, PaginatedResponse, Filters)

---

### 1.4 Configurar Cliente Axios ✅ COMPLETADO
**Prioridad:** 🔴 ALTA

**Archivo:** `/src/api/client.ts`

**Implementado:**
- ✅ Cliente Axios con baseURL y timeout configurables
- ✅ Request interceptor - Agrega JWT a todas las peticiones
- ✅ Response interceptor - Refresh token automático
- ✅ Sistema de cola para evitar múltiples refresh simultáneos
- ✅ Error handling global con mensajes en español
- ✅ Helper functions (setAuthorizationToken, clearAuthTokens, isAuthenticated)

**Seguridad:**
- Tokens en localStorage
- Refresh automático en 401
- Limpieza de tokens en logout
- Redirect a login cuando falla autenticación

---

### 1.5 Configurar Tema de Material-UI ⏳ PENDIENTE (ACTUAL)
**Prioridad:** 🔴 ALTA

**Archivos a crear:**
- `/src/theme/index.ts` - Configuración principal del tema
- `/src/theme/colors.ts` - Paleta de colores
- `/src/theme/typography.ts` - Configuración de tipografía

**Debe incluir:**
- Theme customizado de MUI
- LocalizationProvider con date-fns
- Configuración de idioma español para fechas
- CssBaseline

---

## 📋 FASE 2: Sistema de Autenticación

### 2.1 Crear Utilidades de Token ⏳ PENDIENTE
**Archivo:** `/src/utils/tokenUtils.ts`

**Funciones necesarias:**
- `getAuthToken()` - Obtener token de cookie
- `setAuthToken()` - Guardar token en cookie
- `removeAuthTokens()` - Limpiar tokens
- `getUserFromToken()` - Decodificar JWT y obtener usuario
- `isTokenExpired()` - Verificar si el token expiró
- `refreshAuthToken()` - Refrescar el token

---

### 2.2 Crear Context de Autenticación ⏳ PENDIENTE
**Archivo:** `/src/contexts/AuthContext.tsx`

**Debe proveer:**
- Estado de autenticación (`isAuthenticated`, `user`, `role`, `loading`)
- Funciones: `login()`, `logout()`, `refreshToken()`
- Hook: `useAuth()`

---

### 2.3 Crear Componente ProtectedRoute ⏳ PENDIENTE
**Archivo:** `/src/components/common/ProtectedRoute.tsx`

**Funcionalidad:**
- Verificar autenticación
- Verificar roles permitidos
- Redirect a login si no autenticado
- Redirect a /unauthorized si no tiene permisos

---

### 2.4 Crear Endpoints de Auth ⏳ PENDIENTE
**Archivo:** `/src/api/endpoints/auth.ts`

**Endpoints:**
- `login(credentials)` - POST /auth/login
- `refresh(refreshToken)` - POST /auth/refresh
- `logout()` - Limpiar tokens localmente
- `getProfile()` - GET /users/profile

---

### 2.5 Crear Páginas de Login/Logout ⏳ PENDIENTE
**Archivos:**
- `/src/pages/auth/LoginPage.tsx`
- `/src/components/auth/LoginForm.tsx`

**Funcionalidad:**
- Formulario de login con React Hook Form
- Validación con Yup
- Mostrar errores
- Redirect después de login exitoso

---

## 📋 FASE 3: Configuración de React Query

### 3.1 Crear QueryClient Provider ⏳ PENDIENTE
**Archivo:** `/src/contexts/QueryContext.tsx`

**Configuración:**
- QueryClient con opciones por defecto
- Stale time y cache time
- Retry logic
- React Query DevTools (solo en desarrollo)

---

### 3.2 Configurar App.tsx Principal ⏳ PENDIENTE
**Archivo:** `/src/App.tsx`

**Debe incluir:**
- QueryClientProvider
- AuthProvider
- ThemeProvider (MUI)
- Router
- Toaster (react-hot-toast)

---

## 📋 FASE 4: Componentes Comunes

### 4.1 Crear Layout Principal ⏳ PENDIENTE
**Archivo:** `/src/components/common/Layout.tsx`

**Componentes:**
- AppBar con navegación
- Sidebar con menú por rol
- Content area
- Footer (opcional)

---

### 4.2 Crear Componentes de Loading ⏳ PENDIENTE
**Archivos:**
- `/src/components/common/LoadingSpinner.tsx`
- `/src/components/common/LoadingOverlay.tsx`
- `/src/components/common/PageLoader.tsx`

---

### 4.3 Crear Error Boundaries ⏳ PENDIENTE
**Archivo:** `/src/components/common/ErrorBoundary.tsx`

**Funcionalidad:**
- Catch de errores React
- Mostrar UI de fallback
- Log de errores
- Botón de reset

---

## 📋 FASE 5: Features de Estudiante

### 5.1 Dashboard de Estudiante ⏳ PENDIENTE
### 5.2 Formulario de Solicitud de Asesoría ⏳ PENDIENTE
### 5.3 Lista de Mis Solicitudes ⏳ PENDIENTE
### 5.4 Lista de Mis Invitaciones ⏳ PENDIENTE
### 5.5 Calendario de Sesiones ⏳ PENDIENTE

---

## 📋 FASE 6: Features de Profesor

### 6.1 Dashboard de Profesor ⏳ PENDIENTE
### 6.2 Lista de Solicitudes Pendientes ⏳ PENDIENTE
### 6.3 Modal de Revisión de Solicitudes ⏳ PENDIENTE
### 6.4 Formulario de Creación de Sesión ⏳ PENDIENTE
### 6.5 Gestión de Disponibilidad ⏳ PENDIENTE
### 6.6 Registro de Asistencia ⏳ PENDIENTE

---

## 📋 FASE 7: Features de Admin

### 7.1 Dashboard de Admin con Estadísticas ⏳ PENDIENTE
### 7.2 Gestión de Usuarios (CRUD completo) ⏳ PENDIENTE
### 7.3 Gestión de Materias ⏳ PENDIENTE
### 7.4 Gestión de Sedes/Locations ⏳ PENDIENTE
### 7.5 Editor de Plantillas de Email ⏳ PENDIENTE

---

## 📋 FASE 8: Pulido y Testing

### 8.1 Responsive Design ⏳ PENDIENTE
### 8.2 Accesibilidad (a11y) ⏳ PENDIENTE
### 8.3 Testing Unitario ⏳ PENDIENTE
### 8.4 Testing E2E ⏳ PENDIENTE
### 8.5 Optimización de Performance ⏳ PENDIENTE

---

## 🎯 Prioridad Inmediata (Hacer AHORA)

1. ✅ ~~Instalar dependencias~~ **COMPLETADO**
2. ⏳ **Crear variables de entorno** (.env.development)
3. ⏳ **Crear estructura de carpetas**
4. ⏳ **Copiar tipos del backend**
5. ⏳ **Configurar Axios client**
6. ⏳ **Configurar tema MUI**

---

## 📊 Progreso General

**FASE 1 - Configuración Base:** 🟢 83% (Dependencias ✅, Variables ✅, Estructura ✅, Tipos ✅, Axios ✅)  
**FASE 2 - Autenticación:** 🔴 0%  
**FASE 3 - React Query:** 🔴 0%  
**FASE 4 - Componentes Comunes:** 🔴 0%  
**FASE 5 - Features Estudiante:** 🔴 0%  
**FASE 6 - Features Profesor:** 🔴 0%  
**FASE 7 - Features Admin:** 🔴 0%  
**FASE 8 - Pulido y Testing:** 🔴 0%

**Progreso Total del Proyecto:** � **12.5%**

---

## 💡 Recomendación

**Completar FASE 1** - Solo falta configurar el tema de Material-UI.

**Siguiente paso sugerido:** Configurar MUI Theme en `/src/theme/` con LocalizationProvider.
