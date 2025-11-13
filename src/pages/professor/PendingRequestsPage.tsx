/**
 * Pending Requests Page
 * School Advisories System
 * 
 * Page for professors to view and review pending advisory requests
 */

import { Layout } from '@/components/common';
import { Box, Typography } from '@mui/material';
import { PendingRequestsList } from '@/components/professor';

/**
 * PendingRequestsPage Component
 */
export function PendingRequestsPage() {
  return (
    <Layout title="Solicitudes Pendientes">
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Solicitudes Pendientes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Revisa y gestiona las solicitudes de asesoría asignadas a ti.
          </Typography>
        </Box>

        <PendingRequestsList />
      </Box>
    </Layout>
  );
}

export default PendingRequestsPage;
