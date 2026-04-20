/**
 * API Endpoints Barrel Export
 * School Advisories System
 */

export * from './auth';
export {
	getAllProfessors,
	getProfessorById,
	getProfessorSubjects,
	getPendingRequests as getProfessorPendingRequests,
	reviewRequest,
	getMyAvailability,
	createAvailability,
	updateAvailability,
	deleteAvailability,
} from './professors';
export {
	getAllSubjects,
	getAllSubjectDetails as getAllSubjectDetailsFromSubjects,
	getSubjectById,
	createSubject,
	updateSubject,
	deleteSubject,
	toggleSubjectStatus,
} from './subjects';
export * from './advisoryRequests';
export * from './invitations';
export * from './advisories';
export * from './dashboard';
export * from './venues';
export * from './users';
export * from './attendance';
export * from './notifications';
export * from './admin';
export * from './subjectDetails';
