
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import GlobalHeader from "@/components/GlobalHeader";
import Login from "./pages/Login";
import DashboardLayout from "./components/DashboardLayout";
import LearnerHome from "./pages/dashboard/LearnerHome";
import MyCourses from "./pages/dashboard/MyCourses";
import LearningAnalytics from "./pages/dashboard/LearningAnalytics";
import LiveLearningHub from "./pages/dashboard/LiveLearningHub";
import Settings from "./pages/dashboard/Settings";
import LearningStateCourse from "./pages/dashboard/LearningStateCourse";
import NotFound from "./pages/NotFound";
import { useTranslation } from "react-i18next";
import { Suspense, useEffect } from "react";

// Import i18n configuration
import './i18n';

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fpk-purple to-fpk-amber">
    <div className="text-white">Loading...</div>
  </div>
);

const AppContent = () => {
  const { t, i18n } = useTranslation();

  // Initialize language from localStorage or user preferences
  useEffect(() => {
    const savedLanguage = localStorage.getItem('fpk-language');
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  return (
    <>
      <GlobalHeader />
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        
        {/* Dashboard Routes */}
        <Route 
          path="/dashboard/learner/home" 
          element={
            <DashboardLayout>
              <LearnerHome />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/dashboard/learner/courses" 
          element={
            <DashboardLayout>
              <MyCourses />
            </DashboardLayout>
          } 
        />
        {/* Learning State Course - Full viewport control */}
        <Route 
          path="/dashboard/learner/courses/learning-state" 
          element={<LearningStateCourse />} 
        />
        
        <Route 
          path="/dashboard/learner/analytics" 
          element={
            <DashboardLayout>
              <LearningAnalytics />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/dashboard/learner/live-hub" 
          element={
            <DashboardLayout>
              <LiveLearningHub />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/dashboard/learner/settings" 
          element={
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          } 
        />
        
        {/* Placeholder routes for remaining pages */}
        <Route 
          path="/dashboard/learner/ai-coach" 
          element={
            <DashboardLayout>
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('nav.aiCoach')}</h1>
                <p className="text-gray-600">{t('common.comingSoon')}</p>
              </div>
            </DashboardLayout>
          } 
        />
        <Route 
          path="/dashboard/learner/goals" 
          element={
            <DashboardLayout>
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('nav.goals')}</h1>
                <p className="text-gray-600">{t('common.comingSoon')}</p>
              </div>
            </DashboardLayout>
          } 
        />
        <Route 
          path="/dashboard/learner/notes" 
          element={
            <DashboardLayout>
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('nav.notes')}</h1>
                <p className="text-gray-600">{t('common.comingSoon')}</p>
              </div>
            </DashboardLayout>
          } 
        />
        <Route 
          path="/dashboard/learner/community" 
          element={
            <DashboardLayout>
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('nav.community')}</h1>
                <p className="text-gray-600">{t('common.comingSoon')}</p>
              </div>
            </DashboardLayout>
          } 
        />
        <Route 
          path="/dashboard/learner/support" 
          element={
            <DashboardLayout>
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('nav.support')}</h1>
                <p className="text-gray-600">{t('common.comingSoon')}</p>
              </div>
            </DashboardLayout>
          } 
        />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <AppContent />
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
