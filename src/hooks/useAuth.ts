/**
 * useAuth Hook
 * School Advisories System
 * 
 * Custom hook to access authentication context
 */

import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

/**
 * Custom hook to use authentication context
 * 
 * @throws Error if used outside AuthProvider
 * @returns Authentication context value
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isAuthenticated, user, login, logout } = useAuth();
 *   
 *   return (
 *     <div>
 *       {isAuthenticated ? (
 *         <p>Welcome, {user?.email}</p>
 *       ) : (
 *         <button onClick={() => login(token, refreshToken)}>Login</button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export default useAuth;
