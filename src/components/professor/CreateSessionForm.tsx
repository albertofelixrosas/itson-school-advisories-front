/**
 * Create Session Form Component
 * School Advisories System
 * 
 * Form for professors to create direct advisory sessions
 */

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Alert,
  Paper,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Send as SendIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getAllSubjectDetails } from '@/api/endpoints/subjects';
import { getActiveVenues } from '@/api/endpoints/venues';
import { createDirectSession } from '@/api/endpoints/advisories';
import type { CreateDirectSessionDto } from '@/api/types';

/**
 * Form Data Interface
 */
interface CreateSessionFormData {
  subjectDetailId: number;
  venueId: number;
  sessionDate: Date | null;
  startTime: Date | null;
  endTime: Date | null;
  topic: string;
  notes?: string;
  sessionLink?: string;
  maxStudents: number;
}

/**
 * Validation Schema
 */
const validationSchema = yup.object().shape({
  subjectDetailId: yup
    .number()
    .required('Debe seleccionar una materia')
    .min(1, 'Debe seleccionar una materia')
    .typeError('Debe seleccionar una materia'),
  venueId: yup
    .number()
    .required('Debe seleccionar una sede')
    .min(1, 'Debe seleccionar una sede')
    .typeError('Debe seleccionar una sede'),
  sessionDate: yup
    .date()
    .required('Debe seleccionar una fecha')
    .min(new Date(), 'La fecha debe ser futura')
    .nullable()
    .typeError('Fecha inválida'),
  startTime: yup
    .date()
    .required('Debe seleccionar hora de inicio')
    .nullable()
    .typeError('Hora inválida'),
  endTime: yup
    .date()
    .required('Debe seleccionar hora de fin')
    .nullable()
    .test('is-after-start', 'La hora de fin debe ser posterior al inicio', function(value) {
      const { startTime } = this.parent;
      if (!startTime || !value) return true;
      return value > startTime;
    })
    .typeError('Hora inválida'),
  topic: yup
    .string()
    .required('Debe ingresar un tema')
    .min(5, 'El tema debe tener al menos 5 caracteres')
    .max(200, 'El tema no puede exceder 200 caracteres'),
  notes: yup
    .string()
    .max(500, 'Las notas no pueden exceder 500 caracteres')
    .optional(),
  sessionLink: yup
    .string()
    .url('Debe ser una URL válida')
    .max(500, 'El enlace no puede exceder 500 caracteres')
    .optional(),
  maxStudents: yup
    .number()
    .min(1, 'Debe permitir al menos 1 estudiante')
    .max(100, 'No puede exceder 100 estudiantes')
    .required('Debe especificar el número máximo de estudiantes')
    .typeError('Debe ser un número'),
});

/**
 * Component Props
 */
interface CreateSessionFormProps {
  /** Callback when session is created successfully */
  onSuccess?: () => void;
  /** Callback when form is cancelled */
  onCancel?: () => void;
}

/**
 * Create Session Form Component
 */
export function CreateSessionForm({ onSuccess, onCancel }: CreateSessionFormProps) {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateSessionFormData>({
    resolver: yupResolver(validationSchema as yup.ObjectSchema<CreateSessionFormData>),
    defaultValues: {
      subjectDetailId: 0,
      venueId: 0,
      sessionDate: null,
      startTime: null,
      endTime: null,
      topic: '',
      notes: '',
      sessionLink: '',
      maxStudents: 10,
    },
  });

  // Fetch subject details (only for current professor)
  const {
    data: subjectDetails = [],
    isLoading: loadingSubjectDetails,
    error: subjectDetailsError,
  } = useQuery({
    queryKey: ['subject-details'],
    queryFn: getAllSubjectDetails,
  });

  // Fetch active venues
  const {
    data: venues = [],
    isLoading: loadingVenues,
    error: venuesError,
  } = useQuery({
    queryKey: ['active-venues'],
    queryFn: getActiveVenues,
  });

  // Create session mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateDirectSessionDto) => createDirectSession(data),
    onSuccess: () => {
      toast.success('Sesión de asesoría creada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['my-advisories'] });
      queryClient.invalidateQueries({ queryKey: ['professor-dashboard'] });
      reset();
      onSuccess?.();
    },
    onError: (error: Error) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      const errorMessage = apiError.response?.data?.message || 'Error al crear la sesión';
      toast.error(errorMessage);
    },
  });

  /**
   * Form submit handler
   */
  const onSubmit = (data: CreateSessionFormData) => {
    if (!data.sessionDate || !data.startTime || !data.endTime) {
      toast.error('Debe completar todos los campos de fecha y hora');
      return;
    }

    // Combine date and time
    const sessionDateTime = new Date(data.sessionDate);
    sessionDateTime.setHours(data.startTime.getHours(), data.startTime.getMinutes(), 0, 0);

    const requestData: CreateDirectSessionDto = {
      subject_detail_id: data.subjectDetailId,
      venue_id: data.venueId,
      session_date: sessionDateTime.toISOString(),
      topic: data.topic,
      notes: data.notes || undefined,
      session_link: data.sessionLink || undefined,
      max_students: data.maxStudents,
    };

    createMutation.mutate(requestData);
  };

  return (
    <Paper elevation={2} sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
        Crear Sesión de Asesoría Directa
      </Typography>

      {(subjectDetailsError || venuesError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al cargar los datos. Por favor, intente de nuevo.
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box sx={{ display: 'grid', gap: 3 }}>
          {/* Subject Detail Select */}
          <Box>
            <Controller
              name="subjectDetailId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.subjectDetailId}>
                  <InputLabel id="subject-detail-label">Materia</InputLabel>
                  <Select
                    {...field}
                    labelId="subject-detail-label"
                    label="Materia"
                    disabled={loadingSubjectDetails || isSubmitting}
                  >
                    <MenuItem value={0}>
                      <em>Seleccione una materia</em>
                    </MenuItem>
                    {subjectDetails.map((detail) => (
                      <MenuItem key={detail.subject_detail_id} value={detail.subject_detail_id}>
                        {detail.subject.subject}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.subjectDetailId && (
                    <FormHelperText>{errors.subjectDetailId.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Box>

          {/* Venue Select */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            <Box>
            <Controller
              name="venueId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.venueId}>
                  <InputLabel id="venue-label">Sede / Salón</InputLabel>
                  <Select
                    {...field}
                    labelId="venue-label"
                    label="Sede / Salón"
                    disabled={loadingVenues || isSubmitting}
                  >
                    <MenuItem value={0}>
                      <em>Seleccione una sede</em>
                    </MenuItem>
                    {venues.map((venue) => (
                      <MenuItem key={venue.venue_id} value={venue.venue_id}>
                        <Box>
                          <Typography variant="body1">{venue.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {venue.location} - Capacidad: {venue.capacity}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.venueId && (
                    <FormHelperText>{errors.venueId.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
            </Box>

            {/* Max Students */}
            <Box>
            <Controller
              name="maxStudents"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Número Máximo de Estudiantes"
                  type="number"
                  error={!!errors.maxStudents}
                  helperText={errors.maxStudents?.message}
                  disabled={isSubmitting}
                  inputProps={{ min: 1, max: 100 }}
                />
              )}
            />
            </Box>
          </Box>

          {/* Session Date */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            <Box>
            <Controller
              name="sessionDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Fecha de Sesión"
                  disabled={isSubmitting}
                  minDate={new Date()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.sessionDate,
                      helperText: errors.sessionDate?.message,
                    },
                  }}
                />
              )}
            />
            </Box>

            {/* Start Time */}
            <Box>
            <Controller
              name="startTime"
              control={control}
              render={({ field }) => (
                <TimePicker
                  {...field}
                  label="Hora de Inicio"
                  disabled={isSubmitting}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.startTime,
                      helperText: errors.startTime?.message,
                    },
                  }}
                />
              )}
            />
            </Box>

            {/* End Time */}
            <Box>
            <Controller
              name="endTime"
              control={control}
              render={({ field }) => (
                <TimePicker
                  {...field}
                  label="Hora de Fin"
                  disabled={isSubmitting}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.endTime,
                      helperText: errors.endTime?.message,
                    },
                  }}
                />
              )}
            />
            </Box>
          </Box>

          {/* Topic */}
          <Box>
            <Controller
              name="topic"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Tema de la Sesión"
                  placeholder="Ej: Repaso de ecuaciones diferenciales"
                  error={!!errors.topic}
                  helperText={errors.topic?.message || `${field.value.length}/200 caracteres`}
                  disabled={isSubmitting}
                />
              )}
            />
          </Box>

          {/* Session Link */}
          <Box>
            <Controller
              name="sessionLink"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Enlace de Sesión Virtual (Opcional)"
                  placeholder="https://meet.google.com/..."
                  error={!!errors.sessionLink}
                  helperText={errors.sessionLink?.message || 'Enlace para sesión en línea (Zoom, Meet, etc.)'}
                  disabled={isSubmitting}
                />
              )}
            />
          </Box>

          {/* Notes */}
          <Box>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Notas Adicionales (Opcional)"
                  placeholder="Información adicional para los estudiantes..."
                  multiline
                  rows={3}
                  error={!!errors.notes}
                  helperText={errors.notes?.message || `${(field.value || '').length}/500 caracteres`}
                  disabled={isSubmitting}
                />
              )}
            />
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {onCancel && (
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={isSubmitting || createMutation.isPending}
              size="large"
            >
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={
              isSubmitting || createMutation.isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SendIcon />
              )
            }
            disabled={isSubmitting || createMutation.isPending}
          >
            {isSubmitting || createMutation.isPending
              ? 'Creando...'
              : 'Crear Sesión'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
