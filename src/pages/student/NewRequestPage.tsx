/**
 * New Request Page
 * School Advisories System
 * 
 * Page for students to create new advisory requests
 */

import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Layout } from '@/components/common';
import { AdvisoryRequestForm } from '@/components/student';

/**
 * New Request Page Component
 */
export function NewRequestPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Navigate to requests list after successful creation
    navigate('/student/requests');
  };

  const handleCancel = () => {
    navigate('/student/dashboard');
  };

  return (
    <Layout title="Nueva Solicitud de Asesoría">
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/student/dashboard')}
          sx={{ mb: 3 }}
        >
          Volver al Dashboard
        </Button>

        <AdvisoryRequestForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </Box>
    </Layout>
  );
}

export default NewRequestPage;
