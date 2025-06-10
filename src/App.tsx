
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import AccessibilityProvider from "@/components/AccessibilityProvider";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";
import LearnerHome from "./pages/dashboard/LearnerHome";
import MyCourses from "./pages/dashboard/MyCourses";
import DynamicCourse from "./pages/dashboard/DynamicCourse";
import LearningStateEmbed from "./pages/dashboard/LearningStateEmbed";
import LearningStateCourse from "./pages/dashboard/LearningStateCourse";
import LearningAnalytics from "./pages/dashboard/LearningAnalytics";
import Goals from "./pages/dashboard/Goals";
import Notes from "./pages/dashboard/Notes";
import StudyPage from "./pages/study/StudyPage";
import AIStudyCoach from "./pages/dashboard/AIStudyCoach";
import LiveLearningHub from "./pages/dashboard/LiveLearningHub";
import Settings from "./pages/dashboard/Settings";
import CourseManager from "./pages/admin/CourseManager";
import "./i18n";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AccessibilityProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                
                {/* Dashboard Routes */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  {/* Learner Routes */}
                  <Route path="learner" element={<LearnerHome />} />
                  <Route path="learner/my-courses" element={<MyCourses />} />
                  <Route path="learner/course/:slug" element={<DynamicCourse />} />
                  <Route path="learner/course/learning-state-embed" element={<LearningStateEmbed />} />
                  <Route path="learner/course/learning-state-beta" element={<LearningStateCourse />} />
                  <Route path="learner/analytics" element={<LearningAnalytics />} />
                  <Route path="learner/goals" element={<Goals />} />
                  <Route path="learner/notes" element={<Notes />} />
                  <Route path="learner/study" element={<StudyPage />} />
                  <Route path="learner/ai-coach" element={<AIStudyCoach />} />
                  <Route path="learner/live-hub" element={<LiveLearningHub />} />
                  <Route path="learner/settings" element={<Settings />} />
                  
                  {/* Admin Routes */}
                  <Route path="admin/courses" element={<CourseManager />} />
                  
                  {/* Default redirects */}
                  <Route index element={<Navigate to="learner" replace />} />
                </Route>

                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </AccessibilityProvider>
    </QueryClientProvider>
  );
}

export default App;
