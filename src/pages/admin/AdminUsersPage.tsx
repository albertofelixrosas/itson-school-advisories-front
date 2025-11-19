/**
 * Admin Users Page
 * School Advisories System
 * 
 * Page for managing users (Admin only)
 */

import { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/common/Layout';
import { UserManagementTable } from '@/components/admin/UserManagementTable';
import { UserDialog } from '@/components/admin/UserDialog';
import type { User } from '@/api/types';

/**
 * Admin Users Page Component
 */
export function AdminUsersPage() {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  /**
   * Handle create user
   */
  const handleCreateUser = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  /**
   * Handle edit user
   */
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  /**
   * Handle dialog close
   */
  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/admin/dashboard')} color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">
            Administración de Usuarios
          </Typography>
        </Box>

        {/* User Management Table */}
        <UserManagementTable
          onCreateUser={handleCreateUser}
          onEditUser={handleEditUser}
        />

        {/* User Dialog */}
        <UserDialog
          open={dialogOpen}
          user={selectedUser}
          onClose={handleDialogClose}
        />
      </Box>
    </Layout>
  );
}
