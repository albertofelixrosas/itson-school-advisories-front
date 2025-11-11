/**
 * Loading Overlay Component
 * School Advisories System
 * 
 * Full-screen or container overlay with loading spinner
 */

import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';
import type { BackdropProps } from '@mui/material';

/**
 * Loading Overlay Props
 */
interface LoadingOverlayProps extends Omit<BackdropProps, 'open'> {
  /** Show/hide the overlay */
  open: boolean;
  /** Optional loading message */
  message?: string;
  /** Spinner size */
  size?: number;
  /** Use absolute positioning instead of fixed */
  absolute?: boolean;
}

/**
 * Loading Overlay Component
 * 
 * Full-screen loading overlay with backdrop and spinner.
 * Blocks user interaction while loading.
 * 
 * @param open - Show/hide overlay
 * @param message - Optional loading message
 * @param size - Spinner size (default: 60)
 * @param absolute - Use absolute positioning (default: false)
 * 
 * @example
 * ```tsx
 * <LoadingOverlay open={isLoading} />
 * <LoadingOverlay open={isLoading} message="Guardando cambios..." />
 * ```
 */
export function LoadingOverlay({
  open,
  message,
  size = 60,
  absolute = false,
  sx,
  ...props
}: LoadingOverlayProps) {
  return (
    <Backdrop
      open={open}
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        position: absolute ? 'absolute' : 'fixed',
        ...sx,
      }}
      {...props}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <CircularProgress size={size} color="inherit" />
        {message && (
          <Typography variant="h6" component="div">
            {message}
          </Typography>
        )}
      </Box>
    </Backdrop>
  );
}

export default LoadingOverlay;
