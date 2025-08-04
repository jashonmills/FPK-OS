
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import {
  Home,
  Book,
  BookOpen,
  GraduationCap,
  Settings,
  CreditCard,
  Shield,
  LogOut,
  LayoutDashboard,
  HelpCircle,
  MessageSquare,
  Users,
  Brain,
  Lightbulb,
  FileText,
  ChevronDown,
  Target,
  BarChart3,
  Zap,
  StickyNote,
} from "lucide-react"
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslation } from 'react-i18next';

const AppSidebar = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('navigation');

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const mainItems = [
    {
      title: t('dashboard'),
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: t('home'),
      url: "/dashboard/learner",
      icon: Home,
    },
    {
      title: t('library'),
      url: "/dashboard/learner/library",
      icon: Book,
    },
    {
      title: 'Browse',
      url: "/dashboard/browse",
      icon: BookOpen,
    },
    {
      title: t('courses'),
      url: "/dashboard/learner/courses",
      icon: GraduationCap,
    },
    {
      title: t('analytics'),
      url: "/dashboard/learner/analytics",
      icon: BarChart3,
    },
    {
      title: t('goals'),
      url: "/dashboard/learner/goals",
      icon: Target,
    },
    {
      title: t('notes'),
      url: "/dashboard/learner/notes",
      icon: StickyNote,
    },
  ];

  const aiTools = [
    {
      title: 'AI Study Chat',
      url: "/dashboard/learner/ai-coach",
      icon: MessageSquare,
    },
    {
      title: 'AI Knowledge Base',
      url: "/dashboard/ai-knowledge",
      icon: Brain,
    },
    {
      title: 'AI Prompts',
      url: "/dashboard/ai-prompts",
      icon: Lightbulb,
    },
  ];

  const learnerTools = [
    {
      title: 'Gamification',
      url: "/dashboard/learner/gamification",
      icon: Zap,
    },
    {
      title: 'Flashcards',
      url: "/dashboard/learner/flashcards",
      icon: FileText,
    },
  ];

  const adminTools = [
    {
      title: 'User Management',
      url: "/admin/users",
      icon: Users,
    },
    {
      title: 'Content Management',
      url: "/admin/content",
      icon: FileText,
    },
  ];

  const footerItems = [
    {
      title: 'Subscription',
      url: "/dashboard/subscription",
      icon: CreditCard,
    },
    {
      title: 'Privacy',
      url: "/privacy-preferences",
      icon: Shield,
    },
    {
      title: t('settings'),
      url: "/dashboard/learner/settings",
      icon: Settings,
    },
    {
      title: 'Help',
      url: "/dashboard/help",
      icon: HelpCircle,
    },
  ];

  return (
    <Sidebar className="bg-sidebar border-sidebar-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground font-semibold">
              {user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-sidebar-foreground text-sm">
              {user?.email}
            </div>
            <div className="text-xs text-sidebar-foreground/70">
              Learning Dashboard
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <Collapsible defaultOpen>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="group/label text-sidebar-foreground/70 hover:text-sidebar-foreground cursor-pointer flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  AI Tools
                </div>
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/label:rotate-180" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {aiTools.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive(item.url)}
                        className="pl-6 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                      >
                        <Link to={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <Collapsible defaultOpen>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="group/label text-sidebar-foreground/70 hover:text-sidebar-foreground cursor-pointer flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Learning Tools
                </div>
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/label:rotate-180" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {learnerTools.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive(item.url)}
                        className="pl-6 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                      >
                        <Link to={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {isAdmin && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel className="group/label text-sidebar-foreground/70 hover:text-sidebar-foreground cursor-pointer flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Admin Tools
                    </div>
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/label:rotate-180" />
                  </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {adminTools.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton 
                            asChild 
                            isActive={isActive(item.url)}
                            className="pl-6 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                          >
                            <Link to={item.url}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          {footerItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild={!!item.url}
                isActive={item.url ? isActive(item.url) : false}
                className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
              >
                {item.url ? (
                  <Link to={item.url}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2 w-full">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </div>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleSignOut}
              className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
