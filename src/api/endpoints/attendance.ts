/**
 * Attendance API Endpoints
 * School Advisories System
 */

import { apiClient } from '../client';
import type { BulkAttendanceDto, CompleteSessionDto, User } from '../types';

/**
 * Session Students Response Interface
 */
export interface SessionStudentsResponse {
  session: {
    advisory_date_id: number;
    advisory_id: number;
    topic: string;
    date: string;
    notes: string;
    session_link?: string;
    venue: {
      venue_id: number;
      building: string;
      classroom: string;
      capacity: number;
    };
    subject: {
      subject_id: number;
      subject_name: string;
    };
    professor: {
      user_id: number;
      name: string;
      last_name: string;
      email: string;
      photo_url?: string;
    };
    max_students: number;
    completed_at?: string;
  };
  students: Array<{
    user_id: number;
    student_id: string;
    name: string;
    last_name: string;
    email: string;
    photo_url?: string;
    phone_number?: string;
    attended: boolean;
    attendance_notes?: string;
    join_type: string;
  }>;
  total_students: number;
  attended_count: number;
  absent_count: number;
  attendance_rate: number;
}

/**
 * Register bulk attendance for a session
 * Endpoint: POST /advisory-attendance/session/:sessionId/bulk-attendance
 */
export async function registerBulkAttendance(
  sessionId: number,
  data: BulkAttendanceDto
): Promise<void> {
  await apiClient.post(`/advisory-attendance/session/${sessionId}/bulk-attendance`, data);
}

/**
 * Complete a session with notes and summary
 * Endpoint: PATCH /advisory-attendance/session/:sessionId/complete
 */
export async function completeSession(
  sessionId: number,
  data: CompleteSessionDto
): Promise<void> {
  await apiClient.patch(`/advisory-attendance/session/${sessionId}/complete`, data);
}

/**
 * Get attendance records for a session
 * Endpoint: GET /advisory-attendance/session/:sessionId
 */
export async function getSessionAttendance(sessionId: number): Promise<any> {
  const response = await apiClient.get(`/advisory-attendance/session/${sessionId}`);
  return response.data;
}

/**
 * Get enrolled students for a session
 * Endpoint: GET /advisories/sessions/:sessionId/students
 */
export async function getSessionStudents(
  sessionId: number
): Promise<SessionStudentsResponse> {
  const response = await apiClient.get<SessionStudentsResponse>(
    `/advisories/sessions/${sessionId}/students`
  );
  return response.data;
}
