# 🚀 Project Setup - School Advisories Frontend

## Información del Proyecto

**Nombre:** School Advisories Frontend  
**Tecnología Base:** React 19 + TypeScript + Vite  
**Backend:** NestJS (API REST en http://localhost:3000)  
**Fecha de inicio:** 10 de Noviembre, 2025

---

## ✅ Configuración Inicial Completada

### 1. Estructura base del proyecto
- ✅ Proyecto creado con Vite + React + TypeScript
- ✅ Configuración de ESLint y TypeScript
- ✅ Estructura de carpetas básica (`src/`, `public/`, `docs/`)

### 2. Documentación disponible
El proyecto cuenta con documentación completa en `/docs`:
- `/docs/frontend-integration/copilot-master-guide.md` - Guía maestra del proyecto
- `/docs/frontend-integration/backend-api-reference.md` - Documentación de API
- `/docs/frontend-integration/backend-types.ts` - Tipos TypeScript del backend
- `/docs/frontend-integration/react-setup.md` - Setup de React
- `/docs/frontend-integration/react-dependencies-guide.md` - Guía de dependencias
- `/docs/frontend-integration/user-flows.md` - Flujos de usuario

---

## 🎯 Objetivo del Proyecto

Desarrollar un sistema frontend para gestión de asesorías académicas universitarias donde:
- **Estudiantes** solicitan asesorías con profesores
- **Profesores** aprueban/rechazan solicitudes y crean sesiones
- **Administradores** gestionan usuarios, materias y configuración del sistema

---

## 🎨 Stack Tecnológico Definido

### Core Framework
- React 19.2.0
- TypeScript 5.9.3
- Vite 7.2.2

### UI Framework
- Material-UI (MUI) 7.3.5
- MUI X Data Grid 8.17.0 (tablas admin)
- MUI X Date Pickers 8.17.0 (scheduling crítico)
- MUI Icons Material 7.3.5
- Emotion (styled components)

### State Management & Data Fetching
- TanStack React Query 5.90.7
- Axios 1.13.2
- Zustand 5.0.8

### Routing & Navigation
- React Router DOM 7.9.5

### Forms & Validation
- React Hook Form 7.66.0
- Yup 1.7.1
- @hookform/resolvers 5.2.2

### Utilities
- date-fns 4.1.0 (manejo de fechas)
- js-cookie 3.0.5 (JWT storage)
- react-hot-toast 2.6.0 (notificaciones)
- framer-motion 12.23.24 (animaciones)

### Development Tools
- @types/js-cookie 3.0.6
- @tanstack/react-query-devtools 5.90.2

---

## 📊 Roles del Sistema

### 🧑‍🎓 STUDENT
- Solicitar asesorías
- Ver mis solicitudes
- Responder invitaciones
- Ver mis sesiones programadas

### 👨‍🏫 PROFESSOR
- Revisar solicitudes pendientes
- Aprobar/Rechazar solicitudes
- Crear sesiones directas
- Gestionar disponibilidad
- Registrar asistencia

### 👤 ADMIN
- Gestión completa de usuarios
- Gestión de materias y sedes
- Configuración de plantillas de email
- Acceso a estadísticas del sistema

---

## 🔑 Autenticación

- JWT Tokens (access + refresh)
- Almacenamiento en cookies
- Refresh automático
- Guards por rol

---

## 📁 Estructura de Carpetas Planificada

```
src/
├── api/                    # Configuración de API y endpoints
│   ├── client.ts          # Axios con interceptores
│   ├── types.ts           # Tipos del backend
│   └── endpoints/         # Endpoints organizados
├── components/            # Componentes React
│   ├── common/           # Componentes compartidos
│   ├── student/          # Componentes de estudiante
│   ├── professor/        # Componentes de profesor
│   └── admin/            # Componentes de admin
├── pages/                # Páginas principales
├── hooks/                # Custom hooks
├── store/                # Zustand stores
├── contexts/             # React contexts
├── utils/                # Utilidades
├── theme/                # Configuración de MUI theme
└── types/                # Tipos TypeScript
```

---

## ⚙️ Variables de Entorno Necesarias

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=10000
VITE_JWT_STORAGE_KEY=auth_token
VITE_REFRESH_TOKEN_KEY=refresh_token
VITE_APP_NAME=School Advisories System
VITE_ENVIRONMENT=development
VITE_ENABLE_NOTIFICATIONS=true
VITE_DEBUG_MODE=true
```

---

## 📝 Notas Importantes

- El proyecto usa React 19 (más reciente que la documentación que sugiere React 18)
- Las advertencias de engine de Node se pueden ignorar (v20.18.0 es compatible)
- 0 vulnerabilidades detectadas en dependencias
- El backend debe estar corriendo en `http://localhost:3000`

---

**Estado actual:** ✅ SETUP INICIAL COMPLETADO  
**Siguiente fase:** Configuración de estructura y archivos base
