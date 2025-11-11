# 🔐 Auth Pages

Páginas relacionadas con autenticación y autorización.

## 📁 Archivos

### `LoginPage.tsx`
Página completa de inicio de sesión con formulario integrado.

**Características:**
- Formulario con validación (React Hook Form + Yup)
- Manejo de errores y loading states
- Redirect a ubicación previa después de login exitoso
- Integración con `useAuth` hook
- Toast notifications
- Diseño responsivo con Material-UI

**Uso:**
```tsx
import { LoginPage } from '@/pages/auth';

// En tu router
<Route path="/login" element={<LoginPage />} />
```

**Flujo:**
1. Usuario ingresa email y contraseña
2. Validación del formulario
3. Llamada a API `/auth/login`
4. Almacenamiento de tokens
5. Actualización de estado global (AuthContext)
6. Redirect a dashboard según rol

---

### `UnauthorizedPage.tsx`
Página de error 403 - Acceso denegado.

**Características:**
- Muestra información del usuario actual
- Mensajes personalizados según rol
- Botones de navegación contextual
- Diseño amigable y claro

**Uso:**
```tsx
import { UnauthorizedPage } from '@/pages/auth';

// En tu router
<Route path="/unauthorized" element={<UnauthorizedPage />} />

// O en ProtectedRoute
<ProtectedRoute allowedRoles={['ADMIN']}>
  <AdminPanel />
</ProtectedRoute>
// Si el usuario no es ADMIN, será redirigido a /unauthorized
```

**Mensajes según rol:**
- **Student:** "Puedes crear solicitudes de asesoría y ver tus invitaciones"
- **Professor:** "Puedes revisar solicitudes y gestionar asesorías"
- **Admin:** "Tienes acceso completo al sistema"
- **No autenticado:** "Inicia sesión para acceder al sistema"

---

## 🔗 Integración con Router

```tsx
// App.tsx o router configuration
import { LoginPage, UnauthorizedPage } from '@/pages/auth';
import { ProtectedRoute } from '@/components/common';

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      
      {/* Protected routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/professor/dashboard"
        element={
          <ProtectedRoute allowedRoles={['professor']}>
            <ProfessorDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

---

## 🎨 Diseño

Ambas páginas usan:
- **Background gradient** para mejor estética
- **Paper component** con elevación y border radius
- **Container responsivo** (maxWidth: sm para login, md para unauthorized)
- **Iconos Material-UI** para mejor UX
- **Colores del tema** configurado

---

## 🔑 Autenticación

### Estado Global
Las páginas se integran con `AuthContext`:

```tsx
const { isAuthenticated, user, role, login, logout } = useAuth();
```

### Tokens
- **Access Token:** JWT de corta duración (guardado en localStorage)
- **Refresh Token:** Token de larga duración para renovar access token

### Flujo de Refresh
El refresh se maneja automáticamente en `src/api/client.ts`:
1. Request con token expirado → 401
2. Interceptor detecta 401
3. Intenta refresh automático
4. Si falla → logout y redirect a /login

---

## 📝 Validación del Formulario

### Schema de Validación
```tsx
const loginSchema = yup.object({
  username: yup
    .string()
    .required('El correo electrónico es requerido')
    .email('Ingresa un correo electrónico válido')
    .trim()
    .lowercase(),
  password: yup
    .string()
    .required('La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});
```

---

## 🚀 Próximos Pasos

- [ ] Agregar página de "Recuperar contraseña"
- [ ] Agregar página de "Registro de usuario"
- [ ] Implementar "Remember me" en LoginForm
- [ ] Agregar autenticación con Google/Microsoft
- [ ] Implementar 2FA (Two-Factor Authentication)

---

## 📚 Ver también

- `/src/components/auth/` - Componentes de autenticación (LoginForm)
- `/src/contexts/AuthContext.tsx` - Context de autenticación
- `/src/hooks/useAuth.ts` - Hook de autenticación
- `/src/api/endpoints/auth.ts` - Endpoints de auth
- `/src/utils/tokenUtils.ts` - Utilidades de JWT
