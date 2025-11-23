/**
 * Professor Pending Requests Page
 * Displays all pending advisory requests for the professor
 */

import { useState } from 'react';
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
  DialogActions,
  TextField,
  Paper,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Message as MessageIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Layout, LoadingSpinner } from '@/components/common';
import { usePendingRequests, useApproveRequest, useRejectRequest } from '@/hooks/useAdvisoryRequests';
import type { AdvisoryRequest } from '@/api/types/advisoryRequests.types';

type ActionType = 'approve' | 'reject';

/**
 * Professor Pending Requests Page Component
 */
export function ProfessorPendingRequests() {
  const { data: requests, isLoading, error, refetch } = usePendingRequests();
  const approveMutation = useApproveRequest();
  const rejectMutation = useRejectRequest();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<ActionType>('approve');
  const [selectedRequest, setSelectedRequest] = useState<AdvisoryRequest | null>(null);
  const [response, setResponse] = useState('');

  const handleOpenDialog = (request: AdvisoryRequest, type: ActionType) => {
    setSelectedRequest(request);
    setActionType(type);
    setResponse('');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRequest(null);
    setResponse('');
  };

  const handleConfirmAction = async () => {
    if (!selectedRequest || !response.trim()) return;

    try {
      if (actionType === 'approve') {
        await approveMutation.mutateAsync({
          requestId: selectedRequest.request_id,
          data: { professor_response: response },
        });
      } else {
        await rejectMutation.mutateAsync({
          requestId: selectedRequest.request_id,
          data: { professor_response: response },
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error(`Error ${actionType}ing request:`, error);
    }
  };

  const isProcessing = approveMutation.isPending || rejectMutation.isPending;

  if (isLoading) {
    return (
      <Layout title="Solicitudes Pendientes">
        <LoadingSpinner message="Cargando solicitudes..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Solicitudes Pendientes">
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al cargar las solicitudes. Por favor, intente de nuevo.
        </Alert>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => refetch()}>
          Reintentar
        </Button>
      </Layout>
    );
  }

  return (
    <Layout title="Solicitudes Pendientes">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Solicitudes Pendientes
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Revisa y gestiona las solicitudes de asesoría de tus estudiantes.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
          >
            Actualizar
          </Button>
        </Box>

        {/* Summary */}
        {requests && requests.length > 0 && (
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'warning.light' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <EventIcon sx={{ fontSize: 48, color: 'warning.dark' }} />
              <Box>
                <Typography variant="h4" fontWeight="bold" color="warning.dark">
                  {requests.length}
                </Typography>
                <Typography variant="body1" color="warning.dark">
                  {requests.length === 1 ? 'Solicitud Pendiente' : 'Solicitudes Pendientes'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}

        {/* Requests List */}
        {!requests || requests.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tienes solicitudes pendientes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Las nuevas solicitudes de asesoría aparecerán aquí.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={3}>
            {requests.map((request) => (
              <Card key={request.request_id} elevation={2}>
                <CardContent>
                  {/* Header with Subject */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                      <Typography variant="h5" fontWeight="bold" color="primary">
                        {request.subject_detail?.subject.subject}
                      </Typography>
                      <Chip
                        label="PENDIENTE"
                        color="warning"
                        size="small"
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Solicitud #{request.request_id}
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* Student Information */}
                  <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>
                      Información del Estudiante
                    </Typography>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                        gap: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          <PersonIcon fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {request.student?.name} {request.student?.last_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Nombre completo
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BadgeIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="body2">{request.student?.student_id}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Matrícula
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, gridColumn: { xs: '1', sm: '1 / -1' } }}>
                        <EmailIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="body2">{request.student?.email}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Correo electrónico
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>

                  {/* Student Message */}
                  {request.student_message && (
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <MessageIcon fontSize="small" color="primary" />
                        <Typography variant="subtitle2" fontWeight="bold">
                          Mensaje del estudiante:
                        </Typography>
                      </Box>
                      <Paper
                        sx={{
                          p: 2,
                          bgcolor: 'primary.light',
                          color: 'primary.contrastText',
                          fontStyle: 'italic',
                        }}
                      >
                        <Typography variant="body2">"{request.student_message}"</Typography>
                      </Paper>
                    </Box>
                  )}

                  {/* Date Information */}
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
                    📅 Solicitado el{' '}
                    {format(parseISO(request.created_at), "EEEE d 'de' MMMM 'de' yyyy 'a las' HH:mm", {
                      locale: es,
                    })}
                  </Typography>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="large"
                      startIcon={<ApproveIcon />}
                      onClick={() => handleOpenDialog(request, 'approve')}
                      disabled={isProcessing}
                      fullWidth
                    >
                      Aprobar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="large"
                      startIcon={<RejectIcon />}
                      onClick={() => handleOpenDialog(request, 'reject')}
                      disabled={isProcessing}
                      fullWidth
                    >
                      Rechazar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        {/* Action Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {actionType === 'approve' ? '✅ Aprobar Solicitud' : '❌ Rechazar Solicitud'}
          </DialogTitle>
          <DialogContent>
            {selectedRequest && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Estudiante:</strong> {selectedRequest.student?.name}{' '}
                  {selectedRequest.student?.last_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Materia:</strong> {selectedRequest.subject_detail?.subject.subject}
                </Typography>
              </Box>
            )}
            <TextField
              autoFocus
              label={
                actionType === 'approve'
                  ? 'Mensaje de aprobación'
                  : 'Motivo del rechazo'
              }
              placeholder={
                actionType === 'approve'
                  ? 'Ej: Te espero el lunes a las 10:00 AM en mi oficina.'
                  : 'Ej: No tengo disponibilidad en las fechas solicitadas.'
              }
              multiline
              rows={4}
              fullWidth
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={isProcessing}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmAction}
              variant="contained"
              color={actionType === 'approve' ? 'success' : 'error'}
              disabled={isProcessing || !response.trim()}
            >
              {isProcessing
                ? 'Procesando...'
                : actionType === 'approve'
                ? 'Aprobar'
                : 'Rechazar'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}

export default ProfessorPendingRequests;
