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
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
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
} from '@/api/endpoints/venues';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { ConfirmDialog, ResponsiveCard } from '@/components/common';
import type { Venue, CreateVenueDto, UpdateVenueDto } from '@/api/types';

/**
 * Venue Form Data
 */
interface VenueFormData {
  name: string;
  type: 'classroom' | 'office' | 'virtual';
  url?: string;
  building?: string;
  floor?: string;
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
  type: yup
    .string()
    .required('El tipo es requerido')
    .oneOf(['classroom', 'office', 'virtual'], 'Tipo inválido')
    .typeError('Debe seleccionar un tipo'),
  url: yup
    .string()
    .when('type', {
      is: 'virtual',
      then: (schema) => schema.required('La URL es obligatoria para ubicaciones virtuales'),
      otherwise: (schema) => schema.notRequired(),
    }),
  building: yup
    .string()
    .when('type', {
      is: (val: string) => val === 'classroom' || val === 'office',
      then: (schema) => schema.required('El edificio es obligatorio para aulas y oficinas'),
      otherwise: (schema) => schema.notRequired(),
    }),
  floor: yup
    .string()
    .when('type', {
      is: (val: string) => val === 'classroom' || val === 'office',
      then: (schema) => schema.required('El piso es obligatorio para aulas y oficinas'),
      otherwise: (schema) => schema.notRequired(),
    }),
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
    watch,
  } = useForm<VenueFormData>({
    resolver: yupResolver(validationSchema) as never,
    defaultValues: {
      name: '',
      type: 'classroom',
      url: '',
      building: '',
      floor: '',
    },
  });

  // Watch type field to show/hide conditional fields
  const venueType = watch('type');

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

  /**
   * Handle create button
   */
  const handleCreate = () => {
    setSelectedVenue(null);
    reset({ 
      name: '', 
      type: 'classroom',
      url: '',
      building: '',
      floor: '',
    });
    setDialogOpen(true);
  };

  /**
   * Handle edit button
   */
  const handleEdit = (venue: Venue) => {
    setSelectedVenue(venue);
    reset({
      name: venue.name,
      type: venue.type,
      url: venue.url || '',
      building: venue.building || '',
      floor: venue.floor || '',
    });
    setDialogOpen(true);
  };

  /**
   * Handle close dialog
   */
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedVenue(null);
    reset({ 
      name: '', 
      type: 'classroom',
      url: '',
      building: '',
      floor: '',
    });
  };

  /**
   * Handle form submit
   */
  const onSubmit = (data: VenueFormData) => {
    // Prepare data according to venue type
    const venueData: CreateVenueDto = {
      name: data.name,
      type: data.type,
    };

    if (data.type === 'virtual') {
      venueData.url = data.url;
    } else {
      venueData.building = data.building;
      venueData.floor = data.floor;
    }

    if (selectedVenue) {
      updateMutation.mutate({
        id: selectedVenue.venue_id,
        updateData: venueData,
      });
    } else {
      createMutation.mutate(venueData);
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
   * Filter venues
   */
  const filteredVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      field: 'type',
      headerName: 'Tipo',
      width: 150,
      valueGetter: (value) => {
        switch (value) {
          case 'classroom': return 'Salón de Clases';
          case 'office': return 'Oficina';
          case 'virtual': return 'Virtual';
          default: return value;
        }
      },
    },
    {
      field: 'location_info',
      headerName: 'Ubicación / URL',
      flex: 1,
      minWidth: 250,
      valueGetter: (value, row) => {
        if (row.type === 'virtual') {
          return row.url || 'N/A';
        } else {
          const building = row.building || '';
          const floor = row.floor || '';
          return building && floor ? `${building} - ${floor}` : 'N/A';
        }
      },
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
              onClick={() => handleEdit(params.row as Venue)}
            >
              <EditIcon fontSize="small" />
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
          placeholder="Buscar por nombre..."
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
            filteredVenues.map((venue) => {
              const typeLabel = venue.type === 'classroom' ? 'Salón de Clases' 
                : venue.type === 'office' ? 'Oficina' 
                : 'Virtual';
              
              const locationInfo = venue.type === 'virtual'
                ? venue.url || 'Sin URL'
                : venue.building && venue.floor
                ? `${venue.building} - ${venue.floor}`
                : 'Sin ubicación';
              
              return (
                <ResponsiveCard
                  key={venue.venue_id}
                  title={venue.name}
                  subtitle={typeLabel}
                  info={locationInfo}
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
              );
            })
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
                  placeholder="Ej: Sala 101, Cubículo 12, Google Meet"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isSubmitting}
                  required
                />
              )}
            />

            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Tipo de Sede"
                  error={!!errors.type}
                  helperText={errors.type?.message || 'Seleccione el tipo de sede'}
                  disabled={isSubmitting}
                  required
                >
                  <MenuItem value="classroom">Salón de Clases</MenuItem>
                  <MenuItem value="office">Oficina</MenuItem>
                  <MenuItem value="virtual">Virtual</MenuItem>
                </TextField>
              )}
            />

            {/* Conditional fields based on venue type */}
            {venueType === 'virtual' ? (
              <Controller
                name="url"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="URL"
                    placeholder="https://meet.google.com/abc-defg-hij"
                    error={!!errors.url}
                    helperText={errors.url?.message || 'URL de la plataforma virtual'}
                    disabled={isSubmitting}
                    required
                  />
                )}
              />
            ) : (
              <>
                <Controller
                  name="building"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Edificio"
                      placeholder="Ej: Edificio A, Torre Norte"
                      error={!!errors.building}
                      helperText={errors.building?.message || 'Edificio donde se ubica'}
                      disabled={isSubmitting}
                      required
                    />
                  )}
                />
                <Controller
                  name="floor"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Piso"
                      placeholder="Ej: Planta Baja, Primer Piso, PB"
                      error={!!errors.floor}
                      helperText={errors.floor?.message || 'Piso o nivel'}
                      disabled={isSubmitting}
                      required
                    />
                  )}
                />
              </>
            )}
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
