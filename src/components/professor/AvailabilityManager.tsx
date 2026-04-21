/**
 * Availability Manager Component
 * School Advisories System
 * 
 * Component for professors to manage their availability schedules
 */

import { useState } from 'react';
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
  deactivateAvailability,
  deleteAvailability,
} from '@/api/endpoints/professors';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { ConfirmDialog } from '@/components/common';
import { AvailabilityFormModal } from './AvailabilityFormModal';
import type { ProfessorAvailability, WeekDay } from '@/api/types';
import { formatAvailabilityTimeRange } from '@/utils/availabilityTime';

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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState<ProfessorAvailability | null>(null);

  // Fetch availabilities
  const {
    data: availabilities = [],
    isLoading: loadingAvailabilities,
    error: availabilitiesError,
  } = useQuery({
    queryKey: ['my-availability'],
    queryFn: getMyAvailability,
  });

  // Deactivate availability mutation
  const deactivateMutation = useMutation({
    mutationFn: (id: number) => deactivateAvailability(id),
    onSuccess: () => {
      toast.success('Disponibilidad desactivada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['my-availability'] });
    },
    onError: (error: Error) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      const errorMessage = apiError.response?.data?.message || 'Error al desactivar la disponibilidad';
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
    const timeRange = formatAvailabilityTimeRange(availability.start_time, availability.end_time);
    confirmDialog.showDialog({
      title: 'Eliminar Disponibilidad',
      message: `¿Está seguro de eliminar la disponibilidad del ${getDayLabel(availability.day_of_week)} de ${timeRange}?`,
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
  const handleDeactivateAvailability = (availability: ProfessorAvailability) => {
    confirmDialog.showDialog({
      title: 'Desactivar Disponibilidad',
      message: '¿Está seguro de desactivar esta disponibilidad?',
      confirmText: 'Desactivar',
      severity: 'warning',
      onConfirm: async () => {
        deactivateMutation.mutate(availability.availability_id);
      },
    });
  };

  /**
   * Get day label in Spanish
   */
  const getDayLabel = (day: WeekDay): string => {
    return WEEK_DAYS.find(d => d.value === day)?.label || day;
  };

  const handleCreateAvailability = () => {
    setSelectedAvailability(null);
    setIsFormOpen(true);
  };

  const handleEditAvailability = (availability: ProfessorAvailability) => {
    setSelectedAvailability(availability);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedAvailability(null);
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
          onClick={handleCreateAvailability}
        >
          Nueva Disponibilidad
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 2 }}>
        El backend devuelve horas como `HH:mm` o `HH:mm:ss`; esta vista ya las normaliza a `HH:mm` y usa el contrato real para crear, editar, desactivar y eliminar.
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
                    {availability.subject_detail?.subject_name || 'General'}
                  </TableCell>
                  <TableCell>{getDayLabel(availability.day_of_week)}</TableCell>
                  <TableCell>
                    {formatAvailabilityTimeRange(availability.start_time, availability.end_time)}
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
                      onClick={availability.is_active ? () => handleDeactivateAvailability(availability) : undefined}
                      sx={{ cursor: availability.is_active ? 'pointer' : 'default' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEditAvailability(availability)}
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
            Usa el botón "Nueva Disponibilidad" para crear tu primer slot.
          </Typography>
        </Paper>
      )}

      <AvailabilityFormModal
        open={isFormOpen}
        availability={selectedAvailability}
        onClose={handleCloseForm}
      />

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
