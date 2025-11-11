/**
 * Confirm Dialog Component
 * School Advisories System
 * 
 * Reusable confirmation dialog for destructive actions
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
} from '@mui/icons-material';

/**
 * Dialog severity types
 */
export type ConfirmDialogSeverity = 'warning' | 'error' | 'info' | 'success';

/**
 * Confirm Dialog Props
 */
export interface ConfirmDialogProps {
  /** Show/hide dialog */
  open: boolean;
  /** Dialog title */
  title: string;
  /** Dialog message/description */
  message: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Callback when confirmed */
  onConfirm: () => void | Promise<void>;
  /** Callback when cancelled */
  onCancel: () => void;
  /** Dialog severity (affects icon and colors) */
  severity?: ConfirmDialogSeverity;
  /** Loading state */
  loading?: boolean;
  /** Disable confirm button */
  disableConfirm?: boolean;
}

/**
 * Get icon based on severity
 */
function getSeverityIcon(severity: ConfirmDialogSeverity) {
  switch (severity) {
    case 'error':
      return <ErrorIcon sx={{ fontSize: 60, color: 'error.main' }} />;
    case 'warning':
      return <WarningIcon sx={{ fontSize: 60, color: 'warning.main' }} />;
    case 'success':
      return <SuccessIcon sx={{ fontSize: 60, color: 'success.main' }} />;
    case 'info':
    default:
      return <InfoIcon sx={{ fontSize: 60, color: 'info.main' }} />;
  }
}

/**
 * Get confirm button color based on severity
 */
function getConfirmButtonColor(severity: ConfirmDialogSeverity) {
  switch (severity) {
    case 'error':
    case 'warning':
      return 'error';
    case 'success':
      return 'success';
    case 'info':
    default:
      return 'primary';
  }
}

/**
 * Confirm Dialog Component
 * 
 * Reusable dialog for confirmation actions with loading states.
 * 
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 * 
 * <ConfirmDialog
 *   open={open}
 *   title="Eliminar Usuario"
 *   message="¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer."
 *   severity="error"
 *   confirmText="Eliminar"
 *   onConfirm={async () => {
 *     await deleteUser(userId);
 *     setOpen(false);
 *   }}
 *   onCancel={() => setOpen(false)}
 * />
 * ```
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  severity = 'warning',
  loading = false,
  disableConfirm = false,
}: ConfirmDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  const confirmButtonColor = getConfirmButtonColor(severity);

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          pt: 3,
          pb: 1,
        }}
      >
        {getSeverityIcon(severity)}
      </Box>

      {/* Title */}
      <DialogTitle
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          pb: 1,
        }}
      >
        {title}
      </DialogTitle>

      {/* Content */}
      <DialogContent>
        <DialogContentText
          sx={{
            textAlign: 'center',
            color: 'text.primary',
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          justifyContent: 'center',
          gap: 1,
          pb: 3,
          px: 3,
        }}
      >
        <Button
          onClick={onCancel}
          disabled={loading}
          variant="outlined"
          size="large"
          sx={{ minWidth: 120 }}
        >
          {cancelText}
        </Button>

        <Button
          onClick={handleConfirm}
          disabled={loading || disableConfirm}
          variant="contained"
          color={confirmButtonColor}
          size="large"
          sx={{ minWidth: 120, position: 'relative' }}
        >
          {loading ? (
            <>
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  left: '50%',
                  marginLeft: '-12px',
                }}
              />
              <span style={{ visibility: 'hidden' }}>{confirmText}</span>
            </>
          ) : (
            confirmText
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
