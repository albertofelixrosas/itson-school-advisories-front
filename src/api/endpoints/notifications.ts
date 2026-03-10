/**
 * Notifications API Endpoints
 * School Advisories System
 */

import { apiClient } from '../client';
import type {
  CreateEmailTemplateDto,
  EmailTemplate,
  NotificationLogs,
  NotificationPreferences,
  PaginatedResponse,
  UpdateEmailTemplateDto,
  UpdateNotificationPreferencesDto,
} from '../types';

/**
 * Get user's notification preferences
 * Endpoint: GET /notifications/preferences
 */
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const response = await apiClient.get('/notifications/preferences');
  return response.data;
}

/**
 * Update user's notification preferences
 * Endpoint: PATCH /notifications/preferences
 */
export async function updateNotificationPreferences(
  data: UpdateNotificationPreferencesDto
): Promise<NotificationPreferences> {
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
): Promise<NotificationLogs[] | PaginatedResponse<NotificationLogs>> {
  const response = await apiClient.get('/notifications/history', {
    params: { page, limit },
  });
  return response.data;
}

/**
 * Get all notification templates (Admin)
 * Endpoint: GET /notifications/templates
 */
export async function getNotificationTemplates(): Promise<EmailTemplate[]> {
  const response = await apiClient.get<EmailTemplate[]>('/notifications/templates');
  return response.data;
}

/**
 * Create notification template (Admin)
 * Endpoint: POST /notifications/templates
 */
export async function createNotificationTemplate(
  data: CreateEmailTemplateDto
): Promise<EmailTemplate> {
  const response = await apiClient.post<EmailTemplate>('/notifications/templates', data);
  return response.data;
}

/**
 * Update notification template by key (Admin)
 * Endpoint: PATCH /notifications/templates/:key
 */
export async function updateNotificationTemplate(
  key: string,
  data: UpdateEmailTemplateDto
): Promise<EmailTemplate> {
  const response = await apiClient.patch<EmailTemplate>(`/notifications/templates/${key}`, data);
  return response.data;
}

/**
 * Delete notification template by key (Admin)
 * Endpoint: DELETE /notifications/templates/:key
 */
export async function deleteNotificationTemplate(key: string): Promise<void> {
  await apiClient.delete(`/notifications/templates/${key}`);
}

/**
 * Toggle notification template status by key (Admin)
 * Endpoint: PATCH /notifications/templates/:key/toggle
 */
export async function toggleNotificationTemplate(key: string): Promise<EmailTemplate> {
  const response = await apiClient.patch<EmailTemplate>(`/notifications/templates/${key}/toggle`);
  return response.data;
}
