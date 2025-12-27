# Dashboard API - Guía para Frontend (React + TypeScript)

Esta guía documenta los endpoints de dashboard para profesores y estudiantes, diseñados para mostrar métricas y estadísticas personalizadas según el rol del usuario.

## 📋 Tabla de Contenidos

- [Información General](#información-general)
- [Autenticación](#autenticación)
- [Endpoints Disponibles](#endpoints-disponibles)
  - [Dashboard de Profesor](#dashboard-de-profesor)
  - [Dashboard de Estudiante](#dashboard-de-estudiante)
- [TypeScript Types](#typescript-types)
- [Ejemplos de Implementación en React](#ejemplos-de-implementación-en-react)
- [Manejo de Errores](#manejo-de-errores)
- [Casos de Uso Completos](#casos-de-uso-completos)

---

## 🔍 Información General

### Propósito de los Dashboards

Los dashboards proporcionan una vista personalizada para cada tipo de usuario:

- **Profesor**: Métricas sobre sus asesorías, estudiantes atendidos, y estadísticas de rendimiento
- **Estudiante**: Información sobre asesorías activas, asistencia, y profesores disponibles

### Diferencia entre `/auth/profile` y `/dashboard/stats`

| Aspecto | `/auth/profile` | `/users/{role}/dashboard/stats` |
|---------|----------------|--------------------------------|
| **Propósito** | Datos del perfil del usuario | Métricas y estadísticas |
| **Contenido** | Info personal, configuración | KPIs, números, resúmenes |
| **Uso** | Navbar, settings, perfil | Página principal/dashboard |
| **Frecuencia de actualización** | Una vez al cargar la app | Frecuentemente |

---

## 🔐 Autenticación

Todos los endpoints de dashboard requieren:

1. **Token JWT** en el header `Authorization`
2. **Rol correcto** del usuario (verificado por guards)

```typescript
const config = {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
};
```

⚠️ **Importante**: El usuario autenticado se extrae automáticamente del token JWT. No se requiere pasar el `user_id` en la URL.

---

## 📡 Endpoints Disponibles

### Dashboard de Profesor

#### `GET /users/professor/dashboard/stats`

Obtiene estadísticas completas del profesor autenticado.

**Autenticación**: Requerida (Bearer Token)  
**Rol requerido**: `PROFESSOR`  
**URL completa**: `http://localhost:3000/users/professor/dashboard/stats`

#### Respuesta Exitosa (200 OK)

```json
{
  "overview": {
    "total_active_advisories": 12,
    "pending_requests": 5,
    "students_helped_this_month": 45,
    "upcoming_sessions": 8
  },
  "recent_activity": {
    "last_advisories": [
      {
        "advisory_id": 1,
        "title": "Introducción a Derivadas",
        "subject_name": "Cálculo Diferencial",
        "next_session_date": "2025-11-25T10:00:00Z",
        "enrolled_students": 15,
        "completed_sessions": 5
      }
    ],
    "next_availability_slot": null
  },
  "statistics": {
    "total_subjects": 8,
    "total_hours_this_semester": 120.5,
    "average_rating": 4.7,
    "completion_rate": 92.5,
    "total_students_helped": 156
  }
}
```

#### Códigos de Respuesta

| Código | Descripción |
|--------|-------------|
| `200` | Dashboard obtenido exitosamente |
| `401` | No autenticado o token inválido |
| `403` | Usuario no tiene rol de profesor |
| `404` | Profesor no encontrado |

---

### Dashboard de Estudiante

#### `GET /users/student/dashboard/stats`

Obtiene estadísticas completas del estudiante autenticado.

**Autenticación**: Requerida (Bearer Token)  
**Rol requerido**: `STUDENT`  
**URL completa**: `http://localhost:3000/users/student/dashboard/stats`

#### Respuesta Exitosa (200 OK)

```json
{
  "overview": {
    "active_advisories": 3,
    "completed_advisories": 8,
    "pending_requests": 2,
    "next_advisory": {
      "advisory_id": 1,
      "title": "Repaso de Límites",
      "subject_name": "Cálculo Diferencial",
      "professor_name": "Dr. Juan Pérez",
      "next_session_date": "2025-11-25T10:00:00Z",
      "venue": "Edificio 5M - Sala 202"
    }
  },
  "recent_activity": {
    "recent_advisories": [
      {
        "advisory_id": 1,
        "title": "Repaso de Límites",
        "subject_name": "Cálculo Diferencial",
        "professor_name": "Dr. Juan Pérez",
        "last_attended_date": "2025-11-20T10:00:00Z",
        "sessions_attended": 5,
        "total_sessions": 6,
        "attendance_percentage": 83.33
      }
    ],
    "available_professors": [
      {
        "user_id": 1,
        "name": "Juan",
        "last_name": "Pérez García",
        "photo_url": "https://example.com/photo.jpg",
        "subject": "Cálculo Diferencial",
        "available_advisories": 2
      }
    ]
  },
  "statistics": {
    "total_advisories_attended": 15,
    "subjects_covered": [
      "Cálculo Diferencial",
      "Álgebra Lineal",
      "Física I"
    ],
    "total_hours_received": 32.5,
    "average_attendance_rate": 88.5
  }
}
```

#### Códigos de Respuesta

| Código | Descripción |
|--------|-------------|
| `200` | Dashboard obtenido exitosamente |
| `401` | No autenticado o token inválido |
| `403` | Usuario no tiene rol de estudiante |
| `404` | Estudiante no encontrado |

---

## 📝 TypeScript Types

### Types para Profesor

```typescript
// ============================================
// PROFESOR DASHBOARD TYPES
// ============================================

interface ProfessorOverview {
  total_active_advisories: number;
  pending_requests: number;
  students_helped_this_month: number;
  upcoming_sessions: number;
}

interface ProfessorAdvisory {
  advisory_id: number;
  title: string;
  subject_name: string;
  next_session_date: string | null;
  enrolled_students: number;
  completed_sessions: number;
}

interface ProfessorAvailabilitySlot {
  availability_id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  venue_type: string;
  venue_name: string;
}

interface ProfessorRecentActivity {
  last_advisories: ProfessorAdvisory[];
  next_availability_slot: ProfessorAvailabilitySlot | null;
}

interface ProfessorStatistics {
  total_subjects: number;
  total_hours_this_semester: number;
  average_rating: number;
  completion_rate: number;
  total_students_helped: number;
}

export interface ProfessorDashboardStats {
  overview: ProfessorOverview;
  recent_activity: ProfessorRecentActivity;
  statistics: ProfessorStatistics;
}
```

### Types para Estudiante

```typescript
// ============================================
// ESTUDIANTE DASHBOARD TYPES
// ============================================

interface NextAdvisory {
  advisory_id: number;
  title: string;
  subject_name: string;
  professor_name: string;
  next_session_date: string;
  venue: string;
}

interface StudentOverview {
  active_advisories: number;
  completed_advisories: number;
  pending_requests: number;
  next_advisory: NextAdvisory | null;
}

interface StudentAdvisory {
  advisory_id: number;
  title: string;
  subject_name: string;
  professor_name: string;
  last_attended_date: string | null;
  sessions_attended: number;
  total_sessions: number;
  attendance_percentage: number;
}

interface AvailableProfessor {
  user_id: number;
  name: string;
  last_name: string;
  photo_url: string | null;
  subject: string;
  available_advisories: number;
}

interface StudentRecentActivity {
  recent_advisories: StudentAdvisory[];
  available_professors: AvailableProfessor[];
}

interface StudentStatistics {
  total_advisories_attended: number;
  subjects_covered: string[];
  total_hours_received: number;
  average_attendance_rate: number;
}

export interface StudentDashboardStats {
  overview: StudentOverview;
  recent_activity: StudentRecentActivity;
  statistics: StudentStatistics;
}
```

---

## 🛠️ Ejemplos de Implementación en React

### 1. Servicio API (dashboardService.ts)

```typescript
import axios from 'axios';
import type { 
  ProfessorDashboardStats, 
  StudentDashboardStats 
} from './types/dashboard.types';

const API_BASE_URL = 'http://localhost:3000';

class DashboardService {
  /**
   * Obtiene el dashboard del profesor autenticado
   */
  async getProfessorDashboard(
    accessToken: string
  ): Promise<ProfessorDashboardStats> {
    const response = await axios.get<ProfessorDashboardStats>(
      `${API_BASE_URL}/users/professor/dashboard/stats`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Obtiene el dashboard del estudiante autenticado
   */
  async getStudentDashboard(
    accessToken: string
  ): Promise<StudentDashboardStats> {
    const response = await axios.get<StudentDashboardStats>(
      `${API_BASE_URL}/users/student/dashboard/stats`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }
}

export const dashboardService = new DashboardService();
```

---

### 2. Hook Personalizado para Profesor (useProfessorDashboard.ts)

```typescript
import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import type { ProfessorDashboardStats } from '../types/dashboard.types';

interface UseProfessorDashboardResult {
  data: ProfessorDashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useProfessorDashboard = (
  accessToken: string | null
): UseProfessorDashboardResult => {
  const [data, setData] = useState<ProfessorDashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    if (!accessToken) {
      setError('No hay token de autenticación');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dashboardData = await dashboardService.getProfessorDashboard(
        accessToken
      );
      setData(dashboardData);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('No tienes permisos para ver este dashboard');
      } else if (err.response?.status === 401) {
        setError('Token inválido o expirado');
      } else if (err.response?.status === 404) {
        setError('Profesor no encontrado');
      } else {
        setError('Error al cargar el dashboard');
      }
      console.error('Error fetching professor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [accessToken]);

  return { data, loading, error, refetch: fetchDashboard };
};
```

---

### 3. Hook Personalizado para Estudiante (useStudentDashboard.ts)

```typescript
import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import type { StudentDashboardStats } from '../types/dashboard.types';

interface UseStudentDashboardResult {
  data: StudentDashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useStudentDashboard = (
  accessToken: string | null
): UseStudentDashboardResult => {
  const [data, setData] = useState<StudentDashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    if (!accessToken) {
      setError('No hay token de autenticación');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dashboardData = await dashboardService.getStudentDashboard(
        accessToken
      );
      setData(dashboardData);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('No tienes permisos para ver este dashboard');
      } else if (err.response?.status === 401) {
        setError('Token inválido o expirado');
      } else if (err.response?.status === 404) {
        setError('Estudiante no encontrado');
      } else {
        setError('Error al cargar el dashboard');
      }
      console.error('Error fetching student dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [accessToken]);

  return { data, loading, error, refetch: fetchDashboard };
};
```

---

### 4. Componente Dashboard de Profesor (ProfessorDashboard.tsx)

```typescript
import React from 'react';
import { useProfessorDashboard } from '../hooks/useProfessorDashboard';
import { useAuth } from '../contexts/AuthContext'; // Tu contexto de autenticación

export const ProfessorDashboard: React.FC = () => {
  const { accessToken } = useAuth();
  const { data, loading, error, refetch } = useProfessorDashboard(accessToken);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner">Cargando dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <h2 className="text-lg font-semibold mb-2">Error</h2>
        <p>{error}</p>
        <button 
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!data) {
    return <div>No hay datos disponibles</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard de Profesor</h1>
        <button 
          onClick={refetch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Actualizar
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Asesorías Activas"
          value={data.overview.total_active_advisories}
          icon="📚"
        />
        <StatCard
          title="Solicitudes Pendientes"
          value={data.overview.pending_requests}
          icon="⏳"
        />
        <StatCard
          title="Estudiantes Este Mes"
          value={data.overview.students_helped_this_month}
          icon="👥"
        />
        <StatCard
          title="Sesiones Próximas"
          value={data.overview.upcoming_sessions}
          icon="📅"
        />
      </div>

      {/* Recent Advisories */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Asesorías Recientes</h2>
        {data.recent_activity.last_advisories.length === 0 ? (
          <p className="text-gray-500">No hay asesorías recientes</p>
        ) : (
          <div className="space-y-3">
            {data.recent_activity.last_advisories.map((advisory) => (
              <div
                key={advisory.advisory_id}
                className="border border-gray-200 rounded p-4 hover:bg-gray-50"
              >
                <h3 className="font-semibold text-lg">{advisory.title}</h3>
                <p className="text-gray-600">{advisory.subject_name}</p>
                <div className="mt-2 flex gap-4 text-sm text-gray-500">
                  <span>👥 {advisory.enrolled_students} estudiantes</span>
                  <span>✅ {advisory.completed_sessions} sesiones completadas</span>
                  {advisory.next_session_date && (
                    <span>
                      📅 Próxima:{' '}
                      {new Date(advisory.next_session_date).toLocaleDateString('es-MX')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Estadísticas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded">
            <p className="text-sm text-gray-600">Materias Impartidas</p>
            <p className="text-3xl font-bold text-blue-600">
              {data.statistics.total_subjects}
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded">
            <p className="text-sm text-gray-600">Horas Este Semestre</p>
            <p className="text-3xl font-bold text-green-600">
              {data.statistics.total_hours_this_semester}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded">
            <p className="text-sm text-gray-600">Tasa de Finalización</p>
            <p className="text-3xl font-bold text-purple-600">
              {data.statistics.completion_rate.toFixed(1)}%
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded">
            <p className="text-sm text-gray-600">Estudiantes Ayudados</p>
            <p className="text-3xl font-bold text-yellow-600">
              {data.statistics.total_students_helped}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para las tarjetas de estadísticas
interface StatCardProps {
  title: string;
  value: number;
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <span className="text-4xl">{icon}</span>
    </div>
  </div>
);
```

---

### 5. Componente Dashboard de Estudiante (StudentDashboard.tsx)

```typescript
import React from 'react';
import { useStudentDashboard } from '../hooks/useStudentDashboard';
import { useAuth } from '../contexts/AuthContext';

export const StudentDashboard: React.FC = () => {
  const { accessToken } = useAuth();
  const { data, loading, error, refetch } = useStudentDashboard(accessToken);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner">Cargando dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <h2 className="text-lg font-semibold mb-2">Error</h2>
        <p>{error}</p>
        <button 
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!data) {
    return <div>No hay datos disponibles</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mi Dashboard</h1>
        <button 
          onClick={refetch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Actualizar
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Asesorías Activas"
          value={data.overview.active_advisories}
          icon="📖"
          color="blue"
        />
        <StatCard
          title="Asesorías Completadas"
          value={data.overview.completed_advisories}
          icon="✅"
          color="green"
        />
        <StatCard
          title="Solicitudes Pendientes"
          value={data.overview.pending_requests}
          icon="⏳"
          color="yellow"
        />
      </div>

      {/* Next Advisory */}
      {data.overview.next_advisory && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-3">📅 Próxima Asesoría</h2>
          <div className="space-y-2">
            <p className="text-2xl font-bold">{data.overview.next_advisory.title}</p>
            <p className="text-blue-100">
              📚 {data.overview.next_advisory.subject_name}
            </p>
            <p className="text-blue-100">
              👨‍🏫 {data.overview.next_advisory.professor_name}
            </p>
            <p className="text-blue-100">
              📍 {data.overview.next_advisory.venue}
            </p>
            <p className="text-lg font-semibold mt-3">
              🕐{' '}
              {new Date(
                data.overview.next_advisory.next_session_date
              ).toLocaleString('es-MX')}
            </p>
          </div>
        </div>
      )}

      {/* Recent Advisories */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Mis Asesorías</h2>
        {data.recent_activity.recent_advisories.length === 0 ? (
          <p className="text-gray-500">No has asistido a asesorías aún</p>
        ) : (
          <div className="space-y-3">
            {data.recent_activity.recent_advisories.map((advisory) => (
              <div
                key={advisory.advisory_id}
                className="border border-gray-200 rounded p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{advisory.title}</h3>
                    <p className="text-gray-600">{advisory.subject_name}</p>
                    <p className="text-sm text-gray-500">
                      👨‍🏫 {advisory.professor_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {advisory.attendance_percentage.toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500">Asistencia</div>
                  </div>
                </div>
                <div className="mt-3 flex gap-4 text-sm text-gray-600">
                  <span>
                    ✅ {advisory.sessions_attended} de {advisory.total_sessions}{' '}
                    sesiones
                  </span>
                  {advisory.last_attended_date && (
                    <span>
                      📅 Última:{' '}
                      {new Date(advisory.last_attended_date).toLocaleDateString(
                        'es-MX'
                      )}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Professors */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Profesores Disponibles</h2>
        {data.recent_activity.available_professors.length === 0 ? (
          <p className="text-gray-500">No hay profesores disponibles</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.recent_activity.available_professors.map((professor) => (
              <div
                key={professor.user_id}
                className="border border-gray-200 rounded p-4 hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 mb-2">
                  {professor.photo_url ? (
                    <img
                      src={professor.photo_url}
                      alt={`${professor.name} ${professor.last_name}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xl">👨‍🏫</span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">
                      {professor.name} {professor.last_name}
                    </p>
                    <p className="text-sm text-gray-600">{professor.subject}</p>
                  </div>
                </div>
                <p className="text-sm text-blue-600">
                  {professor.available_advisories} asesorías disponibles
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Mis Estadísticas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded">
            <p className="text-sm text-gray-600">Total Asesorías</p>
            <p className="text-3xl font-bold text-blue-600">
              {data.statistics.total_advisories_attended}
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded">
            <p className="text-sm text-gray-600">Horas Recibidas</p>
            <p className="text-3xl font-bold text-green-600">
              {data.statistics.total_hours_received}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded">
            <p className="text-sm text-gray-600">Asistencia Promedio</p>
            <p className="text-3xl font-bold text-purple-600">
              {data.statistics.average_attendance_rate.toFixed(1)}%
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded">
            <p className="text-sm text-gray-600">Materias Cursadas</p>
            <p className="text-3xl font-bold text-yellow-600">
              {data.statistics.subjects_covered.length}
            </p>
          </div>
        </div>

        {/* Subjects Covered */}
        {data.statistics.subjects_covered.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Materias Cubiertas:
            </p>
            <div className="flex flex-wrap gap-2">
              {data.statistics.subjects_covered.map((subject, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente auxiliar
interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  color: 'blue' | 'green' | 'yellow' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className={`rounded-lg shadow p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm mb-1 opacity-80">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );
};
```

---

## 🚨 Manejo de Errores

### Errores Comunes y Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| `401 Unauthorized` | Token inválido o expirado | Refrescar el token o redirigir al login |
| `403 Forbidden` | Usuario no tiene el rol correcto | Verificar el rol del usuario antes de llamar al endpoint |
| `404 Not Found` | Usuario no encontrado en la base de datos | Verificar que el usuario existe |
| `500 Internal Server Error` | Error en el servidor | Revisar logs del backend |

### Ejemplo de Manejo Robusto de Errores

```typescript
try {
  const data = await dashboardService.getProfessorDashboard(accessToken);
  setDashboardData(data);
} catch (error: any) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    
    switch (status) {
      case 401:
        // Token expirado - refrescar o logout
        await refreshToken();
        break;
      case 403:
        // Permisos insuficientes
        navigate('/unauthorized');
        break;
      case 404:
        // Usuario no encontrado
        setError('Perfil no encontrado');
        break;
      default:
        setError('Error al cargar el dashboard');
    }
  } else {
    setError('Error de red');
  }
}
```

---

## 🎯 Casos de Uso Completos

### Caso 1: Dashboard Principal del Profesor

**Requisitos**:
- Mostrar estadísticas en tiempo real
- Actualización automática cada 5 minutos
- Notificaciones de solicitudes pendientes

```typescript
import { useEffect } from 'react';
import { useProfessorDashboard } from '../hooks/useProfessorDashboard';
import { useAuth } from '../contexts/AuthContext';

const ProfessorHome: React.FC = () => {
  const { accessToken } = useAuth();
  const { data, loading, error, refetch } = useProfessorDashboard(accessToken);

  // Auto-refresh cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [refetch]);

  // Mostrar notificación si hay solicitudes pendientes
  useEffect(() => {
    if (data && data.overview.pending_requests > 0) {
      showNotification(
        `Tienes ${data.overview.pending_requests} solicitudes pendientes`
      );
    }
  }, [data]);

  // ... resto del componente
};
```

### Caso 2: Vista Rápida para Estudiante en Navbar

```typescript
import { useStudentDashboard } from '../hooks/useStudentDashboard';

const QuickStatsWidget: React.FC = () => {
  const { accessToken } = useAuth();
  const { data } = useStudentDashboard(accessToken);

  if (!data) return null;

  return (
    <div className="quick-stats">
      <span className="badge">
        {data.overview.active_advisories} activas
      </span>
      {data.overview.next_advisory && (
        <span className="next-session">
          Próxima: {new Date(data.overview.next_advisory.next_session_date)
            .toLocaleDateString('es-MX')}
        </span>
      )}
    </div>
  );
};
```

### Caso 3: Redirección Basada en Rol

```typescript
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  switch (user.role) {
    case 'PROFESSOR':
      return <ProfessorDashboard />;
    case 'STUDENT':
      return <StudentDashboard />;
    case 'ADMIN':
      return <AdminDashboard />;
    default:
      return <Navigate to="/unauthorized" />;
  }
};
```

---

## 📊 Comparación de Endpoints

| Característica | Profesor | Estudiante |
|---------------|----------|------------|
| **Endpoint** | `/users/professor/dashboard/stats` | `/users/student/dashboard/stats` |
| **Rol requerido** | `PROFESSOR` | `STUDENT` |
| **Asesorías activas** | ✅ Total de sus asesorías | ✅ En las que está inscrito |
| **Solicitudes pendientes** | ✅ De sus materias | ✅ Las que ha enviado |
| **Estudiantes/Profesores** | ✅ Ayudados este mes | ✅ Disponibles |
| **Métricas de tiempo** | ✅ Horas impartidas | ✅ Horas recibidas |
| **Rating** | ✅ Calificación promedio | ❌ N/A |
| **Próxima sesión** | ❌ Ver calendario | ✅ Próxima asesoría |
| **Asistencia** | ❌ N/A | ✅ Porcentaje promedio |

---

## 📚 Recursos Adicionales

### Documentación Relacionada
- [Venues API Guide](./VENUES_API_GUIDE.md)
- [User Profile API Guide](./USER_PROFILE_API_GUIDE.md)
- [Backend API Reference](./frontend-integration/backend-api-reference.md)

### Mejores Prácticas

1. **Caché de Datos**: Considera usar React Query o SWR para cachear las respuestas
2. **Loading States**: Siempre muestra estados de carga para mejor UX
3. **Error Boundaries**: Implementa error boundaries para capturar errores en componentes
4. **Auto-refresh**: Implementa actualización automática para dashboards en tiempo real
5. **Optimistic Updates**: Muestra cambios inmediatamente antes de confirmar con el servidor

### Ejemplo con React Query

```typescript
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

export const useProfessorDashboardQuery = (accessToken: string) => {
  return useQuery({
    queryKey: ['professorDashboard'],
    queryFn: () => dashboardService.getProfessorDashboard(accessToken),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 5 * 60 * 1000, // Auto-refresh cada 5 minutos
    enabled: !!accessToken,
  });
};
```

---

## ✅ Checklist de Implementación

- [ ] Instalar dependencias necesarias (`axios`, `react-router-dom`)
- [ ] Crear tipos TypeScript para las respuestas
- [ ] Implementar servicio API con manejo de errores
- [ ] Crear hooks personalizados para cada rol
- [ ] Implementar componentes de dashboard
- [ ] Agregar estados de carga y error
- [ ] Implementar auto-refresh (opcional)
- [ ] Agregar tests unitarios
- [ ] Probar con diferentes roles de usuario
- [ ] Validar manejo de errores (401, 403, 404)

---

## 🎨 Notas de Diseño

### Colores Sugeridos

- **Profesor**: Azul (`#3B82F6`) - Autoridad y confianza
- **Estudiante**: Verde (`#10B981`) - Crecimiento y aprendizaje
- **Alertas**: Amarillo (`#F59E0B`) - Atención
- **Éxito**: Verde oscuro (`#059669`) - Logro
- **Error**: Rojo (`#EF4444`) - Problemas

### Iconos Recomendados

- Asesorías: 📚 📖
- Estudiantes: 👥 👨‍🎓
- Profesores: 👨‍🏫 👩‍🏫
- Calendario: 📅 🗓️
- Completado: ✅ ✓
- Pendiente: ⏳ ⌛
- Estadísticas: 📊 📈

---

**Última actualización**: Noviembre 23, 2025  
**Versión del API**: 1.0.0  
**Autor**: GitHub Copilot
