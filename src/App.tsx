
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import DashboardLayout from '@/components/DashboardLayout';
import LearnerHome from '@/pages/dashboard/LearnerHome';
import MyCourses from '@/pages/dashboard/MyCourses';
import DynamicCourse from '@/pages/dashboard/DynamicCourse';
import LearningStateCourse from '@/pages/dashboard/LearningStateCourse';
import AIStudyCoach from '@/pages/dashboard/AIStudyCoach';
import Settings from '@/pages/dashboard/Settings';
import Notes from '@/pages/dashboard/Notes';
import Goals from '@/pages/dashboard/Goals';
import LearningAnalytics from '@/pages/dashboard/LearningAnalytics';
import LiveLearningHub from '@/pages/dashboard/LiveLearningHub';
import FlashcardManagerPage from '@/pages/dashboard/FlashcardManagerPage';
import StudySessionRouter from '@/components/study/StudySessionRouter';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import CourseManager from '@/pages/admin/CourseManager';
import ModuleManagerPage from '@/pages/admin/ModuleManagerPage';
import Analytics from '@/pages/admin/Analytics';
import LearningStateEmbed from '@/pages/dashboard/LearningStateEmbed';
import NotFound from '@/pages/NotFound';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import AccessibilityProvider from '@/components/AccessibilityProvider';
import { AuthProvider } from '@/hooks/useAuth';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <I18nextProvider i18n={i18n}>
          <AccessibilityProvider>
            <TooltipProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  
                  {/* Study Routes - Outside dashboard for direct access */}
                  <Route path="/study/:mode" element={<StudySessionRouter />} />
                  
                  {/* Dashboard Routes */}
                  <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="/dashboard/learner" replace />} />
                    <Route path="learner" element={<LearnerHome />} />
                    <Route path="learner/courses" element={<MyCourses />} />
                    <Route path="learner/course/:courseId" element={<DynamicCourse />} />
                    <Route path="learner/learning-state" element={<LearningStateCourse />} />
                    <Route path="learner/learning-state/:courseId" element={<LearningStateCourse />} />
                    <Route path="learner/ai-coach" element={<AIStudyCoach />} />
                    <Route path="learner/settings" element={<Settings />} />
                    <Route path="learner/notes" element={<Notes />} />
                    <Route path="learner/flashcards" element={<FlashcardManagerPage />} />
                    <Route path="learner/goals" element={<Goals />} />
                    <Route path="learner/analytics" element={<LearningAnalytics />} />
                    <Route path="learner/live-hub" element={<LiveLearningHub />} />
                    
                    {/* Admin Routes */}
                    <Route path="admin" element={<AdminDashboard />} />
                    <Route path="admin/users" element={<UserManagement />} />
                    <Route path="admin/courses" element={<CourseManager />} />
                    <Route path="admin/modules" element={<ModuleManagerPage />} />
                    <Route path="admin/analytics" element={<Analytics />} />
                  </Route>
                  
                  {/* Standalone Routes */}
                  <Route path="/embed/learning-state/:courseId" element={<LearningStateEmbed />} />
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </BrowserRouter>
            </TooltipProvider>
          </AccessibilityProvider>
        </I18nextProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
