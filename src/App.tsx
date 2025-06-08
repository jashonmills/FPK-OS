
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardLayout from "./components/DashboardLayout";
import LearnerHome from "./pages/dashboard/LearnerHome";
import MyCourses from "./pages/dashboard/MyCourses";
import LearningAnalytics from "./pages/dashboard/LearningAnalytics";
import LiveLearningHub from "./pages/dashboard/LiveLearningHub";
import Settings from "./pages/dashboard/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Study Coach</h1>
                  <p className="text-gray-600">Your personal AI learning assistant - Coming Soon!</p>
                </div>
              </DashboardLayout>
            } 
          />
          <Route 
            path="/dashboard/learner/goals" 
            element={
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Goal & XP Tracker</h1>
                  <p className="text-gray-600">Track your learning goals and experience points - Coming Soon!</p>
                </div>
              </DashboardLayout>
            } 
          />
          <Route 
            path="/dashboard/learner/notes" 
            element={
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Notes & Flashcards</h1>
                  <p className="text-gray-600">Organize your study materials and flashcards - Coming Soon!</p>
                </div>
              </DashboardLayout>
            } 
          />
          <Route 
            path="/dashboard/learner/community" 
            element={
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Hub</h1>
                  <p className="text-gray-600">Connect with fellow learners - Coming Soon!</p>
                </div>
              </DashboardLayout>
            } 
          />
          <Route 
            path="/dashboard/learner/support" 
            element={
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Support & FAQs</h1>
                  <p className="text-gray-600">Get help and find answers - Coming Soon!</p>
                </div>
              </DashboardLayout>
            } 
          />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
