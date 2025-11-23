/**
 * Advisory Requests API Types
 * Type definitions for student advisory request management
 */

// ============================================
// ENUMS
// ============================================

/**
 * Advisory request status states
 */
export const RequestStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
} as const;

export type RequestStatus = typeof RequestStatus[keyof typeof RequestStatus];

// ============================================
// DTOs (Data Transfer Objects)
// ============================================

/**
 * DTO for creating a new advisory request
 */
export interface CreateAdvisoryRequestDto {
  subject_detail_id: number;
  student_message?: string;
}

/**
 * DTO for approving a request (professor)
 */
export interface ApproveRequestDto {
  professor_response: string;
  proposed_date?: string; // ISO datetime string
}

/**
 * DTO for rejecting a request (professor)
 */
export interface RejectRequestDto {
  professor_response: string;
}

// ============================================
// RESPONSE TYPES
// ============================================

/**
 * Student information in advisory request
 */
export interface StudentInfo {
  user_id: number;
  name: string;
  last_name: string;
  email: string;
  student_id: string;
}

/**
 * Professor information in advisory request
 */
export interface ProfessorInfo {
  user_id: number;
  name: string;
  last_name: string;
  email: string;
  employee_id: string;
}

/**
 * Subject detail information in advisory request
 */
export interface SubjectDetailInfo {
  subject_detail_id: number;
  subject: {
    subject_id: number;
    subject: string;
  };
}

/**
 * Complete advisory request object
 */
export interface AdvisoryRequest {
  request_id: number;
  student_id: number;
  professor_id: number;
  subject_detail_id: number;
  status: RequestStatus;
  student_message: string | null;
  professor_response: string | null;
  processed_at: string | null;
  processed_by_id: number | null;
  created_at: string;
  updated_at: string;
  
  // Optional relations populated by backend
  student?: StudentInfo;
  professor?: ProfessorInfo;
  subject_detail?: SubjectDetailInfo;
}

// ============================================
// AVAILABLE SCHEDULES TYPES
// ============================================

/**
 * Time slot with availability info
 */
export interface TimeSlot {
  availability_id: number;
  start_time: string; // "HH:MM:SS"
  end_time: string; // "HH:MM:SS"
  available_spots: number;
  max_students: number;
}

/**
 * Available date with its time slots
 */
export interface AvailableDate {
  date: string; // YYYY-MM-DD
  slots: TimeSlot[];
}

/**
 * Response for available schedules endpoint
 */
export interface AvailableSchedulesResponse {
  subject_detail: {
    subject_detail_id: number;
    subject_name: string;
    professor: {
      user_id: number;
      name: string;
      last_name: string;
    };
  };
  available_dates: AvailableDate[];
}

// ============================================
// HELPER TYPES
// ============================================

/**
 * Request filters for querying
 */
export interface RequestFilters {
  status?: RequestStatus;
  dateFrom?: string;
  dateTo?: string;
}
