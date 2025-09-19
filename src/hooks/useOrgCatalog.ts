import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { assertOrg } from '@/lib/org/context';
import type { CourseCard, OrgCatalogResponse, CourseCardBadge } from '@/types/course-card';

interface PlatformCourse {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  instructor_name?: string;
  duration_minutes?: number;
  difficulty_level?: string;
  tags?: string[];
  status: string;
  source?: string;
  discoverable?: boolean;
}

interface OrgCourse {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
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
      instructor_name: course.instructor_name,
      duration_minutes: course.duration_minutes,
      difficulty_level: course.difficulty_level,
      tags: course.tags || [],
      source: (course.source as any) || 'platform',
      status: course.status as any,
      discoverable: course.discoverable || false,
      source_table: 'courses',
      badges,
      route: `/course/${course.id}`
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

      // Fetch platform courses (global, published)
      const { data: platformCourses, error: platformError } = await supabase
        .from('courses')
        .select('*')
        .eq('course_visibility', 'global')
        .eq('status', 'published')
        .order('title', { ascending: true });

      if (platformError) {
        console.error('Error fetching platform courses:', platformError);
        throw platformError;
      }

      // Fetch org courses (for this org, published)
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
      console.log('useOrgCatalog - Org courses:', orgCourses?.length || 0);

      return {
        platform: mapPlatformCoursesToCards(platformCourses || []),
        org: mapOrgCoursesToCards(orgCourses || [], orgId)
      };
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
    orgCourses: data?.org || [],
  };
}