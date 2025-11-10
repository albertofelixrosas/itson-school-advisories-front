/**
 * Axios Client Configuration for School Advisories System
 * 
 * This file configures the Axios HTTP client with:
 * - Base URL and timeout from environment variables
 * - Request interceptor to automatically add JWT tokens
 * - Response interceptor to handle token refresh and errors
 * - Global error handling
 */

import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

// Environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000;
const JWT_STORAGE_KEY = import.meta.env.VITE_JWT_STORAGE_KEY || 'auth_token';
const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token';

/**
 * Create the Axios instance with default configuration
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Flag to prevent multiple simultaneous refresh token requests
 */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

/**
 * Process the queue of failed requests after token refresh
 */
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Get the authentication token from localStorage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem(JWT_STORAGE_KEY);
};

/**
 * Get the refresh token from localStorage
 */
const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Set the authentication token in localStorage
 */
const setAuthToken = (token: string): void => {
  localStorage.setItem(JWT_STORAGE_KEY, token);
};

/**
 * Remove all authentication tokens from localStorage
 */
const removeAuthTokens = (): void => {
  localStorage.removeItem(JWT_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * REQUEST INTERCEPTOR
 * Automatically adds the JWT token to all requests
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * Handles token refresh and global error handling
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Successful response, return as is
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        // No refresh token available, logout user
        removeAuthTokens();
        processQueue(new Error('No refresh token available'), null);
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh the token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token } = response.data;

        // Save new token
        setAuthToken(access_token);

        // Update the authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }

        // Process queued requests
        processQueue(null, access_token);

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError as Error, null);
        removeAuthTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other error types
    handleApiError(error);

    return Promise.reject(error);
  }
);

/**
 * Global error handler
 * Displays user-friendly error messages based on HTTP status codes
 */
const handleApiError = (error: AxiosError) => {
  if (!error.response) {
    // Network error or no response
    toast.error('Error de conexión. Por favor verifica tu internet.');
    return;
  }

  const { status, data } = error.response;
  const errorMessage = (data as { message?: string | string[] })?.message;

  switch (status) {
    case 400:
      // Bad Request - Validation errors
      if (Array.isArray(errorMessage)) {
        errorMessage.forEach((msg) => toast.error(msg));
      } else if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error('Datos inválidos. Por favor verifica tu información.');
      }
      break;

    case 401:
      // Unauthorized - Handled by interceptor
      toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
      break;

    case 403:
      // Forbidden - No permission
      toast.error('No tienes permisos para realizar esta acción.');
      break;

    case 404:
      // Not Found
      toast.error('Recurso no encontrado.');
      break;

    case 409:
      // Conflict
      toast.error('Conflicto con los datos existentes.');
      break;

    case 422:
      // Unprocessable Entity - Business logic error
      if (typeof errorMessage === 'string') {
        toast.error(errorMessage);
      } else {
        toast.error('Error al procesar la solicitud.');
      }
      break;

    case 429:
      // Too Many Requests
      toast.error('Demasiadas solicitudes. Por favor espera un momento.');
      break;

    case 500:
    case 502:
    case 503:
    case 504:
      // Server errors
      toast.error('Error del servidor. Por favor intenta nuevamente más tarde.');
      break;

    default:
      toast.error('Ocurrió un error inesperado.');
  }
};

/**
 * Helper function to manually set the auth token
 * Useful after login
 */
export const setAuthorizationToken = (token: string): void => {
  setAuthToken(token);
};

/**
 * Helper function to manually clear auth tokens
 * Useful for logout
 */
export const clearAuthTokens = (): void => {
  removeAuthTokens();
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export default apiClient;
