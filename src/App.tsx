import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FamilyProvider } from "@/contexts/FamilyContext";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AcceptInvite from "./pages/AcceptInvite";
import OnboardingWizard from "./pages/OnboardingWizard";
import ProfileSetup from "./pages/ProfileSetup";
import Dashboard from "./pages/Dashboard";
import ActivityLog from "./pages/ActivityLog";
import Documents from "./pages/Documents";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import AdminKBManager from "./pages/AdminKBManager";
import Pricing from "./pages/Pricing";
import PricingAuthenticated from "./pages/PricingAuthenticated";
import ChartLibrary from "./pages/ChartLibrary";
import LiveDataHub from "./pages/LiveDataHub";
import GarminDemo from "./pages/GarminDemo";
import GarminHub from "./pages/GarminHub";
import NotFound from "./pages/NotFound";

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <FamilyProvider>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/accept-invite" element={<AcceptInvite />} />
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
                  <AppLayout>
                    <LiveDataHub />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/garmin-demo"
              element={
                <ProtectedRoute>
                  <GarminDemo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/garmin-hub"
              element={
                <GarminHub />
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </FamilyProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
