# 🎯 Next Steps - Roadmap de Desarrollo

**Última actualización:** 10 de Noviembre, 2025  
**Estado actual:** Dependencias instaladas ✅

---

## 📋 FASE 1: Configuración Base (ACTUAL)

### 1.1 Crear Variables de Entorno ⏳ PENDIENTE
**Prioridad:** 🔴 ALTA  
**Archivos a crear:**
- `.env.development` - Configuración para desarrollo
- `.env.production` - Configuración para producción

**Contenido necesario:**
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=10000
VITE_JWT_STORAGE_KEY=auth_token
VITE_REFRESH_TOKEN_KEY=refresh_token
VITE_TOKEN_EXPIRY_BUFFER=300000
VITE_APP_NAME=School Advisories System
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_REAL_TIME=false
VITE_DEBUG_MODE=true
VITE_THEME_MODE=light
```

---

### 1.2 Crear Estructura de Carpetas ⏳ PENDIENTE
**Prioridad:** 🔴 ALTA

**Carpetas a crear en `/src`:**
```
src/
├── api/
│   ├── endpoints/
│   └── hooks/
├── components/
│   ├── common/
│   ├── auth/
│   ├── student/
│   ├── professor/
│   ├── admin/
│   ├── forms/
│   ├── tables/
│   └── calendars/
├── pages/
│   ├── auth/
│   ├── student/
│   ├── professor/
│   └── admin/
├── hooks/
├── store/
├── contexts/
├── utils/
├── theme/
├── types/
└── config/
```

---

### 1.3 Copiar Tipos del Backend ⏳ PENDIENTE
**Prioridad:** 🔴 ALTA

**Acción:**
- Copiar `/docs/frontend-integration/backend-types.ts`
- Pegar en `/src/api/types.ts`
- Revisar y ajustar imports si es necesario

---

### 1.4 Configurar Cliente Axios ⏳ PENDIENTE
**Prioridad:** 🔴 ALTA

**Archivo:** `/src/api/client.ts`

**Debe incluir:**
- Configuración base con baseURL
- Request interceptor (agregar JWT token)
- Response interceptor (manejar refresh token)
- Error handling global
- Timeout configuration

---

### 1.5 Configurar Tema de Material-UI ⏳ PENDIENTE
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

**FASE 1 - Configuración Base:** 🟡 20% (Dependencias instaladas)  
**FASE 2 - Autenticación:** 🔴 0%  
**FASE 3 - React Query:** 🔴 0%  
**FASE 4 - Componentes Comunes:** 🔴 0%  
**FASE 5 - Features Estudiante:** 🔴 0%  
**FASE 6 - Features Profesor:** 🔴 0%  
**FASE 7 - Features Admin:** 🔴 0%  
**FASE 8 - Pulido y Testing:** 🔴 0%

**Progreso Total del Proyecto:** 🟡 **2.5%**

---

## 💡 Recomendación

**Empezar por la FASE 1 completamente** antes de avanzar a autenticación. Una buena base es crítica para el resto del proyecto.

**Siguiente paso sugerido:** Crear archivo `.env.development` con las variables de entorno.
