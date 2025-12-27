# Advisories API - Guía Completa para Frontend (React + TypeScript)

Esta guía documenta el módulo de **Advisories (Asesorías)**, que gestiona las asesorías y sesiones entre profesores y estudiantes.

## 📋 Tabla de Contenidos

- [Información General](#información-general)
- [Estados de Advisory](#estados-de-advisory)
- [Rutas y Endpoints](#rutas-y-endpoints)
- [Autenticación y Permisos](#autenticación-y-permisos)
- [Endpoints Detallados](#endpoints-detallados)
  - [Crear Advisory](#crear-advisory)
  - [Listar Todas las Advisories](#listar-todas-las-advisories)
  - [Obtener Advisories de un Profesor](#obtener-advisories-de-un-profesor)
  - [Obtener Advisory por ID](#obtener-advisory-por-id)
  - [Actualizar Advisory](#actualizar-advisory)
  - [Eliminar Advisory](#eliminar-advisory)
  - [Crear Sesión Directa](#crear-sesión-directa)
  - [Invitar Estudiantes a Sesión](#invitar-estudiantes-a-sesión)
  - [Ver Invitaciones de Sesión](#ver-invitaciones-de-sesión)
  - [Obtener Estudiantes de Sesión](#obtener-estudiantes-de-sesión)
  - [Obtener Detalles Completos de Sesión](#obtener-detalles-completos-de-sesión)
- [TypeScript Types](#typescript-types)
- [Implementación en React](#implementación-en-react)
- [Casos de Uso Comunes](#casos-de-uso-comunes)
- [Manejo de Errores](#manejo-de-errores)

---

## 🔍 Información General

### ¿Qué son las Advisories?

Las **Advisories** son asesorías programadas entre profesores y estudiantes para una materia específica. Cada Advisory contiene:

- 👨‍🏫 **Profesor asignado**
- 📚 **Materia (Subject Detail)**
- 👥 **Máximo de estudiantes permitidos**
- 📅 **Horarios de disponibilidad (Schedules)**
- 🎯 **Sesiones específicas (Advisory Dates)**
- 📊 **Estado actual**

### Diferencia: Advisory vs Advisory Date

| Concepto | Descripción | Ejemplo |
|----------|-------------|---------|
| **Advisory** | Marco general de asesorías para una materia | "Asesorías de Cálculo I con Prof. García" |
| **Advisory Date** | Sesión específica con fecha/hora/tema | "Límites y continuidad - 25 Nov 2025, 10:00 AM" |

---

## 📊 Estados de Advisory

```typescript
enum AdvisoryStatus {
  PENDING = 'pending',      // Pendiente de aprobación
  APPROVED = 'approved',    // Aprobada por admin
  ACTIVE = 'active',        // Activa y disponible
  COMPLETED = 'completed',  // Completada
  CANCELLED = 'cancelled'   // Cancelada
}
```

### Flujo de Estados

```
PENDING → APPROVED → ACTIVE → COMPLETED
   ↓                    ↓
CANCELLED          CANCELLED
```

---

## 🛣️ Rutas y Endpoints

**Base URL**: `http://localhost:3000/advisories`

### Tabla de Endpoints

| Método | Ruta | Rol Requerido | Descripción |
|--------|------|---------------|-------------|
| `POST` | `/advisories` | `ADMIN`, `PROFESSOR` | Crear nueva advisory |
| `GET` | `/advisories` | Todos autenticados | Listar todas las advisories |
| `GET` | `/advisories/professor/:professorId` | Todos autenticados | Advisories de un profesor |
| `GET` | `/advisories/:id` | Todos autenticados | Obtener advisory por ID |
| `PATCH` | `/advisories/:id` | `ADMIN`, `PROFESSOR` | Actualizar advisory |
| `DELETE` | `/advisories/:id` | `ADMIN`, `PROFESSOR` | Eliminar advisory |
| `POST` | `/advisories/direct-session` | `PROFESSOR` | Crear sesión directa |
| `POST` | `/advisories/sessions/:sessionId/invite` | `PROFESSOR` | Invitar estudiantes |
| `GET` | `/advisories/sessions/:sessionId/invitations` | `PROFESSOR`, `ADMIN` | Ver invitaciones |
| `GET` | `/advisories/sessions/:sessionId/students` | `PROFESSOR`, `ADMIN` | Estudiantes registrados |
| `GET` | `/advisories/sessions/:sessionId` | Todos autenticados | Detalles completos |

---

## 🔐 Autenticación y Permisos

### Headers Requeridos

```typescript
const config = {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
};
```

### Permisos por Endpoint

| Endpoint | Profesor | Admin | Estudiante |
|----------|----------|-------|------------|
| `POST /advisories` | ✅ | ✅ | ❌ |
| `GET /advisories` | ✅ | ✅ | ✅ |
| `GET /advisories/professor/:id` | ✅ | ✅ | ✅ |
| `GET /advisories/:id` | ✅ | ✅ | ✅ |
| `PATCH /advisories/:id` | ✅ | ✅ | ❌ |
| `DELETE /advisories/:id` | ✅ | ✅ | ❌ |
| `POST /advisories/direct-session` | ✅ | ❌ | ❌ |
| `POST /advisories/sessions/:id/invite` | ✅ | ❌ | ❌ |
| `GET /advisories/sessions/:id/invitations` | ✅ | ✅ | ❌ |
| `GET /advisories/sessions/:id/students` | ✅ | ✅ | ❌ |
| `GET /advisories/sessions/:id` | ✅ | ✅ | ✅ |

---

## 📡 Endpoints Detallados

### Crear Advisory

#### `POST /advisories`

Crea una nueva advisory (marco general de asesorías).

**Roles permitidos**: `ADMIN`, `PROFESSOR`

#### Request Body

```json
{
  "professor_id": 1,
  "subject_detail_id": 42,
  "max_students": 10,
  "schedules": [
    {
      "day": "MONDAY",
      "begin_time": "08:30",
      "end_time": "10:00"
    },
    {
      "day": "WEDNESDAY",
      "begin_time": "14:00",
      "end_time": "15:30"
    }
  ]
}
```

#### Validaciones

- `professor_id`: Debe existir y ser rol PROFESSOR
- `subject_detail_id`: Debe existir
- `max_students`: Mínimo 1
- `schedules`: Array con al menos 1 horario
- `day`: Enum válido (MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY)
- `begin_time`, `end_time`: Formato HH:mm (24h)

#### Respuesta Exitosa (201 Created)

```json
{
  "advisory_id": 123,
  "max_students": 10,
  "professor": {
    "user_id": 1,
    "school_id": "2021030001",
    "name": "Juan",
    "last_name": "García Pérez",
    "email": "juan.garcia@itson.edu.mx",
    "photo_url": "https://example.com/photo.jpg"
  },
  "subject_detail": {
    "subject_detail_id": 42,
    "subject_name": "Cálculo Diferencial",
    "schedules": [
      {
        "day": "MONDAY",
        "start_time": "07:00",
        "end_time": "09:00"
      }
    ]
  },
  "schedules": [
    {
      "advisory_schedule_id": 301,
      "day": "MONDAY",
      "begin_time": "08:30",
      "end_time": "10:00"
    },
    {
      "advisory_schedule_id": 302,
      "day": "WEDNESDAY",
      "begin_time": "14:00",
      "end_time": "15:30"
    }
  ]
}
```

---

### Listar Todas las Advisories

#### `GET /advisories`

Obtiene todas las advisories del sistema.

**Roles permitidos**: Todos los autenticados

#### Respuesta Exitosa (200 OK)

```json
[
  {
    "advisory_id": 123,
    "max_students": 10,
    "professor": {
      "user_id": 1,
      "school_id": "2021030001",
      "name": "Juan",
      "last_name": "García Pérez",
      "email": "juan.garcia@itson.edu.mx",
      "photo_url": "https://example.com/photo.jpg"
    },
    "subject_detail": {
      "subject_detail_id": 42,
      "subject_name": "Cálculo Diferencial",
      "schedules": [
        {
          "day": "MONDAY",
          "start_time": "07:00",
          "end_time": "09:00"
        }
      ]
    },
    "schedules": [
      {
        "advisory_schedule_id": 301,
        "day": "MONDAY",
        "begin_time": "08:30",
        "end_time": "10:00"
      }
    ]
  }
]
```

---

### Obtener Advisories de un Profesor

#### `GET /advisories/professor/:professorId`

⚠️ **IMPORTANTE**: Esta es la ruta que probablemente necesitas para `/advisories/my-advisories`.

**Roles permitidos**: Todos los autenticados

#### Ejemplo de URL

```bash
# Obtener advisories del profesor con ID 5
GET /advisories/professor/5
```

#### Uso en Frontend (Mis Advisories)

Para obtener las advisories del profesor actual (autenticado):

```typescript
// Extraer user_id del token JWT decodificado
const currentUserId = decodedToken.user_id;

// Hacer petición
GET /advisories/professor/${currentUserId}
```

#### Respuesta Exitosa (200 OK)

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
        },
        {
          "day": "THURSDAY",
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
      },
      {
        "advisory_schedule_id": 402,
        "day": "THURSDAY",
        "begin_time": "11:00",
        "end_time": "12:00"
      }
    ]
  }
]
```

#### Error si el profesor no existe (404 Not Found)

```json
{
  "statusCode": 404,
  "message": "Professor with id 999 not found or is not a professor",
  "error": "Not Found"
}
```

---

### Obtener Advisory por ID

#### `GET /advisories/:id`

Obtiene una advisory específica.

**Roles permitidos**: Todos los autenticados

#### Respuesta Exitosa (200 OK)

Mismo formato que el array de advisories, pero un solo objeto.

---

### Actualizar Advisory

#### `PATCH /advisories/:id`

Actualiza una advisory existente.

**Roles permitidos**: `ADMIN`, `PROFESSOR`

#### Request Body (todos los campos opcionales)

```json
{
  "professor_id": 2,
  "subject_detail_id": 43,
  "max_students": 15,
  "schedules": [
    {
      "day": "FRIDAY",
      "begin_time": "10:00",
      "end_time": "12:00"
    }
  ]
}
```

⚠️ **Importante**: Si actualizas `schedules`, se eliminan los horarios anteriores y se reemplazan por los nuevos.

---

### Eliminar Advisory

#### `DELETE /advisories/:id`

Elimina una advisory.

**Roles permitidos**: `ADMIN`, `PROFESSOR`

#### Respuesta Exitosa (200 OK)

Retorna la advisory eliminada en el mismo formato que GET.

---

### Crear Sesión Directa

#### `POST /advisories/direct-session`

Permite a un profesor crear una sesión de asesoría directamente (sin solicitud previa).

**Rol requerido**: `PROFESSOR` solamente

⚠️ **Importante**: El `professor_id` se obtiene automáticamente del token JWT, NO se envía en el body.

#### Request Body

```json
{
  "subject_detail_id": 42,
  "venue_id": 5,
  "topic": "Límites y Continuidad",
  "session_date": "2025-11-25T10:00:00.000Z",
  "max_students": 15,
  "session_link": "https://meet.google.com/abc-defg-hij",
  "notes": "Traer calculadora científica",
  "schedules": [
    {
      "day": "MONDAY",
      "begin_time": "10:00",
      "end_time": "12:00"
    }
  ],
  "invited_student_ids": [10, 15, 20]
}
```

#### Validaciones

- `subject_detail_id`: Debe pertenecer al profesor autenticado
- `venue_id`: Debe existir
- `session_date`: Debe ser en el futuro
- El profesor NO debe tener otra sesión en ese mismo día
- `schedules`: Requerido (para futuras sesiones)
- `invited_student_ids`: Opcional

#### Respuesta Exitosa (201 Created)

```json
{
  "advisory": {
    "advisory_id": 150,
    "max_students": 15,
    "professor": {
      "user_id": 3,
      "school_id": "2021030003",
      "name": "Carlos",
      "last_name": "Ramírez López",
      "email": "carlos.ramirez@itson.edu.mx",
      "photo_url": null
    },
    "subject_detail": {
      "subject_detail_id": 42,
      "subject_name": "Cálculo Diferencial",
      "schedules": []
    },
    "schedules": [
      {
        "advisory_schedule_id": 501,
        "day": "MONDAY",
        "begin_time": "10:00",
        "end_time": "12:00"
      }
    ]
  },
  "advisory_date": {
    "advisory_date_id": 75,
    "advisory_id": 150,
    "venue_id": 5,
    "topic": "Límites y Continuidad",
    "date": "2025-11-25T10:00:00.000Z",
    "notes": "Traer calculadora científica",
    "session_link": "https://meet.google.com/abc-defg-hij",
    "completed_at": null,
    "created_at": "2025-11-23T15:30:00.000Z",
    "updated_at": "2025-11-23T15:30:00.000Z"
  }
}
```

#### Errores Posibles

| Código | Mensaje | Causa |
|--------|---------|-------|
| `403` | "You can only create sessions for subjects assigned to you" | Materia no asignada al profesor |
| `400` | "Session date must be in the future" | Fecha en el pasado |
| `400` | "You already have a session scheduled for this time period" | Conflicto de horario |
| `404` | "Venue with ID X not found" | Venue no existe |

---

### Invitar Estudiantes a Sesión

#### `POST /advisories/sessions/:sessionId/invite`

Invita estudiantes específicos a una sesión existente.

**Rol requerido**: `PROFESSOR`

#### Request Body

```json
{
  "student_ids": [10, 15, 20, 25]
}
```

#### Respuesta Exitosa (201 Created)

Formato depende de la implementación del `InvitationService`. Generalmente retorna confirmación de invitaciones enviadas.

---

### Ver Invitaciones de Sesión

#### `GET /advisories/sessions/:sessionId/invitations`

Obtiene todas las invitaciones de una sesión.

**Roles permitidos**: `PROFESSOR`, `ADMIN`

⚠️ **Validación**: Los profesores solo pueden ver invitaciones de sus propias sesiones.

---

### Obtener Estudiantes de Sesión

#### `GET /advisories/sessions/:sessionId/students`

Obtiene todos los estudiantes registrados en una sesión con su estado de asistencia.

**Roles permitidos**: `PROFESSOR`, `ADMIN`

#### Respuesta Exitosa (200 OK)

```json
{
  "session": {
    "advisory_date_id": 75,
    "advisory_id": 150,
    "topic": "Límites y Continuidad",
    "date": "2025-11-25T10:00:00.000Z",
    "notes": "Traer calculadora científica",
    "session_link": "https://meet.google.com/abc-defg-hij",
    "venue": {
      "venue_id": 5,
      "building": "Edificio 5M",
      "classroom": "Aula 302",
      "capacity": 0
    },
    "subject": {
      "subject_id": 10,
      "subject_name": "Cálculo Diferencial"
    },
    "professor": {
      "user_id": 3,
      "name": "Carlos",
      "last_name": "Ramírez López",
      "email": "carlos.ramirez@itson.edu.mx",
      "photo_url": null
    },
    "max_students": 15,
    "completed_at": null
  },
  "students": [
    {
      "user_id": 10,
      "student_id": "2021040010",
      "name": "Ana",
      "last_name": "Martínez Gómez",
      "email": "ana.martinez@itson.edu.mx",
      "photo_url": null,
      "phone_number": "6441234567",
      "attended": true,
      "attendance_notes": "Participó activamente",
      "join_type": "attendance"
    }
  ],
  "total_students": 8,
  "attended_count": 6,
  "absent_count": 2,
  "attendance_rate": 75
}
```

---

### Obtener Detalles Completos de Sesión

#### `GET /advisories/sessions/:sessionId`

Obtiene información completa de una sesión incluyendo venue, materia, profesor, horarios y asistencias.

**Roles permitidos**: Todos los autenticados

#### Respuesta Exitosa (200 OK)

```json
{
  "advisory_date_id": 75,
  "advisory_id": 150,
  "topic": "Límites y Continuidad",
  "date": "2025-11-25T10:00:00.000Z",
  "notes": "Traer calculadora científica",
  "session_link": "https://meet.google.com/abc-defg-hij",
  "completed_at": null,
  "created_at": "2025-11-23T15:30:00.000Z",
  "updated_at": "2025-11-23T15:30:00.000Z",
  "venue": {
    "venue_id": 5,
    "building": "Edificio 5M",
    "classroom": "Aula 302",
    "capacity": 0
  },
  "subject": {
    "subject_id": 10,
    "subject_name": "Cálculo Diferencial",
    "schedules": [
      {
        "day": "MONDAY",
        "start_time": "07:00",
        "end_time": "09:00"
      }
    ]
  },
  "professor": {
    "user_id": 3,
    "name": "Carlos",
    "last_name": "Ramírez López",
    "email": "carlos.ramirez@itson.edu.mx",
    "photo_url": null,
    "phone_number": "6449876543"
  },
  "max_students": 15,
  "advisory_schedules": [
    {
      "advisory_schedule_id": 501,
      "day": "MONDAY",
      "begin_time": "10:00",
      "end_time": "12:00"
    }
  ],
  "attendances": [
    {
      "student_id": 10,
      "student_enrollment_id": "2021040010",
      "student_name": "Ana",
      "student_last_name": "Martínez Gómez",
      "attended": true,
      "notes": "Participó activamente"
    }
  ],
  "registered_students_count": 8,
  "attended_count": 6,
  "attendance_rate": 75,
  "is_completed": false,
  "is_upcoming": true
}
```

---

## 📝 TypeScript Types

```typescript
// ============================================
// ENUMS
// ============================================

export enum AdvisoryStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum WeekDay {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

// ============================================
// DTOs
// ============================================

export interface ScheduleDto {
  day: WeekDay;
  begin_time: string; // HH:mm
  end_time: string;   // HH:mm
}

export interface CreateAdvisoryDto {
  professor_id: number;
  subject_detail_id: number;
  max_students: number;
  schedules: ScheduleDto[];
}

export interface UpdateAdvisoryDto {
  professor_id?: number;
  subject_detail_id?: number;
  max_students?: number;
  schedules?: ScheduleDto[];
}

export interface CreateDirectSessionDto {
  subject_detail_id: number;
  venue_id: number;
  topic: string;
  session_date: Date | string;
  max_students: number;
  session_link?: string;
  notes?: string;
  schedules: SessionScheduleDto[];
  invited_student_ids?: number[];
}

export interface SessionScheduleDto {
  day: string;
  begin_time: string;
  end_time: string;
}

export interface InviteStudentsDto {
  student_ids: number[];
}

// ============================================
// RESPONSE TYPES
// ============================================

export interface ProfessorInfo {
  user_id: number;
  school_id: string;
  name: string;
  last_name: string;
  email: string;
  photo_url: string | null;
  phone_number?: string;
}

export interface SubjectDetailInfo {
  subject_detail_id: number;
  subject_name: string;
  schedules: SubjectScheduleInfo[];
}

export interface SubjectScheduleInfo {
  day: string;
  start_time: string;
  end_time: string;
}

export interface AdvisoryScheduleInfo {
  advisory_schedule_id: number;
  day: string;
  begin_time: string;
  end_time: string;
}

export interface Advisory {
  advisory_id: number;
  max_students: number;
  professor: ProfessorInfo;
  subject_detail: SubjectDetailInfo;
  schedules: AdvisoryScheduleInfo[];
}

export interface AdvisoryDate {
  advisory_date_id: number;
  advisory_id: number;
  venue_id: number;
  topic: string;
  date: string;
  notes: string | null;
  session_link: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DirectSessionResponse {
  advisory: Advisory;
  advisory_date: AdvisoryDate;
}

export interface StudentInfo {
  user_id: number;
  student_id: string;
  name: string;
  last_name: string;
  email: string;
  photo_url: string | null;
  phone_number: string | null;
  attended: boolean;
  attendance_notes: string | null;
  join_type: 'attendance';
}

export interface VenueInfo {
  venue_id: number;
  building: string;
  classroom: string;
  capacity: number;
}

export interface SubjectInfo {
  subject_id: number;
  subject_name: string;
  schedules?: SubjectScheduleInfo[];
}

export interface SessionStudentsResponse {
  session: {
    advisory_date_id: number;
    advisory_id: number;
    topic: string;
    date: string;
    notes: string | null;
    session_link: string | null;
    venue: VenueInfo;
    subject: SubjectInfo;
    professor: ProfessorInfo;
    max_students: number;
    completed_at: string | null;
  };
  students: StudentInfo[];
  total_students: number;
  attended_count: number;
  absent_count: number;
  attendance_rate: number;
}

export interface AttendanceInfo {
  student_id: number;
  student_enrollment_id: string;
  student_name: string;
  student_last_name: string;
  attended: boolean;
  notes: string | null;
}

export interface FullSessionDetails {
  advisory_date_id: number;
  advisory_id: number;
  topic: string;
  date: string;
  notes: string | null;
  session_link: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  venue: VenueInfo;
  subject: SubjectInfo;
  professor: ProfessorInfo;
  max_students: number;
  advisory_schedules: AdvisoryScheduleInfo[];
  attendances: AttendanceInfo[];
  registered_students_count: number;
  attended_count: number;
  attendance_rate: number;
  is_completed: boolean;
  is_upcoming: boolean;
}
```

---

## 🛠️ Implementación en React

### 1. Servicio API (advisoriesService.ts)

```typescript
import axios from 'axios';
import type {
  Advisory,
  CreateAdvisoryDto,
  UpdateAdvisoryDto,
  CreateDirectSessionDto,
  DirectSessionResponse,
  InviteStudentsDto,
  SessionStudentsResponse,
  FullSessionDetails,
} from './types/advisories.types';

const API_BASE_URL = 'http://localhost:3000/advisories';

class AdvisoriesService {
  /**
   * Crear nueva advisory
   */
  async createAdvisory(
    accessToken: string,
    data: CreateAdvisoryDto
  ): Promise<Advisory> {
    const response = await axios.post<Advisory>(
      API_BASE_URL,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Listar todas las advisories
   */
  async getAllAdvisories(accessToken: string): Promise<Advisory[]> {
    const response = await axios.get<Advisory[]>(
      API_BASE_URL,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Obtener advisories de un profesor específico
   * ⚠️ IMPORTANTE: Para "mis advisories", usar el user_id del profesor autenticado
   */
  async getAdvisoriesByProfessor(
    accessToken: string,
    professorId: number
  ): Promise<Advisory[]> {
    const response = await axios.get<Advisory[]>(
      `${API_BASE_URL}/professor/${professorId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Obtener "mis advisories" (del profesor autenticado)
   */
  async getMyAdvisories(
    accessToken: string,
    myUserId: number
  ): Promise<Advisory[]> {
    return this.getAdvisoriesByProfessor(accessToken, myUserId);
  }

  /**
   * Obtener advisory por ID
   */
  async getAdvisoryById(
    accessToken: string,
    advisoryId: number
  ): Promise<Advisory> {
    const response = await axios.get<Advisory>(
      `${API_BASE_URL}/${advisoryId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Actualizar advisory
   */
  async updateAdvisory(
    accessToken: string,
    advisoryId: number,
    data: UpdateAdvisoryDto
  ): Promise<Advisory> {
    const response = await axios.patch<Advisory>(
      `${API_BASE_URL}/${advisoryId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Eliminar advisory
   */
  async deleteAdvisory(
    accessToken: string,
    advisoryId: number
  ): Promise<void> {
    await axios.delete(
      `${API_BASE_URL}/${advisoryId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  }

  /**
   * Crear sesión directa
   */
  async createDirectSession(
    accessToken: string,
    data: CreateDirectSessionDto
  ): Promise<DirectSessionResponse> {
    const response = await axios.post<DirectSessionResponse>(
      `${API_BASE_URL}/direct-session`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Invitar estudiantes a sesión
   */
  async inviteStudentsToSession(
    accessToken: string,
    sessionId: number,
    data: InviteStudentsDto
  ): Promise<any> {
    const response = await axios.post(
      `${API_BASE_URL}/sessions/${sessionId}/invite`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Ver invitaciones de sesión
   */
  async getSessionInvitations(
    accessToken: string,
    sessionId: number
  ): Promise<any> {
    const response = await axios.get(
      `${API_BASE_URL}/sessions/${sessionId}/invitations`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Obtener estudiantes de sesión
   */
  async getSessionStudents(
    accessToken: string,
    sessionId: number
  ): Promise<SessionStudentsResponse> {
    const response = await axios.get<SessionStudentsResponse>(
      `${API_BASE_URL}/sessions/${sessionId}/students`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Obtener detalles completos de sesión
   */
  async getFullSessionDetails(
    accessToken: string,
    sessionId: number
  ): Promise<FullSessionDetails> {
    const response = await axios.get<FullSessionDetails>(
      `${API_BASE_URL}/sessions/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }
}

export const advisoriesService = new AdvisoriesService();
```

---

### 2. Hook para "Mis Advisories" (useMyAdvisories.ts)

```typescript
import { useState, useEffect } from 'react';
import { advisoriesService } from '../services/advisoriesService';
import { useAuth } from '../contexts/AuthContext';
import type { Advisory } from '../types/advisories.types';

interface UseMyAdvisoriesResult {
  advisories: Advisory[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useMyAdvisories = (): UseMyAdvisoriesResult => {
  const { accessToken, user } = useAuth(); // user contiene user_id del token JWT
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvisories = async () => {
    if (!accessToken || !user?.user_id) {
      setError('No hay usuario autenticado');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await advisoriesService.getMyAdvisories(
        accessToken,
        user.user_id
      );
      setAdvisories(data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('No se encontraron advisories');
      } else if (err.response?.status === 403) {
        setError('No tienes permisos para ver estas advisories');
      } else {
        setError('Error al cargar advisories');
      }
      console.error('Error fetching my advisories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisories();
  }, [accessToken, user?.user_id]);

  return {
    advisories,
    loading,
    error,
    refetch: fetchAdvisories,
  };
};
```

---

### 3. Componente "Mis Advisories" (MyAdvisoriesPage.tsx)

```typescript
import React from 'react';
import { useMyAdvisories } from '../hooks/useMyAdvisories';

export const MyAdvisoriesPage: React.FC = () => {
  const { advisories, loading, error, refetch } = useMyAdvisories();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Cargando mis asesorías...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Mis Asesorías</h1>

      {advisories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">
            No tienes asesorías registradas
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Crear Nueva Asesoría
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {advisories.map((advisory) => (
            <AdvisoryCard key={advisory.advisory_id} advisory={advisory} />
          ))}
        </div>
      )}
    </div>
  );
};

// Componente auxiliar
const AdvisoryCard: React.FC<{ advisory: Advisory }> = ({ advisory }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {advisory.subject_detail.subject_name}
          </h3>
          <p className="text-sm text-gray-600">
            Advisory ID: #{advisory.advisory_id}
          </p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          Max: {advisory.max_students} estudiantes
        </span>
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Horarios de asesoría:</h4>
        <div className="space-y-2">
          {advisory.schedules.map((schedule) => (
            <div
              key={schedule.advisory_schedule_id}
              className="flex items-center gap-2 text-sm"
            >
              <span className="font-medium text-gray-700">
                {schedule.day}:
              </span>
              <span className="text-gray-600">
                {schedule.begin_time} - {schedule.end_time}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Horarios de clase:</h4>
        <div className="space-y-1">
          {advisory.subject_detail.schedules.map((schedule, idx) => (
            <div key={idx} className="text-sm text-gray-600">
              {schedule.day}: {schedule.start_time} - {schedule.end_time}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Ver Detalles
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
          Editar
        </button>
      </div>
    </div>
  );
};
```

---

### 4. Hook para Crear Sesión Directa (useCreateDirectSession.ts)

```typescript
import { useState } from 'react';
import { advisoriesService } from '../services/advisoriesService';
import { useAuth } from '../contexts/AuthContext';
import type { CreateDirectSessionDto, DirectSessionResponse } from '../types/advisories.types';

interface UseCreateDirectSessionResult {
  createSession: (data: CreateDirectSessionDto) => Promise<DirectSessionResponse | null>;
  loading: boolean;
  error: string | null;
}

export const useCreateDirectSession = (): UseCreateDirectSessionResult => {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = async (
    data: CreateDirectSessionDto
  ): Promise<DirectSessionResponse | null> => {
    if (!accessToken) {
      setError('No estás autenticado');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await advisoriesService.createDirectSession(accessToken, data);
      return result;
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Solo puedes crear sesiones para materias asignadas a ti');
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || 'Datos inválidos');
      } else if (err.response?.status === 404) {
        setError(err.response.data.message || 'Recurso no encontrado');
      } else {
        setError('Error al crear la sesión');
      }
      console.error('Error creating direct session:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSession,
    loading,
    error,
  };
};
```

---

## 🎯 Casos de Uso Comunes

### Caso 1: Página "Mis Asesorías" del Profesor

```typescript
// Ruta en frontend: /professor/my-advisories

import { useMyAdvisories } from '../hooks/useMyAdvisories';

const MyAdvisoriesPage = () => {
  const { advisories, loading } = useMyAdvisories();
  
  // Renderizar lista de advisories del profesor autenticado
  return <AdvisoriesList advisories={advisories} />;
};
```

### Caso 2: Crear Sesión Directa desde Dashboard

```typescript
const CreateSessionButton = () => {
  const { createSession, loading } = useCreateDirectSession();

  const handleCreate = async () => {
    const sessionData: CreateDirectSessionDto = {
      subject_detail_id: 42,
      venue_id: 5,
      topic: 'Derivadas',
      session_date: new Date('2025-11-25T10:00:00'),
      max_students: 15,
      schedules: [
        { day: 'MONDAY', begin_time: '10:00', end_time: '12:00' }
      ]
    };

    const result = await createSession(sessionData);
    if (result) {
      alert('Sesión creada exitosamente!');
    }
  };

  return (
    <button onClick={handleCreate} disabled={loading}>
      {loading ? 'Creando...' : 'Crear Sesión'}
    </button>
  );
};
```

### Caso 3: Ver Estudiantes de una Sesión

```typescript
const SessionStudents = ({ sessionId }: { sessionId: number }) => {
  const { accessToken } = useAuth();
  const [data, setData] = useState<SessionStudentsResponse | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      const result = await advisoriesService.getSessionStudents(
        accessToken!,
        sessionId
      );
      setData(result);
    };
    fetchStudents();
  }, [sessionId]);

  if (!data) return <div>Cargando...</div>;

  return (
    <div>
      <h3>{data.session.topic}</h3>
      <p>Asistencia: {data.attendance_rate}%</p>
      <ul>
        {data.students.map(student => (
          <li key={student.user_id}>
            {student.name} {student.last_name} 
            {student.attended ? ' ✅' : ' ❌'}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

---

## 🚨 Manejo de Errores

### Errores Comunes

| Código | Mensaje | Solución |
|--------|---------|----------|
| `404` | "Professor with id X not found..." | Verificar que el ID sea correcto y el usuario sea profesor |
| `404` | "Subject Detail ID X not found" | Verificar que la materia exista |
| `403` | "You can only create sessions for subjects assigned to you" | Solo crear sesiones de materias propias |
| `400` | "Session date must be in the future" | Usar fechas futuras |
| `400` | "You already have a session scheduled..." | Verificar conflictos de horario |
| `400` | "Schedules must be provided as an array..." | Incluir array de schedules |

### Manejo Robusto de Errores

```typescript
const handleCreateAdvisory = async (data: CreateAdvisoryDto) => {
  try {
    const advisory = await advisoriesService.createAdvisory(accessToken, data);
    toast.success('Advisory creada exitosamente');
    return advisory;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;

      switch (status) {
        case 404:
          if (message?.includes('Professor')) {
            toast.error('Profesor no encontrado');
          } else if (message?.includes('Subject')) {
            toast.error('Materia no encontrada');
          }
          break;
        case 400:
          toast.error(message || 'Datos inválidos');
          break;
        case 403:
          toast.error('No tienes permisos para esta acción');
          break;
        default:
          toast.error('Error al crear advisory');
      }
    }
    throw error;
  }
};
```

---

## 💡 Mejores Prácticas

### 1. **Cachear advisories con React Query**

```typescript
import { useQuery } from '@tanstack/react-query';

const useMyAdvisoriesQuery = (accessToken: string, userId: number) => {
  return useQuery({
    queryKey: ['advisories', 'my', userId],
    queryFn: () => advisoriesService.getMyAdvisories(accessToken, userId),
    staleTime: 2 * 60 * 1000, // 2 minutos
    enabled: !!accessToken && !!userId,
  });
};
```

### 2. **Validar fechas en el frontend**

```typescript
const validateSessionDate = (date: Date): string | null => {
  const now = new Date();
  if (date <= now) {
    return 'La fecha debe ser en el futuro';
  }
  return null;
};
```

### 3. **Formatear horarios para mejor UX**

```typescript
const formatSchedule = (day: string, beginTime: string, endTime: string) => {
  const dayNames: Record<string, string> = {
    MONDAY: 'Lunes',
    TUESDAY: 'Martes',
    WEDNESDAY: 'Miércoles',
    THURSDAY: 'Jueves',
    FRIDAY: 'Viernes',
  };
  
  return `${dayNames[day]} de ${beginTime} a ${endTime}`;
};
```

---

## 📚 Recursos Adicionales

### Documentación Relacionada

- [Venues API Guide](./VENUES_API_GUIDE.md)
- [Advisory Requests API](./ADVISORY_REQUESTS_API_GUIDE.md)
- [Dashboard API Guide](./DASHBOARD_API_GUIDE.md)

### Módulos Relacionados

- **Advisory Dates** - Sesiones específicas
- **Advisory Schedules** - Horarios de disponibilidad
- **Subject Details** - Materias asignadas
- **Venues** - Lugares de sesiones

---

**Última actualización**: Noviembre 23, 2025  
**Versión del API**: 1.0.0  
**Autor**: GitHub Copilot
