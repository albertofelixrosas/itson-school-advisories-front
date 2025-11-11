/**
 * Loading Spinner Component
 * School Advisories System
 * 
 * Simple circular loading spinner with customizable size and color
 */

import { CircularProgress, Box, Typography } from '@mui/material';
import type { CircularProgressProps } from '@mui/material';

/**
 * Loading Spinner Props
 */
interface LoadingSpinnerProps extends CircularProgressProps {
  /** Optional message to display below spinner */
  message?: string;
  /** Show spinner in center of container */
  centered?: boolean;
  /** Minimum height for centered spinner */
  minHeight?: string | number;
}

/**
 * Loading Spinner Component
 * 
 * @param size - Size of the spinner (default: 40)
 * @param message - Optional message to display
 * @param centered - Center the spinner (default: false)
 * @param minHeight - Minimum height when centered (default: '200px')
 * @param color - Color of spinner (default: 'primary')
 * 
 * @example
 * ```tsx
 * <LoadingSpinner />
 * <LoadingSpinner message="Cargando datos..." />
 * <LoadingSpinner centered minHeight="400px" />
 * ```
 */
export function LoadingSpinner({
  message,
  centered = false,
  minHeight = '200px',
  size = 40,
  color = 'primary',
  ...props
}: LoadingSpinnerProps) {
  const spinner = (
    <>
      <CircularProgress size={size} color={color} {...props} />
      {message && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          {message}
        </Typography>
      )}
    </>
  );

  if (centered) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight,
          width: '100%',
        }}
      >
        {spinner}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {spinner}
    </Box>
  );
}

export default LoadingSpinner;
