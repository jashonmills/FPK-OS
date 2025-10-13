import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { SessionHistory } from '@/components/coach/SessionHistory';
import { CoachAnalyticsDashboard } from '@/components/coach/CoachAnalyticsDashboard';
import StandaloneAIStudyCoachChat from '@/components/StandaloneAIStudyCoachChat';
import { CreditBalanceDisplay } from '@/components/coach/CreditBalanceDisplay';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/coach/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CoachProPortal() {
  const { user, loading } = useAuth();
  const [selectedSessionId, setSelectedSessionId] = useState<string | undefined>();
  const [sessionType, setSessionType] = useState<'socratic' | 'free' | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/coach" replace />;
  }

  const handleSelectSession = (sessionId: string, type: 'socratic' | 'free') => {
    setSelectedSessionId(sessionId);
    setSessionType(type);
  };

  const handleNewSession = () => {
    setSelectedSessionId(undefined);
    setSessionType(undefined);
  };

  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col bg-background transition-colors duration-300">
        {/* Header */}
        <div className="flex-shrink-0 bg-primary/10 border-b border-border p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-lg font-semibold">AI Study Coach Pro</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <CreditBalanceDisplay />
            <p className="text-sm text-muted-foreground">Welcome, {user.email?.split('@')[0]}</p>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Session History */}
          <div
            className={cn(
              "w-80 flex-shrink-0 transition-all duration-300",
              sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
              "absolute md:relative z-20 h-full md:block"
            )}
          >
            <SessionHistory
              onSelectSession={handleSelectSession}
              onNewSession={handleNewSession}
              selectedSessionId={selectedSessionId}
            />
          </div>

          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-10 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Center - Main Workspace */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Analytics Dashboard */}
            <div className="flex-shrink-0 p-6 overflow-y-auto">
              <CoachAnalyticsDashboard />
            </div>

            {/* Chat Interface */}
            <div className="flex-1 overflow-hidden">
              <StandaloneAIStudyCoachChat key={selectedSessionId || 'new'} />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}