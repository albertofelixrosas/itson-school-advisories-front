/**
 * Admin Dashboard Page
 * School Advisories System
 */

import { useQuery } from '@tanstack/react-query';
import { Layout, LoadingSpinner } from '@/components/common';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  Divider,
  Stack,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { getAdminDashboardStats } from '@/api/endpoints/admin';

/**
 * Stat Card Component
 */
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

function StatCard({ title, value, subtitle, icon, color }: StatCardProps) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${color}.main`,
              color: 'white',
              display: 'flex',
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

/**
 * Admin Dashboard
 * 
 * Main dashboard for admin users with real-time statistics
 */
export function AdminDashboard() {
  // Fetch dashboard statistics
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: getAdminDashboardStats,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  if (isLoading) {
    return (
      <Layout title="Dashboard de Administrador">
        <LoadingSpinner message="Cargando estadísticas..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Dashboard de Administrador">
        <Alert severity="error">
          Error al cargar las estadísticas del dashboard. Por favor, intente de nuevo.
        </Alert>
      </Layout>
    );
  }

  if (!stats) {
    return (
      <Layout title="Dashboard de Administrador">
        <Alert severity="info">No hay estadísticas disponibles.</Alert>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard de Administrador">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Dashboard de Administrador
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Vista general del sistema de asesorías académicas
          </Typography>
        </Box>

        {/* User Statistics */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
            Usuarios
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Usuarios"
                value={stats.users.total}
                subtitle={`${stats.users.recent_registrations} registros recientes`}
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
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Administradores"
                value={stats.users.admins}
                icon={<PersonIcon />}
                color="secondary"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Advisory & Session Statistics */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
            Asesorías y Sesiones
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                title="Asesorías Activas"
                value={stats.advisories.active}
                subtitle={`${stats.advisories.total} total`}
                icon={<AssignmentIcon />}
                color="warning"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                title="Sesiones Próximas"
                value={stats.sessions.upcoming}
                subtitle={`${stats.sessions.this_week} esta semana`}
                icon={<EventIcon />}
                color="secondary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                title="Sesiones Completadas"
                value={stats.sessions.completed}
                subtitle={`${stats.sessions.this_month} este mes`}
                icon={<CheckCircleIcon />}
                color="success"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Request & Attendance Statistics */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
            Solicitudes y Asistencia
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Solicitudes Pendientes"
                value={stats.requests.pending}
                subtitle={`${stats.requests.total} total`}
                icon={<PendingIcon />}
                color="error"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Solicitudes Aprobadas"
                value={stats.requests.approved}
                icon={<CheckCircleIcon />}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Tasa de Asistencia"
                value={`${stats.attendance.attendance_rate.toFixed(1)}%`}
                subtitle={`${stats.attendance.attended}/${stats.attendance.total_records} registros`}
                icon={<CheckCircleIcon />}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Materias"
                value={stats.subjects.total}
                subtitle={`${stats.subjects.with_professors} con profesores`}
                icon={<SchoolIcon />}
                color="primary"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Top Lists */}
        <Grid container spacing={3}>
          {/* Top Subjects */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <TrendingUpIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Top 5 Materias Solicitadas
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 2 }} />
                {stats.top_subjects.length === 0 ? (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    No hay datos disponibles
                  </Alert>
                ) : (
                  <List>
                    {stats.top_subjects.map((subject, index) => (
                      <ListItem key={subject.subject_id} divider={index < stats.top_subjects.length - 1}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                label={`#${index + 1}`}
                                size="small"
                                color="primary"
                                sx={{ minWidth: 40 }}
                              />
                              <Typography variant="body1" fontWeight="medium">
                                {subject.subject_name}
                              </Typography>
                            </Box>
                          }
                          secondary={`${subject.request_count} solicitudes`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Top Professors */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <StarIcon color="warning" />
                  <Typography variant="h6" fontWeight="bold">
                    Top 5 Profesores
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 2 }} />
                {stats.top_professors.length === 0 ? (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    No hay datos disponibles
                  </Alert>
                ) : (
                  <List>
                    {stats.top_professors.map((prof, index) => (
                      <ListItem key={prof.user_id} divider={index < stats.top_professors.length - 1}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                label={`#${index + 1}`}
                                size="small"
                                color="warning"
                                sx={{ minWidth: 40 }}
                              />
                              <Typography variant="body1" fontWeight="medium">
                                {prof.name} {prof.last_name}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                              <Typography variant="caption">
                                {prof.advisory_count} asesorías
                              </Typography>
                              {prof.avg_rating && (
                                <Typography variant="caption">
                                  ⭐ {prof.avg_rating.toFixed(1)}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Additional Stats */}
        {stats.requests.avg_response_time_hours > 0 && (
          <Box sx={{ mt: 3 }}>
            <Alert severity="info" icon={<TrendingUpIcon />}>
              Tiempo promedio de respuesta a solicitudes:{' '}
              <strong>{stats.requests.avg_response_time_hours.toFixed(1)} horas</strong>
            </Alert>
          </Box>
        )}
      </Box>
    </Layout>
  );
}

export default AdminDashboard;
