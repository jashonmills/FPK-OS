import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Clock, User, Star, Play } from 'lucide-react';
import { getCourseImage } from '@/utils/courseImages';
import { useAuth } from '@/hooks/useAuth';
import { useContextAwareNavigation } from '@/hooks/useContextAwareNavigation';

interface Course {
  id: string;
  title: string;
  description?: string;
  instructor_name?: string;
  duration_minutes?: number;
  difficulty_level?: string;
  tags?: string[];
  thumbnail_url?: string;
  status?: string;
  visibility?: string;
  // Optional fields for different course types
  asset_path?: string;
  course_visibility?: string;
  created_at?: string;
  created_by?: string;
  discoverable?: boolean;
  featured?: boolean;
  is_free?: boolean;
  price?: number;
  published_at?: string;
  slug?: string;
  source?: string;
  updated_at?: string;
  organization_id?: string;
  org_id?: string;
}

export default function CoursePreview() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { goToCourses, goToCourse } = useContextAwareNavigation();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) {
      setError('Course ID not provided');
      setLoading(false);
      return;
    }

    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      // Try to load from courses table first
      let { data: course, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .eq('status', 'published') // Only show published courses in preview
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!course) {
        // Try native_courses table
        const { data: nativeCourse, error: nativeError } = await supabase
          .from('native_courses')
          .select('*')
          .eq('id', courseId)
          .eq('visibility', 'published')
          .single();

        if (nativeError && nativeError.code !== 'PGRST116') {
          throw nativeError;
        }

        if (nativeCourse) {
          // Map native_courses fields to Course interface safely with type casting
          const courseData = nativeCourse as any;
          course = {
            id: courseData.id,
            title: courseData.title,
            description: courseData.description || courseData.title || '',
            instructor_name: courseData.instructor_name || undefined,
            duration_minutes: courseData.est_minutes || undefined,
            difficulty_level: courseData.difficulty || courseData.difficulty_level || 'beginner',
            tags: courseData.tags || [],
            thumbnail_url: courseData.thumbnail_url || courseData.cover_url || '',
            status: 'published',
            asset_path: courseData.asset_path || '',
            course_visibility: courseData.visibility || courseData.course_visibility || 'published',
            created_at: courseData.created_at,
            created_by: courseData.created_by,
            discoverable: courseData.discoverable || true,
            level: courseData.level || undefined,
            price: courseData.price || 0,
            slug: courseData.slug || courseId,
            source: 'native',
            updated_at: courseData.updated_at,
            updated_by: courseData.updated_by || null,
            vendor_id: courseData.vendor_id || null,
            featured: courseData.featured || false,
            org_id: courseData.org_id || null,
            organization_id: courseData.organization_id || undefined,
            is_free: courseData.is_free !== undefined ? courseData.is_free : true,
            published_at: courseData.published_at || courseData.updated_at,
            // Add missing fields from migration
            content_component: courseData.content_component || courseId,
            framework_type: courseData.framework_type || 'sequential',
          } as any;
        }
      }

      if (!course) {
        setError('Course not found or not published');
      } else {
        setCourse(course);
      }
    } catch (err) {
      console.error('Error loading course:', err);
      setError('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading course preview...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Course Not Available</h1>
          <p className="text-muted-foreground mb-6">
            {error || 'This course is not available for preview.'}
          </p>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const courseImage = getCourseImage(course.id, course.title);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={goToCourses}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
            <Badge variant="secondary">Course Preview</Badge>
          </div>
        </div>
      </div>

      {/* Course Hero */}
      <div className="relative">
        <div 
          className="h-64 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${courseImage})` }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="container mx-auto px-4 h-full relative z-10 flex items-end">
            <div className="text-white pb-8">
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <div className="flex items-center space-x-4 text-sm">
                {course.instructor_name && (
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{course.instructor_name}</span>
                  </div>
                )}
                {course.duration_minutes && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration_minutes} minutes</span>
                  </div>
                )}
                {course.difficulty_level && (
                  <Badge variant="secondary" className="capitalize">
                    {course.difficulty_level}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">About This Course</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              {course.description ? (
                <p className="text-muted-foreground leading-relaxed">
                  {course.description}
                </p>
              ) : (
                <p className="text-muted-foreground italic">
                  No description available for this course.
                </p>
              )}

              {course.tags && course.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-6">
                <div className="bg-muted/50 rounded-lg p-6 text-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Ready to Start Learning?</h3>
                  {user ? (
                    <>
                      <p className="text-muted-foreground mb-4">
                        You're ready to start this course! Click below to begin your learning journey.
                      </p>
                      <div className="flex justify-center">
                        <Button onClick={() => goToCourse(courseId!)}>
                          <Play className="w-4 h-4 mr-2" />
                          Start Course
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-muted-foreground mb-4">
                        This is a preview of the course. To access the full content and track your progress, 
                        you'll need to sign in.
                      </p>
                      <div className="flex justify-center">
                        <Button onClick={() => navigate('/login')}>
                          Sign In to Start
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}