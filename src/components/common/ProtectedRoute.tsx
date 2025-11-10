/**
 * Protected Route Component
 * School Advisories System
 * 
 * Protects routes from unauthorized access
 * - Checks authentication
 * - Verifies user roles
 * - Redirects to login or unauthorized page
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/api/types';
import { Box, CircularProgress } from '@mui/material';

/**
 * Protected Route Props
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: User['role'][];
  requireAuth?: boolean;
}

/**
 * Loading component while checking authentication
 */
function LoadingAuth() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <CircularProgress size={60} />
    </Box>
  );
}

/**
 * Protected Route Component
 * 
 * Wraps routes that require authentication and/or specific roles
 * 
 * @param children - Child components to render if authorized
 * @param allowedRoles - Array of roles allowed to access this route
 * @param requireAuth - Whether authentication is required (default: true)
 * 
 * @example
 * ```tsx
 * // Require authentication only
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 * 
 * // Require specific role
 * <ProtectedRoute allowedRoles={['ADMIN']}>
 *   <AdminPanel />
 * </ProtectedRoute>
 * 
 * // Require any of multiple roles
 * <ProtectedRoute allowedRoles={['PROFESSOR', 'ADMIN']}>
 *   <ManageAdvisories />
 * </ProtectedRoute>
 * ```
 */
export function ProtectedRoute({
  children,
  allowedRoles,
  requireAuth = true,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingAuth />;
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    // Redirect to login, preserving the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role requirement
  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      // User doesn't have required role
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // User is authorized, render children
  return <>{children}</>;
}

/**
 * Export as default
 */
export default ProtectedRoute;
