/**
 * Create Session Page
 * School Advisories System
 * 
 * Page for professors to create direct advisory sessions
 */

import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Layout } from '@/components/common';
import { CreateSessionForm } from '@/components/professor';

/**
 * Create Session Page Component
 */
export function CreateSessionPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Navigate to sessions list after successful creation
    navigate('/professor/sessions');
  };

  const handleCancel = () => {
    navigate('/professor/dashboard');
  };

  return (
    <Layout title="Crear Sesión de Asesoría">
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/professor/dashboard')}
          sx={{ mb: 3 }}
        >
          Volver al Dashboard
        </Button>

        <CreateSessionForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </Box>
    </Layout>
  );
}

export default CreateSessionPage;
