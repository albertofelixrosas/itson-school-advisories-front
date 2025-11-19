/**
 * Admin Subject Details Page
 * School Advisories System
 * 
 * Page for managing professor-subject assignments
 */

import { Container, Typography, Box } from '@mui/material';
import { SubjectDetailsManager } from '../../components/admin';

export default function AdminSubjectDetailsPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Asignaciones de Profesores
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Administra las asignaciones de profesores a materias
        </Typography>
        <SubjectDetailsManager />
      </Box>
    </Container>
  );
}
