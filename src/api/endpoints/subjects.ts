/**
 * Subjects API Endpoints
 * School Advisories System
 */

import { apiClient } from '../client';
import type { Subject, SubjectDetails } from '../types';

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
