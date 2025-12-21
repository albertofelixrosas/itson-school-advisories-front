/**
 * Student Dashboard Page
 * School Advisories System
 */

import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layout, LoadingSpinner } from '@/components/common';
import { Box, Typography, Paper, Button, Alert, Card, CardContent, Divider, Stack, Chip, Avatar, Grid } from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Event as EventIcon,
  Check as CheckIcon,
  Add as AddIcon,
  TrendingUp as TrendingIcon,
  Star as StarIcon,
  MenuBook as SubjectIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { getStudentDashboard } from '@/api/endpoints/dashboard';

/**
 * Student Dashboard
 * 
 * Main dashboard for student users with real-time statistics
 */
export function StudentDashboard() {
  const navigate = useNavigate();

  // Fetch dashboard data with auto-refresh every 5 minutes
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['student-dashboard'],
    queryFn: getStudentDashboard,
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });

  if (isLoading) {
    return (
      <Layout title="Dashboard de Estudiante">
        <LoadingSpinner message="Cargando dashboard..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Dashboard de Estudiante">
        <Alert severity="error">
          Error al cargar el dashboard. Por favor, intente de nuevo.
        </Alert>
      </Layout>
    );
  }

  const { overview, recent_activity, statistics } = dashboardData || {
    overview: {
      active_advisories: 0,
      completed_advisories: 0,
      pending_requests: 0,
      next_advisory: null,
    },
    recent_activity: {
      recent_advisories: [],
      available_professors: [],
    },
    statistics: {
      total_advisories_attended: 0,
      subjects_covered: [],
      total_hours_received: 0,
      average_attendance_rate: 0,
    },
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
    <Layout title="Dashboard de Estudiante">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Dashboard de Estudiante
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gestiona tus asesorías y revisa profesores disponibles.
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/student/new-request')}
          >
            Nueva Solicitud
          </Button>
        </Box>

        {/* Next Advisory Alert */}
        {overview.next_advisory && (
          <Alert 
            severity="info" 
            sx={{ mb: 3 }}
            icon={<EventIcon />}
          >
            <Typography variant="subtitle2" fontWeight="bold">
              Próxima Asesoría: {overview.next_advisory.subject}
            </Typography>
            <Typography variant="body2">
              Con {overview.next_advisory.professor_name} • {format(parseISO(overview.next_advisory.date), "EEEE d 'de' MMMM 'a las' HH:mm", { locale: es })}
            </Typography>
            <Typography variant="body2">
              {overview.next_advisory.venue_name} {overview.next_advisory.venue_type === 'virtual' && '(Virtual)'}
            </Typography>
          </Alert>
        )}

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
              <EventIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" fontWeight="bold">
                {overview.active_advisories}
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
            >
              <CheckIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h4" fontWeight="bold">
                {overview.completed_advisories}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Asesorías Completadas
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
              onClick={() => navigate('/student/requests')}
            >
              <AssignmentIcon sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
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
              <TimeIcon sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
              <Typography variant="h4" fontWeight="bold">
                {statistics.total_hours_received.toFixed(1)}h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Horas Totales
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Statistics Section */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Estadísticas Generales
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckIcon sx={{ fontSize: 40, color: 'success.main' }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {statistics.total_advisories_attended}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Asesorías Atendidas
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SubjectIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {statistics.subjects_covered.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Materias Cubiertas
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TimeIcon sx={{ fontSize: 40, color: 'info.main' }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {statistics.total_hours_received.toFixed(1)}h
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Horas Recibidas
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TrendingIcon sx={{ fontSize: 40, color: 'success.main' }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {statistics.average_attendance_rate.toFixed(0)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tasa de Asistencia
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {statistics.subjects_covered.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Materias:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {statistics.subjects_covered.map((subject, index) => (
                    <Chip 
                      key={index}
                      label={subject}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Recent Advisories */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Asesorías Recientes
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {recent_activity.recent_advisories.length > 0 ? (
                  <Stack spacing={2}>
                    {recent_activity.recent_advisories.map((advisory) => (
                      <Paper
                        key={advisory.advisory_id}
                        sx={{ p: 2, bgcolor: 'background.default' }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {advisory.professor_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {advisory.subject}
                            </Typography>
                          </Box>
                          <Chip 
                            label={translateStatus(advisory.status)} 
                            color={getStatusColor(advisory.status)}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {format(parseISO(advisory.date), "EEEE d 'de' MMMM", { locale: es })} • {advisory.start_time.slice(0, 5)} - {advisory.end_time.slice(0, 5)}
                        </Typography>
                        {advisory.rating && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                            <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                            <Typography variant="body2">
                              {advisory.rating} / 5.0
                            </Typography>
                          </Box>
                        )}
                        {advisory.feedback && (
                          <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                            "{advisory.feedback}"
                          </Typography>
                        )}
                      </Paper>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No hay asesorías recientes para mostrar.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Available Professors */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Profesores Disponibles
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {recent_activity.available_professors.length > 0 ? (
                  <Stack spacing={2}>
                    {recent_activity.available_professors.slice(0, 5).map((professor) => (
                      <Paper
                        key={professor.professor_id}
                        sx={{ 
                          p: 2, 
                          bgcolor: 'background.default',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: 'action.hover',
                            transform: 'translateX(4px)',
                          }
                        }}
                        onClick={() => navigate('/student/new-request')}
                      >
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {professor.name} {professor.last_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              {professor.department}
                            </Typography>
                            
                            {professor.subjects.length > 0 && (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                                {professor.subjects.slice(0, 3).map((subject, index) => (
                                  <Chip 
                                    key={index}
                                    label={subject}
                                    size="small"
                                    variant="outlined"
                                  />
                                ))}
                                {professor.subjects.length > 3 && (
                                  <Chip 
                                    label={`+${professor.subjects.length - 3}`}
                                    size="small"
                                    variant="outlined"
                                  />
                                )}
                              </Box>
                            )}

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                                <Typography variant="body2">
                                  {professor.average_rating.toFixed(1)}
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {professor.total_advisories_given} asesorías
                              </Typography>
                            </Box>

                            {professor.next_available_slot && (
                              <Box sx={{ mt: 1, p: 1, bgcolor: 'success.light', borderRadius: 1 }}>
                                <Typography variant="caption" color="success.dark">
                                  Próximo disponible: {professor.next_available_slot.day_of_week} {professor.next_available_slot.start_time.slice(0, 5)}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No hay profesores disponibles en este momento.
                  </Typography>
                )}

                {recent_activity.available_professors.length > 5 && (
                  <Button
                    variant="text"
                    fullWidth
                    onClick={() => navigate('/student/new-request')}
                    sx={{ mt: 2 }}
                  >
                    Ver todos ({recent_activity.available_professors.length})
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}

export default StudentDashboard;

