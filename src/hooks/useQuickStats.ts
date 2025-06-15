
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface QuickStats {
  activeUsers: number | null;
  courses: number | null;
  booksInStorage: number | null;
  systemHealth: {
    status: 'ok' | 'degraded';
    message?: string;
  } | null;
}

export const useQuickStats = () => {
  return useQuery({
    queryKey: ['admin-quick-stats'],
    queryFn: async (): Promise<QuickStats> => {
      console.log('🔄 Fetching admin quick stats...');

      // Fetch all stats in parallel
      const [usersResult, coursesResult, storageResult, healthResult] = await Promise.allSettled([
        // Active Users - count from profiles table with auth check
        fetchActiveUsers(),
        // Courses - count from courses table
        fetchCoursesCount(),
        // Books in Storage - count files in storage bucket
        fetchBooksInStorage(),
        // System Health - check Supabase connection
        fetchSystemHealth()
      ]);

      const stats: QuickStats = {
        activeUsers: usersResult.status === 'fulfilled' ? usersResult.value : null,
        courses: coursesResult.status === 'fulfilled' ? coursesResult.value : null,
        booksInStorage: storageResult.status === 'fulfilled' ? storageResult.value : null,
        systemHealth: healthResult.status === 'fulfilled' ? healthResult.value : null
      };

      // Log any errors
      if (usersResult.status === 'rejected') {
        console.error('❌ Failed to fetch active users:', usersResult.reason);
      }
      if (coursesResult.status === 'rejected') {
        console.error('❌ Failed to fetch courses count:', coursesResult.reason);
      }
      if (storageResult.status === 'rejected') {
        console.error('❌ Failed to fetch books in storage:', storageResult.reason);
      }
      if (healthResult.status === 'rejected') {
        console.error('❌ Failed to fetch system health:', healthResult.reason);
      }

      console.log('✅ Quick stats fetched:', stats);
      return stats;
    },
    refetchInterval: 60000, // Refresh every minute
  });
};

async function fetchActiveUsers(): Promise<number> {
  // Count profiles as a proxy for active users since we can't access auth.users directly
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  if (error) {
    throw new Error(`Failed to fetch active users: ${error.message}`);
  }

  return count || 0;
}

async function fetchCoursesCount(): Promise<number> {
  const { count, error } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true });

  if (error) {
    throw new Error(`Failed to fetch courses count: ${error.message}`);
  }

  return count || 0;
}

async function fetchBooksInStorage(): Promise<number> {
  try {
    // First try the 'books' bucket (for EPUBs)
    const { data: booksData, error: booksError } = await supabase.storage
      .from('books')
      .list();

    let booksCount = 0;
    if (!booksError && booksData) {
      booksCount = booksData.length;
    }

    // Also try other common book storage buckets
    const buckets = ['library-book-pdf', 'user-uploads'];
    let totalCount = booksCount;

    for (const bucket of buckets) {
      try {
        const { data, error } = await supabase.storage
          .from(bucket)
          .list();

        if (!error && data) {
          totalCount += data.length;
        }
      } catch (e) {
        // Bucket might not exist, continue
        console.warn(`Bucket ${bucket} not accessible:`, e);
      }
    }

    return totalCount;
  } catch (error) {
    throw new Error(`Failed to fetch books in storage: ${error.message}`);
  }
}

async function fetchSystemHealth(): Promise<{ status: 'ok' | 'degraded'; message?: string }> {
  try {
    // Test Supabase connection by making a simple query
    const { error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
      .single();

    // If we can query (even if no data), the system is healthy
    if (!error || error.code === 'PGRST116') { // PGRST116 = no rows returned
      return { status: 'ok' };
    }

    return {
      status: 'degraded',
      message: error.message
    };
  } catch (error) {
    return {
      status: 'degraded',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
