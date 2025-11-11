/**
 * Page Loader Component
 * School Advisories System
 * 
 * Full page loading state for route transitions
 */

import { Box, CircularProgress, Typography, LinearProgress } from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';

/**
 * Page Loader Props
 */
interface PageLoaderProps {
  /** Loading message */
  message?: string;
  /** Show linear progress bar */
  showProgress?: boolean;
  /** Show app icon */
  showIcon?: boolean;
}

/**
 * Page Loader Component
 * 
 * Full-page loading state with app branding.
 * Used during route transitions or initial app load.
 * 
 * @param message - Loading message (default: 'Cargando...')
 * @param showProgress - Show linear progress bar (default: false)
 * @param showIcon - Show app icon (default: true)
 * 
 * @example
 * ```tsx
 * <PageLoader />
 * <PageLoader message="Cargando dashboard..." />
 * <PageLoader showProgress />
 * ```
 */
export function PageLoader({
  message = 'Cargando...',
  showProgress = false,
  showIcon = true,
}: PageLoaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%',
        bgcolor: 'background.default',
      }}
    >
      {/* App Icon */}
      {showIcon && (
        <Box
          sx={{
            mb: 3,
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': {
                opacity: 1,
                transform: 'scale(1)',
              },
              '50%': {
                opacity: 0.8,
                transform: 'scale(1.05)',
              },
            },
          }}
        >
          <SchoolIcon
            sx={{
              fontSize: 80,
              color: 'primary.main',
            }}
          />
        </Box>
      )}

      {/* Spinner */}
      <CircularProgress size={60} thickness={4} />

      {/* Message */}
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ mt: 3, mb: 2 }}
      >
        {message}
      </Typography>

      {/* Linear Progress */}
      {showProgress && (
        <Box sx={{ width: 300, mt: 2 }}>
          <LinearProgress />
        </Box>
      )}

      {/* App Name */}
      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ mt: 4 }}
      >
        School Advisories System
      </Typography>
    </Box>
  );
}

export default PageLoader;
