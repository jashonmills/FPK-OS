import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, BookOpen, Clock, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { loadCourseContent } from '@/utils/courseContentLoader';
import { CourseContentRenderer } from '@/components/ai-coach/CourseContentRenderer';
import type { CourseContentManifest, LessonContentData } from '@/types/lessonContent';
import { cn } from '@/lib/utils';

interface CourseContentViewerProps {
  course: {
    id: string;
    slug: string;
    title: string;
    description?: string;
    thumbnail_url?: string;
  };
  onClose: () => void;
}

export const CourseContentViewer: React.FC<CourseContentViewerProps> = ({ course, onClose }) => {
  const [manifest, setManifest] = useState<CourseContentManifest | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const content = await loadCourseContent(course.slug);
        
        if (!content) {
          throw new Error('Failed to load course content');
        }
        
        setManifest(content);
      } catch (err) {
        console.error('Error loading course content:', err);
        setError(`Unable to load course content for "${course.slug}". This course may not have content available yet, or there may be a slug mismatch.`);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [course.slug]);

  const currentLesson = manifest?.lessons[currentLessonIndex];
  const totalLessons = manifest?.lessons.length || 0;

  const goToPrevLesson = () => {
    setCurrentLessonIndex(prev => Math.max(0, prev - 1));
  };

  const goToNextLesson = () => {
    setCurrentLessonIndex(prev => Math.min(totalLessons - 1, prev + 1));
  };

  if (isLoading) {
    return (
      <div className="h-full bg-background/95 backdrop-blur-sm rounded-lg border shadow-lg">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex-shrink-0 p-4 border-b bg-background">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">{course.title}</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Loading State */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground">Loading course content...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !manifest) {
    return (
      <div className="h-full bg-background/95 backdrop-blur-sm rounded-lg border shadow-lg">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex-shrink-0 p-4 border-b bg-background">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-destructive" />
                <h2 className="text-lg font-semibold">{course.title}</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Error State */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center space-y-4 max-w-md">
              <div className="text-destructive">⚠️</div>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-background rounded-lg border shadow-2xl overflow-hidden" style={{ maxHeight: '600px' }}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold truncate">{course.title}</h2>
              </div>
              {currentLesson && (
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    Lesson {currentLessonIndex + 1} of {totalLessons}
                  </span>
                  {currentLesson.estimatedMinutes && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {currentLesson.estimatedMinutes} min
                    </span>
                  )}
                </div>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1" style={{ height: '450px' }}>
          <div className="p-6 max-w-4xl mx-auto">
            {currentLesson && (
              <div className="space-y-6">
                {/* Lesson Header */}
                <div className="space-y-2">
                  {currentLesson.unit && (
                    <div 
                      className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: currentLesson.unitColor || '#e0e0e0',
                        color: '#fff'
                      }}
                    >
                      {currentLesson.unit}
                    </div>
                  )}
                  <h3 className="text-2xl font-bold">{currentLesson.title}</h3>
                  {currentLesson.description && (
                    <p className="text-muted-foreground">{currentLesson.description}</p>
                  )}
                </div>

                {/* Video Content */}
                {currentLesson.video && (
                  <div className="aspect-video rounded-lg overflow-hidden bg-black">
                    <video
                      controls
                      className="w-full h-full"
                      poster={currentLesson.video.thumbnail}
                    >
                      <source src={currentLesson.video.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                {/* Text Content */}
                {currentLesson.sections && currentLesson.sections.length > 0 && (
                  <div className="prose prose-sm max-w-none">
                    <CourseContentRenderer
                      sections={currentLesson.sections}
                      lessonTitle={currentLesson.title}
                      lessonDescription={currentLesson.description}
                    />
                  </div>
                )}

                {/* Resources */}
                {currentLesson.resources && currentLesson.resources.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Resources</h4>
                    <div className="space-y-2">
                      {currentLesson.resources.map((resource, idx) => (
                        <a
                          key={idx}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors"
                        >
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{resource.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer Navigation */}
        <div className="flex-shrink-0 p-4 border-t bg-muted/50">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentLessonIndex(0)}
                disabled={currentLessonIndex === 0}
              >
                <Home className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={goToPrevLesson}
                disabled={currentLessonIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground font-medium">
              {currentLessonIndex + 1} / {totalLessons}
            </div>
            
            <Button
              variant="outline"
              onClick={goToNextLesson}
              disabled={currentLessonIndex >= totalLessons - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
