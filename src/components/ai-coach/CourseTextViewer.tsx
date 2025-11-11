import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useState } from 'react';
import { loadCourseContent } from '@/utils/courseContentLoader';
import { extractCourseManifestText } from '@/utils/courseTextExtractor';
import { Skeleton } from '@/components/ui/skeleton';

interface CourseTextViewerProps {
  course: {
    id: string;
    slug?: string;
    title: string;
    type: string;
  };
  onClose: () => void;
}

export const CourseTextViewer = ({ course, onClose }: CourseTextViewerProps) => {
  const [courseText, setCourseText] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourseText = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const slug = course.slug || course.id;
        const manifest = await loadCourseContent(slug);
        
        if (!manifest) {
          throw new Error('Failed to load course content');
        }
        
        const extractedText = extractCourseManifestText(manifest);
        setCourseText(extractedText);
      } catch (err) {
        console.error('Error loading course text:', err);
        setError('Failed to load course content');
      } finally {
        setLoading(false);
      }
    };

    loadCourseText();
  }, [course.id, course.slug]);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold truncate flex-1">{course.title}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="ml-2 shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-8 w-2/3 mt-6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-destructive mb-2">Error loading course</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && courseText && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-foreground bg-transparent border-0 p-0">
                {courseText}
              </pre>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
