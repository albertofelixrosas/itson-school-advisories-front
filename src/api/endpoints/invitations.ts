/**
 * Student Invitations API Endpoints
 * School Advisories System
 */

import { apiClient } from '../client';
import type {
  InvitationResponseDto,
  PaginatedResponse,
  RespondInvitationDto,
} from '../types';

/**
 * Get all my invitations (Student)
 * Endpoint: GET /student-invitations/my-invitations
 */
export async function getMyInvitations(
  page = 1,
  limit = 20
): Promise<PaginatedResponse<InvitationResponseDto>> {
  const response = await apiClient.get<PaginatedResponse<InvitationResponseDto>>(
    '/student-invitations/my-invitations',
    {
      params: { page, limit },
    }
  );
  return response.data;
}

/**
 * Get invitation by ID
 * Endpoint: GET /student-invitations/:id
 */
export async function getInvitationById(id: number): Promise<InvitationResponseDto> {
  const response = await apiClient.get<InvitationResponseDto>(`/student-invitations/${id}`);
  return response.data;
}

/**
 * Accept invitation (Student)
 * Endpoint: POST /student-invitations/:id/respond
 */
export async function acceptInvitation(
  id: number,
  response_message?: string
): Promise<InvitationResponseDto> {
  const data: RespondInvitationDto = {
    response: 'accept',
    response_message,
  };
  const response = await apiClient.post<InvitationResponseDto>(
    `/student-invitations/${id}/respond`,
    data
  );
  return response.data;
}

/**
 * Decline invitation (Student)
 * Endpoint: POST /student-invitations/:id/respond
 */
export async function declineInvitation(
  id: number,
  response_message?: string
): Promise<InvitationResponseDto> {
  const data: RespondInvitationDto = {
    response: 'decline',
    response_message,
  };
  const response = await apiClient.post<InvitationResponseDto>(
    `/student-invitations/${id}/respond`,
    data
  );
  return response.data;
}
