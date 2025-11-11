/**
 * Professor Dashboard Page
 * School Advisories System
 */

import { Layout } from '@/components/common';
import { Box, Typography, Paper } from '@mui/material';
import {
  PendingActions as PendingIcon,
  EventAvailable as AvailableIcon,
  Groups as GroupsIcon,
} from '@mui/icons-material';

/**
 * Professor Dashboard
 * 
 * Main dashboard for professor users
 */
export function ProfessorDashboard() {
  return (
    <Layout title="Dashboard de Profesor">
      <Box>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Bienvenido, Profesor
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Aquí podrás revisar solicitudes de asesoría y gestionar tus sesiones.
        </Typography>

        {/* Stats Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <PendingIcon sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold">
              0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Solicitudes Pendientes
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <AvailableIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold">
              0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Asesorías Activas
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <GroupsIcon sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold">
              0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Estudiantes Atendidos
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

export default ProfessorDashboard;
