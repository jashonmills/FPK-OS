import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const usePermissions = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user) {
        setPermissions([]);
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        // 1. Get user's role
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (!roleData) {
          setLoading(false);
          return;
        }

        setRole(roleData.role);

        // 2. Get role's default permissions
        const { data: rolePerms } = await supabase
          .from('role_permissions')
          .select('permission_id, permissions(name)')
          .eq('role', roleData.role);

        // 3. Get user-specific overrides
        const { data: userPerms } = await supabase
          .from('user_permissions')
          .select('permission_id, granted, permissions(name)')
          .eq('user_id', user.id);

        // 4. Merge: start with role defaults, apply overrides
        const defaultPerms = rolePerms?.map((rp: any) => rp.permissions.name) || [];
        const overrides = userPerms || [];

        const finalPerms = new Set(defaultPerms);
        overrides.forEach((override: any) => {
          if (override.granted) {
            finalPerms.add(override.permissions.name);
          } else {
            finalPerms.delete(override.permissions.name);
          }
        });

        setPermissions(Array.from(finalPerms));
      } catch (error) {
        console.error('Error fetching permissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();

    // Subscribe to permission changes
    const permissionsChannel = supabase
      .channel('permissions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_permissions',
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchPermissions();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_roles',
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchPermissions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(permissionsChannel);
    };
  }, [user]);

  const hasPermission = (permission: string) => permissions.includes(permission);
  
  const hasAnyPermission = (perms: string[]) => 
    perms.some(p => permissions.includes(p));
  
  const hasAllPermissions = (perms: string[]) => 
    perms.every(p => permissions.includes(p));

  return { 
    permissions, 
    role, 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions, 
    loading 
  };
};
