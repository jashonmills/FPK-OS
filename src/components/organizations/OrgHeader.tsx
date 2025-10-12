import React, { useState } from 'react';
import { Search, Settings, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import { OrgSwitcher } from './OrgSwitcher';
import { useStudentPortalContext } from '@/hooks/useStudentPortalContext';
import { useOrgContext } from './OrgContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TourHelpButton } from '@/components/tour/TourHelpButton';

const OrgHeader = () => {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const navigate = useNavigate();
  const { isStudentPortalUser, studentId } = useStudentPortalContext();
  const { currentOrg } = useOrgContext();
  const isMobile = useIsMobile();

  // Fetch student name from org_students table for student-only users
  const { data: studentRecord } = useQuery({
    queryKey: ['org-student-name', studentId],
    queryFn: async () => {
      if (!studentId) return null;
      const { data } = await supabase
        .from('org_students')
        .select('full_name')
        .eq('id', studentId)
        .single();
      return data;
    },
    enabled: isStudentPortalUser && !!studentId
  });

  const getDisplayName = () => {
    // For student-only users, use org_students.full_name
    if (isStudentPortalUser && studentRecord?.full_name) {
      return studentRecord.full_name;
    }
    // For regular users, use profile data
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
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-2 sm:px-4 gap-2">
        {/* Left side - Back button and brand */}
        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
          <Button 
            variant="ghost" 
            size={isMobile ? "icon" : "sm"}
            onClick={() => navigate('/dashboard/organizations')}
            className="hover:text-primary"
            title="All Organizations"
          >
            <ArrowLeft className="h-4 w-4" />
            {!isMobile && <span className="ml-2">All Organizations</span>}
          </Button>
          <div className="hidden md:flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img 
                src="/assets/fpk-character-logo.png" 
                alt="FPK University"
                className="w-8 h-8 object-contain rounded-lg"
              />
            </div>
            <span className="font-semibold text-lg">Organizations</span>
          </div>
        </div>

        {/* Center - Organization Switcher */}
        <div className="flex-1 flex justify-center max-w-md mx-2">
          <OrgSwitcher />
        </div>

        {/* Search Bar - Hidden on mobile and tablet */}
        <div className="max-w-md mx-4 hidden xl:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search organizations..."
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Help & Tours Button - Hidden on mobile */}
          {!isMobile && <TourHelpButton />}
          
          {/* Language Switcher - Hidden on mobile */}
          {!isMobile && <LanguageSwitcher />}

          {/* Notifications */}
          <NotificationDropdown />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-1 sm:px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || ""} alt={getDisplayName()} />
                  <AvatarFallback className="fpk-gradient text-white text-sm">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block font-medium truncate max-w-[120px]">{getDisplayName()}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 z-[100]"
              sideOffset={8}
              alignOffset={0}
              collisionPadding={8}
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <DropdownMenuLabel>
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                if (isStudentPortalUser && currentOrg?.organization_id) {
                  navigate(`/org/${currentOrg.organization_id}/student-settings`);
                } else {
                  navigate('/dashboard/learner/settings');
                }
              }}>
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                if (isStudentPortalUser && currentOrg?.organization_id) {
                  navigate(`/org/${currentOrg.organization_id}/student-settings?tab=preferences`);
                } else {
                  navigate('/dashboard/learner/settings');
                }
              }}>
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

export default OrgHeader;