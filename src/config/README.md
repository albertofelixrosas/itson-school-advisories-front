# ⚙️ Configuration

Archivos de configuración centralizados de la aplicación.

## 📁 Archivos

### `environment.ts`
Variables de entorno centralizadas y tipadas:
```tsx
interface Environment {
  apiBaseUrl: string;
  apiTimeout: number;
  jwtStorageKey: string;
  refreshTokenKey: string;
  appName: string;
  environment: 'development' | 'production' | 'staging';
  enableNotifications: boolean;
  enableRealTime: boolean;
  enableAnalytics: boolean;
  debugMode: boolean;
  themeMode: 'light' | 'dark';
  defaultLocale: string;
  defaultTimezone: string;
}

export const env: Environment = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  jwtStorageKey: import.meta.env.VITE_JWT_STORAGE_KEY || 'auth_token',
  refreshTokenKey: import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token',
  appName: import.meta.env.VITE_APP_NAME || 'School Advisories',
  environment: import.meta.env.VITE_ENVIRONMENT || 'development',
  enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
  enableRealTime: import.meta.env.VITE_ENABLE_REAL_TIME === 'true',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
  themeMode: import.meta.env.VITE_THEME_MODE || 'light',
  defaultLocale: import.meta.env.VITE_DEFAULT_LOCALE || 'es',
  defaultTimezone: import.meta.env.VITE_DEFAULT_TIMEZONE || 'America/Mexico_City',
};
```

### `api.ts`
Configuración específica de la API:
```tsx
import { env } from './environment';

export const apiConfig = {
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const endpoints = {
  auth: {
    login: '/auth/login',
    refresh: '/auth/refresh',
    profile: '/users/profile',
  },
  advisories: {
    list: '/advisories',
    create: '/advisories/direct-session',
    myAdvisories: '/advisories/my-advisories',
  },
  // ... más endpoints
};
```

### `routes.ts`
Configuración de rutas de la aplicación:
```tsx
export const routes = {
  home: '/',
  login: '/login',
  unauthorized: '/unauthorized',
  
  student: {
    dashboard: '/student/dashboard',
    requests: '/student/requests',
    invitations: '/student/invitations',
    schedule: '/student/schedule',
  },
  
  professor: {
    dashboard: '/professor/dashboard',
    pending: '/professor/pending-requests',
    availability: '/professor/availability',
    sessions: '/professor/sessions',
  },
  
  admin: {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    subjects: '/admin/subjects',
    venues: '/admin/venues',
    templates: '/admin/email-templates',
  },
};
```

### `queryClient.ts`
Configuración de React Query:
```tsx
import { QueryClient } from '@tanstack/react-query';

export const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      cacheTime: 1000 * 60 * 10, // 10 minutos
      retry: (failureCount: number, error: any) => {
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
};

export const queryClient = new QueryClient(queryClientConfig);
```

### `permissions.ts`
Configuración de permisos y roles:
```tsx
import { UserRole } from '@/api/types';

export const rolePermissions = {
  [UserRole.STUDENT]: {
    canRequestAdvisory: true,
    canViewOwnRequests: true,
    canRespondInvitations: true,
    canViewOwnSessions: true,
  },
  [UserRole.PROFESSOR]: {
    canApproveRequests: true,
    canCreateSessions: true,
    canManageAvailability: true,
    canRecordAttendance: true,
    canInviteStudents: true,
  },
  [UserRole.ADMIN]: {
    canManageUsers: true,
    canManageSubjects: true,
    canManageVenues: true,
    canManageEmailTemplates: true,
    canViewAllData: true,
  },
};

export const routePermissions = {
  '/student/*': [UserRole.STUDENT, UserRole.ADMIN],
  '/professor/*': [UserRole.PROFESSOR, UserRole.ADMIN],
  '/admin/*': [UserRole.ADMIN],
};
```

## 🎯 Ventajas de Centralizar Config

- ✅ **Type-safe:** Todas las configs tipadas
- ✅ **Fácil de cambiar:** Un solo lugar para modificar
- ✅ **Validación:** Valores por defecto si falta variable
- ✅ **Reutilizable:** Import desde cualquier parte
- ✅ **Documentado:** Comentarios en un solo lugar

## 🔧 Uso

```tsx
import { env } from '@/config/environment';
import { routes } from '@/config/routes';
import { queryClient } from '@/config/queryClient';

console.log(env.apiBaseUrl);
navigate(routes.student.dashboard);
```
