# Advisory Requests API - Guía para Frontend (React + TypeScript)

Esta guía documenta el módulo de **Solicitudes de Asesorías** (Advisory Requests), que permite a los estudiantes solicitar asesorías y a los profesores gestionar dichas solicitudes.

## 📋 Tabla de Contenidos

- [Información General](#información-general)
- [Rutas Disponibles](#rutas-disponibles)
- [Autenticación y Roles](#autenticación-y-roles)
- [Estados de las Solicitudes](#estados-de-las-solicitudes)
- [Endpoints Detallados](#endpoints-detallados)
  - [Crear Solicitud (Estudiante)](#crear-solicitud-estudiante)
  - [Mis Solicitudes (Estudiante)](#mis-solicitudes-estudiante)
  - [Solicitudes Pendientes (Profesor)](#solicitudes-pendientes-profesor)
  - [Aprobar Solicitud (Profesor)](#aprobar-solicitud-profesor)
  - [Rechazar Solicitud (Profesor)](#rechazar-solicitud-profesor)
  - [Cancelar Solicitud](#cancelar-solicitud)
  - [Horarios Disponibles](#horarios-disponibles)
- [TypeScript Types](#typescript-types)
- [Implementación en React](#implementación-en-react)
- [Manejo de Errores](#manejo-de-errores)
- [Casos de Uso](#casos-de-uso)

---

## 🔍 Información General

### ¿Qué son las Advisory Requests?

Las **Advisory Requests** son solicitudes que los estudiantes envían a los profesores para pedir asesorías en materias específicas. El flujo es:

1. **Estudiante** crea una solicitud para una materia impartida por un profesor
2. **Profesor** recibe la solicitud y puede aprobarla o rechazarla
3. Si se **aprueba**, se puede programar una sesión de asesoría
4. Ambas partes pueden **cancelar** la solicitud

---

## 🛣️ Rutas Disponibles

### ⚠️ Rutas Correctas vs Incorrectas

| ❌ Ruta Incorrecta | ✅ Ruta Correcta | Descripción |
|-------------------|-----------------|-------------|
| `/advisory-requests/professor/pending` | `/advisory-requests/pending` | Solicitudes pendientes del profesor |
| `/advisory-requests/student/my-requests` | `/advisory-requests/my-requests` | Solicitudes del estudiante |

**Base URL**: `http://localhost:3000/advisory-requests`

### Tabla de Endpoints

| Método | Ruta | Rol Requerido | Descripción |
|--------|------|---------------|-------------|
| `POST` | `/advisory-requests` | `STUDENT` | Crear nueva solicitud |
| `GET` | `/advisory-requests/my-requests` | `STUDENT` | Ver mis solicitudes |
| `GET` | `/advisory-requests/pending` | `PROFESSOR` | Ver solicitudes pendientes |
| `PATCH` | `/advisory-requests/:id/approve` | `PROFESSOR` | Aprobar solicitud |
| `PATCH` | `/advisory-requests/:id/reject` | `PROFESSOR` | Rechazar solicitud |
| `DELETE` | `/advisory-requests/:id/cancel` | `STUDENT` o `PROFESSOR` | Cancelar solicitud |
| `GET` | `/advisory-requests/available-schedules/:subjectDetailId` | `STUDENT` | Ver horarios disponibles |

---

## 🔐 Autenticación y Roles

Todos los endpoints requieren:
- **Token JWT** en header `Authorization: Bearer {token}`
- **Rol específico** según el endpoint

```typescript
// Headers requeridos en todas las peticiones
const config = {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
};
```

---

## 📊 Estados de las Solicitudes

```typescript
enum RequestStatus {
  PENDING = 'pending',      // Recién creada, esperando respuesta
  APPROVED = 'approved',    // Aprobada por el profesor
  REJECTED = 'rejected',    // Rechazada por el profesor
  CANCELLED = 'cancelled'   // Cancelada por estudiante o profesor
}
```

### Flujo de Estados

```
┌─────────┐
│ PENDING │ ──────────────────────────┐
└────┬────┘                           │
     │                                │
     ├──> APPROVED (profesor aprueba)│
     │                                │ CANCELLED
     ├──> REJECTED (profesor rechaza)│ (ambos pueden cancelar)
     │                                │
     └────────────────────────────────┘
```

---

## 📡 Endpoints Detallados

### Crear Solicitud (Estudiante)

#### `POST /advisory-requests`

Permite a un estudiante crear una nueva solicitud de asesoría.

**Rol requerido**: `STUDENT`

#### Request Body

```typescript
{
  "subject_detail_id": 1,
  "student_message": "Necesito ayuda con límites en cálculo diferencial"
}
```

#### Respuesta Exitosa (201 Created)

```json
{
  "request_id": 1,
  "student_id": 5,
  "professor_id": 2,
  "subject_detail_id": 1,
  "status": "pending",
  "student_message": "Necesito ayuda con límites en cálculo diferencial",
  "professor_response": null,
  "processed_at": null,
  "processed_by_id": null,
  "created_at": "2025-11-23T10:00:00Z",
  "updated_at": "2025-11-23T10:00:00Z",
  "student": {
    "user_id": 5,
    "name": "María",
    "last_name": "González",
    "email": "maria.gonzalez@university.edu",
    "student_id": "ST2024001"
  },
  "professor": {
    "user_id": 2,
    "name": "Juan",
    "last_name": "Pérez",
    "email": "juan.perez@university.edu",
    "employee_id": "PR2024001"
  },
  "subject_detail": {
    "subject_detail_id": 1,
    "subject": {
      "subject_id": 1,
      "subject": "Cálculo Diferencial"
    }
  }
}
```

#### Errores Posibles

| Código | Descripción |
|--------|-------------|
| `400` | Ya existe una solicitud pendiente para esta materia |
| `403` | Solo los estudiantes pueden crear solicitudes |
| `404` | La materia especificada no existe |

---

### Mis Solicitudes (Estudiante)

#### `GET /advisory-requests/my-requests`

Obtiene todas las solicitudes del estudiante autenticado.

**Rol requerido**: `STUDENT`

#### Respuesta Exitosa (200 OK)

```json
[
  {
    "request_id": 1,
    "student_id": 5,
    "professor_id": 2,
    "subject_detail_id": 1,
    "status": "pending",
    "student_message": "Necesito ayuda con límites",
    "professor_response": null,
    "processed_at": null,
    "created_at": "2025-11-23T10:00:00Z",
    "updated_at": "2025-11-23T10:00:00Z",
    "professor": {
      "user_id": 2,
      "name": "Juan",
      "last_name": "Pérez",
      "email": "juan.perez@university.edu",
      "employee_id": "PR2024001"
    },
    "subject_detail": {
      "subject_detail_id": 1,
      "subject": {
        "subject_id": 1,
        "subject": "Cálculo Diferencial"
      }
    }
  },
  {
    "request_id": 2,
    "student_id": 5,
    "professor_id": 3,
    "subject_detail_id": 2,
    "status": "approved",
    "student_message": "Necesito repasar matrices",
    "professor_response": "Te espero el lunes a las 10 AM",
    "processed_at": "2025-11-22T14:00:00Z",
    "created_at": "2025-11-22T09:00:00Z",
    "updated_at": "2025-11-22T14:00:00Z",
    "professor": {
      "user_id": 3,
      "name": "Ana",
      "last_name": "Martínez",
      "email": "ana.martinez@university.edu",
      "employee_id": "PR2024002"
    },
    "subject_detail": {
      "subject_detail_id": 2,
      "subject": {
        "subject_id": 2,
        "subject": "Álgebra Lineal"
      }
    }
  }
]
```

---

### Solicitudes Pendientes (Profesor)

#### `GET /advisory-requests/pending`

⚠️ **Nota**: Esta es la ruta correcta, **NO** `/advisory-requests/professor/pending`

Obtiene todas las solicitudes pendientes dirigidas al profesor autenticado.

**Rol requerido**: `PROFESSOR`

#### Query Parameters

Aunque no están implementados actualmente, aquí están las sugerencias para filtrado:

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `page` | number | Número de página | `?page=1` |
| `limit` | number | Resultados por página | `?limit=10` |

**Nota**: Los parámetros `page` y `limit` actualmente **NO** están implementados en el backend. Si los necesitas, habría que agregar paginación al endpoint.

#### Respuesta Exitosa (200 OK)

```json
[
  {
    "request_id": 3,
    "student_id": 6,
    "professor_id": 2,
    "subject_detail_id": 1,
    "status": "pending",
    "student_message": "Tengo dudas sobre derivadas",
    "professor_response": null,
    "processed_at": null,
    "created_at": "2025-11-23T11:00:00Z",
    "updated_at": "2025-11-23T11:00:00Z",
    "student": {
      "user_id": 6,
      "name": "Carlos",
      "last_name": "Ramírez",
      "email": "carlos.ramirez@university.edu",
      "student_id": "ST2024002"
    },
    "subject_detail": {
      "subject_detail_id": 1,
      "subject": {
        "subject_id": 1,
        "subject": "Cálculo Diferencial"
      }
    }
  }
]
```

---

### Aprobar Solicitud (Profesor)

#### `PATCH /advisory-requests/:id/approve`

Permite a un profesor aprobar una solicitud pendiente.

**Rol requerido**: `PROFESSOR`

#### URL Parameters

- `id` (number): ID de la solicitud

#### Request Body

```typescript
{
  "professor_response": "Solicitud aprobada. Te veré el lunes a las 10:00 AM en mi oficina.",
  "proposed_date": "2025-11-25T10:00:00Z" // Opcional
}
```

#### Respuesta Exitosa (200 OK)

```json
{
  "request_id": 3,
  "student_id": 6,
  "professor_id": 2,
  "subject_detail_id": 1,
  "status": "approved",
  "student_message": "Tengo dudas sobre derivadas",
  "professor_response": "Solicitud aprobada. Te veré el lunes a las 10:00 AM en mi oficina.",
  "processed_at": "2025-11-23T12:00:00Z",
  "processed_by_id": 2,
  "created_at": "2025-11-23T11:00:00Z",
  "updated_at": "2025-11-23T12:00:00Z",
  "student": {
    "user_id": 6,
    "name": "Carlos",
    "last_name": "Ramírez",
    "email": "carlos.ramirez@university.edu",
    "student_id": "ST2024002"
  },
  "subject_detail": {
    "subject_detail_id": 1,
    "subject": {
      "subject_id": 1,
      "subject": "Cálculo Diferencial"
    }
  }
}
```

#### Errores Posibles

| Código | Descripción |
|--------|-------------|
| `400` | Solo se pueden aprobar solicitudes pendientes |
| `403` | No tienes permisos para procesar esta solicitud |
| `404` | Solicitud no encontrada |

---

### Rechazar Solicitud (Profesor)

#### `PATCH /advisory-requests/:id/reject`

Permite a un profesor rechazar una solicitud pendiente.

**Rol requerido**: `PROFESSOR`

#### URL Parameters

- `id` (number): ID de la solicitud

#### Request Body

```typescript
{
  "professor_response": "Lo siento, no tengo disponibilidad en las fechas solicitadas."
}
```

#### Respuesta Exitosa (200 OK)

```json
{
  "request_id": 3,
  "student_id": 6,
  "professor_id": 2,
  "subject_detail_id": 1,
  "status": "rejected",
  "student_message": "Tengo dudas sobre derivadas",
  "professor_response": "Lo siento, no tengo disponibilidad en las fechas solicitadas.",
  "processed_at": "2025-11-23T12:00:00Z",
  "processed_by_id": 2,
  "created_at": "2025-11-23T11:00:00Z",
  "updated_at": "2025-11-23T12:00:00Z"
}
```

---

### Cancelar Solicitud

#### `DELETE /advisory-requests/:id/cancel`

Permite cancelar una solicitud (tanto estudiante como profesor pueden hacerlo).

**Roles permitidos**: `STUDENT`, `PROFESSOR`

#### URL Parameters

- `id` (number): ID de la solicitud

#### Respuesta Exitosa (200 OK)

```json
{
  "request_id": 3,
  "status": "cancelled",
  "processed_at": "2025-11-23T12:30:00Z",
  "processed_by_id": 6
}
```

#### Errores Posibles

| Código | Descripción |
|--------|-------------|
| `400` | No se puede cancelar una solicitud en este estado |
| `403` | No tienes permisos para cancelar esta solicitud |
| `404` | Solicitud no encontrada |

**Reglas**:
- Solo se pueden cancelar solicitudes con estado `PENDING` o `APPROVED`
- Solo el estudiante que creó la solicitud o el profesor asignado pueden cancelarla

---

### Horarios Disponibles

#### `GET /advisory-requests/available-schedules/:subjectDetailId`

Consulta los horarios disponibles de un profesor para una materia específica.

**Rol requerido**: `STUDENT`

#### URL Parameters

- `subjectDetailId` (number): ID del detalle de materia

#### Query Parameters

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|-----------|-------------|---------|
| `dateFrom` | string | No | Fecha inicio (YYYY-MM-DD) | `2025-11-25` |
| `dateTo` | string | No | Fecha fin (YYYY-MM-DD) | `2025-12-25` |

**Ejemplo de URL completa**:
```
GET /advisory-requests/available-schedules/1?dateFrom=2025-11-25&dateTo=2025-12-10
```

#### Respuesta Exitosa (200 OK)

```json
{
  "subject_detail": {
    "subject_detail_id": 1,
    "subject_name": "Cálculo Diferencial",
    "professor": {
      "user_id": 2,
      "name": "Juan",
      "last_name": "Pérez"
    }
  },
  "available_dates": [
    {
      "date": "2025-11-25",
      "slots": [
        {
          "availability_id": 1,
          "start_time": "10:00",
          "end_time": "12:00",
          "available_spots": 5,
          "max_students": 5
        },
        {
          "availability_id": 2,
          "start_time": "14:00",
          "end_time": "16:00",
          "available_spots": 3,
          "max_students": 5
        }
      ]
    },
    {
      "date": "2025-11-27",
      "slots": [
        {
          "availability_id": 3,
          "start_time": "09:00",
          "end_time": "11:00",
          "available_spots": 5,
          "max_students": 5
        }
      ]
    }
  ]
}
```

---

## 📝 TypeScript Types

### Tipos Base

```typescript
// ============================================
// ENUMS
// ============================================

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

// ============================================
// DTOs
// ============================================

export interface CreateAdvisoryRequestDto {
  subject_detail_id: number;
  student_message?: string;
}

export interface ApproveRequestDto {
  professor_response: string;
  proposed_date?: string; // ISO string
}

export interface RejectRequestDto {
  professor_response: string;
}

// ============================================
// RESPONSE TYPES
// ============================================

export interface StudentInfo {
  user_id: number;
  name: string;
  last_name: string;
  email: string;
  student_id: string;
}

export interface ProfessorInfo {
  user_id: number;
  name: string;
  last_name: string;
  email: string;
  employee_id: string;
}

export interface SubjectDetailInfo {
  subject_detail_id: number;
  subject: {
    subject_id: number;
    subject: string;
  };
}

export interface AdvisoryRequest {
  request_id: number;
  student_id: number;
  professor_id: number;
  subject_detail_id: number;
  status: RequestStatus;
  student_message: string | null;
  professor_response: string | null;
  processed_at: string | null;
  processed_by_id: number | null;
  created_at: string;
  updated_at: string;
  
  // Relaciones opcionales
  student?: StudentInfo;
  professor?: ProfessorInfo;
  subject_detail?: SubjectDetailInfo;
}

// ============================================
// AVAILABLE SCHEDULES TYPES
// ============================================

export interface TimeSlot {
  availability_id: number;
  start_time: string;
  end_time: string;
  available_spots: number;
  max_students: number;
}

export interface AvailableDate {
  date: string; // YYYY-MM-DD
  slots: TimeSlot[];
}

export interface AvailableSchedulesResponse {
  subject_detail: {
    subject_detail_id: number;
    subject_name: string;
    professor: {
      user_id: number;
      name: string;
      last_name: string;
    };
  };
  available_dates: AvailableDate[];
}
```

---

## 🛠️ Implementación en React

### 1. Servicio API (advisoryRequestsService.ts)

```typescript
import axios from 'axios';
import type {
  AdvisoryRequest,
  CreateAdvisoryRequestDto,
  ApproveRequestDto,
  RejectRequestDto,
  AvailableSchedulesResponse,
} from './types/advisory-requests.types';

const API_BASE_URL = 'http://localhost:3000/advisory-requests';

class AdvisoryRequestsService {
  /**
   * Crear nueva solicitud de asesoría (ESTUDIANTE)
   */
  async createRequest(
    accessToken: string,
    data: CreateAdvisoryRequestDto
  ): Promise<AdvisoryRequest> {
    const response = await axios.post<AdvisoryRequest>(
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
   * Obtener mis solicitudes (ESTUDIANTE)
   */
  async getMyRequests(accessToken: string): Promise<AdvisoryRequest[]> {
    const response = await axios.get<AdvisoryRequest[]>(
      `${API_BASE_URL}/my-requests`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Obtener solicitudes pendientes (PROFESOR)
   * ⚠️ RUTA CORRECTA: /pending (sin /professor)
   */
  async getPendingRequests(accessToken: string): Promise<AdvisoryRequest[]> {
    const response = await axios.get<AdvisoryRequest[]>(
      `${API_BASE_URL}/pending`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Aprobar solicitud (PROFESOR)
   */
  async approveRequest(
    accessToken: string,
    requestId: number,
    data: ApproveRequestDto
  ): Promise<AdvisoryRequest> {
    const response = await axios.patch<AdvisoryRequest>(
      `${API_BASE_URL}/${requestId}/approve`,
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
   * Rechazar solicitud (PROFESOR)
   */
  async rejectRequest(
    accessToken: string,
    requestId: number,
    data: RejectRequestDto
  ): Promise<AdvisoryRequest> {
    const response = await axios.patch<AdvisoryRequest>(
      `${API_BASE_URL}/${requestId}/reject`,
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
   * Cancelar solicitud (ESTUDIANTE o PROFESOR)
   */
  async cancelRequest(
    accessToken: string,
    requestId: number
  ): Promise<AdvisoryRequest> {
    const response = await axios.delete<AdvisoryRequest>(
      `${API_BASE_URL}/${requestId}/cancel`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Obtener horarios disponibles para una materia (ESTUDIANTE)
   */
  async getAvailableSchedules(
    accessToken: string,
    subjectDetailId: number,
    dateFrom?: string,
    dateTo?: string
  ): Promise<AvailableSchedulesResponse> {
    const params = new URLSearchParams();
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);

    const response = await axios.get<AvailableSchedulesResponse>(
      `${API_BASE_URL}/available-schedules/${subjectDetailId}?${params}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }
}

export const advisoryRequestsService = new AdvisoryRequestsService();
```

---

### 2. Hook para Solicitudes Pendientes (Profesor)

```typescript
import { useState, useEffect } from 'react';
import { advisoryRequestsService } from '../services/advisoryRequestsService';
import type { AdvisoryRequest } from '../types/advisory-requests.types';

interface UsePendingRequestsResult {
  requests: AdvisoryRequest[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const usePendingRequests = (
  accessToken: string | null
): UsePendingRequestsResult => {
  const [requests, setRequests] = useState<AdvisoryRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    if (!accessToken) {
      setError('No hay token de autenticación');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await advisoryRequestsService.getPendingRequests(
        accessToken
      );
      setRequests(data);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('No tienes permisos para ver solicitudes pendientes');
      } else if (err.response?.status === 401) {
        setError('Token inválido o expirado');
      } else {
        setError('Error al cargar las solicitudes');
      }
      console.error('Error fetching pending requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [accessToken]);

  return { requests, loading, error, refetch: fetchRequests };
};
```

---

### 3. Componente para Solicitudes Pendientes (Profesor)

```typescript
import React, { useState } from 'react';
import { usePendingRequests } from '../hooks/usePendingRequests';
import { advisoryRequestsService } from '../services/advisoryRequestsService';
import { useAuth } from '../contexts/AuthContext';
import type { AdvisoryRequest } from '../types/advisory-requests.types';

export const ProfessorPendingRequests: React.FC = () => {
  const { accessToken } = useAuth();
  const { requests, loading, error, refetch } = usePendingRequests(accessToken);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const handleApprove = async (requestId: number) => {
    if (!accessToken) return;

    const response = prompt('Escribe un mensaje de aprobación:');
    if (!response) return;

    setProcessingId(requestId);
    try {
      await advisoryRequestsService.approveRequest(accessToken, requestId, {
        professor_response: response,
      });
      await refetch();
      alert('Solicitud aprobada exitosamente');
    } catch (err: any) {
      alert(
        err.response?.data?.message || 'Error al aprobar la solicitud'
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: number) => {
    if (!accessToken) return;

    const response = prompt('Escribe el motivo del rechazo:');
    if (!response) return;

    setProcessingId(requestId);
    try {
      await advisoryRequestsService.rejectRequest(accessToken, requestId, {
        professor_response: response,
      });
      await refetch();
      alert('Solicitud rechazada');
    } catch (err: any) {
      alert(
        err.response?.data?.message || 'Error al rechazar la solicitud'
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="spinner">Cargando solicitudes...</div>
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

  if (requests.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p className="text-xl">📭 No tienes solicitudes pendientes</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Solicitudes Pendientes</h1>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          🔄 Actualizar
        </button>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <RequestCard
            key={request.request_id}
            request={request}
            onApprove={() => handleApprove(request.request_id)}
            onReject={() => handleReject(request.request_id)}
            isProcessing={processingId === request.request_id}
          />
        ))}
      </div>
    </div>
  );
};

// Componente auxiliar para cada tarjeta de solicitud
interface RequestCardProps {
  request: AdvisoryRequest;
  onApprove: () => void;
  onReject: () => void;
  isProcessing: boolean;
}

const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onApprove,
  onReject,
  isProcessing,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {request.subject_detail?.subject.subject}
          </h3>
          <p className="text-sm text-gray-500">
            Solicitud #{request.request_id}
          </p>
        </div>
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
          {request.status}
        </span>
      </div>

      {/* Estudiante */}
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <p className="text-sm font-semibold text-gray-700 mb-1">
          👨‍🎓 Estudiante
        </p>
        <p className="text-gray-900">
          {request.student?.name} {request.student?.last_name}
        </p>
        <p className="text-sm text-gray-600">{request.student?.email}</p>
        <p className="text-sm text-gray-600">
          ID: {request.student?.student_id}
        </p>
      </div>

      {/* Mensaje del estudiante */}
      {request.student_message && (
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-1">
            💬 Mensaje del estudiante
          </p>
          <p className="text-gray-800 italic bg-blue-50 p-3 rounded">
            "{request.student_message}"
          </p>
        </div>
      )}

      {/* Fecha */}
      <p className="text-sm text-gray-500 mb-4">
        📅 Solicitado el{' '}
        {new Date(request.created_at).toLocaleString('es-MX')}
      </p>

      {/* Botones de acción */}
      <div className="flex gap-3">
        <button
          onClick={onApprove}
          disabled={isProcessing}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isProcessing ? '⏳ Procesando...' : '✅ Aprobar'}
        </button>
        <button
          onClick={onReject}
          disabled={isProcessing}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isProcessing ? '⏳ Procesando...' : '❌ Rechazar'}
        </button>
      </div>
    </div>
  );
};
```

---

### 4. Componente para Mis Solicitudes (Estudiante)

```typescript
import React from 'react';
import { useMyRequests } from '../hooks/useMyRequests';
import { advisoryRequestsService } from '../services/advisoryRequestsService';
import { useAuth } from '../contexts/AuthContext';
import { RequestStatus } from '../types/advisory-requests.types';

export const StudentMyRequests: React.FC = () => {
  const { accessToken } = useAuth();
  const { requests, loading, error, refetch } = useMyRequests(accessToken);

  const handleCancel = async (requestId: number) => {
    if (!accessToken) return;
    if (!confirm('¿Estás seguro de cancelar esta solicitud?')) return;

    try {
      await advisoryRequestsService.cancelRequest(accessToken, requestId);
      await refetch();
      alert('Solicitud cancelada');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al cancelar');
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold mb-6">Mis Solicitudes</h1>

      {requests.length === 0 ? (
        <p className="text-center text-gray-500">
          No has creado ninguna solicitud aún
        </p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.request_id}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-semibold">
                    {request.subject_detail?.subject.subject}
                  </h3>
                  <p className="text-gray-600">
                    Profesor: {request.professor?.name}{' '}
                    {request.professor?.last_name}
                  </p>
                </div>
                <StatusBadge status={request.status} />
              </div>

              {request.student_message && (
                <p className="text-sm text-gray-700 mb-2">
                  Tu mensaje: "{request.student_message}"
                </p>
              )}

              {request.professor_response && (
                <div className="bg-blue-50 p-3 rounded mb-3">
                  <p className="text-sm font-semibold">
                    Respuesta del profesor:
                  </p>
                  <p className="text-sm">"{request.professor_response}"</p>
                </div>
              )}

              <p className="text-xs text-gray-500 mb-3">
                Creada: {new Date(request.created_at).toLocaleString('es-MX')}
              </p>

              {/* Solo mostrar botón de cancelar si está PENDING o APPROVED */}
              {[RequestStatus.PENDING, RequestStatus.APPROVED].includes(
                request.status
              ) && (
                <button
                  onClick={() => handleCancel(request.request_id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Cancelar Solicitud
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Componente para mostrar el estado
const StatusBadge: React.FC<{ status: RequestStatus }> = ({ status }) => {
  const styles = {
    [RequestStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [RequestStatus.APPROVED]: 'bg-green-100 text-green-800',
    [RequestStatus.REJECTED]: 'bg-red-100 text-red-800',
    [RequestStatus.CANCELLED]: 'bg-gray-100 text-gray-800',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
};
```

---

## 🚨 Manejo de Errores

### Errores Comunes

| Código | Error | Causa | Solución |
|--------|-------|-------|----------|
| `400` | Bad Request | Solicitud duplicada o estado inválido | Verificar que no existe solicitud pendiente para la misma materia |
| `401` | Unauthorized | Token inválido o expirado | Refrescar token o redirigir a login |
| `403` | Forbidden | Rol incorrecto | Verificar que el usuario tiene el rol correcto |
| `404` | Not Found | Recurso no encontrado | Verificar que el ID existe |

### Ejemplo de Manejo Robusto

```typescript
try {
  const request = await advisoryRequestsService.createRequest(
    accessToken,
    data
  );
  toast.success('Solicitud creada exitosamente');
  navigate('/my-requests');
} catch (error: any) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    switch (status) {
      case 400:
        if (message?.includes('pendiente')) {
          toast.error('Ya tienes una solicitud pendiente para esta materia');
        } else {
          toast.error(message || 'Datos inválidos');
        }
        break;
      case 403:
        toast.error('No tienes permisos para esta acción');
        break;
      case 404:
        toast.error('La materia no existe');
        break;
      default:
        toast.error('Error al crear la solicitud');
    }
  }
}
```

---

## 🎯 Casos de Uso

### Caso 1: Flujo Completo de Solicitud

```typescript
// 1. Estudiante crea solicitud
const newRequest = await advisoryRequestsService.createRequest(
  accessToken,
  {
    subject_detail_id: 1,
    student_message: 'Necesito ayuda con derivadas'
  }
);

// 2. Profesor ve solicitudes pendientes
const pendingRequests = await advisoryRequestsService.getPendingRequests(
  professorToken
);

// 3. Profesor aprueba la solicitud
const approved = await advisoryRequestsService.approveRequest(
  professorToken,
  newRequest.request_id,
  {
    professor_response: 'Te espero el lunes a las 10 AM',
    proposed_date: '2025-11-25T10:00:00Z'
  }
);

// 4. Estudiante verifica el estado
const myRequests = await advisoryRequestsService.getMyRequests(
  accessToken
);
```

### Caso 2: Implementación con Paginación (Futura)

Actualmente el endpoint `/advisory-requests/pending` **no soporta paginación**, pero aquí está cómo podrías implementarlo cuando se agregue:

```typescript
// NOTA: Esto NO funciona actualmente, es solo un ejemplo para el futuro
const getPendingRequestsPaginated = async (
  accessToken: string,
  page: number = 1,
  limit: number = 10
) => {
  // Esto dará 404 actualmente porque page y limit no están implementados
  const response = await axios.get(
    `${API_BASE_URL}/pending?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  );
  return response.data;
};
```

---

## ⚠️ Notas Importantes

### Diferencias Clave con Otras Rutas

1. **No hay prefijo de rol en las rutas**
   - ❌ `/advisory-requests/professor/pending`
   - ✅ `/advisory-requests/pending`

2. **El rol se determina por el token JWT**, no por la URL

3. **Paginación no implementada** en `/pending`
   - Los parámetros `?page=1&limit=10` actualmente se ignoran
   - Si necesitas paginación, habría que modificar el backend

### Notificaciones por Email

El sistema envía automáticamente emails cuando:
- ✉️ Estudiante crea una solicitud → Email al profesor
- ✉️ Profesor aprueba → Email al estudiante
- ✉️ Profesor rechaza → Email al estudiante  
- ✉️ Alguien cancela → Email a la otra parte

---

## 📚 Recursos Adicionales

### Documentación Relacionada

- [Dashboard API Guide](./DASHBOARD_API_GUIDE.md)
- [Venues API Guide](./VENUES_API_GUIDE.md)
- [User Profile API Guide](./USER_PROFILE_API_GUIDE.md)

### Endpoints Relacionados

- **Subject Details**: Para obtener la lista de materias disponibles
- **Professor Availability**: Para ver disponibilidad del profesor
- **Advisories**: Para gestionar las asesorías programadas

---

**Última actualización**: Noviembre 23, 2025  
**Versión del API**: 1.0.0  
**Autor**: GitHub Copilot
