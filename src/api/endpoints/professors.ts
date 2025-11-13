/**
 * Professors API Endpoints
 * School Advisories System
 */

import { apiClient } from '../client';
import type { User, Subject } from '../types';

/**
 * Get all professors
 * Endpoint: GET /users/professors
 */
export async function getAllProfessors(): Promise<User[]> {
  const response = await apiClient.get<User[]>('/users/professors');
  return response.data;
}

/**
 * Get professor by ID
 * Endpoint: GET /users/:id
 */
export async function getProfessorById(id: number): Promise<User> {
  const response = await apiClient.get<User>(`/users/${id}`);
  return response.data;
}

/**
 * Get subjects taught by a specific professor
 * Endpoint: GET /users/:id/subjects
 */
export async function getProfessorSubjects(professorId: number): Promise<Subject[]> {
  const response = await apiClient.get<Subject[]>(`/users/${professorId}/subjects`);
  return response.data;
}
