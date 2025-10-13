import { useState, useEffect, useRef } from 'react';
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
import { Menu, User, BarChart2, Brain, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useChatSessionManager } from '@/hooks/useChatSessionManager';
import { useWidgetChatStorage } from '@/hooks/useWidgetChatStorage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import portalBackground from '@/assets/portal-background.png';

const SIDEBAR_COLLAPSED_KEY = 'coach-sidebar-collapsed';

export default function CoachProPortal() {
  const { user, loading, signOut } = useAuth();
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
  const [sessionHistoryKey, setSessionHistoryKey] = useState(0);
  
  // Get current chat messages for auto-save
  const anonymousId = useState(() => `anonymous_${Date.now()}`)[0];
  const { messages } = useWidgetChatStorage(user?.id || anonymousId);
  
  // Chat session manager for auto-save
  const { autoSaveBeforeNewSession } = useChatSessionManager({
    userId: user?.id,
    messages,
    sessionType: 'free',
    source: 'coach_portal'
  });

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

  const handleNewSession = async () => {
    // Auto-save current chat before starting new session
    if (messages.length > 1) {
      await autoSaveBeforeNewSession();
      // Refresh session history to show newly saved chat
      setSessionHistoryKey(prev => prev + 1);
    }
    
    setSelectedSessionId(undefined);
    setSessionType(undefined);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col relative">
        {/* Full-screen background image */}
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${portalBackground})` }}
        />
        
        {/* Overlay for better contrast */}
        <div className="fixed inset-0 z-0 bg-black/40" />
        
        {/* Content wrapper */}
        <div className="relative z-10 h-screen flex flex-col transition-colors duration-300">
        {/* Mobile Header */}
        {isMobile ? (
          <div className="flex-shrink-0 bg-black/30 backdrop-blur-md border-b border-white/20">
            <div className="p-3 flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileDrawerOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-sm font-bold text-white">AI</span>
                </div>
                <h1 className="text-base font-semibold text-white">Study Coach</h1>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>{user?.email?.split('@')[0]}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Mobile Analytics Carousel */}
            <MobileAnalyticsCarousel />
          </div>
        ) : (
          /* Desktop: Two-Tier Header */
          <div className="flex-shrink-0">
            {/* Main Header Bar */}
            <div className="bg-black/30 backdrop-blur-md border-b border-white/20">
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                {/* Left: Logo & Title */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="text-base font-bold whitespace-nowrap text-white">AI Study Coach</h1>
                </div>

                {/* Right: User Info */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <ThemeToggle />
                  <CreditBalanceDisplay />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2 pl-3 border-l border-white/20 text-white hover:bg-white/10">
                        <User className="h-4 w-4" />
                        <p className="text-sm whitespace-nowrap">
                          {user.email?.split('@')[0]}
                        </p>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Sub-Header Bar: Analytics & Tools */}
            <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
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
                  key={sessionHistoryKey}
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
      </div>
    </ThemeProvider>
  );
}