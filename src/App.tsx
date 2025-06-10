
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/useAuth';
import AccessibilityProvider from '@/components/AccessibilityProvider';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import DashboardLayout from '@/components/DashboardLayout';
import LearnerHome from '@/pages/dashboard/LearnerHome';
import MyCourses from '@/pages/dashboard/MyCourses';
import LearningAnalytics from '@/pages/dashboard/LearningAnalytics';
import LiveLearningHub from '@/pages/dashboard/LiveLearningHub';
import AIStudyCoach from '@/pages/dashboard/AIStudyCoach';
import Goals from '@/pages/dashboard/Goals';
import Notes from '@/pages/dashboard/Notes';
import Settings from '@/pages/dashboard/Settings';
import LearningStateCourse from '@/pages/dashboard/LearningStateCourse';
import StudyPage from '@/pages/study/StudyPage';

function App() {
  return (
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } } })}>
      <AuthProvider>
        <AccessibilityProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background font-sans antialiased">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                
                {/* Dashboard Routes */}
                <Route path="/dashboard/*" element={<DashboardLayout />}>
                  <Route path="learner" element={<LearnerHome />} />
                  <Route path="learner/my-courses" element={<MyCourses />} />
                  <Route path="learner/learning-analytics" element={<LearningAnalytics />} />
                  <Route path="learner/live-learning-hub" element={<LiveLearningHub />} />
                  <Route path="learner/ai-study-coach" element={<AIStudyCoach />} />
                  <Route path="learner/goals" element={<Goals />} />
                  <Route path="learner/notes" element={<Notes />} />
                  <Route path="learner/settings" element={<Settings />} />
                  <Route path="learner/course/:courseId" element={<LearningStateCourse />} />
                </Route>

                {/* Study Routes */}
                <Route path="/study/:mode" element={<StudyPage />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </BrowserRouter>
        </AccessibilityProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
