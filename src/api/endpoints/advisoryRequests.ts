/**
 * Advisory Requests API Endpoints
 * API methods for managing advisory requests between students and professors
 */

import { apiClient } from '../client';
import type {
  AdvisoryRequest,
  CreateAdvisoryRequestDto,
  ApproveRequestDto,
  RejectRequestDto,
  AvailableSchedulesResponse,
} from '../types/advisoryRequests.types';

/**
 * Create a new advisory request (STUDENT role required)
 * 
 * Endpoint: POST /advisory-requests
 * 
 * @param data - Request data with subject_detail_id and optional message
 * @returns Promise with created advisory request
 * @throws {Error} If user already has a pending request for this subject
 */
export async function createAdvisoryRequest(
  data: CreateAdvisoryRequestDto
): Promise<AdvisoryRequest> {
  const response = await apiClient.post<AdvisoryRequest>(
    '/advisory-requests',
    data
  );
  return response.data;
}

/**
 * Get all requests for the authenticated student
 * 
 * Endpoint: GET /advisory-requests/my-requests
 * 
 * @returns Promise with array of student's advisory requests
 */
export async function getMyRequests(): Promise<AdvisoryRequest[]> {
  const response = await apiClient.get<AdvisoryRequest[]>(
    '/advisory-requests/my-requests'
  );
  return response.data;
}

/**
 * Get all pending requests for the authenticated professor
 * 
 * Endpoint: GET /advisory-requests/pending
 * WARNING: Use /pending NOT /professor/pending
 * 
 * @returns Promise with array of pending advisory requests
 */
export async function getPendingRequests(): Promise<AdvisoryRequest[]> {
  const response = await apiClient.get<AdvisoryRequest[]>(
    '/advisory-requests/pending'
  );
  return response.data;
}

/**
 * Approve an advisory request (PROFESSOR role required)
 * 
 * Endpoint: PATCH /advisory-requests/:id/approve
 * 
 * @param requestId - ID of the request to approve
 * @param data - Approval data with professor response and optional proposed date
 * @returns Promise with updated advisory request
 * @throws {Error} If request is not in pending status or professor doesn't own it
 */
export async function approveRequest(
  requestId: number,
  data: ApproveRequestDto
): Promise<AdvisoryRequest> {
  const response = await apiClient.patch<AdvisoryRequest>(
    `/advisory-requests/${requestId}/approve`,
    data
  );
  return response.data;
}

/**
 * Reject an advisory request (PROFESSOR role required)
 * 
 * Endpoint: PATCH /advisory-requests/:id/reject
 * 
 * @param requestId - ID of the request to reject
 * @param data - Rejection data with professor response explaining reason
 * @returns Promise with updated advisory request
 * @throws {Error} If request is not in pending status or professor doesn't own it
 */
export async function rejectRequest(
  requestId: number,
  data: RejectRequestDto
): Promise<AdvisoryRequest> {
  const response = await apiClient.patch<AdvisoryRequest>(
    `/advisory-requests/${requestId}/reject`,
    data
  );
  return response.data;
}

/**
 * Cancel an advisory request (STUDENT or PROFESSOR can cancel)
 * 
 * Endpoint: DELETE /advisory-requests/:id/cancel
 * Can only cancel requests with status PENDING or APPROVED
 * 
 * @param requestId - ID of the request to cancel
 * @returns Promise with cancelled advisory request
 * @throws {Error} If request cannot be cancelled in current status
 */
export async function cancelRequest(
  requestId: number
): Promise<AdvisoryRequest> {
  const response = await apiClient.delete<AdvisoryRequest>(
    `/advisory-requests/${requestId}/cancel`
  );
  return response.data;
}

/**
 * Get available schedules for a subject detail (STUDENT role required)
 * 
 * Endpoint: GET /advisory-requests/available-schedules/:subjectDetailId
 * 
 * @param subjectDetailId - ID of the subject detail
 * @param dateFrom - Optional start date filter (YYYY-MM-DD)
 * @param dateTo - Optional end date filter (YYYY-MM-DD)
 * @returns Promise with available schedules grouped by date
 */
export async function getAvailableSchedules(
  subjectDetailId: number,
  dateFrom?: string,
  dateTo?: string
): Promise<AvailableSchedulesResponse> {
  const params = new URLSearchParams();
  if (dateFrom) params.append('dateFrom', dateFrom);
  if (dateTo) params.append('dateTo', dateTo);

  const queryString = params.toString();
  const url = `/advisory-requests/available-schedules/${subjectDetailId}${
    queryString ? `?${queryString}` : ''
  }`;

  const response = await apiClient.get<AvailableSchedulesResponse>(url);
  return response.data;
}
