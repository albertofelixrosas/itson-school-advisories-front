/**
 * Admin Dashboard Page
 * School Advisories System
 */

import { Layout } from '@/components/common';
import { Box, Typography, Paper } from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

/**
 * Admin Dashboard
 * 
 * Main dashboard for admin users
 */
export function AdminDashboard() {
  return (
    <Layout title="Dashboard de Administrador">
      <Box>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Bienvenido, Administrador
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Aquí podrás gestionar usuarios, materias y configuraciones del sistema.
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
            <PeopleIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold">
              0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Usuarios Registrados
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <SchoolIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold">
              0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Materias Activas
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <LocationIcon sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold">
              0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sedes Disponibles
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

export default AdminDashboard;
