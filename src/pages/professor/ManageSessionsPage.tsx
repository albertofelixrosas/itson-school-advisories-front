/**
 * Manage Sessions Page
 * School Advisories System
 * 
 * Page for professors to manage their advisory sessions
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layout, LoadingSpinner } from '@/components/common';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Alert,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  PersonAdd as InviteIcon,
  Assignment as AttendanceIcon,
  CheckCircle as CompleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { format, parseISO, isFuture, isPast } from 'date-fns';
import { es } from 'date-fns/locale';
import { getAdvisoriesWithSessions, getSessionDetails } from '@/api/endpoints/advisories';
import { getSessionStudents } from '@/api/endpoints/attendance';
import { InviteStudentsModal } from '@/components/professor/InviteStudentsModal';
import { AttendanceForm } from '@/components/professor/AttendanceForm';
import { SessionCompletionModal } from '@/components/professor/SessionCompletionModal';
import { useAuth } from '@/hooks/useAuth';
import type { AdvisoryWithSessions, AdvisoryDateInfo, User } from '@/types';
import type { FullSessionDetailsDto } from '@/api/types';

/**
 * Manage Sessions Page
 */
export function ManageSessionsPage() {
  const { user } = useAuth();
  const [selectedSession, setSelectedSession] = useState<AdvisoryDateInfo | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [attendanceView, setAttendanceView] = useState(false);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [detailsSessionId, setDetailsSessionId] = useState<number | null>(null);

  // Fetch professor's advisories WITH sessions included
  const { data: advisories = [], isLoading, error } = useQuery({
    queryKey: ['advisories', 'with-sessions', user?.user_id],
    queryFn: () => {
      if (!user?.user_id) {
        throw new Error('No user ID available');
      }
      return getAdvisoriesWithSessions(user.user_id);
    },
    enabled: !!user?.user_id,
  });

  const {
    data: sessionDetails,
    isLoading: isLoadingSessionDetails,
    error: sessionDetailsError,
  } = useQuery({
    queryKey: ['session-details', detailsSessionId],
    queryFn: () => getSessionDetails(detailsSessionId as number),
    enabled: detailsSessionId !== null,
  });

  /**
   * Get all sessions from advisories
   */
  const getAllSessions = (): AdvisoryDateInfo[] => {
    const sessions: AdvisoryDateInfo[] = [];
    advisories.forEach((advisory: AdvisoryWithSessions) => {
      if (advisory.advisory_dates) {
        sessions.push(...advisory.advisory_dates);
      }
    });
    return sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const allSessions = getAllSessions();
  const upcomingSessions = allSessions.filter((s) => isFuture(parseISO(s.date)));
  const pastSessions = allSessions.filter((s) => isPast(parseISO(s.date)));

  /**
   * Handle invite students
   */
  const handleInviteStudents = (session: AdvisoryDateInfo) => {
    setSelectedSession(session);
    setInviteModalOpen(true);
  };

  /**
   * Handle register attendance
   */
  const handleRegisterAttendance = (session: AdvisoryDateInfo) => {
    setSelectedSession(session);
    setAttendanceView(true);
  };

  /**
   * Handle complete session
   */
  const handleCompleteSession = (session: AdvisoryDateInfo) => {
    setSelectedSession(session);
    setCompletionModalOpen(true);
  };

  if (isLoading) {
    return (
      <Layout title="Gestionar Sesiones">
        <Box sx={{ maxWidth: 1400, mx: 'auto', width: '100%' }}>
          <LoadingSpinner message="Cargando sesiones..." />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Gestionar Sesiones">
        <Box sx={{ maxWidth: 1400, mx: 'auto', width: '100%' }}>
          <Alert severity="error">
            Error al cargar las sesiones. Por favor, intente de nuevo.
          </Alert>
        </Box>
      </Layout>
    );
  }

  // If viewing attendance form
  if (attendanceView && selectedSession) {
    return (
      <Layout title="Registro de Asistencia">
        <Box sx={{ maxWidth: 1400, mx: 'auto', width: '100%' }}>
          <AttendanceViewWrapper
            sessionId={selectedSession.advisory_date_id}
            onBack={() => {
              setAttendanceView(false);
              setSelectedSession(null);
            }}
          />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Gestionar Sesiones">
      <Box sx={{ maxWidth: 1400, mx: 'auto', width: '100%' }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Gestionar Sesiones
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Administra tus sesiones de asesoría, invita estudiantes y registra asistencia.
          </Typography>
        </Box>

        {/* Main Content Card */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            {/* Statistics */}
            <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
              <Chip
                icon={<EventIcon />}
                label={`Próximas: ${upcomingSessions.length}`}
                color="primary"
                variant="outlined"
              />
              <Chip
                icon={<EventIcon />}
                label={`Pasadas: ${pastSessions.length}`}
                color="default"
                variant="outlined"
              />
            </Stack>

            {/* Upcoming Sessions */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Sesiones Próximas
              </Typography>
              {upcomingSessions.length === 0 ? (
                <Alert severity="info">No tienes sesiones próximas programadas.</Alert>
              ) : (
                <Stack spacing={2}>
                  {upcomingSessions.map((session) => (
                    <SessionCard
                      key={session.advisory_date_id}
                      session={session}
                      onInviteStudents={() => handleInviteStudents(session)}
                      onRegisterAttendance={() => handleRegisterAttendance(session)}
                      onCompleteSession={() => handleCompleteSession(session)}
                      onViewDetails={() => setDetailsSessionId(session.advisory_date_id)}
                      isUpcoming
                    />
                  ))}
                </Stack>
              )}
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Past Sessions */}
            <Box>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Sesiones Pasadas
              </Typography>
              {pastSessions.length === 0 ? (
                <Alert severity="info">No tienes sesiones pasadas registradas.</Alert>
              ) : (
                <Stack spacing={2}>
                  {pastSessions.slice(0, 5).map((session) => (
                    <SessionCard
                      key={session.advisory_date_id}
                      session={session}
                      onInviteStudents={() => handleInviteStudents(session)}
                      onRegisterAttendance={() => handleRegisterAttendance(session)}
                      onCompleteSession={() => handleCompleteSession(session)}
                      onViewDetails={() => setDetailsSessionId(session.advisory_date_id)}
                      isUpcoming={false}
                    />
                  ))}
                </Stack>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Modals */}
        {selectedSession && (
          <>
            <InviteStudentsModal
              open={inviteModalOpen}
              onClose={() => {
                setInviteModalOpen(false);
                setSelectedSession(null);
              }}
              sessionId={selectedSession.advisory_date_id}
              sessionTopic={selectedSession.topic}
            />

            <SessionCompletionModal
              open={completionModalOpen}
              onClose={() => {
                setCompletionModalOpen(false);
                setSelectedSession(null);
              }}
              sessionId={selectedSession.advisory_date_id}
              sessionTopic={selectedSession.topic}
            />
          </>
        )}

        <SessionDetailsDialog
          open={detailsSessionId !== null}
          onClose={() => setDetailsSessionId(null)}
          isLoading={isLoadingSessionDetails}
          error={sessionDetailsError as Error | null}
          details={sessionDetails}
        />
      </Box>
    </Layout>
  );
}

/**
 * Session Card Component
 */
interface SessionCardProps {
  session: AdvisoryDateInfo;
  onInviteStudents: () => void;
  onRegisterAttendance: () => void;
  onCompleteSession: () => void;
  onViewDetails: () => void;
  isUpcoming: boolean;
}

function SessionCard({
  session,
  onInviteStudents,
  onRegisterAttendance,
  onCompleteSession,
  onViewDetails,
  isUpcoming,
}: SessionCardProps) {
  const sessionDate = parseISO(session.date);

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {session.topic}
            </Typography>
            
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EventIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  {format(sessionDate, "EEEE d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                </Typography>
              </Box>

              {session.venue && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {session.venue.name}
                    {session.venue.building && ` - ${session.venue.building}`}
                    {session.venue.floor && ` (${session.venue.floor})`}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  Estudiantes inscritos
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Chip
            label={isUpcoming ? 'Próxima' : 'Pasada'}
            color={isUpcoming ? 'success' : 'default'}
            size="small"
          />
        </Box>

        {session.notes && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              {session.notes}
            </Typography>
          </>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Actions */}
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Tooltip title="Invitar estudiantes">
            <IconButton size="small" color="primary" onClick={onInviteStudents}>
              <InviteIcon />
            </IconButton>
          </Tooltip>

          {isUpcoming && (
            <>
              <Tooltip title="Registrar asistencia">
                <IconButton size="small" color="info" onClick={onRegisterAttendance}>
                  <AttendanceIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Completar sesión">
                <IconButton size="small" color="success" onClick={onCompleteSession}>
                  <CompleteIcon />
                </IconButton>
              </Tooltip>
            </>
          )}

          <Tooltip title="Ver detalles">
            <IconButton size="small" onClick={onViewDetails}>
              <ViewIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  );
}

interface SessionDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  isLoading: boolean;
  error: Error | null;
  details?: FullSessionDetailsDto;
}

function SessionDetailsDialog({ open, onClose, isLoading, error, details }: SessionDetailsDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Detalle de sesión</DialogTitle>
      <DialogContent dividers>
        {isLoading && <LoadingSpinner message="Cargando detalle de sesión..." />}
        {!isLoading && error && (
          <Alert severity="error">No se pudo cargar el detalle completo de la sesión.</Alert>
        )}
        {!isLoading && !error && !details && (
          <Alert severity="info">No hay detalle de sesión disponible.</Alert>
        )}
        {!isLoading && !error && details && (
          <Stack spacing={1.5}>
            <Typography variant="h6" fontWeight="bold">{details.topic}</Typography>
            <Typography variant="body2" color="text.secondary">
              {format(parseISO(details.date), "EEEE d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
            </Typography>
            <Typography variant="body2">Materia: {details.subject.subject_name}</Typography>
            <Typography variant="body2">
              Profesor: {details.professor.name} {details.professor.last_name}
            </Typography>
            <Typography variant="body2">
              Lugar: {details.venue.building} - {details.venue.classroom}
            </Typography>
            <Typography variant="body2">
              Estudiantes: {details.registered_students_count} registrados, {details.attended_count} asistieron
            </Typography>
            {details.notes && <Typography variant="body2">Notas: {details.notes}</Typography>}
            {details.session_link && <Typography variant="body2">Enlace: {details.session_link}</Typography>}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}

/**
 * Attendance View Wrapper Component
 * Fetches session students and renders attendance form
 */
interface AttendanceViewWrapperProps {
  sessionId: number;
  onBack: () => void;
}

function AttendanceViewWrapper({ sessionId, onBack }: AttendanceViewWrapperProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['session-students', sessionId],
    queryFn: () => getSessionStudents(sessionId),
  });

  if (isLoading) {
    return <LoadingSpinner message="Cargando estudiantes..." />;
  }

  if (error) {
    return (
      <Box>
        <Button variant="outlined" onClick={onBack} sx={{ mb: 3 }}>
          ← Volver
        </Button>
        <Alert severity="error">
          Error al cargar estudiantes. Por favor, intente de nuevo.
        </Alert>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box>
        <Button variant="outlined" onClick={onBack} sx={{ mb: 3 }}>
          ← Volver
        </Button>
        <Alert severity="info">No hay datos de la sesión disponibles.</Alert>
      </Box>
    );
  }

  // Map backend students to User type
  const students: User[] = data.students.map(s => ({
    user_id: s.user_id,
    username: s.username || s.email,
    email: s.email,
    name: s.name,
    last_name: s.last_name,
    role: 'student' as const,
    is_active: true,
    photo_url: s.photo_url || '',
    phone_number: s.phone_number || '',
    created_at: '',
    updated_at: '',
  }));

  return (
    <Box>
      <Button variant="outlined" onClick={onBack} sx={{ mb: 3 }}>
        ← Volver a Sesiones
      </Button>
      
      {/* Session Info Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            {data.session.topic}
          </Typography>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {format(parseISO(data.session.date), "EEEE d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {data.session.venue.building} - {data.session.venue.classroom}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {data.total_students} estudiantes inscritos
              </Typography>
            </Box>
          </Stack>
          
          {data.total_students > 0 && (
            <Box sx={{ mt: 2 }}>
              <Chip
                label={`Asistencia actual: ${data.attendance_rate.toFixed(1)}%`}
                color={data.attendance_rate >= 80 ? 'success' : data.attendance_rate >= 60 ? 'warning' : 'error'}
                size="small"
              />
              <Chip
                label={`${data.attended_count} presentes`}
                color="success"
                size="small"
                sx={{ ml: 1 }}
              />
              <Chip
                label={`${data.absent_count} ausentes`}
                color="default"
                size="small"
                sx={{ ml: 1 }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
      
      <AttendanceForm
        sessionId={sessionId}
        students={students}
        onSuccess={onBack}
      />
    </Box>
  );
}

export default ManageSessionsPage;
