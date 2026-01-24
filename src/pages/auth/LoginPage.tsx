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
import toast from 'react-hot-toast';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { login as loginApi } from '@/api/endpoints/auth';
import type { LoginDto, UserRole } from '@/api/types';

/**
 * Login Page Component
 * 
 * Handles user authentication with:
 * - Login form with validation
 * - Error handling and toast notifications
 * - Role-based redirect after login
 * - Redirect to dashboard if already authenticated
 */

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

      // Show success message
      toast.success(`¡Bienvenido, ${response.user.name || response.user.email}!`);

      // Determine redirect path based on user role
      const path = userRole ? getRedirectPathByRole(userRole) : '/student/dashboard';

      // Store tokens and update auth state
      // The useEffect above will handle navigation when isAuthenticated changes
      await login(response.access_token, response.refresh_token);

      // Set the redirect path, which will trigger navigation in useEffect
      setRedirectPath(path);
    } catch (err: unknown) {
      // Handle error
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Error al iniciar sesión. Verifica tus credenciales.';
      
      setError(errorMessage);
      toast.error(errorMessage);
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
