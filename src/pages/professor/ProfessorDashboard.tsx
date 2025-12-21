/**
 * Professor Dashboard Page
 * School Advisories System
 */

import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layout, LoadingSpinner } from '@/components/common';
import { Box, Typography, Paper, Button, Alert, Card, CardContent, Divider, Stack, Chip } from '@mui/material';
import { Grid } from '@mui/material';
import {
  PendingActions as PendingIcon,
  EventAvailable as AvailableIcon,
  Groups as GroupsIcon,
  Add as AddIcon,
  TrendingUp as TrendingIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon,
  MenuBook as SubjectIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { getProfessorDashboard } from '@/api/endpoints/dashboard';

/**
 * Professor Dashboard
 * 
 * Main dashboard for professor users with real-time statistics
 */
export function ProfessorDashboard() {
  const navigate = useNavigate();

  // Fetch dashboard data with auto-refresh every 5 minutes
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['professor-dashboard'],
    queryFn: getProfessorDashboard,
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });

  if (isLoading) {
    return (
      <Layout title="Dashboard de Profesor">
        <LoadingSpinner message="Cargando dashboard..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Dashboard de Profesor">
        <Alert severity="error">
          Error al cargar el dashboard. Por favor, intente de nuevo.
        </Alert>
      </Layout>
    );
  }

  // Safely extract data with defaults
  const overview = dashboardData?.overview || {
    total_active_advisories: 0,
    pending_requests: 0,
    students_helped_this_month: 0,
    upcoming_sessions: 0,
  };

  const recent_activity = dashboardData?.recent_activity || {
    last_advisories: [],
    next_availability_slot: null,
  };

  const statistics = dashboardData?.statistics || {
    total_subjects: 0,
    total_hours_this_semester: 0,
    average_rating: 0,
    completion_rate: 0,
    total_students_helped: 0,
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  // Helper function to translate status
  const translateStatus = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Programada';
      case 'completed':
        return 'Completada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  return (
    <Layout title="Dashboard de Profesor">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Dashboard de Profesor
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Resumen de tus asesorías y estadísticas del semestre.
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/professor/availability')}
          >
            Gestionar Disponibilidad
          </Button>
        </Box>

        {/* Overview Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                }
              }}
            >
              <AvailableIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" fontWeight="bold">
                {overview.total_active_advisories}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Asesorías Activas
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                }
              }}
              onClick={() => navigate('/professor/requests')}
            >
              <PendingIcon sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
              <Typography variant="h4" fontWeight="bold">
                {overview.pending_requests}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Solicitudes Pendientes
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                }
              }}
            >
              <GroupsIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h4" fontWeight="bold">
                {overview.students_helped_this_month}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Estudiantes Este Mes
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                }
              }}
            >
              <ScheduleIcon sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
              <Typography variant="h4" fontWeight="bold">
                {overview.upcoming_sessions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sesiones Próximas
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Statistics Section */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Estadísticas del Semestre
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SubjectIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {statistics.total_subjects}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Materias Asignadas
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TimeIcon sx={{ fontSize: 40, color: 'info.main' }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {statistics.total_hours_this_semester.toFixed(1)}h
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Horas Impartidas
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <StarIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {statistics.average_rating.toFixed(1)} / 5.0
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Calificación Promedio
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TrendingIcon sx={{ fontSize: 40, color: 'success.main' }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {statistics.completion_rate.toFixed(0)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tasa de Completitud
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <GroupsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {statistics.total_students_helped}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Estudiantes Ayudados
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Recent Advisories */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Últimas Asesorías
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {recent_activity.last_advisories.length > 0 ? (
                  <Stack spacing={2}>
                    {recent_activity.last_advisories.map((advisory) => {
                      // Skip if required fields are missing
                      if (!advisory || !advisory.date) return null;
                      
                      return (
                        <Paper
                          key={advisory.advisory_id}
                          sx={{ p: 2, bgcolor: 'background.default' }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                            <Box>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {advisory.student_name || 'N/A'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {advisory.subject || 'Sin materia'}
                              </Typography>
                            </Box>
                            <Chip 
                              label={translateStatus(advisory.status || 'scheduled')} 
                              color={getStatusColor(advisory.status || 'scheduled')}
                              size="small"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {format(parseISO(advisory.date), "EEEE d 'de' MMMM", { locale: es })}
                            {advisory.start_time && advisory.end_time && (
                              <> • {advisory.start_time.slice(0, 5)} - {advisory.end_time.slice(0, 5)}</>
                            )}
                          </Typography>
                          {advisory.notes && (
                            <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                              Notas: {advisory.notes}
                            </Typography>
                          )}
                        </Paper>
                      );
                    })}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No hay asesorías recientes para mostrar.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Next Availability Slot */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Próximo Espacio Disponible
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {recent_activity.next_availability_slot ? (
                  <Box>
                    <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                        {recent_activity.next_availability_slot.day_of_week}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {recent_activity.next_availability_slot.start_time?.slice(0, 5) || 'N/A'} - {recent_activity.next_availability_slot.end_time?.slice(0, 5) || 'N/A'}
                      </Typography>
                      <Typography variant="body2">
                        {recent_activity.next_availability_slot.venue_name}
                      </Typography>
                      {recent_activity.next_availability_slot.is_available && (
                        <Chip 
                          label="Disponible" 
                          size="small" 
                          sx={{ mt: 1, bgcolor: 'success.main', color: 'white' }}
                        />
                      )}
                    </Paper>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No hay espacios de disponibilidad configurados.
                  </Typography>
                )}

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/professor/availability')}
                  sx={{ mt: 2 }}
                >
                  Gestionar Disponibilidad
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}

export default ProfessorDashboard;

