
import React from 'react';
import { NavigationItem } from '@/types/common-interfaces';
import { logger } from '@/utils/logger';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Book, 
  BarChart, 
  Users, 
  Award, 
  StickyNote, 
  Settings, 
  HelpCircle,
  BookUser,
  Compass,
  GraduationCap,
  Shield,
  BookOpen,
  ExternalLink,
  CreditCard,
  Target,
  MessageSquare,
  Package,
  FolderOpen,
  Building2,
  FileText,
  TestTube,
  Edit,
  Sparkles
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAppUser } from "@/hooks/useAppUser";
import { useUserRole } from "@/hooks/useUserRole";
import { useGlobalTranslation } from "@/hooks/useGlobalTranslation";
import DualLanguageText from "@/components/DualLanguageText";
import { useOrgContext } from "@/components/organizations/OrgContext";
import { shouldShowBetaFeatures, shouldShowLibrary, shouldShowLiveHub } from '@/lib/featureFlags';

// Safe hook that works with or without OrgProvider
function useSafeOrgContext() {
  try {
    return useOrgContext();
  } catch (error) {
    // Return safe defaults when OrgProvider is not available
    return {
      activeOrgId: null,
      getNavigationContext: () => ({ basePath: '/dashboard', role: 'learner' }),
      isPersonalMode: true,
      currentOrg: null,
      organizations: [],
      isLoading: false,
      switchOrganization: () => {},
      switchToPersonal: () => {},
      getUserRole: () => 'learner'
    };
  }
}
import { navPersonal, navOrgStudent, navOrgInstructor, injectOrgId } from "@/config/nav";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const { isAdmin } = useAppUser();
  const { isInstructor, isLearner } = useUserRole();
  const { t, tString } = useGlobalTranslation();
  const { activeOrgId, getNavigationContext, isPersonalMode } = useSafeOrgContext();

  const learnerMenuItems = [
    {
      title: 'Home',
      url: "/dashboard/learner",
      icon: Home,
    },
    {
      title: 'Organizations',
      url: "/org",
      icon: Building2,
    },
    {
      title: 'Courses',
      url: "/dashboard/learner/courses",
      icon: Book,
    },
    ...(shouldShowLibrary() ? [{
      title: 'Library',
      url: "/dashboard/learner/library",
      icon: BookOpen,
    }] : []),
    {
      title: 'Analytics',
      url: "/dashboard/learner/analytics",
      icon: BarChart,
    },
    {
      title: 'AI Study Coach',
      url: "/dashboard/learner/ai-coach",
      icon: BookUser,
    },
    {
      title: 'Goals',
      url: "/dashboard/learner/goals",
      icon: Target,
    },
    {
      title: 'Achievements & XP',
      url: "/dashboard/learner/gamification",
      icon: Award,
    },
    {
      title: 'Notes',
      url: "/dashboard/learner/notes",
      icon: StickyNote,
    },
  ];

  const instructorMenuItems = [
    {
      title: 'Students',
      url: "/dashboard/instructor#students",
      icon: Users,
    },
    {
      title: 'Courses',
      url: "/dashboard/instructor#courses",
      icon: Book,
    },
    {
      title: 'Goals',
      url: "/dashboard/instructor#goals",
      icon: Target,
    },
    {
      title: 'Notes',
      url: "/dashboard/instructor#notes",
      icon: StickyNote,
    },
    {
      title: 'Analytics',
      url: "/dashboard/instructor#analytics",
      icon: BarChart,
    },
  ];

  const adminMenuItems = [
    {
      title: 'Admin Dashboard',
      url: "/dashboard/admin",
      icon: Shield,
    },
    {
      title: 'User Management',
      url: "/dashboard/admin/users",
      icon: Users,
    },
    {
      title: 'Organization Management',
      url: "/dashboard/admin/organizations",
      icon: Building2,
    },
    {
      title: 'Instructor Console',
      url: "/dashboard/admin/instructors",
      icon: GraduationCap,
    },
    {
      title: 'Teacher Dashboard V2',
      url: "/dashboard/admin/teacher-dashboard-v2",
      icon: Sparkles,
    },
    {
      title: 'Course Manager',
      url: "/dashboard/admin/courses",
      icon: Book,
    },
    {
      title: 'Module Manager',
      url: "/dashboard/admin/modules",
      icon: BookOpen,
    },
    {
      title: 'SCORM Packages',
      url: "/dashboard/admin/scorm",
      icon: Package,
    },
    {
      title: 'Analytics',
      url: "/dashboard/admin/analytics",
      icon: BarChart,
    },
    {
      title: 'Threshold Management',
      url: "/dashboard/admin/thresholds",
      icon: Settings,
    },
    ...(shouldShowBetaFeatures() ? [{
      title: 'Beta Management',
      url: "/dashboard/admin/beta",
      icon: MessageSquare,
    }] : []),
    {
      title: 'Phoenix Lab',
      url: "/dashboard/admin/phoenix-lab",
      icon: TestTube,
    },
    {
      title: 'Content Manager',
      url: "/dashboard/admin/blog",
      icon: Edit,
    },
    {
      title: 'Audit Logs',
      url: "/dashboard/admin/audit",
      icon: FileText,
    },
  ];

  const scormMenuItems = [
    {
      title: 'SCORM Studio',
      url: "/dashboard/scorm/studio",
      icon: Package,
    },
    {
      title: 'Packages',
      url: "/dashboard/scorm/packages",
      icon: FolderOpen,
    },
  ];

  const footerItems = [
    {
      title: 'Subscription',
      url: "/dashboard/subscription",
      icon: CreditCard,
    },
    {
      title: 'Settings',
      url: "/dashboard/learner/settings",
      icon: Settings,
    },
  ];

  const getDisplayName = () => {
    if (profile?.display_name) return profile.display_name;
    if (profile?.full_name) return profile.full_name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getUserEmail = () => {
    return user?.email || 'user@fpk.edu';
  };

  const getInitials = () => {
    const displayName = getDisplayName();
    return displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      logger.auth('Error signing out', error);
    }
  };

  const isActive = (url: string) => {
    if (url.startsWith('http')) {
      // For external URLs, check if current location matches the path
      return location.pathname === '/dashboard/admin/course-builder';
    }
    // Handle SCORM routes specifically for better matching
    if (url.includes('/scorm/')) {
      return location.pathname.startsWith(url);
    }
    // Handle org-specific routes by checking both path and query params
    if (url.includes('?org=')) {
      const [path, query] = url.split('?');
      const currentParams = new URLSearchParams(location.search);
      const urlParams = new URLSearchParams(query);
      
      return location.pathname === path && 
             currentParams.get('org') === urlParams.get('org');
    }
    return location.pathname === url;
  };

  const handleNavigation = (item: NavigationItem) => {
    if (item.isExternal) {
      window.location.href = item.url;
    } else {
      navigate(item.url);
    }
  };

  // Get contextual navigation items based on org context
  const getContextualNavItems = () => {
    const context = getNavigationContext();
    
    let navItems;
    switch (context) {
      case 'org-instructor':
        navItems = navOrgInstructor;
        break;
      case 'org-student':
        navItems = navOrgStudent;
        break;
      default:
        navItems = navPersonal;
    }
    
    return injectOrgId(navItems, activeOrgId);
  };

  // Helper to extract icon component from React.createElement
  const renderIcon = (iconElement: React.ReactNode) => {
    if (React.isValidElement(iconElement)) {
      return React.cloneElement(iconElement as React.ReactElement<any>, { 
        className: "h-4 w-4 flex-shrink-0" 
      });
    }
    return iconElement;
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <img 
              src="/assets/fpk-character-logo.png" 
              alt="FPK University"
              className="w-8 h-8 object-contain rounded-lg"
            />
          </div>
          <div>
            <h2 className="font-bold text-sidebar-foreground">FPK University</h2>
            <p className="text-xs text-sidebar-foreground/70">
              {isAdmin ? 'Admin Portal' : isInstructor ? 'Instructor Portal' : 'Learner Portal'}
              {isAdmin && <span className="ml-1 text-amber-500">(Admin)</span>}
              {isInstructor && !isAdmin && <span className="ml-1 text-blue-500">(Instructor)</span>}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium mb-2">
              Administration
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`w-full transition-colors ${
                        isActive(item.url) 
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                          : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                      }`}
                    >
                      <button
                        onClick={() => handleNavigation(item)}
                        className="flex items-center gap-3 w-full text-left"
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* SCORM - Admin only */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium mb-2">
              SCORM
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {scormMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`w-full transition-colors ${
                        isActive(item.url) 
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                          : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                      }`}
                    >
                      <button
                        onClick={() => handleNavigation(item)}
                        className="flex items-center gap-3 w-full text-left"
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Instructor Menu */}
        {isInstructor && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium mb-2">
              Organization Management
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {instructorMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`w-full transition-colors ${
                        isActive(item.url) 
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                          : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                      }`}
                    >
                      <button
                        onClick={() => handleNavigation(item)}
                        className="flex items-center gap-3 w-full text-left"
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Context-based Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium mb-2">
            {isPersonalMode ? 'Learning Dashboard' : 'Organization Dashboard'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {getContextualNavItems().map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton 
                    asChild 
                    className={`w-full transition-colors ${
                      isActive(item.to) 
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                    }`}
                  >
                    <button
                      onClick={() => navigate(item.to)}
                      className="flex items-center gap-3 w-full text-left"
                    >
                      {renderIcon(item.icon)}
                      <span>{item.label}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium mb-2">
            Support
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {footerItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`w-full transition-colors ${
                      isActive(item.url) 
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                    }`}
                  >
                    <button
                      onClick={() => handleNavigation(item)}
                      className="flex items-center gap-3 w-full text-left"
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url || ""} alt={getDisplayName()} />
            <AvatarFallback className="fpk-gradient text-white text-sm font-semibold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{getDisplayName()}</p>
            <p className="text-xs text-sidebar-foreground/70 truncate">{getUserEmail()}</p>
          </div>
        </div>
        <Button 
          onClick={handleLogout}
          variant="ghost"
          size="sm" 
          className="w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          Sign Out
        </Button>
        <div className="flex gap-4 justify-center text-xs text-sidebar-foreground/60 mt-2">
          <a href="/privacy-policy" className="hover:text-sidebar-foreground/80 underline">
            Privacy
          </a>
          <a href="/terms-of-service" className="hover:text-sidebar-foreground/80 underline">
            Terms
          </a>
          <a href="/gdpr-hipaa-compliance" className="hover:text-sidebar-foreground/80 underline">
            GDPR/HIPAA
          </a>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
