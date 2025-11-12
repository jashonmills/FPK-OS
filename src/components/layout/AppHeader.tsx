import { SidebarTrigger } from '@/components/ui/sidebar';
import { FamilyStudentSelector } from '@/components/FamilyStudentSelector';
import { useLocation } from 'react-router-dom';
import { HelpCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import fpkxLogo from '@/assets/fpk-x-logo.png';
import { supabase } from '@/integrations/supabase/client';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { useAuth } from '@/hooks/useAuth';

export const AppHeader = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  const isOverviewPage = location.pathname === '/overview';

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/overview':
        return 'Platform Overview';
      case '/dashboard':
        return 'Progress Dashboard';
      case '/activity-log':
        return 'Activity Logs';
      case '/documents':
        return 'Documents';
      case '/analytics':
        return 'Analytics';
      case '/settings':
        return 'Settings';
      default:
        return 'FPK-X';
    }
  };

  const handleReplayTour = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Reset all tour flags
      await supabase
        .from('user_tour_progress')
        .update({ 
          has_seen_dashboard_tour: false,
          has_seen_activities_tour: false,
          has_seen_goals_tour: false,
          has_seen_analytics_tour: false,
          has_seen_settings_tour: false,
          has_seen_documents_tour: false,
        })
        .eq('user_id', user.id);
    }
    window.location.href = '/dashboard';
  };

  return (
    <header className="sticky top-0 z-10 flex h-14 sm:h-16 items-center gap-1 sm:gap-2 md:gap-4 glass-header px-2 sm:px-4 md:px-6 overflow-hidden">
      <SidebarTrigger className="shrink-0" />
      <img 
        src={fpkxLogo} 
        alt="FPK-X.com Logo" 
        className="h-8 w-8 sm:h-10 sm:w-10 object-contain shrink-0"
      />
      <div className="flex items-center justify-between flex-1 min-w-0 gap-1 sm:gap-2">
        <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold truncate">{getPageTitle()}</h1>
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <NotificationBell />
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 shrink-0" data-tour="help">
                <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleReplayTour}>
                Replay Introduction
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {!isOverviewPage && <FamilyStudentSelector />}
        </div>
      </div>
    </header>
  );
};
