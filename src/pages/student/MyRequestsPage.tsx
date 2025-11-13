/**
 * My Requests Page
 * School Advisories System
 * 
 * Page displaying all student's advisory requests
 */

import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Layout } from '@/components/common';
import { MyRequestsList } from '@/components/student';

/**
 * My Requests Page Component
 */
export function MyRequestsPage() {
  const navigate = useNavigate();

  return (
    <Layout title="Mis Solicitudes de Asesoría">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Mis Solicitudes
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Aquí puedes ver todas tus solicitudes de asesoría y su estado.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/student/new-request')}
          >
            Nueva Solicitud
          </Button>
        </Box>

        {/* Requests List */}
        <MyRequestsList />
      </Box>
    </Layout>
  );
}

export default MyRequestsPage;
