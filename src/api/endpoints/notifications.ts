/**
 * Notifications API Endpoints
 * School Advisories System
 */

import { apiClient } from '../client';
import type { UpdateNotificationPreferencesDto } from '../types';

/**
 * Get user's notification preferences
 * Endpoint: GET /notifications/preferences
 */
export async function getNotificationPreferences(): Promise<any> {
  const response = await apiClient.get('/notifications/preferences');
  return response.data;
}

/**
 * Update user's notification preferences
 * Endpoint: PATCH /notifications/preferences
 */
export async function updateNotificationPreferences(
  data: UpdateNotificationPreferencesDto
): Promise<any> {
  const response = await apiClient.patch('/notifications/preferences', data);
  return response.data;
}

/**
 * Get notification history
 * Endpoint: GET /notifications/history
 */
export async function getNotificationHistory(
  page = 1,
  limit = 20
): Promise<any> {
  const response = await apiClient.get('/notifications/history', {
    params: { page, limit },
  });
  return response.data;
}
