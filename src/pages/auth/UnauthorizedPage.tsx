/**
 * Unauthorized Page
 * School Advisories System
 * 
 * Page shown when user tries to access a route without proper permissions
 */

import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Avatar,
} from '@mui/material';
import {
  Block as BlockIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';

/**
 * Unauthorized Page Component
 * 
 * Displays when user lacks required permissions for a route
 */
export function UnauthorizedPage() {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    // Redirect based on user role
    switch (role) {
      case 'student':
        navigate('/student/dashboard');
        break;
      case 'professor':
        navigate('/professor/dashboard');
        break;
      case 'admin':
        navigate('/admin/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={8}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
          }}
        >
          {/* Icon */}
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'error.main',
              mx: 'auto',
              mb: 3,
            }}
          >
            <BlockIcon sx={{ fontSize: 60 }} />
          </Avatar>

          {/* Error Code */}
          <Typography
            variant="h1"
            sx={{
              fontSize: '6rem',
              fontWeight: 'bold',
              color: 'error.main',
              mb: 2,
            }}
          >
            403
          </Typography>

          {/* Title */}
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Acceso Denegado
          </Typography>

          {/* Message */}
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1, maxWidth: 500, mx: 'auto' }}>
            No tienes permisos suficientes para acceder a esta página.
          </Typography>

          {user && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Usuario actual: <strong>{user.email}</strong> ({role})
            </Typography>
          )}

          {/* Role-specific message */}
          <Box
            sx={{
              bgcolor: 'info.light',
              color: 'info.dark',
              p: 2,
              borderRadius: 2,
              mb: 4,
              maxWidth: 500,
              mx: 'auto',
            }}
          >
            <Typography variant="body2">
              {role === 'student' && (
                'Como estudiante, puedes acceder al panel de estudiante, crear solicitudes de asesoría y ver tus invitaciones.'
              )}
              {role === 'professor' && (
                'Como profesor, puedes acceder al panel de profesores, revisar solicitudes y gestionar asesorías.'
              )}
              {role === 'admin' && (
                'Como administrador, tienes acceso completo al sistema.'
              )}
              {!role && (
                'Por favor, inicia sesión para acceder al sistema.'
              )}
            </Typography>
          </Box>

          {/* Actions */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
            >
              Volver Atrás
            </Button>

            <Button
              variant="contained"
              size="large"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
            >
              Ir al Inicio
            </Button>
          </Box>

          {/* Footer */}
          <Typography variant="caption" color="text.secondary" sx={{ mt: 4, display: 'block' }}>
            Si crees que esto es un error, contacta al administrador del sistema.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default UnauthorizedPage;
