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
  ExternalLink
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserRole } from "@/hooks/useUserRole";
import { useGlobalTranslation } from "@/hooks/useGlobalTranslation";
import DualLanguageText from "@/components/DualLanguageText";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const { isAdmin, isInstructor } = useUserRole();
  const { t, tString } = useGlobalTranslation();

  const learnerMenuItems = [
    {
      title: 'Home',
      url: "/dashboard/learner",
      icon: Home,
    },
    {
      title: 'Courses',
      url: "/dashboard/learner/courses",
      icon: Book,
    },
    {
      title: 'Library',
      url: "/dashboard/learner/library",
      icon: BookOpen,
    },
    {
      title: 'Analytics',
      url: "/dashboard/learner/analytics",
      icon: BarChart,
    },
    {
      title: 'Live Hub',
      url: "/dashboard/learner/live-hub",
      icon: Compass,
    },
    {
      title: 'AI Study Coach',
      url: "/dashboard/learner/ai-coach",
      icon: BookUser,
    },
    {
      title: 'Goals',
      url: "/dashboard/learner/goals",
      icon: Award,
    },
    {
      title: 'Notes',
      url: "/dashboard/learner/notes",
      icon: StickyNote,
    },
  ];

  const adminMenuItems = [
    {
      title: 'Admin Dashboard',
      url: "/dashboard/admin",
      icon: Shield,
    },
    {
      title: 'Course Manager',
      url: "/dashboard/admin/courses",
      icon: GraduationCap,
    },
    {
      title: 'Module Manager',
      url: "/dashboard/admin/modules",
      icon: Book,
    },
    {
      title: 'User Management',
      url: "/dashboard/admin/users",
      icon: Users,
    },
    {
      title: 'Course Builder',
      url: "https://themed-course-compass.lovable.app/dashboard/admin/course-builder",
      icon: Book,
      isExternal: true,
    },
  ];

  const footerItems = [
    {
      title: 'Settings',
      url: "/dashboard/learner/settings",
      icon: Settings,
    },
    {
      title: 'Exit',
      url: "https://demo.fpkuniversity.com/",
      icon: ExternalLink,
      isExternal: true,
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
      console.error('Error signing out:', error);
    }
  };

  const isActive = (url: string) => {
    if (url.startsWith('http')) {
      // For external URLs, check if current location matches the path
      return location.pathname === '/dashboard/admin/course-builder';
    }
    return location.pathname === url;
  };

  const handleNavigation = (item: any) => {
    if (item.isExternal) {
      window.location.href = item.url;
    } else {
      navigate(item.url);
    }
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 fpk-gradient rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">FPK</span>
          </div>
          <div>
            <h2 className="font-bold text-sidebar-foreground">FPK University</h2>
            <p className="text-xs text-sidebar-foreground/70">
              Learner Portal
              {isAdmin && <span className="ml-1 text-amber-500">(Admin)</span>}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {(isAdmin || isInstructor) && (
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

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium mb-2">
            Learning Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {learnerMenuItems.map((item) => (
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
                      onClick={() => navigate(item.url)}
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
          variant="outline" 
          size="sm" 
          className="w-full text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent"
        >
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
