/**
 * Professors API Endpoints
 * School Advisories System
 */

import { apiClient } from '../client';
import type { 
  User, 
  Subject, 
  AdvisoryRequest, 
  ProfessorAvailability,
  CreateAvailabilitySlotDto,
  UpdateAvailabilitySlotDto,
  PaginatedResponse 
} from '../types';

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

// ===== ADVISORY REQUESTS =====

/**
 * Get pending requests assigned to the current professor
 * Endpoint: GET /advisory-requests/professor/pending
 */
export async function getPendingRequests(
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<AdvisoryRequest>> {
  const response = await apiClient.get<PaginatedResponse<AdvisoryRequest>>(
    '/advisory-requests/professor/pending',
    { params: { page, limit } }
  );
  return response.data;
}

/**
 * Review advisory request (approve or reject)
 * Endpoint: PATCH /advisory-requests/:id/review
 */
export interface ReviewRequestDto {
  action: 'APPROVED' | 'REJECTED';
  professor_response?: string;
  rejection_reason?: string;
}

export async function reviewRequest(
  requestId: number,
  data: ReviewRequestDto
): Promise<AdvisoryRequest> {
  const response = await apiClient.patch<AdvisoryRequest>(
    `/advisory-requests/${requestId}/review`,
    data
  );
  return response.data;
}

// ===== AVAILABILITY MANAGEMENT =====

/**
 * Get professor's availability schedules
 * Endpoint: GET /professor-availability/my-availability
 */
export async function getMyAvailability(): Promise<ProfessorAvailability[]> {
  const response = await apiClient.get<ProfessorAvailability[]>('/professor-availability/my-availability');
  return response.data;
}

export async function createAvailability(
  data: CreateAvailabilitySlotDto
): Promise<ProfessorAvailability> {
  const response = await apiClient.post<ProfessorAvailability>('/professor-availability/slots', data);
  return response.data;
}

/**
 * Update availability slot
 * Endpoint: PUT /professor-availability/slots/:id
 */
export async function updateAvailability(
  availabilityId: number,
  data: UpdateAvailabilitySlotDto
): Promise<ProfessorAvailability> {
  const response = await apiClient.put<ProfessorAvailability>(
    `/professor-availability/slots/${availabilityId}`,
    data
  );
  return response.data;
}

/**
 * Deactivate availability slot
 * Endpoint: DELETE /professor-availability/slots/:id/deactivate
 */
export async function deactivateAvailability(availabilityId: number): Promise<void> {
  await apiClient.delete(`/professor-availability/slots/${availabilityId}/deactivate`);
}

/**
 * Delete availability slot
 * Endpoint: DELETE /professor-availability/slots/:id
 */
export async function deleteAvailability(availabilityId: number): Promise<void> {
  await apiClient.delete(`/professor-availability/slots/${availabilityId}`);
}
