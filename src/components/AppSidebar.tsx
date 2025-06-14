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
  BookOpen
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserRole } from "@/hooks/useUserRole";
import { useDualLanguage } from "@/hooks/useDualLanguage";
import DualLanguageText from "@/components/DualLanguageText";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const { isAdmin, isInstructor } = useUserRole();
  const { t } = useDualLanguage();

  const learnerMenuItems = [
    {
      title: 'nav.home',
      url: "/dashboard/learner",
      icon: Home,
    },
    {
      title: 'nav.courses',
      url: "/dashboard/learner/courses",
      icon: Book,
    },
    {
      title: 'nav.library',
      url: "/dashboard/learner/library",
      icon: BookOpen,
    },
    {
      title: 'nav.analytics',
      url: "/dashboard/learner/analytics",
      icon: BarChart,
    },
    {
      title: 'nav.liveHub',
      url: "/dashboard/learner/live-hub",
      icon: Compass,
    },
    {
      title: 'AI Study Coach',
      url: "/dashboard/learner/ai-coach",
      icon: BookUser,
    },
    {
      title: 'nav.goals',
      url: "/dashboard/learner/goals",
      icon: Award,
    },
    {
      title: 'nav.notes',
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
  ];

  const footerItems = [
    {
      title: 'nav.settings',
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
      console.error('Error signing out:', error);
    }
  };

  const isActive = (url: string) => {
    return location.pathname === url;
  };

  // Helper function to render dual language text
  const renderDualText = (translationKey: string, className?: string) => {
    const text = t(translationKey);
    
    if (typeof text === 'string') {
      return <span className={className}>{text}</span>;
    }
    
    return (
      <span className={className}>
        <span className="block">{text.primary}</span>
        <span className="block text-xs text-sidebar-foreground/50 italic">{text.english}</span>
      </span>
    );
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
              <DualLanguageText translationKey="common.learnerPortal" />
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
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium mb-2">
            <DualLanguageText translationKey="common.learningDashboard" />
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
                      {renderDualText(item.title)}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium mb-2">
            <DualLanguageText translationKey="common.support" />
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
                      onClick={() => navigate(item.url)}
                      className="flex items-center gap-3 w-full text-left"
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {renderDualText(item.title)}
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
          <DualLanguageText translationKey="common.signOut" />
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
