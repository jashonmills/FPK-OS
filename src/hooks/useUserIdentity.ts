import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

// Define the standardized Identity object that the entire app will use
export interface UserIdentity {
  isLoggedIn: boolean;
  isPlatformUser: boolean;
  isStudentPortalUser: boolean;
  userId: string;
  profile: {
    fullName: string | null;
    displayName: string | null;
    avatarUrl: string | null;
  };
  memberships: Array<{
    orgId: string;
    role: 'owner' | 'instructor' | 'student';
  }>;
}

// This is the main fetcher function. It contains the core logic.
const fetchUserIdentity = async (user: any): Promise<UserIdentity | null> => {
  if (!user) {
    return null;
  }

  const isStudentPortalUser = user.email?.endsWith('@portal.fpkuniversity.com');

  if (isStudentPortalUser) {
    // --- Path for "Student-Only" Users ---
    const { data: studentData, error: studentError } = await supabase
      .from('org_students')
      .select('id, full_name, org_id, activation_status')
      .eq('linked_user_id', user.id)
      .maybeSingle();

    if (studentError || !studentData) {
      console.error('Failed to fetch student-only profile:', studentError);
      throw new Error('Student-only user profile not found.');
    }

    return {
      isLoggedIn: true,
      isPlatformUser: false,
      isStudentPortalUser: true,
      userId: user.id,
      profile: {
        fullName: studentData.full_name,
        displayName: studentData.full_name,
        avatarUrl: null,
      },
      memberships: [{
        orgId: studentData.org_id,
        role: 'student',
      }],
    };
  } else {
    // --- Path for "Platform Users" ---
    // Fetch profile and memberships in parallel for efficiency
    const [profileResult, membershipsResult] = await Promise.all([
      supabase.from('profiles').select('full_name, display_name, avatar_url').eq('id', user.id).maybeSingle(),
      supabase.from('org_members').select('org_id, role').eq('user_id', user.id).eq('status', 'active'),
    ]);

    const { data: profileData, error: profileError } = profileResult;
    const { data: membershipsData, error: membershipsError } = membershipsResult;

    if (profileError) {
      console.error('Failed to fetch platform user profile:', profileError);
      throw new Error('Platform user profile not found.');
    }
    if (membershipsError) {
      console.error('Failed to fetch platform user memberships:', membershipsError);
      throw new Error('Failed to fetch memberships.');
    }

    return {
      isLoggedIn: true,
      isPlatformUser: true,
      isStudentPortalUser: false,
      userId: user.id,
      profile: {
        fullName: profileData?.full_name || null,
        displayName: profileData?.display_name || null,
        avatarUrl: profileData?.avatar_url || null,
      },
      memberships: (membershipsData || []).map(m => ({ 
        orgId: m.org_id, 
        role: m.role as 'owner' | 'instructor' | 'student'
      })),
    };
  }
};

// The final hook that the application will consume.
export const useUserIdentity = () => {
  const { user, loading: authLoading } = useAuth();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['user-identity', user?.id],
    queryFn: () => fetchUserIdentity(user),
    enabled: !authLoading && !!user,
    staleTime: 5 * 60 * 1000, // Cache identity for 5 minutes
    retry: 1,
  });

  return {
    identity: data,
    isLoading: authLoading || (isLoading && !!user),
    isError,
    error,
  };
};
