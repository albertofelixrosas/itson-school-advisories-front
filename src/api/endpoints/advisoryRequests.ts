/**
 * Advisory Requests API Endpoints
 * School Advisories System
 */

import { apiClient } from '../client';
import type {
  AdvisoryRequestResponseDto,
  CreateAdvisoryRequestDto,
  PaginatedResponse,
} from '../types';

/**
 * Create a new advisory request (Student)
 * Endpoint: POST /advisory-requests
 */
export async function createAdvisoryRequest(
  data: CreateAdvisoryRequestDto
): Promise<AdvisoryRequestResponseDto> {
  const response = await apiClient.post<AdvisoryRequestResponseDto>('/advisory-requests', data);
  return response.data;
}

/**
 * Get all my requests (Student)
 * Endpoint: GET /advisory-requests/my-requests
 */
export async function getMyRequests(
  page = 1,
  limit = 10
): Promise<PaginatedResponse<AdvisoryRequestResponseDto>> {
  const response = await apiClient.get<PaginatedResponse<AdvisoryRequestResponseDto>>(
    '/advisory-requests/my-requests',
    {
      params: { page, limit },
    }
  );
  return response.data;
}

/**
 * Get request by ID
 * Endpoint: GET /advisory-requests/:id
 */
export async function getAdvisoryRequestById(id: number): Promise<AdvisoryRequestResponseDto> {
  const response = await apiClient.get<AdvisoryRequestResponseDto>(`/advisory-requests/${id}`);
  return response.data;
}

/**
 * Cancel advisory request (Student)
 * Endpoint: PATCH /advisory-requests/:id/cancel
 */
export async function cancelAdvisoryRequest(
  id: number,
  cancellation_reason?: string
): Promise<AdvisoryRequestResponseDto> {
  const response = await apiClient.patch<AdvisoryRequestResponseDto>(
    `/advisory-requests/${id}/cancel`,
    { cancellation_reason }
  );
  return response.data;
}

/**
 * Delete advisory request (Student - if pending)
 * Endpoint: DELETE /advisory-requests/:id
 */
export async function deleteAdvisoryRequest(id: number): Promise<void> {
  await apiClient.delete(`/advisory-requests/${id}`);
}

/**
 * Get pending requests for a professor (Professor)
 * Endpoint: GET /advisory-requests/pending
 */
export async function getPendingRequests(
  page = 1,
  limit = 10
): Promise<PaginatedResponse<AdvisoryRequestResponseDto>> {
  const response = await apiClient.get<PaginatedResponse<AdvisoryRequestResponseDto>>(
    '/advisory-requests/pending',
    {
      params: { page, limit },
    }
  );
  return response.data;
}

/**
 * Approve advisory request (Professor)
 * Endpoint: POST /advisory-requests/:id/approve
 */
export async function approveAdvisoryRequest(
  id: number,
  professor_response?: string
): Promise<AdvisoryRequestResponseDto> {
  const response = await apiClient.post<AdvisoryRequestResponseDto>(
    `/advisory-requests/${id}/approve`,
    { professor_response }
  );
  return response.data;
}

/**
 * Reject advisory request (Professor)
 * Endpoint: POST /advisory-requests/:id/reject
 */
export async function rejectAdvisoryRequest(
  id: number,
  rejection_reason: string
): Promise<AdvisoryRequestResponseDto> {
  const response = await apiClient.post<AdvisoryRequestResponseDto>(
    `/advisory-requests/${id}/reject`,
    { rejection_reason }
  );
  return response.data;
}
