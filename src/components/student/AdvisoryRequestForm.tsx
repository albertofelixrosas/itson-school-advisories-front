/**
 * Advisory Request Form Component
 * School Advisories System
 * 
 * Form for students to create new advisory requests
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
import { Send as SendIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiClient } from '@/api/client';
import { createAdvisoryRequest } from '@/api/endpoints/advisoryRequests';
import type { CreateAdvisoryRequestDto, SubjectDetails } from '@/api/types';

/**
 * Form Data Interface
 */
interface AdvisoryRequestFormData {
  subjectDetailId: number;
  message: string;
}

/**
 * Validation Schema
 */
const validationSchema = yup.object().shape({
  subjectDetailId: yup
    .number()
    .required('Debe seleccionar una materia y profesor')
    .min(1, 'Debe seleccionar una materia y profesor')
    .typeError('Debe seleccionar una materia y profesor'),
  message: yup
    .string()
    .required('Debe ingresar un mensaje')
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(500, 'El mensaje no puede exceder 500 caracteres'),
});

/**
 * Component Props
 */
interface AdvisoryRequestFormProps {
  /** Callback when request is created successfully */
  onSuccess?: () => void;
  /** Callback when form is cancelled */
  onCancel?: () => void;
}

/**
 * Get all subject details (profesor-materia combinations)
 */
async function getAllSubjectDetails(): Promise<SubjectDetails[]> {
  const response = await apiClient.get<SubjectDetails[]>('/subject-details');
  return response.data;
}

/**
 * Advisory Request Form Component
 */
export function AdvisoryRequestForm({ onSuccess, onCancel }: AdvisoryRequestFormProps) {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AdvisoryRequestFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      subjectDetailId: 0,
      message: '',
    },
  });

  // Fetch all subject details (professor-subject combinations)
  const {
    data: subjectDetails = [],
    isLoading: loadingSubjectDetails,
    error: subjectDetailsError,
  } = useQuery({
    queryKey: ['subject-details'],
    queryFn: getAllSubjectDetails,
  });

  // Create request mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateAdvisoryRequestDto) => createAdvisoryRequest(data),
    onSuccess: () => {
      toast.success('Solicitud de asesoría creada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['my-requests'] });
      queryClient.invalidateQueries({ queryKey: ['student-dashboard'] });
      reset();
      onSuccess?.();
    },
    onError: (error: Error) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      const errorMessage = apiError.response?.data?.message || 'Error al crear la solicitud';
      toast.error(errorMessage);
    },
  });

  /**
   * Form submit handler
   */
  const onSubmit = (data: AdvisoryRequestFormData) => {
    const requestData: CreateAdvisoryRequestDto = {
      subject_detail_id: data.subjectDetailId,
      student_message: data.message,
    };
    createMutation.mutate(requestData);
  };

  return (
    <Paper elevation={2} sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
        Nueva Solicitud de Asesoría
      </Typography>

      {subjectDetailsError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al cargar las materias y profesores. Por favor, intente de nuevo.
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Subject Detail Select (combines professor + subject) */}
        <Controller
          name="subjectDetailId"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth margin="normal" error={!!errors.subjectDetailId}>
              <InputLabel id="subject-detail-label">Materia y Profesor</InputLabel>
              <Select
                {...field}
                labelId="subject-detail-label"
                label="Materia y Profesor"
                disabled={loadingSubjectDetails || isSubmitting}
              >
                <MenuItem value={0}>
                  <em>Seleccione una materia y profesor</em>
                </MenuItem>
                {subjectDetails.map((detail) => (
                  <MenuItem key={detail.subject_detail_id} value={detail.subject_detail_id}>
                    <Box>
                      <Typography variant="body1">
                        {detail.subject.subject}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Prof. {detail.professor.name} {detail.professor.last_name}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {errors.subjectDetailId && (
                <FormHelperText>{errors.subjectDetailId.message}</FormHelperText>
              )}
              {loadingSubjectDetails && (
                <FormHelperText>
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                  Cargando opciones...
                </FormHelperText>
              )}
            </FormControl>
          )}
        />

        {/* Message TextField */}
        <Controller
          name="message"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              margin="normal"
              label="Mensaje para el profesor"
              placeholder="Describe el tema sobre el que necesitas asesoría..."
              multiline
              rows={4}
              error={!!errors.message}
              helperText={
                errors.message?.message || `${field.value.length}/500 caracteres`
              }
              disabled={isSubmitting}
            />
          )}
        />

        {/* Action Buttons */}
        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {onCancel && (
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={isSubmitting || createMutation.isPending}
            >
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
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
              ? 'Enviando...'
              : 'Enviar Solicitud'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
