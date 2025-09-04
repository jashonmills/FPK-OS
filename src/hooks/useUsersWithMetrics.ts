import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UserWithMetrics {
  id: string;
  name: string;
  email: string;
  roles: string[];
  createdAt: string;
  lastActiveAt: string | null;
  weeklySeconds: number;
  enrollmentCount: number;
  avgProgressPercent: number;
  goalsActive: number;
  goalsCompleted: number;
}

interface UseUsersWithMetricsOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  activity?: string;
  progressBand?: string;
  hasGoals?: string;
  sortBy?: string;
  sortDir?: string;
}

export const useUsersWithMetrics = (options: UseUsersWithMetricsOptions = {}) => {
  return useQuery({
    queryKey: ['users-with-metrics', options],
    queryFn: async () => {
      console.log('Fetching users with metrics, options:', options);
      
      const {
        page = 1,
        pageSize = 20,
        search = '',
        role = 'all',
        activity = 'all',
        progressBand = 'all',
        hasGoals = 'all',
        sortBy = 'createdAt',
        sortDir = 'desc'
      } = options;

      // Try to call the edge function first
      try {
        const { data, error } = await supabase.functions.invoke('admin-users-with-metrics', {
          body: {
            page,
            pageSize,
            search,
            role,
            activity,
            progressBand,
            hasGoals,
            sortBy,
            sortDir
          }
        });

        if (error) {
          console.warn('Edge function failed, falling back to direct query:', error);
          throw error;
        }

        return data;
      } catch (error) {
        console.warn('Edge function not available, using fallback query:', error);
        
        // Fallback to direct database queries
        const offset = (page - 1) * pageSize;
        
        // Get profiles with basic filtering
        let profileQuery = supabase
          .from('profiles')
          .select('id, full_name, display_name, created_at');

        if (search) {
          profileQuery = profileQuery.or(`full_name.ilike.%${search}%,display_name.ilike.%${search}%`);
        }

        const { data: profiles, error: profilesError } = await profileQuery
          .order('created_at', { ascending: sortDir === 'asc' })
          .range(offset, offset + pageSize - 1);

        if (profilesError) throw profilesError;

        // Get additional data for each user
        const usersWithMetrics: UserWithMetrics[] = await Promise.all(
          profiles.map(async (profile) => {
            // Get user roles
            const { data: roles } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', profile.id);

            // Get enrollment count
            const { count: enrollmentCount } = await supabase
              .from('enrollments')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', profile.id);

            // Get goal counts
            const { data: goals } = await supabase
              .from('goals')
              .select('status')
              .eq('user_id', profile.id);

            const goalsActive = goals?.filter(g => g.status === 'active').length || 0;
            const goalsCompleted = goals?.filter(g => g.status === 'completed').length || 0;

            // Get last activity from various sources
            const activitySources = await Promise.all([
              supabase
                .from('daily_activities')
                .select('created_at')
                .eq('user_id', profile.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single(),
              supabase
                .from('chat_sessions')
                .select('updated_at')
                .eq('user_id', profile.id)
                .order('updated_at', { ascending: false })
                .limit(1)
                .single(),
              supabase
                .from('reading_sessions')
                .select('session_start')
                .eq('user_id', profile.id)
                .order('session_start', { ascending: false })
                .limit(1)
                .single()
            ]);

            const lastActivities = activitySources
              .map(result => {
                const data = result.data;
                if (!data) return null;
                if ('created_at' in data) return data.created_at;
                if ('updated_at' in data) return data.updated_at;
                if ('session_start' in data) return data.session_start;
                return null;
              })
              .filter(Boolean)
              .map(date => new Date(date as string))
              .sort((a, b) => b.getTime() - a.getTime());

            const lastActiveAt = lastActivities.length > 0 ? lastActivities[0].toISOString() : null;

            // Get weekly time
            const { data: weeklyActivity } = await supabase
              .from('daily_activities')
              .select('duration_minutes')
              .eq('user_id', profile.id)
              .gte('activity_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

            const weeklyMinutes = weeklyActivity?.reduce((sum, activity) => sum + (activity.duration_minutes || 0), 0) || 0;

            // Get average progress
            const { data: enrollments } = await supabase
              .from('enrollments')
              .select('progress')
              .eq('user_id', profile.id);

            const progressValues = enrollments?.map(e => {
              const progress = e.progress as any;
              return progress?.completion_percentage || 0;
            }).filter(p => p > 0) || [];

            const avgProgressPercent = progressValues.length > 0 
              ? Math.round(progressValues.reduce((sum, p) => sum + p, 0) / progressValues.length)
              : 0;

            // Try to get email from auth
            let email = `${profile.full_name?.toLowerCase().replace(/\s+/g, '.')}@fpkuniversity.com`;
            try {
              const { data: authUser } = await supabase.auth.admin.getUserById(profile.id);
              if (authUser?.user?.email) {
                email = authUser.user.email;
              }
            } catch (e) {
              // Use fallback email
            }

            return {
              id: profile.id,
              name: profile.full_name || profile.display_name || 'Unknown User',
              email,
              roles: roles?.map(r => r.role) || [],
              createdAt: profile.created_at,
              lastActiveAt,
              weeklySeconds: weeklyMinutes * 60,
              enrollmentCount: enrollmentCount || 0,
              avgProgressPercent,
              goalsActive,
              goalsCompleted
            };
          })
        );

        // Apply role filter
        const filteredUsers = role === 'all' 
          ? usersWithMetrics 
          : usersWithMetrics.filter(user => user.roles.includes(role));

        // Get total count
        const { count: totalCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        return {
          users: filteredUsers,
          pagination: {
            page,
            pageSize,
            total: totalCount || 0,
            totalPages: Math.ceil((totalCount || 0) / pageSize)
          }
        };
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1
  });
};