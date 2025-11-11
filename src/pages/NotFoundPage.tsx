/**
 * Not Found Page (404)
 * School Advisories System
 * 
 * Page displayed when route is not found
 */

import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import {
  SearchOff as SearchOffIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

/**
 * Not Found Page Component
 * 
 * Displays a 404 error page with navigation options
 * 
 * @example
 * ```tsx
 * // In your router
 * <Route path="*" element={<NotFoundPage />} />
 * ```
 */
export function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
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
      <Container maxWidth="md">
        <Paper
          elevation={12}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
          }}
        >
          {/* Icon */}
          <SearchOffIcon
            sx={{
              fontSize: 120,
              color: 'text.secondary',
              mb: 3,
              opacity: 0.6,
            }}
          />

          {/* Error Code */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '4rem', md: '6rem' },
              fontWeight: 'bold',
              color: 'primary.main',
              mb: 2,
            }}
          >
            404
          </Typography>

          {/* Title */}
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Página No Encontrada
          </Typography>

          {/* Message */}
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}
          >
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
            Verifica la URL o regresa a la página anterior.
          </Typography>

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

          {/* Help Text */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 4 }}
          >
            Si crees que esto es un error, contacta al administrador del sistema.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default NotFoundPage;
