# 🧩 Common Components

Componentes reutilizables compartidos en toda la aplicación.

## 📁 Componentes

### 🔐 `ProtectedRoute.tsx`
Componente para proteger rutas por autenticación y roles.

**Props:**
- `children` - Contenido a proteger
- `allowedRoles?` - Array de roles permitidos

**Uso:**
```tsx
<ProtectedRoute allowedRoles={['admin']}>
  <AdminPanel />
</ProtectedRoute>
```

---

### ⏳ `LoadingSpinner.tsx`
Spinner de carga simple y personalizable.

**Props:**
- `message?` - Mensaje opcional debajo del spinner
- `centered?` - Centrar el spinner (default: false)
- `minHeight?` - Altura mínima cuando está centrado
- `size?` - Tamaño del spinner (default: 40)
- `color?` - Color del spinner (default: 'primary')

**Uso:**
```tsx
<LoadingSpinner />
<LoadingSpinner message="Cargando datos..." centered />
<LoadingSpinner size={60} color="secondary" />
```

---

### 🌑 `LoadingOverlay.tsx`
Overlay de pantalla completa con backdrop para bloquear interacción.

**Props:**
- `open` - Mostrar/ocultar overlay
- `message?` - Mensaje de carga opcional
- `size?` - Tamaño del spinner (default: 60)
- `absolute?` - Usar posición absoluta en lugar de fixed

**Uso:**
```tsx
<LoadingOverlay open={isLoading} />
<LoadingOverlay open={isSaving} message="Guardando cambios..." />
```

**Casos de uso:**
- Operaciones que requieren bloquear la UI
- Guardado de formularios
- Operaciones largas que no permiten interacción

---

### 📄 `PageLoader.tsx`
Loader de página completa para transiciones de rutas.

**Props:**
- `message?` - Mensaje de carga (default: 'Cargando...')
- `showProgress?` - Mostrar barra de progreso lineal
- `showIcon?` - Mostrar ícono de la app (default: true)

**Uso:**
```tsx
<PageLoader />
<PageLoader message="Cargando dashboard..." />
<PageLoader showProgress />
```

**Características:**
- Animación de pulso en el ícono
- Branding de la aplicación
- Ideal para Suspense boundaries

---

### 🚨 `ErrorBoundary.tsx`
Componente de clase para capturar errores de React.

**Props:**
- `children` - Componentes hijos a proteger
- `fallback?` - UI personalizada de error
- `onError?` - Callback cuando ocurre un error

**Uso:**
```tsx
// Básico
<ErrorBoundary>
  <YourApp />
</ErrorBoundary>

// Con fallback personalizado
<ErrorBoundary
  fallback={(error, errorInfo, reset) => (
    <CustomErrorPage error={error} onReset={reset} />
  )}
  onError={(error, errorInfo) => {
    logToSentry(error, errorInfo);
  }}
>
  <YourApp />
</ErrorBoundary>
```

**Características:**
- Captura errores en render, lifecycle, y constructores
- UI de error amigable por defecto
- Detalles técnicos en modo desarrollo
- Botones de "Intentar de nuevo" y "Ir al inicio"
- Integración preparada con servicios de logging (Sentry, etc.)

---

### 🎨 `Layout.tsx`
Layout principal con AppBar, Sidebar y área de contenido.

**Props:**
- `children` - Contenido de la página
- `title?` - Título opcional para el AppBar
- `showSidebar?` - Mostrar/ocultar sidebar (default: true)

**Uso:**
```tsx
<Layout title="Dashboard">
  <YourPageContent />
</Layout>

<Layout showSidebar={false} title="Login">
  <LoginForm />
</Layout>
```

**Características:**
- **AppBar fijo** con título y menú de usuario
- **Sidebar colapsable** (desktop) y drawer temporal (mobile)
- **Navegación basada en roles** - Items dinámicos según UserRole
- **Responsive** - Drawer en mobile, sidebar permanente en desktop
- **Avatar de usuario** con menú desplegable
- **Rutas activas** - Resaltado del item actual
- **Transiciones suaves** - Animaciones de Material-UI

**Navegación:**
- Dashboard (todos los roles)
- Items específicos por rol (expandible en el futuro)

**Menú de usuario:**
- Mi Perfil
- Cerrar Sesión

---

## 🎯 Uso Combinado

### App con ErrorBoundary
```tsx
// main.tsx
import { ErrorBoundary } from '@/components/common';

root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
```

### Rutas Protegidas con Layout
```tsx
// App.tsx
import { Layout, ProtectedRoute } from '@/components/common';

function StudentDashboard() {
  return (
    <Layout title="Dashboard de Estudiante">
      <ProtectedRoute allowedRoles={['student']}>
        <StudentDashboardContent />
      </ProtectedRoute>
    </Layout>
  );
}
```

### Loading States
```tsx
// En tus páginas
import { LoadingSpinner, LoadingOverlay } from '@/components/common';

function MyPage() {
  const { data, isLoading } = useQuery('key', fetcher);
  const [isSaving, setIsSaving] = useState(false);

  if (isLoading) {
    return <LoadingSpinner centered message="Cargando datos..." />;
  }

  return (
    <>
      <LoadingOverlay open={isSaving} message="Guardando..." />
      <YourContent />
    </>
  );
}
```

### Suspense con PageLoader
```tsx
import { Suspense } from 'react';
import { PageLoader } from '@/components/common';

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <LazyLoadedComponent />
    </Suspense>
  );
}
```

---

## 📐 Arquitectura

```
components/common/
├── ProtectedRoute.tsx    # Auth & role protection
├── LoadingSpinner.tsx    # Inline spinner
├── LoadingOverlay.tsx    # Full-screen backdrop
├── PageLoader.tsx        # Page transition loader
├── ErrorBoundary.tsx     # Error catching
├── Layout.tsx            # Main layout structure
├── index.ts              # Barrel exports
└── README.md             # This file
```

---

## 🎨 Temas y Estilos

Todos los componentes usan:
- **Material-UI components** - Consistencia visual
- **Theme configuration** - Colores y tipografía del tema
- **Responsive design** - Adaptable a mobile/tablet/desktop
- **Accesibilidad** - ARIA labels y navegación por teclado

---

## 🚀 Próximas Mejoras

- [ ] Agregar más items de navegación por rol en Layout
- [ ] Implementar breadcrumbs en Layout
- [ ] Agregar NotFound (404) page component
- [ ] Crear Snackbar/Toast component (alternativa a react-hot-toast)
- [ ] Implementar theme switcher (dark/light mode)
- [ ] Agregar footer en Layout
- [ ] Crear Dialog/Modal reusable component
- [ ] Implementar ConfirmDialog component

---

## 📚 Ver también

- `/src/contexts/AuthContext.tsx` - Context de autenticación
- `/src/theme/` - Configuración del tema
- `/src/pages/` - Páginas que usan estos componentes
