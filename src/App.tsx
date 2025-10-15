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
import AcceptInvite from "./pages/AcceptInvite";
import OnboardingWizard from "./pages/OnboardingWizard";
import ProfileSetup from "./pages/ProfileSetup";
import Overview from "./pages/Overview";
import Dashboard from "./pages/Dashboard";
import ActivityLog from "./pages/ActivityLog";
import Documents from "./pages/Documents";
import Goals from "./pages/Goals";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import AdminKBManager from "./pages/AdminKBManager";
import AdminKBDiagnostics from "./pages/AdminKBDiagnostics";
import AdminStripe from "./pages/AdminStripe";
import PlatformAdmin from "./pages/PlatformAdmin";
import Pricing from "./pages/Pricing";
import PricingAuthenticated from "./pages/PricingAuthenticated";
import ChartLibrary from "./pages/ChartLibrary";
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
import AdminContentManager from "./pages/AdminContentManager";
import { CookieConsent } from "./components/legal/CookieConsent";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";

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
  
  if (loading) return null;
  if (!flags[flag]) return <Navigate to="/dashboard" replace />;
  
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
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/accept-invite" element={<AcceptInvite />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/hipaa-notice" element={<HIPAANotice />} />
          <Route path="/data-deletion" element={<DataDeletion />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/guides/:categorySlug" element={<GuideCategory />} />
          <Route path="/guides/:categorySlug/:articleSlug" element={<GuideArticle />} />
          <Route path="/faq" element={<FAQ />} />
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
                  <AppLayout>
                    <Analytics />
                  </AppLayout>
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
