/**
 * Subject Details Manager Component
 * School Advisories System
 * 
 * Admin management of professor-subject assignments
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import {
  getAllSubjectDetails,
  createSubjectDetail,
  deleteSubjectDetail,
  toggleSubjectDetailStatus,
  type CreateSubjectDetailDto,
} from '@/api/endpoints/subjectDetails';
import { getAllSubjects } from '@/api/endpoints/subjects';
import { getAllUsers } from '@/api/endpoints/users';

/**
 * Subject Details Manager Component
 */
export function SubjectDetailsManager() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateSubjectDetailDto>({
    subject_id: 0,
    professor_id: 0,
  });

  // Fetch assignments
  const { data: assignments = [], isLoading, refetch } = useQuery({
    queryKey: ['subject-details'],
    queryFn: getAllSubjectDetails,
  });

  // Fetch subjects for dropdown
  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: getAllSubjects,
  });

  // Fetch professors for dropdown
  const { data: allUsers = [] } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  });

  const professors = allUsers.filter((u) => u.role === 'professor');

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createSubjectDetail,
    onSuccess: () => {
      toast.success('Asignación creada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['subject-details'] });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      const message = apiError.response?.data?.message || 'Error al crear asignación';
      toast.error(message);
    },
  });

  // Toggle status mutation
  const toggleMutation = useMutation({
    mutationFn: toggleSubjectDetailStatus,
    onSuccess: () => {
      toast.success('Estado actualizado');
      queryClient.invalidateQueries({ queryKey: ['subject-details'] });
    },
    onError: () => {
      toast.error('Error al actualizar estado');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteSubjectDetail,
    onSuccess: () => {
      toast.success('Asignación eliminada');
      queryClient.invalidateQueries({ queryKey: ['subject-details'] });
    },
    onError: (error: Error) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      const message = apiError.response?.data?.message || 'Error al eliminar';
      toast.error(message);
    },
  });

  const handleOpenDialog = () => {
    setFormData({ subject_id: 0, professor_id: 0 });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSubmit = () => {
    if (formData.subject_id === 0 || formData.professor_id === 0) {
      toast.error('Debe seleccionar materia y profesor');
      return;
    }
    createMutation.mutate(formData);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta asignación?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Asignaciones Profesor-Materia
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestiona las asignaciones de profesores a materias
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Tooltip title="Recargar">
            <IconButton onClick={() => refetch()} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Nueva Asignación
          </Button>
        </Stack>
      </Box>

      {/* Stats */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Chip
          label={`Total: ${assignments.length}`}
          color="primary"
          variant="outlined"
        />
        <Chip
          label={`Activas: ${assignments.filter((a) => a.is_active).length}`}
          color="success"
          variant="outlined"
        />
        <Chip
          label={`Inactivas: ${assignments.filter((a) => !a.is_active).length}`}
          color="default"
          variant="outlined"
        />
      </Stack>

      {/* Table */}
      {assignments.length === 0 ? (
        <Alert severity="info">
          No hay asignaciones registradas. Crea una nueva para comenzar.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Materia</strong></TableCell>
                <TableCell><strong>Profesor</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Estado</strong></TableCell>
                <TableCell align="right"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.subject_detail_id}>
                  <TableCell>{assignment.subject_detail_id}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {assignment.subject.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {assignment.subject.code}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {assignment.professor.name} {assignment.professor.last_name}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {assignment.professor.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={assignment.is_active ? 'Activo' : 'Inactivo'}
                      color={assignment.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={assignment.is_active ? 'Desactivar' : 'Activar'}>
                      <IconButton
                        size="small"
                        onClick={() => toggleMutation.mutate(assignment.subject_detail_id)}
                        color={assignment.is_active ? 'warning' : 'success'}
                      >
                        {assignment.is_active ? <ToggleOffIcon /> : <ToggleOnIcon />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(assignment.subject_detail_id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Nueva Asignación Profesor-Materia</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              label="Materia"
              value={formData.subject_id}
              onChange={(e) =>
                setFormData({ ...formData, subject_id: Number(e.target.value) })
              }
              fullWidth
              required
            >
              <MenuItem value={0}>Seleccione una materia</MenuItem>
              {subjects.map((subject) => (
                <MenuItem key={subject.subject_id} value={subject.subject_id}>
                  {subject.subject}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Profesor"
              value={formData.professor_id}
              onChange={(e) =>
                setFormData({ ...formData, professor_id: Number(e.target.value) })
              }
              fullWidth
              required
            >
              <MenuItem value={0}>Seleccione un profesor</MenuItem>
              {professors.map((prof) => (
                <MenuItem key={prof.user_id} value={prof.user_id}>
                  {prof.name} {prof.last_name} - {prof.email}
                </MenuItem>
              ))}
            </TextField>

            <Alert severity="info">
              Esta asignación permitirá al profesor crear asesorías para la materia seleccionada.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={createMutation.isPending}
            startIcon={
              createMutation.isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <AddIcon />
              )
            }
          >
            {createMutation.isPending ? 'Creando...' : 'Crear Asignación'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SubjectDetailsManager;
