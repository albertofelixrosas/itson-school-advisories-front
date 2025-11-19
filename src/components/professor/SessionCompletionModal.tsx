/**
 * Session Completion Modal Component
 * School Advisories System
 * 
 * Modal for professors to complete a session with notes and summary
 */

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle as CompleteIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { completeSession } from '@/api/endpoints/attendance';

/**
 * Form Data Interface
 */
interface SessionCompletionFormData {
  sessionNotes: string;
  topicInput?: string;
}

/**
 * Validation Schema
 */
const validationSchema: yup.ObjectSchema<SessionCompletionFormData> = yup.object().shape({
  sessionNotes: yup
    .string()
    .required('Las notas de la sesión son obligatorias')
    .min(10, 'Las notas deben tener al menos 10 caracteres')
    .max(1000, 'Las notas no pueden exceder 1000 caracteres'),
  topicInput: yup.string().max(200, 'El tema no puede exceder 200 caracteres').optional(),
});

/**
 * Component Props
 */
interface SessionCompletionModalProps {
  /** Whether modal is open */
  open: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Session ID to complete */
  sessionId: number;
  /** Session topic for display */
  sessionTopic?: string;
  /** Callback when session is completed */
  onSuccess?: () => void;
}

/**
 * Session Completion Modal Component
 */
export function SessionCompletionModal({
  open,
  onClose,
  sessionId,
  sessionTopic,
  onSuccess,
}: SessionCompletionModalProps) {
  const queryClient = useQueryClient();
  const [topicsCovered, setTopicsCovered] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<SessionCompletionFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      sessionNotes: '',
      topicInput: '',
    },
  });

  // Complete session mutation
  const completeMutation = useMutation({
    mutationFn: async (data: { session_notes: string; topics_covered?: string[] }) => {
      await completeSession(sessionId, data);
    },
    onSuccess: () => {
      toast.success('Sesión completada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['my-advisories'] });
      queryClient.invalidateQueries({ queryKey: ['professor-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['session-attendance', sessionId] });
      handleClose();
      onSuccess?.();
    },
    onError: (error: Error) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      const errorMessage = apiError.response?.data?.message || 'Error al completar la sesión';
      toast.error(errorMessage);
    },
  });

  /**
   * Add topic covered
   */
  const handleAddTopic = (topic: string) => {
    if (topic.trim() && !topicsCovered.includes(topic.trim())) {
      setTopicsCovered([...topicsCovered, topic.trim()]);
      setValue('topicInput', '');
    }
  };

  /**
   * Remove topic
   */
  const handleRemoveTopic = (topicToRemove: string) => {
    setTopicsCovered(topicsCovered.filter((t) => t !== topicToRemove));
  };

  /**
   * Handle form submission
   */
  const onSubmit = (data: SessionCompletionFormData) => {
    completeMutation.mutate({
      session_notes: data.sessionNotes,
      topics_covered: topicsCovered.length > 0 ? topicsCovered : undefined,
    });
  };

  /**
   * Handle close and reset
   */
  const handleClose = () => {
    reset();
    setTopicsCovered([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CompleteIcon color="success" />
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Completar Sesión
            </Typography>
            {sessionTopic && (
              <Typography variant="body2" color="text.secondary">
                {sessionTopic}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Completa la información de resumen de la sesión. Esto se enviará por correo a todos los participantes.
          </Alert>

          {/* Session Notes */}
          <Box sx={{ mb: 3 }}>
            <Controller
              name="sessionNotes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Notas de la Sesión *"
                  placeholder="Describe lo que se cubrió en la sesión, observaciones importantes, etc."
                  multiline
                  rows={6}
                  error={!!errors.sessionNotes}
                  helperText={
                    errors.sessionNotes?.message ||
                    `${field.value.length}/1000 caracteres`
                  }
                  disabled={completeMutation.isPending}
                />
              )}
            />
          </Box>

          {/* Topics Covered */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Temas Cubiertos (Opcional)
            </Typography>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              Agrega los temas específicos que se cubrieron en la sesión
            </Typography>
            
            <Controller
              name="topicInput"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  placeholder="Ej: Ecuaciones diferenciales de primer orden"
                  error={!!errors.topicInput}
                  helperText={errors.topicInput?.message}
                  disabled={completeMutation.isPending}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (field.value) {
                        handleAddTopic(field.value);
                      }
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <Button
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => field.value && handleAddTopic(field.value)}
                        disabled={!field.value?.trim() || completeMutation.isPending}
                      >
                        Agregar
                      </Button>
                    ),
                  }}
                />
              )}
            />

            {/* Topics List */}
            {topicsCovered.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
                {topicsCovered.map((topic) => (
                  <Chip
                    key={topic}
                    label={topic}
                    onDelete={() => handleRemoveTopic(topic)}
                    deleteIcon={<CloseIcon />}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Stack>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={completeMutation.isPending}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={
            completeMutation.isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <CompleteIcon />
            )
          }
          onClick={handleSubmit(onSubmit)}
          disabled={completeMutation.isPending}
        >
          {completeMutation.isPending ? 'Completando...' : 'Completar Sesión'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SessionCompletionModal;
