/**
 * Subject Management Table Component
 * School Advisories System
 * 
 * Admin component for managing subjects
 */

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Alert,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import {
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from '@/api/endpoints/subjects';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import type { Subject, CreateSubjectDto, UpdateSubjectDto } from '@/api/types';

/**
 * Subject Form Data
 */
interface SubjectFormData {
  subject: string;
}

/**
 * Validation Schema
 */
const validationSchema = yup.object().shape({
  subject: yup
    .string()
    .required('El nombre de la materia es requerido')
    .min(3, 'Mínimo 3 caracteres')
    .max(100, 'Máximo 100 caracteres'),
});

/**
 * Subject Management Table Component
 */
export function SubjectManagementTable() {
  const queryClient = useQueryClient();
  const confirmDialog = useConfirmDialog();
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SubjectFormData>({
    resolver: yupResolver(validationSchema) as never,
    defaultValues: {
      subject: '',
    },
  });

  // Fetch all subjects
  const {
    data: subjects = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-subjects'],
    queryFn: getAllSubjects,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateSubjectDto) => createSubject(data),
    onSuccess: () => {
      toast.success('Materia creada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || 'Error al crear materia');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: { id: number; updateData: UpdateSubjectDto }) =>
      updateSubject(data.id, data.updateData),
    onSuccess: () => {
      toast.success('Materia actualizada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || 'Error al actualizar materia');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteSubject(id),
    onSuccess: () => {
      toast.success('Materia eliminada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
    onError: (error: Error) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || 'Error al eliminar materia');
    },
  });

  /**
   * Handle create button
   */
  const handleCreate = () => {
    setSelectedSubject(null);
    reset({ subject: '' });
    setDialogOpen(true);
  };

  /**
   * Handle edit button
   */
  const handleEdit = (subject: Subject) => {
    setSelectedSubject(subject);
    reset({ subject: subject.subject });
    setDialogOpen(true);
  };

  /**
   * Handle close dialog
   */
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSubject(null);
    reset({ subject: '' });
  };

  /**
   * Handle form submit
   */
  const onSubmit = (data: SubjectFormData) => {
    if (selectedSubject) {
      updateMutation.mutate({
        id: selectedSubject.subject_id,
        updateData: { subject: data.subject },
      });
    } else {
      createMutation.mutate({ subject: data.subject });
    }
  };

  /**
   * Handle delete
   */
  const handleDelete = (subject: Subject) => {
    confirmDialog.showDialog({
      title: 'Eliminar Materia',
      message: `¿Está seguro que desea eliminar la materia "${subject.subject}"?`,
      confirmText: 'Eliminar',
      severity: 'error',
      onConfirm: async () => {
        deleteMutation.mutate(subject.subject_id);
      },
    });
  };

  /**
   * Filter subjects
   */
  const filteredSubjects = subjects.filter((subject) =>
    subject.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Columns
   */
  const columns: GridColDef[] = [
    {
      field: 'subject_id',
      headerName: 'ID',
      width: 80,
    },
    {
      field: 'subject',
      headerName: 'Materia',
      flex: 1,
      minWidth: 300,
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleEdit(params.row as Subject)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row as Subject)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold">
          Gestión de Materias
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Crear Materia
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar materia..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al cargar materias. Por favor, intente de nuevo.
        </Alert>
      )}

      {/* Data Grid */}
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredSubjects}
          columns={columns}
          getRowId={(row) => row.subject_id}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
          disableRowSelectionOnClick
        />
      </Box>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedSubject ? 'Editar Materia' : 'Crear Nueva Materia'}
        </DialogTitle>
        <DialogContent dividers>
          <Controller
            name="subject"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Nombre de la Materia"
                placeholder="Ej: Cálculo Diferencial"
                error={!!errors.subject}
                helperText={errors.subject?.message}
                disabled={isSubmitting}
                required
                sx={{ mt: 1 }}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
            startIcon={
              isSubmitting || createMutation.isPending || updateMutation.isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : undefined
            }
          >
            {isSubmitting || createMutation.isPending || updateMutation.isPending
              ? 'Guardando...'
              : selectedSubject
              ? 'Actualizar'
              : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        loading={confirmDialog.loading}
        title={confirmDialog.config?.title || ''}
        message={confirmDialog.config?.message || ''}
        severity={confirmDialog.config?.severity}
        confirmText={confirmDialog.config?.confirmText}
        cancelText={confirmDialog.config?.cancelText}
        onConfirm={confirmDialog.handleConfirm}
        onCancel={confirmDialog.handleCancel}
      />
    </Paper>
  );
}
