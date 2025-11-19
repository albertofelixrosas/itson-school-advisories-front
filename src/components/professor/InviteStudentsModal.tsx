/**
 * Invite Students Modal Component
 * School Advisories System
 * 
 * Modal for professors to invite students to an advisory session
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Alert,
  Chip,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Send as SendIcon,
  Person as PersonIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { getAllStudents } from '@/api/endpoints/users';
import { apiClient } from '@/api/client';
import type { User } from '@/types';

/**
 * Component Props
 */
interface InviteStudentsModalProps {
  /** Whether modal is open */
  open: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Advisory date session ID to invite students to */
  sessionId: number;
  /** Session topic for display */
  sessionTopic?: string;
  /** Already enrolled students IDs */
  enrolledStudentIds?: number[];
}

/**
 * Invite Students Modal Component
 */
export function InviteStudentsModal({
  open,
  onClose,
  sessionId,
  sessionTopic,
  enrolledStudentIds = [],
}: InviteStudentsModalProps) {
  const queryClient = useQueryClient();
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [invitationMessage, setInvitationMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all students
  const { data: students = [], isLoading } = useQuery<User[]>({
    queryKey: ['students'],
    queryFn: getAllStudents,
    enabled: open,
  });

  // Invite students mutation
  const inviteMutation = useMutation({
    mutationFn: async (data: { student_ids: number[]; invitation_message?: string }) => {
      const response = await apiClient.post(
        `/advisories/sessions/${sessionId}/invite`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Invitaciones enviadas exitosamente');
      queryClient.invalidateQueries({ queryKey: ['my-advisories'] });
      queryClient.invalidateQueries({ queryKey: ['professor-dashboard'] });
      handleClose();
    },
    onError: (error: Error) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      const errorMessage = apiError.response?.data?.message || 'Error al enviar invitaciones';
      toast.error(errorMessage);
    },
  });

  /**
   * Filter students
   */
  const filteredStudents = students.filter((student: User) => {
    // Exclude already enrolled students
    if (enrolledStudentIds.includes(student.user_id)) {
      return false;
    }
    
    // Apply search filter
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      student.last_name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query)
    );
  });

  /**
   * Toggle student selection
   */
  const handleToggleStudent = (studentId: number) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  /**
   * Select all filtered students
   */
  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s: User) => s.user_id));
    }
  };

  /**
   * Handle send invitations
   */
  const handleSendInvitations = () => {
    if (selectedStudents.length === 0) {
      toast.error('Debe seleccionar al menos un estudiante');
      return;
    }

    inviteMutation.mutate({
      student_ids: selectedStudents,
      invitation_message: invitationMessage || undefined,
    });
  };

  /**
   * Handle close and reset
   */
  const handleClose = () => {
    setSelectedStudents([]);
    setInvitationMessage('');
    setSearchQuery('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Invitar Estudiantes
          </Typography>
          {sessionTopic && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Sesión: {sessionTopic}
            </Typography>
          )}
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Buscar estudiante por nombre o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Box>

        {/* Select All */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={
                  filteredStudents.length > 0 &&
                  selectedStudents.length === filteredStudents.length
                }
                indeterminate={
                  selectedStudents.length > 0 &&
                  selectedStudents.length < filteredStudents.length
                }
                onChange={handleSelectAll}
              />
            }
            label="Seleccionar todos"
          />
          <Chip
            label={`${selectedStudents.length} seleccionados`}
            color={selectedStudents.length > 0 ? 'primary' : 'default'}
            size="small"
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Students List */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredStudents.length === 0 ? (
          <Alert severity="info">
            {searchQuery
              ? 'No se encontraron estudiantes con ese criterio de búsqueda'
              : 'No hay estudiantes disponibles para invitar'}
          </Alert>
        ) : (
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {filteredStudents.map((student: User) => (
              <ListItem
                key={student.user_id}
                onClick={() => handleToggleStudent(student.user_id)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={selectedStudents.includes(student.user_id)}
                    edge="start"
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemIcon>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={`${student.name} ${student.last_name}`}
                  secondary={student.email}
                />
              </ListItem>
            ))}
          </List>
        )}

        {/* Invitation Message */}
        <Box sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Mensaje de Invitación (Opcional)"
            placeholder="Escribe un mensaje personalizado para los estudiantes..."
            multiline
            rows={3}
            value={invitationMessage}
            onChange={(e) => setInvitationMessage(e.target.value)}
            helperText={`${invitationMessage.length}/500 caracteres`}
            inputProps={{ maxLength: 500 }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={inviteMutation.isPending}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          startIcon={
            inviteMutation.isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SendIcon />
            )
          }
          onClick={handleSendInvitations}
          disabled={selectedStudents.length === 0 || inviteMutation.isPending}
        >
          {inviteMutation.isPending
            ? 'Enviando...'
            : `Enviar Invitaciones (${selectedStudents.length})`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default InviteStudentsModal;
