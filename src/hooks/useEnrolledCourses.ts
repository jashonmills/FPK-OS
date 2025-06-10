
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Course {
  id: string;
  title: string;
  description: string | null;
  featured: boolean | null;
  asset_path: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface EnrollmentWithCourse {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string | null;
  progress: any;
  courses: Course;
}

export function useEnrolledCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchCourses() {
      if (!user?.id) {
        console.log('No user found, skipping course fetch');
        setLoading(false);
        setCourses([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log('Fetching enrolled courses for user:', user.id);

        // Join enrollments with courses - the RLS policies will automatically filter for the current user
        const { data, error: fetchError } = await supabase
          .from('enrollments')
          .select(`
            id,
            user_id,
            course_id,
            enrolled_at,
            progress,
            courses (
              id,
              title,
              description,
              featured,
              asset_path,
              created_at,
              updated_at
            )
          `)
          .eq('user_id', user.id);

        if (fetchError) {
          console.error('Failed to fetch courses:', fetchError);
          setError(`Failed to load courses: ${fetchError.message}`);
          return;
        }

        console.log('Raw enrollment data:', data);

        if (!data || data.length === 0) {
          console.log('No enrollments found for user - this may be normal for new users');
          setCourses([]);
          return;
        }

        // Extract courses from the enrollment data and ensure they have the correct structure
        const enrolledCourses = data
          .filter((enrollment: any) => enrollment.courses) // Filter out any enrollments without course data
          .map((enrollment: any) => enrollment.courses)
          .sort((a: Course, b: Course) => {
            // Sort featured courses first
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return 0;
          });

        console.log('Processed courses:', enrolledCourses);
        setCourses(enrolledCourses);

      } catch (err) {
        console.error('Error in fetchCourses:', err);
        setError('An unexpected error occurred while loading courses');
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [user?.id]);

  const refetch = async () => {
    if (user?.id) {
      setLoading(true);
      setError(null);
      // Re-trigger the effect by updating the dependency
      // The useEffect will handle the actual fetching
    }
  };

  return { courses, loading, error, refetch };
}
