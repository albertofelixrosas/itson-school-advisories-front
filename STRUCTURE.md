# 📂 Estructura del Proyecto - Mapa Visual

```
school-advisories-front-2/
│
├── 📄 .env.development          # Variables de entorno para desarrollo
├── 📄 .env.production           # Variables de entorno para producción
├── 📄 .env.example              # Template de variables
├── 📄 package.json              # Dependencias del proyecto
├── 📄 vite.config.ts            # Configuración de Vite
├── 📄 tsconfig.json             # Configuración de TypeScript
├── 📄 eslint.config.js          # Configuración de ESLint
│
├── 📁 docs/                     # Documentación del proyecto
│   ├── frontend-integration/    # Documentación de integración
│   │   ├── copilot-master-guide.md
│   │   ├── backend-api-reference.md
│   │   ├── backend-types.ts
│   │   ├── react-setup.md
│   │   └── user-flows.md
│   └── UML/                     # Diagramas UML
│
├── 📁 project-progress/         # 🎯 Sistema de seguimiento
│   ├── README.md                # Guía de uso
│   ├── 01-project-setup.md      # Setup inicial
│   ├── 02-dependencies-installed.md
│   ├── 03-next-steps.md         # 📋 ROADMAP
│   ├── 04-completed-tasks.md    # ✅ Tareas completadas
│   ├── 05-pending-tasks.md      # ⏳ Tareas pendientes
│   └── 06-technical-notes.md    # 📝 Notas técnicas
│
├── 📁 public/                   # Archivos estáticos
│
└── 📁 src/                      # 🚀 Código fuente
    │
    ├── 📁 api/                  # 🌐 Capa de API
    │   ├── 📄 README.md
    │   ├── 📄 client.ts         # Cliente Axios con interceptores
    │   ├── 📄 types.ts          # Tipos del backend (copiar aquí)
    │   ├── 📁 endpoints/        # Endpoints organizados
    │   │   ├── auth.ts          # POST /auth/login, /auth/refresh
    │   │   ├── advisories.ts    # CRUD de asesorías
    │   │   ├── users.ts         # Gestión de usuarios
    │   │   ├── subjects.ts      # Gestión de materias
    │   │   └── notifications.ts # Notificaciones
    │   └── 📁 hooks/            # React Query hooks
    │       ├── useAuth.ts
    │       ├── useAdvisories.ts
    │       └── useUsers.ts
    │
    ├── 📁 components/           # 🧩 Componentes React
    │   ├── 📄 README.md
    │   ├── 📁 common/           # Componentes compartidos
    │   │   ├── Layout.tsx       # Layout principal con navbar
    │   │   ├── ProtectedRoute.tsx
    │   │   ├── LoadingSpinner.tsx
    │   │   └── ErrorBoundary.tsx
    │   ├── 📁 auth/             # Autenticación
    │   │   ├── LoginForm.tsx
    │   │   └── LogoutButton.tsx
    │   ├── 📁 student/          # 🧑‍🎓 Componentes de estudiante
    │   │   ├── RequestAdvisory.tsx
    │   │   ├── MyRequests.tsx
    │   │   └── StudentDashboard.tsx
    │   ├── 📁 professor/        # 👨‍🏫 Componentes de profesor
    │   │   ├── PendingRequests.tsx
    │   │   ├── CreateSession.tsx
    │   │   └── ManageRequests.tsx
    │   ├── 📁 admin/            # 👤 Componentes de admin
    │   │   ├── UserManagement.tsx
    │   │   └── SystemSettings.tsx
    │   ├── 📁 forms/            # Formularios reutilizables
    │   ├── 📁 tables/           # DataGrids de MUI
    │   └── 📁 calendars/        # Date pickers y calendarios
    │
    ├── 📁 pages/                # 📄 Páginas principales
    │   ├── 📄 README.md
    │   ├── 📁 auth/
    │   │   ├── LoginPage.tsx
    │   │   └── UnauthorizedPage.tsx
    │   ├── 📁 student/          # 🧑‍🎓 Páginas de estudiante
    │   │   ├── StudentDashboard.tsx
    │   │   ├── MyRequestsPage.tsx
    │   │   ├── MyInvitationsPage.tsx
    │   │   └── MySchedulePage.tsx
    │   ├── 📁 professor/        # 👨‍🏫 Páginas de profesor
    │   │   ├── ProfessorDashboard.tsx
    │   │   ├── PendingRequestsPage.tsx
    │   │   ├── CreateSessionPage.tsx
    │   │   └── ManageSessionsPage.tsx
    │   └── 📁 admin/            # 👤 Páginas de admin
    │       ├── AdminDashboard.tsx
    │       ├── UserManagementPage.tsx
    │       ├── SubjectManagementPage.tsx
    │       └── VenueManagementPage.tsx
    │
    ├── 📁 contexts/             # ⚛️ React Contexts
    │   ├── 📄 README.md
    │   ├── AuthContext.tsx      # Context de autenticación
    │   ├── QueryContext.tsx     # Provider de React Query
    │   ├── ThemeContext.tsx     # Provider de MUI Theme
    │   └── NotificationContext.tsx
    │
    ├── 📁 hooks/                # 🪝 Custom Hooks
    │   ├── 📄 README.md
    │   ├── useAuth.ts           # Hook de autenticación
    │   ├── usePermissions.ts    # Verificación de permisos
    │   ├── useNotifications.ts  # Wrapper de toast
    │   ├── useLocalStorage.ts   # LocalStorage type-safe
    │   └── useDebounce.ts       # Debounce para búsquedas
    │
    ├── 📁 store/                # 🗄️ Zustand Stores
    │   ├── 📄 README.md
    │   ├── authStore.ts         # Store de autenticación
    │   ├── uiStore.ts           # Estado de UI (sidebar, theme)
    │   ├── notificationStore.ts # Notificaciones persistentes
    │   └── filterStore.ts       # Filtros de búsqueda
    │
    ├── 📁 utils/                # 🛠️ Utilidades
    │   ├── 📄 README.md
    │   ├── constants.ts         # Constantes globales
    │   ├── tokenUtils.ts        # 🔑 Manejo de JWT
    │   ├── dateUtils.ts         # 📅 Formateo de fechas
    │   ├── formatters.ts        # Formateadores de datos
    │   ├── validators.ts        # Schemas de validación (Yup)
    │   ├── apiHelpers.ts        # Helpers de API
    │   └── permissions.ts       # Verificación de permisos
    │
    ├── 📁 theme/                # 🎨 Material-UI Theme
    │   ├── 📄 README.md
    │   ├── index.ts             # Config principal del theme
    │   ├── colors.ts            # Paleta de colores
    │   ├── typography.ts        # Configuración de tipografía
    │   └── components.ts        # Overrides de componentes MUI
    │
    ├── 📁 types/                # 📝 Tipos TypeScript
    │   ├── 📄 README.md
    │   ├── api.ts               # Tipos de API (requests, responses)
    │   ├── components.ts        # Props de componentes
    │   ├── common.ts            # Tipos compartidos
    │   ├── forms.ts             # Tipos de formularios
    │   └── store.ts             # Tipos de stores
    │
    ├── 📁 config/               # ⚙️ Configuración
    │   ├── 📄 README.md
    │   ├── environment.ts       # Variables de entorno tipadas
    │   ├── api.ts               # Config de API (endpoints, base URL)
    │   ├── routes.ts            # Definición de rutas
    │   ├── queryClient.ts       # Config de React Query
    │   └── permissions.ts       # Permisos por rol
    │
    ├── 📁 assets/               # Imágenes, iconos, etc.
    ├── 📄 App.tsx               # Componente principal
    ├── 📄 App.css               # Estilos globales
    ├── 📄 main.tsx              # Entry point
    └── 📄 index.css             # Estilos base

```

## 🎯 Resumen de la Estructura

### Por Layers (Capas)
```
📊 Presentación
  └── pages/        - Páginas completas
  └── components/   - Componentes reutilizables

🧠 Lógica de Negocio
  └── hooks/        - Custom hooks
  └── contexts/     - State management (Context API)
  └── store/        - State management (Zustand)
  └── utils/        - Funciones de utilidad

🌐 Comunicación
  └── api/          - Layer de API (Axios + endpoints)

⚙️ Configuración
  └── config/       - Configuración centralizada
  └── theme/        - Theme de MUI
  └── types/        - Tipos TypeScript
```

### Por Roles (Features)
```
🧑‍🎓 STUDENT
  └── components/student/
  └── pages/student/

👨‍🏫 PROFESSOR
  └── components/professor/
  └── pages/professor/

👤 ADMIN
  └── components/admin/
  └── pages/admin/

🔓 AUTH
  └── components/auth/
  └── pages/auth/
```

## 📈 Estadísticas

- **Total de carpetas:** 21 carpetas
- **Archivos README.md:** 10 archivos de documentación
- **Layers principales:** 10 layers (api, components, pages, etc.)
- **Features por rol:** 3 roles (Student, Professor, Admin)
- **Subcarpetas de componentes:** 8 subcarpetas
- **Subcarpetas de páginas:** 4 subcarpetas

## 🚀 Próximo Paso

**Copiar tipos del backend:**
- Origen: `/docs/frontend-integration/backend-types.ts`
- Destino: `/src/api/types.ts`

Esta estructura permite:
✅ Escalabilidad
✅ Separación de concerns
✅ Fácil navegación
✅ Trabajo en equipo
✅ Testing organizado
