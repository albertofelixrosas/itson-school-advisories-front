/**
 * Login Page
 * School Advisories System
 * 
 * Authentication page with login form and redirect logic
 */

import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  Avatar,
  Divider,
} from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { login as loginApi } from '@/api/endpoints/auth';
import type { LoginDto, UserRole } from '@/api/types';

/**
 * SessionStorage keys for login error handling
 */
const LOGIN_ERROR_KEY = 'login_error_message';

/**
 * Get saved login error from sessionStorage
 */
function getSavedLoginError(): string | null {
  try {
    return sessionStorage.getItem(LOGIN_ERROR_KEY);
  } catch {
    return null;
  }
}

/**
 * Save login error to sessionStorage
 */
function saveLoginError(errorMessage: string): void {
  try {
    sessionStorage.setItem(LOGIN_ERROR_KEY, errorMessage);
  } catch {
    // Fail silently if sessionStorage is unavailable
  }
}

/**
 * Clear saved login error from sessionStorage
 */
function clearLoginError(): void {
  try {
    sessionStorage.removeItem(LOGIN_ERROR_KEY);
  } catch {
    // Fail silently if sessionStorage is unavailable
  }
}

/**
 * Get redirect route based on user role
 */
function getRedirectPathByRole(role: UserRole): string {
  const rolePathMap: Record<UserRole, string> = {
    admin: '/admin/dashboard',
    professor: '/professor/dashboard',
    student: '/student/dashboard',
  };
  return rolePathMap[role] || '/student/dashboard';
}

export function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  // Effect: Load saved login error on mount
  useEffect(() => {
    const savedError = getSavedLoginError();
    if (savedError) {
      setError(savedError);
      // Clear the error from sessionStorage so it doesn't show again
      clearLoginError();
    }
  }, []);

  // Effect: Navigate when authentication is complete and redirect path is set
  useEffect(() => {
    if (isAuthenticated && redirectPath) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, redirectPath, navigate]);

  // Redirect if already authenticated (initial check)
  if (isAuthenticated && !redirectPath) {
    // Don't use 'from' after successful login - it may redirect to login page
    // Instead, use the default route which will be handled by ProtectedRoute
    return <Navigate to="/student/dashboard" replace />;
  }

  /**
   * Handle login form submission
   */
  const handleLogin = async (credentials: LoginDto) => {
    try {
      setError(null);
      setIsLoading(true);

      // Call login API
      const response = await loginApi(credentials);

      // Get user role from the API response
      const userRole = response.user.role;

      // Determine redirect path based on user role
      const path = userRole ? getRedirectPathByRole(userRole) : '/student/dashboard';

      // Store tokens and update auth state
      // The useEffect above will handle navigation when isAuthenticated changes
      await login(response.access_token, response.refresh_token);

      // Set the redirect path, which will trigger navigation in useEffect
      setRedirectPath(path);
    } catch (err: unknown) {
      // Handle error - extract message from different error types
      let errorMessage = 'Credenciales inválidas. Por favor, intenta nuevamente.';
      
      // Check if it's an axios error with response data
      const axiosError = err as { response?: { data?: { message?: string | string[] } } };
      if (axiosError?.response?.data?.message) {
        const msg = axiosError.response.data.message;
        errorMessage = Array.isArray(msg) ? msg[0] : msg;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      console.error('Login error:', errorMessage);
      
      // Save error to sessionStorage so it persists across navigation
      saveLoginError(errorMessage);
      
      // Set error in state to show immediately
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 3,
          }}
        >
          {/* Logo/Icon */}
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              mb: 2,
            }}
          >
            <SchoolIcon sx={{ fontSize: 48 }} />
          </Avatar>

          {/* Title */}
          <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom>
            School Advisories
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Sistema de Gestión de Asesorías Académicas
          </Typography>

          <Divider sx={{ width: '100%', mb: 4 }} />

          {/* Subtitle */}
          <Typography variant="h6" fontWeight="medium" sx={{ mb: 3, alignSelf: 'flex-start' }}>
            Iniciar Sesión
          </Typography>

          {/* Login Form */}
          <LoginForm
            onSubmit={handleLogin}
            error={error}
            isLoading={isLoading}
          />

          {/* Footer */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              © 2025 School Advisories System
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default LoginPage;
