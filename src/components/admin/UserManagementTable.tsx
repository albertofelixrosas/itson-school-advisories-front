/**
 * User Management Table Component
 * School Advisories System
 * 
 * Admin component for managing users (CRUD operations)
 */

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Alert,
  Tooltip,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  PowerSettingsNew as PowerIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getAllUsers, deleteUser, toggleUserStatus } from '@/api/endpoints/users';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { ConfirmDialog, ResponsiveCard } from '@/components/common';
import type { User, UserRole } from '@/api/types';

/**
 * Component Props
 */
interface UserManagementTableProps {
  /** Callback when create user button is clicked */
  onCreateUser?: () => void;
  /** Callback when edit user button is clicked */
  onEditUser?: (user: User) => void;
}

/**
 * Role color mapping
 */
const getRoleColor = (role: UserRole): 'primary' | 'success' | 'warning' => {
  switch (role) {
    case 'admin':
      return 'primary';
    case 'professor':
      return 'success';
    case 'student':
      return 'warning';
    default:
      return 'warning';
  }
};

/**
 * Role label mapping
 */
const getRoleLabel = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'Administrador';
    case 'professor':
      return 'Profesor';
    case 'student':
      return 'Estudiante';
    default:
      return role;
  }
};

/**
 * User Management Table Component
 */
export function UserManagementTable({ onCreateUser, onEditUser }: UserManagementTableProps) {
  const queryClient = useQueryClient();
  const confirmDialog = useConfirmDialog();
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Fetch all users
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAllUsers,
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: (userId: number) => deleteUser(userId),
    onSuccess: () => {
      toast.success('Usuario eliminado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: Error) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      const errorMessage = apiError.response?.data?.message || 'Error al eliminar usuario';
      toast.error(errorMessage);
    },
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: (userId: number) => toggleUserStatus(userId),
    onSuccess: () => {
      toast.success('Estado del usuario actualizado');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: Error) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      const errorMessage = apiError.response?.data?.message || 'Error al actualizar estado';
      toast.error(errorMessage);
    },
  });

  /**
   * Handle delete user
   */
  const handleDelete = (user: User) => {
    confirmDialog.showDialog({
      title: 'Eliminar Usuario',
      message: `¿Está seguro que desea eliminar al usuario "${user.name} ${user.last_name}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      severity: 'error',
      onConfirm: async () => {
        deleteMutation.mutate(user.user_id);
      },
    });
  };

  /**
   * Handle toggle user status
   */
  const handleToggleStatus = (user: User) => {
    const action = user.is_active ? 'desactivar' : 'activar';
    confirmDialog.showDialog({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Usuario`,
      message: `¿Está seguro que desea ${action} al usuario "${user.name} ${user.last_name}"?`,
      confirmText: action.charAt(0).toUpperCase() + action.slice(1),
      severity: user.is_active ? 'warning' : 'info',
      onConfirm: async () => {
        toggleStatusMutation.mutate(user.user_id);
      },
    });
  };

  /**
   * Filter users by search term
   */
  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.last_name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower) ||
      (user.student_id && user.student_id.toLowerCase().includes(searchLower)) ||
      (user.employee_id && user.employee_id.toLowerCase().includes(searchLower))
    );
  });

  /**
   * DataGrid columns configuration
   */
  const columns: GridColDef[] = [
    {
      field: 'user_id',
      headerName: 'ID',
      width: 70,
    },
    {
      field: 'name',
      headerName: 'Nombre Completo',
      width: 200,
      valueGetter: (_value, row) => `${row.name} ${row.last_name}`,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 220,
    },
    {
      field: 'username',
      headerName: 'Usuario',
      width: 150,
    },
    {
      field: 'role',
      headerName: 'Rol',
      width: 140,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={getRoleLabel(params.value as UserRole)}
          color={getRoleColor(params.value as UserRole)}
          size="small"
        />
      ),
    },
    {
      field: 'student_id',
      headerName: 'ID Estudiante',
      width: 130,
      valueGetter: (value) => value || '-',
    },
    {
      field: 'employee_id',
      headerName: 'ID Empleado',
      width: 130,
      valueGetter: (value) => value || '-',
    },
    {
      field: 'is_active',
      headerName: 'Estado',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ? 'Activo' : 'Inactivo'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              color="primary"
              onClick={() => onEditUser?.(params.row as User)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={params.row.is_active ? 'Desactivar' : 'Activar'}>
            <IconButton
              size="small"
              color={params.row.is_active ? 'warning' : 'success'}
              onClick={() => handleToggleStatus(params.row as User)}
            >
              <PowerIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row as User)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold">
          Gestión de Usuarios
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreateUser}
        >
          Crear Usuario
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar por nombre, email, usuario o ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al cargar usuarios. Por favor, intente de nuevo.
        </Alert>
      )}

      {/* Responsive Content */}
      {isMobile ? (
        /* Mobile View: Cards */
        <Stack spacing={2}>
          {filteredUsers.length === 0 ? (
            <Alert severity="info">No se encontraron usuarios.</Alert>
          ) : (
            filteredUsers.map((user) => (
              <ResponsiveCard
                key={user.user_id}
                title={`${user.name} ${user.last_name}`}
                subtitle={user.email}
                info={`${user.username} • ${user.student_id || user.employee_id || `ID: ${user.user_id}`}`}
                chips={[
                  {
                    label: getRoleLabel(user.role),
                    color: getRoleColor(user.role),
                  },
                  {
                    label: user.is_active ? 'Activo' : 'Inactivo',
                    color: user.is_active ? 'success' : 'default',
                    variant: 'outlined',
                  },
                ]}
                actions={
                  <>
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEditUser?.(user)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={user.is_active ? 'Desactivar' : 'Activar'}>
                      <IconButton
                        size="small"
                        color={user.is_active ? 'warning' : 'success'}
                        onClick={() => handleToggleStatus(user)}
                      >
                        <PowerIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(user)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </>
                }
              />
            ))
          )}
        </Stack>
      ) : (
        /* Desktop View: DataGrid */
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredUsers}
            columns={columns}
            getRowId={(row) => row.user_id}
            loading={isLoading}
            pageSizeOptions={[10, 25, 50, 100]}
            initialState={{
              pagination: { paginationModel: { pageSize: 25 } },
            }}
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
            }}
          />
        </Box>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        loading={confirmDialog.loading}
        title={confirmDialog.config?.title || ''}
        message={confirmDialog.config?.message || ''}
        severity={confirmDialog.config?.severity}
        confirmText={confirmDialog.config?.confirmText}
        cancelText={confirmDialog.config?.cancelText}
        onConfirm={confirmDialog.handleConfirm}
        onCancel={confirmDialog.handleCancel}
      />
    </Paper>
  );
}
