# 🛠️ Utilities

Funciones de utilidad puras y helpers reutilizables.

## 📁 Archivos

### `constants.ts`
Constantes globales de la aplicación:
```tsx
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const USER_ROLES = { ... };
export const ADVISORY_STATUS = { ... };
export const ROUTES = { ... };
```

### `tokenUtils.ts`
Utilidades para manejo de JWT:
- `getAuthToken()` - Obtener token de cookie
- `setAuthToken(token)` - Guardar token
- `removeAuthTokens()` - Limpiar tokens
- `getUserFromToken(token)` - Decodificar JWT
- `isTokenExpired(token)` - Verificar expiración
- `refreshAuthToken()` - Refrescar token

### `availabilityTime.ts`
Helpers para normalizar tiempos de disponibilidad:
- `normalizeAvailabilityTime(value)` - Convierte `HH:mm:ss` a `HH:mm`
- `formatAvailabilityTimeRange(start, end)` - Construye rangos legibles para UI
- `toDateInputValue(value)` - Convierte ISO a `YYYY-MM-DD`

### `dateUtils.ts`
Utilidades para manejo de fechas con date-fns:
- `formatDate(date, format)` - Formatear fecha
- `formatDateTime(date)` - Formato fecha y hora
- `formatTime(date)` - Solo hora
- `isBusinessDay(date)` - Verificar día hábil
- `addBusinessDays(date, days)` - Sumar días hábiles
- `getWeekRange(date)` - Obtener inicio/fin de semana
- `isDateInFuture(date)` - Validar fecha futura

### `formatters.ts`
Formateadores de datos:
- `formatUserName(user)` - Nombre completo
- `formatCurrency(amount)` - Formato monetario
- `formatPhoneNumber(phone)` - Formato teléfono
- `truncateText(text, length)` - Truncar texto
- `capitalizeFirst(str)` - Capitalizar primera letra

### `validators.ts`
Schemas de validación con Yup:
- `loginSchema` - Validación de login
- `advisoryRequestSchema` - Validación de solicitud
- `userCreateSchema` - Validación de creación de usuario
- `emailSchema` - Validación de email

### `apiHelpers.ts`
Helpers para manejo de API:
- `handleApiError(error)` - Traducir errores HTTP
- `buildQueryString(params)` - Construir query params
- `parseApiResponse(response)` - Parsear respuesta

### `permissions.ts`
Helpers para verificación de permisos:
- `canAccessRoute(user, route)` - Verificar acceso a ruta
- `hasPermission(user, permission)` - Verificar permiso específico
- `isAdmin(user)` - Verificar si es admin
- `isProfessor(user)` - Verificar si es profesor
- `isStudent(user)` - Verificar si es estudiante

## 💡 Principios

- **Funciones puras:** Sin side effects cuando sea posible
- **Type-safe:** Todos los parámetros y retornos tipados
- **Documentadas:** JSDoc para funciones complejas
- **Testeables:** Fáciles de testear unitariamente
