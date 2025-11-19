/**
 * Users API Endpoints
 * School Advisories System
 */

import { apiClient } from '../client';
import type { User, CreateUserDto, UpdateUserDto } from '../types';

/**
 * Get all users (Admin only)
 */
export const getAllUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<User[]>('/users');
  return response.data;
};

/**
 * Get all students
 */
export const getAllStudents = async (): Promise<User[]> => {
  const response = await apiClient.get<User[]>('/users/students');
  return response.data;
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: number): Promise<User> => {
  const response = await apiClient.get<User>(`/users/${userId}`);
  return response.data;
};

/**
 * Create new user (Admin only)
 */
export const createUser = async (data: CreateUserDto): Promise<User> => {
  const response = await apiClient.post<User>('/users', data);
  return response.data;
};

/**
 * Update user (Admin only)
 */
export const updateUser = async (userId: number, data: UpdateUserDto): Promise<User> => {
  const response = await apiClient.put<User>(`/users/${userId}`, data);
  return response.data;
};

/**
 * Delete user (Admin only)
 */
export const deleteUser = async (userId: number): Promise<void> => {
  await apiClient.delete(`/users/${userId}`);
};

/**
 * Toggle user active status
 */
export const toggleUserStatus = async (userId: number): Promise<User> => {
  const response = await apiClient.patch<User>(`/users/${userId}/toggle-status`);
  return response.data;
};
