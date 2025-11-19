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
import { UserRole } from "@/types";
import "./App.css";

// Lazy load pages
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const UnauthorizedPage = lazy(() => import("@/pages/auth/UnauthorizedPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

// Student pages
const StudentDashboard = lazy(() => import("@/pages/student/StudentDashboard"));
const NewRequestPage = lazy(() => import("@/pages/student/NewRequestPage"));
const MyRequestsPage = lazy(() => import("@/pages/student/MyRequestsPage"));
const InvitationsPage = lazy(() => import("@/pages/student/InvitationsPage"));
const SessionsPage = lazy(() => import("@/pages/student/SessionsPage"));

// Professor pages
const ProfessorDashboard = lazy(
  () => import("@/pages/professor/ProfessorDashboard")
);
const PendingRequestsPage = lazy(
  () => import("@/pages/professor/PendingRequestsPage")
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
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminUsersPage = lazy(() => import("@/pages/admin/AdminUsersPage"));
const AdminSubjectsPage = lazy(() => import("@/pages/admin/AdminSubjectsPage"));
const AdminVenuesPage = lazy(() => import("@/pages/admin/AdminVenuesPage"));

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

              {/* Protected Routes - Student */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/new-request"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                    <NewRequestPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/requests"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                    <MyRequestsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/invitations"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                    <InvitationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/sessions"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                    <SessionsPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Professor */}
              <Route
                path="/professor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.PROFESSOR]}>
                    <ProfessorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/professor/requests"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.PROFESSOR]}>
                    <PendingRequestsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/professor/create-session"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.PROFESSOR]}>
                    <CreateSessionPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/professor/availability"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.PROFESSOR]}>
                    <AvailabilityPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/professor/sessions"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.PROFESSOR]}>
                    <ManageSessionsPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Admin */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                    <AdminUsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/subjects"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                    <AdminSubjectsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/venues"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                    <AdminVenuesPage />
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
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#4caf50",
                  secondary: "#fff",
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: "#f44336",
                  secondary: "#fff",
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
