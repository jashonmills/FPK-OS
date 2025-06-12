
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
  Shield
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
      url: "/dashboard/learner/my-courses",
      icon: Book,
    },
    {
      title: 'nav.analytics',
      url: "/dashboard/learner/learning-analytics",
      icon: BarChart,
    },
    {
      title: 'nav.liveHub',
      url: "/dashboard/learner/live-learning-hub",
      icon: Compass,
    },
    {
      title: 'AI Study Coach',
      url: "/dashboard/learner/ai-study-coach",
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
    <Sidebar className="sidebar-enhanced border-r border-sidebar-border">
      <SidebarHeader className="p-4 bg-transparent">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-bold text-sm">FPK</span>
          </div>
          <div>
            <h2 className="font-bold text-white">FPK University</h2>
            <p className="text-xs text-white/70">
              <DualLanguageText translationKey="common.learnerPortal" />
              {isAdmin && <span className="ml-1 text-amber-300">(Admin)</span>}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 bg-transparent">
        {(isAdmin || isInstructor) && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-white/70 font-medium mb-2">
              Administration
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`w-full transition-colors text-white hover:bg-white/10 ${
                        isActive(item.url) 
                          ? 'bg-white/20 text-white' 
                          : 'hover:bg-white/10'
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
          <SidebarGroupLabel className="text-white/70 font-medium mb-2">
            <DualLanguageText translationKey="common.learningDashboard" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {learnerMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`w-full transition-colors text-white hover:bg-white/10 ${
                      isActive(item.url) 
                        ? 'bg-white/20 text-white' 
                        : 'hover:bg-white/10'
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
          <SidebarGroupLabel className="text-white/70 font-medium mb-2">
            <DualLanguageText translationKey="common.support" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {footerItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`w-full transition-colors text-white hover:bg-white/10 ${
                      isActive(item.url) 
                        ? 'bg-white/20 text-white' 
                        : 'hover:bg-white/10'
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

      <SidebarFooter className="p-4 border-t border-white/20 bg-transparent">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url || ""} alt={getDisplayName()} />
            <AvatarFallback className="bg-white/20 text-white text-sm font-semibold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{getDisplayName()}</p>
            <p className="text-xs text-white/70 truncate">{getUserEmail()}</p>
          </div>
        </div>
        <Button 
          onClick={handleLogout}
          variant="outline" 
          size="sm" 
          className="w-full text-white border-white/30 hover:bg-white/10 bg-transparent"
        >
          <DualLanguageText translationKey="common.signOut" />
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
