/**
 * Admin API Endpoints
 * School Advisories System
 */

import { apiClient } from '../client';
import type { AdminDashboardStatsDto } from '../types';

/**
 * Admin Dashboard Statistics Interface
 */
export interface AdminDashboardStats {
  users: {
    total: number;
    students: number;
    professors: number;
    admins: number;
    recent_registrations: number;
  };
  advisories: {
    total: number;
    active: number;
    completed: number;
    avg_students_per_session: number;
  };
  sessions: {
    total: number;
    upcoming: number;
    completed: number;
    this_week: number;
    this_month: number;
  };
  requests: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    avg_response_time_hours: number;
  };
  attendance: {
    total_records: number;
    attended: number;
    attendance_rate: number;
  };
  subjects: {
    total: number;
    with_professors: number;
    active_advisories: number;
  };
  top_subjects: Array<{
    subject_id: number;
    subject_name: string;
    sessions_count: number;
    students_served: number;
    request_count: number;
  }>;
  top_professors: Array<{
    user_id: number;
    name: string;
    last_name: string;
    sessions_count: number;
    students_served: number;
    advisory_count: number;
    avg_rating: number;
  }>;
}

const normalizeAdminStats = (stats: AdminDashboardStatsDto): AdminDashboardStats => ({
  ...stats,
  top_subjects: stats.top_subjects.map((subject) => ({
    ...subject,
    request_count: subject.sessions_count,
  })),
  top_professors: stats.top_professors.map((professor) => ({
    ...professor,
    advisory_count: professor.sessions_count,
  })),
});

/**
 * Get admin dashboard statistics
 * Endpoint: GET /users/admin/dashboard/stats
 */
export const getAdminDashboardStats = async (): Promise<AdminDashboardStats> => {
  const response = await apiClient.get<AdminDashboardStatsDto>('/users/admin/dashboard/stats');
  return normalizeAdminStats(response.data);
};
