/**
 * Authentication Context
 * School Advisories System
 * 
 * Provides authentication state and methods throughout the app:
 * - User authentication status
 * - Current user data
 * - Login/logout functionality
 * - Token refresh logic
 */

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { User } from '@/api/types';
import * as tokenUtils from '@/utils/tokenUtils';
import { setAuthorizationToken, clearAuthTokens } from '@/api/client';

/**
 * Authentication state interface
 */
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: Partial<User> | null;
  role: User['role'] | null;
}

/**
 * Authentication context value interface
 */
interface AuthContextValue extends AuthState {
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  checkAuth: () => boolean;
}

/**
 * Create the authentication context
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Authentication Provider Props
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Authentication Provider Component
 * 
 * Manages authentication state and provides auth methods to the app
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    role: null,
  });

  /**
   * Initialize authentication state from stored tokens
   */
  const initializeAuth = useCallback(() => {
    try {
      const isAuth = tokenUtils.isAuthenticated();
      
      if (isAuth) {
        const user = tokenUtils.getUserFromToken();
        const role = tokenUtils.getUserRole();
        const token = tokenUtils.getAuthToken();

        if (user && role && token) {
          // Set token in axios client
          setAuthorizationToken(token);
          
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user,
            role,
          });
          return;
        }
      }

      // No valid authentication
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        role: null,
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        role: null,
      });
    }
  }, []);

  /**
   * Initialize auth on mount
   */
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  /**
   * Logout function
   * Clears tokens and resets auth state
   */
  const logout = useCallback(() => {
    // Clear tokens from storage
    tokenUtils.removeAllTokens();
    
    // Clear token from axios client
    clearAuthTokens();
    
    // Reset auth state
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      role: null,
    });
  }, []);

  /**
   * Login function
   * Stores tokens and updates auth state
   */
  const login = useCallback((accessToken: string, refreshToken: string) => {
    try {
      // Store tokens
      tokenUtils.setTokens(accessToken, refreshToken);
      
      // Set token in axios client
      setAuthorizationToken(accessToken);
      
      // Extract user data from token
      const user = tokenUtils.getUserFromToken();
      const role = tokenUtils.getUserRole();

      if (user && role) {
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user,
          role,
        });
      } else {
        throw new Error('Invalid token: unable to extract user data');
      }
    } catch (error) {
      console.error('Login error:', error);
      logout();
    }
  }, [logout]);

  /**
   * Update user data
   */
  const updateUser = useCallback((updatedUser: Partial<User>) => {
    setAuthState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...updatedUser } : updatedUser,
    }));
  }, []);

  /**
   * Check if user is authenticated
   * Returns current authentication status
   */
  const checkAuth = useCallback((): boolean => {
    const isAuth = tokenUtils.isAuthenticated();
    
    if (!isAuth && authState.isAuthenticated) {
      // Token expired, logout
      logout();
      return false;
    }
    
    return isAuth;
  }, [authState.isAuthenticated, logout]);

  /**
   * Set up token expiration checker
   * Checks every minute if token is about to expire
   */
  useEffect(() => {
    if (!authState.isAuthenticated) {
      return;
    }

    const intervalId = setInterval(() => {
      const token = tokenUtils.getAuthToken();
      
      if (!token || tokenUtils.isTokenExpired(token)) {
        console.log('Token expired, logging out...');
        logout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [authState.isAuthenticated, logout]);

  /**
   * Memoize context value to prevent unnecessary re-renders
   */
  const contextValue = useMemo<AuthContextValue>(
    () => ({
      ...authState,
      login,
      logout,
      updateUser,
      checkAuth,
    }),
    [authState, login, logout, updateUser, checkAuth]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Export context for advanced usage
 */
export { AuthContext };
export default AuthProvider;
