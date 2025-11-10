# 🌐 Contexts

React Contexts para estado global de la aplicación.

## 📁 Archivos

### `AuthContext.tsx`
Context de autenticación que provee:
- `isAuthenticated: boolean` - Estado de autenticación
- `user: User | null` - Usuario actual
- `role: UserRole | null` - Rol del usuario
- `loading: boolean` - Estado de carga
- `login(token: string)` - Función de login
- `logout()` - Función de logout
- `refreshToken()` - Función de refresh

### `QueryContext.tsx`
Provider de React Query configurado con:
- QueryClient con opciones por defecto
- Stale time y cache time
- Retry logic
- DevTools (solo en desarrollo)

### `ThemeContext.tsx`
Provider de Material-UI Theme:
- ThemeProvider de MUI
- LocalizationProvider (date-fns)
- CssBaseline
- Configuración de idioma español

### `NotificationContext.tsx` (Opcional)
Context para notificaciones globales si se necesita más que react-hot-toast.

## 🔌 Uso

Envolver `App.tsx` con todos los providers en el orden correcto:
```tsx
<QueryProvider>
  <ThemeProvider>
    <AuthProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </AuthProvider>
  </ThemeProvider>
</QueryProvider>
```
