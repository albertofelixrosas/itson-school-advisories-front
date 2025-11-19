/**
 * Advisories API Endpoints
 * School Advisories System
 */

import { apiClient } from '../client';
import type { Advisory, AdvisoryDate, CreateDirectSessionDto } from '../types';

/**
 * Get my advisory sessions as student
 * Endpoint: GET /advisories/my-sessions
 */
export async function getMySessions(): Promise<AdvisoryDate[]> {
  const response = await apiClient.get<AdvisoryDate[]>('/advisories/my-sessions');
  return response.data;
}

/**
 * Get advisory by ID
 * Endpoint: GET /advisories/:id
 */
export async function getAdvisoryById(id: number): Promise<Advisory> {
  const response = await apiClient.get<Advisory>(`/advisories/${id}`);
  return response.data;
}

/**
 * Get advisory dates for a specific advisory
 * Endpoint: GET /advisories/:id/dates
 */
export async function getAdvisoryDates(advisoryId: number): Promise<AdvisoryDate[]> {
  const response = await apiClient.get<AdvisoryDate[]>(`/advisories/${advisoryId}/dates`);
  return response.data;
}

/**
 * Create a direct advisory session (Professor only)
 * Endpoint: POST /advisories/direct-session
 */
export async function createDirectSession(data: CreateDirectSessionDto): Promise<AdvisoryDate> {
  const response = await apiClient.post<AdvisoryDate>('/advisories/direct-session', data);
  return response.data;
}

/**
 * Get my advisory sessions as professor
 * Endpoint: GET /advisories/my-advisories
 */
export async function getMyAdvisories(): Promise<Advisory[]> {
  const response = await apiClient.get<Advisory[]>('/advisories/my-advisories');
  return response.data;
}
