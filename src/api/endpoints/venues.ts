/**
 * Venues API Endpoints
 * School Advisories System
 */

import { apiClient } from '../client';
import type { Venue } from '../types';

/**
 * Get all venues
 */
export async function getAllVenues(): Promise<Venue[]> {
  const response = await apiClient.get<Venue[]>('/venues');
  return response.data;
}

/**
 * Get active venues only
 */
export async function getActiveVenues(): Promise<Venue[]> {
  const response = await apiClient.get<Venue[]>('/venues/active');
  return response.data;
}

/**
 * Get venue by ID
 */
export async function getVenueById(venueId: number): Promise<Venue> {
  const response = await apiClient.get<Venue>(`/venues/${venueId}`);
  return response.data;
}
