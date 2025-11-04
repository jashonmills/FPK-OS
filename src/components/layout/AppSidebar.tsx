import { LayoutDashboard, Briefcase, DollarSign, Code, Calendar, MessageSquare, Bot, FileText, Files, LogOut, Shield, Clock } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useFeatureFlags } from '@/contexts/FeatureFlagContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { TimeClockWidget } from '@/components/timeclock/TimeClockWidget';
import { usePermissions } from '@/hooks/usePermissions';

const navigationItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard, feature: null },
  { title: 'My Timesheet', url: '/my-timesheet', icon: Clock, feature: 'FEATURE_TIMESHEET' as const },
  { title: 'Kanban Board', url: '/kanban', icon: Briefcase, feature: null, permission: ['projects_view_assigned', 'projects_view_all', 'projects_readonly'] },
  { title: 'Budget', url: '/budget', icon: DollarSign, feature: 'FEATURE_BUDGET' as const, permission: ['budget_view_all', 'budget_view_assigned'] },
  { title: 'Payroll', url: '/payroll', icon: DollarSign, feature: 'FEATURE_PAYROLL' as const, permission: ['payroll_view'] },
  { title: 'Admin', url: '/admin', icon: Shield, feature: null, permission: ['admin_panel_full', 'admin_panel_limited'] },
  { title: 'Development', url: '/development', icon: Code, feature: 'FEATURE_DEVELOPMENT' as const },
  { title: 'Planning', url: '/planning', icon: Calendar, feature: 'FEATURE_PLANNING' as const },
  { title: 'Messages', url: '/messages', icon: MessageSquare, feature: 'FEATURE_MESSAGES' as const },
  { title: 'AI Assistant', url: '/ai', icon: Bot, feature: 'FEATURE_AI_CHATBOT' as const },
  { title: 'Documentation', url: '/docs', icon: FileText, feature: 'FEATURE_DOCUMENTATION' as const },
  { title: 'Files', url: '/files', icon: Files, feature: 'FEATURE_FILES' as const },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { isFeatureEnabled } = useFeatureFlags();
  const { signOut } = useAuth();
  const { hasAnyPermission } = usePermissions();
  const collapsed = state === 'collapsed';
  const location = useLocation();

  const isRouteActive = (url: string) => {
    const pathname = location.pathname;
    if (url === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(url);
  };

  const visibleItems = navigationItems.filter(
    item => {
      if (item.permission && !hasAnyPermission(item.permission)) return false;
      return !item.feature || isFeatureEnabled(item.feature);
    }
  );

  return (
    <Sidebar collapsible="icon" className="border-r md:w-64 w-full">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3 md:py-4">
          <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            FPK Pulse
          </h1>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Time Clock Widget */}
        <div className="px-2 py-3 md:py-4 border-b border-sidebar-border">
          <TimeClockWidget />
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs md:text-sm">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10 md:h-9">
                    <NavLink
                      to={item.url}
                      className={
                        isRouteActive(item.url)
                          ? 'bg-primary/20 text-primary font-semibold border-l-4 border-primary'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent/20 hover:text-sidebar-accent-foreground'
                      }
                    >
                      <item.icon className="h-5 w-5 md:h-4 md:w-4" />
                      <span className="text-sm md:text-base">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            className="flex-1 justify-start"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4" />
            <span className="ml-2">Sign Out</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
