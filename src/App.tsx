
import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/useAuth';
import SecurityHeaders from '@/components/security/SecurityHeaders';
import Login from '@/pages/Login';
import Register from '@/pages/auth/Register';
import ProtectedRoute from '@/components/ProtectedRoute';
import Dashboard from '@/pages/dashboard/Dashboard';
import DashboardLayout from '@/components/DashboardLayout';
import Library from '@/pages/dashboard/Library';
import LearnerHome from '@/pages/dashboard/LearnerHome';
import MyCourses from '@/pages/dashboard/MyCourses';
import FlashcardManagerPage from '@/pages/dashboard/FlashcardManagerPage';
import Notes from '@/pages/dashboard/Notes';
import Goals from '@/pages/dashboard/Goals';
import LearningAnalytics from '@/pages/dashboard/LearningAnalytics';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

// Placeholder components for routes that don't have implementations yet
const AICoach: React.FC = () => <div className="p-6"><h1 className="text-2xl font-bold">AI Study Coach</h1><p>AI Coach content coming soon...</p></div>;
const LearnerGamification: React.FC = () => <div className="p-6"><h1 className="text-2xl font-bold">Gamification</h1><p>Gamification content coming soon...</p></div>;
const LearnerSettings: React.FC = () => <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p>Settings content coming soon...</p></div>;

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SecurityHeaders />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="library" element={<Library />} />
              
              {/* Learner routes */}
              <Route path="learner">
                <Route index element={<LearnerHome />} />
                <Route path="library" element={<Library />} />
                <Route path="courses" element={<MyCourses />} />
                <Route path="analytics" element={<LearningAnalytics />} />
                <Route path="goals" element={<Goals />} />
                <Route path="notes" element={<Notes />} />
                <Route path="ai-coach" element={<AICoach />} />
                <Route path="gamification" element={<LearnerGamification />} />
                <Route path="flashcards" element={<FlashcardManagerPage />} />
                <Route path="settings" element={<LearnerSettings />} />
              </Route>
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
