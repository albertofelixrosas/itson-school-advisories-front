/**
 * Main App Component
 * School Advisories System
 *
 * Root component with all providers and routing
 */

import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryProvider } from "@/contexts/QueryContext";
import { PageLoader, ProtectedRoute } from "@/components/common";
import "./App.css";

// Lazy load pages
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const UnauthorizedPage = lazy(() => import("@/pages/auth/UnauthorizedPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));

// Student pages
const StudentDashboard = lazy(() => import("@/pages/student/StudentDashboard"));
const NewRequestPage = lazy(() => import("@/pages/student/NewRequestPage"));
const StudentMyRequests = lazy(() => import("@/pages/student/StudentMyRequests"));
const InvitationsPage = lazy(() => import("@/pages/student/InvitationsPage"));
const SessionsPage = lazy(() => import("@/pages/student/SessionsPage"));

// Professor pages
const ProfessorDashboard = lazy(
  () => import("@/pages/professor/ProfessorDashboard")
);
const ProfessorPendingRequests = lazy(
  () => import("@/pages/professor/ProfessorPendingRequests")
);
const CreateSessionPage = lazy(
  () => import("@/pages/professor/CreateSessionPage")
);
const AvailabilityPage = lazy(
  () => import("@/pages/professor/AvailabilityPage")
);
const ManageSessionsPage = lazy(
  () => import("@/pages/professor/ManageSessionsPage")
);

// Admin pages
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const AdminUsersPage = lazy(() => import("@/pages/admin/AdminUsersPage").then(m => ({ default: m.AdminUsersPage })));
const AdminSubjectsPage = lazy(() => import("@/pages/admin/AdminSubjectsPage").then(m => ({ default: m.AdminSubjectsPage })));
const AdminVenuesPage = lazy(() => import("@/pages/admin/AdminVenuesPage").then(m => ({ default: m.AdminVenuesPage })));
const AdminSubjectDetailsPage = lazy(() => import("@/pages/admin/AdminSubjectDetailsPage"));

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Profile Route - Available to all authenticated users */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['student', 'professor', 'admin']}>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Student */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/new-request"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <NewRequestPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/requests"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentMyRequests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/invitations"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <InvitationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/sessions"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <SessionsPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Professor */}
              <Route
                path="/professor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['professor']}>
                    <ProfessorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/professor/requests"
                element={
                  <ProtectedRoute allowedRoles={['professor']}>
                    <ProfessorPendingRequests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/professor/create-session"
                element={
                  <ProtectedRoute allowedRoles={['professor']}>
                    <CreateSessionPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/professor/availability"
                element={
                  <ProtectedRoute allowedRoles={['professor']}>
                    <AvailabilityPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/professor/sessions"
                element={
                  <ProtectedRoute allowedRoles={['professor']}>
                    <ManageSessionsPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Admin */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminUsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/subjects"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminSubjectsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/venues"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminVenuesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/subject-details"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminSubjectDetailsPage />
                  </ProtectedRoute>
                }
              />

              {/* Root Redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* 404 - Catch All */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>

          {/* Toast notifications */}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
                fontSize: "14px",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
              },
              success: {
                duration: 3000,
                style: {
                  background: "#4caf50",
                },
                iconTheme: {
                  primary: "#fff",
                  secondary: "#4caf50",
                },
              },
              error: {
                duration: 5000,
                style: {
                  background: "#f44336",
                },
                iconTheme: {
                  primary: "#fff",
                  secondary: "#f44336",
                },
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
