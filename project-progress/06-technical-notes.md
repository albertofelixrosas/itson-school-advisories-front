# 📝 Notas Técnicas y Decisiones de Arquitectura

**Proyecto:** School Advisories Frontend  
**Última actualización:** 10 de Noviembre, 2025

---

## 🏗️ Decisiones de Arquitectura

### Stack Principal
**Decisión:** React 19 + TypeScript + Vite  
**Razón:** 
- React 19 es la versión más reciente y estable
- TypeScript proporciona type safety crítico para el proyecto
- Vite ofrece desarrollo más rápido que Create React App
- Excelente soporte de HMR (Hot Module Replacement)

**Impacto:** Build times más rápidos, mejor DX (Developer Experience)

---

### UI Framework: Material-UI
**Decisión:** Material-UI v7 (MUI) como framework principal  
**Razón:**
- ✅ Componentes de date/time pickers nativos (**crítico** para scheduling)
- ✅ Data Grid avanzado para tablas de admin
- ✅ Sistema de theming robusto
- ✅ Accesibilidad integrada (a11y)
- ✅ TypeScript first-class support
- ✅ Documentación excelente

**Alternativas consideradas:**
- ❌ Ant Design - Menos soporte para date pickers avanzados
- ❌ Chakra UI - Requiere más configuración para data grids
- ❌ TailwindCSS - Requeriría más componentes custom

**Impacto:** Desarrollo más rápido de UI, menos componentes custom necesarios

---

### State Management: React Query + Zustand
**Decisión:** Combinación de TanStack React Query + Zustand  
**Razón:**
- **React Query:** Perfecto para server state (cache, invalidación, refetch)
- **Zustand:** Ligero y simple para client state (UI state, preferencias)
- Evita boilerplate de Redux
- Type-safe
- DevTools excelentes

**Uso:**
- React Query → Datos del backend (users, advisories, requests)
- Zustand → UI state (sidebar open/close, theme mode, filters)

**Impacto:** Código más limpio, mejor cache management, menos re-renders innecesarios

---

### Forms: React Hook Form + Yup
**Decisión:** React Hook Form para formularios + Yup para validación  
**Razón:**
- React Hook Form es el más performante (uncontrolled inputs)
- Yup proporciona schemas de validación reutilizables
- Integración perfecta con MUI components
- Menor cantidad de re-renders

**Alternativas:**
- ❌ Formik - Más pesado y menos performante
- ❌ Formularios nativos - Demasiado boilerplate

**Impacto:** Formularios más rápidos y fáciles de mantener

---

### Date Management: date-fns
**Decisión:** date-fns como librería principal de fechas  
**Razón:**
- ✅ Tree-shakable (solo importas lo que usas)
- ✅ TypeScript nativo
- ✅ Funciones puras (immutable)
- ✅ Integración directa con MUI Date Pickers
- ✅ Soporte completo de i18n (español)

**Alternativas:**
- ❌ Moment.js - Deprecated, no tree-shakable
- ❌ Day.js - Menos funciones que date-fns
- ❌ Luxon - API más compleja

**Impacto:** Bundle size menor, mejor performance en operaciones de fechas

---

## 🔐 Autenticación y Seguridad

### JWT Token Strategy
**Decisión:** Access token + Refresh token con cookies  
**Implementación:**
```
- Access Token: Corta duración (~15 min)
- Refresh Token: Larga duración (~7 días)
- Storage: js-cookie (httpOnly cookies cuando sea posible)
- Auto-refresh: Interceptor en Axios
```

**Seguridad:**
- ✅ Tokens nunca en localStorage (vulnerable a XSS)
- ✅ Refresh automático antes de expiración
- ✅ Logout limpia todos los tokens
- ✅ Verificación de rol en cada route protegida

---

### Protected Routes Strategy
**Decisión:** HOC ProtectedRoute con verificación de roles  
**Niveles de protección:**
1. **Public routes:** Login, register (si aplica)
2. **Authenticated routes:** Cualquier usuario autenticado
3. **Role-based routes:** Solo roles específicos (STUDENT, PROFESSOR, ADMIN)

**Ejemplo:**
```tsx
<ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
  <StudentDashboard />
</ProtectedRoute>
```

---

## 📁 Estructura de Archivos

### Organización por Feature + Tipo
**Decisión:** Híbrido entre feature-first y type-first  
**Razón:**
- Carpetas principales por tipo (components, pages, hooks)
- Sub-carpetas por feature o rol (student, professor, admin)
- Fácil de escalar
- Fácil de encontrar código

**Estructura:**
```
src/
├── api/           # API layer (types, client, endpoints)
├── components/    # Por rol: common, student, professor, admin
├── pages/         # Por rol: auth, student, professor, admin
├── hooks/         # Custom hooks genéricos
├── store/         # Zustand stores
├── contexts/      # React contexts
├── utils/         # Utilidades puras
└── theme/         # MUI theme config
```

---

## 🎨 Theming y Estilos

### Material-UI Theme Customization
**Decisión:** Theme customizado con colores corporativos  
**Configuración:**
- Primary color: #1976d2 (azul)
- Secondary color: #dc004e (rojo)
- Font family: System fonts stack
- Border radius: 8px
- Shadows: Personalizados y reducidos

**Locale:** Español (es) para date pickers y componentes

---

## 🔄 API Communication

### Axios Configuration
**Decisión:** Cliente Axios centralizado con interceptors  
**Features:**
- Base URL desde env variable
- Timeout: 10 segundos
- Request interceptor: Agrega JWT automáticamente
- Response interceptor: Maneja refresh token
- Error handling global: Traduce errores HTTP a mensajes user-friendly

**Error Handling Strategy:**
- 400 → Mostrar errores de validación específicos
- 401 → Redirect a login automático
- 403 → Mostrar mensaje "Sin permisos"
- 404 → Mostrar página 404
- 500 → Mostrar error genérico + retry option

---

## 📊 Data Fetching Patterns

### React Query Configuration
**Cache Strategy:**
```typescript
{
  staleTime: 5 minutes,     // Data es "fresh" por 5 min
  cacheTime: 10 minutes,    // Cache se mantiene 10 min
  retry: 3 times,           // Reintentos en caso de error
  refetchOnWindowFocus: false // No refetch automático al volver a la tab
}
```

**Query Keys Strategy:**
```typescript
// Pattern: [entity, identifier, params]
['advisories', 'list', { status: 'PENDING' }]
['users', userId]
['advisory-requests', 'my-requests']
```

---

## 🚀 Performance Optimizations

### Code Splitting
**Decisión:** Lazy loading de routes principales  
**Implementación:**
```tsx
const StudentDashboard = lazy(() => import('./pages/student/Dashboard'));
const ProfessorDashboard = lazy(() => import('./pages/professor/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
```

**Impacto:** Initial bundle más pequeño, carga bajo demanda

---

### Memoization Strategy
**Decisión:** Usar React.memo y useMemo solo cuando sea necesario  
**Reglas:**
- ✅ Usar en componentes que reciben props complejas
- ✅ Usar en componentes que se re-renderizan frecuentemente
- ❌ No usar prematuramente (optimización prematura)

---

## 🧪 Testing Strategy (Future)

### Testing Pyramid
**Planeado:**
1. **Unit Tests:** Utilities, hooks, pure functions (Vitest)
2. **Integration Tests:** Components con React Testing Library
3. **E2E Tests:** User flows críticos (Playwright o Cypress)

**Prioridad de testing:**
1. 🔴 Auth flow (login, logout, protected routes)
2. 🟡 Forms (validación, submission)
3. 🟡 Critical user paths (request advisory, approve request)
4. 🟢 UI components

---

## 🌍 Internacionalización (i18n)

### Strategy
**Decisión Actual:** Español hardcoded (no i18n library por ahora)  
**Razón:** El sistema es solo para universidades hispanohablantes

**Future:** Si se requiere multi-idioma, usar `react-i18next`

---

## 📱 Responsive Design

### Breakpoints (MUI defaults)
```
xs: 0px      # Mobile
sm: 600px    # Tablet
md: 900px    # Small laptop
lg: 1200px   # Desktop
xl: 1536px   # Large desktop
```

**Mobile-first approach:** Diseñar para móvil primero, luego desktop

---

## 🐛 Debugging Tools

### Development Tools Enabled
- ✅ React Query DevTools (solo en dev)
- ✅ Vite HMR
- ✅ TypeScript strict mode
- ✅ ESLint warnings
- ✅ Console logs en modo debug

**Production:**
- ❌ DevTools deshabilitados
- ❌ Console logs removidos
- ❌ Debug mode off

---

## 🔧 Environment Variables

### Naming Convention
**Pattern:** `VITE_<CATEGORY>_<NAME>`

**Categorías:**
- API_* → Configuración de API
- JWT_* → Configuración de tokens
- APP_* → Configuración de app
- ENABLE_* → Feature flags
- THEME_* → Configuración de tema

---

## 📦 Bundle Size Targets

**Targets:**
- Initial bundle: < 300KB (gzipped)
- Lazy chunks: < 100KB cada uno
- Total app: < 1MB

**Estrategias:**
- Tree shaking automático (Vite)
- Dynamic imports
- Code splitting por routes
- Lazy loading de componentes pesados

---

## 🔒 Security Best Practices

### Implementadas
- ✅ No almacenar tokens en localStorage
- ✅ HTTPS only en producción
- ✅ Content Security Policy headers
- ✅ XSS protection (React escapes por defecto)
- ✅ Input sanitization en forms

### Por Implementar
- ⏳ Rate limiting en client
- ⏳ CSRF protection
- ⏳ Security headers validation

---

## 📝 Code Style Guidelines

### TypeScript
- ✅ Strict mode enabled
- ✅ Interfaces over types (cuando sea posible)
- ✅ Explicit return types en functions
- ✅ No `any` types (usar `unknown` si es necesario)

### React
- ✅ Functional components only
- ✅ Named exports (no default exports)
- ✅ Props interfaces siempre definidas
- ✅ Hooks at top of component

### Files
- ✅ PascalCase para components
- ✅ camelCase para utilities
- ✅ kebab-case para archivos de config

---

## 🚨 Warnings y Consideraciones

### Node Version Warning
**Warning:** EBADENGINE Unsupported engine (Node v20.18.0 vs required v20.19.0)  
**Impact:** Ninguno - Es una warning menor, todo funciona correctamente  
**Action:** Ignorar por ahora, actualizar Node en futuro si es necesario

---

## 💡 Lecciones Aprendidas

### Durante Setup
1. ✅ Instalar todas las dependencias al inicio evita problemas después
2. ✅ Documentación clara del proyecto es crucial
3. ✅ Sistema de tracking ayuda a no perder el hilo

### Recomendaciones
1. 💡 Siempre crear .env.example para documentar variables
2. 💡 Mantener package.json limpio y organizado
3. 💡 Documentar decisiones técnicas importantes

---

**Próxima nota técnica:** Configuración de Axios interceptors y manejo de errores
