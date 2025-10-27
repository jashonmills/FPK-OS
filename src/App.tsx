import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { UserRoleProvider } from "./contexts/UserRoleContext";
import { FeatureFlagProvider } from "./contexts/FeatureFlagContext";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Community from "./pages/Community";
import AdminPanel from "./pages/AdminPanel";
import ProfilePage from "./pages/ProfilePage";
import Dashboard from "./pages/Dashboard";
import Messages from "./pages/Messages";
import Banned from "./pages/Banned";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <UserRoleProvider>
            <FeatureFlagProvider>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/community" element={<Community />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/community/profile/:personaId" element={<ProfilePage />} />
                <Route path="/community/dashboard" element={<Dashboard />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/messages/:conversationId" element={<Messages />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/banned" element={<Banned />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </FeatureFlagProvider>
          </UserRoleProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
