# 📝 Types

Tipos y interfaces TypeScript adicionales específicas del frontend.

## 📁 Archivos

### `api.ts`
Tipos relacionados con API y HTTP:
```tsx
export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
}

export interface ApiError {
  message: string | string[];
  error: string;
  statusCode: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
```

### `components.ts`
Tipos para props de componentes:
```tsx
export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

export interface TableColumn<T> {
  field: keyof T;
  headerName: string;
  width?: number;
  sortable?: boolean;
  renderCell?: (row: T) => React.ReactNode;
}

export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'date' | 'textarea';
  required?: boolean;
  options?: { value: string | number; label: string }[];
}
```

### `common.ts`
Tipos compartidos comunes:
```tsx
export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface SelectOption<T = string | number> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface Breadcrumb {
  label: string;
  path?: string;
  active?: boolean;
}

export interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  path?: string;
  roles?: UserRole[];
  children?: MenuItem[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
```

### `forms.ts`
Tipos específicos para formularios:
```tsx
export interface LoginFormData {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AdvisoryRequestFormData {
  professorId: number;
  subjectId: number;
  message: string;
  preferredDate?: Date;
}

export interface UserFormData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  password?: string;
}
```

### `store.ts`
Tipos para los stores de Zustand:
```tsx
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface UIState {
  sidebarOpen: boolean;
  themeMode: 'light' | 'dark';
  notifications: Notification[];
}

export interface FilterState {
  search: string;
  status: string[];
  dateRange: { start: Date | null; end: Date | null };
}
```

## 🔗 Relación con `/api/types.ts`

- `/api/types.ts` → Tipos del backend (entities, DTOs)
- `/types/` → Tipos específicos del frontend (UI, forms, state)

## 💡 Principios

- **Reutilizables:** Tipos que se usan en múltiples lugares
- **Descriptivos:** Nombres claros y específicos
- **Extendibles:** Interfaces que se pueden extender
- **Documentados:** Comentarios JSDoc cuando sea necesario
