/**
 * Admin Subject Details Page
 * School Advisories System
 * 
 * Page for managing professor-subject assignments
 */

import { Box, Typography, IconButton } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/common/Layout';
import { SubjectDetailsManager } from '../../components/admin';

export default function AdminSubjectDetailsPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/admin/dashboard')} color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">
            Asignaciones de Profesores
          </Typography>
        </Box>

        {/* Subject Details Manager */}
        <SubjectDetailsManager />
      </Box>
    </Layout>
  );
}
