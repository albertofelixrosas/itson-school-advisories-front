/**
 * Authentication API Endpoints
 * School Advisories System
 * 
 * Handles all authentication-related API calls:
 * - Login
 * - Token refresh
 * - User profile retrieval
 */

import apiClient from '@/api/client';
import type { LoginDto, LoginResponse, User } from '@/api/types';

/**
 * Re-export LoginResponse from backend types
 */
export type { LoginResponse } from '@/api/types';

/**
 * Refresh token response interface
 */
export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

/**
 * Login with email and password
 * 
 * @param credentials - User credentials (email and password)
 * @returns Login response with tokens and user data
 * 
 * @example
 * ```tsx
 * const { access_token, refresh_token, user } = await login({
 *   email: 'user@example.com',
 *   password: 'password123'
 * });
 * ```
 */
export async function login(credentials: LoginDto): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
  return response.data;
}

/**
 * Refresh access token using refresh token
 * 
 * @param refreshToken - The refresh token
 * @returns New access and refresh tokens
 * 
 * @example
 * ```tsx
 * const { access_token, refresh_token } = await refreshAccessToken(oldRefreshToken);
 * ```
 */
export async function refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse> {
  const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
    refresh_token: refreshToken,
  });
  return response.data;
}

/**
 * Get current user profile
 * 
 * @returns User profile data
 * 
 * @example
 * ```tsx
 * const user = await getProfile();
 * console.log(user.email, user.role);
 * ```
 */
export async function getProfile(): Promise<User> {
  const response = await apiClient.get<User>('/users/profile');
  return response.data;
}

/**
 * Logout (client-side only)
 * Clears tokens from storage
 * 
 * Note: This is a client-side logout. Server-side token invalidation
 * is not implemented in the current backend.
 */
export function logout(): void {
  // Clear tokens from localStorage
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  
  // Clear authorization header
  delete apiClient.defaults.headers.common['Authorization'];
}

/**
 * Check if user is authenticated
 * 
 * @returns true if user has a valid token
 */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem('auth_token');
  return !!token;
}

/**
 * Auth API object for easy import
 */
export const authApi = {
  login,
  refreshAccessToken,
  getProfile,
  logout,
  isAuthenticated,
};

export default authApi;
