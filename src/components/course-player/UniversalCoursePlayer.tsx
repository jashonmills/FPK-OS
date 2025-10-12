/**
 * Universal Course Player
 * 
 * The main entry point for rendering any course in the system.
 * Fetches course data from the database and routes to the appropriate player
 * based on the course's framework_type.
 * 
 * This is the foundation of Project Phoenix - a single, unified course rendering system.
 */

import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useCourses } from '@/hooks/useCourses';
import { SequentialCoursePlayer } from './SequentialCoursePlayer';
import { SequentialCourseShell } from './SequentialCourseShell';
import { getCourseLessons, hasCourseComponents } from './courseComponentRegistry';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useContextAwareNavigation } from '@/hooks/useContextAwareNavigation';

export const UniversalCoursePlayer: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const { goToCourses } = useContextAwareNavigation();
  
  // Fetch course data from database
  const { courses, isLoading, error } = useCourses({ 
    featured: false, 
    status: 'published',
    limit: 1000 // Get all to find by slug
  });

  // Find the specific course by slug
  const courseData = React.useMemo(() => {
    if (!courses || !courseSlug) return null;
    return courses.find(c => c.slug === courseSlug);
  }, [courses, courseSlug]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="w-12 h-12 mx-auto text-destructive" />
            <h2 className="text-2xl font-bold">Error Loading Course</h2>
            <p className="text-muted-foreground">
              {error.message || 'An error occurred while loading the course.'}
            </p>
            <Button onClick={() => goToCourses()}>
              Back to Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Course not found
  if (!courseData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold">Course Not Found</h2>
            <p className="text-muted-foreground">
              The course "{courseSlug}" could not be found. It may have been removed or renamed.
            </p>
            <Button onClick={() => goToCourses()}>
              Back to Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if course has framework_type set
  if (!(courseData as any).framework_type) {
    console.warn(`Course ${courseSlug} is missing framework_type in database`);
    
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="w-12 h-12 mx-auto text-yellow-500" />
            <h2 className="text-2xl font-bold">Course Configuration Error</h2>
            <p className="text-muted-foreground">
              This course is not properly configured. The framework type is missing.
            </p>
            <p className="text-sm text-muted-foreground">
              Course ID: {courseSlug}
            </p>
            <Button onClick={() => goToCourses()}>
              Back to Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const contentComponent = (courseData as any).content_component || courseSlug;

  // Route to appropriate player based on framework_type
  switch ((courseData as any).framework_type) {
    case 'sequential': {
      const contentVersion = (courseData as any).content_version || 'v1';
      
      // v2 courses use the new SequentialCourseShell for 100% UI consistency
      if (contentVersion === 'v2') {
        return (
          <SequentialCourseShell
            courseData={{
              id: courseData.id,
              title: courseData.title,
              description: courseData.description || '',
              slug: courseSlug || '',
              background_image: courseData.thumbnail_url || undefined,
              estimated_hours: courseData.duration_minutes ? Math.ceil(courseData.duration_minutes / 60) : undefined,
              difficulty_level: (courseData as any).difficulty || 'Beginner',
              content_version: contentVersion
            }}
          />
        );
      }
      
      // v1 courses still use the old player (legacy support)
      const lessons = getCourseLessons(contentComponent);
      
      if (!lessons) {
        console.warn(`Course ${courseSlug} is marked as sequential but has no lesson components registered`);
        
        return (
          <div className="container mx-auto px-4 py-8">
            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <AlertCircle className="w-12 h-12 mx-auto text-yellow-500" />
                <h2 className="text-2xl font-bold">Course Not Migrated</h2>
                <p className="text-muted-foreground">
                  This course has not been migrated to the new course player system yet.
                </p>
                <p className="text-sm text-muted-foreground">
                  Course: {courseData.title} ({courseSlug})
                  <br />
                  Framework: {(courseData as any).framework_type}
                  <br />
                  Content Component: {contentComponent}
                </p>
                <Button onClick={() => goToCourses()}>
                  Back to Courses
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      }

      return (
        <SequentialCoursePlayer
          courseId={courseSlug}
          courseTitle={courseData.title}
          courseDescription={courseData.description || ''}
          lessons={lessons}
          backgroundImage={courseData.thumbnail_url || undefined}
          estimatedHours={courseData.duration_minutes ? Math.ceil(courseData.duration_minutes / 60) : 4}
          difficultyLevel={(courseData as any).difficulty || 'Beginner'}
          contentVersion={contentVersion}
          courseSlug={courseSlug}
        />
      );
    }

    case 'micro-learning': {
      // TODO: Implement MicroLearningCoursePlayer
      return (
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <AlertCircle className="w-12 h-12 mx-auto text-blue-500" />
              <h2 className="text-2xl font-bold">Micro-Learning Framework</h2>
              <p className="text-muted-foreground">
                The Micro-Learning player will be implemented in the next phase of Project Phoenix.
              </p>
              <p className="text-sm text-muted-foreground">
                Course: {courseData.title}
              </p>
              <Button onClick={() => goToCourses()}>
                Back to Courses
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    case 'single-embed': {
      // TODO: Implement SingleEmbedPlayer
      return (
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <AlertCircle className="w-12 h-12 mx-auto text-blue-500" />
              <h2 className="text-2xl font-bold">Single-Embed Framework</h2>
              <p className="text-muted-foreground">
                The Single-Embed player will be implemented in the next phase of Project Phoenix.
              </p>
              <p className="text-sm text-muted-foreground">
                Course: {courseData.title}
              </p>
              <Button onClick={() => goToCourses()}>
                Back to Courses
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    default: {
      return (
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <AlertCircle className="w-12 h-12 mx-auto text-destructive" />
              <h2 className="text-2xl font-bold">Unknown Framework Type</h2>
              <p className="text-muted-foreground">
                This course has an unknown framework type: {(courseData as any).framework_type}
              </p>
              <Button onClick={() => goToCourses()}>
                Back to Courses
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }
};
