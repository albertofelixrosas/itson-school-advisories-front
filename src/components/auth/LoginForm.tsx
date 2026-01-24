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
import { useState, useEffect } from 'react';
import type { LoginDto } from '@/api/types';

/**
 * Key for storing login credentials in sessionStorage
 */
const LOGIN_STORAGE_KEY = 'login_form_data';

/**
 * Login form validation schema
 */
const loginSchema = yup.object({
  email: yup
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
  onSuccessfulLogin?: () => void;
}

/**
 * Get saved login data from sessionStorage
 */
function getSavedLoginData(): Partial<LoginDto> | null {
  try {
    const saved = sessionStorage.getItem(LOGIN_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

/**
 * Save login data to sessionStorage
 */
function saveLoginData(data: Partial<LoginDto>): void {
  try {
    sessionStorage.setItem(LOGIN_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Fail silently if sessionStorage is unavailable
  }
}

/**
 * Clear saved login data from sessionStorage
 */
function clearSavedLoginData(): void {
  try {
    sessionStorage.removeItem(LOGIN_STORAGE_KEY);
  } catch {
    // Fail silently if sessionStorage is unavailable
  }
}

/**
 * Login Form Component
 * 
 * @param onSubmit - Function to handle form submission
 * @param error - Error message to display
 * @param isLoading - Loading state
 * @param onSuccessfulLogin - Callback when login is successful
 */
export function LoginForm({ onSubmit, error, isLoading = false, onSuccessfulLogin }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  // Get saved login data for default values
  const savedData = getSavedLoginData();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginDto>({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: savedData || undefined,
  });

  // Watch form values to save them when they change
  const formValues = watch();

  // Save form data whenever it changes
  useEffect(() => {
    if (formValues.email || formValues.password) {
      saveLoginData(formValues);
    }
  }, [formValues]);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleFormSubmit = async (data: LoginDto) => {
    try {
      await onSubmit(data);
      // Clear saved data on successful login
      clearSavedLoginData();
      onSuccessfulLogin?.();
    } catch (err) {
      // Error is handled by parent component
      console.error('Login form error:', err);
      // Keep saved data on error so user doesn't lose it
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
        {...register('email')}
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        autoFocus
        fullWidth
        disabled={isFormLoading}
        error={!!errors.email}
        helperText={errors.email?.message}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon color={errors.email ? 'error' : 'action'} />
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
