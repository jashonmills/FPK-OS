
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import ErrorBoundary from '@/components/ErrorBoundary';
import AccessibilityProvider from '@/components/AccessibilityProvider';
import { AuthProvider } from '@/hooks/useAuth';
import { GamificationProvider } from '@/contexts/GamificationContext';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import DashboardLayout from '@/components/DashboardLayout';
import LearnerHome from '@/pages/dashboard/LearnerHome';
import MyCourses from '@/pages/dashboard/MyCourses';
import DynamicCourse from '@/pages/dashboard/DynamicCourse';
import LearningStateCourse from '@/pages/dashboard/LearningStateCourse';
import LearningStateEmbed from '@/pages/dashboard/LearningStateEmbed';
import Library from '@/pages/dashboard/Library';
import LearningAnalytics from '@/pages/dashboard/LearningAnalytics';
import LiveLearningHub from '@/pages/dashboard/LiveLearningHub';
import AIStudyCoach from '@/pages/dashboard/AIStudyCoach';
import Goals from '@/pages/dashboard/Goals';
import Notes from '@/pages/dashboard/Notes';
import Settings from '@/pages/dashboard/Settings';
import Gamification from '@/pages/dashboard/Gamification';
import FlashcardManagerPage from '@/pages/dashboard/FlashcardManagerPage';
import StudySessionRouter from '@/components/study/StudySessionRouter';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import CourseManager from '@/pages/admin/CourseManager';
import ModuleManagerPage from '@/pages/admin/ModuleManagerPage';
import UserManagement from '@/pages/admin/UserManagement';
import Analytics from '@/pages/admin/Analytics';
import ThresholdManagementPage from '@/pages/admin/ThresholdManagement';
import EPUBIngestionManager from '@/components/admin/EPUBIngestionManager';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <VoiceSettingsProvider>
          <AccessibilityProvider>
            <GamificationProvider>
              <ErrorBoundary>
                <Router>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    
                    <Route path="/dashboard" element={<DashboardLayout />}>
                      <Route path="learner" element={<LearnerHome />} />
                      <Route path="learner/courses" element={<MyCourses />} />
                      <Route path="learner/courses/:courseId" element={<DynamicCourse />} />
                      <Route path="learner/learning-state/:courseId" element={<LearningStateCourse />} />
                      <Route path="learner/learning-state-embed/:courseId" element={<LearningStateEmbed />} />
                      <Route path="learner/library" element={<Library />} />
                      <Route path="learner/analytics" element={<LearningAnalytics />} />
                      <Route path="learner/live-hub" element={<LiveLearningHub />} />
                      <Route path="learner/ai-coach" element={<AIStudyCoach />} />
                      <Route path="learner/goals" element={<Goals />} />
                      <Route path="learner/notes" element={<Notes />} />
                      <Route path="learner/settings" element={<Settings />} />
                      <Route path="learner/gamification" element={<Gamification />} />
                      <Route path="learner/flashcards" element={<FlashcardManagerPage />} />
                      <Route path="learner/study/:mode" element={<StudySessionRouter />} />
                      
                      <Route path="admin" element={<AdminDashboard />} />
                      <Route path="admin/course-manager" element={<CourseManager />} />
                      <Route path="admin/courses" element={<CourseManager />} />
                      <Route path="admin/modules" element={<ModuleManagerPage />} />
                      <Route path="admin/user-management" element={<UserManagement />} />
                      <Route path="admin/users" element={<UserManagement />} />
                      <Route path="admin/analytics" element={<Analytics />} />
                      <Route path="admin/thresholds" element={<ThresholdManagementPage />} />
                      <Route path="admin/epub-storage" element={<EPUBIngestionManager />} />
                    </Route>
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Router>
                <Toaster />
              </ErrorBoundary>
            </GamificationProvider>
          </AccessibilityProvider>
        </VoiceSettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
