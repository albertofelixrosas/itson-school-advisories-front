/**
 * Attendance API Endpoints
 * School Advisories System
 */

import { apiClient } from '../client';
import type {
  BulkAttendanceDto,
  CompleteSessionDto,
  SessionStudentsResponseDto,
} from '../types';

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
export async function getSessionAttendance(sessionId: number): Promise<unknown> {
  const response = await apiClient.get(`/advisory-attendance/session/${sessionId}`);
  return response.data;
}

/**
 * Get enrolled students for a session
 * Endpoint: GET /advisories/sessions/:sessionId/students
 */
export async function getSessionStudents(
  sessionId: number
): Promise<SessionStudentsResponseDto> {
  const response = await apiClient.get<SessionStudentsResponseDto>(
    `/advisories/sessions/${sessionId}/students`
  );
  return response.data;
}
