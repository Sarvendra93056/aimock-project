import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Layouts
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { InterviewSetup } from './pages/InterviewSetup';
import { InterviewRoom } from './pages/InterviewRoom';
import { InterviewReport } from './pages/InterviewReport';
import { Analytics } from './pages/Analytics';
import { History } from './pages/History';
import { ResumeInterview } from './pages/ResumeInterview';
import { QuestionBank } from './pages/QuestionBank';
import { AdminDashboard } from './pages/AdminDashboard';
import { Profile } from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes inside Dashboard Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/interview/setup" element={<InterviewSetup />} />
              <Route path="/interview/:id" element={<InterviewRoom />} />
              <Route path="/interview/:id/report" element={<InterviewReport />} />
              <Route path="/interview/resume" element={<ResumeInterview />} />
              <Route path="/question-bank" element={<QuestionBank />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/history" element={<History />} />
              <Route path="/profile" element={<Profile />} />

              {/* Admin-only route */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
