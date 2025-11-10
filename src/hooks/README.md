# 🪝 Custom Hooks

Hooks personalizados reutilizables en toda la aplicación.

## 📁 Archivos

### `useAuth.ts`
Hook para acceder al contexto de autenticación:
```tsx
const { user, isAuthenticated, login, logout } = useAuth();
```

### `usePermissions.ts`
Hook para verificar permisos basados en rol:
```tsx
const { canAccess, hasRole } = usePermissions();
if (hasRole('ADMIN')) { ... }
```

### `useNotifications.ts`
Hook wrapper para react-hot-toast:
```tsx
const { showSuccess, showError, showInfo } = useNotifications();
showSuccess('Operación exitosa');
```

### `useLocalStorage.ts`
Hook para interactuar con localStorage de forma type-safe:
```tsx
const [value, setValue, removeValue] = useLocalStorage('key', defaultValue);
```

### `useDebounce.ts`
Hook para debounce de valores (útil para búsquedas):
```tsx
const debouncedValue = useDebounce(searchTerm, 500);
```

### `useMediaQuery.ts`
Hook para responsive design (si no se usa el de MUI):
```tsx
const isMobile = useMediaQuery('(max-width: 768px)');
```

## 💡 Convención

- Todos los hooks deben empezar con `use`
- Deben ser funciones puras cuando sea posible
- Documentar parámetros y retorno con JSDoc
