# ⏳ Tareas Pendientes

**Proyecto:** School Advisories Frontend  
**Última actualización:** 10 de Noviembre, 2025

---

## 🔴 PRIORIDAD ALTA - Hacer Primero

### 1. ✅ Crear Variables de Entorno - COMPLETADO
**Status:** ✅ COMPLETADO  
**Archivos:** `.env.development`, `.env.production`, `.env.example`  
**Completado:** 10 de Noviembre, 2025

---

### 2. ✅ Crear Estructura de Carpetas - COMPLETADO
**Status:** ✅ COMPLETADO  
**Ubicación:** `/src`  
**Completado:** 10 de Noviembre, 2025

---

### 3. ✅ Copiar Tipos del Backend - COMPLETADO
**Status:** ✅ COMPLETADO  
**Archivo:** `/src/api/types.ts`  
**Completado:** 10 de Noviembre, 2025

---

### 4. ✅ Configurar Cliente Axios - COMPLETADO
**Status:** ✅ COMPLETADO  
**Archivo:** `/src/api/client.ts`  
**Completado:** 10 de Noviembre, 2025

---

### 5. ✅ Configurar Tema de Material-UI - COMPLETADO
**Status:** ✅ COMPLETADO  
**Archivos:** `/src/theme/index.ts`, `/src/theme/ThemeProvider.tsx`, `/src/theme/colors.ts`, `/src/theme/typography.ts`  
**Completado:** 10 de Noviembre, 2025

---

### 6. ✅ Crear Utilidades de Token JWT - COMPLETADO
**Status:** ✅ COMPLETADO  
**Archivo:** `/src/utils/tokenUtils.ts`  
**Completado:** 10 de Noviembre, 2025

---

### 7. ✅ Crear Context de Autenticación - COMPLETADO
**Status:** ✅ COMPLETADO  
**Archivos:** `/src/contexts/AuthContext.tsx`, `/src/hooks/useAuth.ts`  
**Completado:** 10 de Noviembre, 2025

---

### 8. ✅ Crear Componente ProtectedRoute - COMPLETADO
**Status:** ✅ COMPLETADO  
**Archivo:** `/src/components/common/ProtectedRoute.tsx`  
**Completado:** 10 de Noviembre, 2025

---

### 9. ✅ Crear Endpoints de Auth - COMPLETADO
**Status:** ✅ COMPLETADO  
**Archivo:** `/src/api/endpoints/auth.ts`  
**Completado:** 10 de Noviembre, 2025

---

### 10. ✅ Configurar React Query Provider - COMPLETADO
**Status:** ✅ COMPLETADO  
**Archivos:** `/src/config/queryClient.ts`, `/src/contexts/QueryContext.tsx`  
**Completado:** 10 de Noviembre, 2025

---

### 11. ✅ Configurar App.tsx Principal - COMPLETADO
**Status:** ✅ COMPLETADO  
**Archivo:** `/src/App.tsx`  
**Completado:** 10 de Noviembre, 2025

---

## 🟡 PRIORIDAD MEDIA - Páginas de Autenticación

### 12. ✅ Crear Páginas de Autenticación - COMPLETADO
**Status:** ✅ COMPLETADO  
**Archivos creados:**
- `/src/components/auth/LoginForm.tsx` - Formulario de login con validación
- `/src/pages/auth/LoginPage.tsx` - Página completa de login
- `/src/pages/auth/UnauthorizedPage.tsx` - Página 403 sin permisos
- `/src/components/auth/index.ts` - Barrel export
- `/src/pages/auth/index.ts` - Barrel export

**Características implementadas:**
- ✅ Formulario con React Hook Form + Yup
- ✅ Validación de email y password
- ✅ Toggle para mostrar/ocultar contraseña
- ✅ Loading states y error handling
- ✅ Toast notifications
- ✅ Redirect logic post-login
- ✅ Página 403 con mensajes según rol
- ✅ Navegación inteligente basada en roles

**Completado:** 10 de Noviembre, 2025

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
