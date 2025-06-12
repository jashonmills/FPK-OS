import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import AccessibilityProvider from "@/components/AccessibilityProvider";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import DashboardLayout from "@/components/DashboardLayout";
import LearnerHome from "@/pages/dashboard/LearnerHome";
import MyCourses from "@/pages/dashboard/MyCourses";
import LearningAnalytics from "@/pages/dashboard/LearningAnalytics";
import LiveLearningHub from "@/pages/dashboard/LiveLearningHub";
import AIStudyCoach from "@/pages/dashboard/AIStudyCoach";
import Goals from "@/pages/dashboard/Goals";
import Notes from "@/pages/dashboard/Notes";
import Settings from "@/pages/dashboard/Settings";
import DynamicCourse from "@/pages/dashboard/DynamicCourse";
import LearningStateCourse from "@/pages/dashboard/LearningStateCourse";
import LearningStateEmbed from "@/pages/dashboard/LearningStateEmbed";
import StudyPage from "@/pages/study/StudyPage";
import "./App.css";

// Admin components
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const CourseManager = lazy(() => import("@/pages/admin/CourseManager"));
const ModuleManagerPage = lazy(() => import("@/pages/admin/ModuleManagerPage"));
const UserManagement = lazy(() => import("@/pages/admin/UserManagement"));
const Analytics = lazy(() => import("@/pages/admin/Analytics"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AccessibilityProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div>Loading...</div></div>}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/dashboard" element={<DashboardLayout />}>
                    {/* Learner routes */}
                    <Route path="learner" element={<LearnerHome />} />
                    <Route path="learner/my-courses" element={<MyCourses />} />
                    <Route path="learner/learning-analytics" element={<LearningAnalytics />} />
                    <Route path="learner/live-learning-hub" element={<LiveLearningHub />} />
                    <Route path="learner/ai-study-coach" element={<AIStudyCoach />} />
                    <Route path="learner/goals" element={<Goals />} />
                    <Route path="learner/notes" element={<Notes />} />
                    <Route path="learner/settings" element={<Settings />} />
                    <Route path="learner/course/:courseId" element={<DynamicCourse />} />
                    <Route path="learner/learning-state/:courseId" element={<LearningStateCourse />} />
                    <Route path="learner/learning-state-embed/:courseId" element={<LearningStateEmbed />} />
                    
                    {/* Admin routes */}
                    <Route path="admin" element={<AdminDashboard />} />
                    <Route path="admin/courses" element={<CourseManager />} />
                    <Route path="admin/modules" element={<ModuleManagerPage />} />
                    <Route path="admin/users" element={<UserManagement />} />
                    <Route path="admin/analytics" element={<Analytics />} />
                    
                    {/* Default redirect */}
                    <Route path="" element={<Navigate to="learner" replace />} />
                  </Route>
                  <Route path="/study/:sessionType" element={<StudyPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </AccessibilityProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
