/**
 * Admin Subjects Page
 * School Advisories System
 * 
 * Page for managing subjects (Admin only)
 */

import { Box, Typography, IconButton } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/common/Layout';
import { SubjectManagementTable } from '@/components/admin/SubjectManagementTable';

/**
 * Admin Subjects Page Component
 */
export function AdminSubjectsPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <Box sx={{ maxWidth: 1400, mx: 'auto', overflow: 'hidden', width: '100%' }}>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/admin/dashboard')} color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">
            Administración de Materias
          </Typography>
        </Box>

        {/* Subject Management Table */}
        <SubjectManagementTable />
      </Box>
    </Layout>
  );
}
