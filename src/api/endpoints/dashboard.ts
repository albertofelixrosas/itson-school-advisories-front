/**
 * Dashboard API Endpoints
 * Endpoints for fetching dashboard statistics for professors and students
 */

import { apiClient } from '../client';
import type { ProfessorDashboardStats, StudentDashboardStats } from '../types/dashboard.types';

/**
 * Get professor dashboard statistics
 * 
 * Fetches comprehensive dashboard data for professors including:
 * - Overview metrics (active advisories, pending requests, etc.)
 * - Recent activity (last advisories, next availability)
 * - Statistics (total subjects, hours, rating, completion rate)
 * 
 * Endpoint: GET /users/professor/dashboard/stats
 * 
 * @returns Promise with professor dashboard stats
 * @throws {Error} If user is not authenticated or not a professor
 */
export async function getProfessorDashboard(): Promise<ProfessorDashboardStats> {
  const response = await apiClient.get<ProfessorDashboardStats>(
    '/users/professor/dashboard/stats'
  );
  return response.data;
}

/**
 * Get student dashboard statistics
 * 
 * Fetches comprehensive dashboard data for students including:
 * - Overview metrics (active/completed advisories, pending requests)
 * - Next scheduled advisory details
 * - Recent activity (past advisories, available professors)
 * - Statistics (total advisories, subjects, hours, attendance rate)
 * 
 * Endpoint: GET /users/student/dashboard/stats
 * 
 * @returns Promise with student dashboard stats
 * @throws {Error} If user is not authenticated or not a student
 */
export async function getStudentDashboard(): Promise<StudentDashboardStats> {
  const response = await apiClient.get<StudentDashboardStats>(
    '/users/student/dashboard/stats'
  );
  return response.data;
}
