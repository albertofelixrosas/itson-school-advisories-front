/**
 * My Requests List Component
 * School Advisories System
 * 
 * Displays a list of student's advisory requests with actions
 */

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Stack,
  Divider,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  HourglassEmpty as PendingIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getMyRequests, cancelRequest } from '@/api/endpoints/advisoryRequests';
import { LoadingSpinner, ConfirmDialog } from '@/components/common';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import type { AdvisoryRequestResponseDto, RequestStatus } from '@/api/types';

/**
 * Get status color
 */
function getStatusColor(status: RequestStatus): 'default' | 'warning' | 'success' | 'error' {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'APPROVED':
      return 'success';
    case 'REJECTED':
    case 'CANCELLED':
      return 'error';
    default:
      return 'default';
  }
}

/**
 * Get status icon
 */
function getStatusIcon(status: RequestStatus) {
  switch (status) {
    case 'PENDING':
      return <PendingIcon fontSize="small" />;
    case 'APPROVED':
      return <CheckCircleIcon fontSize="small" />;
    case 'REJECTED':
    case 'CANCELLED':
      return <ErrorIcon fontSize="small" />;
  }
}

/**
 * Get status label in Spanish
 */
function getStatusLabel(status: RequestStatus): string {
  const labels: Record<RequestStatus, string> = {
    PENDING: 'Pendiente',
    APPROVED: 'Aprobada',
    REJECTED: 'Rechazada',
    CANCELLED: 'Cancelada',
  };
  return labels[status] || status;
}

/**
 * My Requests List Component
 */
export function MyRequestsList() {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<AdvisoryRequestResponseDto | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const confirmDialog = useConfirmDialog();

  // Fetch requests
  const { data, isLoading, error } = useQuery({
    queryKey: ['my-requests'],
    queryFn: getMyRequests,
  });

  // Cancel mutation
  const cancelMutation = useMutation({
    mutationFn: (id: number) => cancelRequest(id),
    onSuccess: () => {
      toast.success('Solicitud cancelada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['my-requests'] });
      queryClient.invalidateQueries({ queryKey: ['student-dashboard'] });
    },
    onError: () => {
      toast.error('Error al cancelar la solicitud');
    },
  });

  /**
   * Handle view details
   */
  const handleViewDetails = (request: AdvisoryRequestResponseDto) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };

  /**
   * Handle cancel request
   */
  const handleCancelRequest = (request: AdvisoryRequestResponseDto) => {
    confirmDialog.showDialog({
      title: '¿Cancelar solicitud?',
      message: `¿Estás seguro de que deseas cancelar la solicitud de asesoría para ${request.subject_detail.subject.subject}?`,
      confirmText: 'Sí, cancelar',
      cancelText: 'No, mantener',
      severity: 'error',
      onConfirm: async () => {
        cancelMutation.mutate(request.request_id);
      },
    });
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando solicitudes..." />;
  }

  if (error) {
    return (
      <Alert severity="error">
        Error al cargar las solicitudes. Por favor, intente de nuevo.
      </Alert>
    );
  }

  const requests = data || [];

  if (requests.length === 0) {
    return (
      <Alert severity="info">
        No tienes solicitudes de asesoría aún. ¡Crea tu primera solicitud para comenzar!
      </Alert>
    );
  }

  return (
    <Box>
      <Stack spacing={2}>
        {requests.map((request: AdvisoryRequestResponseDto) => (
          <Card key={request.request_id} variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {request.subject_detail.subject.subject}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Prof. {request.professor.name} {request.professor.last_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Solicitada el {format(new Date(request.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                  </Typography>
                </Box>
                <Chip
                  label={getStatusLabel(request.status)}
                  color={getStatusColor(request.status)}
                  icon={getStatusIcon(request.status)}
                  size="small"
                />
              </Box>

              {request.student_message && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Mensaje:
                  </Typography>
                  <Typography variant="body2">
                    {request.student_message}
                  </Typography>
                </Box>
              )}

              {request.professor_response && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Typography variant="caption" fontWeight="bold">
                    Respuesta del profesor:
                  </Typography>
                  <Typography variant="body2">
                    {request.professor_response}
                  </Typography>
                </Alert>
              )}

              {request.rejection_reason && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Typography variant="caption" fontWeight="bold">
                    Motivo de rechazo:
                  </Typography>
                  <Typography variant="body2">
                    {request.rejection_reason}
                  </Typography>
                </Alert>
              )}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  size="small"
                  startIcon={<VisibilityIcon />}
                  onClick={() => handleViewDetails(request)}
                >
                  Ver Detalles
                </Button>
                {request.status === 'PENDING' && (
                  <Button
                    size="small"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => handleCancelRequest(request)}
                    disabled={cancelMutation.isPending}
                  >
                    Cancelar
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedRequest && (
          <>
            <DialogTitle>
              Detalles de la Solicitud
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Materia
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedRequest.subject_detail.subject.subject}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Profesor
                  </Typography>
                  <Typography variant="body1">
                    {selectedRequest.professor.name} {selectedRequest.professor.last_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedRequest.professor.email}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Estado
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={getStatusLabel(selectedRequest.status)}
                      color={getStatusColor(selectedRequest.status)}
                      icon={getStatusIcon(selectedRequest.status)}
                      size="small"
                    />
                  </Box>
                </Box>

                {selectedRequest.student_message && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Tu mensaje
                    </Typography>
                    <Typography variant="body2">
                      {selectedRequest.student_message}
                    </Typography>
                  </Box>
                )}

                {selectedRequest.professor_response && (
                  <Alert severity="success">
                    <Typography variant="caption" fontWeight="bold">
                      Respuesta del profesor
                    </Typography>
                    <Typography variant="body2">
                      {selectedRequest.professor_response}
                    </Typography>
                  </Alert>
                )}

                {selectedRequest.rejection_reason && (
                  <Alert severity="error">
                    <Typography variant="caption" fontWeight="bold">
                      Motivo de rechazo
                    </Typography>
                    <Typography variant="body2">
                      {selectedRequest.rejection_reason}
                    </Typography>
                  </Alert>
                )}

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Fecha de solicitud
                  </Typography>
                  <Typography variant="body2">
                    {format(new Date(selectedRequest.created_at), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                  </Typography>
                </Box>

                {selectedRequest.reviewed_at && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Fecha de revisión
                    </Typography>
                    <Typography variant="body2">
                      {format(new Date(selectedRequest.reviewed_at), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsOpen(false)}>
                Cerrar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

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
