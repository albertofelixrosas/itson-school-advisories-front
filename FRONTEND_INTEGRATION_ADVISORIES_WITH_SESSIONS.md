# ✅ Nuevo Endpoint Implementado: Advisories con Sesiones

## 🎯 Solución al Problema de ManageSessionsPage

Se ha implementado un **nuevo endpoint** que resuelve el problema de que `/advisories/professor/:id` no incluía las sesiones (advisory_dates).

---

## 📡 Nuevo Endpoint

### `GET /advisories/professor/:professorId/with-sessions`

**Ruta completa**: `http://localhost:3000/advisories/professor/:professorId/with-sessions`

**Roles permitidos**: `ADMIN`, `PROFESSOR`

**Descripción**: Obtiene advisories CON advisory_dates (sesiones) incluidas, ideal para la página de gestión de sesiones.

---

## 🔄 Cambio Necesario en Frontend

### Antes (endpoint sin sesiones):
```typescript
// ❌ Este endpoint NO incluye advisory_dates
GET /advisories/professor/5
```

### Ahora (endpoint con sesiones):
```typescript
// ✅ Este endpoint SÍ incluye advisory_dates
GET /advisories/professor/5/with-sessions
```

---

## 📦 Respuesta del Nuevo Endpoint

```json
[
  {
    "advisory_id": 123,
    "max_students": 10,
    "professor": {
      "user_id": 5,
      "school_id": "2021030005",
      "name": "María",
      "last_name": "López Sánchez",
      "email": "maria.lopez@itson.edu.mx",
      "photo_url": null
    },
    "subject_detail": {
      "subject_detail_id": 42,
      "subject_name": "Álgebra Lineal",
      "schedules": [
        {
          "day": "TUESDAY",
          "start_time": "09:00",
          "end_time": "11:00"
        }
      ]
    },
    "schedules": [
      {
        "advisory_schedule_id": 401,
        "day": "TUESDAY",
        "begin_time": "11:00",
        "end_time": "12:00"
      }
    ],
    "advisory_dates": [  // ← NUEVO: Array de sesiones
      {
        "advisory_date_id": 75,
        "topic": "Matrices y Determinantes",
        "date": "2025-11-25T11:00:00.000Z",
        "notes": "Traer calculadora",
        "session_link": "https://meet.google.com/abc-defg",
        "completed_at": null,
        "created_at": "2025-11-20T10:00:00.000Z",
        "updated_at": "2025-11-20T10:00:00.000Z",
        "venue": {  // ← NUEVO: Venue completo
          "venue_id": 5,
          "name": "Aula 302",
          "building": "Edificio 5M",
          "floor": "Planta 3",
          "type": "classroom",
          "url": null
        },
        "attendances_count": 8,  // ← NUEVO: Total registrados
        "attended_count": 6       // ← NUEVO: Total que asistieron
      },
      {
        "advisory_date_id": 76,
        "topic": "Espacios Vectoriales",
        "date": "2025-12-02T11:00:00.000Z",
        "notes": null,
        "session_link": null,
        "completed_at": null,
        "created_at": "2025-11-22T14:00:00.000Z",
        "updated_at": "2025-11-22T14:00:00.000Z",
        "venue": {
          "venue_id": 8,
          "name": "Google Meet - Álgebra",
          "building": null,
          "floor": null,
          "type": "virtual",
          "url": "https://meet.google.com/xyz-uvw"
        },
        "attendances_count": 0,
        "attended_count": 0
      }
    ]
  }
]
```

---

## 💻 Código para Frontend

### 1. Actualizar `advisories.ts` (API Endpoint)

```typescript
// src/api/endpoints/advisories.ts

/**
 * Obtener advisories CON sesiones incluidas
 * ⚠️ IMPORTANTE: Usar este endpoint para ManageSessionsPage
 */
export const getAdvisoriesWithSessions = async (professorId: number) => {
  return apiClient.get<AdvisoryWithSessions[]>(
    `/advisories/professor/${professorId}/with-sessions`
  );
};

/**
 * Obtener "mis advisories" CON sesiones (del profesor autenticado)
 */
export const getMyAdvisoriesWithSessions = async (myUserId: number) => {
  return getAdvisoriesWithSessions(myUserId);
};
```

### 2. Agregar Tipos TypeScript

```typescript
// src/types/backend.ts o src/types/advisories.ts

export interface AdvisoryDateInfo {
  advisory_date_id: number;
  topic: string;
  date: string;
  notes: string | null;
  session_link: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  venue: {
    venue_id: number;
    name: string;
    building: string | null;
    floor: string | null;
    type: string;
    url: string | null;
  } | null;
  attendances_count: number;
  attended_count: number;
}

export interface AdvisoryWithSessions extends AdvisoryResponse {
  advisory_dates: AdvisoryDateInfo[];
}
```

### 3. Actualizar `ManageSessionsPage.tsx`

```typescript
import { useQuery } from '@tanstack/react-query';
import { getMyAdvisoriesWithSessions } from '../api/endpoints/advisories';
import { useAuth } from '../contexts/AuthContext';

const ManageSessionsPage = () => {
  const { user } = useAuth();

  const { data: advisories, isLoading, error } = useQuery({
    queryKey: ['advisories', 'with-sessions', user?.user_id],
    queryFn: () => getMyAdvisoriesWithSessions(user!.user_id),
    enabled: !!user?.user_id,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  // Ahora advisories tiene advisory_dates 🎉
  const allSessions = advisories?.flatMap(a => a.advisory_dates) || [];
  
  return (
    <div>
      <h1>Gestión de Sesiones</h1>
      <p>Total de sesiones: {allSessions.length}</p>
      
      {advisories?.map((advisory) => (
        <div key={advisory.advisory_id}>
          <h2>{advisory.subject_detail.subject_name}</h2>
          
          {/* Ahora puedes acceder a las sesiones */}
          {advisory.advisory_dates.map((session) => (
            <div key={session.advisory_date_id}>
              <h3>{session.topic}</h3>
              <p>📅 {new Date(session.date).toLocaleDateString()}</p>
              <p>📍 {session.venue?.name}</p>
              <p>👥 {session.attended_count}/{session.attendances_count} asistieron</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
```

---

## 🔍 Comparación de Endpoints

| Característica | `/professor/:id` | `/professor/:id/with-sessions` |
|----------------|------------------|--------------------------------|
| **advisory_dates** | ❌ No incluido | ✅ Array completo |
| **Venue info** | ❌ No | ✅ Sí (por sesión) |
| **attendances_count** | ❌ No | ✅ Sí |
| **attended_count** | ❌ No | ✅ Sí |
| **Performance** | ⚡ Más rápido | ⚠️ Más lento (más data) |
| **Uso recomendado** | Listados simples | Gestión de sesiones |

---

## ✅ Checklist de Implementación

- [ ] Agregar tipos `AdvisoryDateInfo` y `AdvisoryWithSessions`
- [ ] Crear funciones `getAdvisoriesWithSessions()` y `getMyAdvisoriesWithSessions()`
- [ ] Actualizar `ManageSessionsPage.tsx` para usar el nuevo endpoint
- [ ] Actualizar query key en React Query
- [ ] Probar que las sesiones se muestren correctamente
- [ ] Verificar que `advisory_dates` no sea undefined

---

## 🚀 Testing

```bash
# Probar endpoint directamente
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/advisories/professor/5/with-sessions
```

---

## 📚 Documentación Completa

Ver `ADVISORIES_API_GUIDE.md` para:
- Todos los tipos TypeScript
- Hooks personalizados listos para usar
- Componentes completos de ejemplo
- Casos de uso detallados
- Manejo de errores

---

**Última actualización**: Noviembre 23, 2025  
**Estado**: ✅ Implementado y testeado  
**Versión del API**: 1.0.0
