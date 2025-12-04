import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { assertOrg } from '@/lib/org/context';
import type { CourseCard, OrgCatalogResponse, CourseCardBadge } from '@/types/course-card';
import { NEW_COURSE_IDS } from '@/utils/newCourseIds';

interface PlatformCourse {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  background_image?: string;
  instructor_name?: string;
  duration_minutes?: number;
  difficulty_level?: string;
  tags?: string[];
  status: string;
  source?: string;
  discoverable?: boolean;
  slug?: string;
}

interface OrgCourse {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  background_image?: string;
  level?: string;
  duration_estimate_mins?: number;
  status: string;
  source?: string;
  discoverable?: boolean;
  org_id: string;
}

function mapPlatformCoursesToCards(courses: PlatformCourse[]): CourseCard[] {
  return courses.map(course => {
    const badges: CourseCardBadge[] = [
      { type: 'platform', label: 'Platform', variant: 'secondary' }
    ];

    if (course.source === 'scorm') {
      badges.push({ type: 'scorm', label: 'SCORM', variant: 'outline' });
    }

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail_url: course.thumbnail_url,
      background_image: course.background_image,
      instructor_name: course.instructor_name,
      duration_minutes: course.duration_minutes,
      difficulty_level: course.difficulty_level,
      tags: course.tags || [],
      source: (course.source as any) || 'platform',
      status: course.status as any,
      discoverable: course.discoverable || false,
      source_table: 'courses',
      badges,
      route: course.slug ? `/courses/player/${course.slug}` : `/course/${course.id}`, // Use Universal Player route
      slug: course.slug
    };
  });
}

function mapOrgCoursesToCards(courses: OrgCourse[], orgId: string): CourseCard[] {
  return courses.map(course => {
    const badges: CourseCardBadge[] = [
      { type: 'org', label: 'Organization', variant: 'default' }
    ];

    if (course.source === 'scorm') {
      badges.push({ type: 'scorm', label: 'SCORM', variant: 'outline' });
    }

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail_url: course.thumbnail_url,
      background_image: course.background_image,
      duration_minutes: course.duration_estimate_mins,
      difficulty_level: course.level,
      source: (course.source as any) || 'builder',
      status: course.status as any,
      discoverable: course.discoverable || false,
      source_table: 'org_courses',
      org_id: orgId,
      badges,
      route: `/org/${orgId}/course/${course.id}`
    };
  });
}

export function useOrgCatalog() {
  const orgId = assertOrg();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['org-catalog', orgId],
    queryFn: async (): Promise<OrgCatalogResponse> => {
      console.log('useOrgCatalog - Fetching catalog for org:', orgId);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No authenticated user');
      }

      // Check user's role in the organization
      const { data: memberData, error: memberError } = await supabase
        .from('org_members')
        .select('role')
        .eq('org_id', orgId)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (memberError) {
        console.error('Error fetching member role:', memberError);
        throw memberError;
      }

      const isStudent = memberData?.role === 'student';
      console.log('useOrgCatalog - User role:', memberData?.role, 'isStudent:', isStudent);

      if (isStudent) {
        // For students, fetch courses from BOTH assignments and enrollments
        const courseIds = new Set<string>();

        // 1. Fetch assigned courses from org_assignment_targets
        const { data: assignedTargets, error: assignmentError } = await supabase
          .from('org_assignment_targets')
          .select(`
            assignment_id,
            org_assignments!inner (
              resource_id,
              type
            )
          `)
          .eq('target_id', user.id)
          .eq('target_type', 'member');

        if (assignmentError) {
          console.error('Error fetching student assignments:', assignmentError);
        } else {
          assignedTargets?.forEach(target => {
            const assignment = target.org_assignments;
            if (assignment.type === 'course') {
              courseIds.add(assignment.resource_id);
            }
          });
        }

        // 2. Fetch enrolled courses from enrollments table
        const { data: enrollments, error: enrollmentError } = await supabase
          .from('enrollments')
          .select('course_id')
          .eq('user_id', user.id);

        if (enrollmentError) {
          console.error('Error fetching student enrollments:', enrollmentError);
        } else {
          enrollments?.forEach(enrollment => {
            courseIds.add(enrollment.course_id);
          });
        }

        console.log('useOrgCatalog - Total course IDs (assignments + enrollments):', courseIds.size);

        // Fetch assigned courses from both tables
        let platformCourses: PlatformCourse[] = [];
        let orgCourses: OrgCourse[] = [];

        if (courseIds.size > 0) {
          const courseIdArray = Array.from(courseIds);
          
          // Separate UUID format (org courses) from text format (platform courses)
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          const uuidCourseIds = courseIdArray.filter(id => uuidRegex.test(id));
          
          // Try platform courses first (all course IDs)
          console.log('[useOrgCatalog] Fetching platform courses with RPC...');
          const { data: platformData, error: platformError } = await supabase.rpc('get_published_courses');

          if (platformError) {
            console.error('Error fetching assigned platform courses:', platformError);
          } else {
            // Filter to only courses in our assignment/enrollment list
            platformCourses = (platformData || []).filter(course => courseIdArray.includes(course.id));
            console.log('[useOrgCatalog] Filtered to', platformCourses.length, 'assigned courses');
          }

          // Try org courses only with UUID format IDs
          if (uuidCourseIds.length > 0) {
            const { data: orgData, error: orgError } = await supabase
              .from('org_courses')
              .select('*')
              .in('id', uuidCourseIds)
              .eq('org_id', orgId)
              .eq('status', 'published')
              .order('title', { ascending: true });

            if (orgError) {
              console.error('Error fetching assigned org courses:', orgError);
            } else {
              orgCourses = orgData || [];
            }
          }
        }

        console.log('useOrgCatalog - Found platform courses:', platformCourses.length);
        console.log('useOrgCatalog - Found org courses:', orgCourses.length);

        return {
          platform: mapPlatformCoursesToCards(platformCourses),
          org: mapOrgCoursesToCards(orgCourses, orgId)
        };
      } else {
        // For instructors/owners, fetch all courses (published + draft new courses)
        console.log('[useOrgCatalog] Fetching all platform courses with RPC...');
        const { data: platformCourses, error: platformError } = await supabase.rpc('get_published_courses');

        if (platformError) {
          console.error('Error fetching platform courses:', platformError);
          throw platformError;
        }

        // Fetch draft courses (coming soon)
        console.log('[useOrgCatalog] Fetching draft courses...');
        const { data: draftCourses, error: draftError } = await supabase
          .from('courses')
          .select('*')
          .eq('status', 'draft')
          .eq('course_visibility', 'global')
          .in('id', Array.from(NEW_COURSE_IDS))
          .order('title', { ascending: true });

        if (draftError) {
          console.error('Error fetching draft courses:', draftError);
        }

        const { data: orgCourses, error: orgError } = await supabase
          .from('org_courses')
          .select('*')
          .eq('org_id', orgId)
          .eq('status', 'published')
          .order('title', { ascending: true });

        if (orgError) {
          console.error('Error fetching org courses:', orgError);
          throw orgError;
        }

        console.log('useOrgCatalog - Platform courses:', platformCourses?.length || 0);
        console.log('useOrgCatalog - Draft courses:', draftCourses?.length || 0);
        console.log('useOrgCatalog - Org courses:', orgCourses?.length || 0);

        return {
          platform: mapPlatformCoursesToCards(platformCourses || []),
          draft: mapPlatformCoursesToCards(draftCourses || []),
          org: mapOrgCoursesToCards(orgCourses || [], orgId)
        };
      }
    },
    enabled: !!orgId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return {
    catalog: data,
    isLoading,
    error,
    refetch,
    platformCourses: data?.platform || [],
    draftCourses: data?.draft || [],
    orgCourses: data?.org || [],
  };
}