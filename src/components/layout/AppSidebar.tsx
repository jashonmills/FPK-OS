import { LayoutDashboard, Briefcase, DollarSign, Code, Calendar, MessageSquare, Bot, FileText, Files, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
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

const navigationItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard, feature: null },
  { title: 'Kanban Board', url: '/kanban', icon: Briefcase, feature: 'FEATURE_KANBAN' as const },
  { title: 'Budget', url: '/budget', icon: DollarSign, feature: 'FEATURE_BUDGET' as const },
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
  const collapsed = state === 'collapsed';

  const visibleItems = navigationItems.filter(
    item => !item.feature || isFeatureEnabled(item.feature)
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-4">
          {!collapsed && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              FPK Pulse
            </h1>
          )}
          <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/'}
                      className={({ isActive }) =>
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                          : 'hover:bg-sidebar-accent/50'
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
