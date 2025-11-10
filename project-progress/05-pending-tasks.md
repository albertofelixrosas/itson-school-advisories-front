# ⏳ Tareas Pendientes

**Proyecto:** School Advisories Frontend  
**Última actualización:** 10 de Noviembre, 2025

---

## 🔴 PRIORIDAD ALTA - Hacer Primero

### 1. Crear Variables de Entorno
**Status:** ⏳ PENDIENTE  
**Archivos:** `.env.development`, `.env.production`  
**Tiempo estimado:** 5 minutos  
**Bloqueante:** Sí - Necesario para toda configuración posterior

**Variables necesarias:**
- VITE_API_BASE_URL
- VITE_API_TIMEOUT
- VITE_JWT_STORAGE_KEY
- VITE_REFRESH_TOKEN_KEY
- VITE_APP_NAME
- VITE_ENVIRONMENT
- VITE_ENABLE_NOTIFICATIONS
- VITE_DEBUG_MODE
- VITE_THEME_MODE

---

### 2. Crear Estructura de Carpetas
**Status:** ⏳ PENDIENTE  
**Ubicación:** `/src`  
**Tiempo estimado:** 10 minutos  
**Bloqueante:** Sí - Base para organización del código

**Carpetas a crear:**
- src/api/endpoints/
- src/api/hooks/
- src/components/common/
- src/components/auth/
- src/components/student/
- src/components/professor/
- src/components/admin/
- src/pages/auth/
- src/pages/student/
- src/pages/professor/
- src/pages/admin/
- src/hooks/
- src/store/
- src/contexts/
- src/utils/
- src/theme/
- src/types/
- src/config/

---

### 3. Copiar Tipos del Backend
**Status:** ⏳ PENDIENTE  
**Archivo origen:** `/docs/frontend-integration/backend-types.ts`  
**Archivo destino:** `/src/api/types.ts`  
**Tiempo estimado:** 2 minutos  
**Bloqueante:** Sí - Necesario para type safety en toda la app

---

### 4. Configurar Cliente Axios
**Status:** ⏳ PENDIENTE  
**Archivo:** `/src/api/client.ts`  
**Tiempo estimado:** 30 minutos  
**Bloqueante:** Sí - Necesario para comunicación con backend

**Debe incluir:**
- Base URL configuration
- Timeout settings
- Request interceptor (JWT)
- Response interceptor (refresh token)
- Error handling

---

### 5. Configurar Tema de Material-UI
**Status:** ⏳ PENDIENTE  
**Archivos:** `/src/theme/index.ts`, `/src/theme/colors.ts`  
**Tiempo estimado:** 30 minutos  
**Bloqueante:** Sí - Necesario para UI consistente

**Componentes:**
- Theme configuration
- LocalizationProvider (date-fns)
- CssBaseline
- Spanish locale setup

---

### 6. Crear Utilidades de Token JWT
**Status:** ⏳ PENDIENTE  
**Archivo:** `/src/utils/tokenUtils.ts`  
**Tiempo estimado:** 45 minutos  
**Bloqueante:** Sí - Core del sistema de autenticación

**Funciones:**
- getAuthToken()
- setAuthToken()
- removeAuthTokens()
- getUserFromToken()
- isTokenExpired()
- refreshAuthToken()

---

## 🟡 PRIORIDAD MEDIA - Sistema de Autenticación

### 7. Crear Context de Autenticación
**Status:** ⏳ PENDIENTE  
**Archivo:** `/src/contexts/AuthContext.tsx`  
**Tiempo estimado:** 1 hora  
**Dependencias:** Tarea #6

---

### 8. Crear Componente ProtectedRoute
**Status:** ⏳ PENDIENTE  
**Archivo:** `/src/components/common/ProtectedRoute.tsx`  
**Tiempo estimado:** 30 minutos  
**Dependencias:** Tarea #7

---

### 9. Crear Endpoints de Auth
**Status:** ⏳ PENDIENTE  
**Archivo:** `/src/api/endpoints/auth.ts`  
**Tiempo estimado:** 30 minutos  
**Dependencias:** Tarea #4

---

### 10. Crear Página de Login
**Status:** ⏳ PENDIENTE  
**Archivos:** `/src/pages/auth/LoginPage.tsx`, `/src/components/auth/LoginForm.tsx`  
**Tiempo estimado:** 2 horas  
**Dependencias:** Tareas #4, #5, #7

---

### 11. Configurar React Query Provider
**Status:** ⏳ PENDIENTE  
**Archivo:** `/src/contexts/QueryContext.tsx`  
**Tiempo estimado:** 30 minutos  
**Dependencias:** Ninguna

---

### 12. Configurar App.tsx Principal
**Status:** ⏳ PENDIENTE  
**Archivo:** `/src/App.tsx`  
**Tiempo estimado:** 1 hora  
**Dependencias:** Tareas #5, #7, #11

---

## 🟢 PRIORIDAD BAJA - Componentes Comunes

### 13. Crear Layout Principal
**Status:** ⏳ PENDIENTE  
**Archivo:** `/src/components/common/Layout.tsx`  
**Tiempo estimado:** 3 horas  
**Dependencias:** Tareas #5, #8

---

### 14. Crear Componentes de Loading
**Status:** ⏳ PENDIENTE  
**Archivos:** LoadingSpinner, LoadingOverlay, PageLoader  
**Tiempo estimado:** 1 hora  
**Dependencias:** Tarea #5

---

### 15. Crear Error Boundary
**Status:** ⏳ PENDIENTE  
**Archivo:** `/src/components/common/ErrorBoundary.tsx`  
**Tiempo estimado:** 1 hora  
**Dependencias:** Tarea #5

---

### 16. Crear Componente de Notificaciones
**Status:** ⏳ PENDIENTE  
**Archivo:** `/src/components/common/NotificationProvider.tsx`  
**Tiempo estimado:** 30 minutos  
**Dependencias:** Ninguna

---

## 📊 Features por Rol (Pendientes)

### 🧑‍🎓 ESTUDIANTE (5 features)
- ⏳ Dashboard de estudiante
- ⏳ Formulario de solicitud de asesoría
- ⏳ Lista de mis solicitudes
- ⏳ Lista de mis invitaciones
- ⏳ Calendario de sesiones

### 👨‍🏫 PROFESOR (6 features)
- ⏳ Dashboard de profesor
- ⏳ Lista de solicitudes pendientes
- ⏳ Modal de revisión de solicitudes
- ⏳ Formulario de creación de sesión
- ⏳ Gestión de disponibilidad
- ⏳ Registro de asistencia

### 👤 ADMIN (5 features)
- ⏳ Dashboard de admin
- ⏳ Gestión de usuarios (CRUD)
- ⏳ Gestión de materias
- ⏳ Gestión de sedes
- ⏳ Editor de plantillas de email

---

## 🎯 Orden Recomendado de Ejecución

### Sprint 1 - Base (Semana 1)
1. Variables de entorno
2. Estructura de carpetas
3. Copiar tipos del backend
4. Configurar Axios client
5. Configurar tema MUI
6. Utilidades de token

### Sprint 2 - Autenticación (Semana 2)
7. Context de autenticación
8. ProtectedRoute component
9. Endpoints de auth
10. Página de login
11. React Query provider
12. App.tsx principal

### Sprint 3 - Componentes Base (Semana 3)
13. Layout principal
14. Loading components
15. Error boundary
16. Notification provider

### Sprint 4 - Features Estudiante (Semana 4-5)
17-21. Todas las features de estudiante

### Sprint 5 - Features Profesor (Semana 6-7)
22-27. Todas las features de profesor

### Sprint 6 - Features Admin (Semana 8-9)
28-32. Todas las features de admin

### Sprint 7 - Pulido (Semana 10)
33. Responsive design
34. Accesibilidad
35. Testing
36. Optimización

---

## 📈 Métricas

**Total de tareas pendientes:** ~36 tareas  
**Tiempo estimado total:** ~80-100 horas de desarrollo  
**Sprints estimados:** 7 sprints de 1-2 semanas  
**Duración total estimada:** 10-12 semanas

---

## 🚦 Bloqueantes Actuales

Las siguientes tareas están **bloqueadas** hasta completar las de prioridad ALTA:
- ✋ Todo el sistema de autenticación
- ✋ Configuración de providers
- ✋ Desarrollo de componentes
- ✋ Desarrollo de features

**Acción requerida:** Completar tareas 1-6 primero

---

**Siguiente tarea sugerida:** #1 - Crear Variables de Entorno
