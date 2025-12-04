/**
 * Single Content Embed Shell
 * 
 * For courses that consist of a single embedded media content (video/audio).
 * Provides a clean, focused viewing experience with analytics tracking.
 */

import React, { useEffect } from 'react';
import { useContextAwareNavigation } from '@/hooks/useContextAwareNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import CourseHeader from '@/components/course/CourseHeader';

interface SingleContentEmbedShellProps {
  courseData: {
    id: string;
    title: string;
    description: string;
    slug: string;
    background_image?: string;
    estimated_hours?: number;
    difficulty_level?: string;
  };
}

export const SingleContentEmbedShell: React.FC<SingleContentEmbedShellProps> = ({ courseData }) => {
  const { goToCourses } = useContextAwareNavigation();
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Load video URL from manifest
  useEffect(() => {
    const loadContent = async () => {
      try {
        const manifest = await import(`@/content/courses/${courseData.slug}/manifest.json`);
        const content = manifest.default || manifest;
        
        if (content.lessons && content.lessons.length > 0) {
          const lesson = content.lessons[0];
          setVideoUrl(lesson.videoUrl || lesson.video?.url);
        }
      } catch (error) {
        console.error('[SingleContentEmbedShell] Error loading manifest:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [courseData.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading content...</p>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: courseData.background_image ? `url(${courseData.background_image})` : undefined,
        backgroundColor: !courseData.background_image ? 'hsl(var(--background))' : undefined
      }}
    >
      <div className="min-h-screen bg-gradient-to-b from-background/95 via-background/90 to-background/95 backdrop-blur-sm">
        <CourseHeader 
          courseTitle={courseData.title}
        />
        
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <Button
            variant="ghost"
            onClick={goToCourses}
            className="mb-6"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>

          <Card>
            <CardContent className="p-0">
              {videoUrl ? (
                <div className="aspect-video w-full">
                  <iframe
                    src={videoUrl}
                    className="w-full h-full rounded-lg"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={courseData.title}
                  />
                </div>
              ) : (
                <div className="aspect-video w-full flex items-center justify-center bg-muted">
                  <p className="text-muted-foreground">Video content not available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {courseData.description && (
            <Card className="mt-6">
              <CardContent className="p-6">
                <p className="text-muted-foreground">{courseData.description}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
