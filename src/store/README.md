# 🗄️ Store (Zustand)

State management global usando Zustand para UI state.

## 📁 Archivos

### `authStore.ts`
Store de autenticación (alternativa ligera al Context):
```tsx
interface AuthStore {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}
```

### `uiStore.ts`
Store para estado de UI:
```tsx
interface UIStore {
  sidebarOpen: boolean;
  themeMode: 'light' | 'dark';
  toggleSidebar: () => void;
  setThemeMode: (mode: 'light' | 'dark') => void;
}
```

### `notificationStore.ts`
Store para notificaciones persistentes:
```tsx
interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: number) => void;
  clearAll: () => void;
}
```

### `filterStore.ts`
Store para filtros de búsqueda/tablas:
```tsx
interface FilterStore {
  advisoryFilters: AdvisoryFilters;
  userFilters: UserFilters;
  setAdvisoryFilters: (filters: AdvisoryFilters) => void;
  resetAdvisoryFilters: () => void;
}
```

## 🎯 Cuándo usar Zustand vs React Query

**Zustand:**
- Estado de UI (sidebar, tema, modales)
- Filtros y preferencias del usuario
- Estado temporal no relacionado con el backend

**React Query:**
- Datos del servidor (users, advisories, requests)
- Cache y sincronización con backend
- Mutations y updates de datos
