import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PlatformCourse {
  id: string;
  title: string;
  description?: string;
  difficulty_level?: string;
  course_visibility: string;
  thumbnail_url?: string;
  background_image?: string;
  duration_minutes?: number;
  instructor_name?: string;
  featured?: boolean;
  tags?: string[];
  slug?: string;
  framework_type?: string;
  content_version?: string;
  
  // NEW FIELDS for hierarchical display
  grade_level_id?: number;
  subject?: string;
  sequence_order?: number;
  grade_level?: {
    id: number;
    us_name: string;
    irish_name: string;
    stage: string;
    display_order: number;
  };
}

export function usePlatformCourses() {
  // Duplicate course IDs to exclude (moved to review-later)
  const excludedDuplicateIds = [
    'chemistry-central-science', // chemistry (wrong slug, micro-learning duplicate)
    'german-101', // german (wrong slug duplicate - correct is german-for-beginners-101)
    '71ea4884-098b-4854-bfa1-1715689bbb25', // introduction-to-data-science (duplicate)
    '2def03d8-35bc-48d2-995c-5a774219177f', // public-speaking-and-debate (duplicate)
    'e397be7a-1e74-48a7-a3d4-69c8e52568f6', // personal-finance-and-investing (duplicate)
  ];

  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ['platform-courses-v5'], // NEW VERSION
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          grade_level:grade_levels(id, us_name, irish_name, stage, display_order)
        `)
        .eq('course_visibility', 'global')
        .eq('status', 'published')
        .not('id', 'in', `(${excludedDuplicateIds.join(',')})`)
        // NEW SORTING: Stage → Grade → Subject → Sequence
        .order('grade_level_id', { ascending: true, nullsFirst: false })
        .order('subject', { ascending: true, nullsFirst: false })
        .order('sequence_order', { ascending: true });

      if (error) {
        console.error('Error fetching platform courses:', error);
        throw error;
      }

      return data as PlatformCourse[];
    },
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: 'always', // Force refetch on mount
  });

  return {
    courses,
    isLoading,
    error,
  };
}

// NEW HELPER: Group courses by hierarchy
export interface CourseHierarchy {
  stage: string;
  gradeLevels: {
    id: number;
    heading: string;
    subjects: {
      name: string;
      courses: PlatformCourse[];
    }[];
  }[];
}

export function groupCoursesByHierarchy(courses: PlatformCourse[]): CourseHierarchy[] {
  const stages = new Map<string, Map<number, Map<string, PlatformCourse[]>>>();
  
  // Separate courses with grade levels from "Life Skills Collection"
  const gradedCourses = courses.filter(c => c.grade_level_id != null);
  
  // Group graded courses
  gradedCourses.forEach(course => {
    const stage = course.grade_level?.stage || 'Other';
    const gradeId = course.grade_level_id!;
    const subject = course.subject || 'Other';
    
    if (!stages.has(stage)) stages.set(stage, new Map());
    if (!stages.get(stage)!.has(gradeId)) stages.get(stage)!.set(gradeId, new Map());
    if (!stages.get(stage)!.get(gradeId)!.has(subject)) {
      stages.get(stage)!.get(gradeId)!.set(subject, []);
    }
    
    stages.get(stage)!.get(gradeId)!.get(subject)!.push(course);
  });
  
  // Convert to hierarchy structure
  const hierarchy: CourseHierarchy[] = [];
  const stageOrder = ['Senior Cycle', 'Junior Cycle', 'Primary School'];
  
  stageOrder.forEach(stageName => {
    if (!stages.has(stageName)) return;
    
    const gradeLevels = Array.from(stages.get(stageName)!.entries())
      .sort(([a], [b]) => b - a) // Descending grade order
      .map(([gradeId, subjectMap]) => {
        const firstCourse = Array.from(subjectMap.values())[0][0];
        const gradeLevel = firstCourse.grade_level!;
        
        const subjects = Array.from(subjectMap.entries())
          .map(([subjectName, coursesInSubject]) => ({
            name: subjectName,
            courses: coursesInSubject.sort((a, b) => 
              (a.sequence_order || 999) - (b.sequence_order || 999)
            ),
          }))
          .sort((a, b) => {
            // Subject order: Math, ELA, Science, Social Studies, then alphabetical
            const priority = ['Math', 'ELA', 'Science', 'Social Studies'];
            const aIdx = priority.indexOf(a.name);
            const bIdx = priority.indexOf(b.name);
            if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
            if (aIdx !== -1) return -1;
            if (bIdx !== -1) return 1;
            return a.name.localeCompare(b.name);
          });
        
        return {
          id: gradeId,
          heading: `${gradeLevel.irish_name} (${gradeLevel.us_name})`,
          subjects,
        };
      });
    
    hierarchy.push({
      stage: stageName,
      gradeLevels,
    });
  });
  
  return hierarchy;
}