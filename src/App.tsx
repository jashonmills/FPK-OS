import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import LoadingSpinner from '@/components/ui/loading-spinner';
import PrivacyBanner from '@/components/compliance/PrivacyBanner';
import DataProtectionCenter from '@/components/compliance/DataProtectionCenter';
import ConsentManager from '@/components/compliance/ConsentManager';
import PrivacyPolicy from '@/pages/compliance/PrivacyPolicy';
import DataProcessingAgreement from '@/pages/compliance/DataProcessingAgreement';

// Lazy load components
const Login = React.lazy(() => import('@/pages/auth/Login'));
const Register = React.lazy(() => import('@/pages/auth/Register'));
const ForgotPassword = React.lazy(() => import('@/pages/auth/ForgotPassword'));
const LandingPage = React.lazy(() => import('@/pages/LandingPage'));
const About = React.lazy(() => import('@/pages/About'));
const Pricing = React.lazy(() => import('@/pages/Pricing'));
const Contact = React.lazy(() => import('@/pages/Contact'));
const PrivacyDeclined = React.lazy(() => import('@/pages/PrivacyDeclined'));
const BookLibrary = React.lazy(() => import('@/pages/BookLibrary'));
const BookReader = React.lazy(() => import('@/pages/BookReader'));
const Dashboard = React.lazy(() => import('@/pages/dashboard/Dashboard'));
const Settings = React.lazy(() => import('@/pages/dashboard/Settings'));
const Subscription = React.lazy(() => import('@/pages/dashboard/Subscription'));
const AdminDashboard = React.lazy(() => import('@/pages/admin/AdminDashboard'));
const UserManagement = React.lazy(() => import('@/pages/admin/UserManagement'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const LazyRoute = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Authentication Routes */}
              <Route path="/login" element={<LazyRoute><Login /></LazyRoute>} />
              <Route path="/register" element={<LazyRoute><Register /></LazyRoute>} />
              <Route path="/forgot-password" element={<LazyRoute><ForgotPassword /></LazyRoute>} />

              {/* Public Routes */}
              <Route path="/" element={<LazyRoute><LandingPage /></LazyRoute>} />
              <Route path="/about" element={<LazyRoute><About /></LazyRoute>} />
              <Route path="/pricing" element={<LazyRoute><Pricing /></LazyRoute>} />
              <Route path="/contact" element={<LazyRoute><Contact /></LazyRoute>} />
              <Route path="/privacy-declined" element={<LazyRoute><PrivacyDeclined /></LazyRoute>} />
              <Route path="/books" element={<LazyRoute><BookLibrary /></LazyRoute>} />
              <Route path="/books/:bookId" element={<LazyRoute><BookReader /></LazyRoute>} />

              {/* Compliance Routes */}
              <Route path="/privacy-policy" element={<LazyRoute><PrivacyPolicy /></LazyRoute>} />
              <Route path="/data-protection" element={<LazyRoute><DataProtectionCenter /></LazyRoute>} />
              <Route path="/privacy-preferences" element={<LazyRoute><ConsentManager /></LazyRoute>} />
              <Route path="/data-processing-agreement" element={<LazyRoute><DataProcessingAgreement /></LazyRoute>} />
              <Route path="/cookie-policy" element={<LazyRoute><PrivacyPolicy /></LazyRoute>} />
              <Route path="/security-practices" element={<LazyRoute><DataProcessingAgreement /></LazyRoute>} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route path="learner" element={<LazyRoute><Dashboard /></LazyRoute>} />
                <Route path="settings" element={<LazyRoute><Settings /></LazyRoute>} />
                <Route path="subscription" element={<LazyRoute><Subscription /></LazyRoute>} />
                <Route index element={<Navigate to="learner" replace />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route path="dashboard" element={<LazyRoute><AdminDashboard /></LazyRoute>} />
                <Route path="users" element={<LazyRoute><UserManagement /></LazyRoute>} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            {/* Add Privacy Banner globally */}
            <PrivacyBanner />
          </div>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
