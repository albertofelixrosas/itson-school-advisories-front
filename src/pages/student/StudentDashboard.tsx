/**
 * Student Dashboard Page
 * School Advisories System
 */

import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/common';
import { Box, Typography, Paper, Button } from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Event as EventIcon,
  Check as CheckIcon,
  Add as AddIcon,
} from '@mui/icons-material';

/**
 * Student Dashboard
 * 
 * Main dashboard for student users
 */
export function StudentDashboard() {
  const navigate = useNavigate();

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

        {/* Stats Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <AssignmentIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold">
              0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Solicitudes Pendientes
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <EventIcon sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold">
              0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Invitaciones Activas
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <CheckIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold">
              0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sesiones Completadas
            </Typography>
          </Paper>
        </Box>

        {/* Coming Soon */}
        <Box sx={{ mt: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              🚧 En Construcción
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Las funcionalidades completas del dashboard estarán disponibles próximamente.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Layout>
  );
}

export default StudentDashboard;
