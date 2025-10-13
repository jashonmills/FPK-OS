import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { SessionHistory } from '@/components/coach/SessionHistory';
import { HeaderAnalytics } from '@/components/coach/HeaderAnalytics';
import { AnalyticsDashboardModal } from '@/components/coach/AnalyticsDashboardModal';
import { PomodoroTimer } from '@/components/coach/PomodoroTimer';
import StandaloneAIStudyCoachChat from '@/components/StandaloneAIStudyCoachChat';
import { CreditBalanceDisplay } from '@/components/coach/CreditBalanceDisplay';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/coach/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Menu, X, BarChart2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SIDEBAR_COLLAPSED_KEY = 'coach-sidebar-collapsed';

export default function CoachProPortal() {
  const { user, loading } = useAuth();
  const [selectedSessionId, setSelectedSessionId] = useState<string | undefined>();
  const [sessionType, setSessionType] = useState<'socratic' | 'free' | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    return saved === 'true';
  });
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  // Persist sidebar collapsed state
  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

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
        <div className="flex-shrink-0 bg-primary/10 border-b border-border p-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-lg font-semibold whitespace-nowrap">AI Study Coach Pro</h1>
          </div>

          {/* Center: Header Analytics & Timer */}
          <div className="hidden lg:flex flex-1 justify-center items-center gap-6">
            <HeaderAnalytics />
            <div className="h-8 w-px bg-border" />
            <PomodoroTimer />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAnalyticsOpen(true)}
              className="gap-2"
            >
              <BarChart2 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </Button>
            <ThemeToggle />
            <CreditBalanceDisplay />
            <p className="hidden md:block text-sm text-muted-foreground">Welcome, {user.email?.split('@')[0]}</p>
          </div>
        </div>

        {/* Analytics Modal */}
        <AnalyticsDashboardModal open={analyticsOpen} onOpenChange={setAnalyticsOpen} />

        {/* Main Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Session History */}
          <div
            className={cn(
              "flex-shrink-0 transition-all duration-300 relative",
              sidebarCollapsed ? "w-0 md:w-0" : "w-80",
              sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
              "absolute md:relative z-20 h-full md:block"
            )}
          >
            <SessionHistory
              onSelectSession={handleSelectSession}
              onNewSession={handleNewSession}
              selectedSessionId={selectedSessionId}
            />
            
            {/* Collapse/Expand Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute -right-4 top-4 z-30 hidden md:flex h-8 w-8 rounded-full shadow-lg border bg-background",
                "hover:bg-accent transition-all duration-300"
              )}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
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
            {/* Chat Interface - Now takes full height */}
            <div className="flex-1 overflow-hidden">
              <StandaloneAIStudyCoachChat key={selectedSessionId || 'new'} />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}