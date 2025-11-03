import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { FeatureFlagProvider } from "@/contexts/FeatureFlagContext";
import { HelpProvider } from "@/contexts/HelpContext";
import { AppProviders } from "@/components/app/AppProviders";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Kanban from "./pages/Kanban";
import Messages from "./pages/Messages";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import SetupPassword from "./pages/SetupPassword";
import Budget from "./pages/Budget";
import Payroll from "./pages/Payroll";
import PaymentSummary from "./pages/PaymentSummary";
import MyTimesheet from "./pages/MyTimesheet";
import NotFound from "./pages/NotFound";
import { PermissionGuard } from '@/components/auth/PermissionGuard';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, hasPassword } = useAuth();

  if (loading) {
    return null; // Or a loading spinner
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!hasPassword) {
    return <Navigate to="/setup-password" replace />;
  }

  return <>{children}</>;
};

const PasswordSetupRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, hasPassword } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (hasPassword) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HelpProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <FeatureFlagProvider>
              <AppProviders>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
              <Route 
                path="/setup-password" 
                element={
                  <PasswordSetupRoute>
                    <SetupPassword />
                  </PasswordSetupRoute>
                } 
              />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/kanban" 
                element={
                  <ProtectedRoute>
                    <Kanban />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/messages" 
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin"
                element={
                  <ProtectedRoute>
                    <PermissionGuard permission={['admin_panel_full', 'admin_panel_limited']} redirectTo="/">
                      <Admin />
                    </PermissionGuard>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/budget" 
                element={
                  <ProtectedRoute>
                    <PermissionGuard permission={['budget_view_all', 'budget_view_assigned']} redirectTo="/">
                      <Budget />
                    </PermissionGuard>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-timesheet" 
                element={
                  <ProtectedRoute>
                    <MyTimesheet />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/payroll" 
                element={
                  <ProtectedRoute>
                    <PermissionGuard permission="payroll_view" redirectTo="/">
                      <Payroll />
                    </PermissionGuard>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/payroll/summary/:runId" 
                element={
                  <ProtectedRoute>
                    <PermissionGuard permission="payroll_view" redirectTo="/">
                      <PaymentSummary />
                    </PermissionGuard>
                  </ProtectedRoute>
                } 
              />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              </AppProviders>
            </FeatureFlagProvider>
          </AuthProvider>
        </BrowserRouter>
      </HelpProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
