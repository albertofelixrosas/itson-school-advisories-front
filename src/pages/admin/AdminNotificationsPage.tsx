import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { Layout } from '@/components/common';
import {
  createNotificationTemplate,
  deleteNotificationTemplate,
  getNotificationHistory,
  getNotificationPreferences,
  getNotificationTemplates,
  toggleNotificationTemplate,
  updateNotificationPreferences,
} from '@/api/endpoints/notifications';
import type {
  CreateEmailTemplateDto,
  NotificationLogs,
  PaginatedResponse,
  UpdateNotificationPreferencesDto,
} from '@/api/types';

const emptyTemplateForm: CreateEmailTemplateDto = {
  template_name: '',
  subject_template: '',
  html_template: '',
  text_template: '',
  template_variables: '',
};

export default function AdminNotificationsPage() {
  const queryClient = useQueryClient();
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState<CreateEmailTemplateDto>(emptyTemplateForm);

  const { data: preferences, isLoading: isLoadingPreferences } = useQuery({
    queryKey: ['notifications', 'preferences'],
    queryFn: getNotificationPreferences,
  });

  const { data: historyData, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['notifications', 'history', 'admin'],
    queryFn: () => getNotificationHistory(1, 20),
  });

  const { data: templates = [], isLoading: isLoadingTemplates, refetch: refetchTemplates } = useQuery({
    queryKey: ['notifications', 'templates'],
    queryFn: getNotificationTemplates,
  });

  const history = useMemo(() => {
    if (!historyData) return [] as NotificationLogs[];
    if (Array.isArray(historyData)) return historyData;
    return (historyData as PaginatedResponse<NotificationLogs>).items ?? [];
  }, [historyData]);

  const updatePreferencesMutation = useMutation({
    mutationFn: (payload: UpdateNotificationPreferencesDto) => updateNotificationPreferences(payload),
    onSuccess: () => {
      toast.success('Preferencias actualizadas');
      queryClient.invalidateQueries({ queryKey: ['notifications', 'preferences'] });
    },
  });

  const toggleTemplateMutation = useMutation({
    mutationFn: (key: string) => toggleNotificationTemplate(key),
    onSuccess: () => {
      toast.success('Estado de plantilla actualizado');
      queryClient.invalidateQueries({ queryKey: ['notifications', 'templates'] });
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: (key: string) => deleteNotificationTemplate(key),
    onSuccess: () => {
      toast.success('Plantilla eliminada');
      queryClient.invalidateQueries({ queryKey: ['notifications', 'templates'] });
    },
  });

  const createTemplateMutation = useMutation({
    mutationFn: (payload: CreateEmailTemplateDto) => createNotificationTemplate(payload),
    onSuccess: () => {
      toast.success('Plantilla creada');
      setTemplateDialogOpen(false);
      setNewTemplate(emptyTemplateForm);
      queryClient.invalidateQueries({ queryKey: ['notifications', 'templates'] });
    },
  });

  const updatePreference = (key: keyof UpdateNotificationPreferencesDto, value: boolean) => {
    updatePreferencesMutation.mutate({ [key]: value });
  };

  const getTemplateKey = (templateName: string) => templateName.toLowerCase().replace(/\s+/g, '_');

  return (
    <Layout title="Notificaciones">
      <Box sx={{ maxWidth: 1400, mx: 'auto', width: '100%' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Notificaciones
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona preferencias, historial y plantillas de notificaciones del sistema.
          </Typography>
        </Box>

        <Stack spacing={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Preferencias de notificación
              </Typography>
              {isLoadingPreferences && <CircularProgress size={24} />}
              {!isLoadingPreferences && !preferences && (
                <Alert severity="info">No hay preferencias disponibles.</Alert>
              )}
              {!isLoadingPreferences && preferences && (
                <Stack spacing={1}>
                  <PreferenceRow
                    label="Correo habilitado"
                    checked={preferences.email_enabled}
                    onChange={(value) => updatePreference('email_enabled', value)}
                  />
                  <PreferenceRow
                    label="Recordatorio 24 horas"
                    checked={preferences.reminder_24h}
                    onChange={(value) => updatePreference('reminder_24h', value)}
                  />
                  <PreferenceRow
                    label="Recordatorio 1 hora"
                    checked={preferences.reminder_1h}
                    onChange={(value) => updatePreference('reminder_1h', value)}
                  />
                  <PreferenceRow
                    label="Actualizaciones de sesión"
                    checked={preferences.session_updates}
                    onChange={(value) => updatePreference('session_updates', value)}
                  />
                  <PreferenceRow
                    label="Notificaciones de invitación"
                    checked={preferences.invitation_notifications}
                    onChange={(value) => updatePreference('invitation_notifications', value)}
                  />
                  <PreferenceRow
                    label="Actualizaciones de solicitud"
                    checked={preferences.request_updates}
                    onChange={(value) => updatePreference('request_updates', value)}
                  />
                </Stack>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Historial de notificaciones
                </Typography>
              </Box>

              {isLoadingHistory && <CircularProgress size={24} />}
              {!isLoadingHistory && history.length === 0 && (
                <Alert severity="info">No hay historial de notificaciones.</Alert>
              )}
              {!isLoadingHistory && history.length > 0 && (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Destinatario</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Asunto</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {history.map((log) => (
                        <TableRow key={log.log_id}>
                          <TableCell>{log.notification_type}</TableCell>
                          <TableCell>{log.recipient_email}</TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={log.status}
                              color={log.status === 'SENT' ? 'success' : log.status === 'FAILED' ? 'error' : 'warning'}
                            />
                          </TableCell>
                          <TableCell>{log.subject}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Plantillas
                </Typography>
                <Stack direction="row" spacing={1}>
                  <IconButton onClick={() => refetchTemplates()}>
                    <RefreshIcon />
                  </IconButton>
                  <Button startIcon={<AddIcon />} variant="contained" onClick={() => setTemplateDialogOpen(true)}>
                    Nueva plantilla
                  </Button>
                </Stack>
              </Box>

              {isLoadingTemplates && <CircularProgress size={24} />}
              {!isLoadingTemplates && templates.length === 0 && (
                <Alert severity="info">No hay plantillas disponibles.</Alert>
              )}
              {!isLoadingTemplates && templates.length > 0 && (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Asunto</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell align="right">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {templates.map((template) => {
                        const key = getTemplateKey(template.template_name);
                        return (
                          <TableRow key={template.template_id}>
                            <TableCell>{template.template_name}</TableCell>
                            <TableCell>{template.subject_template}</TableCell>
                            <TableCell>
                              <Chip
                                size="small"
                                label={template.is_active ? 'Activa' : 'Inactiva'}
                                color={template.is_active ? 'success' : 'default'}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Switch
                                size="small"
                                checked={template.is_active}
                                onChange={() => toggleTemplateMutation.mutate(key)}
                              />
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => deleteTemplateMutation.mutate(key)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Stack>
      </Box>

      <Dialog open={templateDialogOpen} onClose={() => setTemplateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nueva plantilla</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Nombre"
              value={newTemplate.template_name}
              onChange={(e) => setNewTemplate((prev) => ({ ...prev, template_name: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Asunto"
              value={newTemplate.subject_template}
              onChange={(e) => setNewTemplate((prev) => ({ ...prev, subject_template: e.target.value }))}
              fullWidth
            />
            <TextField
              label="HTML"
              value={newTemplate.html_template}
              onChange={(e) => setNewTemplate((prev) => ({ ...prev, html_template: e.target.value }))}
              fullWidth
              multiline
              minRows={4}
            />
            <TextField
              label="Texto plano"
              value={newTemplate.text_template ?? ''}
              onChange={(e) => setNewTemplate((prev) => ({ ...prev, text_template: e.target.value }))}
              fullWidth
              multiline
              minRows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateDialogOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={() => createTemplateMutation.mutate(newTemplate)}
            disabled={!newTemplate.template_name || !newTemplate.subject_template || !newTemplate.html_template}
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

interface PreferenceRowProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function PreferenceRow({ label, checked, onChange }: PreferenceRowProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="body2">{label}</Typography>
      <Switch checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </Box>
  );
}
