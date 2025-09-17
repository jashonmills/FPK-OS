import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Organization } from '@/types/organization';

console.log('🔍 useAdminOrganizations Hook - Loading');

// Admin-specific hook to fetch ALL organizations in the system
export function useAdminOrganizations() {
  const { user } = useAuth();

  console.log('🔍 useAdminOrganizations Hook - User:', user);

  const { data: organizations, isLoading, error } = useQuery({
    queryKey: ['admin-organizations'],
    queryFn: async (): Promise<Organization[]> => {
      if (!user) return [];

      console.log('🔍 Admin Organizations Hook - Fetching organizations for admin:', user.id);

      // Fetch ALL organizations - admin policies will handle access control
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('📊 Admin Organizations Query Result:', { data, error });

      if (error) {
        console.error('Error fetching admin organizations:', error);
        throw error;
      }

      // Transform data to match our interface  
      return data.map((org): Organization => ({
        id: org.id,
        name: org.name,
        description: org.description || undefined,
        owner_id: org.owner_id,
        plan: org.plan as any, // Type assertion for database enum
        seat_cap: org.seat_cap,
        seats_used: org.seats_used || 0,
        instructors_used: org.instructors_used || 0,
        instructor_limit: org.instructor_limit || 5,
        brand_primary: org.brand_primary,
        brand_accent: org.brand_accent,
        logo_url: org.logo_url,
        slug: org.slug,
        is_suspended: org.is_suspended,
        suspended_at: org.suspended_at,
        suspended_by: org.suspended_by,
        suspended_reason: org.suspended_reason,
        status: (org.status as 'active' | 'suspended' | 'deleted') || 'active',
        created_by: org.created_by,
        created_at: org.created_at,
        updated_at: org.updated_at,
      }));
    },
    enabled: !!user,
  });

  return {
    organizations: organizations || [],
    isLoading,
    error,
  };
}