import { Home, FileText, BarChart3, Settings, FolderOpen, Database, TrendingUp, Target, ClipboardCheck, Users, Activity, TestTube, Flag, Heart, Zap, LayoutDashboard } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { useFamily } from '@/contexts/FamilyContext';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarHeader, useSidebar } from '@/components/ui/sidebar';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
const navItems = [{
  title: 'Dashboard',
  url: '/dashboard',
  icon: Home,
  dataTour: undefined
}, {
  title: 'Activity Logs',
  url: '/activity-log',
  icon: FileText,
  dataTour: 'add-log'
}, {
  title: 'Documents',
  url: '/documents',
  icon: FolderOpen,
  dataTour: 'documents'
}, {
  title: 'Goals',
  url: '/goals',
  icon: Target,
  dataTour: undefined
}, {
  title: 'Assessments',
  url: '/assessments',
  icon: ClipboardCheck,
  dataTour: 'assessments',
  flagKey: 'enable-assessment-hub'
}, {
  title: 'Analytics',
  url: '/analytics',
  icon: BarChart3,
  dataTour: undefined
}, {
  title: 'Settings',
  url: '/settings',
  icon: Settings,
  dataTour: 'settings'
}];
export const AppSidebar = () => {
  const {
    open
  } = useSidebar();
  const {
    selectedFamily
  } = useFamily();
  const {
    user,
    signOut
  } = useAuth();
  
  const { flags } = useFeatureFlags([
    'enable-chart-library-access',
    'enable-knowledge-base-manager',
    'enable-assessment-hub',
    'b2b_portal_active'
  ]);

  // Check if user is admin
  const {
    data: isAdmin
  } = useQuery({
    queryKey: ["is-admin", user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const {
        data,
        error
      } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin"
      });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Check if user is super admin
  const {
    data: isSuperAdmin,
    isLoading: isSuperAdminLoading
  } = useQuery({
    queryKey: ["is-super-admin", user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const {
        data,
        error
      } = await supabase.rpc("has_super_admin_role", {
        _user_id: user.id
      });
      if (error) {
        console.error("Super admin check error in sidebar:", error);
        return false;
      }
      console.log("Super admin check in sidebar:", data, "for user:", user.id);
      return data;
    },
    enabled: !!user?.id,
    retry: 2,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Check if user is family owner
  const {
    data: isOwner
  } = useQuery({
    queryKey: ["is-owner", user?.id, selectedFamily?.id],
    queryFn: async () => {
      if (!user?.id || !selectedFamily?.id) return false;
      const {
        data,
        error
      } = await supabase.rpc("get_user_family_role", {
        _user_id: user.id,
        _family_id: selectedFamily.id
      });
      if (error) throw error;
      return data === "owner";
    },
    enabled: !!user?.id && !!selectedFamily?.id
  });

  // Fetch user profile
  const {
    data: profile
  } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const {
        data,
        error
      } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });
  return <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-4">
          
          {open && <span className="font-semibold text-lg">FPK-X.com</span>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {selectedFamily && open && <div className="px-4 py-2">
            <p className="text-sm font-medium text-muted-foreground">Family</p>
            <p className="text-sm font-semibold truncate">{selectedFamily.family_name}</p>
          </div>}

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.filter(item => !item.flagKey || flags[item.flagKey]).map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({isActive}) => isActive ? 'bg-accent text-accent-foreground font-medium' : ''}
                      data-tour={item.dataTour}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isOwner && flags['enable-chart-library-access'] && <SidebarGroup>
            <SidebarGroupLabel>Premium</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/chart-library" className={({
                  isActive
                }) => isActive ? 'bg-accent text-accent-foreground font-medium' : ''}>
                      <TrendingUp className="h-4 w-4" />
                      <span>Chart Library</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>}

        {isSuperAdmin && <SidebarGroup>
            <SidebarGroupLabel>Platform Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/admin/user-management" className={({ isActive }) => isActive ? 'bg-accent text-accent-foreground font-medium' : ''}>
                      <Users className="h-4 w-4" />
                      <span>User Management</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/admin/pipeline-health" className={({ isActive }) => isActive ? 'bg-accent text-accent-foreground font-medium' : ''}>
                      <Activity className="h-4 w-4" />
                      <span>Pipeline Health</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'bg-accent text-accent-foreground font-medium' : ''}>
                      <TestTube className="h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/admin/extraction-monitoring" className={({ isActive }) => isActive ? 'bg-accent text-accent-foreground font-medium' : ''}>
                      <Database className="h-4 w-4" />
                      <span>Extraction Monitor</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/admin/document-status" className={({ isActive }) => isActive ? 'bg-accent text-accent-foreground font-medium' : ''}>
                      <Flag className="h-4 w-4" />
                      <span>Document Status</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/documents" className={({ isActive }) => isActive ? 'bg-accent text-accent-foreground font-medium' : ''}>
                      <FolderOpen className="h-4 w-4" />
                      <span>Documents</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>}

        {isAdmin && flags['enable-knowledge-base-manager'] && <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/admin/kb-manager" className={({
                  isActive
                }) => isActive ? 'bg-accent text-accent-foreground font-medium' : ''}>
                      <Database className="h-4 w-4" />
                      <span>Knowledge Base</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {isSuperAdminLoading ? (
                  <SidebarMenuItem>
                    <SidebarMenuButton disabled>
                      <FileText className="h-4 w-4 animate-pulse" />
                      <span className="text-muted-foreground">Loading...</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : isSuperAdmin ? (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/admin/content-manager" className={({
                    isActive
                  }) => isActive ? 'bg-accent text-accent-foreground font-medium' : ''}>
                        <FileText className="h-4 w-4" />
                        <span>Content Manager</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : null}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>}

        {/* B2B Organization Portal Link (Super Admin Only) */}
        {isSuperAdmin && flags['b2b_portal_active'] && (
          <SidebarGroup>
            <SidebarGroupLabel>Organization Portal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/org/dashboard">
                      <Database className="h-4 w-4" />
                      <span>Switch to B2B Portal</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <div className="p-2">
          {open ? <div className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-accent">
              <div className="flex items-center gap-2 min-w-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {profile?.full_name || user?.email}
                  </p>
                  {profile?.full_name && <p className="text-xs text-muted-foreground truncate">{user?.email}</p>}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={signOut} className="text-xs">
                Sign Out
              </Button>
            </div> : <Button variant="ghost" size="icon" onClick={signOut} className="w-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>}
        </div>
      </SidebarFooter>
    </Sidebar>;
};