/**
 * Pending Requests List Component
 * School Advisories System
 * 
 * Displays pending advisory requests for professors to review
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  Alert,
  Pagination,
  Divider,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Person as PersonIcon,
  MenuBook as SubjectIcon,
  CalendarMonth as CalendarIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { LoadingSpinner } from '@/components/common';
import { getPendingRequests } from '@/api/endpoints/professors';
import type { AdvisoryRequest } from '@/types';
import { ReviewRequestModal } from './ReviewRequestModal';

/**
 * PendingRequestsList Component
 */
export function PendingRequestsList() {
  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<AdvisoryRequest | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const limit = 10;

  // Fetch pending requests
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['pending-requests', page],
    queryFn: () => getPendingRequests(page, limit),
  });

  const handleReviewClick = (request: AdvisoryRequest) => {
    setSelectedRequest(request);
    setIsReviewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsReviewModalOpen(false);
    setSelectedRequest(null);
  };

  const handleReviewSuccess = () => {
    refetch();
    handleCloseModal();
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

  const requests = data?.items || [];
  const totalPages = data?.totalPages || 1;

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay solicitudes pendientes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Las nuevas solicitudes aparecerán aquí cuando los estudiantes las envíen.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Stack spacing={3}>
        {requests.map((request: AdvisoryRequest) => (
          <Card key={request.request_id} elevation={2}>
            <CardContent>
              {/* Header: Student Info & Status */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <PersonIcon color="primary" />
                    <Typography variant="h6">
                      {request.student ? `${request.student.name} ${request.student.last_name}` : 'Estudiante'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {request.student?.email}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'right' }}>
                  <Chip
                    label={request.status}
                    color={request.status === 'PENDING' ? 'warning' : 'default'}
                    size="small"
                    sx={{ mb: 0.5 }}
                  />
                  <Typography variant="caption" display="block" color="text.secondary">
                    Creada: {format(parseISO(request.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Subject Info */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <SubjectIcon fontSize="small" />
                  <Typography variant="subtitle2">Materia:</Typography>
                </Box>
                <Typography variant="body2">
                  {request.subject_detail?.subject?.subject || 'No especificada'}
                </Typography>
              </Box>

              {/* Preferred Schedule */}
              {request.preferred_schedule && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CalendarIcon fontSize="small" />
                    <Typography variant="subtitle2">Horario Preferido:</Typography>
                  </Box>
                  <Typography variant="body2">
                    {request.preferred_schedule}
                  </Typography>
                </Box>
              )}

              {/* Student Message */}
              {request.student_message && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <MessageIcon fontSize="small" />
                    <Typography variant="subtitle2">Mensaje del Estudiante:</Typography>
                  </Box>
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

              <Divider sx={{ my: 2 }} />

              {/* Actions */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<ViewIcon />}
                  onClick={() => handleReviewClick(request)}
                >
                  Revisar Solicitud
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {/* Review Modal */}
      {selectedRequest && (
        <ReviewRequestModal
          open={isReviewModalOpen}
          request={selectedRequest}
          onClose={handleCloseModal}
          onSuccess={handleReviewSuccess}
        />
      )}
    </Box>
  );
}

export default PendingRequestsList;
