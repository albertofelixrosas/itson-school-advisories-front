/**
 * Dashboard API Endpoints
 * School Advisories System
 */

import { apiClient } from '../client';
import type { DashboardDataDto } from '../types';

/**
 * Get student dashboard data
 * Endpoint: GET /dashboard/student
 */
export async function getStudentDashboard(): Promise<DashboardDataDto> {
  const response = await apiClient.get<DashboardDataDto>('/dashboard/student');
  return response.data;
}

/**
 * Get professor dashboard data
 * Endpoint: GET /dashboard/professor
 */
export async function getProfessorDashboard(): Promise<DashboardDataDto> {
  const response = await apiClient.get<DashboardDataDto>('/dashboard/professor');
  return response.data;
}

/**
 * Get admin dashboard data
 * Endpoint: GET /dashboard/admin
 */
export async function getAdminDashboard(): Promise<DashboardDataDto> {
  const response = await apiClient.get<DashboardDataDto>('/dashboard/admin');
  return response.data;
}
