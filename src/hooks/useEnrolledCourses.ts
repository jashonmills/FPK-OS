
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
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log('Fetching enrolled courses for user:', user.id);

        // Join enrollments → courses
        const { data, error: fetchError } = await supabase
          .from('enrollments')
          .select(`
            id,
            user_id,
            course_id,
            enrolled_at,
            progress,
            courses!inner (
              id,
              title,
              description,
              featured,
              asset_path,
              created_at,
              updated_at
            )
          `)
          .eq('user_id', user.id)
          .order('courses.featured', { ascending: false }); // featured courses first

        if (fetchError) {
          console.error('Failed to fetch courses:', fetchError);
          setError('Failed to load courses');
          return;
        }

        console.log('Fetched enrollments:', data);

        // Extract courses from the enrollment data
        const enrolledCourses = (data as EnrollmentWithCourse[])?.map((enrollment) => enrollment.courses) || [];
        setCourses(enrolledCourses);

      } catch (err) {
        console.error('Error in fetchCourses:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [user?.id]);

  return { courses, loading, error, refetch: () => {
    if (user?.id) {
      setLoading(true);
      // Re-run the effect by updating a dependency
    }
  }};
}
