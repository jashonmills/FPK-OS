import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Role } from '@/types/user';

export const useUsers = (searchQuery: string = '', roleFilter: string = 'all') => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users', searchQuery, roleFilter],
    queryFn: async () => {
      console.log('Fetching users with filters:', { searchQuery, roleFilter });
      
      // Get user profiles with auth user data
      let profileQuery = supabase
        .from('profiles')
        .select(`
          id, 
          full_name, 
          display_name, 
          created_at
        `);

      if (searchQuery) {
        profileQuery = profileQuery.or(`full_name.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%`);
      }

      const { data: profiles, error: profilesError } = await profileQuery;
      if (profilesError) throw profilesError;

      // Get auth users data to get real emails - handle potential permission issues
      let authUsersData: any[] = [];
      try {
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        if (authError) {
          console.error('Error fetching auth users:', authError);
        } else {
          authUsersData = authUsers?.users || [];
        }
      } catch (error) {
        console.error('Failed to fetch auth users - admin permissions may be required:', error);
      }

      // Get user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      if (rolesError) throw rolesError;

      // Combine data
      const usersWithRoles: User[] = profiles?.map(profile => {
        const userRoles = roles?.filter(role => role.user_id === profile.id) || [];
        const authUser = authUsersData.find((user: any) => user.id === profile.id);
        
        return {
          id: profile.id,
          email: authUser?.email || `user-${profile.id.slice(0, 8)}@example.com`,
          full_name: profile.full_name || 'No name',
          display_name: profile.display_name || 'No display name',
          created_at: profile.created_at,
          roles: userRoles.map(r => r.role as Role)
        };
      }) || [];

      // Filter by role if specified
      return usersWithRoles.filter(user => {
        if (roleFilter === 'all') return true;
        return user.roles.includes(roleFilter as Role);
      });
    },
  });

  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: Role }) => {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Role assigned",
        description: "User role has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to assign role. Please try again.",
        variant: "destructive",
      });
    },
  });

  const removeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: Role }) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Role removed",
        description: "User role has been removed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove role. Please try again.",
        variant: "destructive",
      });
    },
  });

  const assignRole = (userId: string, role: Role) => {
    assignRoleMutation.mutate({ userId, role });
  };

  const removeRole = (userId: string, role: Role) => {
    removeRoleMutation.mutate({ userId, role });
  };

  return {
    users,
    isLoading,
    error,
    assignRole,
    removeRole,
    isAssigning: assignRoleMutation.isPending,
    isRemoving: removeRoleMutation.isPending,
  };
};
