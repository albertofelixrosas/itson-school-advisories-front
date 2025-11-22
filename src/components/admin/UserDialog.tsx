/**
 * Create/Edit User Dialog Component
 * School Advisories System
 * 
 * Dialog form for creating or editing users (Admin)
 */

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createUser, updateUser } from '@/api/endpoints/users';
import type { User, CreateUserDto, UpdateUserDto, UserRole } from '@/api/types';

/**
 * Form Data Interface
 */
interface UserFormData {
  username: string;
  email: string;
  password: string;
  name: string;
  last_name: string;
  phone_number: string;
  school_id: string;
  student_id: string;
  employee_id: string;
  role: UserRole;
  photo_url: string;
}

/**
 * Validation Schema (Create)
 */
const createValidationSchema = yup.object().shape({
  username: yup
    .string()
    .required('El nombre de usuario es requerido')
    .min(3, 'Mínimo 3 caracteres')
    .max(50, 'Máximo 50 caracteres'),
  email: yup
    .string()
    .required('El email es requerido')
    .email('Email inválido'),
  password: yup
    .string()
    .required('La contraseña es requerida')
    .min(6, 'Mínimo 6 caracteres'),
  name: yup
    .string()
    .required('El nombre es requerido')
    .max(100, 'Máximo 100 caracteres'),
  last_name: yup
    .string()
    .required('El apellido es requerido')
    .max(100, 'Máximo 100 caracteres'),
  phone_number: yup
    .string()
    .required('El teléfono es requerido')
    .matches(/^\d{10}$/, 'Debe ser un número de 10 dígitos'),
  school_id: yup.string().optional(),
  student_id: yup.string().optional(),
  employee_id: yup.string().optional(),
  role: yup
    .string()
    .required('El rol es requerido')
    .oneOf(['admin', 'professor', 'student'], 'Rol inválido'),
  photo_url: yup.string().url('URL inválida').optional(),
});

/**
 * Validation Schema (Edit)
 */
const editValidationSchema = yup.object().shape({
  username: yup
    .string()
    .required('El nombre de usuario es requerido')
    .min(3, 'Mínimo 3 caracteres')
    .max(50, 'Máximo 50 caracteres'),
  email: yup
    .string()
    .required('El email es requerido')
    .email('Email inválido'),
  password: yup
    .string()
    .optional()
    .min(6, 'Mínimo 6 caracteres'),
  name: yup
    .string()
    .required('El nombre es requerido')
    .max(100, 'Máximo 100 caracteres'),
  last_name: yup
    .string()
    .required('El apellido es requerido')
    .max(100, 'Máximo 100 caracteres'),
  phone_number: yup
    .string()
    .required('El teléfono es requerido')
    .matches(/^\d{10}$/, 'Debe ser un número de 10 dígitos'),
  school_id: yup.string().optional(),
  student_id: yup.string().optional(),
  employee_id: yup.string().optional(),
  role: yup
    .string()
    .required('El rol es requerido')
    .oneOf(['admin', 'professor', 'student'], 'Rol inválido'),
  photo_url: yup.string().url('URL inválida').optional(),
});

/**
 * Component Props
 */
interface UserDialogProps {
  /** Dialog open state */
  open: boolean;
  /** User to edit (null for create mode) */
  user?: User | null;
  /** Callback when dialog closes */
  onClose: () => void;
}

/**
 * Create/Edit User Dialog Component
 */
export function UserDialog({ open, user, onClose }: UserDialogProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!user;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserFormData>({
    // @ts-expect-error - Yup resolver type mismatch with conditional schema
    resolver: yupResolver(isEditMode ? editValidationSchema : createValidationSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      name: '',
      last_name: '',
      phone_number: '',
      school_id: '',
      student_id: '',
      employee_id: '',
      role: 'student',
      photo_url: '',
    },
  });

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email,
        password: '',
        name: user.name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        school_id: user.school_id || '',
        student_id: user.student_id || '',
        employee_id: user.employee_id || '',
        role: user.role,
        photo_url: user.photo_url || '',
      });
    } else {
      reset({
        username: '',
        email: '',
        password: '',
        name: '',
        last_name: '',
        phone_number: '',
        school_id: '',
        student_id: '',
        employee_id: '',
        role: 'student',
        photo_url: '',
      });
    }
  }, [user, reset]);

  // Create user mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateUserDto) => createUser(data),
    onSuccess: () => {
      toast.success('Usuario creado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      onClose();
    },
    onError: (error: Error) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      const errorMessage = apiError.response?.data?.message || 'Error al crear usuario';
      toast.error(errorMessage);
    },
  });

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: (data: { userId: number; updateData: UpdateUserDto }) =>
      updateUser(data.userId, data.updateData),
    onSuccess: () => {
      toast.success('Usuario actualizado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      onClose();
    },
    onError: (error: Error) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      const errorMessage = apiError.response?.data?.message || 'Error al actualizar usuario';
      toast.error(errorMessage);
    },
  });

  /**
   * Form submit handler
   */
  const onSubmit = (data: UserFormData) => {
    if (isEditMode && user) {
      // Edit mode
      const updateData: UpdateUserDto = {
        username: data.username,
        email: data.email,
        name: data.name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        school_id: data.school_id || undefined,
        student_id: data.student_id || undefined,
        employee_id: data.employee_id || undefined,
        role: data.role,
        photo_url: data.photo_url || undefined,
      };

      // Only include password if provided
      if (data.password) {
        (updateData as CreateUserDto).password = data.password;
      }

      updateMutation.mutate({ userId: user.user_id, updateData });
    } else {
      // Create mode
      const createData: CreateUserDto = {
        username: data.username,
        email: data.email,
        password: data.password,
        name: data.name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        school_id: data.school_id || undefined,
        student_id: data.student_id || undefined,
        employee_id: data.employee_id || undefined,
        role: data.role,
        photo_url: data.photo_url || undefined,
      };

      createMutation.mutate(createData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth fullScreen={isMobile}>
      {/* @ts-expect-error - Yup resolver type mismatch with conditional schema */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>
          {isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ display: 'grid', gap: 3, pt: 1 }}>
          {/* Basic Info */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nombre"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isSubmitting}
                  required
                />
              )}
            />

            <Controller
              name="last_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Apellido"
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message}
                  disabled={isSubmitting}
                  required
                />
              )}
            />
          </Box>

          {/* Account Info */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nombre de Usuario"
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  disabled={isSubmitting}
                  required
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isSubmitting}
                  required
                />
              )}
            />
          </Box>

          {/* Password */}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Contraseña"
                type="password"
                error={!!errors.password}
                helperText={
                  isEditMode
                    ? 'Dejar en blanco para mantener la contraseña actual'
                    : errors.password?.message
                }
                disabled={isSubmitting}
                required={!isEditMode}
              />
            )}
          />

          {/* Contact */}
          <Controller
            name="phone_number"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Teléfono"
                placeholder="6441234567"
                error={!!errors.phone_number}
                helperText={errors.phone_number?.message}
                disabled={isSubmitting}
                required
              />
            )}
          />

          {/* Role */}
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.role}>
                <InputLabel>Rol *</InputLabel>
                <Select {...field} label="Rol *" disabled={isSubmitting}>
                  <MenuItem value="student">Estudiante</MenuItem>
                  <MenuItem value="professor">Profesor</MenuItem>
                  <MenuItem value="admin">Administrador</MenuItem>
                </Select>
                {errors.role && <FormHelperText>{errors.role.message}</FormHelperText>}
              </FormControl>
            )}
          />

          {/* IDs */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
            <Controller
              name="school_id"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ID Escolar"
                  error={!!errors.school_id}
                  helperText={errors.school_id?.message}
                  disabled={isSubmitting}
                />
              )}
            />

            <Controller
              name="student_id"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ID Estudiante"
                  error={!!errors.student_id}
                  helperText={errors.student_id?.message}
                  disabled={isSubmitting}
                />
              )}
            />

            <Controller
              name="employee_id"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ID Empleado"
                  error={!!errors.employee_id}
                  helperText={errors.employee_id?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </Box>

          {/* Photo URL */}
          <Controller
            name="photo_url"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="URL de Foto"
                placeholder="https://example.com/photo.jpg"
                error={!!errors.photo_url}
                helperText={errors.photo_url?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          type="submit"
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
            : isEditMode
            ? 'Actualizar'
            : 'Crear'}
        </Button>
      </DialogActions>
      </Box>
    </Dialog>
  );
}
