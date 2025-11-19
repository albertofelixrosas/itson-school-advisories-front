/**
 * Availability Page
 * School Advisories System
 * 
 * Page for professors to manage their availability schedules
 */

import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Layout } from '@/components/common';
import { AvailabilityManager } from '@/components/professor';

/**
 * Availability Page Component
 */
export function AvailabilityPage() {
  const navigate = useNavigate();

  return (
    <Layout title="Gestión de Disponibilidad">
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/professor/dashboard')}
          sx={{ mb: 3 }}
        >
          Volver al Dashboard
        </Button>

        <AvailabilityManager />
      </Box>
    </Layout>
  );
}

export default AvailabilityPage;
