/**
 * Subject Details API Endpoints
 * School Advisories System
 * 
 * Endpoints for managing professor-subject assignments
 */

import { apiClient } from '../client';

/**
 * Subject Detail Interface
 */
export interface SubjectDetail {
  subject_detail_id: number;
  subject_id: number;
  professor_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  subject: {
    subject_id: number;
    subject: string;
  };
  professor: {
    user_id: number;
    name: string;
    last_name: string;
    email: string;
    photo_url: string | null;
  };
  schedules?: Array<{
    subject_schedule_id: number;
    day: string;
    start_time: string;
    end_time: string;
    subject_details_id: number;
  }>;
}

/**
 * Create Subject Detail DTO
 */
export interface CreateSubjectDetailDto {
  subject_id: number;
  professor_id: number;
  schedules?: Array<{
    day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
    start_time: string; // HH:mm format
    end_time: string;   // HH:mm format
  }>;
}

/**
 * Update Subject Detail DTO
 */
export interface UpdateSubjectDetailDto {
  subject_id?: number;
  professor_id?: number;
  is_active?: boolean;
  schedules?: Array<{
    day: string;
    start_time: string;
    end_time: string;
  }>;
}

/**
 * Get all subject details (assignments)
 * Endpoint: GET /subject-details
 */
export const getAllSubjectDetails = async (): Promise<SubjectDetail[]> => {
  const response = await apiClient.get<SubjectDetail[]>('/subject-details');
  return response.data;
};

/**
 * Get subject details by ID
 * Endpoint: GET /subject-details/:id
 */
export const getSubjectDetailById = async (id: number): Promise<SubjectDetail> => {
  const response = await apiClient.get<SubjectDetail>(`/subject-details/${id}`);
  return response.data;
};

/**
 * Get subject details by professor
 * Endpoint: GET /subject-details/professor/:professorId
 */
export const getSubjectDetailsByProfessor = async (
  professorId: number
): Promise<SubjectDetail[]> => {
  const response = await apiClient.get<SubjectDetail[]>(
    `/subject-details/professor/${professorId}`
  );
  return response.data;
};

/**
 * Get professors for a subject
 * Endpoint: GET /subject-details/subject/:subjectId/professors
 */
export const getProfessorsBySubject = async (
  subjectId: number
): Promise<SubjectDetail[]> => {
  const response = await apiClient.get<SubjectDetail[]>(
    `/subject-details/subject/${subjectId}/professors`
  );
  return response.data;
};

/**
 * Create subject detail (assignment)
 * Endpoint: POST /subject-details
 */
export const createSubjectDetail = async (
  data: CreateSubjectDetailDto
): Promise<SubjectDetail> => {
  const response = await apiClient.post<SubjectDetail>('/subject-details', data);
  return response.data;
};

/**
 * Update subject detail
 * Endpoint: PATCH /subject-details/:id
 */
export const updateSubjectDetail = async (
  id: number,
  data: UpdateSubjectDetailDto
): Promise<SubjectDetail> => {
  const response = await apiClient.patch<SubjectDetail>(
    `/subject-details/${id}`,
    data
  );
  return response.data;
};

/**
 * Delete subject detail
 * Endpoint: DELETE /subject-details/:id
 */
export const deleteSubjectDetail = async (id: number): Promise<void> => {
  await apiClient.delete(`/subject-details/${id}`);
};

/**
 * Toggle subject detail status
 * Endpoint: PATCH /subject-details/:id/toggle-status
 */
export const toggleSubjectDetailStatus = async (
  id: number
): Promise<SubjectDetail> => {
  const response = await apiClient.patch<SubjectDetail>(
    `/subject-details/${id}/toggle-status`
  );
  return response.data;
};

/**
 * Check if professor is assigned to subject
 * Endpoint: GET /subject-details/check/:professorId/:subjectId
 */
export const checkSubjectAssignment = async (
  professorId: number,
  subjectId: number
): Promise<{ assigned: boolean; assignment?: SubjectDetail }> => {
  const response = await apiClient.get(
    `/subject-details/check/${professorId}/${subjectId}`
  );
  return response.data;
};
