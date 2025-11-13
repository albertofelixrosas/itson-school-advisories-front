/**
 * Student Dashboard Page
 * School Advisories System
 */

import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layout, LoadingSpinner } from '@/components/common';
import { Box, Typography, Paper, Button, Alert, Card, CardContent, Divider, Stack } from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Event as EventIcon,
  Check as CheckIcon,
  Add as AddIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { getStudentDashboard } from '@/api/endpoints/dashboard';

/**
 * Student Dashboard
 * 
 * Main dashboard for student users with real-time data
 */
export function StudentDashboard() {
  const navigate = useNavigate();

  // Fetch dashboard data
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['student-dashboard'],
    queryFn: getStudentDashboard,
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

  const stats = dashboardData?.stats || {};
  const recentActivity = dashboardData?.recent_activity || [];
  const notificationsCount = dashboardData?.notifications_count || 0;

  return (
    <Layout title="Dashboard de Estudiante">
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Bienvenido, Estudiante
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Aquí podrás gestionar tus solicitudes de asesoría y ver tus invitaciones.
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

        {/* Notifications Alert */}
        {notificationsCount > 0 && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Tienes {notificationsCount} {notificationsCount === 1 ? 'notificación nueva' : 'notificaciones nuevas'}
          </Alert>
        )}

        {/* Stats Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
            mb: 4,
          }}
        >
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
            <AssignmentIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold">
              {stats.pending_requests || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Solicitudes Pendientes
            </Typography>
          </Paper>

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
            onClick={() => navigate('/student/invitations')}
          >
            <EventIcon sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold">
              {stats.total_requests || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total de Solicitudes
            </Typography>
          </Paper>

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
            onClick={() => navigate('/student/sessions')}
          >
            <CheckIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold">
              {stats.completed_sessions || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sesiones Completadas
            </Typography>
          </Paper>
        </Box>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Actividad Reciente
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                {recentActivity.map((activity, index) => (
                  <Box key={index}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {activity.timestamp && format(parseISO(activity.timestamp), "d 'de' MMMM, HH:mm", { locale: es })}
                    </Typography>
                    <Typography variant="body1">
                      {activity.message}
                    </Typography>
                    {index < recentActivity.length - 1 && <Divider sx={{ mt: 2 }} />}
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {recentActivity.length === 0 && (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No hay actividad reciente. ¡Crea tu primera solicitud de asesoría para comenzar!
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => navigate('/student/new-request')}
                sx={{ mt: 2 }}
              >
                Crear Solicitud
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>
    </Layout>
  );
}

export default StudentDashboard;
