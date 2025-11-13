/**
 * Sessions Calendar Component
 * School Advisories System
 * 
 * Displays student's upcoming and past advisory sessions
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
  Tabs,
  Tab,
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO, isPast, isFuture } from 'date-fns';
import { es } from 'date-fns/locale';
import { getMySessions } from '@/api/endpoints/advisories';
import { LoadingSpinner } from '@/components/common';
import type { AdvisoryDate } from '@/api/types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`sessions-tabpanel-${index}`}
      aria-labelledby={`sessions-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * Sessions Calendar Component
 */
export function SessionsCalendar() {
  const [selectedSession, setSelectedSession] = useState<AdvisoryDate | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Fetch sessions
  const { data: sessions = [], isLoading, error } = useQuery({
    queryKey: ['my-sessions'],
    queryFn: getMySessions,
  });

  /**
   * Handle view details
   */
  const handleViewDetails = (session: AdvisoryDate) => {
    setSelectedSession(session);
    setDetailsOpen(true);
  };

  /**
   * Handle tab change
   */
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando sesiones..." />;
  }

  if (error) {
    return (
      <Alert severity="error">
        Error al cargar las sesiones. Por favor, intente de nuevo.
      </Alert>
    );
  }

  // Filter sessions
  const upcomingSessions = sessions.filter((session) => isFuture(parseISO(session.date)));
  const pastSessions = sessions.filter((session) => isPast(parseISO(session.date)));

  if (sessions.length === 0) {
    return (
      <Alert severity="info">
        No tienes sesiones programadas. Las invitaciones que aceptes aparecerán aquí.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={`Próximas (${upcomingSessions.length})`} />
          <Tab label={`Pasadas (${pastSessions.length})`} />
        </Tabs>
      </Box>

      {/* Upcoming Sessions */}
      <TabPanel value={tabValue} index={0}>
        {upcomingSessions.length === 0 ? (
          <Alert severity="info">
            No tienes sesiones próximas programadas.
          </Alert>
        ) : (
          <Stack spacing={2}>
            {upcomingSessions.map((session) => (
              <SessionCard 
                key={session.advisory_date_id} 
                session={session} 
                onViewDetails={handleViewDetails}
              />
            ))}
          </Stack>
        )}
      </TabPanel>

      {/* Past Sessions */}
      <TabPanel value={tabValue} index={1}>
        {pastSessions.length === 0 ? (
          <Alert severity="info">
            No tienes sesiones pasadas registradas.
          </Alert>
        ) : (
          <Stack spacing={2}>
            {pastSessions.map((session) => (
              <SessionCard 
                key={session.advisory_date_id} 
                session={session} 
                onViewDetails={handleViewDetails}
              />
            ))}
          </Stack>
        )}
      </TabPanel>

      {/* Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedSession && (
          <>
            <DialogTitle>
              Detalles de la Sesión
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Tema
                  </Typography>
                  <Typography variant="h6">
                    {selectedSession.topic}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Fecha y hora
                  </Typography>
                  <Typography variant="body1">
                    {format(parseISO(selectedSession.date), "EEEE, d 'de' MMMM, yyyy", { locale: es })}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Ubicación
                  </Typography>
                  <Typography variant="body1">
                    {selectedSession.venue?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedSession.venue?.location}
                  </Typography>
                </Box>

                {selectedSession.notes && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Notas
                    </Typography>
                    <Typography variant="body2">
                      {selectedSession.notes}
                    </Typography>
                  </Box>
                )}

                {selectedSession.session_link && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Enlace de sesión
                    </Typography>
                    <Typography 
                      variant="body2" 
                      component="a" 
                      href={selectedSession.session_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        color: 'primary.main', 
                        textDecoration: 'none', 
                        '&:hover': { textDecoration: 'underline' },
                        display: 'block',
                        wordBreak: 'break-all'
                      }}
                    >
                      {selectedSession.session_link}
                    </Typography>
                  </Box>
                )}

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Estado
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={selectedSession.status || 'Programada'}
                      color={isPast(parseISO(selectedSession.date)) ? 'default' : 'success'}
                      size="small"
                    />
                  </Box>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions>
              {selectedSession.session_link && (
                <Button
                  href={selectedSession.session_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<LinkIcon />}
                >
                  Abrir Enlace
                </Button>
              )}
              <Button onClick={() => setDetailsOpen(false)}>
                Cerrar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

/**
 * Session Card Component
 */
interface SessionCardProps {
  session: AdvisoryDate;
  onViewDetails: (session: AdvisoryDate) => void;
}

function SessionCard({ session, onViewDetails }: SessionCardProps) {
  const sessionDate = parseISO(session.date);
  const isUpcoming = isFuture(sessionDate);

  return (
    <Card variant="outlined" sx={{ opacity: isUpcoming ? 1 : 0.7 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              {session.topic}
            </Typography>
            
            <Stack spacing={1} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EventIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {format(sessionDate, "EEEE, d 'de' MMMM, yyyy", { locale: es })}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {session.venue?.name} - {session.venue?.location}
                </Typography>
              </Box>

              {session.advisory?.subject_detail && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SchoolIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {session.advisory.subject_detail.subject.subject}
                  </Typography>
                </Box>
              )}

              {session.advisory?.professor && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Prof. {session.advisory.professor.name} {session.advisory.professor.last_name}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>
          
          <Chip
            label={isUpcoming ? 'Próxima' : 'Pasada'}
            color={isUpcoming ? 'success' : 'default'}
            size="small"
          />
        </Box>

        {session.session_link && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="caption">
              Esta sesión tiene un enlace virtual disponible
            </Typography>
          </Alert>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button
            size="small"
            onClick={() => onViewDetails(session)}
          >
            Ver Detalles
          </Button>
          {session.session_link && isUpcoming && (
            <Button
              size="small"
              variant="contained"
              href={session.session_link}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<LinkIcon />}
            >
              Unirse
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
