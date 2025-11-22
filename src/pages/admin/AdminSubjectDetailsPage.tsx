/**
 * Admin Subject Details Page
 * School Advisories System
 * 
 * Page for managing professor-subject assignments
 */

import { Typography, Box } from '@mui/material';
import { Layout } from '@/components/common/Layout';
import { SubjectDetailsManager } from '../../components/admin';

export default function AdminSubjectDetailsPage() {
  return (
    <Layout>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Asignaciones de Profesores
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Administra las asignaciones de profesores a materias
        </Typography>
        <SubjectDetailsManager />
      </Box>
    </Layout>
  );
}
