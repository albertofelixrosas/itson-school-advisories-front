/**
 * Token Utilities
 * School Advisories System
 * 
 * Helper functions for JWT token management:
 * - Store/retrieve tokens from localStorage
 * - Decode JWT to get user data
 * - Check token expiration
 * - Refresh token logic
 */

import { jwtDecode } from 'jwt-decode';
import type { User } from '@/api/types';

/**
 * Storage keys from environment variables
 */
const AUTH_TOKEN_KEY = import.meta.env.VITE_JWT_STORAGE_KEY || 'auth_token';
const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token';
const TOKEN_EXPIRY_BUFFER = Number(import.meta.env.VITE_JWT_EXPIRY_BUFFER_SECONDS) || 300; // 5 minutes

/**
 * JWT Payload interface
 */
interface JWTPayload {
  sub: string;        // User ID
  email: string;
  role: string;
  iat: number;        // Issued at
  exp: number;        // Expiration time
}

/**
 * Get the authentication token from localStorage
 * 
 * @returns The JWT token or null if not found
 */
export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

/**
 * Get the refresh token from localStorage
 * 
 * @returns The refresh token or null if not found
 */
export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
}

/**
 * Set the authentication token in localStorage
 * 
 * @param token - The JWT token to store
 */
export function setAuthToken(token: string): void {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error setting auth token:', error);
  }
}

/**
 * Set the refresh token in localStorage
 * 
 * @param token - The refresh token to store
 */
export function setRefreshToken(token: string): void {
  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error setting refresh token:', error);
  }
}

/**
 * Set both auth and refresh tokens
 * 
 * @param authToken - The JWT token
 * @param refreshToken - The refresh token
 */
export function setTokens(authToken: string, refreshToken: string): void {
  setAuthToken(authToken);
  setRefreshToken(refreshToken);
}

/**
 * Remove authentication token from localStorage
 */
export function removeAuthToken(): void {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Error removing auth token:', error);
  }
}

/**
 * Remove refresh token from localStorage
 */
export function removeRefreshToken(): void {
  try {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error removing refresh token:', error);
  }
}

/**
 * Remove all authentication tokens from localStorage
 */
export function removeAllTokens(): void {
  removeAuthToken();
  removeRefreshToken();
}

/**
 * Decode JWT token and extract payload
 * 
 * @param token - The JWT token to decode
 * @returns The decoded payload or null if invalid
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwtDecode<JWTPayload>(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

/**
 * Get user data from the stored JWT token
 * 
 * @returns User data extracted from token or null
 */
export function getUserFromToken(): Partial<User> | null {
  const token = getAuthToken();
  
  if (!token) {
    return null;
  }

  const payload = decodeToken(token);
  
  if (!payload) {
    return null;
  }

  return {
    id: payload.sub,
    email: payload.email,
    role: payload.role as User['role'],
  };
}

/**
 * Check if a token is expired
 * 
 * @param token - The JWT token to check
 * @param bufferSeconds - Buffer time in seconds before actual expiration (default: 5 minutes)
 * @returns true if token is expired or about to expire, false otherwise
 */
export function isTokenExpired(token: string, bufferSeconds: number = TOKEN_EXPIRY_BUFFER): boolean {
  const payload = decodeToken(token);
  
  if (!payload || !payload.exp) {
    return true;
  }

  // Get current time in seconds
  const currentTime = Math.floor(Date.now() / 1000);
  
  // Check if token will expire within the buffer time
  return payload.exp - currentTime <= bufferSeconds;
}

/**
 * Check if the current auth token is expired
 * 
 * @returns true if token is expired or missing, false otherwise
 */
export function isAuthTokenExpired(): boolean {
  const token = getAuthToken();
  
  if (!token) {
    return true;
  }

  return isTokenExpired(token);
}

/**
 * Check if user is authenticated (has valid token)
 * 
 * @returns true if user has a valid, non-expired token
 */
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  
  if (!token) {
    return false;
  }

  return !isTokenExpired(token);
}

/**
 * Get token expiration time in milliseconds
 * 
 * @param token - The JWT token
 * @returns Expiration time in milliseconds or null
 */
export function getTokenExpirationTime(token: string): number | null {
  const payload = decodeToken(token);
  
  if (!payload || !payload.exp) {
    return null;
  }

  return payload.exp * 1000; // Convert to milliseconds
}

/**
 * Get time remaining until token expires
 * 
 * @param token - The JWT token
 * @returns Time remaining in milliseconds or 0 if expired
 */
export function getTokenTimeRemaining(token: string): number {
  const expirationTime = getTokenExpirationTime(token);
  
  if (!expirationTime) {
    return 0;
  }

  const remaining = expirationTime - Date.now();
  return Math.max(0, remaining);
}

/**
 * Get user role from token
 * 
 * @returns User role or null
 */
export function getUserRole(): User['role'] | null {
  const token = getAuthToken();
  
  if (!token) {
    return null;
  }

  const payload = decodeToken(token);
  
  if (!payload) {
    return null;
  }

  return payload.role as User['role'];
}

/**
 * Check if user has a specific role
 * 
 * @param role - The role to check
 * @returns true if user has the role
 */
export function hasRole(role: User['role']): boolean {
  const userRole = getUserRole();
  return userRole === role;
}

/**
 * Check if user has any of the specified roles
 * 
 * @param roles - Array of roles to check
 * @returns true if user has any of the roles
 */
export function hasAnyRole(roles: User['role'][]): boolean {
  const userRole = getUserRole();
  return userRole !== null && roles.includes(userRole);
}

/**
 * Get user ID from token
 * 
 * @returns User ID or null
 */
export function getUserId(): string | null {
  const token = getAuthToken();
  
  if (!token) {
    return null;
  }

  const payload = decodeToken(token);
  
  if (!payload) {
    return null;
  }

  return payload.sub;
}

/**
 * Get user email from token
 * 
 * @returns User email or null
 */
export function getUserEmail(): string | null {
  const token = getAuthToken();
  
  if (!token) {
    return null;
  }

  const payload = decodeToken(token);
  
  if (!payload) {
    return null;
  }

  return payload.email;
}

/**
 * Clear all authentication data and redirect to login
 * 
 * @param redirectUrl - Optional URL to redirect to (default: /login)
 */
export function clearAuthAndRedirect(redirectUrl: string = '/login'): void {
  removeAllTokens();
  window.location.href = redirectUrl;
}

/**
 * Token utilities object for easy import
 */
export const tokenUtils = {
  // Get tokens
  getAuthToken,
  getRefreshToken,
  
  // Set tokens
  setAuthToken,
  setRefreshToken,
  setTokens,
  
  // Remove tokens
  removeAuthToken,
  removeRefreshToken,
  removeAllTokens,
  
  // Decode and extract data
  decodeToken,
  getUserFromToken,
  getUserId,
  getUserEmail,
  getUserRole,
  
  // Check expiration
  isTokenExpired,
  isAuthTokenExpired,
  isAuthenticated,
  getTokenExpirationTime,
  getTokenTimeRemaining,
  
  // Role checks
  hasRole,
  hasAnyRole,
  
  // Utility
  clearAuthAndRedirect,
};

export default tokenUtils;
