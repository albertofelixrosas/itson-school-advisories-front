/**
 * Color Palette Configuration
 * School Advisories System
 * 
 * Centralized color definitions for consistent theming
 */

export const colors = {
  // Primary colors (Blue)
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
    lighter: '#90caf9',
    darker: '#0d47a1',
  },

  // Secondary colors (Pink/Red)
  secondary: {
    main: '#dc004e',
    light: '#f50057',
    dark: '#c51162',
    lighter: '#ff4081',
    darker: '#880e4f',
  },

  // Status colors
  success: {
    main: '#4caf50',
    light: '#81c784',
    dark: '#388e3c',
  },

  error: {
    main: '#f44336',
    light: '#e57373',
    dark: '#d32f2f',
  },

  warning: {
    main: '#ff9800',
    light: '#ffb74d',
    dark: '#f57c00',
  },

  info: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#1976d2',
  },

  // Role-specific colors
  roles: {
    student: '#2196f3',    // Blue
    professor: '#4caf50',  // Green
    admin: '#f44336',      // Red
  },

  // Advisory status colors
  advisoryStatus: {
    active: '#4caf50',      // Green
    inactive: '#9e9e9e',    // Gray
    completed: '#2196f3',   // Blue
    cancelled: '#f44336',   // Red
  },

  // Request status colors
  requestStatus: {
    pending: '#ff9800',     // Orange
    approved: '#4caf50',    // Green
    rejected: '#f44336',    // Red
    cancelled: '#9e9e9e',   // Gray
  },

  // Invitation status colors
  invitationStatus: {
    pending: '#ff9800',     // Orange
    accepted: '#4caf50',    // Green
    declined: '#f44336',    // Red
    expired: '#9e9e9e',     // Gray
  },

  // Attendance status colors
  attendanceStatus: {
    present: '#4caf50',     // Green
    absent: '#f44336',      // Red
    late: '#ff9800',        // Orange
  },

  // Neutral colors
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Background colors
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
    dark: '#121212',
  },

  // Text colors
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.6)',
    disabled: 'rgba(0, 0, 0, 0.38)',
    hint: 'rgba(0, 0, 0, 0.38)',
  },
};

/**
 * Get color by role
 */
export const getRoleColor = (role: 'student' | 'professor' | 'admin'): string => {
  return colors.roles[role] || colors.primary.main;
};

/**
 * Get color by advisory status
 */
export const getAdvisoryStatusColor = (
  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED' | 'CANCELLED'
): string => {
  const statusMap = {
    ACTIVE: colors.advisoryStatus.active,
    INACTIVE: colors.advisoryStatus.inactive,
    COMPLETED: colors.advisoryStatus.completed,
    CANCELLED: colors.advisoryStatus.cancelled,
  };
  return statusMap[status] || colors.grey[500];
};

/**
 * Get color by request status
 */
export const getRequestStatusColor = (
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
): string => {
  const statusMap = {
    PENDING: colors.requestStatus.pending,
    APPROVED: colors.requestStatus.approved,
    REJECTED: colors.requestStatus.rejected,
    CANCELLED: colors.requestStatus.cancelled,
  };
  return statusMap[status] || colors.grey[500];
};

/**
 * Get color by invitation status
 */
export const getInvitationStatusColor = (
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED'
): string => {
  const statusMap = {
    PENDING: colors.invitationStatus.pending,
    ACCEPTED: colors.invitationStatus.accepted,
    DECLINED: colors.invitationStatus.declined,
    EXPIRED: colors.invitationStatus.expired,
  };
  return statusMap[status] || colors.grey[500];
};

/**
 * Get color by attendance status
 */
export const getAttendanceStatusColor = (
  status: 'PRESENT' | 'ABSENT' | 'LATE'
): string => {
  const statusMap = {
    PRESENT: colors.attendanceStatus.present,
    ABSENT: colors.attendanceStatus.absent,
    LATE: colors.attendanceStatus.late,
  };
  return statusMap[status] || colors.grey[500];
};

export default colors;
