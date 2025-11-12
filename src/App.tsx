import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { FamilyProvider } from "@/contexts/FamilyContext";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import AcceptInvite from "./pages/AcceptInvite";
import OnboardingWizard from "./pages/OnboardingWizard";
import ProfileSetup from "./pages/ProfileSetup";
import Overview from "./pages/Overview";
import Dashboard from "./pages/Dashboard";
import ActivityLog from "./pages/ActivityLog";
import Documents from "./pages/Documents";
import Goals from "./pages/Goals";
import GoalDetails from "./pages/GoalDetails";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import AdminKBManager from "./pages/AdminKBManager";
import AdminKBDiagnostics from "./pages/AdminKBDiagnostics";
import AdminStripe from "./pages/AdminStripe";
import AdminExtractionMonitoring from "./pages/AdminExtractionMonitoring";
import DocumentStatusMonitor from "./pages/admin/DocumentStatusMonitor";
import PlatformAdmin from "./pages/PlatformAdmin";
import Pricing from "./pages/Pricing";
import PricingAuthenticated from "./pages/PricingAuthenticated";
import ChartLibrary from "./pages/ChartLibrary";
import { SuperAdminRoute } from "@/components/routes/SuperAdminRoute";
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard";
import LiveDataHub from "./pages/LiveDataHub";
import GarminDemo from "./pages/GarminDemo";
import GarminHub from "./pages/GarminHub";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import HIPAANotice from "./pages/HIPAANotice";
import DataDeletion from "./pages/DataDeletion";
import Guides from "./pages/Guides";
import GuideCategory from "./pages/GuideCategory";
import GuideArticle from "./pages/GuideArticle";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import Authors from "./pages/Authors";
import AuthorProfile from "./pages/AuthorProfile";
import AdminContentManager from "./pages/AdminContentManager";
import AssessmentHub from "./pages/AssessmentHub";
import WizardRunner from "./pages/WizardRunner";
import UserManagement from "./pages/admin/UserManagement";
import PipelineHealth from "./pages/admin/PipelineHealth";
import { CookieConsent } from "./components/legal/CookieConsent";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { lazy, Suspense } from "react";
import OrgLogin from "./pages/b2b/OrgLogin";
import OrgSignup from "./pages/b2b/OrgSignup";

// Lazy load B2B routes (only loaded when feature flag is enabled)
const B2BRoutes = lazy(() => import("./pages/b2b/B2BRoutes").then(m => ({ default: m.B2BRoutes })));

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const FeatureFlaggedRoute = ({ flag, children }: { flag: string; children: React.ReactNode }) => {
  const { flags, loading } = useFeatureFlags([flag]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Checking permissions...</div>
      </div>
    );
  }
  
  if (!flags[flag]) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <CookieConsent />
          <FamilyProvider>
            <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/accept-invite" element={<AcceptInvite />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/hipaa-notice" element={<HIPAANotice />} />
          <Route path="/data-deletion" element={<DataDeletion />} />
          <Route path="/about" element={<About />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/guides/:categorySlug" element={<GuideCategory />} />
          <Route path="/guides/:categorySlug/:articleSlug" element={<GuideArticle />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/authors/:authorSlug" element={<AuthorProfile />} />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingWizard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile-setup"
              element={
                <ProtectedRoute>
                  <ProfileSetup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/overview"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Overview />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/activity-log"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ActivityLog />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Documents />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/goals"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Goals />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/goals/:goalId"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <GoalDetails />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/assessments"
              element={
                <ProtectedRoute>
                  <FeatureFlaggedRoute flag="enable-assessment-hub">
                    <AppLayout>
                      <AssessmentHub />
                    </AppLayout>
                  </FeatureFlaggedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/assessments/:wizardType/:sessionId?"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <WizardRunner />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Settings />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pricing-authenticated"
              element={
                <ProtectedRoute>
                  <PricingAuthenticated />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/kb-manager"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <AdminKBManager />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pipeline-health"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <PipelineHealth />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/kb-diagnostics"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <AdminKBDiagnostics />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/platform-admin"
              element={
                <ProtectedRoute>
                  <PlatformAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/content-manager"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <AdminContentManager />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/chart-library"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ChartLibrary />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/live-data-hub"
              element={
                <ProtectedRoute>
                  <FeatureFlaggedRoute flag="enable-live-data-hub">
                    <AppLayout>
                      <LiveDataHub />
                    </AppLayout>
                  </FeatureFlaggedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/garmin-demo"
              element={
                <ProtectedRoute>
                  <FeatureFlaggedRoute flag="enable-garmin-demo">
                    <GarminDemo />
                  </FeatureFlaggedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/garmin-hub"
              element={
                <ProtectedRoute>
                  <FeatureFlaggedRoute flag="enable-garmin-integration">
                    <GarminHub />
                  </FeatureFlaggedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/stripe"
              element={
                <ProtectedRoute>
                  <FeatureFlaggedRoute flag="enable-stripe-admin">
                    <AppLayout>
                      <AdminStripe />
                    </AppLayout>
                  </FeatureFlaggedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <SuperAdminRoute>
                    <AppLayout>
                      <SuperAdminDashboard />
                    </AppLayout>
                  </SuperAdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/extraction-monitoring"
              element={
                <ProtectedRoute>
                  <SuperAdminRoute>
                    <AppLayout>
                      <AdminExtractionMonitoring />
                    </AppLayout>
                  </SuperAdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/document-status"
              element={
                <ProtectedRoute>
                  <SuperAdminRoute>
                    <AppLayout>
                      <DocumentStatusMonitor />
                    </AppLayout>
                  </SuperAdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/user-management"
              element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            {/* B2B Organization Portal - Public Authentication Routes */}
            <Route path="/org/login" element={<OrgLogin />} />
            <Route path="/org/signup" element={<OrgSignup />} />
            
            {/* B2B Organization Portal - Protected Routes (Super Admin Only) */}
            <Route
              path="/org/*"
              element={
                <ProtectedRoute>
                  <SuperAdminRoute>
                    <FeatureFlaggedRoute flag="b2b_portal_active">
                      <Suspense fallback={
                        <div className="min-h-screen flex items-center justify-center">
                          <div className="animate-pulse text-muted-foreground">Loading organization portal...</div>
                        </div>
                      }>
                        <B2BRoutes />
                      </Suspense>
                    </FeatureFlaggedRoute>
                  </SuperAdminRoute>
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </FamilyProvider>
      </BrowserRouter>
    </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
