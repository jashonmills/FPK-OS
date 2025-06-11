import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserProfile, UserRole, isValidRole } from '@/types/userManagement';

export const useUserManagement = (searchQuery: string, roleFilter: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users', searchQuery, roleFilter],
    queryFn: async () => {
      console.log('Fetching user data...');
      
      try {
        // Get user profiles
        let profileQuery = supabase
          .from('profiles')
          .select('id, full_name, display_name, created_at');

        if (searchQuery) {
          profileQuery = profileQuery.or(`full_name.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%`);
        }

        const { data: profilesData, error: profilesError } = await profileQuery;
        console.log('Profiles data:', profilesData);
        console.log('Profiles error:', profilesError);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          throw profilesError;
        }

        // Get user roles separately
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role');
        
        console.log('Roles data:', rolesData);
        console.log('Roles error:', rolesError);

        if (rolesError) {
          console.error('Error fetching roles:', rolesError);
          throw rolesError;
        }

        // Try to get real email addresses from auth.users via a server function
        // For now, we'll use mock emails but log the user IDs for debugging
        const transformedUsers: UserProfile[] = profilesData?.map(profile => {
          const userRoles = rolesData?.filter(role => role.user_id === profile.id) || [];
          console.log(`User ${profile.id} has roles:`, userRoles);
          
          return {
            id: profile.id,
            email: `user-${profile.id.slice(0, 8)}@example.com`, // Mock email - we'll improve this
            full_name: profile.full_name || 'No name',
            display_name: profile.display_name || 'No display name',
            created_at: profile.created_at,
            roles: userRoles.map(r => r.role)
          };
        }) || [];

        console.log('Transformed users before filtering:', transformedUsers);
        console.log('Total users found:', transformedUsers.length);

        const filteredUsers = transformedUsers.filter(user => {
          const matchesRole = roleFilter === 'all' || user.roles.includes(roleFilter);
          console.log(`User ${user.full_name} matches role filter ${roleFilter}:`, matchesRole);
          return matchesRole;
        });

        console.log('Filtered users:', filteredUsers);
        console.log('Current role filter:', roleFilter);

        return filteredUsers;
      } catch (error) {
        console.error('Error in user management query:', error);
        throw error;
      }
    },
  });

  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      console.log('Assigning role:', { userId, role });
      
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });
      
      if (error) {
        console.error('Error assigning role:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Role assigned successfully",
        description: "The user role has been updated.",
      });
    },
    onError: (error) => {
      console.error('Error assigning role:', error);
      toast({
        title: "Error assigning role",
        description: "Failed to assign role. Please try again.",
        variant: "destructive",
      });
    },
  });

  const removeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      console.log('Removing role:', { userId, role });
      
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);
      
      if (error) {
        console.error('Error removing role:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Role removed successfully",
        description: "The user role has been removed.",
      });
    },
    onError: (error) => {
      console.error('Error removing role:', error);
      toast({
        title: "Error removing role",
        description: "Failed to remove role. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAssignRole = (userId: string, role: string) => {
    console.log('handleAssignRole called with:', { userId, role });
    
    if (!isValidRole(role)) {
      console.error('Invalid role provided:', role);
      toast({
        title: "Invalid role",
        description: "Please select a valid role.",
        variant: "destructive",
      });
      return;
    }
    
    console.log('Role is valid, proceeding with assignment');
    // At this point, TypeScript knows role is UserRole due to the type predicate
    assignRoleMutation.mutate({ userId, role });
  };

  const handleRemoveRole = (userId: string, role: string) => {
    console.log('handleRemoveRole called with:', { userId, role });
    removeRoleMutation.mutate({ userId, role });
  };

  return {
    users,
    isLoading,
    handleAssignRole,
    handleRemoveRole
  };
};
