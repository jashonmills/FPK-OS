import { Home, FileText, BarChart3, Settings, FolderOpen, Database } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useFamily } from '@/contexts/FamilyContext';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';

const navItems = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Activity Logs', url: '/activity-log', icon: FileText },
  { title: 'Documents', url: '/documents', icon: FolderOpen },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export const AppSidebar = () => {
  const { open } = useSidebar();
  const { selectedFamily } = useFamily();
  const { user, signOut } = useAuth();

  // Check if user is admin
  const { data: isAdmin } = useQuery({
    queryKey: ["is-admin", user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            PH
          </div>
          {open && <span className="font-semibold text-lg">Progress Hub</span>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {selectedFamily && open && (
          <div className="px-4 py-2">
            <p className="text-sm font-medium text-muted-foreground">Family</p>
            <p className="text-sm font-semibold truncate">{selectedFamily.family_name}</p>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive ? 'bg-accent text-accent-foreground font-medium' : ''
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/admin/kb-manager"
                      className={({ isActive }) =>
                        isActive ? 'bg-accent text-accent-foreground font-medium' : ''
                      }
                    >
                      <Database className="h-4 w-4" />
                      <span>Knowledge Base</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <div className="p-2">
          {open ? (
            <div className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-accent">
              <div className="flex items-center gap-2 min-w-0">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {user?.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-xs"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              className="w-full"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {user?.email?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
