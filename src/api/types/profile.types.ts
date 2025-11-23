/**
 * Profile API Types
 * School Advisories System
 * 
 * Types for user profile responses
 */

export type UserRole = 'student' | 'professor' | 'admin';

// Información base del usuario (común para todos los roles)
export interface BaseUserInfo {
  user_id: number;
  username: string;
  email: string;
  name: string;
  last_name: string;
  phone_number: string;
  photo_url?: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  role: UserRole;
}

// ===== TIPOS PARA ESTUDIANTE =====

export interface StudentProfile {
  student_id: string;
  career: string;
  semester: number;
  student_code: string;
  enrollment_date: string;
  academic_status: 'active' | 'inactive' | 'suspended';
}

export interface StudentStatistics {
  total_appointments: number;
  completed_sessions: number;
  active_appointments: number;
  total_hours_received: number;
}

export interface AppointmentSummary {
  advisory_date_id?: number;
  date?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  professor_name?: string;
  subject_name?: string;
  status?: string;
}

export interface RecentActivity {
  last_appointment?: AppointmentSummary | null;
  upcoming_appointments: AppointmentSummary[];
  recently_completed: AppointmentSummary[];
}

export interface StudentProfileResponse {
  user_info: BaseUserInfo;
  student_profile: StudentProfile;
  statistics: StudentStatistics;
  recent_activity: RecentActivity;
}

// ===== TIPOS PARA PROFESOR =====

export interface ProfessorProfile {
  employee_id: string;
  department: string;
  faculty: string;
  employee_code: string;
  hire_date: string;
  academic_degree: string;
  specialties: string[];
  office_location: string;
  office_hours: string;
}

export interface SubjectSummary {
  subject_id: number;
  name: string;
  professor_name?: string;
  schedule?: string;
  credits?: number;
}

export interface AssignedSubjects {
  subjects: SubjectSummary[];
  total_subjects: number;
}

export interface ProfessorStatistics {
  total_advisories: number;
  active_advisories: number;
  total_students_helped: number;
  total_hours_taught: number;
  average_rating: number;
}

export interface ScheduleEntry {
  schedule_id?: number;
  day_of_week?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  subject_name?: string;
}

export interface Availability {
  current_schedule: ScheduleEntry[];
  next_available_slot: string;
}

export interface ProfessorProfileResponse {
  user_info: BaseUserInfo;
  professor_profile: ProfessorProfile;
  assigned_subjects: AssignedSubjects;
  statistics: ProfessorStatistics;
  availability: Availability;
}

// ===== TIPOS PARA ADMINISTRADOR =====

export interface AdminProfile {
  employee_id: string;
  department: string;
  position: string;
  access_level: 'full' | 'partial' | 'read-only';
  permissions: string[];
  employee_code: string;
}

export interface SystemInfo {
  last_login: string;
  total_logins: number;
  managed_areas: string[];
}

export interface AdminProfileResponse {
  user_info: BaseUserInfo;
  admin_profile: AdminProfile;
  system_info: SystemInfo;
}

// ===== TIPO UNION =====

export type ProfileResponse =
  | StudentProfileResponse
  | ProfessorProfileResponse
  | AdminProfileResponse;
