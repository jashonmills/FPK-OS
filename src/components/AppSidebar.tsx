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
  Compass
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useTranslation } from "react-i18next";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('nav.home'),
      url: "/dashboard/learner/home",
      icon: Home,
    },
    {
      title: t('nav.courses'),
      url: "/dashboard/learner/courses",
      icon: Book,
    },
    {
      title: t('nav.analytics'),
      url: "/dashboard/learner/analytics",
      icon: BarChart,
    },
    {
      title: t('nav.liveHub'),
      url: "/dashboard/learner/live-hub",
      icon: Compass,
    },
    {
      title: t('nav.aiCoach'),
      url: "/dashboard/learner/ai-coach",
      icon: BookUser,
    },
    {
      title: t('nav.goals'),
      url: "/dashboard/learner/goals",
      icon: Award,
    },
    {
      title: t('nav.notes'),
      url: "/dashboard/learner/notes",
      icon: StickyNote,
    },
    {
      title: t('nav.community'),
      url: "/dashboard/learner/community",
      icon: Users,
    },
  ];

  const footerItems = [
    {
      title: t('nav.settings'),
      url: "/dashboard/learner/settings",
      icon: Settings,
    },
    {
      title: t('nav.support'),
      url: "/dashboard/learner/support",
      icon: HelpCircle,
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

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 fpk-gradient rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">FPK</span>
          </div>
          <div>
            <h2 className="font-bold text-sidebar-foreground">FPK University</h2>
            <p className="text-xs text-sidebar-foreground/70">{t('common.learnerPortal')}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium mb-2">
            {t('common.learningDashboard')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
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
                      <item.icon className="h-4 w-4" />
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
            {t('common.support')}
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
                      <item.icon className="h-4 w-4" />
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
          {t('common.signOut')}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
