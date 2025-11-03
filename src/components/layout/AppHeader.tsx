import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { User, Settings, LogOut, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHelp } from '@/contexts/HelpContext';
import { useFeatureFlags } from '@/contexts/FeatureFlagContext';

export const AppHeader = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { openHelpCenter } = useHelp();
  const { isFeatureEnabled } = useFeatureFlags();

  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-3 md:px-4 overflow-x-hidden w-full">
      <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
        <SidebarTrigger className="flex-shrink-0" />
        <h1 className="text-base md:text-lg font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent truncate">FPK Pulse</h1>
      </div>

      <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
        <NotificationCenter />
        {isFeatureEnabled('FEATURE_HELP_CENTER') && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => openHelpCenter()}
            className="h-9 w-9 md:h-10 md:w-10"
            data-help-button
          >
            <HelpCircle className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        )}
        <ThemeToggle />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 md:h-10 md:w-10">
              <User className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <Settings className="h-4 w-4 mr-2" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
