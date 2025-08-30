import React, { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Routes, Route, Navigate } from "react-router-dom";
import AppProviders from '@/components/AppProviders';
import RouteBoundary from '@/components/RouteBoundary';
import BetaUpdateListener from '@/components/notifications/BetaUpdateListener';
import { SubscriptionGate } from '@/components/SubscriptionGate';
import { ConsentManager } from '@/components/compliance/ConsentManager';
import { RouteProtector } from '@/components/RouteProtector';
import { OnboardingFlowManager } from '@/components/OnboardingFlowManager';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { logger } from '@/utils/logger';
import "./App.css";

// Non-critical imports for better bundle splitting
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const DashboardLayout = lazy(() => import("./components/DashboardLayout"));
const BetaAccessGate = lazy(() => import('@/components/beta/BetaAccessGate'));

// Dashboard pages - lazy loaded for optimal performance
const LearnerHome = lazy(() => {
  performanceMonitor.startRender('LearnerHome');
  return import("./pages/dashboard/LearnerHome").then(module => {
    performanceMonitor.endRender('LearnerHome');
    return module;
  });
});

const Library = lazy(() => import("./pages/dashboard/Library"));
const MyCourses = lazy(() => import("./pages/dashboard/MyCourses"));
const Notes = lazy(() => import("./pages/dashboard/Notes"));
const Gamification = lazy(() => import("./pages/dashboard/Gamification"));
const Goals = lazy(() => import("./pages/dashboard/Goals"));
const Settings = lazy(() => import("./pages/dashboard/Settings"));
const LearningAnalytics = lazy(() => import("./pages/dashboard/LearningAnalytics"));
const AIStudyCoach = lazy(() => import("./pages/dashboard/AIStudyCoach"));
const FlashcardManagerPage = lazy(() => import("./pages/dashboard/FlashcardManagerPage"));
const LiveLearningHub = lazy(() => import("./pages/dashboard/LiveLearningHub"));
const DynamicCourse = lazy(() => import("./pages/dashboard/DynamicCourse"));
const LearningStateCourse = lazy(() => import("./pages/dashboard/LearningStateCourse"));
const LearningStateEmbed = lazy(() => import("./pages/dashboard/LearningStateEmbed"));

// Study components
const StudySessionRouter = lazy(() => import("./components/study/StudySessionRouter"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const CourseManager = lazy(() => import("./pages/admin/CourseManager"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
const ModuleManagerPage = lazy(() => import("./pages/admin/ModuleManagerPage"));
const LessonManager = lazy(() => import("./components/admin/LessonManager"));
const ThresholdManagement = lazy(() => import("./pages/admin/ThresholdManagement"));
const BetaManagement = lazy(() => import("./pages/admin/BetaManagement"));
const Subscription = lazy(() => import("./pages/dashboard/Subscription"));
const UserSubscription = lazy(() => import("./pages/dashboard/UserSubscription"));
const SubscriptionSuccess = lazy(() => import("./pages/dashboard/SubscriptionSuccess"));
const ChoosePlan = lazy(() => import("./pages/ChoosePlan"));

// SCORM pages - now using standard dashboard layout
const ScormStudioPage = lazy(() => import("./pages/ScormStudioPage"));
import ScormUploadPage from "./pages/ScormUploadPage";
const ScormPackages = lazy(() => import("./pages/scorm/ScormPackages"));
const ScormPlayer = lazy(() => import("./pages/scorm/ScormPlayer"));

// Legal pages
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const EmailConfirm = lazy(() => import("./pages/EmailConfirm").then(module => ({ default: module.EmailConfirm })));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

// Homepage related pages
const Games = lazy(() => import("./pages/Games"));
const Contact = lazy(() => import("./pages/Contact"));

// Optimized loading component with better UX
const PageLoader: React.FC = React.memo(() => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-muted-foreground text-sm">Loading page...</p>
    </div>
  </div>
));

// Optimized lazy route wrapper with error boundary
const LazyRoute: React.FC<{ children: React.ReactNode }> = React.memo(({ children }) => (
  <Suspense fallback={<PageLoader />}>
    <RouteBoundary>
      {children}
    </RouteBoundary>
  </Suspense>
));

// Performance optimized App component
const App: React.FC = () => {
  React.useEffect(() => {
    logger.performance('App component mounted');
    
    // Cleanup performance metrics periodically
    const cleanup = setInterval(() => {
      performanceMonitor.cleanup();
    }, 300000); // 5 minutes

    return () => {
      clearInterval(cleanup);
      logger.performance('App component unmounted');
    };
  }, []);

  return (
    <AppProviders>
      <Toaster />
      <Sonner />
      <BetaUpdateListener />
      <ConsentManager />
      
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LazyRoute><Index /></LazyRoute>} />
          <Route path="/login" element={<LazyRoute><Login /></LazyRoute>} />
          <Route path="/auth/confirm" element={<LazyRoute><EmailConfirm /></LazyRoute>} />
          <Route path="/reset-password" element={<LazyRoute><ResetPassword /></LazyRoute>} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard/*" element={
            <RouteProtector>
              <LazyRoute><DashboardLayout /></LazyRoute>
            </RouteProtector>
          }>
            <Route path="learner" element={<LazyRoute><LearnerHome /></LazyRoute>} />
            <Route path="learner/library" element={<LazyRoute><Library /></LazyRoute>} />
            <Route path="learner/courses" element={<LazyRoute><MyCourses /></LazyRoute>} />
            <Route path="learner/goals" element={<LazyRoute><Goals /></LazyRoute>} />
            <Route path="learner/notes" element={<LazyRoute><Notes /></LazyRoute>} />
            <Route path="learner/gamification" element={<LazyRoute><Gamification /></LazyRoute>} />
            <Route path="learner/settings" element={<LazyRoute><Settings /></LazyRoute>} />
            <Route path="learner/analytics" element={<LazyRoute><LearningAnalytics /></LazyRoute>} />
            <Route path="learner/ai-coach" element={<LazyRoute><AIStudyCoach /></LazyRoute>} />
            <Route path="learner/flashcards" element={<LazyRoute><FlashcardManagerPage /></LazyRoute>} />
            <Route path="learner/live-hub" element={<LazyRoute><LiveLearningHub /></LazyRoute>} />
            <Route path="learner/course/:courseId" element={<LazyRoute><DynamicCourse /></LazyRoute>} />
            <Route path="learner/learning-state/:courseId" element={<LazyRoute><LearningStateCourse /></LazyRoute>} />
            <Route path="learner/learning-state-embed/:moduleId" element={<LazyRoute><LearningStateEmbed /></LazyRoute>} />
            
            {/* Study Session Routes */}
            <Route path="learner/study/:mode" element={<LazyRoute><StudySessionRouter /></LazyRoute>} />
            
            {/* Admin Routes */}
            <Route path="admin" element={<LazyRoute><AdminDashboard /></LazyRoute>} />
            <Route path="admin/users" element={<LazyRoute><UserManagement /></LazyRoute>} />
            <Route path="admin/courses" element={<LazyRoute><CourseManager /></LazyRoute>} />
            <Route path="admin/analytics" element={<LazyRoute><Analytics /></LazyRoute>} />
            <Route path="admin/modules" element={<LazyRoute><ModuleManagerPage /></LazyRoute>} />
            <Route path="admin/courses/:slug/lessons" element={<LazyRoute><LessonManager /></LazyRoute>} />
            <Route path="admin/thresholds" element={<LazyRoute><ThresholdManagement /></LazyRoute>} />
            <Route path="admin/beta" element={<LazyRoute><BetaManagement /></LazyRoute>} />
            
            {/* Subscription Management */}
            <Route path="subscription" element={<LazyRoute><UserSubscription /></LazyRoute>} />
            
            {/* SCORM Routes - now within dashboard layout */}
            <Route path="scorm/studio" element={<LazyRoute><ScormStudioPage /></LazyRoute>} />
            <Route path="scorm/packages" element={<LazyRoute><ScormPackages /></LazyRoute>} />
            <Route path="scorm/upload" element={<LazyRoute><ScormUploadPage /></LazyRoute>} />
            
            <Route index element={<Navigate to="learner" replace />} />
          </Route>
          
          {/* SCORM Player Routes - Keep outside dashboard for full-screen experience */}
          <Route path="/scorm/*" element={
            <RouteProtector>
              <Routes>
                <Route path="preview/:packageId/:scoId" element={<LazyRoute><ScormPlayer mode="preview" /></LazyRoute>} />
                <Route path="launch/:enrollmentId/:scoId" element={<LazyRoute><ScormPlayer mode="launch" /></LazyRoute>} />
              </Routes>
            </RouteProtector>
          } />
          
          {/* Public Routes */}
          <Route path="/subscription-success" element={<LazyRoute><SubscriptionSuccess /></LazyRoute>} />
          <Route path="/choose-plan" element={<LazyRoute><ChoosePlan /></LazyRoute>} />
          <Route path="/games" element={<LazyRoute><Games /></LazyRoute>} />
          <Route path="/contact" element={<LazyRoute><Contact /></LazyRoute>} />
          <Route path="/courses" element={<Navigate to="/dashboard/learner/courses" replace />} />
          
          {/* Legal Pages */}
          <Route path="/privacy-policy" element={<LazyRoute><PrivacyPolicy /></LazyRoute>} />
          <Route path="/terms-of-service" element={<LazyRoute><TermsOfService /></LazyRoute>} />
          <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
          <Route path="/terms" element={<Navigate to="/terms-of-service" replace />} />
          
          {/* 404 Route */}
          <Route path="*" element={<LazyRoute><NotFound /></LazyRoute>} />
        </Routes>
      </Suspense>
    </AppProviders>
  );
};

export default App;