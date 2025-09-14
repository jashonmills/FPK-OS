import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook to bridge old enrollment system with new interactive course analytics
 * This ensures backward compatibility and data migration
 */
export const useInteractiveCourseEnrollmentBridge = () => {
  const { user } = useAuth();

  const migrateEnrollmentData = async () => {
    if (!user) return;

    try {
      // Get existing enrollments for interactive courses
      const { data: existingEnrollments } = await supabase
        .from('enrollments')
        .select('course_id, enrolled_at, progress')
        .eq('user_id', user.id)
        .in('course_id', ['economics-101', 'algebra-basics', 'trigonometry-fundamentals', 'linear-equations']);

      if (!existingEnrollments?.length) return;

      // Check which ones don't exist in the new system
      const { data: interactiveEnrollments } = await supabase
        .from('interactive_course_enrollments')
        .select('course_id')
        .eq('user_id', user.id);

      const existingInteractiveCourseIds = new Set(
        interactiveEnrollments?.map(e => e.course_id) || []
      );

      // Migrate missing enrollments
      const enrollmentsToMigrate = existingEnrollments.filter(
        enrollment => !existingInteractiveCourseIds.has(enrollment.course_id)
      );

      if (enrollmentsToMigrate.length > 0) {
        const migratedEnrollments = enrollmentsToMigrate.map(enrollment => {
          const progress = enrollment.progress as any;
          const completionPercentage = progress?.completion_percentage || 0;
          return {
            user_id: user.id,
            course_id: enrollment.course_id,
            course_title: getCourseTitle(enrollment.course_id),
            enrolled_at: enrollment.enrolled_at,
            last_accessed_at: new Date().toISOString(),
            completion_percentage: completionPercentage,
            completed_at: completionPercentage >= 100 ? new Date().toISOString() : null,
            total_time_spent_minutes: 0 // Will be updated as user progresses
          };
        });

        const { error } = await supabase
          .from('interactive_course_enrollments')
          .insert(migratedEnrollments);

        if (error) {
          console.error('Error migrating enrollment data:', error);
        } else {
          console.log('Successfully migrated enrollment data for', migratedEnrollments.length, 'courses');
        }
      }
    } catch (error) {
      console.error('Error in enrollment bridge:', error);
    }
  };

  const getCourseTitle = (courseId: string): string => {
    const titles: Record<string, string> = {
      'economics-101': 'Introduction to Modern Economics',
      'algebra-basics': 'Algebra Fundamentals',
      'trigonometry-fundamentals': 'Trigonometry Fundamentals',
      'linear-equations': 'Linear Equations Mastery'
    };
    return titles[courseId] || courseId;
  };

  useEffect(() => {
    if (user) {
      migrateEnrollmentData();
    }
  }, [user]);

  return { migrateEnrollmentData };
};