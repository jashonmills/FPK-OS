
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
import { OrgSwitcher } from '@/components/organizations/OrgSwitcher';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { OrgBrandingBadge } from '@/components/org/OrgBrandingBadge';

const GlobalHeader = () => {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const { isPersonalMode, currentOrg } = useOrgContext();
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
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left side - Sidebar trigger and brand */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="hover:text-primary" />
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-8 h-8 fpk-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FPK</span>
            </div>
            <span className="font-semibold text-lg">
              FPK University
            </span>
          </div>
          <OrgBrandingBadge />
        </div>

        {/* Center - Organization Switcher */}
        <div className="flex-1 flex justify-center max-w-md mx-4">
          <OrgSwitcher />
        </div>

        {/* Search Bar - Hidden on mobile when org switcher is present */}
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
            <DropdownMenuContent align="end" className="w-56">
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

export default GlobalHeader;
