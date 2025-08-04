import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/useAuth';
import SecurityHeaders from '@/components/security/SecurityHeaders';
import Login from '@/pages/Login';
import Register from '@/pages/auth/Register';
import Dashboard from '@/pages/Dashboard';
import ProtectedRoute from '@/components/ProtectedRoute';
import AccountSettings from '@/pages/dashboard/AccountSettings';
import Subscription from '@/pages/Subscription';
import AdminDashboard from '@/pages/dashboard/admin/AdminDashboard';
import InstructorDashboard from '@/pages/dashboard/instructor/InstructorDashboard';
import LearnerDashboard from '@/pages/dashboard/learner/LearnerDashboard';
import Library from '@/pages/dashboard/learner/Library';
import Courses from '@/pages/dashboard/learner/Courses';
import CourseDetails from '@/pages/dashboard/learner/CourseDetails';
import ModuleDetails from '@/pages/dashboard/learner/ModuleDetails';
import AdminRoute from '@/components/AdminRoute';
import UsersPage from '@/pages/dashboard/admin/UsersPage';
import UATPage from '@/pages/dashboard/admin/UATPage';
import BetaAccessGate from '@/components/beta/BetaAccessGate';
import { useUATAccess } from '@/hooks/useUATAccess';
import UATDashboard from '@/pages/dashboard/uat/UATDashboard';
import PricingPlans from '@/pages/PricingPlans';
import { useSubscriptionGate } from '@/hooks/useSubscriptionGate';
import CheckoutSuccess from '@/pages/CheckoutSuccess';
import CheckoutCancel from '@/pages/CheckoutCancel';
import InstructorRoute from '@/components/InstructorRoute';
import CreateCourse from '@/pages/dashboard/instructor/CreateCourse';
import EditCourse from '@/pages/dashboard/instructor/EditCourse';
import CourseManagement from '@/pages/dashboard/instructor/CourseManagement';
import ModuleManagement from '@/pages/dashboard/instructor/ModuleManagement';
import EditModule from '@/pages/dashboard/instructor/EditModule';
import ViewCourse from '@/pages/ViewCourse';
import ViewModule from '@/pages/ViewModule';
import GamificationDashboard from '@/pages/dashboard/learner/GamificationDashboard';
import { GamificationProvider } from '@/contexts/GamificationContext';
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeProvider } from '@/components/theme-provider';
import { siteConfig } from './config/site';
import { Shell } from '@/components/Shell';
import { DocsPage } from '@/components/Docs/DocsPage';
import { DocsProvider } from '@/components/Docs/DocsProvider';
import { DocsSidebar } from '@/components/Docs/DocsSidebar';
import { DocsHeader } from '@/components/Docs/DocsHeader';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SecurityHeaders />
        <Router>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/pricing" element={<PricingPlans />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/checkout/cancel" element={<CheckoutCancel />} />
              <Route path="/course/:courseId" element={<ViewCourse />} />
              <Route path="/module/:moduleId" element={<ViewModule />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              >
                <Route path="account" element={<AccountSettings />} />

                {/* Admin Routes */}
                <Route
                  path="admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                >
                  <Route path="users" element={<UsersPage />} />
                  <Route path="uat" element={<UATPage />} />
                </Route>

                {/* Instructor Routes */}
                <Route
                  path="instructor"
                  element={
                    <InstructorRoute>
                      <InstructorDashboard />
                    </InstructorRoute>
                  }
                >
                  <Route path="courses" element={<CourseManagement />} />
                  <Route path="courses/create" element={<CreateCourse />} />
                  <Route path="courses/edit/:courseId" element={<EditCourse />} />
                  <Route path="modules/:courseId" element={<ModuleManagement />} />
                  <Route path="modules/edit/:moduleId" element={<EditModule />} />
                </Route>

                {/* Learner Routes */}
                <Route
                  path="learner"
                  element={
                    <ProtectedRoute>
                      <BetaAccessGate>
                        <GamificationProvider>
                          <LearnerDashboard />
                        </GamificationProvider>
                      </BetaAccessGate>
                    </ProtectedRoute>
                  }
                >
                  <Route
                    index
                    element={<Navigate to="library" replace />}
                  />
                  <Route path="library" element={<Library />} />
                  <Route path="courses" element={<Courses />} />
                  <Route path="courses/:courseId" element={<CourseDetails />} />
                  <Route path="modules/:courseId/:moduleId" element={<ModuleDetails />} />
                  <Route path="gamification" element={<GamificationDashboard />} />
                </Route>

                {/* UAT Dashboard - accessible to UAT testers */}
                <Route
                  path="uat-dashboard"
                  element={
                    <ProtectedRoute>
                      <UATDashboard />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Docs routes */}
              <Route
                path="/docs"
                element={
                  <Shell>
                    <DocsProvider>
                      <div className="md:hidden">
                        <LanguageSwitcher />
                      </div>
                      <DocsHeader
                        siteConfig={siteConfig}
                        className="border-b"
                      />
                      <div className="container grid grid-cols-[1fr_300px] gap-12 py-10 lg:grid-cols-[200px_1fr]">
                        <aside className="hidden lg:block">
                          <DocsSidebar siteConfig={siteConfig} />
                        </aside>
                        <DocsPage siteConfig={siteConfig} />
                      </div>
                    </DocsProvider>
                  </Shell>
                }
              />

              <Route path="/" element={<Navigate to="/dashboard/learner" />} />
            </Routes>
          </ThemeProvider>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
