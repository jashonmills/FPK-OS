
import React from 'react';
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

// Placeholder components for missing routes
const LearnerLibrary = () => <div className="p-6"><h1 className="text-2xl font-bold">Library</h1><p>Library content coming soon...</p></div>;
const LearnerAnalytics = () => <div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1><p>Analytics content coming soon...</p></div>;
const LearnerGoals = () => <div className="p-6"><h1 className="text-2xl font-bold">Goals</h1><p>Goals content coming soon...</p></div>;
const LearnerNotes = () => <div className="p-6"><h1 className="text-2xl font-bold">Notes</h1><p>Notes content coming soon...</p></div>;
const AICoach = () => <div className="p-6"><h1 className="text-2xl font-bold">AI Study Coach</h1><p>AI Coach content coming soon...</p></div>;
const LearnerGamification = () => <div className="p-6"><h1 className="text-2xl font-bold">Gamification</h1><p>Gamification content coming soon...</p></div>;
const LearnerSettings = () => <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p>Settings content coming soon...</p></div>;

function App() {
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
                <Route path="library" element={<LearnerLibrary />} />
                <Route path="courses" element={<MyCourses />} />
                <Route path="analytics" element={<LearnerAnalytics />} />
                <Route path="goals" element={<LearnerGoals />} />
                <Route path="notes" element={<LearnerNotes />} />
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
}

export default App;
