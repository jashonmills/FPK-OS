import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { SessionHistory } from '@/components/coach/SessionHistory';
import { HeaderAnalytics } from '@/components/coach/HeaderAnalytics';
import { MobileAnalyticsCarousel } from '@/components/coach/MobileAnalyticsCarousel';
import { MobileNavigationDrawer } from '@/components/coach/MobileNavigationDrawer';
import { MobileBottomNav } from '@/components/coach/MobileBottomNav';
import { FloatingPomodoroWidget } from '@/components/coach/FloatingPomodoroWidget';
import { AnalyticsDashboardModal } from '@/components/coach/analytics/AnalyticsDashboardModal';
import { PomodoroTimer } from '@/components/coach/PomodoroTimer';
import StandaloneAIStudyCoachChat from '@/components/StandaloneAIStudyCoachChat';
import { CreditBalanceDisplay } from '@/components/coach/CreditBalanceDisplay';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/coach/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Menu, User, BarChart2, Brain } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const SIDEBAR_COLLAPSED_KEY = 'coach-sidebar-collapsed';

export default function CoachProPortal() {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();
  const [selectedSessionId, setSelectedSessionId] = useState<string | undefined>();
  const [sessionType, setSessionType] = useState<'socratic' | 'free' | undefined>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    return saved === 'true';
  });
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
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
          /* Desktop: Two-Tier Header */
          <div className="flex-shrink-0">
            {/* Main Header Bar */}
            <div className="bg-primary/10 border-b border-border">
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                {/* Left: Logo & Title */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="p-1.5 bg-primary/20 rounded-lg">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <h1 className="text-base font-bold whitespace-nowrap">AI Study Coach</h1>
                </div>

                {/* Right: User Info */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <ThemeToggle />
                  <CreditBalanceDisplay />
                  <div className="flex items-center gap-2 pl-3 border-l border-border">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground whitespace-nowrap">
                      {user.email?.split('@')[0]}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Header Bar: Analytics & Tools */}
            <div className="bg-background/95 backdrop-blur-sm border-b border-border">
              <div className="flex items-center justify-between gap-4 px-4 py-2">
                {/* Left: Analytics Carousel (scrollable) */}
                <div className="flex-1 min-w-0 overflow-hidden">
                  <HeaderAnalytics />
                </div>

                {/* Right: Tools */}
                <div className="flex items-center gap-2 flex-shrink-0">
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
          currentView="chat"
          onViewChange={() => {}}
        />

        {/* Analytics Modal */}
        <AnalyticsDashboardModal open={analyticsOpen} onOpenChange={setAnalyticsOpen} />

        {/* Floating Pomodoro Widget (Mobile Only) */}
        {isMobile && <FloatingPomodoroWidget />}

        {/* Main Layout */}
        {isMobile ? (
          /* Mobile: Simple View with Bottom Nav */
          <div className="flex-1 overflow-hidden pb-16">
            {mobileTab === 'chat' ? (
              <StandaloneAIStudyCoachChat key={selectedSessionId || 'new'} />
            ) : (
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
            )}
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
                />
              )}
            </div>

            {/* Center - Main Workspace */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <StandaloneAIStudyCoachChat 
                key={selectedSessionId || 'new'} 
                sidebarCollapsed={sidebarCollapsed}
                onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
              />
            </div>
          </div>
        )}

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <MobileBottomNav
            activeTab={mobileTab}
            onTabChange={setMobileTab}
            onNewSession={handleNewSession}
            onAnalyticsClick={() => setAnalyticsOpen(true)}
          />
        )}
      </div>
    </ThemeProvider>
  );
}