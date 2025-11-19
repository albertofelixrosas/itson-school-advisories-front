# 🔗 Frontend Integration Plan - School Advisories System

**Fecha**: 18 de Noviembre, 2025  
**Estado Backend**: ✅ 100% Implementado  
**Estado Frontend**: 85% → Target: 100%

---

## 📊 Resumen Ejecutivo

El backend ha completado **todos los endpoints requeridos** y agregó funcionalidades extras. Este documento detalla el plan de integración paso a paso para llevar el frontend del **85% al 100%**.

---

## 🎯 Phase 1: Critical Integrations (1-2 días)

### 1.1 Admin Dashboard Stats

**Componente**: `src/pages/admin/AdminDashboard.tsx`

**Cambios requeridos**:

1. **Crear nuevo endpoint en frontend**:
```typescript
// src/api/endpoints/admin.ts (CREAR NUEVO ARCHIVO)
import { apiClient } from '../client';

export interface AdminDashboardStats {
  users: {
    total: number;
    students: number;
    professors: number;
    admins: number;
    recent_registrations: number;
  };
  advisories: {
    total: number;
    active: number;
    completed: number;
    avg_students_per_session: number;
  };
  sessions: {
    total: number;
    upcoming: number;
    completed: number;
    this_week: number;
    this_month: number;
  };
  requests: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    avg_response_time_hours: number;
  };
  attendance: {
    total_records: number;
    attended: number;
    attendance_rate: number;
  };
  subjects: {
    total: number;
    with_professors: number;
    active_advisories: number;
  };
  top_subjects: Array<{
    subject_id: number;
    subject_name: string;
    request_count: number;
  }>;
  top_professors: Array<{
    user_id: number;
    name: string;
    last_name: string;
    advisory_count: number;
    avg_rating: number;
  }>;
}

/**
 * Get admin dashboard statistics
 */
export const getAdminDashboardStats = async (): Promise<AdminDashboardStats> => {
  const response = await apiClient.get<AdminDashboardStats>('/users/admin/dashboard/stats');
  return response.data;
};
```

2. **Actualizar AdminDashboard.tsx**:
```typescript
// src/pages/admin/AdminDashboard.tsx
import { useQuery } from '@tanstack/react-query';
import { getAdminDashboardStats } from '@/api/endpoints/admin';

export function AdminDashboard() {
  // REEMPLAZAR datos hardcodeados por query real
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: getAdminDashboardStats,
    refetchInterval: 5 * 60 * 1000, // Refetch cada 5 minutos
  });

  if (isLoading) {
    return <LoadingSpinner message="Cargando estadísticas..." />;
  }

  if (error) {
    return <Alert severity="error">Error al cargar estadísticas</Alert>;
  }

  return (
    <Layout title="Dashboard">
      <Grid container spacing={3}>
        {/* User Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Usuarios"
            value={stats.users.total}
            icon={<PeopleIcon />}
            color="primary"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Estudiantes"
            value={stats.users.students}
            icon={<SchoolIcon />}
            color="info"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Profesores"
            value={stats.users.professors}
            icon={<PersonIcon />}
            color="success"
          />
        </Grid>

        {/* Advisory Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Asesorías Activas"
            value={stats.advisories.active}
            subtitle={`${stats.advisories.total} total`}
            icon={<AssignmentIcon />}
            color="warning"
          />
        </Grid>

        {/* Session Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Sesiones Próximas"
            value={stats.sessions.upcoming}
            subtitle={`${stats.sessions.this_week} esta semana`}
            icon={<EventIcon />}
            color="secondary"
          />
        </Grid>

        {/* Request Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Solicitudes Pendientes"
            value={stats.requests.pending}
            subtitle={`${stats.requests.total} total`}
            icon={<PendingIcon />}
            color="error"
          />
        </Grid>

        {/* Attendance Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tasa de Asistencia"
            value={`${stats.attendance.attendance_rate}%`}
            subtitle={`${stats.attendance.attended}/${stats.attendance.total_records}`}
            icon={<CheckCircleIcon />}
            color="success"
          />
        </Grid>

        {/* Top Subjects */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top 5 Materias Solicitadas
              </Typography>
              <List>
                {stats.top_subjects.map((subject, index) => (
                  <ListItem key={subject.subject_id}>
                    <ListItemText
                      primary={`${index + 1}. ${subject.subject_name}`}
                      secondary={`${subject.request_count} solicitudes`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Professors */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top 5 Profesores
              </Typography>
              <List>
                {stats.top_professors.map((prof, index) => (
                  <ListItem key={prof.user_id}>
                    <ListItemText
                      primary={`${index + 1}. ${prof.name} ${prof.last_name}`}
                      secondary={`${prof.advisory_count} asesorías • ⭐ ${prof.avg_rating?.toFixed(1) || 'N/A'}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}
```

3. **Actualizar exports**:
```typescript
// src/api/endpoints/index.ts
export * from './admin'; // AGREGAR
```

**Resultado**: Dashboard con datos reales ✅

---

### 1.2 Session Students in AttendanceForm

**Componente**: `src/components/professor/AttendanceForm.tsx`

**Cambios requeridos**:

1. **Actualizar types.ts con nuevo DTO**:
```typescript
// src/api/types.ts (AGREGAR)
export interface SessionStudentsResponse {
  session: {
    advisory_date_id: number;
    advisory_id: number;
    topic: string;
    date: string;
    notes: string;
    session_link?: string;
    venue: {
      venue_id: number;
      building: string;
      classroom: string;
      capacity: number;
    };
    subject: {
      subject_id: number;
      subject_name: string;
    };
    professor: {
      user_id: number;
      name: string;
      last_name: string;
      email: string;
      photo_url?: string;
    };
    max_students: number;
    completed_at?: string;
  };
  students: Array<{
    user_id: number;
    student_id: string;
    name: string;
    last_name: string;
    email: string;
    photo_url?: string;
    phone_number?: string;
    attended: boolean;
    attendance_notes?: string;
    join_type: string;
  }>;
  total_students: number;
  attended_count: number;
  absent_count: number;
  attendance_rate: number;
}
```

2. **Crear endpoint en attendance.ts**:
```typescript
// src/api/endpoints/attendance.ts (AGREGAR)
import type { SessionStudentsResponse } from '../types';

/**
 * Get enrolled students for a session
 */
export async function getSessionStudents(
  sessionId: number
): Promise<SessionStudentsResponse> {
  const response = await apiClient.get<SessionStudentsResponse>(
    `/advisories/sessions/${sessionId}/students`
  );
  return response.data;
}
```

3. **Actualizar ManageSessionsPage.tsx**:
```typescript
// src/pages/professor/ManageSessionsPage.tsx

// REEMPLAZAR esta sección:
if (attendanceView && selectedSession) {
  return (
    <Layout title="Registro de Asistencia">
      <Box>
        <Button
          variant="outlined"
          onClick={() => {
            setAttendanceView(false);
            setSelectedSession(null);
          }}
          sx={{ mb: 3 }}
        >
          ← Volver a Sesiones
        </Button>
        
        <AttendanceForm
          sessionId={selectedSession.advisory_date_id}
          students={[]} // ❌ ESTO ESTÁ VACÍO
          onSuccess={() => {
            setAttendanceView(false);
            setSelectedSession(null);
          }}
        />
      </Box>
    </Layout>
  );
}

// POR ESTO:
if (attendanceView && selectedSession) {
  return (
    <Layout title="Registro de Asistencia">
      <AttendanceViewWrapper
        sessionId={selectedSession.advisory_date_id}
        onBack={() => {
          setAttendanceView(false);
          setSelectedSession(null);
        }}
      />
    </Layout>
  );
}

// AGREGAR componente wrapper:
function AttendanceViewWrapper({ 
  sessionId, 
  onBack 
}: { 
  sessionId: number; 
  onBack: () => void;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['session-students', sessionId],
    queryFn: () => getSessionStudents(sessionId),
  });

  if (isLoading) {
    return <LoadingSpinner message="Cargando estudiantes..." />;
  }

  if (error) {
    return (
      <Box>
        <Button variant="outlined" onClick={onBack} sx={{ mb: 3 }}>
          ← Volver
        </Button>
        <Alert severity="error">
          Error al cargar estudiantes. Por favor, intente de nuevo.
        </Alert>
      </Box>
    );
  }

  const students = data.students.map(s => ({
    user_id: s.user_id,
    name: s.name,
    last_name: s.last_name,
    email: s.email,
    student_id: s.student_id,
    photo_url: s.photo_url,
    phone_number: s.phone_number,
  })) as User[];

  return (
    <Box>
      <Button variant="outlined" onClick={onBack} sx={{ mb: 3 }}>
        ← Volver a Sesiones
      </Button>
      
      {/* Session Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {data.session.topic}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            📍 {data.session.venue.building} - {data.session.venue.classroom}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            👥 {data.total_students} estudiantes inscritos
          </Typography>
          {data.total_students > 0 && (
            <Chip
              label={`Asistencia: ${data.attendance_rate}%`}
              color={data.attendance_rate >= 80 ? 'success' : 'warning'}
              size="small"
              sx={{ mt: 1 }}
            />
          )}
        </CardContent>
      </Card>
      
      <AttendanceForm
        sessionId={sessionId}
        students={students}
        onSuccess={onBack}
      />
    </Box>
  );
}
```

**Resultado**: Formulario de asistencia funcional ✅

---

## 🔨 Phase 2: Subject Details Integration (2-3 días)

### 2.1 Subject Details API Client

**Crear archivo**: `src/api/endpoints/subjectDetails.ts`

```typescript
/**
 * Subject Details API Endpoints
 * School Advisories System
 */

import { apiClient } from '../client';

export interface SubjectDetail {
  subject_detail_id: number;
  subject_id: number;
  professor_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  subject: {
    subject_id: number;
    name: string;
    code: string;
    description: string;
  };
  professor: {
    user_id: number;
    name: string;
    last_name: string;
    email: string;
  };
  schedules?: Array<{
    day: string;
    start_time: string;
    end_time: string;
  }>;
}

export interface CreateSubjectDetailDto {
  subject_id: number;
  professor_id: number;
  schedules?: Array<{
    day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
    start_time: string; // HH:mm format
    end_time: string;   // HH:mm format
  }>;
}

export interface UpdateSubjectDetailDto {
  subject_id?: number;
  professor_id?: number;
  is_active?: boolean;
  schedules?: Array<{
    day: string;
    start_time: string;
    end_time: string;
  }>;
}

/**
 * Get all subject details (assignments)
 */
export const getAllSubjectDetails = async (): Promise<SubjectDetail[]> => {
  const response = await apiClient.get<SubjectDetail[]>('/subject-details');
  return response.data;
};

/**
 * Get subject details by professor
 */
export const getSubjectDetailsByProfessor = async (
  professorId: number
): Promise<SubjectDetail[]> => {
  const response = await apiClient.get<SubjectDetail[]>(
    `/subject-details/professor/${professorId}`
  );
  return response.data;
};

/**
 * Get professors for a subject
 */
export const getProfessorsBySubject = async (
  subjectId: number
): Promise<SubjectDetail[]> => {
  const response = await apiClient.get<SubjectDetail[]>(
    `/subject-details/subject/${subjectId}/professors`
  );
  return response.data;
};

/**
 * Create subject detail (assignment)
 */
export const createSubjectDetail = async (
  data: CreateSubjectDetailDto
): Promise<SubjectDetail> => {
  const response = await apiClient.post<SubjectDetail>('/subject-details', data);
  return response.data;
};

/**
 * Update subject detail
 */
export const updateSubjectDetail = async (
  id: number,
  data: UpdateSubjectDetailDto
): Promise<SubjectDetail> => {
  const response = await apiClient.patch<SubjectDetail>(
    `/subject-details/${id}`,
    data
  );
  return response.data;
};

/**
 * Delete subject detail
 */
export const deleteSubjectDetail = async (id: number): Promise<void> => {
  await apiClient.delete(`/subject-details/${id}`);
};

/**
 * Toggle subject detail status
 */
export const toggleSubjectDetailStatus = async (
  id: number
): Promise<SubjectDetail> => {
  const response = await apiClient.patch<SubjectDetail>(
    `/subject-details/${id}/toggle-status`
  );
  return response.data;
};

/**
 * Check if professor is assigned to subject
 */
export const checkSubjectAssignment = async (
  professorId: number,
  subjectId: number
): Promise<{ assigned: boolean; assignment?: SubjectDetail }> => {
  const response = await apiClient.get(
    `/subject-details/check/${professorId}/${subjectId}`
  );
  return response.data;
};
```

### 2.2 Subject Details Manager Component

**Crear archivo**: `src/components/admin/SubjectDetailsManager.tsx`

```typescript
/**
 * Subject Details Manager Component
 * Admin management of professor-subject assignments
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import {
  getAllSubjectDetails,
  createSubjectDetail,
  updateSubjectDetail,
  deleteSubjectDetail,
  toggleSubjectDetailStatus,
  type SubjectDetail,
  type CreateSubjectDetailDto,
} from '@/api/endpoints/subjectDetails';
import { getAllSubjects } from '@/api/endpoints/subjects';
import { getAllUsers } from '@/api/endpoints/users';

export function SubjectDetailsManager() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<SubjectDetail | null>(null);
  const [formData, setFormData] = useState<CreateSubjectDetailDto>({
    subject_id: 0,
    professor_id: 0,
  });

  // Fetch assignments
  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ['subject-details'],
    queryFn: getAllSubjectDetails,
  });

  // Fetch subjects for dropdown
  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: getAllSubjects,
  });

  // Fetch professors for dropdown
  const { data: allUsers = [] } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  });

  const professors = allUsers.filter((u) => u.role === 'professor');

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createSubjectDetail,
    onSuccess: () => {
      toast.success('Asignación creada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['subject-details'] });
      handleCloseDialog();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al crear asignación';
      toast.error(message);
    },
  });

  // Toggle status mutation
  const toggleMutation = useMutation({
    mutationFn: toggleSubjectDetailStatus,
    onSuccess: () => {
      toast.success('Estado actualizado');
      queryClient.invalidateQueries({ queryKey: ['subject-details'] });
    },
    onError: () => {
      toast.error('Error al actualizar estado');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteSubjectDetail,
    onSuccess: () => {
      toast.success('Asignación eliminada');
      queryClient.invalidateQueries({ queryKey: ['subject-details'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al eliminar';
      toast.error(message);
    },
  });

  const handleOpenDialog = () => {
    setEditingAssignment(null);
    setFormData({ subject_id: 0, professor_id: 0 });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAssignment(null);
  };

  const handleSubmit = () => {
    if (formData.subject_id === 0 || formData.professor_id === 0) {
      toast.error('Debe seleccionar materia y profesor');
      return;
    }
    createMutation.mutate(formData);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta asignación?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Asignaciones Profesor-Materia
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Nueva Asignación
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Materia</TableCell>
              <TableCell>Profesor</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow key={assignment.subject_detail_id}>
                <TableCell>{assignment.subject_detail_id}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {assignment.subject.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {assignment.subject.code}
                  </Typography>
                </TableCell>
                <TableCell>
                  {assignment.professor.name} {assignment.professor.last_name}
                </TableCell>
                <TableCell>
                  <Chip
                    label={assignment.is_active ? 'Activo' : 'Inactivo'}
                    color={assignment.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => toggleMutation.mutate(assignment.subject_detail_id)}
                    color={assignment.is_active ? 'warning' : 'success'}
                  >
                    {assignment.is_active ? <ToggleOffIcon /> : <ToggleOnIcon />}
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(assignment.subject_detail_id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Nueva Asignación</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              label="Materia"
              value={formData.subject_id}
              onChange={(e) =>
                setFormData({ ...formData, subject_id: Number(e.target.value) })
              }
              fullWidth
            >
              <MenuItem value={0}>Seleccione una materia</MenuItem>
              {subjects.map((subject) => (
                <MenuItem key={subject.subject_id} value={subject.subject_id}>
                  {subject.name} ({subject.code})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Profesor"
              value={formData.professor_id}
              onChange={(e) =>
                setFormData({ ...formData, professor_id: Number(e.target.value) })
              }
              fullWidth
            >
              <MenuItem value={0}>Seleccione un profesor</MenuItem>
              {professors.map((prof) => (
                <MenuItem key={prof.user_id} value={prof.user_id}>
                  {prof.name} {prof.last_name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Creando...' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
```

### 2.3 Add to Admin Routes

```typescript
// src/App.tsx - Agregar lazy import
const AdminSubjectDetailsPage = lazy(
  () => import('@/pages/admin/AdminSubjectDetailsPage')
);

// Agregar ruta
<Route
  path="/admin/subject-details"
  element={
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <AdminSubjectDetailsPage />
    </ProtectedRoute>
  }
/>

// src/components/common/Layout.tsx - Agregar a admin menu
{
  text: 'Asignaciones',
  icon: <AssignmentIcon />,
  path: '/admin/subject-details',
  roles: [UserRole.ADMIN],
}
```

**Resultado**: Gestión completa de asignaciones ✅

---

## 🎨 Phase 3: Enhancement Integration (1-2 días)

### 3.1 Session Details Modal

Actualizar `ManageSessionsPage.tsx` para usar el endpoint completo:

```typescript
// Al hacer click en "Ver detalles"
const { data: sessionDetails } = useQuery({
  queryKey: ['session-details', sessionId],
  queryFn: () => getSessionDetails(sessionId),
  enabled: detailsModalOpen,
});
```

### 3.2 Email Templates Management

Crear componente similar a `SubjectDetailsManager.tsx` para templates.

---

## ✅ Testing Checklist

- [ ] Admin Dashboard muestra estadísticas reales
- [ ] AttendanceForm muestra estudiantes de la sesión
- [ ] SubjectDetailsManager CRUD funciona
- [ ] Session details modal muestra información completa
- [ ] Email templates son editables
- [ ] Todos los endpoints tienen manejo de errores
- [ ] Loading states funcionan correctamente
- [ ] Toast notifications aparecen en todas las acciones

---

## 🚀 Deployment Checklist

Antes de desplegar:

1. [ ] Actualizar variable de entorno `VITE_API_URL` para producción
2. [ ] Verificar que todos los endpoints usen `apiClient` (no URLs hardcodeadas)
3. [ ] Probar flujos completos E2E
4. [ ] Revisar que no hay console.log en producción
5. [ ] Build de producción exitoso (`npm run build`)
6. [ ] Preview del build (`npm run preview`)

---

**Siguiente paso**: Empezar con Phase 1.1 (Admin Dashboard Stats)
