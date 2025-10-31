import { LayoutDashboard, Briefcase, DollarSign, Code, Calendar, MessageSquare, Bot, FileText, Files, LogOut, Shield } from 'lucide-react';
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
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const navigationItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard, feature: null, adminOnly: false },
  { title: 'Kanban Board', url: '/kanban', icon: Briefcase, feature: null, adminOnly: false },
  { title: 'Admin', url: '/admin', icon: Shield, feature: null, adminOnly: true },
  { title: 'Budget', url: '/budget', icon: DollarSign, feature: 'FEATURE_BUDGET' as const, adminOnly: false },
  { title: 'Development', url: '/development', icon: Code, feature: 'FEATURE_DEVELOPMENT' as const, adminOnly: false },
  { title: 'Planning', url: '/planning', icon: Calendar, feature: 'FEATURE_PLANNING' as const, adminOnly: false },
  { title: 'Messages', url: '/messages', icon: MessageSquare, feature: 'FEATURE_MESSAGES' as const, adminOnly: false },
  { title: 'AI Assistant', url: '/ai', icon: Bot, feature: 'FEATURE_AI_CHATBOT' as const, adminOnly: false },
  { title: 'Documentation', url: '/docs', icon: FileText, feature: 'FEATURE_DOCUMENTATION' as const, adminOnly: false },
  { title: 'Files', url: '/files', icon: Files, feature: 'FEATURE_FILES' as const, adminOnly: false },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { isFeatureEnabled } = useFeatureFlags();
  const { user, signOut } = useAuth();
  const collapsed = state === 'collapsed';
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) return;

      try {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        setIsAdmin(data?.role === 'admin');
      } catch (error) {
        setIsAdmin(false);
      }
    };

    checkAdminRole();
  }, [user]);

  const visibleItems = navigationItems.filter(
    item => {
      if (item.adminOnly && !isAdmin) return false;
      return !item.feature || isFeatureEnabled(item.feature);
    }
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-4">
          {!collapsed && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              FPK Pulse
            </h1>
          )}
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
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            className="flex-1 justify-start"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
