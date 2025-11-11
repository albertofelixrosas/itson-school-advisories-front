/**
 * useConfirmDialog Hook
 * School Advisories System
 * 
 * Hook to manage confirm dialog state
 */

import { useState, useCallback } from 'react';
import type { ConfirmDialogSeverity } from '@/components/common/ConfirmDialog';

/**
 * Confirm Dialog Config
 */
export interface ConfirmDialogConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  severity?: ConfirmDialogSeverity;
  onConfirm: () => void | Promise<void>;
}

/**
 * useConfirmDialog Return Type
 */
export interface UseConfirmDialogReturn {
  /** Dialog open state */
  open: boolean;
  /** Loading state during confirm action */
  loading: boolean;
  /** Dialog configuration */
  config: ConfirmDialogConfig | null;
  /** Open dialog with configuration */
  showDialog: (config: ConfirmDialogConfig) => void;
  /** Close dialog */
  hideDialog: () => void;
  /** Handle confirm action */
  handleConfirm: () => Promise<void>;
  /** Handle cancel action */
  handleCancel: () => void;
}

/**
 * Hook to manage confirm dialog state
 * 
 * @returns Dialog state and handlers
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const confirmDialog = useConfirmDialog();
 * 
 *   const handleDelete = () => {
 *     confirmDialog.showDialog({
 *       title: 'Eliminar Usuario',
 *       message: '¿Estás seguro?',
 *       severity: 'error',
 *       onConfirm: async () => {
 *         await deleteUser(userId);
 *       },
 *     });
 *   };
 * 
 *   return (
 *     <>
 *       <Button onClick={handleDelete}>Eliminar</Button>
 *       <ConfirmDialog
 *         open={confirmDialog.open}
 *         loading={confirmDialog.loading}
 *         title={confirmDialog.config?.title || ''}
 *         message={confirmDialog.config?.message || ''}
 *         severity={confirmDialog.config?.severity}
 *         confirmText={confirmDialog.config?.confirmText}
 *         cancelText={confirmDialog.config?.cancelText}
 *         onConfirm={confirmDialog.handleConfirm}
 *         onCancel={confirmDialog.handleCancel}
 *       />
 *     </>
 *   );
 * }
 * ```
 */
export function useConfirmDialog(): UseConfirmDialogReturn {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<ConfirmDialogConfig | null>(null);

  const showDialog = useCallback((dialogConfig: ConfirmDialogConfig) => {
    setConfig(dialogConfig);
    setOpen(true);
  }, []);

  const hideDialog = useCallback(() => {
    setOpen(false);
    setLoading(false);
    // Clear config after animation
    setTimeout(() => setConfig(null), 200);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!config) return;

    try {
      setLoading(true);
      await config.onConfirm();
      hideDialog();
    } catch (error) {
      console.error('Error in confirm dialog:', error);
      setLoading(false);
      // Keep dialog open on error so user can retry or cancel
    }
  }, [config, hideDialog]);

  const handleCancel = useCallback(() => {
    hideDialog();
  }, [hideDialog]);

  return {
    open,
    loading,
    config,
    showDialog,
    hideDialog,
    handleConfirm,
    handleCancel,
  };
}

export default useConfirmDialog;
