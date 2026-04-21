/**
 * Availability Form Modal Component
 * School Advisories System
 *
 * Modal for professors to create and edit availability slots.
 */

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { createAvailability, updateAvailability } from '@/api/endpoints/professors';
import {
  getSubjectDetailsByProfessor,
  type SubjectDetail,
} from '@/api/endpoints/subjectDetails';
import { useAuth } from '@/hooks/useAuth';
import type {
  CreateAvailabilitySlotDto,
  ProfessorAvailability,
  UpdateAvailabilitySlotDto,
  WeekDay,
} from '@/api/types';
import {
  normalizeAvailabilityTime,
  toDateInputValue,
} from '@/utils/availabilityTime';

const WEEK_DAYS: Array<{ value: WeekDay; label: string }> = [
  { value: 'MONDAY', label: 'Lunes' },
  { value: 'TUESDAY', label: 'Martes' },
  { value: 'WEDNESDAY', label: 'Miércoles' },
  { value: 'THURSDAY', label: 'Jueves' },
  { value: 'FRIDAY', label: 'Viernes' },
  { value: 'SATURDAY', label: 'Sábado' },
  { value: 'SUNDAY', label: 'Domingo' },
];

interface AvailabilityFormValues {
  subjectDetailId: number | null;
  dayOfWeek: WeekDay;
  startTime: string;
  endTime: string;
  maxStudentsPerSlot: number;
  slotDurationMinutes: number;
  isRecurring: boolean;
  effectiveFrom: string;
  effectiveUntil: string;
  notes: string;
}

const validationSchema: yup.ObjectSchema<AvailabilityFormValues> = yup.object({
  subjectDetailId: yup.number().nullable().defined(),
  dayOfWeek: yup
    .mixed<WeekDay>()
    .oneOf(WEEK_DAYS.map((day) => day.value))
    .required('Debe seleccionar un día'),
  startTime: yup
    .string()
    .required('Debe seleccionar una hora de inicio')
    .matches(/^\d{2}:\d{2}$/, 'La hora debe tener formato HH:mm'),
  endTime: yup
    .string()
    .required('Debe seleccionar una hora de fin')
    .matches(/^\d{2}:\d{2}$/, 'La hora debe tener formato HH:mm')
    .test('is-after-start', 'La hora de fin debe ser posterior a la hora de inicio', function (value) {
      const { startTime } = this.parent;
      if (!startTime || !value) {
        return true;
      }

      return value > startTime;
    }),
  maxStudentsPerSlot: yup
    .number()
    .required('Debe indicar la capacidad')
    .min(1, 'La capacidad mínima es 1')
    .max(50, 'La capacidad máxima es 50')
    .typeError('Debe ser un número válido'),
  slotDurationMinutes: yup
    .number()
    .required('Debe indicar la duración del slot')
    .min(15, 'La duración mínima es 15 minutos')
    .max(180, 'La duración máxima es 180 minutos')
    .typeError('Debe ser un número válido'),
  isRecurring: yup.boolean().required(),
  effectiveFrom: yup.string().optional().default(''),
  effectiveUntil: yup
    .string()
    .optional()
    .default('')
    .test('is-after-effective-from', 'La fecha final no puede ser anterior a la fecha inicial', function (value) {
      const { effectiveFrom } = this.parent;
      if (!value || !effectiveFrom) {
        return true;
      }

      return value >= effectiveFrom;
    }),
  notes: yup.string().max(500, 'Las notas no pueden exceder 500 caracteres').default(''),
});

interface AvailabilityFormModalProps {
  open: boolean;
  onClose: () => void;
  availability?: ProfessorAvailability | null;
}

function toDefaultValues(availability?: ProfessorAvailability | null): AvailabilityFormValues {
  return {
    subjectDetailId: availability?.subject_detail_id ?? null,
    dayOfWeek: availability?.day_of_week ?? 'MONDAY',
    startTime: normalizeAvailabilityTime(availability?.start_time),
    endTime: normalizeAvailabilityTime(availability?.end_time),
    maxStudentsPerSlot: availability?.max_students_per_slot ?? 5,
    slotDurationMinutes: availability?.slot_duration_minutes ?? 30,
    isRecurring: availability?.is_recurring ?? true,
    effectiveFrom: toDateInputValue(availability?.effective_from),
    effectiveUntil: toDateInputValue(availability?.effective_until),
    notes: availability?.notes ?? '',
  };
}

function getErrorMessage(error: Error): string {
  const apiError = error as { response?: { data?: { message?: string | string[] } } };
  const message = apiError.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(', ');
  }

  return message || 'Error al guardar la disponibilidad';
}

export function AvailabilityFormModal({ open, onClose, availability }: AvailabilityFormModalProps) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isEditing = Boolean(availability);
  const isEditingSpecificAvailability = Boolean(availability?.subject_detail_id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AvailabilityFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: toDefaultValues(availability),
  });

  useEffect(() => {
    reset(toDefaultValues(availability));
  }, [availability, reset, open]);

  const {
    data: subjectDetails = [],
    isLoading: loadingSubjectDetails,
    error: subjectDetailsError,
  } = useQuery({
    queryKey: ['subject-details', 'professor', user?.user_id],
    queryFn: () => {
      if (!user?.user_id) {
        throw new Error('No se pudo identificar al profesor autenticado');
      }

      return getSubjectDetailsByProfessor(user.user_id);
    },
    enabled: open && Boolean(user?.user_id),
  });

  const saveMutation = useMutation({
    mutationFn: async (values: AvailabilityFormValues) => {
      if (!user?.user_id) {
        throw new Error('No se pudo identificar al profesor autenticado');
      }

      const optionalSubjectDetailId = values.subjectDetailId ?? undefined;

      if (isEditing && availability) {
        const payload: UpdateAvailabilitySlotDto = {
          professor_id: user.user_id,
          subject_detail_id: optionalSubjectDetailId,
          day_of_week: values.dayOfWeek,
          start_time: values.startTime,
          end_time: values.endTime,
          max_students_per_slot: values.maxStudentsPerSlot,
          slot_duration_minutes: values.slotDurationMinutes,
          is_recurring: values.isRecurring,
          effective_from: values.effectiveFrom || undefined,
          effective_until: values.effectiveUntil || undefined,
          notes: values.notes.trim() || undefined,
        };

        if (values.subjectDetailId === null && isEditingSpecificAvailability) {
          delete payload.subject_detail_id;
        }

        return updateAvailability(availability.availability_id, payload);
      }

      const payload: CreateAvailabilitySlotDto = {
        professor_id: user.user_id,
        subject_detail_id: optionalSubjectDetailId,
        day_of_week: values.dayOfWeek,
        start_time: values.startTime,
        end_time: values.endTime,
        max_students_per_slot: values.maxStudentsPerSlot,
        slot_duration_minutes: values.slotDurationMinutes,
        is_recurring: values.isRecurring,
        effective_from: values.effectiveFrom || undefined,
        effective_until: values.effectiveUntil || undefined,
        notes: values.notes.trim() || undefined,
      };

      return createAvailability(payload);
    },
    onSuccess: () => {
      toast.success(isEditing ? 'Disponibilidad actualizada exitosamente' : 'Disponibilidad creada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['my-availability'] });
      handleClose();
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const handleClose = () => {
    reset(toDefaultValues(availability));
    onClose();
  };

  const onSubmit = (values: AvailabilityFormValues) => {
    saveMutation.mutate(values);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isEditing ? <EditIcon color="primary" /> : <AddIcon color="primary" />}
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {isEditing ? 'Editar Disponibilidad' : 'Nueva Disponibilidad'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configura disponibilidad general o asociada a una materia del profesor.
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {!user?.user_id && (
          <Alert severity="error" sx={{ mb: 3 }}>
            No se pudo resolver el usuario autenticado. Vuelve a iniciar sesión para gestionar disponibilidad.
          </Alert>
        )}

        {subjectDetailsError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Error al cargar las materias asignadas al profesor.
          </Alert>
        )}

        {isEditingSpecificAvailability && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Esta disponibilidad ya está asociada a una materia específica. Para convertirla a disponibilidad general,
            crea un nuevo slot general y elimina el actual.
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'grid', gap: 3 }}>
            <Controller
              name="subjectDetailId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.subjectDetailId} disabled={loadingSubjectDetails || saveMutation.isPending}>
                  <InputLabel id="availability-subject-label">Materia</InputLabel>
                  <Select
                    {...field}
                    labelId="availability-subject-label"
                    label="Materia"
                    value={field.value === null ? '' : String(field.value)}
                    onChange={(event) => {
                      const selectedValue = String(event.target.value);
                      field.onChange(selectedValue === '' ? null : Number(selectedValue));
                    }}
                  >
                    <MenuItem value="" disabled={isEditingSpecificAvailability}>
                      General
                    </MenuItem>
                    {subjectDetails.map((subjectDetail: SubjectDetail) => (
                      <MenuItem key={subjectDetail.subject_detail_id} value={String(subjectDetail.subject_detail_id)}>
                        {subjectDetail.subject.subject}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {errors.subjectDetailId?.message || 'Déjalo en General para una disponibilidad aplicable a cualquier materia.'}
                  </FormHelperText>
                </FormControl>
              )}
            />

            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' } }}>
              <Controller
                name="dayOfWeek"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.dayOfWeek} disabled={saveMutation.isPending}>
                    <InputLabel id="availability-day-label">Día</InputLabel>
                    <Select {...field} labelId="availability-day-label" label="Día">
                      {WEEK_DAYS.map((day) => (
                        <MenuItem key={day.value} value={day.value}>
                          {day.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors.dayOfWeek?.message}</FormHelperText>
                  </FormControl>
                )}
              />

              <Controller
                name="startTime"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Hora de inicio"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 60 }}
                    error={!!errors.startTime}
                    helperText={errors.startTime?.message}
                    disabled={saveMutation.isPending}
                  />
                )}
              />

              <Controller
                name="endTime"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Hora de fin"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 60 }}
                    error={!!errors.endTime}
                    helperText={errors.endTime?.message}
                    disabled={saveMutation.isPending}
                  />
                )}
              />
            </Box>

            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
              <Controller
                name="maxStudentsPerSlot"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Máx. estudiantes"
                    type="number"
                    error={!!errors.maxStudentsPerSlot}
                    helperText={errors.maxStudentsPerSlot?.message}
                    disabled={saveMutation.isPending}
                    onChange={(event) => field.onChange(Number(event.target.value))}
                  />
                )}
              />

              <Controller
                name="slotDurationMinutes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Duración del slot (min)"
                    type="number"
                    error={!!errors.slotDurationMinutes}
                    helperText={errors.slotDurationMinutes?.message}
                    disabled={saveMutation.isPending}
                    onChange={(event) => field.onChange(Number(event.target.value))}
                  />
                )}
              />
            </Box>

            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
              <Controller
                name="effectiveFrom"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Vigencia desde"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.effectiveFrom}
                    helperText={errors.effectiveFrom?.message || 'Opcional'}
                    disabled={saveMutation.isPending}
                  />
                )}
              />

              <Controller
                name="effectiveUntil"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Vigencia hasta"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.effectiveUntil}
                    helperText={errors.effectiveUntil?.message || 'Opcional'}
                    disabled={saveMutation.isPending}
                  />
                )}
              />
            </Box>

            <Controller
              name="isRecurring"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                      disabled={saveMutation.isPending}
                    />
                  }
                  label="Disponibilidad recurrente"
                />
              )}
            />

            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Notas"
                  multiline
                  rows={3}
                  error={!!errors.notes}
                  helperText={errors.notes?.message || `${field.value.length}/500 caracteres`}
                  disabled={saveMutation.isPending}
                />
              )}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={saveMutation.isPending}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={saveMutation.isPending || !user?.user_id}
          startIcon={
            saveMutation.isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : isEditing ? (
              <EditIcon />
            ) : (
              <AddIcon />
            )
          }
        >
          {saveMutation.isPending
            ? (isEditing ? 'Guardando...' : 'Creando...')
            : (isEditing ? 'Guardar cambios' : 'Crear disponibilidad')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AvailabilityFormModal;