/**
 * Subjects API Endpoints
 * School Advisories System
 */

import { apiClient } from '../client';
import type { Subject, SubjectDetails, CreateSubjectDto, UpdateSubjectDto } from '../types';

/**
 * Get all subjects
 * Endpoint: GET /subjects
 */
export async function getAllSubjects(): Promise<Subject[]> {
  const response = await apiClient.get<Subject[]>('/subjects');
  return response.data;
}

/**
 * Get all subject details (professor-subject combinations)
 * Endpoint: GET /subject-details
 */
export async function getAllSubjectDetails(): Promise<SubjectDetails[]> {
  const response = await apiClient.get<SubjectDetails[]>('/subject-details');
  return response.data;
}

/**
 * Get subject by ID with details
 * Endpoint: GET /subjects/:id
 */
export async function getSubjectById(id: number): Promise<SubjectDetails> {
  const response = await apiClient.get<SubjectDetails>(`/subjects/${id}`);
  return response.data;
}

/**
 * Create new subject (Admin only)
 * Endpoint: POST /subjects
 */
export async function createSubject(data: CreateSubjectDto): Promise<Subject> {
  const response = await apiClient.post<Subject>('/subjects', data);
  return response.data;
}

/**
 * Update subject (Admin only)
 * Endpoint: PUT /subjects/:id
 */
export async function updateSubject(id: number, data: UpdateSubjectDto): Promise<Subject> {
  const response = await apiClient.put<Subject>(`/subjects/${id}`, data);
  return response.data;
}

/**
 * Delete subject (Admin only)
 * Endpoint: DELETE /subjects/:id
 */
export async function deleteSubject(id: number): Promise<void> {
  await apiClient.delete(`/subjects/${id}`);
}

/**
 * Toggle subject active status (Admin only)
 * Endpoint: PATCH /subjects/:id/toggle-status
 */
export async function toggleSubjectStatus(id: number): Promise<Subject> {
  const response = await apiClient.patch<Subject>(`/subjects/${id}/toggle-status`);
  return response.data;
}
