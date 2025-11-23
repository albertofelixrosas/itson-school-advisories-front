/**
 * Profile Page Component
 * School Advisories System
 * 
 * User profile page with view capabilities - displays different information based on user role
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  TextField,
  Button,
  Chip,
  Divider,
  Stack,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { Layout } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { getProfile } from '@/api/endpoints/auth';
import type { ProfileResponse, StudentProfileResponse, ProfessorProfileResponse, AdminProfileResponse } from '@/api/types/profile.types';
import toast from 'react-hot-toast';

/**
 * Profile Page Component
 */
export function ProfilePage() {
  const { user: authUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user profile with correct typing
  const { data: profile, isLoading, error } = useQuery<ProfileResponse>({
    queryKey: ['user-profile'],
    queryFn: getProfile,
    enabled: !!authUser,
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    // TODO: Implement update profile functionality
    toast.success('Perfil actualizado (funcionalidad pendiente)');
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error || !profile) {
    return (
      <Layout>
        <Alert severity="error">
          Error al cargar el perfil. Por favor, intenta nuevamente.
        </Alert>
      </Layout>
    );
  }

  const { user_info } = profile;

  const getRoleName = (role: string) => {
    const roles: Record<string, string> = {
      student: 'Estudiante',
      professor: 'Profesor',
      admin: 'Administrador',
    };
    return roles[role] || role;
  };

  const getRoleColor = (role: string): 'primary' | 'success' | 'error' | 'default' => {
    const colors: Record<string, 'primary' | 'success' | 'error'> = {
      student: 'primary',
      professor: 'success',
      admin: 'error',
    };
    return colors[role] || 'default';
  };

  // Renderizar información específica según el rol
  const renderRoleSpecificInfo = () => {
    if (user_info.role === 'student' && 'student_profile' in profile) {
      const studentProfile = profile as StudentProfileResponse;
      return (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Información Académica
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" color="text.secondary">Carrera</Typography>
              <Typography variant="body1">{studentProfile.student_profile.career}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Semestre</Typography>
              <Typography variant="body1">{studentProfile.student_profile.semester}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Matrícula</Typography>
              <Typography variant="body1">{studentProfile.student_profile.student_id}</Typography>
            </Box>
            
            <Divider />
            
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Estadísticas
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Card variant="outlined" sx={{ flex: 1, minWidth: 150 }}>
                <CardContent>
                  <Typography variant="h4" color="primary">{studentProfile.statistics.total_appointments}</Typography>
                  <Typography variant="body2" color="text.secondary">Asesorías Totales</Typography>
                </CardContent>
              </Card>
              <Card variant="outlined" sx={{ flex: 1, minWidth: 150 }}>
                <CardContent>
                  <Typography variant="h4" color="success.main">{studentProfile.statistics.completed_sessions}</Typography>
                  <Typography variant="body2" color="text.secondary">Sesiones Completadas</Typography>
                </CardContent>
              </Card>
              <Card variant="outlined" sx={{ flex: 1, minWidth: 150 }}>
                <CardContent>
                  <Typography variant="h4" color="warning.main">{studentProfile.statistics.active_appointments}</Typography>
                  <Typography variant="body2" color="text.secondary">Asesorías Activas</Typography>
                </CardContent>
              </Card>
            </Stack>
          </Stack>
        </Box>
      );
    }

    if (user_info.role === 'professor' && 'professor_profile' in profile) {
      const professorProfile = profile as ProfessorProfileResponse;
      return (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Información Profesional
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" color="text.secondary">Departamento</Typography>
              <Typography variant="body1">{professorProfile.professor_profile.department}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Grado Académico</Typography>
              <Typography variant="body1">{professorProfile.professor_profile.academic_degree}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Oficina</Typography>
              <Typography variant="body1">{professorProfile.professor_profile.office_location}</Typography>
            </Box>
            
            <Divider />
            
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Materias Asignadas ({professorProfile.assigned_subjects.total_subjects})
            </Typography>
            <Stack spacing={1}>
              {professorProfile.assigned_subjects.subjects.map((subject) => (
                <Chip key={subject.subject_id} label={subject.name} variant="outlined" />
              ))}
            </Stack>
            
            <Divider />
            
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Estadísticas
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Card variant="outlined" sx={{ flex: 1, minWidth: 150 }}>
                <CardContent>
                  <Typography variant="h4" color="primary">{professorProfile.statistics.total_advisories}</Typography>
                  <Typography variant="body2" color="text.secondary">Asesorías Totales</Typography>
                </CardContent>
              </Card>
              <Card variant="outlined" sx={{ flex: 1, minWidth: 150 }}>
                <CardContent>
                  <Typography variant="h4" color="success.main">{professorProfile.statistics.total_students_helped}</Typography>
                  <Typography variant="body2" color="text.secondary">Estudiantes Ayudados</Typography>
                </CardContent>
              </Card>
              <Card variant="outlined" sx={{ flex: 1, minWidth: 150 }}>
                <CardContent>
                  <Typography variant="h4" color="warning.main">{professorProfile.statistics.average_rating.toFixed(1)}</Typography>
                  <Typography variant="body2" color="text.secondary">Calificación Promedio</Typography>
                </CardContent>
              </Card>
            </Stack>
          </Stack>
        </Box>
      );
    }

    if (user_info.role === 'admin' && 'admin_profile' in profile) {
      const adminProfile = profile as AdminProfileResponse;
      return (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Información Administrativa
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" color="text.secondary">Departamento</Typography>
              <Typography variant="body1">{adminProfile.admin_profile.department}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Posición</Typography>
              <Typography variant="body1">{adminProfile.admin_profile.position}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Nivel de Acceso</Typography>
              <Chip label={adminProfile.admin_profile.access_level} color="error" size="small" />
            </Box>
            
            <Divider />
            
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Permisos
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {adminProfile.admin_profile.permissions.map((permission, index) => (
                <Chip key={index} label={permission.replace('_', ' ')} variant="outlined" size="small" />
              ))}
            </Stack>
          </Stack>
        </Box>
      );
    }

    return null;
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <Paper sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight="bold">
              Mi Perfil
            </Typography>
            {!isEditing ? (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEdit}
              >
                Editar Perfil
              </Button>
            ) : (
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                >
                  Guardar
                </Button>
              </Stack>
            )}
          </Box>

          {/* Profile Avatar and Basic Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 3 }}>
            <Avatar
              src={user_info.photo_url || undefined}
              sx={{ width: 120, height: 120, bgcolor: 'primary.main' }}
            >
              {!user_info.photo_url && <PersonIcon sx={{ fontSize: 60 }} />}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight="bold">
                {user_info.name} {user_info.last_name}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                {user_info.email}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip
                  label={getRoleName(user_info.role)}
                  color={getRoleColor(user_info.role)}
                  size="small"
                />
                <Chip
                  label={user_info.is_active ? 'Activo' : 'Inactivo'}
                  color={user_info.is_active ? 'success' : 'default'}
                  size="small"
                />
              </Stack>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Profile Information Form */}
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <TextField
                label="Nombre(s)"
                value={user_info.name}
                fullWidth
                disabled={!isEditing}
                InputProps={{
                  readOnly: !isEditing,
                }}
              />
              <TextField
                label="Apellidos"
                value={user_info.last_name}
                fullWidth
                disabled={!isEditing}
                InputProps={{
                  readOnly: !isEditing,
                }}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <TextField
                label="Nombre de usuario"
                value={user_info.username}
                fullWidth
                disabled
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label="Correo electrónico"
                value={user_info.email}
                fullWidth
                disabled={!isEditing}
                InputProps={{
                  readOnly: !isEditing,
                }}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <TextField
                label="Teléfono"
                value={user_info.phone_number}
                fullWidth
                disabled={!isEditing}
                InputProps={{
                  readOnly: !isEditing,
                }}
              />
              <TextField
                label="Rol"
                value={getRoleName(user_info.role)}
                fullWidth
                disabled
                InputProps={{
                  readOnly: true,
                }}
              />
            </Stack>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Role-specific information */}
          {renderRoleSpecificInfo()}

          <Divider sx={{ my: 3 }} />

          {/* Account Information */}
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Información de la cuenta
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Fecha de creación
                </Typography>
                <Typography variant="body1">
                  {new Date(user_info.created_at).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Última actualización
                </Typography>
                <Typography variant="body1">
                  {new Date(user_info.updated_at).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
              </Box>
            </Stack>
          </Box>

          {isEditing && (
            <Alert severity="info" sx={{ mt: 3 }}>
              La funcionalidad de edición de perfil está en desarrollo. Pronto podrás actualizar tu información.
            </Alert>
          )}
        </Paper>
      </Box>
    </Layout>
  );
}

export default ProfilePage;
