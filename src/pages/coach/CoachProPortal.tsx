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
import { Menu, User, BarChart2, Brain } from 'lucide-react';
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
          /* Desktop: Unified Header */
          <div className="flex-shrink-0 bg-primary/10 border-b border-border">
            <div className="flex items-center justify-between gap-2 px-4 py-3">
              {/* Left Zone: Logo & Title */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary/20 rounded-lg flex-shrink-0">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <h1 className="text-base font-bold whitespace-nowrap">AI Study Coach</h1>
                </div>
              </div>

              {/* Center Zone: Inline Analytics */}
              <div className="hidden xl:flex flex-1 justify-center items-center px-4">
                <HeaderAnalytics />
              </div>

              {/* Right Zone: Tools & Actions */}
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <div className="hidden lg:block">
                  <PomodoroTimer />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAnalyticsOpen(true)}
                  className="gap-2"
                >
                  <BarChart2 className="h-4 w-4" />
                  <span className="hidden md:inline">Analytics</span>
                </Button>
                <ThemeToggle />
                <CreditBalanceDisplay />
                <div className="hidden lg:flex items-center gap-2 pl-2 border-l">
                  <p className="text-sm text-muted-foreground">
                    Welcome, {user.email?.split('@')[0]}
                  </p>
                </div>
              </div>
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
                "flex-shrink-0 transition-all duration-300",
                sidebarCollapsed ? "w-0" : "w-80"
              )}
            >
              {!sidebarCollapsed && (
                <SessionHistory
                  onSelectSession={handleSelectSession}
                  onNewSession={handleNewSession}
                  selectedSessionId={selectedSessionId}
                  isCollapsed={sidebarCollapsed}
                  onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
              )}
            </div>

            {/* Center - Main Workspace */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
              {/* Expand button when collapsed */}
              {sidebarCollapsed && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-4 z-10 shadow-lg border bg-background"
                  onClick={() => setSidebarCollapsed(false)}
                  title="Expand sidebar"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              )}
              
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