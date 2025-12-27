# Professor Availability API - Guía de Integración Frontend

## 📋 Índice

1. [Introducción](#introducción)
2. [Modelo de Datos](#modelo-de-datos)
3. [Endpoints Disponibles](#endpoints-disponibles)
4. [Permisos y Autenticación](#permisos-y-autenticación)
5. [Ejemplos de Uso Frontend](#ejemplos-de-uso-frontend)
6. [Casos de Uso Comunes](#casos-de-uso-comunes)
7. [Validaciones y Reglas de Negocio](#validaciones-y-reglas-de-negocio)

---

## Introducción

El módulo **Professor Availability** permite a los profesores gestionar sus horarios de disponibilidad para asesorías. Los profesores pueden definir bloques de tiempo recurrentes o específicos en los que están disponibles para atender estudiantes.

### Características Principales

- ✅ Creación de horarios de disponibilidad por día de la semana
- ✅ Soporte para disponibilidad general o específica por materia
- ✅ Control de capacidad (máximo de estudiantes por slot)
- ✅ Gestión de horarios recurrentes o de fecha específica
- ✅ Prevención de conflictos de horarios
- ✅ Consulta de slots disponibles para reserva
- ✅ Activación/desactivación de horarios sin eliminarlos

---

## Modelo de Datos

### Entidad `ProfessorAvailability`

```typescript
interface ProfessorAvailability {
  availability_id: number;
  professor_id: number;
  subject_detail_id?: number;        // Opcional: para disponibilidad específica de materia
  day_of_week: WeekDay;              // MONDAY, TUESDAY, etc.
  start_time: string;                // Formato: "HH:mm" (ej: "09:00")
  end_time: string;                  // Formato: "HH:mm" (ej: "12:00")
  max_students_per_slot: number;     // Máximo de estudiantes (1-50)
  slot_duration_minutes: number;     // Duración de cada slot (15-180 minutos)
  is_active: boolean;                // Si el horario está activo
  is_recurring: boolean;             // Si se repite semanalmente
  effective_from?: Date;             // Fecha desde cuando aplica
  effective_until?: Date;            // Fecha hasta cuando aplica
  notes?: string;                    // Notas adicionales
  created_at: Date;
  updated_at: Date;
}
```

### Enum `WeekDay`

```typescript
enum WeekDay {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}
```

### DTO de Respuesta con Información Adicional

```typescript
interface AvailabilitySlotResponse {
  // Campos básicos de la entidad
  availability_id: number;
  professor_id: number;
  subject_detail_id?: number;
  day_of_week: WeekDay;
  start_time: string;
  end_time: string;
  max_students_per_slot: number;
  slot_duration_minutes: number;
  is_active: boolean;
  is_recurring: boolean;
  effective_from?: Date;
  effective_until?: Date;
  notes?: string;
  created_at: Date;
  updated_at: Date;

  // Información adicional poblada
  professor?: {
    user_id: number;
    name: string;
    last_name: string;
    email: string;
  };

  subject_detail?: {
    subject_detail_id: number;
    subject_name: string;
  };

  // Estadísticas calculadas
  current_bookings?: number;         // Reservas actuales
  available_spots?: number;          // Espacios disponibles
}
```

---

## Endpoints Disponibles

### Resumen de Rutas

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| POST | `/professor-availability/slots` | PROFESSOR | Crear un slot de disponibilidad |
| POST | `/professor-availability/bulk-slots` | PROFESSOR | Crear múltiples slots a la vez |
| GET | `/professor-availability/slots` | ALL | Obtener disponibilidad de un profesor |
| GET | `/professor-availability/available-slots/:professorId/:subjectDetailId` | ALL | Obtener slots disponibles para una fecha |
| GET | `/professor-availability/my-availability` | PROFESSOR | Obtener mi disponibilidad |
| PUT | `/professor-availability/slots/:id` | PROFESSOR | Actualizar un slot |
| DELETE | `/professor-availability/slots/:id/deactivate` | PROFESSOR | Desactivar un slot |
| DELETE | `/professor-availability/slots/:id` | PROFESSOR | Eliminar un slot permanentemente |

---

## Permisos y Autenticación

### Autenticación Requerida

**Todos los endpoints requieren autenticación** mediante JWT Bearer Token:

```typescript
headers: {
  'Authorization': 'Bearer <JWT_TOKEN>'
}
```

### Matriz de Permisos

| Endpoint | ADMIN | PROFESSOR | STUDENT |
|----------|-------|-----------|---------|
| POST `/slots` | ❌ | ✅ | ❌ |
| POST `/bulk-slots` | ❌ | ✅ | ❌ |
| GET `/slots` | ✅ | ✅ | ✅ |
| GET `/available-slots/:id/:subjectId` | ✅ | ✅ | ✅ |
| GET `/my-availability` | ❌ | ✅ | ❌ |
| PUT `/slots/:id` | ❌ | ✅ | ❌ |
| DELETE `/slots/:id/deactivate` | ❌ | ✅ | ❌ |
| DELETE `/slots/:id` | ❌ | ✅ | ❌ |

**Nota**: Los profesores solo pueden crear, modificar y eliminar su propia disponibilidad.

---

## Endpoints Detallados

### 1. Crear Slot de Disponibilidad

**POST** `/professor-availability/slots`

Crea un nuevo horario de disponibilidad para el profesor autenticado.

#### Request Body

```typescript
{
  "subject_detail_id": 5,              // Opcional: ID de la materia
  "day_of_week": "MONDAY",             // Día de la semana
  "start_time": "09:00",               // Hora de inicio
  "end_time": "12:00",                 // Hora de fin
  "max_students_per_slot": 5,          // Máximo de estudiantes
  "slot_duration_minutes": 30,         // Duración de cada slot
  "is_recurring": true,                // Si se repite semanalmente
  "effective_from": "2024-01-01",      // Opcional: fecha de inicio
  "effective_until": "2024-12-31",     // Opcional: fecha de fin
  "notes": "Solo asesorías presenciales" // Opcional: notas
}
```

#### Response

```typescript
{
  "availability_id": 15,
  "professor_id": 3,
  "subject_detail_id": 5,
  "day_of_week": "MONDAY",
  "start_time": "09:00",
  "end_time": "12:00",
  "max_students_per_slot": 5,
  "slot_duration_minutes": 30,
  "is_active": true,
  "is_recurring": true,
  "effective_from": "2024-01-01T00:00:00.000Z",
  "effective_until": "2024-12-31T00:00:00.000Z",
  "notes": "Solo asesorías presenciales",
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z",
  "professor": {
    "user_id": 3,
    "name": "Juan",
    "last_name": "Pérez",
    "email": "juan.perez@itson.edu.mx"
  },
  "subject_detail": {
    "subject_detail_id": 5,
    "subject_name": "Cálculo Diferencial"
  }
}
```

#### Validaciones

- ✅ `start_time` y `end_time` deben estar en formato `HH:mm` (24 horas)
- ✅ `end_time` debe ser mayor que `start_time`
- ✅ `max_students_per_slot`: entre 1 y 50
- ✅ `slot_duration_minutes`: entre 15 y 180
- ✅ No puede haber solapamiento con otros horarios del mismo profesor en el mismo día
- ✅ Si se especifica `subject_detail_id`, debe ser una materia asignada al profesor

---

### 2. Crear Múltiples Slots (Bulk Create)

**POST** `/professor-availability/bulk-slots`

Crea múltiples horarios de disponibilidad en una sola petición.

#### Request Body

```typescript
{
  "slots": [
    {
      "day_of_week": "MONDAY",
      "start_time": "09:00",
      "end_time": "12:00",
      "max_students_per_slot": 5,
      "slot_duration_minutes": 30,
      "is_recurring": true
    },
    {
      "day_of_week": "WEDNESDAY",
      "start_time": "14:00",
      "end_time": "17:00",
      "max_students_per_slot": 3,
      "slot_duration_minutes": 45,
      "is_recurring": true
    }
  ]
}
```

#### Response

```typescript
[
  {
    "availability_id": 15,
    "day_of_week": "MONDAY",
    "start_time": "09:00",
    "end_time": "12:00",
    // ... resto de campos
  },
  {
    "availability_id": 16,
    "day_of_week": "WEDNESDAY",
    "start_time": "14:00",
    "end_time": "17:00",
    // ... resto de campos
  }
]
```

---

### 3. Obtener Disponibilidad de un Profesor

**GET** `/professor-availability/slots`

Consulta los horarios de disponibilidad de un profesor con filtros opcionales.

#### Query Parameters

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `professor_id` | number | ✅ | ID del profesor |
| `subject_detail_id` | number | ❌ | Filtrar por materia específica |
| `day_of_week` | WeekDay | ❌ | Filtrar por día de la semana |
| `date` | string | ❌ | Filtrar por fecha específica (YYYY-MM-DD) |

#### Ejemplos de Uso

**Obtener toda la disponibilidad de un profesor:**
```
GET /professor-availability/slots?professor_id=3
```

**Disponibilidad para una materia específica:**
```
GET /professor-availability/slots?professor_id=3&subject_detail_id=5
```

**Disponibilidad de un día específico:**
```
GET /professor-availability/slots?professor_id=3&day_of_week=MONDAY
```

**Disponibilidad efectiva en una fecha:**
```
GET /professor-availability/slots?professor_id=3&date=2024-03-15
```

#### Response

```typescript
[
  {
    "availability_id": 15,
    "professor_id": 3,
    "subject_detail_id": 5,
    "day_of_week": "MONDAY",
    "start_time": "09:00",
    "end_time": "12:00",
    "max_students_per_slot": 5,
    "slot_duration_minutes": 30,
    "is_active": true,
    "is_recurring": true,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z",
    "professor": {
      "user_id": 3,
      "name": "Juan",
      "last_name": "Pérez",
      "email": "juan.perez@itson.edu.mx"
    },
    "subject_detail": {
      "subject_detail_id": 5,
      "subject_name": "Cálculo Diferencial"
    },
    "current_bookings": 2,        // Reservas actuales
    "available_spots": 3          // Espacios disponibles
  }
]
```

**Nota**: Los resultados se ordenan por `day_of_week` y luego por `start_time` ascendente.

---

### 4. Obtener Slots Disponibles para Reserva

**GET** `/professor-availability/available-slots/:professorId/:subjectDetailId`

Obtiene los slots específicos disponibles para reservar en una fecha determinada.

#### Path Parameters

- `professorId` (number): ID del profesor
- `subjectDetailId` (number): ID del detalle de materia

#### Query Parameters

- `date` (string, requerido): Fecha en formato YYYY-MM-DD (ej: "2024-03-15")

#### Ejemplo de Uso

```
GET /professor-availability/available-slots/3/5?date=2024-03-18
```

#### Response

```typescript
{
  "date": "2024-03-18",
  "slots": [
    {
      "availability_id": 15,
      "start_time": "09:00",
      "end_time": "12:00",
      "available_spots": 3,
      "max_students": 5
    },
    {
      "availability_id": 16,
      "start_time": "14:00",
      "end_time": "17:00",
      "available_spots": 2,
      "max_students": 3
    }
  ]
}
```

**Nota**: Solo devuelve slots que tengan espacios disponibles (`available_spots > 0`).

---

### 5. Obtener Mi Disponibilidad (Profesor Autenticado)

**GET** `/professor-availability/my-availability`

Consulta la disponibilidad del profesor autenticado. No requiere especificar `professor_id`.

#### Query Parameters (Todos Opcionales)

- `subject_detail_id` (number): Filtrar por materia
- `day_of_week` (WeekDay): Filtrar por día
- `date` (string): Filtrar por fecha (YYYY-MM-DD)

#### Ejemplo

```
GET /professor-availability/my-availability?day_of_week=MONDAY
```

#### Response

Mismo formato que el endpoint `/slots`.

---

### 6. Actualizar Slot de Disponibilidad

**PUT** `/professor-availability/slots/:id`

Actualiza un horario de disponibilidad existente.

#### Path Parameters

- `id` (number): ID del slot de disponibilidad

#### Request Body

Todos los campos son opcionales (solo se actualizan los proporcionados):

```typescript
{
  "day_of_week": "TUESDAY",
  "start_time": "10:00",
  "end_time": "13:00",
  "max_students_per_slot": 8,
  "slot_duration_minutes": 45,
  "notes": "Horario actualizado"
}
```

#### Response

```typescript
{
  "availability_id": 15,
  "day_of_week": "TUESDAY",
  "start_time": "10:00",
  "end_time": "13:00",
  "max_students_per_slot": 8,
  "slot_duration_minutes": 45,
  "notes": "Horario actualizado",
  // ... resto de campos actualizados
}
```

#### Validaciones

- ✅ Solo el profesor dueño puede actualizar el slot
- ✅ Si se modifican horarios, se valida que no haya conflictos
- ✅ Las mismas validaciones de formato que en la creación

---

### 7. Desactivar Slot de Disponibilidad

**DELETE** `/professor-availability/slots/:id/deactivate`

Desactiva un horario sin eliminarlo (mantiene el historial).

#### Path Parameters

- `id` (number): ID del slot de disponibilidad

#### Response

```
Status: 200 OK
```

**Nota**: El slot se marca como `is_active: false` pero no se elimina de la base de datos.

---

### 8. Eliminar Slot de Disponibilidad

**DELETE** `/professor-availability/slots/:id`

Elimina permanentemente un horario de disponibilidad.

#### Path Parameters

- `id` (number): ID del slot de disponibilidad

#### Response

```
Status: 200 OK
```

#### Restricciones

❌ **No se puede eliminar** si existen reservas futuras asociadas al slot.

En ese caso, se recomienda usar el endpoint `/deactivate` en su lugar.

---

## Ejemplos de Uso Frontend

### Servicio de API (TypeScript)

```typescript
// services/professorAvailabilityService.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export interface CreateAvailabilitySlot {
  subject_detail_id?: number;
  day_of_week: WeekDay;
  start_time: string;
  end_time: string;
  max_students_per_slot: number;
  slot_duration_minutes: number;
  is_recurring?: boolean;
  effective_from?: string;
  effective_until?: string;
  notes?: string;
}

export interface AvailabilitySlot {
  availability_id: number;
  professor_id: number;
  subject_detail_id?: number;
  day_of_week: WeekDay;
  start_time: string;
  end_time: string;
  max_students_per_slot: number;
  slot_duration_minutes: number;
  is_active: boolean;
  is_recurring: boolean;
  effective_from?: Date;
  effective_until?: Date;
  notes?: string;
  created_at: Date;
  updated_at: Date;
  professor?: {
    user_id: number;
    name: string;
    last_name: string;
    email: string;
  };
  subject_detail?: {
    subject_detail_id: number;
    subject_name: string;
  };
  current_bookings?: number;
  available_spots?: number;
}

export enum WeekDay {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}

export const professorAvailabilityService = {
  // Crear slot individual
  async createSlot(data: CreateAvailabilitySlot, token: string): Promise<AvailabilitySlot> {
    const response = await axios.post(
      `${API_BASE_URL}/professor-availability/slots`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Crear múltiples slots
  async createBulkSlots(slots: CreateAvailabilitySlot[], token: string): Promise<AvailabilitySlot[]> {
    const response = await axios.post(
      `${API_BASE_URL}/professor-availability/bulk-slots`,
      { slots },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Obtener disponibilidad de un profesor
  async getAvailability(params: {
    professor_id: number;
    subject_detail_id?: number;
    day_of_week?: WeekDay;
    date?: string;
  }): Promise<AvailabilitySlot[]> {
    const response = await axios.get(
      `${API_BASE_URL}/professor-availability/slots`,
      { params }
    );
    return response.data;
  },

  // Obtener mi disponibilidad (profesor autenticado)
  async getMyAvailability(
    token: string,
    params?: {
      subject_detail_id?: number;
      day_of_week?: WeekDay;
      date?: string;
    }
  ): Promise<AvailabilitySlot[]> {
    const response = await axios.get(
      `${API_BASE_URL}/professor-availability/my-availability`,
      {
        params,
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  },

  // Obtener slots disponibles para una fecha
  async getAvailableSlots(
    professorId: number,
    subjectDetailId: number,
    date: string
  ): Promise<{
    date: string;
    slots: Array<{
      availability_id: number;
      start_time: string;
      end_time: string;
      available_spots: number;
      max_students: number;
    }>;
  }> {
    const response = await axios.get(
      `${API_BASE_URL}/professor-availability/available-slots/${professorId}/${subjectDetailId}`,
      { params: { date } }
    );
    return response.data;
  },

  // Actualizar slot
  async updateSlot(
    availabilityId: number,
    data: Partial<CreateAvailabilitySlot>,
    token: string
  ): Promise<AvailabilitySlot> {
    const response = await axios.put(
      `${API_BASE_URL}/professor-availability/slots/${availabilityId}`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Desactivar slot
  async deactivateSlot(availabilityId: number, token: string): Promise<void> {
    await axios.delete(
      `${API_BASE_URL}/professor-availability/slots/${availabilityId}/deactivate`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },

  // Eliminar slot
  async deleteSlot(availabilityId: number, token: string): Promise<void> {
    await axios.delete(
      `${API_BASE_URL}/professor-availability/slots/${availabilityId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }
};
```

---

### Hooks de React Query

```typescript
// hooks/useProfessorAvailability.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { professorAvailabilityService } from '../services/professorAvailabilityService';
import type { CreateAvailabilitySlot, WeekDay } from '../services/professorAvailabilityService';

// Hook para obtener disponibilidad de un profesor
export function useProfessorAvailability(params: {
  professor_id: number;
  subject_detail_id?: number;
  day_of_week?: WeekDay;
  date?: string;
}) {
  return useQuery({
    queryKey: ['professor-availability', params],
    queryFn: () => professorAvailabilityService.getAvailability(params),
    enabled: !!params.professor_id,
  });
}

// Hook para obtener mi disponibilidad (profesor)
export function useMyAvailability(
  token: string,
  params?: {
    subject_detail_id?: number;
    day_of_week?: WeekDay;
    date?: string;
  }
) {
  return useQuery({
    queryKey: ['my-availability', params],
    queryFn: () => professorAvailabilityService.getMyAvailability(token, params),
    enabled: !!token,
  });
}

// Hook para obtener slots disponibles
export function useAvailableSlots(
  professorId: number,
  subjectDetailId: number,
  date: string
) {
  return useQuery({
    queryKey: ['available-slots', professorId, subjectDetailId, date],
    queryFn: () => professorAvailabilityService.getAvailableSlots(professorId, subjectDetailId, date),
    enabled: !!professorId && !!subjectDetailId && !!date,
  });
}

// Hook para crear slot
export function useCreateAvailabilitySlot(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAvailabilitySlot) =>
      professorAvailabilityService.createSlot(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-availability'] });
      queryClient.invalidateQueries({ queryKey: ['professor-availability'] });
    },
  });
}

// Hook para crear múltiples slots
export function useCreateBulkSlots(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slots: CreateAvailabilitySlot[]) =>
      professorAvailabilityService.createBulkSlots(slots, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-availability'] });
      queryClient.invalidateQueries({ queryKey: ['professor-availability'] });
    },
  });
}

// Hook para actualizar slot
export function useUpdateAvailabilitySlot(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateAvailabilitySlot> }) =>
      professorAvailabilityService.updateSlot(id, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-availability'] });
      queryClient.invalidateQueries({ queryKey: ['professor-availability'] });
    },
  });
}

// Hook para desactivar slot
export function useDeactivateSlot(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (availabilityId: number) =>
      professorAvailabilityService.deactivateSlot(availabilityId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-availability'] });
      queryClient.invalidateQueries({ queryKey: ['professor-availability'] });
    },
  });
}

// Hook para eliminar slot
export function useDeleteSlot(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (availabilityId: number) =>
      professorAvailabilityService.deleteSlot(availabilityId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-availability'] });
      queryClient.invalidateQueries({ queryKey: ['professor-availability'] });
    },
  });
}
```

---

### Componente de Ejemplo: Gestión de Disponibilidad

```typescript
// components/ManageAvailability.tsx
import React, { useState } from 'react';
import { useMyAvailability, useCreateAvailabilitySlot, useDeleteSlot } from '../hooks/useProfessorAvailability';
import { WeekDay } from '../services/professorAvailabilityService';

export const ManageAvailability: React.FC = () => {
  const token = localStorage.getItem('token') || '';
  const { data: availability, isLoading } = useMyAvailability(token);
  const createSlot = useCreateAvailabilitySlot(token);
  const deleteSlot = useDeleteSlot(token);

  const [formData, setFormData] = useState({
    day_of_week: WeekDay.MONDAY,
    start_time: '09:00',
    end_time: '12:00',
    max_students_per_slot: 5,
    slot_duration_minutes: 30,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSlot.mutateAsync(formData);
      alert('Horario creado exitosamente');
      // Reset form
      setFormData({
        day_of_week: WeekDay.MONDAY,
        start_time: '09:00',
        end_time: '12:00',
        max_students_per_slot: 5,
        slot_duration_minutes: 30,
      });
    } catch (error) {
      alert('Error al crear horario');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este horario?')) {
      try {
        await deleteSlot.mutateAsync(id);
        alert('Horario eliminado');
      } catch (error) {
        alert('Error al eliminar horario');
      }
    }
  };

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div className="manage-availability">
      <h2>Gestión de Disponibilidad</h2>

      {/* Formulario de creación */}
      <form onSubmit={handleSubmit} className="create-form">
        <h3>Crear Nuevo Horario</h3>

        <label>
          Día de la semana:
          <select
            value={formData.day_of_week}
            onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value as WeekDay })}
          >
            <option value={WeekDay.MONDAY}>Lunes</option>
            <option value={WeekDay.TUESDAY}>Martes</option>
            <option value={WeekDay.WEDNESDAY}>Miércoles</option>
            <option value={WeekDay.THURSDAY}>Jueves</option>
            <option value={WeekDay.FRIDAY}>Viernes</option>
            <option value={WeekDay.SATURDAY}>Sábado</option>
            <option value={WeekDay.SUNDAY}>Domingo</option>
          </select>
        </label>

        <label>
          Hora de inicio:
          <input
            type="time"
            value={formData.start_time}
            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
          />
        </label>

        <label>
          Hora de fin:
          <input
            type="time"
            value={formData.end_time}
            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
          />
        </label>

        <label>
          Máximo de estudiantes:
          <input
            type="number"
            min="1"
            max="50"
            value={formData.max_students_per_slot}
            onChange={(e) => setFormData({ ...formData, max_students_per_slot: parseInt(e.target.value) })}
          />
        </label>

        <label>
          Duración del slot (minutos):
          <input
            type="number"
            min="15"
            max="180"
            step="15"
            value={formData.slot_duration_minutes}
            onChange={(e) => setFormData({ ...formData, slot_duration_minutes: parseInt(e.target.value) })}
          />
        </label>

        <button type="submit" disabled={createSlot.isPending}>
          {createSlot.isPending ? 'Creando...' : 'Crear Horario'}
        </button>
      </form>

      {/* Lista de horarios existentes */}
      <div className="availability-list">
        <h3>Mis Horarios de Disponibilidad</h3>
        
        {!availability || availability.length === 0 ? (
          <p>No tienes horarios de disponibilidad configurados.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Día</th>
                <th>Horario</th>
                <th>Capacidad</th>
                <th>Reservas</th>
                <th>Disponibles</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {availability.map((slot) => (
                <tr key={slot.availability_id}>
                  <td>{slot.day_of_week}</td>
                  <td>{slot.start_time} - {slot.end_time}</td>
                  <td>{slot.max_students_per_slot}</td>
                  <td>{slot.current_bookings || 0}</td>
                  <td>{slot.available_spots || slot.max_students_per_slot}</td>
                  <td>
                    <span className={slot.is_active ? 'status-active' : 'status-inactive'}>
                      {slot.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(slot.availability_id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
```

---

### Componente de Ejemplo: Selector de Slots Disponibles (Para Estudiantes)

```typescript
// components/AvailableSlotsSelector.tsx
import React, { useState } from 'react';
import { useAvailableSlots } from '../hooks/useProfessorAvailability';

interface Props {
  professorId: number;
  subjectDetailId: number;
  onSelectSlot: (availabilityId: number, startTime: string) => void;
}

export const AvailableSlotsSelector: React.FC<Props> = ({
  professorId,
  subjectDetailId,
  onSelectSlot
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  const { data: availableSlots, isLoading } = useAvailableSlots(
    professorId,
    subjectDetailId,
    selectedDate
  );

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="available-slots-selector">
      <h3>Seleccionar Horario Disponible</h3>

      <label>
        Fecha:
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          min={new Date().toISOString().split('T')[0]}
        />
      </label>

      {isLoading && <div>Cargando slots disponibles...</div>}

      {selectedDate && availableSlots && (
        <div className="slots-container">
          <h4>Horarios Disponibles para {availableSlots.date}</h4>
          
          {availableSlots.slots.length === 0 ? (
            <p>No hay horarios disponibles para esta fecha.</p>
          ) : (
            <div className="slots-grid">
              {availableSlots.slots.map((slot) => (
                <button
                  key={slot.availability_id}
                  className="slot-button"
                  onClick={() => onSelectSlot(slot.availability_id, slot.start_time)}
                >
                  <div className="slot-time">
                    {slot.start_time} - {slot.end_time}
                  </div>
                  <div className="slot-capacity">
                    {slot.available_spots} de {slot.max_students} espacios
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
```

---

## Casos de Uso Comunes

### Caso 1: Profesor Configura su Disponibilidad Semanal

**Escenario**: Un profesor quiere establecer su disponibilidad para asesorías de lunes a viernes.

**Solución**:

```typescript
const weeklySlots = [
  { day_of_week: 'MONDAY', start_time: '09:00', end_time: '12:00', max_students_per_slot: 5, slot_duration_minutes: 30 },
  { day_of_week: 'TUESDAY', start_time: '14:00', end_time: '17:00', max_students_per_slot: 3, slot_duration_minutes: 45 },
  { day_of_week: 'WEDNESDAY', start_time: '09:00', end_time: '12:00', max_students_per_slot: 5, slot_duration_minutes: 30 },
  { day_of_week: 'THURSDAY', start_time: '14:00', end_time: '17:00', max_students_per_slot: 3, slot_duration_minutes: 45 },
  { day_of_week: 'FRIDAY', start_time: '10:00', end_time: '13:00', max_students_per_slot: 4, slot_duration_minutes: 30 },
];

await professorAvailabilityService.createBulkSlots(weeklySlots, token);
```

---

### Caso 2: Estudiante Busca Horarios Disponibles

**Escenario**: Un estudiante necesita reservar una asesoría con un profesor específico.

**Flujo**:

1. El estudiante selecciona la fecha deseada
2. Se consultan los slots disponibles para esa fecha
3. El estudiante selecciona un slot
4. Se procede con la creación de la solicitud de asesoría

```typescript
// Paso 1: Obtener slots disponibles
const slotsData = await professorAvailabilityService.getAvailableSlots(
  professorId,
  subjectDetailId,
  '2024-03-18'
);

// Paso 2: Mostrar slots al estudiante y permitir selección
// (Ver componente AvailableSlotsSelector arriba)

// Paso 3: Usar el availability_id seleccionado para crear la solicitud de asesoría
```

---

### Caso 3: Profesor Actualiza un Horario Existente

**Escenario**: Un profesor necesita cambiar el horario de los miércoles.

**Solución**:

```typescript
// 1. Obtener la disponibilidad actual
const myAvailability = await professorAvailabilityService.getMyAvailability(token, {
  day_of_week: WeekDay.WEDNESDAY
});

// 2. Actualizar el primer slot encontrado
if (myAvailability.length > 0) {
  const slotId = myAvailability[0].availability_id;
  
  await professorAvailabilityService.updateSlot(
    slotId,
    {
      start_time: '10:00',
      end_time: '14:00',
      max_students_per_slot: 6
    },
    token
  );
}
```

---

### Caso 4: Desactivar Disponibilidad Temporalmente

**Escenario**: Un profesor va de vacaciones y quiere desactivar su disponibilidad sin perder la configuración.

**Solución**:

```typescript
// Obtener todos los slots activos
const mySlots = await professorAvailabilityService.getMyAvailability(token);

// Desactivar cada uno
for (const slot of mySlots) {
  if (slot.is_active) {
    await professorAvailabilityService.deactivateSlot(slot.availability_id, token);
  }
}
```

**Para reactivar**: Usar el endpoint `PUT /slots/:id` con `{ is_active: true }`.

---

### Caso 5: Disponibilidad Específica por Materia

**Escenario**: Un profesor tiene diferentes horarios para diferentes materias.

**Solución**:

```typescript
// Disponibilidad para Cálculo Diferencial (subject_detail_id: 5)
await professorAvailabilityService.createSlot({
  subject_detail_id: 5,
  day_of_week: 'MONDAY',
  start_time: '09:00',
  end_time: '12:00',
  max_students_per_slot: 5,
  slot_duration_minutes: 30,
  notes: 'Solo para dudas de cálculo'
}, token);

// Disponibilidad para Álgebra Lineal (subject_detail_id: 8)
await professorAvailabilityService.createSlot({
  subject_detail_id: 8,
  day_of_week: 'WEDNESDAY',
  start_time: '14:00',
  end_time: '17:00',
  max_students_per_slot: 3,
  slot_duration_minutes: 45,
  notes: 'Solo para álgebra'
}, token);
```

---

## Validaciones y Reglas de Negocio

### Validaciones de Formato

| Campo | Validación | Mensaje de Error |
|-------|------------|------------------|
| `start_time`, `end_time` | Formato `HH:mm` (24h) | "must be in HH:mm format" |
| `max_students_per_slot` | Entre 1 y 50 | "must be between 1 and 50" |
| `slot_duration_minutes` | Entre 15 y 180 | "must be between 15 and 180" |
| `day_of_week` | Enum válido | "must be a valid WeekDay" |

### Reglas de Negocio

#### 1. **Prevención de Conflictos de Horario**

No puede haber dos slots activos del mismo profesor que se solapen en el mismo día:

```
❌ CONFLICTO:
Slot 1: MONDAY 09:00 - 12:00
Slot 2: MONDAY 11:00 - 14:00  (se solapa con Slot 1)

✅ VÁLIDO:
Slot 1: MONDAY 09:00 - 12:00
Slot 2: MONDAY 14:00 - 17:00  (no hay solapamiento)
```

#### 2. **Restricción de Eliminación**

No se puede eliminar un slot si tiene reservas futuras:

```typescript
// Si hay reservas futuras
DELETE /professor-availability/slots/15
// Error 400: "Cannot delete availability slot with future bookings"

// Solución: Desactivar en lugar de eliminar
DELETE /professor-availability/slots/15/deactivate
// ✅ Éxito: El slot se marca como inactivo
```

#### 3. **Autorización de Materia**

Solo se puede crear disponibilidad para materias asignadas al profesor:

```typescript
// Si el profesor no tiene asignada la materia
POST /professor-availability/slots
{
  "subject_detail_id": 99,  // Materia no asignada al profesor
  ...
}
// Error 403: "You can only create availability for subjects assigned to you"
```

#### 4. **Filtrado por Fecha Efectiva**

Los slots con `effective_from` y `effective_until` solo aparecen en consultas si la fecha cae dentro del rango:

```typescript
// Slot configurado:
{
  "day_of_week": "MONDAY",
  "effective_from": "2024-01-01",
  "effective_until": "2024-06-30"
}

// Consulta para fecha dentro del rango
GET /slots?professor_id=3&date=2024-03-15
// ✅ El slot aparece en los resultados

// Consulta para fecha fuera del rango
GET /slots?professor_id=3&date=2024-08-15
// ❌ El slot NO aparece en los resultados
```

#### 5. **Cálculo de Espacios Disponibles**

```typescript
available_spots = max_students_per_slot - current_bookings
```

Si `available_spots <= 0`, el slot no aparece en `/available-slots`.

---

## Errores Comunes y Soluciones

### Error 400: "Time slot conflicts with existing availability"

**Causa**: Intentas crear/actualizar un slot que se solapa con otro existente.

**Solución**:
1. Consulta tu disponibilidad actual para ese día
2. Ajusta los horarios para evitar solapamiento
3. O desactiva el slot conflictivo primero

```typescript
// Verificar disponibilidad actual
const existing = await professorAvailabilityService.getMyAvailability(token, {
  day_of_week: 'MONDAY'
});

console.log('Horarios existentes:', existing.map(s => `${s.start_time} - ${s.end_time}`));
```

---

### Error 403: "You can only create availability for subjects assigned to you"

**Causa**: Intentas crear disponibilidad para una materia que no te está asignada.

**Solución**:
- Omite `subject_detail_id` para disponibilidad general
- O verifica que el `subject_detail_id` sea de una materia asignada a ti

```typescript
// Opción 1: Disponibilidad general (sin materia específica)
await createSlot({
  // subject_detail_id omitido
  day_of_week: 'MONDAY',
  start_time: '09:00',
  end_time: '12:00',
  ...
}, token);

// Opción 2: Verificar materias asignadas primero
const mySubjects = await subjectDetailsService.getMySubjects(token);
console.log('Mis materias:', mySubjects.map(s => s.subject_detail_id));
```

---

### Error 404: "Availability slot not found"

**Causa**: El `availability_id` no existe o pertenece a otro profesor.

**Solución**:
- Verifica que el ID sea correcto
- Solo puedes modificar/eliminar tus propios slots

---

### Error 400: "start_time must be in HH:mm format"

**Causa**: Formato de hora incorrecto.

**Solución**:

```typescript
// ❌ Incorrecto
start_time: "9:00"      // Falta el 0 inicial
start_time: "09:00:00"  // Tiene segundos

// ✅ Correcto
start_time: "09:00"
start_time: "14:30"
start_time: "23:45"
```

---

## Mejores Prácticas

### 1. **Usar Creación Bulk para Configuración Inicial**

En lugar de crear slots uno por uno:

```typescript
// ❌ No recomendado: 5 llamadas separadas
for (const slot of weeklySlots) {
  await createSlot.mutateAsync(slot);
}

// ✅ Recomendado: 1 sola llamada
await createBulkSlots.mutateAsync(weeklySlots);
```

---

### 2. **Desactivar en Lugar de Eliminar**

Para mantener historial y evitar errores:

```typescript
// ✅ Recomendado: Desactivar
await professorAvailabilityService.deactivateSlot(slotId, token);

// ❌ Menos recomendado: Eliminar (puede fallar si hay reservas)
await professorAvailabilityService.deleteSlot(slotId, token);
```

---

### 3. **Validar Disponibilidad Antes de Crear Solicitudes**

```typescript
// Antes de permitir que el estudiante cree una solicitud
const availableSlots = await professorAvailabilityService.getAvailableSlots(
  professorId,
  subjectDetailId,
  selectedDate
);

if (availableSlots.slots.length === 0) {
  alert('No hay horarios disponibles para esta fecha');
  return;
}

// Continuar con la creación de la solicitud
```

---

### 4. **Usar Query Parameters para Filtrado Eficiente**

```typescript
// ✅ Filtrado en el backend
const mondaySlots = await getAvailability({
  professor_id: 3,
  day_of_week: 'MONDAY'
});

// ❌ Traer todo y filtrar en frontend
const allSlots = await getAvailability({ professor_id: 3 });
const mondaySlots = allSlots.filter(s => s.day_of_week === 'MONDAY');
```

---

### 5. **Invalidar Caché Apropiadamente**

Después de crear/actualizar/eliminar slots, invalida las queries relacionadas:

```typescript
const createSlot = useMutation({
  mutationFn: (data) => professorAvailabilityService.createSlot(data, token),
  onSuccess: () => {
    // Invalidar mis horarios
    queryClient.invalidateQueries({ queryKey: ['my-availability'] });
    
    // Invalidar consultas de disponibilidad general
    queryClient.invalidateQueries({ queryKey: ['professor-availability'] });
    
    // Invalidar slots disponibles si se consultan
    queryClient.invalidateQueries({ queryKey: ['available-slots'] });
  }
});
```

---

## Resumen

El módulo **Professor Availability** permite:

- ✅ **Profesores**: Gestionar sus horarios de disponibilidad de forma flexible
- ✅ **Estudiantes**: Consultar horarios disponibles para reservar asesorías
- ✅ **Sistema**: Prevenir conflictos de horarios y controlar capacidad

### Endpoints Clave

- **POST** `/slots` - Crear disponibilidad
- **POST** `/bulk-slots` - Crear múltiples horarios
- **GET** `/slots` - Consultar disponibilidad
- **GET** `/available-slots/:id/:subjectId` - Ver slots reservables
- **GET** `/my-availability` - Mi disponibilidad (profesor)
- **PUT** `/slots/:id` - Actualizar
- **DELETE** `/slots/:id/deactivate` - Desactivar
- **DELETE** `/slots/:id` - Eliminar

### Flujo Típico

1. **Profesor** crea su disponibilidad semanal usando `/bulk-slots`
2. **Estudiante** consulta slots disponibles con `/available-slots/:id/:subjectId?date=...`
3. **Estudiante** selecciona un slot y crea una solicitud de asesoría
4. **Sistema** actualiza `current_bookings` y `available_spots`
5. **Profesor** puede actualizar/desactivar slots según necesidad

---

**Documentación generada para el backend de School Advisories**
**Versión:** 1.0
**Última actualización:** Noviembre 2024
