import React, { Suspense, lazy, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AppProviders from '@/components/AppProviders';
import ErrorBoundaryUnified from '@/components/ErrorBoundaryUnified';
import BetaUpdateListener from '@/components/notifications/BetaUpdateListener';
import { SubscriptionGate } from '@/components/SubscriptionGate';
import { ConsentManager } from '@/components/compliance/ConsentManager';
import { RouteProtector } from '@/components/RouteProtector';
import { OnboardingFlowManager } from '@/components/OnboardingFlowManager';
import RequireAdmin from '@/components/guards/RequireAdmin';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { logger } from '@/utils/logger';
import { setupGlobalScrollRestoration } from '@/utils/globalScrollManager';
import "@/styles/mobile-responsive.css";
import "./App.css";

// Non-critical imports for better bundle splitting
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const DashboardLayout = lazy(() => import("./components/DashboardLayout"));
const PersonalDashboardLayout = lazy(() => import("./components/PersonalDashboardLayout").then(module => ({ default: module.PersonalDashboardLayout })));
const BetaAccessGate = lazy(() => import('@/components/beta/BetaAccessGate'));

// Organization public pages
const OrganizationSignup = lazy(() => import("./pages/OrganizationSignup"));
const JoinRedirect = lazy(() => import("./pages/JoinRedirect"));
const OrgLanding = lazy(() => import("./pages/OrgLanding"));

// Branded Student Portal pages
const OrgPortalLanding = lazy(() => import("./pages/org-portal/OrgPortalLanding"));
const StudentPinLogin = lazy(() => import("./pages/org-portal/StudentPinLogin"));
const StudentActivation = lazy(() => import("./pages/org-portal/StudentActivation"));
const StudentPortalDashboard = lazy(() => import("./pages/students/StudentPortalDashboard"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));

// Student Portal Guard
import { StudentPortalGuard } from './components/organizations/StudentPortalGuard';

// Organization authenticated pages
const OrgHub = lazy(() => import("./pages/organizations/OrgHub"));
const OrgCreatePage = lazy(() => import("./pages/organizations/OrgCreatePage"));
const OrgJoinPage = lazy(() => import("./pages/organizations/OrgJoinPage"));
const OrgInviteDebug = lazy(() => import("./pages/organizations/OrgInviteDebug"));
const ReceivedInvitationsPage = lazy(() => import("./pages/organizations/ReceivedInvitationsPage"));
const InviteMembersPage = lazy(() => import("./pages/org/InviteMembersPage"));
const InviteManagement = lazy(() => import("./pages/organizations/InviteManagement"));
const OrgPageLayout = lazy(() => import("./components/organizations/OrgPageLayout").then(module => ({ default: module.OrgPageLayout })));

// Dashboard pages - lazy loaded for optimal performance
const LearnerHome = lazy(() => {
  // Simplified performance monitoring for better stability
  return import("./pages/dashboard/LearnerHome");
});

const Library = lazy(() => import("./pages/dashboard/Library"));
const MyCourses = lazy(() => import("./pages/dashboard/MyCourses"));
const Notes = lazy(() => import("./pages/dashboard/Notes"));
const Gamification = lazy(() => import("./pages/dashboard/Gamification"));
const Goals = lazy(() => import("./pages/dashboard/Goals"));
const Settings = lazy(() => import("./pages/dashboard/Settings"));
const LearningAnalytics = lazy(() => import("./pages/dashboard/LearningAnalytics"));
const AnalyticsDebug = lazy(() => import("./pages/dashboard/AnalyticsDebug"));
const AIStudyCoach = lazy(() => import("./pages/dashboard/AIStudyCoach"));
const FlashcardManagerPage = lazy(() => import("./pages/dashboard/FlashcardManagerPage"));
const LiveLearningHub = lazy(() => import("./pages/dashboard/LiveLearningHub"));
const DynamicCourse = lazy(() => import("./pages/dashboard/DynamicCourse"));
const LearningStateCourse = lazy(() => import("./pages/dashboard/LearningStateCourse"));
const LearningStateEmbed = lazy(() => import("./pages/dashboard/LearningStateEmbed"));

// Study components
const StudySessionRouter = lazy(() => import("./components/study/StudySessionRouter"));

// Organization components
const OrgLayout = lazy(() => import("./components/organizations/OrgLayout"));
const OrgPortalHome = lazy(() => import("./pages/organizations/OrgPortalHome"));
const OrgJoin = lazy(() => import("./pages/organizations/OrgJoin"));
const OrgInstructorDashboard = lazy(() => import("./pages/organizations/OrgInstructorDashboard"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const AdminUserAnalytics = lazy(() => import("./pages/admin/AdminUserAnalytics"));
const CourseManager = lazy(() => import("./pages/admin/CourseManager"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
const ModuleManagerPage = lazy(() => import("./pages/admin/ModuleManagerPage"));
const LessonManager = lazy(() => import("./components/admin/LessonManager"));
const ThresholdManagement = lazy(() => import("./pages/admin/ThresholdManagement"));
const BetaManagement = lazy(() => import("./pages/admin/BetaManagement"));
const OrganizationManagement = lazy(() => import("./pages/admin/OrganizationManagement"));
const OrganizationDetail = lazy(() => import("./pages/admin/OrganizationDetail"));
const InstructorConsole = lazy(() => import("./pages/admin/InstructorConsole"));

// Instructor pages
const InstructorDashboard = lazy(() => import("./pages/dashboard/InstructorDashboard"));
const StudentProgress = lazy(() => import("./pages/instructor/StudentProgress"));
const OrgBrandingSettings = lazy(() => import("./pages/instructor/OrgBrandingSettings"));
const OrgWebsitePage = lazy(() => import("./pages/organizations/OrgWebsitePage"));
const OrgSettings = lazy(() => import("./pages/dashboard/org/settings"));
const StudentsManagement = lazy(() => import("./pages/instructor/StudentsManagement"));
const StudentsManagementNew = lazy(() => import("./pages/instructor/StudentsManagementNew"));
const StudentProfilePage = lazy(() => import("./pages/instructor/StudentProfilePage"));
const CoursesManagement = lazy(() => import("./pages/instructor/CoursesManagement"));
const CatalogDemo = lazy(() => import("./pages/org/catalog-demo"));
const OrgCoursesCatalog = lazy(() => import("./pages/org/OrgCoursesCatalog"));
const OrgCollections = lazy(() => import("./pages/org/OrgCollections"));
const IEPModulePage = lazy(() => import("./pages/org/IEPModulePage"));
const IEPWizard = lazy(() => import("./pages/org/IEPWizard"));
const ParentIEPAccess = lazy(() => import("./pages/ParentIEPAccess"));
const LegacyRedirect = lazy(() => import("./components/redirect/LegacyRedirect"));
const Assignments = lazy(() => import("./pages/org/assignments"));
const GroupsPage = lazy(() => import("./pages/org/GroupsPage"));
const AssignmentsDashboard = lazy(() => import("./pages/student/AssignmentsDashboard"));
const AssignmentsManagement = lazy(() => import("./pages/instructor/AssignmentsManagement"));
const GoalsManagement = lazy(() => import("./pages/org/goals"));
const NotesManagementNew = lazy(() => import("./pages/instructor/NotesManagementNew"));
const GoalsAndNotes = lazy(() => import("./pages/org/GoalsAndNotes"));
const OrgAIStudyCoach = lazy(() => import("./pages/org/AIStudyCoach"));
const AnalyticsOverview = lazy(() => import("./pages/instructor/AnalyticsOverview"));
const OrgSettingsTabs = lazy(() => import("./pages/instructor/OrganizationSettingsTabs"));
const Subscription = lazy(() => import("./pages/dashboard/Subscription"));
const UserSubscription = lazy(() => import("./pages/dashboard/UserSubscription"));
const SubscriptionSuccess = lazy(() => import("./pages/dashboard/SubscriptionSuccess"));
const ChoosePlan = lazy(() => import("./pages/ChoosePlan"));

// SCORM pages - now using standard dashboard layout
const ScormStudioPage = lazy(() => import("./pages/ScormStudioPage"));
import ScormUploadPage from "./pages/ScormUploadPage";
const ScormPackages = lazy(() => import("./pages/scorm/ScormPackages"));
const ScormAssignments = lazy(() => import("./pages/scorm/ScormAssignments"));
const ScormPlayer = lazy(() =>
  import("./pages/scorm/ScormPlayer").catch(error => {
    logger.error('Failed to load ScormPlayer component', 'COMPONENT_LOADER', error);
    throw error;
  })
);

// Course Preview and Analytics
const CoursePreview = lazy(() => import("./pages/preview/CoursePreview"));
const DraftPreview = lazy(() => import("./pages/preview/DraftPreview"));
const CourseAnalytics = lazy(() => import("./pages/org/CourseAnalytics"));

// Course Builder components
const CourseCreationWizard = lazy(() => import("./components/course-builder/CourseCreationWizard").then(m => ({ default: m.CourseCreationWizard })));

// Native Course Player
const NativeCoursePlayer = lazy(() => import("./components/native-courses/NativeCoursePlayer"));

// Interactive Course Pages
const InteractiveLinearEquationsCoursePage = lazy(() => import("./pages/courses/InteractiveLinearEquationsCoursePage"));
const InteractiveTrigonometryCoursePage = lazy(() => import("./pages/courses/InteractiveTrigonometryCoursePage"));
const InteractiveAlgebraCoursePage = lazy(() => import("./pages/courses/InteractiveAlgebraCoursePage"));
const InteractiveEconomicsCoursePage = lazy(() => import("./pages/courses/InteractiveEconomicsCoursePage"));
const InteractiveNeurodiversityCoursePage = lazy(() => import("./pages/courses/InteractiveNeurodiversityCoursePage"));
const InteractiveScienceCoursePage = lazy(() => import("./pages/courses/InteractiveScienceCoursePage"));
const GeometryCoursePage = lazy(() => import("./pages/courses/GeometryCoursePage"));
const EmpoweringLearningSpellingCoursePage = lazy(() => import("./pages/courses/EmpoweringLearningSpellingCoursePage"));
const EmpoweringLearningReadingCoursePage = lazy(() => import("./pages/courses/EmpoweringLearningReadingCoursePage"));
const EmpoweringLearningNumeracyCoursePage = lazy(() => import("./pages/courses/EmpoweringLearningNumeracyCoursePage"));
const EmpoweringLearningHandwritingCoursePage = lazy(() => import("./pages/courses/EmpoweringLearningHandwritingCoursePage"));
const ELHandwritingCoursePage = lazy(() => import("./pages/courses/ELHandwritingCoursePage"));
const OptimalLearningStatePage = lazy(() => import("./pages/courses/OptimalLearningStatePage"));
const LogicCriticalThinkingCoursePage = lazy(() => import("./pages/courses/LogicCriticalThinkingCoursePage"));
const MoneyManagementCoursePage = lazy(() => import("./pages/courses/MoneyManagementCoursePage"));
const InteractiveELTCoursePage = lazy(() => import("./pages/courses/InteractiveELTCoursePage"));

// Standalone AI Study Coach Chat
const StandaloneAIStudyCoachChat = lazy(() => import("./components/StandaloneAIStudyCoachChat"));

// Legal pages
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const GDPRHIPAACompliance = lazy(() => import("./pages/GDPRHIPAACompliance"));
const EmailConfirm = lazy(() => import("./pages/EmailConfirm").then(module => ({ default: module.EmailConfirm })));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Forbidden = lazy(() => import("./pages/system/Forbidden"));

// Homepage related pages
const Games = lazy(() => import("./pages/Games"));
const Contact = lazy(() => import("./pages/Contact"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));

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
    <ErrorBoundaryUnified resetOnPropsChange={true}>
      {children}
    </ErrorBoundaryUnified>
  </Suspense>
));

// Performance optimized App component
const App: React.FC = () => {
  React.useEffect(() => {
    logger.performance('App component mounted');
    
    // Disable scroll restoration to prevent page jumping
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Use cleanupManager for safe timer management
    import('./utils/cleanupManager').then(({ cleanupManager }) => {
      const cleanup = cleanupManager.setInterval(() => {
        try {
          if (import.meta.env.DEV && typeof performanceMonitor?.cleanup === 'function') {
            performanceMonitor.cleanup();
          }
        } catch (error) {
          // Silently handle cleanup errors in production
          if (import.meta.env.DEV) {
            logger.warn('Performance cleanup error', 'PERFORMANCE', error);
          }
        }
      }, 900000, 'app-performance-cleanup'); // Increased to 15 minutes to reduce overhead
      
      return () => {
        cleanupManager.cleanup(cleanup);
        logger.performance('App component unmounted');
      };
    });
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
          <Route path="/courses" element={<LazyRoute><CoursesPage /></LazyRoute>} />
          <Route path="/login" element={<LazyRoute><Login /></LazyRoute>} />
          <Route path="/auth/confirm" element={<LazyRoute><EmailConfirm /></LazyRoute>} />
          <Route path="/reset-password" element={<LazyRoute><ResetPassword /></LazyRoute>} />
          <Route path="/join" element={<LazyRoute><JoinRedirect /></LazyRoute>} />
          <Route path="/join/:code" element={<LazyRoute><JoinRedirect /></LazyRoute>} />

          {/* Auth Bridge Page - Must come before other routes */}
          <Route path="/auth/callback" element={<LazyRoute><AuthCallback /></LazyRoute>} />

          {/* Branded Student Portal Routes - Must come before org routes */}
          <Route path="/:orgSlug/login" element={<LazyRoute><StudentPinLogin /></LazyRoute>} />
          <Route path="/:orgSlug/activate" element={<LazyRoute><StudentActivation /></LazyRoute>} />
          <Route path="/:orgSlug" element={<LazyRoute><OrgPortalLanding /></LazyRoute>} />

          {/* Student Portal Dashboard - Protected by StudentPortalGuard */}
          <Route path="/:orgSlug/student-portal" element={
            <StudentPortalGuard>
              <LazyRoute><StudentPortalDashboard /></LazyRoute>
            </StudentPortalGuard>
          } />

          {/* Standalone AI Study Coach Chat Route - Public Access */}
          <Route path="/ai-study-coach/chat-only" element={
            <LazyRoute>
              <StandaloneAIStudyCoachChat />
            </LazyRoute>
          } />

          {/* Parent IEP Access Route - Separate from org structure */}
          <Route path="/iep/parent/:code" element={<LazyRoute><ParentIEPAccess /></LazyRoute>} />

          {/* Dashboard Routes */}
          <Route path="/dashboard/*" element={
            <RouteProtector>
              <LazyRoute><PersonalDashboardLayout /></LazyRoute>
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
            <Route path="learner/analytics-debug" element={<LazyRoute><AnalyticsDebug /></LazyRoute>} />
            <Route path="learner/ai-coach" element={<LazyRoute><AIStudyCoach /></LazyRoute>} />
            <Route path="learner/flashcards" element={<LazyRoute><FlashcardManagerPage /></LazyRoute>} />
            <Route path="learner/live-hub" element={<LazyRoute><LiveLearningHub /></LazyRoute>} />
            <Route path="learner/assignments" element={<LazyRoute><AssignmentsDashboard /></LazyRoute>} />
            <Route path="learner/course/:courseId" element={<LazyRoute><DynamicCourse /></LazyRoute>} />
            <Route path="learner/learning-state/:courseId" element={<LazyRoute><LearningStateCourse /></LazyRoute>} />
            <Route path="learner/learning-state-embed/:moduleId" element={<LazyRoute><LearningStateEmbed /></LazyRoute>} />
            
            {/* Study Session Routes */}
            <Route path="learner/study/:mode" element={<LazyRoute><StudySessionRouter /></LazyRoute>} />
            
            {/* Instructor Routes */}
            <Route path="instructor" element={<LazyRoute><InstructorDashboard /></LazyRoute>} />
            <Route path="instructor/students/:studentId/progress" element={<LazyRoute><StudentProgress /></LazyRoute>} />
            <Route path="instructor/organization" element={<LazyRoute><OrgSettings /></LazyRoute>} />
            <Route path="instructor/students" element={<LazyRoute><StudentsManagement /></LazyRoute>} />
            <Route path="instructor/courses" element={<LazyRoute><LegacyRedirect toOrgCourses /></LazyRoute>} />
            <Route path="instructor/assignments" element={<LazyRoute><AssignmentsManagement /></LazyRoute>} />
            <Route path="instructor/goals" element={<LazyRoute><GoalsManagement /></LazyRoute>} />
            <Route path="instructor/notes" element={<LazyRoute><NotesManagementNew /></LazyRoute>} />
            <Route path="instructor/analytics" element={<LazyRoute><AnalyticsOverview /></LazyRoute>} />
            <Route path="instructor/branding" element={<LazyRoute><OrgBrandingSettings /></LazyRoute>} />
            
            {/* Admin Routes */}
            <Route path="admin" element={<LazyRoute><AdminDashboard /></LazyRoute>} />
            <Route path="admin/users" element={<LazyRoute><UserManagement /></LazyRoute>} />
            <Route path="admin/users/:userId/analytics" element={<LazyRoute><AdminUserAnalytics /></LazyRoute>} />
            <Route path="admin/organizations" element={<LazyRoute><OrganizationManagement /></LazyRoute>} />
            <Route path="admin/organizations/:id" element={<LazyRoute><OrganizationDetail /></LazyRoute>} />
            <Route path="admin/instructors" element={<LazyRoute><InstructorConsole /></LazyRoute>} />
            <Route path="admin/analytics" element={<LazyRoute><Analytics /></LazyRoute>} />
            <Route path="admin/courses" element={<LazyRoute><CourseManager /></LazyRoute>} />
            <Route path="admin/courses/:slug/modules" element={<LazyRoute><ModuleManagerPage /></LazyRoute>} />
            <Route path="admin/courses/:slug/lessons" element={<LazyRoute><LessonManager /></LazyRoute>} />
            <Route path="admin/scorm" element={<LazyRoute><ScormPackages /></LazyRoute>} />
            <Route path="admin/modules" element={<LazyRoute><ModuleManagerPage /></LazyRoute>} />
            <Route path="admin/lessons" element={<LazyRoute><LessonManager /></LazyRoute>} />
            <Route path="admin/thresholds" element={<LazyRoute><ThresholdManagement /></LazyRoute>} />
            <Route path="admin/beta" element={<LazyRoute><BetaManagement /></LazyRoute>} />
            
            {/* Organizations Hub - Fixed missing route */}
            <Route path="organizations" element={<LazyRoute><OrgHub /></LazyRoute>} />
            
            {/* Support both paths for organizations */}
            <Route path="learner/organizations" element={<Navigate to="/dashboard/organizations" replace />} />
            
            {/* Subscription Management */}
            <Route path="subscription" element={<LazyRoute><UserSubscription /></LazyRoute>} />
            
            {/* SCORM Routes - Admin only */}
            <Route path="scorm/studio" element={
              <RequireAdmin>
                <LazyRoute><ScormStudioPage /></LazyRoute>
              </RequireAdmin>
            } />
            <Route path="scorm/packages" element={
              <RequireAdmin>
                <LazyRoute><ScormPackages /></LazyRoute>
              </RequireAdmin>
            } />
            <Route path="scorm/assignments" element={
              <RequireAdmin>
                <LazyRoute><ScormAssignments /></LazyRoute>
              </RequireAdmin>
            } />
            <Route path="scorm/upload" element={
              <RequireAdmin>
                <LazyRoute><ScormUploadPage /></LazyRoute>
              </RequireAdmin>
            } />
            <Route path="scorm/packages/:packageId" element={
              <RequireAdmin>
                <LazyRoute><ScormPackages /></LazyRoute>
              </RequireAdmin>
            } />
            <Route path="scorm/packages/:packageId/enrollments" element={
              <RequireAdmin>
                <LazyRoute><ScormPackages /></LazyRoute>
              </RequireAdmin>
            } />
            <Route path="scorm/packages/:packageId/analytics" element={
              <RequireAdmin>
                <LazyRoute><ScormPackages /></LazyRoute>
              </RequireAdmin>
            } />
            
            <Route index element={<Navigate to="learner" replace />} />
          </Route>
          
          {/* Public Course Preview Routes */}
          <Route path="/preview/:courseId" element={
            <LazyRoute><CoursePreview /></LazyRoute>
          } />
          
          {/* Draft Preview Route - Authenticated */}
          <Route path="/draft-preview/:draftId" element={
            <LazyRoute><DraftPreview /></LazyRoute>
          } />
          
          {/* SCORM Player Routes - Admin only for full-screen experience */}
          <Route path="/scorm/*" element={
            <RequireAdmin>
              <RouteProtector>
                <Routes>
                  <Route path="preview/:packageId" element={
                    <LazyRoute>
                      <ErrorBoundaryUnified 
                        fallback={
                          <div className="min-h-screen flex items-center justify-center">
                            <div className="text-center">
                              <h2 className="text-lg font-semibold mb-2">SCORM Player Loading Error</h2>
                              <p className="text-muted-foreground mb-4">Unable to load SCORM player component</p>
                              <Button onClick={() => window.location.reload()}>Reload Page</Button>
                            </div>
                          </div>
                        }
                      >
                        <ScormPlayer mode="preview" />
                      </ErrorBoundaryUnified>
                    </LazyRoute>
                  } />
                  <Route path="preview/:packageId/:scoId" element={
                    <LazyRoute>
                      <ErrorBoundaryUnified 
                        fallback={
                          <div className="min-h-screen flex items-center justify-center">
                            <div className="text-center">
                              <h2 className="text-lg font-semibold mb-2">SCORM Player Loading Error</h2>
                              <p className="text-muted-foreground mb-4">Unable to load SCORM player component</p>
                              <Button onClick={() => window.location.reload()}>Reload Page</Button>
                            </div>
                          </div>
                        }
                      >
                        <ScormPlayer mode="preview" />
                      </ErrorBoundaryUnified>
                    </LazyRoute>
                  } />
                  <Route path="launch/:enrollmentId/:scoId" element={
                    <LazyRoute>
                      <ErrorBoundaryUnified 
                        fallback={
                          <div className="min-h-screen flex items-center justify-center">
                            <div className="text-center">
                              <h2 className="text-lg font-semibold mb-2">SCORM Player Loading Error</h2>
                              <p className="text-muted-foreground mb-4">Unable to load SCORM player component</p>
                              <Button onClick={() => window.location.reload()}>Reload Page</Button>
                            </div>
                          </div>
                        }
                      >
                        <ScormPlayer mode="launch" />
                      </ErrorBoundaryUnified>
                    </LazyRoute>
                  } />
                </Routes>
              </RouteProtector>
            </RequireAdmin>
          } />
          
          {/* Interactive Course Routes */}
          <Route path="/courses/interactive-linear-equations" element={
            <RouteProtector>
              <LazyRoute><InteractiveLinearEquationsCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          <Route path="/courses/interactive-trigonometry" element={
            <RouteProtector>
              <LazyRoute><InteractiveTrigonometryCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          <Route path="/courses/interactive-trigonometry/:lessonId" element={
            <RouteProtector>
              <LazyRoute><InteractiveTrigonometryCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          <Route path="/courses/interactive-algebra" element={
            <RouteProtector>
              <LazyRoute><InteractiveAlgebraCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          <Route path="/courses/interactive-algebra/:lessonId" element={
            <RouteProtector>
              <LazyRoute><InteractiveAlgebraCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          <Route path="/courses/introduction-modern-economics" element={
            <RouteProtector>
              <LazyRoute><InteractiveEconomicsCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          <Route path="/courses/introduction-modern-economics/:lessonId" element={
            <RouteProtector>
              <LazyRoute><InteractiveEconomicsCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          <Route path="/courses/neurodiversity-strengths-based-approach" element={
            <RouteProtector>
              <LazyRoute><InteractiveNeurodiversityCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          <Route path="/courses/interactive-science" element={
            <RouteProtector>
              <LazyRoute><InteractiveScienceCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          <Route path="/courses/interactive-science/:lessonId" element={
            <RouteProtector>
              <LazyRoute><InteractiveScienceCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          <Route path="/courses/geometry" element={
            <RouteProtector>
              <LazyRoute><GeometryCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          <Route path="/courses/geometry/:lessonId" element={
            <RouteProtector>
              <LazyRoute><GeometryCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          <Route path="/courses/money-management-teens" element={
            <RouteProtector>
              <LazyRoute><MoneyManagementCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          <Route path="/courses/money-management-teens/:lessonId" element={
            <RouteProtector>
              <LazyRoute><MoneyManagementCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          <Route path="/courses/interactive-linear-equations" element={
            <RouteProtector>
              <LazyRoute><InteractiveLinearEquationsCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          <Route path="/courses/interactive-linear-equations/:lessonId" element={
            <RouteProtector>
              <LazyRoute><InteractiveLinearEquationsCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          <Route path="/courses/logic-critical-thinking" element={
            <RouteProtector>
              <LazyRoute><LogicCriticalThinkingCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          <Route path="/courses/logic-critical-thinking/:lessonId" element={
            <RouteProtector>
              <LazyRoute><LogicCriticalThinkingCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          
          <Route path="/courses/el-spelling-reading" element={
            <RouteProtector>
              <LazyRoute><EmpoweringLearningSpellingCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          <Route path="/courses/el-spelling-reading/:lessonId" element={
            <RouteProtector>
              <LazyRoute><EmpoweringLearningSpellingCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          
          <Route path="/courses/empowering-learning-spelling" element={
            <RouteProtector>
              <LazyRoute><EmpoweringLearningSpellingCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          
          <Route path="/courses/empowering-learning-spelling/:lessonId" element={
            <RouteProtector>
              <LazyRoute><EmpoweringLearningSpellingCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          
          <Route path="/courses/optimal-learning-state" element={
            <RouteProtector>
              <LazyRoute><OptimalLearningStatePage /></LazyRoute>
            </RouteProtector>
          } />
          
          <Route path="/courses/optimal-learning-state/:lessonId" element={
            <RouteProtector>
              <LazyRoute><OptimalLearningStatePage /></LazyRoute>
            </RouteProtector>
          } />
          
          <Route path="/courses/empowering-learning-reading" element={
            <RouteProtector>
              <LazyRoute><EmpoweringLearningReadingCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          
          <Route path="/courses/empowering-learning-reading/:lessonId" element={
            <RouteProtector>
              <LazyRoute><EmpoweringLearningReadingCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          
          <Route path="/courses/empowering-learning-numeracy" element={
            <RouteProtector>
              <LazyRoute><EmpoweringLearningNumeracyCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          
          <Route path="/courses/empowering-learning-numeracy/:lessonId" element={
            <RouteProtector>
              <LazyRoute><EmpoweringLearningNumeracyCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          
          <Route path="/courses/empowering-learning-handwriting" element={
            <RouteProtector>
              <LazyRoute><EmpoweringLearningHandwritingCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          
          <Route path="/courses/empowering-learning-handwriting/:lessonId" element={
            <RouteProtector>
              <LazyRoute><EmpoweringLearningHandwritingCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          
          <Route path="/courses/el-handwriting" element={
            <RouteProtector>
              <LazyRoute><ELHandwritingCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          
          <Route path="/courses/el-handwriting/:lessonId" element={
            <RouteProtector>
              <LazyRoute><ELHandwritingCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          
          <Route path="/courses/elt-empowering-learning-techniques" element={
            <RouteProtector>
              <LazyRoute><InteractiveELTCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          
          <Route path="/courses/elt-empowering-learning-techniques/:lessonId" element={
            <RouteProtector>
              <LazyRoute><InteractiveELTCoursePage /></LazyRoute>
            </RouteProtector>
          } />
          
          {/* Organization Hub & Management Routes - Authenticated */}
          <Route path="/org/hub" element={
            <RouteProtector>
              <LazyRoute>
                <OrgPageLayout>
                  <OrgHub />
                </OrgPageLayout>
              </LazyRoute>
            </RouteProtector>
          } />
          <Route path="/org/create" element={
            <RouteProtector>
              <LazyRoute>
                <OrgPageLayout>
                  <OrgCreatePage />
                </OrgPageLayout>
              </LazyRoute>
            </RouteProtector>
          } />
          <Route path="/org/join" element={
            <LazyRoute>
              <OrgJoinPage />
            </LazyRoute>
          } />
          <Route path="/org/invitations" element={
            <RouteProtector>
              <LazyRoute>
                <OrgPageLayout>
                  <ReceivedInvitationsPage />
                </OrgPageLayout>
              </LazyRoute>
            </RouteProtector>
          } />
          <Route path="/org/:orgId/invite-debug" element={
            <RouteProtector>
              <LazyRoute>
                <OrgPageLayout>
                  <OrgInviteDebug />
                </OrgPageLayout>
              </LazyRoute>
            </RouteProtector>
          } />
          
          {/* Organization Portal Routes with nested structure */}
          <Route path="/org" element={
            <RouteProtector>
              <LazyRoute><OrgLayout /></LazyRoute>
            </RouteProtector>
          }>
            <Route path=":orgId" element={<LazyRoute><OrgPortalHome /></LazyRoute>} />
            <Route path=":orgId/instructor" element={<LazyRoute><OrgInstructorDashboard /></LazyRoute>} />
            <Route path=":orgId/students" element={<LazyRoute><StudentsManagementNew /></LazyRoute>} />
            <Route path=":orgId/students/:studentId" element={<LazyRoute><StudentProfilePage /></LazyRoute>} />
            <Route path=":orgId/courses" element={<LazyRoute><OrgCoursesCatalog /></LazyRoute>} />
            <Route path=":orgId/iep" element={<LazyRoute><IEPModulePage /></LazyRoute>} />
            <Route path=":orgId/iep/wizard" element={<LazyRoute><IEPWizard /></LazyRoute>} />
            <Route path=":orgId/courses/editor/:draftId" element={<LazyRoute><CourseCreationWizard /></LazyRoute>} />
            <Route path=":orgId/collections" element={<LazyRoute><OrgCollections /></LazyRoute>} />
            <Route path=":orgId/catalog-demo" element={<LazyRoute><LegacyRedirect toOrgCourses /></LazyRoute>} />
            <Route path=":orgId/assignments" element={<LazyRoute><Assignments /></LazyRoute>} />
            <Route path=":orgId/groups" element={<LazyRoute><GroupsPage /></LazyRoute>} />
            <Route path=":orgId/goals-notes" element={<LazyRoute><GoalsAndNotes /></LazyRoute>} />
            <Route path=":orgId/ai-coach" element={<LazyRoute><OrgAIStudyCoach /></LazyRoute>} />
            <Route path=":orgId/analytics/courses/:courseId" element={<LazyRoute><CourseAnalytics /></LazyRoute>} />
            <Route path=":orgId/website" element={<LazyRoute><OrgWebsitePage /></LazyRoute>} />
            <Route path=":orgId/settings" element={<LazyRoute><OrgSettingsTabs /></LazyRoute>} />
            <Route path=":orgId/settings/invites" element={<LazyRoute><InviteManagement /></LazyRoute>} />
          </Route>
          
          {/* Forbidden Page */}
          <Route path="/403" element={<LazyRoute><Forbidden /></LazyRoute>} />
          
          {/* Public Routes */}
          <Route path="/organization-signup" element={<LazyRoute><OrganizationSignup /></LazyRoute>} />
          <Route path="/o/:orgSlug" element={<LazyRoute><OrgLanding /></LazyRoute>} />
          <Route path="/subscription-success" element={<LazyRoute><SubscriptionSuccess /></LazyRoute>} />
          <Route path="/choose-plan" element={<LazyRoute><ChoosePlan /></LazyRoute>} />
          
          {/* Native Course Player Routes - Must be last to avoid conflicts */}
          <Route path="/courses/:slug" element={
            <RouteProtector>
              <LazyRoute><NativeCoursePlayer /></LazyRoute>
            </RouteProtector>
          } />
          <Route path="/games" element={<LazyRoute><Games /></LazyRoute>} />
          <Route path="/contact" element={<LazyRoute><Contact /></LazyRoute>} />
          <Route path="/courses" element={<LazyRoute><CoursesPage /></LazyRoute>} />
          
          {/* Legacy redirect for backwards compatibility */}
          <Route path="/dashboard/courses" element={<Navigate to="/dashboard/learner/courses" replace />} />
          
          {/* Legal Pages */}
          <Route path="/privacy-policy" element={<LazyRoute><PrivacyPolicy /></LazyRoute>} />
          <Route path="/terms-of-service" element={<LazyRoute><TermsOfService /></LazyRoute>} />
          <Route path="/gdpr-hipaa-compliance" element={<LazyRoute><GDPRHIPAACompliance /></LazyRoute>} />
          <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
          <Route path="/terms" element={<Navigate to="/terms-of-service" replace />} />
          <Route path="/compliance" element={<Navigate to="/gdpr-hipaa-compliance" replace />} />
          
          {/* 404 Route */}
          <Route path="*" element={<LazyRoute><NotFound /></LazyRoute>} />
        </Routes>
      </Suspense>
    </AppProviders>
  );
};

export default App;