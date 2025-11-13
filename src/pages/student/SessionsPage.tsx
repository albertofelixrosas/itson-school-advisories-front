/**
 * Sessions Page
 * School Advisories System
 * 
 * Page displaying student's advisory sessions calendar
 */

import { Box, Typography } from '@mui/material';
import { Layout } from '@/components/common';
import { SessionsCalendar } from '@/components/student';

/**
 * Sessions Page Component
 */
export function SessionsPage() {
  return (
    <Layout title="Mis Sesiones">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Mis Sesiones de Asesoría
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Aquí puedes ver todas tus sesiones de asesoría programadas, tanto próximas como pasadas.
          </Typography>
        </Box>

        {/* Sessions Calendar */}
        <SessionsCalendar />
      </Box>
    </Layout>
  );
}

export default SessionsPage;
