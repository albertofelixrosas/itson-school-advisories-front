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
import { getMyAdvisories } from '@/api/endpoints/advisories';
import { getSessionStudents } from '@/api/endpoints/attendance';
import { InviteStudentsModal } from '@/components/professor/InviteStudentsModal';
import { AttendanceForm } from '@/components/professor/AttendanceForm';
import { SessionCompletionModal } from '@/components/professor/SessionCompletionModal';
import type { Advisory, AdvisoryDate, User } from '@/types';

/**
 * Manage Sessions Page
 */
export function ManageSessionsPage() {
  const [selectedSession, setSelectedSession] = useState<AdvisoryDate | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [attendanceView, setAttendanceView] = useState(false);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);

  // Fetch professor's advisories
  const { data: advisories = [], isLoading, error } = useQuery({
    queryKey: ['my-advisories'],
    queryFn: getMyAdvisories,
  });

  /**
   * Get all sessions from advisories
   */
  const getAllSessions = (): AdvisoryDate[] => {
    const sessions: AdvisoryDate[] = [];
    advisories.forEach((advisory: Advisory) => {
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
  const handleInviteStudents = (session: AdvisoryDate) => {
    setSelectedSession(session);
    setInviteModalOpen(true);
  };

  /**
   * Handle register attendance
   */
  const handleRegisterAttendance = (session: AdvisoryDate) => {
    setSelectedSession(session);
    setAttendanceView(true);
  };

  /**
   * Handle complete session
   */
  const handleCompleteSession = (session: AdvisoryDate) => {
    setSelectedSession(session);
    setCompletionModalOpen(true);
  };

  if (isLoading) {
    return (
      <Layout title="Gestionar Sesiones">
        <LoadingSpinner message="Cargando sesiones..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Gestionar Sesiones">
        <Alert severity="error">
          Error al cargar las sesiones. Por favor, intente de nuevo.
        </Alert>
      </Layout>
    );
  }

  // If viewing attendance form
  if (attendanceView && selectedSession) {
    return (
      <Layout title="Registro de Asistencia">
        <AttendanceViewWrapper
          sessionId={selectedSession.advisory_date_id}
          onBack={() => {
            setAttendanceView(false);
            setSelectedSession(null);
          }}
        />
      </Layout>
    );
  }

  return (
    <Layout title="Gestionar Sesiones">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Gestionar Sesiones
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Administra tus sesiones de asesoría, invita estudiantes y registra asistencia.
          </Typography>
        </Box>

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
                  isUpcoming
                />
              ))}
            </Stack>
          )}
        </Box>

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
                  isUpcoming={false}
                />
              ))}
            </Stack>
          )}
        </Box>

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
      </Box>
    </Layout>
  );
}

/**
 * Session Card Component
 */
interface SessionCardProps {
  session: AdvisoryDate;
  onInviteStudents: () => void;
  onRegisterAttendance: () => void;
  onCompleteSession: () => void;
  isUpcoming: boolean;
}

function SessionCard({
  session,
  onInviteStudents,
  onRegisterAttendance,
  onCompleteSession,
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
                    {session.venue.name} - {session.venue.location}
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
            <IconButton size="small">
              <ViewIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
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
    username: s.student_id,
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
