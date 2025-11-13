/**
 * My Invitations List Component
 * School Advisories System
 * 
 * Displays student's invitations to advisory sessions
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
  TextField,
  Alert,
  Stack,
  Divider,
} from '@mui/material';
import {
  Event as EventIcon,
  CheckCircle as AcceptIcon,
  Cancel as DeclineIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { getMyInvitations, acceptInvitation, declineInvitation } from '@/api/endpoints/invitations';
import { LoadingSpinner } from '@/components/common';
import type { InvitationResponseDto, InvitationStatus } from '@/api/types';

/**
 * Get status color
 */
function getStatusColor(status: InvitationStatus): 'default' | 'warning' | 'success' | 'error' {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'ACCEPTED':
      return 'success';
    case 'DECLINED':
    case 'EXPIRED':
      return 'error';
    default:
      return 'default';
  }
}

/**
 * Get status label
 */
function getStatusLabel(status: InvitationStatus): string {
  const labels: Record<InvitationStatus, string> = {
    PENDING: 'Pendiente',
    ACCEPTED: 'Aceptada',
    DECLINED: 'Rechazada',
    EXPIRED: 'Expirada',
  };
  return labels[status] || status;
}

/**
 * My Invitations List Component
 */
export function MyInvitationsList() {
  const queryClient = useQueryClient();
  const [selectedInvitation, setSelectedInvitation] = useState<InvitationResponseDto | null>(null);
  const [respondDialogOpen, setRespondDialogOpen] = useState(false);
  const [responseType, setResponseType] = useState<'accept' | 'decline'>('accept');
  const [responseMessage, setResponseMessage] = useState('');

  // Fetch invitations
  const { data, isLoading, error } = useQuery({
    queryKey: ['my-invitations'],
    queryFn: () => getMyInvitations(1, 50),
  });

  // Accept mutation
  const acceptMutation = useMutation({
    mutationFn: ({ id, message }: { id: number; message?: string }) => 
      acceptInvitation(id, message),
    onSuccess: () => {
      toast.success('Invitación aceptada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['my-invitations'] });
      queryClient.invalidateQueries({ queryKey: ['my-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['student-dashboard'] });
      handleCloseDialog();
    },
    onError: () => {
      toast.error('Error al aceptar la invitación');
    },
  });

  // Decline mutation
  const declineMutation = useMutation({
    mutationFn: ({ id, message }: { id: number; message?: string }) => 
      declineInvitation(id, message),
    onSuccess: () => {
      toast.success('Invitación rechazada');
      queryClient.invalidateQueries({ queryKey: ['my-invitations'] });
      queryClient.invalidateQueries({ queryKey: ['student-dashboard'] });
      handleCloseDialog();
    },
    onError: () => {
      toast.error('Error al rechazar la invitación');
    },
  });

  /**
   * Open respond dialog
   */
  const handleRespond = (invitation: InvitationResponseDto, type: 'accept' | 'decline') => {
    setSelectedInvitation(invitation);
    setResponseType(type);
    setResponseMessage('');
    setRespondDialogOpen(true);
  };

  /**
   * Close dialog
   */
  const handleCloseDialog = () => {
    setRespondDialogOpen(false);
    setSelectedInvitation(null);
    setResponseMessage('');
  };

  /**
   * Submit response
   */
  const handleSubmitResponse = () => {
    if (!selectedInvitation) return;

    const data = {
      id: selectedInvitation.invitation_id,
      message: responseMessage.trim() || undefined,
    };

    if (responseType === 'accept') {
      acceptMutation.mutate(data);
    } else {
      declineMutation.mutate(data);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando invitaciones..." />;
  }

  if (error) {
    return (
      <Alert severity="error">
        Error al cargar las invitaciones. Por favor, intente de nuevo.
      </Alert>
    );
  }

  const invitations = data?.items || [];

  if (invitations.length === 0) {
    return (
      <Alert severity="info">
        No tienes invitaciones en este momento.
      </Alert>
    );
  }

  return (
    <Box>
      <Stack spacing={2}>
        {invitations.map((invitation: InvitationResponseDto) => (
          <Card key={invitation.invitation_id} variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {invitation.advisory_date.topic}
                  </Typography>
                  
                  <Stack spacing={1} sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EventIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {format(parseISO(invitation.advisory_date.date), "EEEE, d 'de' MMMM, yyyy", { locale: es })}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {invitation.advisory_date.venue.name} - {invitation.advisory_date.venue.location}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Invitado por: {invitation.invited_by.name} {invitation.invited_by.last_name}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
                
                <Chip
                  label={getStatusLabel(invitation.status)}
                  color={getStatusColor(invitation.status)}
                  size="small"
                />
              </Box>

              {invitation.invitation_message && (
                <Box sx={{ mb: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold">
                    Mensaje del profesor:
                  </Typography>
                  <Typography variant="body2">
                    {invitation.invitation_message}
                  </Typography>
                </Box>
              )}

              {invitation.response_message && (
                <Alert severity={invitation.status === 'ACCEPTED' ? 'success' : 'info'} sx={{ mb: 2 }}>
                  <Typography variant="caption" fontWeight="bold">
                    Tu respuesta:
                  </Typography>
                  <Typography variant="body2">
                    {invitation.response_message}
                  </Typography>
                </Alert>
              )}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                {invitation.status === 'PENDING' && (
                  <>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      startIcon={<AcceptIcon />}
                      onClick={() => handleRespond(invitation, 'accept')}
                    >
                      Aceptar
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<DeclineIcon />}
                      onClick={() => handleRespond(invitation, 'decline')}
                    >
                      Rechazar
                    </Button>
                  </>
                )}
                {invitation.status === 'ACCEPTED' && (
                  <Chip 
                    icon={<AcceptIcon />} 
                    label="Ya aceptada" 
                    color="success" 
                    size="small" 
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Response Dialog */}
      <Dialog
        open={respondDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {responseType === 'accept' ? 'Aceptar Invitación' : 'Rechazar Invitación'}
        </DialogTitle>
        <DialogContent dividers>
          {selectedInvitation && (
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                {responseType === 'accept' 
                  ? '¿Deseas agregar un mensaje de confirmación?'
                  : 'Por favor, indica el motivo del rechazo (opcional):'}
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Mensaje (opcional)"
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder={
                  responseType === 'accept'
                    ? 'Gracias por la invitación, estaré presente...'
                    : 'Lo siento, no podré asistir porque...'
                }
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={acceptMutation.isPending || declineMutation.isPending}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmitResponse}
            variant="contained"
            color={responseType === 'accept' ? 'success' : 'error'}
            disabled={acceptMutation.isPending || declineMutation.isPending}
          >
            {acceptMutation.isPending || declineMutation.isPending
              ? 'Procesando...'
              : responseType === 'accept'
              ? 'Confirmar Aceptación'
              : 'Confirmar Rechazo'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
