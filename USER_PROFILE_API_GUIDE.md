# 👤 User Profile API - Guía de Implementación Frontend

**Fecha de creación**: 22 de Noviembre, 2025  
**Versión**: 1.0  
**Módulo**: Perfil de Usuario

---

## 📋 Índice

1. [Descripción General](#descripción-general)
2. [Endpoint](#endpoint)
3. [Autenticación](#autenticación)
4. [Tipos de Respuesta por Rol](#tipos-de-respuesta-por-rol)
5. [Tipos TypeScript](#tipos-typescript)
6. [Ejemplos de Implementación React](#ejemplos-de-implementación-react)
7. [Manejo de Errores](#manejo-de-errores)
8. [Casos de Uso](#casos-de-uso)

---

## 📖 Descripción General

El endpoint de **User Profile** permite obtener información completa y personalizada del usuario autenticado según su rol en el sistema:

- 🎓 **Estudiante**: Información académica, estadísticas de asesorías, actividad reciente
- 👨‍🏫 **Profesor**: Materias asignadas, estadísticas de asesorías, disponibilidad
- 👔 **Administrador**: Información administrativa, permisos del sistema

**Base URL**: `http://localhost:3000/auth/profile`

---

## 🔌 Endpoint

### Obtener Perfil del Usuario

**Endpoint**: `GET /auth/profile`

**Método**: `GET`

**Autenticación**: ✅ Requerida (JWT Bearer Token)

**Roles permitidos**: Todos (Student, Professor, Admin)

**Headers requeridos**:
```http
Authorization: Bearer <JWT_TOKEN>
```

**Respuesta**: Varía según el rol del usuario (ver sección [Tipos de Respuesta](#tipos-de-respuesta-por-rol))

---

## 🔐 Autenticación

Este endpoint **requiere autenticación JWT**. El token debe ser obtenido previamente del endpoint `/auth/login`.

### Headers

```http
GET /auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Ejemplo con Axios

```typescript
const token = localStorage.getItem('access_token');

const response = await axios.get('http://localhost:3000/auth/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 🎭 Tipos de Respuesta por Rol

La respuesta del endpoint cambia dinámicamente según el rol del usuario autenticado.

---

### 🎓 Respuesta para ESTUDIANTE

**Estructura**:
```typescript
{
  user_info: BaseUserInfo;
  student_profile: StudentProfile;
  statistics: StudentStatistics;
  recent_activity: RecentActivity;
}
```

**Ejemplo de respuesta real**:
```json
{
  "user_info": {
    "user_id": 1,
    "username": "alberto.felix",
    "email": "alberto.felix@potros.itson.edu.mx",
    "name": "Alberto",
    "last_name": "Félix Rosas",
    "phone_number": "+526421910021",
    "photo_url": "https://example.com/photos/alberto.jpg",
    "created_at": "2024-08-15T10:00:00.000Z",
    "updated_at": "2024-11-22T15:30:00.000Z",
    "is_active": true,
    "role": "student"
  },
  "student_profile": {
    "student_id": "181331",
    "career": "Ingeniería en Sistemas Computacionales",
    "semester": 5,
    "student_code": "181331",
    "enrollment_date": "2020-08-15T00:00:00.000Z",
    "academic_status": "active"
  },
  "statistics": {
    "total_appointments": 15,
    "completed_sessions": 12,
    "active_appointments": 3,
    "total_hours_received": 24
  },
  "recent_activity": {
    "last_appointment": {
      "advisory_date_id": 45,
      "date": "2024-11-20T14:00:00.000Z",
      "start_time": "14:00",
      "end_time": "16:00",
      "location": "Aula 101",
      "professor_name": "Dr. García",
      "subject_name": "Algoritmos",
      "status": "completed"
    },
    "upcoming_appointments": [
      {
        "advisory_date_id": 48,
        "date": "2024-11-25T10:00:00.000Z",
        "start_time": "10:00",
        "end_time": "12:00",
        "location": "Virtual - Zoom",
        "professor_name": "Dra. Martínez",
        "subject_name": "Bases de Datos",
        "status": "scheduled"
      }
    ],
    "recently_completed": [
      {
        "advisory_date_id": 45,
        "date": "2024-11-20T14:00:00.000Z",
        "subject_name": "Algoritmos",
        "status": "completed"
      }
    ]
  }
}
```

---

### 👨‍🏫 Respuesta para PROFESOR

**Estructura**:
```typescript
{
  user_info: BaseUserInfo;
  professor_profile: ProfessorProfile;
  assigned_subjects: AssignedSubjects;
  statistics: ProfessorStatistics;
  availability: Availability;
}
```

**Ejemplo de respuesta real**:
```json
{
  "user_info": {
    "user_id": 42,
    "username": "juan.garcia",
    "email": "juan.garcia@itson.edu.mx",
    "name": "Juan",
    "last_name": "García López",
    "phone_number": "+526441234567",
    "photo_url": "https://example.com/photos/garcia.jpg",
    "created_at": "2020-01-10T09:00:00.000Z",
    "updated_at": "2024-11-22T08:00:00.000Z",
    "is_active": true,
    "role": "professor"
  },
  "professor_profile": {
    "employee_id": "PR2020001",
    "department": "Departamento de Sistemas y Computación",
    "faculty": "Facultad de Ingeniería",
    "employee_code": "EMP001",
    "hire_date": "2020-02-01T00:00:00.000Z",
    "academic_degree": "Maestro en Ciencias de la Computación",
    "specialties": [
      "Programación",
      "Estructuras de Datos",
      "Algoritmos"
    ],
    "office_location": "Edificio A, Oficina 201",
    "office_hours": "Lunes a Viernes 10:00-12:00"
  },
  "assigned_subjects": {
    "subjects": [
      {
        "subject_id": 5,
        "name": "Algoritmos y Estructuras de Datos"
      },
      {
        "subject_id": 8,
        "name": "Programación Orientada a Objetos"
      },
      {
        "subject_id": 12,
        "name": "Bases de Datos"
      }
    ],
    "total_subjects": 3
  },
  "statistics": {
    "total_advisories": 25,
    "active_advisories": 8,
    "total_students_helped": 65,
    "total_hours_taught": 150,
    "average_rating": 4.7
  },
  "availability": {
    "current_schedule": [
      {
        "schedule_id": 1,
        "day_of_week": "MONDAY",
        "start_time": "08:00",
        "end_time": "10:00",
        "location": "Aula 101",
        "subject_name": "Algoritmos"
      },
      {
        "schedule_id": 2,
        "day_of_week": "WEDNESDAY",
        "start_time": "14:00",
        "end_time": "16:00",
        "location": "Aula 202",
        "subject_name": "POO"
      }
    ],
    "next_available_slot": "2024-11-23T10:00:00.000Z"
  }
}
```

---

### 👔 Respuesta para ADMINISTRADOR

**Estructura**:
```typescript
{
  user_info: BaseUserInfo;
  admin_profile: AdminProfile;
  system_info: SystemInfo;
}
```

**Ejemplo de respuesta real**:
```json
{
  "user_info": {
    "user_id": 100,
    "username": "admin.director",
    "email": "director@itson.edu.mx",
    "name": "Carlos",
    "last_name": "Rodríguez Pérez",
    "phone_number": "+526441234000",
    "photo_url": "https://example.com/photos/admin.jpg",
    "created_at": "2019-01-01T08:00:00.000Z",
    "updated_at": "2024-11-22T07:00:00.000Z",
    "is_active": true,
    "role": "admin"
  },
  "admin_profile": {
    "employee_id": "ADM2019001",
    "department": "Administración Académica",
    "position": "Coordinador de Asesorías",
    "access_level": "full",
    "permissions": [
      "users_management",
      "system_config",
      "reports",
      "advisories_management",
      "subjects_management"
    ],
    "employee_code": "EMP002"
  },
  "system_info": {
    "last_login": "2024-11-22T07:30:00.000Z",
    "total_logins": 456,
    "managed_areas": [
      "Usuarios",
      "Asesorías",
      "Reportes",
      "Materias",
      "Venues"
    ]
  }
}
```

---

## 📝 Tipos TypeScript

### Interfaces Base

```typescript
// src/types/profile.types.ts

export enum UserRole {
  STUDENT = 'student',
  PROFESSOR = 'professor',
  ADMIN = 'admin',
}

// Información base del usuario (común para todos los roles)
export interface BaseUserInfo {
  user_id: number;
  username: string;
  email: string;
  name: string;
  last_name: string;
  phone_number: string;
  photo_url?: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  role: UserRole;
}
```

---

### Tipos para Estudiante

```typescript
export interface StudentProfile {
  student_id: string;
  career: string;
  semester: number;
  student_code: string;
  enrollment_date: string;
  academic_status: 'active' | 'inactive' | 'suspended';
}

export interface StudentStatistics {
  total_appointments: number;
  completed_sessions: number;
  active_appointments: number;
  total_hours_received: number;
}

export interface AppointmentSummary {
  advisory_date_id?: number;
  date?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  professor_name?: string;
  subject_name?: string;
  status?: string;
}

export interface RecentActivity {
  last_appointment?: AppointmentSummary | null;
  upcoming_appointments: AppointmentSummary[];
  recently_completed: AppointmentSummary[];
}

export interface StudentProfileResponse {
  user_info: BaseUserInfo;
  student_profile: StudentProfile;
  statistics: StudentStatistics;
  recent_activity: RecentActivity;
}
```

---

### Tipos para Profesor

```typescript
export interface ProfessorProfile {
  employee_id: string;
  department: string;
  faculty: string;
  employee_code: string;
  hire_date: string;
  academic_degree: string;
  specialties: string[];
  office_location: string;
  office_hours: string;
}

export interface SubjectSummary {
  subject_id: number;
  name: string;
  professor_name?: string;
  schedule?: string;
  credits?: number;
}

export interface AssignedSubjects {
  subjects: SubjectSummary[];
  total_subjects: number;
}

export interface ProfessorStatistics {
  total_advisories: number;
  active_advisories: number;
  total_students_helped: number;
  total_hours_taught: number;
  average_rating: number;
}

export interface ScheduleEntry {
  schedule_id?: number;
  day_of_week?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  subject_name?: string;
}

export interface Availability {
  current_schedule: ScheduleEntry[];
  next_available_slot: string;
}

export interface ProfessorProfileResponse {
  user_info: BaseUserInfo;
  professor_profile: ProfessorProfile;
  assigned_subjects: AssignedSubjects;
  statistics: ProfessorStatistics;
  availability: Availability;
}
```

---

### Tipos para Administrador

```typescript
export interface AdminProfile {
  employee_id: string;
  department: string;
  position: string;
  access_level: 'full' | 'partial' | 'read-only';
  permissions: string[];
  employee_code: string;
}

export interface SystemInfo {
  last_login: string;
  total_logins: number;
  managed_areas: string[];
}

export interface AdminProfileResponse {
  user_info: BaseUserInfo;
  admin_profile: AdminProfile;
  system_info: SystemInfo;
}
```

---

### Tipo Union para Respuestas

```typescript
export type ProfileResponse =
  | StudentProfileResponse
  | ProfessorProfileResponse
  | AdminProfileResponse;
```

---

## ⚛️ Ejemplos de Implementación React

### 1. Service API (profileService.ts)

```typescript
// src/services/profileService.ts
import axios from 'axios';
import type { ProfileResponse } from '../types/profile.types';

const API_BASE_URL = 'http://localhost:3000';

class ProfileService {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  }

  async getProfile(): Promise<ProfileResponse> {
    const response = await axios.get<ProfileResponse>(
      `${API_BASE_URL}/auth/profile`,
      this.getAuthHeaders()
    );
    return response.data;
  }
}

export const profileService = new ProfileService();
```

---

### 2. Hook Personalizado (useProfile.ts)

```typescript
// src/hooks/useProfile.ts
import { useState, useEffect } from 'react';
import { profileService } from '../services/profileService';
import type { ProfileResponse } from '../types/profile.types';

export const useProfile = () => {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Sesión expirada. Por favor inicia sesión nuevamente.');
        // Opcional: redirigir a login
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      } else {
        setError(err.response?.data?.message || 'Error al cargar perfil');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
  };
};
```

---

### 3. Componente de Perfil (ProfilePage.tsx)

```typescript
// src/pages/ProfilePage.tsx
import React from 'react';
import { useProfile } from '../hooks/useProfile';
import StudentProfileView from '../components/StudentProfileView';
import ProfessorProfileView from '../components/ProfessorProfileView';
import AdminProfileView from '../components/AdminProfileView';

const ProfilePage: React.FC = () => {
  const { profile, loading, error } = useProfile();

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (!profile) {
    return <div>No se pudo cargar el perfil</div>;
  }

  // Renderizar componente según el rol
  const renderProfileByRole = () => {
    switch (profile.user_info.role) {
      case 'student':
        return <StudentProfileView profile={profile} />;
      case 'professor':
        return <ProfessorProfileView profile={profile} />;
      case 'admin':
        return <AdminProfileView profile={profile} />;
      default:
        return <div>Rol desconocido</div>;
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img
          src={profile.user_info.photo_url || '/default-avatar.png'}
          alt={`${profile.user_info.name} ${profile.user_info.last_name}`}
          className="profile-photo"
        />
        <div className="profile-info">
          <h1>
            {profile.user_info.name} {profile.user_info.last_name}
          </h1>
          <p className="role-badge">{profile.user_info.role.toUpperCase()}</p>
          <p className="email">{profile.user_info.email}</p>
        </div>
      </div>

      {renderProfileByRole()}
    </div>
  );
};

export default ProfilePage;
```

---

### 4. Vista de Perfil de Estudiante

```typescript
// src/components/StudentProfileView.tsx
import React from 'react';
import type { StudentProfileResponse } from '../types/profile.types';

interface Props {
  profile: StudentProfileResponse;
}

const StudentProfileView: React.FC<Props> = ({ profile }) => {
  const { student_profile, statistics, recent_activity } = profile;

  return (
    <div className="student-profile">
      {/* Información Académica */}
      <section className="academic-info">
        <h2>Información Académica</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>Matrícula:</label>
            <span>{student_profile.student_id}</span>
          </div>
          <div className="info-item">
            <label>Carrera:</label>
            <span>{student_profile.career}</span>
          </div>
          <div className="info-item">
            <label>Semestre:</label>
            <span>{student_profile.semester}</span>
          </div>
          <div className="info-item">
            <label>Estado:</label>
            <span className={`status-${student_profile.academic_status}`}>
              {student_profile.academic_status}
            </span>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="statistics">
        <h2>Estadísticas</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{statistics.total_appointments}</h3>
            <p>Asesorías Totales</p>
          </div>
          <div className="stat-card">
            <h3>{statistics.completed_sessions}</h3>
            <p>Sesiones Completadas</p>
          </div>
          <div className="stat-card">
            <h3>{statistics.active_appointments}</h3>
            <p>Asesorías Activas</p>
          </div>
          <div className="stat-card">
            <h3>{statistics.total_hours_received}</h3>
            <p>Horas Recibidas</p>
          </div>
        </div>
      </section>

      {/* Actividad Reciente */}
      <section className="recent-activity">
        <h2>Actividad Reciente</h2>
        
        {recent_activity.last_appointment && (
          <div className="last-appointment">
            <h3>Última Asesoría</h3>
            <div className="appointment-card">
              <p><strong>Materia:</strong> {recent_activity.last_appointment.subject_name}</p>
              <p><strong>Profesor:</strong> {recent_activity.last_appointment.professor_name}</p>
              <p><strong>Fecha:</strong> {new Date(recent_activity.last_appointment.date!).toLocaleDateString()}</p>
              <p><strong>Ubicación:</strong> {recent_activity.last_appointment.location}</p>
            </div>
          </div>
        )}

        {recent_activity.upcoming_appointments.length > 0 && (
          <div className="upcoming-appointments">
            <h3>Próximas Asesorías</h3>
            <ul>
              {recent_activity.upcoming_appointments.map((apt, index) => (
                <li key={index} className="appointment-item">
                  <span className="subject">{apt.subject_name}</span>
                  <span className="date">
                    {new Date(apt.date!).toLocaleDateString()}
                  </span>
                  <span className="time">{apt.start_time} - {apt.end_time}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
};

export default StudentProfileView;
```

---

### 5. Vista de Perfil de Profesor

```typescript
// src/components/ProfessorProfileView.tsx
import React from 'react';
import type { ProfessorProfileResponse } from '../types/profile.types';

interface Props {
  profile: ProfessorProfileResponse;
}

const ProfessorProfileView: React.FC<Props> = ({ profile }) => {
  const { professor_profile, assigned_subjects, statistics, availability } = profile;

  return (
    <div className="professor-profile">
      {/* Información Profesional */}
      <section className="professional-info">
        <h2>Información Profesional</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>ID Empleado:</label>
            <span>{professor_profile.employee_id}</span>
          </div>
          <div className="info-item">
            <label>Departamento:</label>
            <span>{professor_profile.department}</span>
          </div>
          <div className="info-item">
            <label>Grado Académico:</label>
            <span>{professor_profile.academic_degree}</span>
          </div>
          <div className="info-item">
            <label>Oficina:</label>
            <span>{professor_profile.office_location}</span>
          </div>
          <div className="info-item full-width">
            <label>Horario de Atención:</label>
            <span>{professor_profile.office_hours}</span>
          </div>
        </div>

        <div className="specialties">
          <label>Especialidades:</label>
          <div className="tags">
            {professor_profile.specialties.map((specialty, index) => (
              <span key={index} className="tag">{specialty}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Materias Asignadas */}
      <section className="assigned-subjects">
        <h2>Materias Asignadas ({assigned_subjects.total_subjects})</h2>
        <ul className="subjects-list">
          {assigned_subjects.subjects.map((subject) => (
            <li key={subject.subject_id} className="subject-item">
              <span className="subject-name">{subject.name}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Estadísticas */}
      <section className="statistics">
        <h2>Estadísticas</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{statistics.total_advisories}</h3>
            <p>Asesorías Totales</p>
          </div>
          <div className="stat-card">
            <h3>{statistics.active_advisories}</h3>
            <p>Asesorías Activas</p>
          </div>
          <div className="stat-card">
            <h3>{statistics.total_students_helped}</h3>
            <p>Estudiantes Ayudados</p>
          </div>
          <div className="stat-card">
            <h3>{statistics.average_rating.toFixed(1)}</h3>
            <p>Calificación Promedio</p>
          </div>
        </div>
      </section>

      {/* Disponibilidad */}
      <section className="availability">
        <h2>Horario</h2>
        {availability.current_schedule.length > 0 ? (
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Día</th>
                <th>Hora</th>
                <th>Materia</th>
                <th>Ubicación</th>
              </tr>
            </thead>
            <tbody>
              {availability.current_schedule.map((schedule, index) => (
                <tr key={index}>
                  <td>{schedule.day_of_week}</td>
                  <td>{schedule.start_time} - {schedule.end_time}</td>
                  <td>{schedule.subject_name}</td>
                  <td>{schedule.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay horarios configurados</p>
        )}
      </section>
    </div>
  );
};

export default ProfessorProfileView;
```

---

### 6. Vista de Perfil de Administrador

```typescript
// src/components/AdminProfileView.tsx
import React from 'react';
import type { AdminProfileResponse } from '../types/profile.types';

interface Props {
  profile: AdminProfileResponse;
}

const AdminProfileView: React.FC<Props> = ({ profile }) => {
  const { admin_profile, system_info } = profile;

  return (
    <div className="admin-profile">
      {/* Información Administrativa */}
      <section className="admin-info">
        <h2>Información Administrativa</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>ID Empleado:</label>
            <span>{admin_profile.employee_id}</span>
          </div>
          <div className="info-item">
            <label>Departamento:</label>
            <span>{admin_profile.department}</span>
          </div>
          <div className="info-item">
            <label>Posición:</label>
            <span>{admin_profile.position}</span>
          </div>
          <div className="info-item">
            <label>Nivel de Acceso:</label>
            <span className="access-badge">{admin_profile.access_level}</span>
          </div>
        </div>

        <div className="permissions">
          <label>Permisos:</label>
          <div className="tags">
            {admin_profile.permissions.map((permission, index) => (
              <span key={index} className="tag permission-tag">
                {permission.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Información del Sistema */}
      <section className="system-info">
        <h2>Información del Sistema</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>Último Acceso:</label>
            <span>{new Date(system_info.last_login).toLocaleString()}</span>
          </div>
          <div className="info-item">
            <label>Total de Accesos:</label>
            <span>{system_info.total_logins}</span>
          </div>
        </div>

        <div className="managed-areas">
          <label>Áreas Gestionadas:</label>
          <ul className="areas-list">
            {system_info.managed_areas.map((area, index) => (
              <li key={index}>{area}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AdminProfileView;
```

---

### 7. Hook con React Query (Opcional)

```typescript
// src/hooks/useProfileQuery.ts
import { useQuery } from '@tanstack/react-query';
import { profileService } from '../services/profileService';

export const useProfileQuery = () => {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: () => profileService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
    onError: (error: any) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
    },
  });
};

// Uso en componente
const ProfilePage = () => {
  const { data: profile, isLoading, error } = useProfileQuery();
  
  // ... resto del componente
};
```

---

## ⚠️ Manejo de Errores

### Códigos de Estado HTTP

| Código | Descripción | Acción Recomendada |
|--------|-------------|-------------------|
| **200** | OK | Perfil obtenido exitosamente |
| **401** | Unauthorized | Token inválido o expirado → Redirigir a login |
| **404** | Not Found | Usuario no encontrado → Mostrar error |
| **500** | Internal Server Error | Error del servidor → Reintentar |

### Errores Comunes

```typescript
// Error: Token expirado o inválido
{
  "statusCode": 401,
  "message": "Unauthorized"
}

// Error: Usuario no encontrado
{
  "success": false,
  "message": "Usuario no encontrado",
  "status_code": 404
}
```

### Manejo en el Frontend

```typescript
try {
  const profile = await profileService.getProfile();
  setProfile(profile);
} catch (error: any) {
  if (error.response?.status === 401) {
    // Token expirado
    toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
    localStorage.removeItem('access_token');
    navigate('/login');
  } else if (error.response?.status === 404) {
    // Usuario no encontrado
    toast.error('No se encontró información del perfil');
  } else {
    // Error genérico
    toast.error('Error al cargar el perfil. Intenta de nuevo.');
  }
}
```

---

## 🎯 Casos de Uso

### 1. Mostrar información del usuario en navbar

```typescript
const Navbar = () => {
  const { profile } = useProfile();

  return (
    <nav>
      <div className="user-menu">
        <img src={profile?.user_info.photo_url} alt="Avatar" />
        <span>{profile?.user_info.name} {profile?.user_info.last_name}</span>
        <span className="role">{profile?.user_info.role}</span>
      </div>
    </nav>
  );
};
```

### 2. Redirigir según rol después del login

```typescript
const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    const response = await authService.login(credentials);
    localStorage.setItem('access_token', response.access_token);
    
    // Obtener perfil para saber el rol
    const profile = await profileService.getProfile();
    
    // Redirigir según rol
    switch (profile.user_info.role) {
      case 'student':
        navigate('/student/dashboard');
        break;
      case 'professor':
        navigate('/professor/dashboard');
        break;
      case 'admin':
        navigate('/admin/dashboard');
        break;
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
};
```

### 3. Guardar perfil en Context Global

```typescript
// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { profileService } from '../services/profileService';
import type { ProfileResponse } from '../types/profile.types';

interface AuthContextType {
  profile: ProfileResponse | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const data = await profileService.getProfile();
          setProfile(data);
        } catch (error) {
          localStorage.removeItem('access_token');
        }
      }
      setLoading(false);
    };

    loadProfile();
  }, []);

  const logout = () => {
    localStorage.removeItem('access_token');
    setProfile(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

---

## 📊 Resumen

| Aspecto | Detalle |
|---------|---------|
| **Endpoint** | `GET /auth/profile` |
| **Autenticación** | JWT Bearer Token (requerido) |
| **Roles** | Student, Professor, Admin |
| **Respuesta** | Dinámica según rol |
| **Cache recomendado** | 5 minutos |

---

## ✅ Checklist de Implementación

- [ ] Crear tipos TypeScript para todos los perfiles
- [ ] Implementar `profileService.ts`
- [ ] Crear hook `useProfile` o `useProfileQuery`
- [ ] Implementar componentes de vista por rol
- [ ] Agregar manejo de errores 401 (redirect a login)
- [ ] Implementar loading states
- [ ] Agregar feedback visual (toasts/alerts)
- [ ] Guardar perfil en Context global (opcional)
- [ ] Implementar caché con React Query (opcional)
- [ ] Probar con diferentes roles

---

**Documento generado**: 22 de Noviembre, 2025  
**Autor**: GitHub Copilot  
**Versión**: 1.0  
**Estado**: ✅ Completo

¡Endpoint de perfil listo para implementación en React! 🚀
