/**
 * Review Request Modal Component
 * School Advisories System
 * 
 * Modal for professors to review and approve/reject advisory requests
 */

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Typography,
  Divider,
  Alert,
  Chip,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Person as PersonIcon,
  MenuBook as SubjectIcon,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { reviewRequest, type ReviewRequestDto } from '@/api/endpoints/professors';
import type { AdvisoryRequest } from '@/types';

interface ReviewFormData {
  action: 'APPROVED' | 'REJECTED';
  professor_response?: string;
  rejection_reason?: string;
}

interface ReviewRequestModalProps {
  open: boolean;
  request: AdvisoryRequest;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * ReviewRequestModal Component
 */
export function ReviewRequestModal({ open, request, onClose, onSuccess }: ReviewRequestModalProps) {
  const [submitError, setSubmitError] = useState<string>('');

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    defaultValues: {
      action: 'APPROVED',
      professor_response: '',
      rejection_reason: '',
    },
  });

  const selectedAction = watch('action');

  // Mutation for reviewing request
  const reviewMutation = useMutation({
    mutationFn: (data: ReviewRequestDto) => reviewRequest(request.request_id, data),
    onSuccess: () => {
      const actionText = selectedAction === 'APPROVED' ? 'aprobada' : 'rechazada';
      toast.success(`Solicitud ${actionText} correctamente`);
      reset();
      onSuccess();
    },
    onError: () => {
      const errorMessage = 'Error al revisar la solicitud';
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: ReviewFormData) => {
    setSubmitError('');
    const submitData: ReviewRequestDto = {
      action: data.action as 'APPROVED' | 'REJECTED',
      professor_response: data.professor_response,
      rejection_reason: data.rejection_reason,
    };
    reviewMutation.mutate(submitData);
  };

  const handleClose = () => {
    if (!reviewMutation.isPending) {
      reset();
      setSubmitError('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" component="span">
            Revisar Solicitud de Asesoría
          </Typography>
          <Chip label={request.status} size="small" color="warning" />
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        {/* Request Details */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Detalles de la Solicitud
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Student */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <PersonIcon fontSize="small" color="primary" />
              <Typography variant="subtitle2">Estudiante:</Typography>
            </Box>
            <Typography variant="body2">
              {request.student ? `${request.student.name} ${request.student.last_name}` : 'No especificado'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {request.student?.email}
            </Typography>
          </Box>

          {/* Subject */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <SubjectIcon fontSize="small" color="primary" />
              <Typography variant="subtitle2">Materia:</Typography>
            </Box>
            <Typography variant="body2">
              {request.subject_detail?.subject?.subject || 'No especificada'}
            </Typography>
          </Box>

          {/* Preferred Schedule */}
          {request.preferred_schedule && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Horario Preferido:
              </Typography>
              <Typography variant="body2">{request.preferred_schedule}</Typography>
            </Box>
          )}

          {/* Student Message */}
          {request.student_message && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Mensaje del Estudiante:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  p: 2,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  fontStyle: 'italic',
                }}
              >
                "{request.student_message}"
              </Typography>
            </Box>
          )}

          <Typography variant="caption" color="text.secondary">
            Solicitud creada el {format(parseISO(request.created_at), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Review Form */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
            <FormLabel component="legend">Decisión *</FormLabel>
            <Controller
              name="action"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field} row>
                  <FormControlLabel
                    value="APPROVED"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ApproveIcon fontSize="small" color="success" />
                        <span>Aprobar</span>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="REJECTED"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <RejectIcon fontSize="small" color="error" />
                        <span>Rechazar</span>
                      </Box>
                    }
                  />
                </RadioGroup>
              )}
            />
            {errors.action && (
              <Typography variant="caption" color="error">
                {errors.action.message}
              </Typography>
            )}
          </FormControl>

          {/* Conditional Fields */}
          {selectedAction === 'APPROVED' && (
            <Controller
              name="professor_response"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={3}
                  label="Respuesta al Estudiante (Opcional)"
                  placeholder="Agrega comentarios o instrucciones para el estudiante..."
                  helperText="Puedes proporcionar información adicional sobre la asesoría"
                />
              )}
            />
          )}

          {selectedAction === 'REJECTED' && (
            <Controller
              name="rejection_reason"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  required
                  multiline
                  rows={3}
                  label="Motivo del Rechazo"
                  placeholder="Explica por qué se rechaza la solicitud..."
                  error={!!errors.rejection_reason}
                  helperText={errors.rejection_reason?.message || 'Este campo es obligatorio'}
                />
              )}
            />
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={reviewMutation.isPending}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color={selectedAction === 'APPROVED' ? 'success' : 'error'}
          disabled={reviewMutation.isPending}
          startIcon={selectedAction === 'APPROVED' ? <ApproveIcon /> : <RejectIcon />}
        >
          {reviewMutation.isPending
            ? 'Procesando...'
            : selectedAction === 'APPROVED'
            ? 'Aprobar Solicitud'
            : 'Rechazar Solicitud'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReviewRequestModal;
