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
import type { LoginDto, LoginResponse } from '@/api/types';
import type { ProfileResponse } from '@/api/types/profile.types';

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
 * Login with email and password.
 * Sends only the fields expected by backend validation.
 * 
 * @param credentials - User credentials
 * @returns Login response with tokens and user data
 */
export async function login(credentials: LoginDto): Promise<LoginResponse> {
  const email = credentials.email || credentials.username;

  if (!email) {
    throw new Error('Email is required for login');
  }

  const response = await apiClient.post<LoginResponse>('/auth/login', {
    email,
    password: credentials.password,
  });
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
 * Returns different data structure based on user role
 * 
 * @returns Profile data (varies by role: student, professor, admin)
 * 
 * @example
 * ```tsx
 * const profile = await getProfile();
 * if (profile.user_info.role === 'student') {
 *   console.log(profile.student_profile.career);
 * }
 * ```
 */
export async function getProfile(): Promise<ProfileResponse> {
  const response = await apiClient.get<ProfileResponse>('/auth/profile');
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
