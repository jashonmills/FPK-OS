
import { Suspense, lazy } from 'react';
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
import RouteBoundary from '@/components/RouteBoundary';
import BetaAccessGate from '@/components/beta/BetaAccessGate';
import { SubscriptionGate } from '@/components/SubscriptionGate';
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";
import "./App.css";

// Lazy load dashboard pages for route isolation
const LearnerHome = lazy(() => import("./pages/dashboard/LearnerHome"));
const Library = lazy(() => import("./pages/dashboard/Library"));
const MyCourses = lazy(() => import("./pages/dashboard/MyCourses"));
const Notes = lazy(() => import("./pages/dashboard/Notes"));
const Gamification = lazy(() => import("./pages/dashboard/Gamification"));
const Settings = lazy(() => import("./pages/dashboard/Settings"));
const LearningAnalytics = lazy(() => import("./pages/dashboard/LearningAnalytics"));
const AIStudyCoach = lazy(() => import("./pages/dashboard/AIStudyCoach"));
const FlashcardManagerPage = lazy(() => import("./pages/dashboard/FlashcardManagerPage"));
const LiveLearningHub = lazy(() => import("./pages/dashboard/LiveLearningHub"));
const DynamicCourse = lazy(() => import("./pages/dashboard/DynamicCourse"));
const LearningStateCourse = lazy(() => import("./pages/dashboard/LearningStateCourse"));
const LearningStateEmbed = lazy(() => import("./pages/dashboard/LearningStateEmbed"));

// Lazy load study components
const StudySessionRouter = lazy(() => import("./components/study/StudySessionRouter"));

// Lazy load admin pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const CourseManager = lazy(() => import("./pages/admin/CourseManager"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
const ModuleManagerPage = lazy(() => import("./pages/admin/ModuleManagerPage"));
const ThresholdManagement = lazy(() => import("./pages/admin/ThresholdManagement"));
const BetaManagement = lazy(() => import("./pages/admin/BetaManagement"));
const Subscription = lazy(() => import("./pages/dashboard/Subscription"));
const SubscriptionSuccess = lazy(() => import("./pages/dashboard/SubscriptionSuccess"));
const ChoosePlan = lazy(() => import("./pages/ChoosePlan"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading page...</p>
    </div>
  </div>
);

// Wrapper component for lazy-loaded routes
const LazyRoute = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>
    <RouteBoundary>
      {children}
    </RouteBoundary>
  </Suspense>
);

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
                          
                          {/* Dashboard Routes with Beta Access Gate and Subscription Enforcement */}
                          <Route path="/dashboard/*" element={
                            <BetaAccessGate>
                              <SubscriptionGate allowedPaths={['/choose-plan', '/subscription', '/subscription-success']}>
                                <DashboardLayout />
                              </SubscriptionGate>
                            </BetaAccessGate>
                          }>
                            <Route path="learner" element={
                            <LazyRoute><LearnerHome /></LazyRoute>
                          } />
                          <Route path="learner/library" element={
                            <LazyRoute><Library /></LazyRoute>
                          } />
                          <Route path="learner/courses" element={
                            <LazyRoute><MyCourses /></LazyRoute>
                          } />
                          {/* Redirect Goals to Gamification */}
                          <Route path="learner/goals" element={
                            <Navigate to="/dashboard/learner/gamification" replace />
                          } />
                          <Route path="learner/notes" element={
                            <LazyRoute><Notes /></LazyRoute>
                          } />
                          <Route path="learner/gamification" element={
                            <LazyRoute><Gamification /></LazyRoute>
                          } />
                          <Route path="learner/settings" element={
                            <LazyRoute><Settings /></LazyRoute>
                          } />
                          <Route path="learner/analytics" element={
                            <LazyRoute><LearningAnalytics /></LazyRoute>
                          } />
                          <Route path="learner/ai-coach" element={
                            <LazyRoute><AIStudyCoach /></LazyRoute>
                          } />
                          <Route path="learner/flashcards" element={
                            <LazyRoute><FlashcardManagerPage /></LazyRoute>
                          } />
                          <Route path="learner/live-hub" element={
                            <LazyRoute><LiveLearningHub /></LazyRoute>
                          } />
                          <Route path="learner/course/:courseId" element={
                            <LazyRoute><DynamicCourse /></LazyRoute>
                          } />
                          <Route path="learner/learning-state/:courseId" element={
                            <LazyRoute><LearningStateCourse /></LazyRoute>
                          } />
                          <Route path="learner/learning-state-embed/:moduleId" element={
                            <LazyRoute><LearningStateEmbed /></LazyRoute>
                          } />
                          
                          {/* Study Session Routes */}
                          <Route path="learner/study/:mode" element={
                            <LazyRoute><StudySessionRouter /></LazyRoute>
                          } />
                          
                          {/* Admin Routes with Route Isolation */}
                          <Route path="admin" element={
                            <LazyRoute><AdminDashboard /></LazyRoute>
                          } />
                          <Route path="admin/users" element={
                            <LazyRoute><UserManagement /></LazyRoute>
                          } />
                          <Route path="admin/courses" element={
                            <LazyRoute><CourseManager /></LazyRoute>
                          } />
                          <Route path="admin/analytics" element={
                            <LazyRoute><Analytics /></LazyRoute>
                          } />
                          <Route path="admin/modules" element={
                            <LazyRoute><ModuleManagerPage /></LazyRoute>
                          } />
                          <Route path="admin/thresholds" element={
                            <LazyRoute><ThresholdManagement /></LazyRoute>
                          } />
                          <Route path="admin/beta" element={
                            <LazyRoute><BetaManagement /></LazyRoute>
                          } />
                          
                          {/* Default redirect */}
                          <Route index element={<Navigate to="learner" replace />} />
                        </Route>
                        
                        {/* Subscription Routes - Public Access for Account Creation */}
                        <Route path="/subscription" element={
                          <LazyRoute><Subscription /></LazyRoute>
                        } />
                        <Route path="/subscription-success" element={
                          <LazyRoute><SubscriptionSuccess /></LazyRoute>
                        } />
                        <Route path="/choose-plan" element={
                          <BetaAccessGate>
                            <LazyRoute><ChoosePlan /></LazyRoute>
                          </BetaAccessGate>
                        } />
                        
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
