/**
 * Venues API Endpoints
 * School Advisories System
 */

import { apiClient } from '../client';
import type { Venue, CreateVenueDto, UpdateVenueDto } from '../types';

/**
 * Paginated Response from backend
 */
interface PaginatedVenues {
  data: Venue[];
  total: number;
  page: number;
  lastPage: number;
}

/**
 * Get all venues
 */
export async function getAllVenues(): Promise<Venue[]> {
  const response = await apiClient.get<PaginatedVenues>('/venues');
  return response.data.data; // Extract the 'data' array from paginated response
}

/**
 * Get all venues (using high limit to get all for selection)
 * Uses the documented /venues endpoint instead of non-existent /venues/active
 */
export async function getActiveVenues(): Promise<Venue[]> {
  const response = await apiClient.get<PaginatedVenues>('/venues', {
    params: { limit: 100 } // Get many venues for selector
  });
  return response.data.data; // Extract venues array from paginated response
}

/**
 * Get venue by ID
 */
export async function getVenueById(venueId: number): Promise<Venue> {
  const response = await apiClient.get<Venue>(`/venues/${venueId}`);
  return response.data;
}

/**
 * Create new venue (Admin only)
 */
export async function createVenue(data: CreateVenueDto): Promise<Venue> {
  const response = await apiClient.post<Venue>('/venues', data);
  return response.data;
}

/**
 * Update venue (Admin only)
 */
export async function updateVenue(venueId: number, data: UpdateVenueDto): Promise<Venue> {
  const response = await apiClient.put<Venue>(`/venues/${venueId}`, data);
  return response.data;
}

/**
 * Delete venue (Admin only)
 */
export async function deleteVenue(venueId: number): Promise<void> {
  await apiClient.delete(`/venues/${venueId}`);
}

/**
 * Toggle venue active status (Admin only)
 */
export async function toggleVenueStatus(venueId: number): Promise<Venue> {
  const response = await apiClient.patch<Venue>(`/venues/${venueId}/toggle-status`);
  return response.data;
}
