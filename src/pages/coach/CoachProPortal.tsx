import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { SessionHistory } from '@/components/coach/SessionHistory';
import { HeaderAnalytics } from '@/components/coach/HeaderAnalytics';
import { MobileAnalyticsCarousel } from '@/components/coach/MobileAnalyticsCarousel';
import { MobileNavigationDrawer } from '@/components/coach/MobileNavigationDrawer';
import { FloatingPomodoroWidget } from '@/components/coach/FloatingPomodoroWidget';
import { AnalyticsDashboardModal } from '@/components/coach/analytics/AnalyticsDashboardModal';
import { PomodoroTimer } from '@/components/coach/PomodoroTimer';
import StandaloneAIStudyCoachChat from '@/components/StandaloneAIStudyCoachChat';
import { CreditBalanceDisplay } from '@/components/coach/CreditBalanceDisplay';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/coach/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Menu, User, BarChart2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const SIDEBAR_COLLAPSED_KEY = 'coach-sidebar-collapsed';

export default function CoachProPortal() {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();
  const [selectedSessionId, setSelectedSessionId] = useState<string | undefined>();
  const [sessionType, setSessionType] = useState<'socratic' | 'free' | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    return saved === 'true';
  });
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'chat' | 'history' | 'settings'>('chat');
  const [mobileTab, setMobileTab] = useState<'chat' | 'sessions'>('chat');

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
        {/* Mobile Header */}
        {isMobile ? (
          <div className="flex-shrink-0 bg-primary/10 border-b border-border">
            <div className="p-3 flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileDrawerOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">AI</span>
                </div>
                <h1 className="text-base font-semibold">Study Coach</h1>
              </div>
              
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Mobile Analytics Carousel */}
            <MobileAnalyticsCarousel />
          </div>
        ) : (
          /* Desktop Header */
          <div className="flex-shrink-0 bg-primary/10 border-b border-border p-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
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
        )}

        {/* Mobile Navigation Drawer */}
        <MobileNavigationDrawer
          open={mobileDrawerOpen}
          onOpenChange={setMobileDrawerOpen}
          onAnalyticsClick={() => setAnalyticsOpen(true)}
          currentView={mobileView}
          onViewChange={setMobileView}
        />

        {/* Analytics Modal */}
        <AnalyticsDashboardModal open={analyticsOpen} onOpenChange={setAnalyticsOpen} />

        {/* Floating Pomodoro Widget (Mobile Only) */}
        {isMobile && <FloatingPomodoroWidget />}

        {/* Main Layout */}
        {isMobile ? (
          /* Mobile: Tab-Based Interface */
          <div className="flex-1 overflow-hidden">
            <Tabs value={mobileTab} onValueChange={(v) => setMobileTab(v as 'chat' | 'sessions')} className="h-full flex flex-col">
              <TabsList className="w-full grid grid-cols-2 rounded-none border-b">
                <TabsTrigger value="chat" className="rounded-none">Chat</TabsTrigger>
                <TabsTrigger value="sessions" className="rounded-none">Sessions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat" className="flex-1 overflow-hidden mt-0">
                <StandaloneAIStudyCoachChat key={selectedSessionId || 'new'} />
              </TabsContent>
              
              <TabsContent value="sessions" className="flex-1 overflow-hidden mt-0">
                <SessionHistory
                  onSelectSession={(sessionId, type) => {
                    handleSelectSession(sessionId, type);
                    setMobileTab('chat');
                  }}
                  onNewSession={() => {
                    handleNewSession();
                    setMobileTab('chat');
                  }}
                  selectedSessionId={selectedSessionId}
                />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          /* Desktop: Two-Column Layout */
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar - Session History */}
            <div
              className={cn(
                "flex-shrink-0 transition-all duration-300 relative",
                sidebarCollapsed ? "w-0" : "w-80"
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
                  "absolute -right-4 top-4 z-30 flex h-8 w-8 rounded-full shadow-lg border bg-background",
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

            {/* Center - Main Workspace */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-hidden">
                <StandaloneAIStudyCoachChat key={selectedSessionId || 'new'} />
              </div>
            </div>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}