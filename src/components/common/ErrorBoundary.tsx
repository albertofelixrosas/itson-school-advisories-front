/**
 * Error Boundary Component
 * School Advisories System
 * 
 * Catches React errors and displays fallback UI
 */

import { Component, type ReactNode, type ErrorInfo } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
} from '@mui/icons-material';

/**
 * Error Boundary Props
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback component */
  fallback?: (error: Error, errorInfo: ErrorInfo, reset: () => void) => ReactNode;
  /** Callback when error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * Error Boundary State
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <YourApp />
 * </ErrorBoundary>
 * ```
 * 
 * @example With custom fallback
 * ```tsx
 * <ErrorBoundary
 *   fallback={(error, errorInfo, reset) => (
 *     <CustomErrorPage error={error} onReset={reset} />
 *   )}
 * >
 *   <YourApp />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // TODO: Log to error reporting service (e.g., Sentry)
    // logErrorToService(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback && errorInfo) {
        return fallback(error, errorInfo, this.handleReset);
      }

      // Default error UI
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            py: 4,
          }}
        >
          <Container maxWidth="md">
            <Paper
              elevation={8}
              sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: 2,
              }}
            >
              {/* Error Icon */}
              <ErrorIcon
                sx={{
                  fontSize: 100,
                  color: 'error.main',
                  mb: 3,
                }}
              />

              {/* Title */}
              <Typography variant="h4" gutterBottom fontWeight="bold">
                ¡Oops! Algo salió mal
              </Typography>

              {/* Description */}
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Lo sentimos, ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
              </Typography>

              {/* Error Details */}
              <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                <AlertTitle>Detalles del error</AlertTitle>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>
                  {error.toString()}
                </Typography>
                {import.meta.env.DEV && errorInfo && (
                  <Typography
                    variant="caption"
                    component="pre"
                    sx={{
                      fontFamily: 'monospace',
                      overflow: 'auto',
                      maxHeight: 200,
                      fontSize: '0.75rem',
                    }}
                  >
                    {errorInfo.componentStack}
                  </Typography>
                )}
              </Alert>

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
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={this.handleReset}
                  size="large"
                >
                  Intentar de nuevo
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<HomeIcon />}
                  onClick={this.handleGoHome}
                  size="large"
                >
                  Ir al inicio
                </Button>
              </Box>

              {/* Help Text */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 4 }}
              >
                Si el problema persiste, contacta al administrador del sistema.
              </Typography>
            </Paper>
          </Container>
        </Box>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
