/**
 * Student My Requests Page
 * Displays all advisory requests made by the student
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Cancel as CancelIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Message as MessageIcon,
  CheckCircle as ApprovedIcon,
  Error as RejectedIcon,
  Pending as PendingIcon,
  Block as CancelledIcon,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Layout, LoadingSpinner } from '@/components/common';
import { useMyRequests, useCancelRequest } from '@/hooks/useAdvisoryRequests';
import { RequestStatus } from '@/api/types/advisoryRequests.types';
import type { AdvisoryRequest } from '@/api/types/advisoryRequests.types';

/**
 * Student My Requests Page Component
 */
export function StudentMyRequests() {
  const navigate = useNavigate();
  const { data: requests, isLoading, error } = useMyRequests();
  const cancelMutation = useCancelRequest();

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AdvisoryRequest | null>(null);

  const handleOpenCancelDialog = (request: AdvisoryRequest) => {
    setSelectedRequest(request);
    setCancelDialogOpen(true);
  };

  const handleCloseCancelDialog = () => {
    setCancelDialogOpen(false);
    setSelectedRequest(null);
  };

  const handleConfirmCancel = async () => {
    if (!selectedRequest) return;

    try {
      await cancelMutation.mutateAsync(selectedRequest.request_id);
      handleCloseCancelDialog();
    } catch (error) {
      console.error('Error cancelling request:', error);
    }
  };

  // Helper to get status color
  const getStatusColor = (
    status: RequestStatus
  ): 'default' | 'warning' | 'success' | 'error' => {
    switch (status) {
      case RequestStatus.PENDING:
        return 'warning';
      case RequestStatus.APPROVED:
        return 'success';
      case RequestStatus.REJECTED:
        return 'error';
      case RequestStatus.CANCELLED:
        return 'default';
      default:
        return 'default';
    }
  };

  // Helper to get status icon
  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.PENDING:
        return <PendingIcon fontSize="small" />;
      case RequestStatus.APPROVED:
        return <ApprovedIcon fontSize="small" />;
      case RequestStatus.REJECTED:
        return <RejectedIcon fontSize="small" />;
      case RequestStatus.CANCELLED:
        return <CancelledIcon fontSize="small" />;
      default:
        return null;
    }
  };

  // Helper to translate status
  const translateStatus = (status: RequestStatus): string => {
    switch (status) {
      case RequestStatus.PENDING:
        return 'Pendiente';
      case RequestStatus.APPROVED:
        return 'Aprobada';
      case RequestStatus.REJECTED:
        return 'Rechazada';
      case RequestStatus.CANCELLED:
        return 'Cancelada';
      default:
        return status;
    }
  };

  // Check if request can be cancelled
  const canCancel = (status: RequestStatus): boolean => {
    return status === RequestStatus.PENDING || status === RequestStatus.APPROVED;
  };

  if (isLoading) {
    return (
      <Layout title="Mis Solicitudes">
        <LoadingSpinner message="Cargando solicitudes..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Mis Solicitudes">
        <Alert severity="error">
          Error al cargar las solicitudes. Por favor, intente de nuevo.
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout title="Mis Solicitudes">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Mis Solicitudes de Asesoría
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gestiona tus solicitudes y revisa las respuestas de los profesores.
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/student/new-request')}
          >
            Nueva Solicitud
          </Button>
        </Box>

        {/* Summary Stats */}
        {requests && requests.length > 0 && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
              gap: 2,
              mb: 3,
            }}
          >
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light' }}>
              <Typography variant="h4" fontWeight="bold">
                {requests.filter((r) => r.status === RequestStatus.PENDING).length}
              </Typography>
              <Typography variant="body2">Pendientes</Typography>
            </Paper>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
              <Typography variant="h4" fontWeight="bold">
                {requests.filter((r) => r.status === RequestStatus.APPROVED).length}
              </Typography>
              <Typography variant="body2">Aprobadas</Typography>
            </Paper>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light' }}>
              <Typography variant="h4" fontWeight="bold">
                {requests.filter((r) => r.status === RequestStatus.REJECTED).length}
              </Typography>
              <Typography variant="body2">Rechazadas</Typography>
            </Paper>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.300' }}>
              <Typography variant="h4" fontWeight="bold">
                {requests.filter((r) => r.status === RequestStatus.CANCELLED).length}
              </Typography>
              <Typography variant="body2">Canceladas</Typography>
            </Paper>
          </Box>
        )}

        {/* Requests List */}
        {!requests || requests.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tienes solicitudes de asesoría
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                ¡Crea tu primera solicitud para comenzar a recibir asesorías!
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/student/new-request')}
              >
                Crear Primera Solicitud
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={2}>
            {requests.map((request) => (
              <Card key={request.request_id}>
                <CardContent>
                  {/* Header */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {request.subject_detail?.subject.subject}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Solicitud #{request.request_id}
                      </Typography>
                    </Box>
                    <Chip
                      label={translateStatus(request.status)}
                      color={getStatusColor(request.status)}
                      {...(getStatusIcon(request.status) && { icon: getStatusIcon(request.status)! })}
                      size="small"
                    />
                  </Box>

                  {/* Professor Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <PersonIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      <strong>Profesor:</strong> {request.professor?.name}{' '}
                      {request.professor?.last_name}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Student Message */}
                  {request.student_message && (
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <MessageIcon fontSize="small" color="primary" />
                        <Typography variant="subtitle2" color="primary">
                          Tu mensaje:
                        </Typography>
                      </Box>
                      <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                        <Typography variant="body2">{request.student_message}</Typography>
                      </Paper>
                    </Box>
                  )}

                  {/* Professor Response */}
                  {request.professor_response && (
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <MessageIcon fontSize="small" color="secondary" />
                        <Typography variant="subtitle2" color="secondary">
                          Respuesta del profesor:
                        </Typography>
                      </Box>
                      <Paper
                        sx={{ p: 2, bgcolor: 'secondary.light', color: 'secondary.contrastText' }}
                      >
                        <Typography variant="body2">{request.professor_response}</Typography>
                      </Paper>
                    </Box>
                  )}

                  {/* Dates */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      <strong>Creada:</strong>{' '}
                      {format(parseISO(request.created_at), "d 'de' MMMM, yyyy HH:mm", {
                        locale: es,
                      })}
                    </Typography>
                    {request.processed_at && (
                      <Typography variant="caption" color="text.secondary">
                        <strong>Procesada:</strong>{' '}
                        {format(parseISO(request.processed_at), "d 'de' MMMM, yyyy HH:mm", {
                          locale: es,
                        })}
                      </Typography>
                    )}
                  </Box>

                  {/* Actions */}
                  {canCancel(request.status) && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<CancelIcon />}
                        onClick={() => handleOpenCancelDialog(request)}
                        disabled={cancelMutation.isPending}
                      >
                        Cancelar Solicitud
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        {/* Cancel Confirmation Dialog */}
        <Dialog
          open={cancelDialogOpen}
          onClose={handleCloseCancelDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>¿Cancelar Solicitud?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de que deseas cancelar esta solicitud de asesoría?
              {selectedRequest && (
                <>
                  <br />
                  <br />
                  <strong>Materia:</strong> {selectedRequest.subject_detail?.subject.subject}
                  <br />
                  <strong>Profesor:</strong> {selectedRequest.professor?.name}{' '}
                  {selectedRequest.professor?.last_name}
                </>
              )}
              <br />
              <br />
              Esta acción no se puede deshacer.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCancelDialog} disabled={cancelMutation.isPending}>
              No, Mantener
            </Button>
            <Button
              onClick={handleConfirmCancel}
              color="error"
              variant="contained"
              disabled={cancelMutation.isPending}
              autoFocus
            >
              {cancelMutation.isPending ? 'Cancelando...' : 'Sí, Cancelar'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}

export default StudentMyRequests;
