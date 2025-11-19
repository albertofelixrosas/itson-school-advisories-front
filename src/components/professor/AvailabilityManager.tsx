/**
 * Availability Manager Component
 * School Advisories System
 * 
 * Component for professors to manage their availability schedules
 */

import {
  Box,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getMyAvailability,
  deleteAvailability,
  updateAvailability,
} from '@/api/endpoints/professors';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { ConfirmDialog } from '@/components/common';
import type { ProfessorAvailability, WeekDay } from '@/api/types';

/**
 * Week Days
 */
const WEEK_DAYS: { value: WeekDay; label: string }[] = [
  { value: 'MONDAY', label: 'Lunes' },
  { value: 'TUESDAY', label: 'Martes' },
  { value: 'WEDNESDAY', label: 'Miércoles' },
  { value: 'THURSDAY', label: 'Jueves' },
  { value: 'FRIDAY', label: 'Viernes' },
  { value: 'SATURDAY', label: 'Sábado' },
  { value: 'SUNDAY', label: 'Domingo' },
];

/**
 * Availability Manager Component
 */
export function AvailabilityManager() {
  const queryClient = useQueryClient();
  const confirmDialog = useConfirmDialog();

  // Fetch availabilities
  const {
    data: availabilities = [],
    isLoading: loadingAvailabilities,
    error: availabilitiesError,
  } = useQuery({
    queryKey: ['my-availability'],
    queryFn: getMyAvailability,
  });

  // Update availability mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { is_active?: boolean } }) =>
      updateAvailability(id, data),
    onSuccess: () => {
      toast.success('Disponibilidad actualizada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['my-availability'] });
    },
    onError: (error: Error) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      const errorMessage = apiError.response?.data?.message || 'Error al actualizar la disponibilidad';
      toast.error(errorMessage);
    },
  });

  // Delete availability mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAvailability(id),
    onSuccess: () => {
      toast.success('Disponibilidad eliminada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['my-availability'] });
    },
    onError: (error: Error) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      const errorMessage = apiError.response?.data?.message || 'Error al eliminar la disponibilidad';
      toast.error(errorMessage);
    },
  });

  /**
   * Handle delete with confirmation
   */
  const handleDeleteAvailability = (availability: ProfessorAvailability) => {
    confirmDialog.showDialog({
      title: 'Eliminar Disponibilidad',
      message: `¿Está seguro de eliminar la disponibilidad del ${getDayLabel(availability.day_of_week)} de ${availability.start_time} a ${availability.end_time}?`,
      confirmText: 'Eliminar',
      severity: 'error',
      onConfirm: async () => {
        deleteMutation.mutate(availability.availability_id);
      },
    });
  };

  /**
   * Toggle availability active status
   */
  const handleToggleActive = (availability: ProfessorAvailability) => {
    const action = availability.is_active ? 'desactivar' : 'activar';
    confirmDialog.showDialog({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Disponibilidad`,
      message: `¿Está seguro de ${action} esta disponibilidad?`,
      confirmText: action.charAt(0).toUpperCase() + action.slice(1),
      severity: availability.is_active ? 'warning' : 'info',
      onConfirm: async () => {
        updateMutation.mutate({
          id: availability.availability_id,
          data: { is_active: !availability.is_active },
        });
      },
    });
  };

  /**
   * Get day label in Spanish
   */
  const getDayLabel = (day: WeekDay): string => {
    return WEEK_DAYS.find(d => d.value === day)?.label || day;
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Gestión de Disponibilidad
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          disabled
        >
          Nueva Disponibilidad
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 2 }}>
        Funcionalidad de crear/editar disponibilidad próximamente. Por ahora puedes activar/desactivar y eliminar.
      </Alert>

      {/* Error Alert */}
      {availabilitiesError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al cargar las disponibilidades. Por favor, intente de nuevo.
        </Alert>
      )}

      {/* Loading */}
      {loadingAvailabilities && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Availabilities Table */}
      {!loadingAvailabilities && availabilities.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Materia</strong></TableCell>
                <TableCell><strong>Día</strong></TableCell>
                <TableCell><strong>Horario</strong></TableCell>
                <TableCell align="center"><strong>Max. Estudiantes</strong></TableCell>
                <TableCell align="center"><strong>Recurrente</strong></TableCell>
                <TableCell align="center"><strong>Estado</strong></TableCell>
                <TableCell align="right"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {availabilities.map((availability) => (
                <TableRow key={availability.availability_id}>
                  <TableCell>
                    {availability.subject_detail?.subject?.subject || 'N/A'}
                  </TableCell>
                  <TableCell>{getDayLabel(availability.day_of_week)}</TableCell>
                  <TableCell>
                    {availability.start_time} - {availability.end_time}
                  </TableCell>
                  <TableCell align="center">
                    {availability.max_students_per_slot}
                  </TableCell>
                  <TableCell align="center">
                    {availability.is_recurring ? (
                      <Chip label="Sí" size="small" color="primary" />
                    ) : (
                      <Chip label="No" size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={availability.is_active ? 'Activo' : 'Inactivo'}
                      size="small"
                      color={availability.is_active ? 'success' : 'default'}
                      onClick={() => handleToggleActive(availability)}
                      sx={{ cursor: 'pointer' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="primary"
                      disabled
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteAvailability(availability)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Empty State */}
      {!loadingAvailabilities && availabilities.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            No tienes disponibilidades configuradas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Por ahora, las disponibilidades deben ser creadas desde el backend.
          </Typography>
        </Paper>
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
    </Box>
  );
}
