# 📍 Venues API - Guía de Implementación Frontend

**Fecha de creación**: 21 de Noviembre, 2025  
**Versión**: 1.0  
**Módulo**: Gestión de Ubicaciones (Venues)

---

## 📋 Índice

1. [Descripción General](#descripción-general)
2. [Modelo de Datos](#modelo-de-datos)
3. [Tipos de Venues](#tipos-de-venues)
4. [Autenticación y Permisos](#autenticación-y-permisos)
5. [Endpoints del CRUD](#endpoints-del-crud)
6. [Ejemplos de Implementación React](#ejemplos-de-implementación-react)
7. [Manejo de Errores](#manejo-de-errores)
8. [Validaciones](#validaciones)
9. [Mejores Prácticas](#mejores-prácticas)

---

## 📖 Descripción General

El módulo de **Venues** gestiona las ubicaciones donde se realizan las asesorías académicas. Soporta tres tipos de ubicaciones:

- **Classrooms** (Aulas físicas)
- **Offices** (Oficinas/Cubículos)
- **Virtual** (Sesiones en línea)

**Base URL**: `http://localhost:3000/venues`

**Autenticación**: Todas las peticiones requieren **JWT Bearer Token**

---

## 🗂️ Modelo de Datos

### Entity: Venue

```typescript
interface Venue {
  venue_id: number;           // ID único (auto-generado)
  name: string;               // Nombre descriptivo
  type: VenueType;           // Tipo de ubicación
  url?: string;              // URL (solo para virtual)
  building?: string;         // Edificio (solo para físicas)
  floor?: string;            // Piso (solo para físicas)
  advisory_dates?: AdvisoryDate[]; // Relación con sesiones
}
```

### Enum: VenueType

```typescript
enum VenueType {
  CLASSROOM = 'classroom',  // Aulas físicas
  OFFICE = 'office',        // Oficinas/Cubículos
  VIRTUAL = 'virtual'       // Sesiones virtuales
}
```

---

## 🏢 Tipos de Venues

### 1. CLASSROOM (Aula)

**Descripción**: Salones de clase físicos donde se imparten asesorías presenciales.

**Campos obligatorios**:
- ✅ `name` - Ejemplo: "Aula 101", "Salón de Matemáticas"
- ✅ `type` - Debe ser `"classroom"`
- ✅ `building` - Ejemplo: "Edificio A", "Torre Norte"
- ✅ `floor` - Ejemplo: "Planta Baja", "Primer Piso", "PB"

**Campos opcionales**: Ninguno

**Campos NO permitidos**:
- ❌ `url` - No debe incluirse para ubicaciones físicas

**Ejemplo de datos**:
```json
{
  "name": "Aula 101",
  "type": "classroom",
  "building": "Edificio A",
  "floor": "Planta Baja"
}
```

---

### 2. OFFICE (Oficina/Cubículo)

**Descripción**: Espacios de trabajo de profesores donde pueden dar asesorías personalizadas.

**Campos obligatorios**:
- ✅ `name` - Ejemplo: "Cubículo 12", "Oficina Dr. García"
- ✅ `type` - Debe ser `"office"`
- ✅ `building` - Ejemplo: "Edificio B", "Área Administrativa"
- ✅ `floor` - Ejemplo: "Segundo Piso", "2do Piso"

**Campos opcionales**: Ninguno

**Campos NO permitidos**:
- ❌ `url` - No debe incluirse para ubicaciones físicas

**Ejemplo de datos**:
```json
{
  "name": "Cubículo 12",
  "type": "office",
  "building": "Edificio B",
  "floor": "Segundo Piso"
}
```

---

### 3. VIRTUAL (Sesión en línea)

**Descripción**: Enlaces a plataformas virtuales para asesorías remotas.

**Campos obligatorios**:
- ✅ `name` - Ejemplo: "Google Meet - Matemáticas", "Zoom - Física"
- ✅ `type` - Debe ser `"virtual"`
- ✅ `url` - Ejemplo: "https://meet.google.com/abc-defg-hij"

**Campos opcionales**: Ninguno

**Campos NO permitidos**:
- ❌ `building` - No aplica para ubicaciones virtuales
- ❌ `floor` - No aplica para ubicaciones virtuales

**Ejemplo de datos**:
```json
{
  "name": "Google Meet - Matemáticas",
  "type": "virtual",
  "url": "https://meet.google.com/abc-defg-hij"
}
```

---

## 🔐 Autenticación y Permisos

### Headers Requeridos

Todas las peticiones deben incluir:

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Roles y Permisos

| Endpoint | Admin | Professor | Student |
|----------|-------|-----------|---------|
| `POST /venues` | ✅ | ✅ | ✅ |
| `GET /venues` | ✅ | ✅ | ❌ |
| `GET /venues/:id` | ✅ | ❌ | ❌ |
| `PUT /venues/:id` | ✅ | ❌ | ❌ |
| `DELETE /venues/:id` | ✅ | ❌ | ❌ |

**Nota**: Aunque técnicamente cualquier usuario autenticado puede crear venues, se recomienda que solo Admin y Professor tengan acceso a esta funcionalidad en el frontend.

---

## 🔌 Endpoints del CRUD

### 1️⃣ Crear Venue (CREATE)

**Endpoint**: `POST /venues`

**Roles permitidos**: Admin, Professor, (Student)*

**Request Body**:
```typescript
interface CreateVenueDto {
  name: string;
  type: 'classroom' | 'office' | 'virtual';
  url?: string;
  building?: string;
  floor?: string;
}
```

**Ejemplo - Crear Aula**:
```http
POST http://localhost:3000/venues
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Aula 101",
  "type": "classroom",
  "building": "Edificio A",
  "floor": "Planta Baja"
}
```

**Response 201 (Created)**:
```json
{
  "venue_id": 1,
  "name": "Aula 101",
  "type": "classroom",
  "building": "Edificio A",
  "floor": "Planta Baja",
  "url": null
}
```

**Ejemplo - Crear Oficina**:
```http
POST http://localhost:3000/venues
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Cubículo 12",
  "type": "office",
  "building": "Edificio B",
  "floor": "Segundo Piso"
}
```

**Response 201 (Created)**:
```json
{
  "venue_id": 2,
  "name": "Cubículo 12",
  "type": "office",
  "building": "Edificio B",
  "floor": "Segundo Piso",
  "url": null
}
```

**Ejemplo - Crear Virtual**:
```http
POST http://localhost:3000/venues
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Google Meet - Matemáticas",
  "type": "virtual",
  "url": "https://meet.google.com/abc-defg-hij"
}
```

**Response 201 (Created)**:
```json
{
  "venue_id": 3,
  "name": "Google Meet - Matemáticas",
  "type": "virtual",
  "url": "https://meet.google.com/abc-defg-hij",
  "building": null,
  "floor": null
}
```

**Errores comunes**:

```json
// Error 400 - Virtual sin URL
{
  "statusCode": 400,
  "message": "La URL es obligatoria para ubicaciones virtuales",
  "error": "Bad Request"
}

// Error 400 - Classroom sin building/floor
{
  "statusCode": 400,
  "message": "El edificio y el piso son obligatorios para aulas y oficinas",
  "error": "Bad Request"
}

// Error 400 - Virtual con building/floor
{
  "statusCode": 400,
  "message": "Edificio y piso no deben ser especificados para ubicaciones virtuales",
  "error": "Bad Request"
}
```

---

### 2️⃣ Listar Venues (READ ALL)

**Endpoint**: `GET /venues`

**Roles permitidos**: Admin, Professor

**Query Parameters** (todos opcionales):

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `page` | number | 1 | Número de página |
| `limit` | number | 10 | Elementos por página |
| `name` | string | - | Búsqueda parcial por nombre (case-insensitive) |
| `type` | string | - | Filtrar por tipo (classroom, office, virtual) |
| `building` | string | - | Filtrar por edificio exacto |
| `floor` | string | - | Filtrar por piso exacto |

**Ejemplo - Listar todas (paginado)**:
```http
GET http://localhost:3000/venues?page=1&limit=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200 (OK)**:
```json
{
  "data": [
    {
      "venue_id": 1,
      "name": "Aula 101",
      "type": "classroom",
      "building": "Edificio A",
      "floor": "Planta Baja",
      "url": null
    },
    {
      "venue_id": 2,
      "name": "Cubículo 12",
      "type": "office",
      "building": "Edificio B",
      "floor": "Segundo Piso",
      "url": null
    },
    {
      "venue_id": 3,
      "name": "Google Meet - Matemáticas",
      "type": "virtual",
      "url": "https://meet.google.com/abc-defg-hij",
      "building": null,
      "floor": null
    }
  ],
  "total": 3,
  "page": 1,
  "lastPage": 1
}
```

**Ejemplo - Filtrar por tipo**:
```http
GET http://localhost:3000/venues?type=virtual&page=1&limit=5
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200 (OK)**:
```json
{
  "data": [
    {
      "venue_id": 3,
      "name": "Google Meet - Matemáticas",
      "type": "virtual",
      "url": "https://meet.google.com/abc-defg-hij",
      "building": null,
      "floor": null
    },
    {
      "venue_id": 5,
      "name": "Zoom - Física Avanzada",
      "type": "virtual",
      "url": "https://zoom.us/j/123456789",
      "building": null,
      "floor": null
    }
  ],
  "total": 2,
  "page": 1,
  "lastPage": 1
}
```

**Ejemplo - Búsqueda por nombre**:
```http
GET http://localhost:3000/venues?name=aula
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200 (OK)**:
```json
{
  "data": [
    {
      "venue_id": 1,
      "name": "Aula 101",
      "type": "classroom",
      "building": "Edificio A",
      "floor": "Planta Baja",
      "url": null
    },
    {
      "venue_id": 4,
      "name": "Aula 202",
      "type": "classroom",
      "building": "Edificio C",
      "floor": "Segundo Piso",
      "url": null
    }
  ],
  "total": 2,
  "page": 1,
  "lastPage": 1
}
```

**Ejemplo - Filtros combinados**:
```http
GET http://localhost:3000/venues?type=classroom&building=Edificio A&page=1&limit=20
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 3️⃣ Obtener Venue por ID (READ ONE)

**Endpoint**: `GET /venues/:id`

**Roles permitidos**: Admin

**Path Parameters**:
- `id` (number) - ID del venue

**Ejemplo**:
```http
GET http://localhost:3000/venues/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200 (OK)**:
```json
{
  "venue_id": 1,
  "name": "Aula 101",
  "type": "classroom",
  "building": "Edificio A",
  "floor": "Planta Baja",
  "url": null
}
```

**Response 404 (Not Found)**:
```json
{
  "statusCode": 404,
  "message": "Ubicación no encontrada",
  "error": "Not Found"
}
```

---

### 4️⃣ Actualizar Venue (UPDATE)

**Endpoint**: `PUT /venues/:id`

**Roles permitidos**: Admin

**Path Parameters**:
- `id` (number) - ID del venue a actualizar

**Request Body** (Partial - todos los campos opcionales):
```typescript
interface UpdateVenueDto {
  name?: string;
  type?: 'classroom' | 'office' | 'virtual';
  url?: string;
  building?: string;
  floor?: string;
}
```

**IMPORTANTE**: Las mismas reglas de validación aplican al actualizar:
- Si cambias a `type: "virtual"`, debes incluir `url` y NO `building/floor`
- Si cambias a `type: "classroom"` o `"office"`, debes incluir `building` y `floor`, NO `url`

**Ejemplo - Actualizar nombre de aula**:
```http
PUT http://localhost:3000/venues/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Aula 101-A (Remodelada)"
}
```

**Response 200 (OK)**:
```json
{
  "venue_id": 1,
  "name": "Aula 101-A (Remodelada)",
  "type": "classroom",
  "building": "Edificio A",
  "floor": "Planta Baja",
  "url": null
}
```

**Ejemplo - Cambiar de classroom a virtual**:
```http
PUT http://localhost:3000/venues/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "type": "virtual",
  "url": "https://meet.google.com/new-link",
  "building": null,
  "floor": null
}
```

**Response 200 (OK)**:
```json
{
  "venue_id": 1,
  "name": "Aula 101-A (Remodelada)",
  "type": "virtual",
  "url": "https://meet.google.com/new-link",
  "building": null,
  "floor": null
}
```

**Ejemplo - Actualizar URL de virtual**:
```http
PUT http://localhost:3000/venues/3
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "url": "https://meet.google.com/updated-link"
}
```

**Response 200 (OK)**:
```json
{
  "venue_id": 3,
  "name": "Google Meet - Matemáticas",
  "type": "virtual",
  "url": "https://meet.google.com/updated-link",
  "building": null,
  "floor": null
}
```

---

### 5️⃣ Eliminar Venue (DELETE)

**Endpoint**: `DELETE /venues/:id`

**Roles permitidos**: Admin

**Path Parameters**:
- `id` (number) - ID del venue a eliminar

**IMPORTANTE**: No se puede eliminar un venue si tiene sesiones (advisory_dates) asociadas.

**Ejemplo - Eliminación exitosa**:
```http
DELETE http://localhost:3000/venues/5
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200 (OK)**:
```json
{
  "affected": 1,
  "raw": []
}
```

**Ejemplo - Error por sesiones asociadas**:
```http
DELETE http://localhost:3000/venues/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 400 (Bad Request)**:
```json
{
  "statusCode": 400,
  "message": "Cannot delete venue with associated advisory dates",
  "error": "Bad Request"
}
```

**Response 404 (Not Found)**:
```json
{
  "statusCode": 404,
  "message": "Ubicación no encontrada",
  "error": "Not Found"
}
```

---

## ⚛️ Ejemplos de Implementación React

### 1. Service API (venuesService.ts)

```typescript
// src/services/venuesService.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

interface Venue {
  venue_id: number;
  name: string;
  type: 'classroom' | 'office' | 'virtual';
  url?: string;
  building?: string;
  floor?: string;
}

interface CreateVenueDto {
  name: string;
  type: 'classroom' | 'office' | 'virtual';
  url?: string;
  building?: string;
  floor?: string;
}

interface UpdateVenueDto {
  name?: string;
  type?: 'classroom' | 'office' | 'virtual';
  url?: string;
  building?: string;
  floor?: string;
}

interface VenueQueryParams {
  page?: number;
  limit?: number;
  name?: string;
  type?: 'classroom' | 'office' | 'virtual';
  building?: string;
  floor?: string;
}

interface PaginatedVenues {
  data: Venue[];
  total: number;
  page: number;
  lastPage: number;
}

class VenuesService {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  }

  async getAll(params?: VenueQueryParams): Promise<PaginatedVenues> {
    const response = await axios.get<PaginatedVenues>(
      `${API_BASE_URL}/venues`,
      {
        ...this.getAuthHeaders(),
        params,
      }
    );
    return response.data;
  }

  async getById(id: number): Promise<Venue> {
    const response = await axios.get<Venue>(
      `${API_BASE_URL}/venues/${id}`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async create(data: CreateVenueDto): Promise<Venue> {
    const response = await axios.post<Venue>(
      `${API_BASE_URL}/venues`,
      data,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async update(id: number, data: UpdateVenueDto): Promise<Venue> {
    const response = await axios.put<Venue>(
      `${API_BASE_URL}/venues/${id}`,
      data,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await axios.delete(
      `${API_BASE_URL}/venues/${id}`,
      this.getAuthHeaders()
    );
  }
}

export const venuesService = new VenuesService();
```

---

### 2. Hook personalizado (useVenues.ts)

```typescript
// src/hooks/useVenues.ts
import { useState, useEffect } from 'react';
import { venuesService } from '../services/venuesService';

interface Venue {
  venue_id: number;
  name: string;
  type: 'classroom' | 'office' | 'virtual';
  url?: string;
  building?: string;
  floor?: string;
}

interface VenueQueryParams {
  page?: number;
  limit?: number;
  name?: string;
  type?: 'classroom' | 'office' | 'virtual';
  building?: string;
  floor?: string;
}

export const useVenues = (params?: VenueQueryParams) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchVenues = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await venuesService.getAll(params);
      setVenues(response.data);
      setTotal(response.total);
      setCurrentPage(response.page);
      setLastPage(response.lastPage);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar venues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [params?.page, params?.limit, params?.type, params?.building]);

  return {
    venues,
    loading,
    error,
    total,
    currentPage,
    lastPage,
    refetch: fetchVenues,
  };
};
```

---

### 3. Componente de Lista (VenuesList.tsx)

```typescript
// src/components/VenuesList.tsx
import React, { useState } from 'react';
import { useVenues } from '../hooks/useVenues';
import { venuesService } from '../services/venuesService';

const VenuesList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const { venues, loading, error, total, lastPage, refetch } = useVenues({
    page,
    limit: 10,
    type: typeFilter || undefined,
  });

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este venue?')) {
      return;
    }

    try {
      await venuesService.delete(id);
      alert('Venue eliminado exitosamente');
      refetch();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar venue');
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="venues-list">
      <h2>Gestión de Venues</h2>

      {/* Filtros */}
      <div className="filters">
        <label>
          Tipo:
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">Todos</option>
            <option value="classroom">Aula</option>
            <option value="office">Oficina</option>
            <option value="virtual">Virtual</option>
          </select>
        </label>
      </div>

      {/* Tabla */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Edificio</th>
            <th>Piso</th>
            <th>URL</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {venues.map((venue) => (
            <tr key={venue.venue_id}>
              <td>{venue.venue_id}</td>
              <td>{venue.name}</td>
              <td>{venue.type}</td>
              <td>{venue.building || 'N/A'}</td>
              <td>{venue.floor || 'N/A'}</td>
              <td>
                {venue.url ? (
                  <a href={venue.url} target="_blank" rel="noopener noreferrer">
                    Link
                  </a>
                ) : (
                  'N/A'
                )}
              </td>
              <td>
                <button onClick={() => handleDelete(venue.venue_id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Anterior
        </button>
        <span>
          Página {page} de {lastPage} (Total: {total})
        </span>
        <button disabled={page === lastPage} onClick={() => setPage(page + 1)}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default VenuesList;
```

---

### 4. Componente de Formulario (VenueForm.tsx)

```typescript
// src/components/VenueForm.tsx
import React, { useState, useEffect } from 'react';
import { venuesService } from '../services/venuesService';

interface VenueFormProps {
  venueId?: number;
  onSuccess?: () => void;
}

const VenueForm: React.FC<VenueFormProps> = ({ venueId, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'classroom' as 'classroom' | 'office' | 'virtual',
    url: '',
    building: '',
    floor: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (venueId) {
      loadVenue();
    }
  }, [venueId]);

  const loadVenue = async () => {
    try {
      const venue = await venuesService.getById(venueId!);
      setFormData({
        name: venue.name,
        type: venue.type,
        url: venue.url || '',
        building: venue.building || '',
        floor: venue.floor || '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar venue');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Preparar datos según el tipo
      const dataToSend: any = {
        name: formData.name,
        type: formData.type,
      };

      if (formData.type === 'virtual') {
        dataToSend.url = formData.url;
      } else {
        dataToSend.building = formData.building;
        dataToSend.floor = formData.floor;
      }

      if (venueId) {
        await venuesService.update(venueId, dataToSend);
        alert('Venue actualizado exitosamente');
      } else {
        await venuesService.create(dataToSend);
        alert('Venue creado exitosamente');
      }

      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar venue');
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type: 'classroom' | 'office' | 'virtual') => {
    setFormData({
      ...formData,
      type,
      // Limpiar campos no aplicables
      url: type === 'virtual' ? formData.url : '',
      building: type !== 'virtual' ? formData.building : '',
      floor: type !== 'virtual' ? formData.floor : '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="venue-form">
      <h2>{venueId ? 'Editar Venue' : 'Crear Venue'}</h2>

      {error && <div className="error">{error}</div>}

      <div className="form-group">
        <label>Nombre *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Tipo *</label>
        <select
          value={formData.type}
          onChange={(e) => handleTypeChange(e.target.value as any)}
          required
        >
          <option value="classroom">Aula</option>
          <option value="office">Oficina</option>
          <option value="virtual">Virtual</option>
        </select>
      </div>

      {formData.type === 'virtual' ? (
        <div className="form-group">
          <label>URL *</label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://meet.google.com/..."
            required
          />
        </div>
      ) : (
        <>
          <div className="form-group">
            <label>Edificio *</label>
            <input
              type="text"
              value={formData.building}
              onChange={(e) =>
                setFormData({ ...formData, building: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Piso *</label>
            <input
              type="text"
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              required
            />
          </div>
        </>
      )}

      <button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : venueId ? 'Actualizar' : 'Crear'}
      </button>
    </form>
  );
};

export default VenueForm;
```

---

### 5. Componente Completo con CRUD (VenuesManager.tsx)

```typescript
// src/components/VenuesManager.tsx
import React, { useState } from 'react';
import VenuesList from './VenuesList';
import VenueForm from './VenueForm';

const VenuesManager: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>();

  const handleCreate = () => {
    setEditingId(undefined);
    setShowForm(true);
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingId(undefined);
    // Refresh list
    window.location.reload();
  };

  return (
    <div className="venues-manager">
      <button onClick={handleCreate}>Crear Nuevo Venue</button>

      {showForm ? (
        <VenueForm venueId={editingId} onSuccess={handleSuccess} />
      ) : (
        <VenuesList />
      )}
    </div>
  );
};

export default VenuesManager;
```

---

## ⚠️ Manejo de Errores

### Códigos de Estado HTTP

| Código | Descripción | Cuándo ocurre |
|--------|-------------|---------------|
| **200** | OK | Operación exitosa (GET, PUT, DELETE) |
| **201** | Created | Venue creado exitosamente |
| **400** | Bad Request | Validación fallida, datos incorrectos |
| **401** | Unauthorized | Token JWT inválido o ausente |
| **403** | Forbidden | Usuario sin permisos para el endpoint |
| **404** | Not Found | Venue no encontrado |

### Mensajes de Error Comunes

```typescript
// Error: Virtual sin URL
{
  "statusCode": 400,
  "message": "La URL es obligatoria para ubicaciones virtuales",
  "error": "Bad Request"
}

// Error: Classroom/Office sin building/floor
{
  "statusCode": 400,
  "message": "El edificio y el piso son obligatorios para aulas y oficinas",
  "error": "Bad Request"
}

// Error: Virtual con building/floor
{
  "statusCode": 400,
  "message": "Edificio y piso no deben ser especificados para ubicaciones virtuales",
  "error": "Bad Request"
}

// Error: Classroom/Office con URL
{
  "statusCode": 400,
  "message": "La URL no debe ser especificada para aulas y oficinas",
  "error": "Bad Request"
}

// Error: Venue con sesiones asociadas
{
  "statusCode": 400,
  "message": "Cannot delete venue with associated advisory dates",
  "error": "Bad Request"
}

// Error: Venue no encontrado
{
  "statusCode": 404,
  "message": "Ubicación no encontrada",
  "error": "Not Found"
}

// Error: No autenticado
{
  "statusCode": 401,
  "message": "Unauthorized"
}

// Error: Sin permisos
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

---

## ✅ Validaciones

### Validaciones del Backend

El backend valida automáticamente:

1. **Campos requeridos**:
   - `name` siempre es obligatorio
   - `type` siempre es obligatorio

2. **Validaciones por tipo**:
   
   **VIRTUAL**:
   - ✅ `url` es **obligatorio**
   - ❌ `building` debe estar **ausente** o **null**
   - ❌ `floor` debe estar **ausente** o **null**

   **CLASSROOM / OFFICE**:
   - ✅ `building` es **obligatorio**
   - ✅ `floor` es **obligatorio**
   - ❌ `url` debe estar **ausente** o **null**

3. **Tipos de dato**:
   - `name`: string (no vacío)
   - `type`: enum ('classroom', 'office', 'virtual')
   - `url`: string válido (opcional según tipo)
   - `building`: string (opcional según tipo)
   - `floor`: string (opcional según tipo)

### Validaciones Recomendadas en Frontend

```typescript
// Validación de formulario
const validateVenueForm = (data: any): string[] => {
  const errors: string[] = [];

  // Nombre es obligatorio
  if (!data.name || data.name.trim() === '') {
    errors.push('El nombre es obligatorio');
  }

  // Tipo es obligatorio
  if (!data.type) {
    errors.push('El tipo es obligatorio');
  }

  // Validaciones específicas por tipo
  if (data.type === 'virtual') {
    if (!data.url || data.url.trim() === '') {
      errors.push('La URL es obligatoria para ubicaciones virtuales');
    }
    if (data.building || data.floor) {
      errors.push('Edificio y piso no aplican para ubicaciones virtuales');
    }
  }

  if (data.type === 'classroom' || data.type === 'office') {
    if (!data.building || data.building.trim() === '') {
      errors.push('El edificio es obligatorio para aulas y oficinas');
    }
    if (!data.floor || data.floor.trim() === '') {
      errors.push('El piso es obligatorio para aulas y oficinas');
    }
    if (data.url) {
      errors.push('La URL no aplica para ubicaciones físicas');
    }
  }

  return errors;
};
```

---

## 🎯 Mejores Prácticas

### 1. Manejo de Tokens

```typescript
// Interceptor de Axios para manejo automático de tokens
import axios from 'axios';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirigir a login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

### 2. Caché y Optimización

```typescript
// React Query para caché y actualización automática
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { venuesService } from '../services/venuesService';

export const useVenuesQuery = (params?: VenueQueryParams) => {
  return useQuery({
    queryKey: ['venues', params],
    queryFn: () => venuesService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useCreateVenue = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: venuesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
    },
  });
};

export const useUpdateVenue = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateVenueDto }) =>
      venuesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
    },
  });
};

export const useDeleteVenue = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: venuesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
    },
  });
};
```

---

### 3. Tipos TypeScript Centralizados

```typescript
// src/types/venue.types.ts
export enum VenueType {
  CLASSROOM = 'classroom',
  OFFICE = 'office',
  VIRTUAL = 'virtual',
}

export interface Venue {
  venue_id: number;
  name: string;
  type: VenueType;
  url?: string;
  building?: string;
  floor?: string;
}

export interface CreateVenueDto {
  name: string;
  type: VenueType;
  url?: string;
  building?: string;
  floor?: string;
}

export interface UpdateVenueDto {
  name?: string;
  type?: VenueType;
  url?: string;
  building?: string;
  floor?: string;
}

export interface VenueQueryParams {
  page?: number;
  limit?: number;
  name?: string;
  type?: VenueType;
  building?: string;
  floor?: string;
}

export interface PaginatedVenues {
  data: Venue[];
  total: number;
  page: number;
  lastPage: number;
}
```

---

### 4. Confirmación antes de Eliminar

```typescript
const handleDelete = async (venue: Venue) => {
  const confirmed = window.confirm(
    `¿Estás seguro de eliminar "${venue.name}"?\n` +
    `Esta acción no se puede deshacer.`
  );

  if (!confirmed) return;

  try {
    await venuesService.delete(venue.venue_id);
    toast.success('Venue eliminado exitosamente');
    refetch();
  } catch (err: any) {
    if (err.response?.status === 400) {
      toast.error(
        'No se puede eliminar este venue porque tiene sesiones asociadas'
      );
    } else {
      toast.error('Error al eliminar venue');
    }
  }
};
```

---

### 5. Formulario Dinámico según Tipo

```typescript
const VenueFormDynamic: React.FC = () => {
  const [type, setType] = useState<VenueType>(VenueType.CLASSROOM);

  return (
    <form>
      {/* Campo tipo */}
      <select value={type} onChange={(e) => setType(e.target.value as VenueType)}>
        <option value={VenueType.CLASSROOM}>Aula</option>
        <option value={VenueType.OFFICE}>Oficina</option>
        <option value={VenueType.VIRTUAL}>Virtual</option>
      </select>

      {/* Campos condicionales */}
      {type === VenueType.VIRTUAL ? (
        <input
          type="url"
          name="url"
          placeholder="https://meet.google.com/..."
          required
        />
      ) : (
        <>
          <input name="building" placeholder="Edificio" required />
          <input name="floor" placeholder="Piso" required />
        </>
      )}
    </form>
  );
};
```

---

## 📚 Recursos Adicionales

### Swagger Documentation

Accede a la documentación interactiva de Swagger:

```
http://localhost:3000/api/docs
```

Aquí podrás:
- Ver todos los endpoints disponibles
- Probar las peticiones directamente
- Ver los schemas de DTOs
- Revisar códigos de respuesta

---

### Testing con Thunder Client / Postman

**Colección de ejemplo**:

```json
{
  "name": "Venues API",
  "requests": [
    {
      "name": "Get All Venues",
      "method": "GET",
      "url": "http://localhost:3000/venues?page=1&limit=10",
      "headers": {
        "Authorization": "Bearer {{token}}"
      }
    },
    {
      "name": "Create Classroom",
      "method": "POST",
      "url": "http://localhost:3000/venues",
      "headers": {
        "Authorization": "Bearer {{token}}",
        "Content-Type": "application/json"
      },
      "body": {
        "name": "Aula 101",
        "type": "classroom",
        "building": "Edificio A",
        "floor": "Planta Baja"
      }
    },
    {
      "name": "Create Virtual",
      "method": "POST",
      "url": "http://localhost:3000/venues",
      "headers": {
        "Authorization": "Bearer {{token}}",
        "Content-Type": "application/json"
      },
      "body": {
        "name": "Google Meet - Math",
        "type": "virtual",
        "url": "https://meet.google.com/abc-defg-hij"
      }
    }
  ]
}
```

---

## 🔄 Flujo Completo de Ejemplo

### Escenario: Crear, Listar, Actualizar y Eliminar un Venue

```typescript
// 1. Autenticarse
const login = async () => {
  const response = await axios.post('http://localhost:3000/auth/login', {
    email: 'admin@example.com',
    password: 'password123',
  });
  localStorage.setItem('access_token', response.data.access_token);
};

// 2. Crear un venue virtual
const createVenue = async () => {
  const newVenue = await venuesService.create({
    name: 'Zoom - Física',
    type: 'virtual',
    url: 'https://zoom.us/j/123456789',
  });
  console.log('Venue creado:', newVenue);
  return newVenue.venue_id;
};

// 3. Listar todos los venues
const listVenues = async () => {
  const result = await venuesService.getAll({ page: 1, limit: 10 });
  console.log('Venues:', result.data);
};

// 4. Actualizar el venue
const updateVenue = async (id: number) => {
  const updated = await venuesService.update(id, {
    name: 'Zoom - Física Avanzada',
  });
  console.log('Venue actualizado:', updated);
};

// 5. Eliminar el venue
const deleteVenue = async (id: number) => {
  await venuesService.delete(id);
  console.log('Venue eliminado');
};

// Ejecutar flujo completo
const runFullFlow = async () => {
  await login();
  const venueId = await createVenue();
  await listVenues();
  await updateVenue(venueId);
  await deleteVenue(venueId);
};
```

---

## 📊 Resumen de Endpoints

| Método | Endpoint | Roles | Descripción |
|--------|----------|-------|-------------|
| `POST` | `/venues` | Admin, Professor | Crear nuevo venue |
| `GET` | `/venues` | Admin, Professor | Listar con paginación y filtros |
| `GET` | `/venues/:id` | Admin | Obtener venue específico |
| `PUT` | `/venues/:id` | Admin | Actualizar venue |
| `DELETE` | `/venues/:id` | Admin | Eliminar venue |

---

## ✅ Checklist de Implementación Frontend

- [ ] Instalar axios o fetch API
- [ ] Crear servicio de API (`venuesService.ts`)
- [ ] Crear tipos TypeScript (`venue.types.ts`)
- [ ] Implementar hook personalizado (`useVenues.ts`)
- [ ] Crear componente de lista (`VenuesList.tsx`)
- [ ] Crear componente de formulario (`VenueForm.tsx`)
- [ ] Implementar validaciones en el formulario
- [ ] Agregar confirmación antes de eliminar
- [ ] Implementar manejo de errores
- [ ] Agregar feedback visual (toasts/alerts)
- [ ] Implementar paginación
- [ ] Agregar filtros de búsqueda
- [ ] (Opcional) Implementar React Query para caché
- [ ] Probar todos los flujos CRUD
- [ ] Probar con diferentes roles (Admin, Professor)

---

**Documento generado**: 21 de Noviembre, 2025  
**Autor**: GitHub Copilot  
**Versión**: 1.0  
**Estado**: ✅ Completo

¡API de Venues lista para implementación en React! 🚀
