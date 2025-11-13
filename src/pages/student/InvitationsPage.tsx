/**
 * Invitations Page
 * School Advisories System
 * 
 * Page displaying student's advisory invitations
 */

import { Box, Typography } from '@mui/material';
import { Layout } from '@/components/common';
import { MyInvitationsList } from '@/components/student';

/**
 * Invitations Page Component
 */
export function InvitationsPage() {
  return (
    <Layout title="Mis Invitaciones">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Mis Invitaciones
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Aquí puedes ver y responder a las invitaciones que los profesores te han enviado.
          </Typography>
        </Box>

        {/* Invitations List */}
        <MyInvitationsList />
      </Box>
    </Layout>
  );
}

export default InvitationsPage;
