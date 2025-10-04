import React from 'react';
import { Search, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import { PersonalOrgSwitcher } from '@/components/organizations/PersonalOrgSwitcher';

/**
 * Personal Global Header - For personal dashboard routes without OrgProvider
 */
const PersonalGlobalHeader = () => {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const navigate = useNavigate();

  const getDisplayName = () => {
    if (profile?.display_name) return profile.display_name;
    if (profile?.full_name) return profile.full_name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getInitials = () => {
    const displayName = getDisplayName();
    return displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left side - Sidebar trigger and brand */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="hover:text-primary" />
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img 
                src="/assets/fpk-character-logo.png" 
                alt="FPK University"
                className="w-8 h-8 object-contain rounded-lg"
              />
            </div>
            <span className="font-semibold text-lg">
              FPK University
            </span>
          </div>
        </div>

        {/* Center - Organization Switcher */}
        <div className="flex-1 flex justify-center max-w-md mx-4">
          <PersonalOrgSwitcher />
        </div>

        {/* Search Bar - Hidden on mobile when context switcher is present */}
        <div className="flex-1 max-w-md mx-4 hidden lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses, notes, and more..."
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Notifications - Using the actual notification system */}
          <NotificationDropdown />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || ""} alt={getDisplayName()} />
                  <AvatarFallback className="fpk-gradient text-white text-sm">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block font-medium">{getDisplayName()}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 mobile-dropdown-content z-[100]" 
              sideOffset={8}
              alignOffset={0}
              collisionPadding={8}
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <DropdownMenuLabel>
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard/learner/settings')}>
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/dashboard/learner/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default PersonalGlobalHeader;