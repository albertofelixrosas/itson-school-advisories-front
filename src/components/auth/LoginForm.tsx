/**
 * Login Form Component
 * School Advisories System
 * 
 * Login form with validation using React Hook Form + Yup
 */

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import type { LoginDto } from '@/api/types';

/**
 * Login form validation schema
 */
const loginSchema = yup.object({
  username: yup
    .string()
    .required('El correo electrónico es requerido')
    .email('Ingresa un correo electrónico válido')
    .trim()
    .lowercase(),
  password: yup
    .string()
    .required('La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
}).required();

/**
 * Login Form Props
 */
interface LoginFormProps {
  onSubmit: (data: LoginDto) => Promise<void>;
  error?: string | null;
  isLoading?: boolean;
}

/**
 * Login Form Component
 * 
 * @param onSubmit - Function to handle form submission
 * @param error - Error message to display
 * @param isLoading - Loading state
 */
export function LoginForm({ onSubmit, error, isLoading = false }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginDto>({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',
  });

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleFormSubmit = async (data: LoginDto) => {
    try {
      await onSubmit(data);
    } catch (err) {
      // Error is handled by parent component
      console.error('Login form error:', err);
    }
  };

  const isFormLoading = isLoading || isSubmitting;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Email Field */}
      <TextField
        {...register('username')}
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        autoFocus
        fullWidth
        disabled={isFormLoading}
        error={!!errors.username}
        helperText={errors.username?.message}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon color={errors.username ? 'error' : 'action'} />
            </InputAdornment>
          ),
        }}
      />

      {/* Password Field */}
      <TextField
        {...register('password')}
        label="Contraseña"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        fullWidth
        disabled={isFormLoading}
        error={!!errors.password}
        helperText={errors.password?.message}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon color={errors.password ? 'error' : 'action'} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleTogglePassword}
                onMouseDown={(e) => e.preventDefault()}
                edge="end"
                disabled={isFormLoading}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={isFormLoading}
        sx={{
          mt: 1,
          py: 1.5,
          position: 'relative',
        }}
      >
        {isFormLoading ? (
          <>
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                left: '50%',
                marginLeft: '-12px',
              }}
            />
            <Typography component="span" sx={{ visibility: 'hidden' }}>
              Iniciando sesión...
            </Typography>
          </>
        ) : (
          'Iniciar Sesión'
        )}
      </Button>

      {/* Helper Text */}
      <Typography
        variant="caption"
        color="text.secondary"
        align="center"
        sx={{ mt: 2 }}
      >
        Ingresa con tu correo institucional
      </Typography>
    </Box>
  );
}

export default LoginForm;
