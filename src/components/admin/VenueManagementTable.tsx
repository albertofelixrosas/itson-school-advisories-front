/**
 * Venue Management Table Component
 * School Advisories System
 * 
 * Admin component for managing venues
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
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
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import {
  getAllVenues,
  createVenue,
  updateVenue,
  deleteVenue,
  toggleVenueStatus,
} from '@/api/endpoints/venues';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { ConfirmDialog, ResponsiveCard } from '@/components/common';
import type { Venue, CreateVenueDto, UpdateVenueDto } from '@/api/types';

/**
 * Venue Form Data
 */
interface VenueFormData {
  name: string;
  location: string;
  capacity: number;
}

/**
 * Validation Schema
 */
const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required('El nombre es requerido')
    .min(3, 'Mínimo 3 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  location: yup
    .string()
    .required('La ubicación es requerida')
    .min(3, 'Mínimo 3 caracteres')
    .max(200, 'Máximo 200 caracteres'),
  capacity: yup
    .number()
    .required('La capacidad es requerida')
    .min(1, 'Mínimo 1 persona')
    .max(500, 'Máximo 500 personas')
    .typeError('Debe ser un número'),
});

/**
 * Venue Management Table Component
 */
export function VenueManagementTable() {
  const queryClient = useQueryClient();
  const confirmDialog = useConfirmDialog();
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<VenueFormData>({
    resolver: yupResolver(validationSchema) as never,
    defaultValues: {
      name: '',
      location: '',
      capacity: 20,
    },
  });

  // Fetch all venues
  const {
    data: venuesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-venues'],
    queryFn: getAllVenues,
  });

  // Ensure venues is always an array
  const venues = Array.isArray(venuesData) ? venuesData : [];

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateVenueDto) => createVenue(data),
    onSuccess: () => {
      toast.success('Sede creada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['admin-venues'] });
      queryClient.invalidateQueries({ queryKey: ['active-venues'] });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || 'Error al crear sede');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: { id: number; updateData: UpdateVenueDto }) =>
      updateVenue(data.id, data.updateData),
    onSuccess: () => {
      toast.success('Sede actualizada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['admin-venues'] });
      queryClient.invalidateQueries({ queryKey: ['active-venues'] });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || 'Error al actualizar sede');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteVenue(id),
    onSuccess: () => {
      toast.success('Sede eliminada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['admin-venues'] });
      queryClient.invalidateQueries({ queryKey: ['active-venues'] });
    },
    onError: (error: Error) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || 'Error al eliminar sede');
    },
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: (id: number) => toggleVenueStatus(id),
    onSuccess: () => {
      toast.success('Estado actualizado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['admin-venues'] });
      queryClient.invalidateQueries({ queryKey: ['active-venues'] });
    },
    onError: (error: Error) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || 'Error al actualizar estado');
    },
  });

  /**
   * Handle create button
   */
  const handleCreate = () => {
    setSelectedVenue(null);
    reset({ name: '', location: '', capacity: 20 });
    setDialogOpen(true);
  };

  /**
   * Handle edit button
   */
  const handleEdit = (venue: Venue) => {
    setSelectedVenue(venue);
    reset({
      name: venue.name,
      location: venue.location,
      capacity: venue.capacity,
    });
    setDialogOpen(true);
  };

  /**
   * Handle close dialog
   */
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedVenue(null);
    reset({ name: '', location: '', capacity: 20 });
  };

  /**
   * Handle form submit
   */
  const onSubmit = (data: VenueFormData) => {
    if (selectedVenue) {
      updateMutation.mutate({
        id: selectedVenue.venue_id,
        updateData: data,
      });
    } else {
      createMutation.mutate(data);
    }
  };

  /**
   * Handle delete
   */
  const handleDelete = (venue: Venue) => {
    confirmDialog.showDialog({
      title: 'Eliminar Sede',
      message: `¿Está seguro que desea eliminar la sede "${venue.name}"?`,
      confirmText: 'Eliminar',
      severity: 'error',
      onConfirm: async () => {
        deleteMutation.mutate(venue.venue_id);
      },
    });
  };

  /**
   * Handle toggle status
   */
  const handleToggleStatus = (venue: Venue) => {
    const action = venue.is_active ? 'desactivar' : 'activar';
    confirmDialog.showDialog({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Sede`,
      message: `¿Está seguro que desea ${action} la sede "${venue.name}"?`,
      confirmText: action.charAt(0).toUpperCase() + action.slice(1),
      severity: venue.is_active ? 'warning' : 'info',
      onConfirm: async () => {
        toggleStatusMutation.mutate(venue.venue_id);
      },
    });
  };

  /**
   * Filter venues
   */
  const filteredVenues = venues.filter(
    (venue) =>
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Columns
   */
  const columns: GridColDef[] = [
    {
      field: 'venue_id',
      headerName: 'ID',
      width: 80,
    },
    {
      field: 'name',
      headerName: 'Nombre',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'location',
      headerName: 'Ubicación',
      flex: 1,
      minWidth: 250,
    },
    {
      field: 'capacity',
      headerName: 'Capacidad',
      width: 120,
      valueFormatter: (value) => `${value} personas`,
    },
    {
      field: 'is_active',
      headerName: 'Estado',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ? 'Activa' : 'Inactiva'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 180,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleEdit(params.row as Venue)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={params.row.is_active ? 'Desactivar' : 'Activar'}>
            <IconButton
              size="small"
              color={params.row.is_active ? 'warning' : 'success'}
              onClick={() => handleToggleStatus(params.row as Venue)}
            >
              <PowerIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row as Venue)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Paper elevation={2} sx={{ p: 3, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold">
          Gestión de Sedes
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Crear Sede
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar por nombre o ubicación..."
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
          Error al cargar sedes. Por favor, intente de nuevo.
        </Alert>
      )}

      {/* Data Grid / Mobile Cards */}
      {isMobile ? (
        <Stack spacing={2}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredVenues.length === 0 ? (
            <Alert severity="info">No se encontraron sedes</Alert>
          ) : (
            filteredVenues.map((venue) => (
              <ResponsiveCard
                key={venue.venue_id}
                title={venue.name}
                subtitle={venue.location}
                info={`Capacidad: ${venue.capacity} personas`}
                chips={[
                  {
                    label: venue.is_active ? 'Activa' : 'Inactiva',
                    color: venue.is_active ? 'success' : 'default',
                  },
                ]}
                actions={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(venue)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={venue.is_active ? 'Desactivar' : 'Activar'}>
                      <IconButton
                        size="small"
                        color={venue.is_active ? 'warning' : 'success'}
                        onClick={() => handleToggleStatus(venue)}
                      >
                        <PowerIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(venue)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              />
            ))
          )}
        </Stack>
      ) : (
        <Box sx={{ height: 600, width: '100%', overflow: 'auto' }}>
          <DataGrid
            rows={filteredVenues}
            columns={columns}
            getRowId={(row) => row.venue_id}
            loading={isLoading}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 25 } },
            }}
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-root': {
                width: '100%',
                maxWidth: '100%',
              },
            }}
          />
        </Box>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedVenue ? 'Editar Sede' : 'Crear Nueva Sede'}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'grid', gap: 2, pt: 1 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Nombre"
                  placeholder="Ej: Sala 101"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isSubmitting}
                  required
                />
              )}
            />

            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Ubicación"
                  placeholder="Ej: Edificio A, Piso 2"
                  error={!!errors.location}
                  helperText={errors.location?.message}
                  disabled={isSubmitting}
                  required
                />
              )}
            />

            <Controller
              name="capacity"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="number"
                  label="Capacidad"
                  placeholder="20"
                  error={!!errors.capacity}
                  helperText={errors.capacity?.message || 'Número máximo de personas'}
                  disabled={isSubmitting}
                  required
                  inputProps={{ min: 1, max: 500 }}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
            startIcon={
              isSubmitting || createMutation.isPending || updateMutation.isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : undefined
            }
          >
            {isSubmitting || createMutation.isPending || updateMutation.isPending
              ? 'Guardando...'
              : selectedVenue
              ? 'Actualizar'
              : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

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
