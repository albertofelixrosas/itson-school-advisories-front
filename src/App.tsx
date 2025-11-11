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
const StudentDashboard = lazy(() => import("@/pages/student/StudentDashboard"));
const ProfessorDashboard = lazy(
  () => import("@/pages/professor/ProfessorDashboard")
);
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));

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

              {/* Protected Routes - Professor */}
              <Route
                path="/professor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.PROFESSOR]}>
                    <ProfessorDashboard />
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
