/**
 * Dashboard API Types
 * Type definitions for dashboard statistics endpoints
 */

// ========================================
// PROFESSOR DASHBOARD TYPES
// ========================================

/**
 * Professor Advisory with student info
 */
export interface ProfessorAdvisory {
  advisory_id: number;
  student_name: string;
  student_id: string;
  subject: string;
  date: string; // ISO datetime
  start_time: string; // "HH:MM:SS"
  end_time: string; // "HH:MM:SS"
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

/**
 * Professor's next availability slot
 */
export interface ProfessorAvailabilitySlot {
  availability_id: number;
  day_of_week: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  start_time: string; // "HH:MM:SS"
  end_time: string; // "HH:MM:SS"
  venue_id: number;
  venue_name: string;
  is_available: boolean;
}

/**
 * Professor dashboard overview metrics
 */
export interface ProfessorDashboardOverview {
  total_active_advisories: number;
  pending_requests: number;
  students_helped_this_month: number;
  upcoming_sessions: number;
}

/**
 * Professor recent activity data
 */
export interface ProfessorRecentActivity {
  last_advisories: ProfessorAdvisory[];
  next_availability_slot: ProfessorAvailabilitySlot | null;
}

/**
 * Professor statistics
 */
export interface ProfessorStatistics {
  total_subjects: number;
  total_hours_this_semester: number;
  average_rating: number;
  completion_rate: number;
  total_students_helped: number;
}

/**
 * Complete professor dashboard stats response
 */
export interface ProfessorDashboardStats {
  overview: ProfessorDashboardOverview;
  recent_activity: ProfessorRecentActivity;
  statistics: ProfessorStatistics;
}

// ========================================
// STUDENT DASHBOARD TYPES
// ========================================

/**
 * Student's next advisory details
 */
export interface NextAdvisory {
  advisory_id: number;
  professor_name: string;
  professor_id: number;
  subject: string;
  date: string; // ISO datetime
  start_time: string; // "HH:MM:SS"
  end_time: string; // "HH:MM:SS"
  venue_name: string;
  venue_type: 'virtual' | 'physical';
  venue_details?: string; // URL for virtual, location for physical
}

/**
 * Student advisory record
 */
export interface StudentAdvisory {
  advisory_id: number;
  professor_name: string;
  subject: string;
  date: string; // ISO datetime
  start_time: string; // "HH:MM:SS"
  end_time: string; // "HH:MM:SS"
  status: 'scheduled' | 'completed' | 'cancelled';
  rating?: number; // 1-5
  feedback?: string;
}

/**
 * Available professor information
 */
export interface AvailableProfessor {
  professor_id: number;
  name: string;
  last_name: string;
  department: string;
  subjects: string[];
  average_rating: number;
  total_advisories_given: number;
  next_available_slot?: {
    day_of_week: string;
    start_time: string; // "HH:MM:SS"
    end_time: string; // "HH:MM:SS"
  };
}

/**
 * Student dashboard overview metrics
 */
export interface StudentDashboardOverview {
  active_advisories: number;
  completed_advisories: number;
  pending_requests: number;
  next_advisory: NextAdvisory | null;
}

/**
 * Student recent activity data
 */
export interface StudentRecentActivity {
  recent_advisories: StudentAdvisory[];
  available_professors: AvailableProfessor[];
}

/**
 * Student statistics
 */
export interface StudentStatistics {
  total_advisories_attended: number;
  subjects_covered: string[];
  total_hours_received: number;
  average_attendance_rate: number;
}

/**
 * Complete student dashboard stats response
 */
export interface StudentDashboardStats {
  overview: StudentDashboardOverview;
  recent_activity: StudentRecentActivity;
  statistics: StudentStatistics;
}
