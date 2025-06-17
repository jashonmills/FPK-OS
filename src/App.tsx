
import { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from '@/hooks/useAuth';
import { GamificationProvider } from '@/contexts/GamificationContext';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import AccessibilityProvider from '@/components/AccessibilityProvider';
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";
import LearnerHome from "./pages/dashboard/LearnerHome";
import Library from "./pages/dashboard/Library";
import MyCourses from "./pages/dashboard/MyCourses";
import Goals from "./pages/dashboard/Goals";
import Notes from "./pages/dashboard/Notes";
import Gamification from "./pages/dashboard/Gamification";
import Settings from "./pages/dashboard/Settings";
import LearningAnalytics from "./pages/dashboard/LearningAnalytics";
import AIStudyCoach from "./pages/dashboard/AIStudyCoach";
import FlashcardManagerPage from "./pages/dashboard/FlashcardManagerPage";
import LiveLearningHub from "./pages/dashboard/LiveLearningHub";
import DynamicCourse from "./pages/dashboard/DynamicCourse";
import LearningStateCourse from "./pages/dashboard/LearningStateCourse";
import LearningStateEmbed from "./pages/dashboard/LearningStateEmbed";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import CourseManager from "./pages/admin/CourseManager";
import Analytics from "./pages/admin/Analytics";
import ModuleManagerPage from "./pages/admin/ModuleManagerPage";
import ThresholdManagement from "./pages/admin/ThresholdManagement";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <GamificationProvider>
            <VoiceSettingsProvider>
              <AccessibilityProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Suspense fallback={<div>Loading...</div>}>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/login" element={<Login />} />
                        
                        {/* Dashboard Routes */}
                        <Route path="/dashboard/*" element={<DashboardLayout />}>
                          <Route path="learner" element={<LearnerHome />} />
                          <Route path="learner/library" element={<Library />} />
                          <Route path="learner/courses" element={<MyCourses />} />
                          <Route path="learner/goals" element={<Goals />} />
                          <Route path="learner/notes" element={<Notes />} />
                          <Route path="learner/gamification" element={<Gamification />} />
                          <Route path="learner/settings" element={<Settings />} />
                          <Route path="learner/analytics" element={<LearningAnalytics />} />
                          <Route path="learner/ai-coach" element={<AIStudyCoach />} />
                          <Route path="learner/flashcards" element={<FlashcardManagerPage />} />
                          <Route path="learner/live-hub" element={<LiveLearningHub />} />
                          <Route path="learner/course/:courseId" element={<DynamicCourse />} />
                          <Route path="learner/learning-state/:courseId" element={<LearningStateCourse />} />
                          <Route path="learner/learning-state-embed/:moduleId" element={<LearningStateEmbed />} />
                          
                          {/* Admin Routes */}
                          <Route path="admin" element={<AdminDashboard />} />
                          <Route path="admin/users" element={<UserManagement />} />
                          <Route path="admin/courses" element={<CourseManager />} />
                          <Route path="admin/analytics" element={<Analytics />} />
                          <Route path="admin/modules" element={<ModuleManagerPage />} />
                          <Route path="admin/thresholds" element={<ThresholdManagement />} />
                          
                          {/* Default redirect */}
                          <Route index element={<Navigate to="learner" replace />} />
                        </Route>
                        
                        {/* 404 Route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </BrowserRouter>
                </TooltipProvider>
              </AccessibilityProvider>
            </VoiceSettingsProvider>
          </GamificationProvider>
        </AuthProvider>
      </I18nextProvider>
    </QueryClientProvider>
  );
}

export default App;
