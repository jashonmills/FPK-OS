import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import { parseCourseJSON } from '@/lib/courseJSONParser';
import { CourseContentRenderer } from '@/components/ai-coach/CourseContentRenderer';
import { CourseContentManifest } from '@/types/lessonContent';

interface JSONViewerProps {
  fileUrl: string;
}

export const JSONViewer: React.FC<JSONViewerProps> = ({ fileUrl }) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [isV2Manifest, setIsV2Manifest] = useState(false);
  const [courseData, setCourseData] = useState<CourseContentManifest | null>(null);
  
  useEffect(() => {
    const loadJSON = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(fileUrl);
        const rawText = await response.text();
        
        console.log('[JSONViewer] Raw content preview:', rawText.substring(0, 200));
        
        // Try to parse as JSON first
        try {
          const jsonData = JSON.parse(rawText);
          
          // Check if it's a v2 course manifest (format 1: flat lessons)
          if (jsonData.courseId && jsonData.contentVersion === 'v2' && jsonData.lessons) {
            console.log('[JSONViewer] Detected v2 course manifest (format 1)');
            setCourseData(jsonData);
            setIsV2Manifest(true);
            setTitle(jsonData.title || 'Course Content');
            return;
          }
          
          // Check if it's a v2 course manifest (format 2: units with nested lessons)
          if (jsonData.courseTitle && jsonData.courseSlug && jsonData.units) {
            console.log('[JSONViewer] Detected v2 course manifest (format 2: units)');
            // Transform the structure to match our CourseContentRenderer expectations
            const transformedData: CourseContentManifest = {
              courseId: jsonData.courseSlug,
              courseSlug: jsonData.courseSlug,
              title: jsonData.courseTitle,
              description: jsonData.description || '',
              contentVersion: 'v2',
              lessons: jsonData.units.flatMap((unit: any) => 
                (unit.lessons || []).map((lesson: any) => ({
                  id: lesson.lessonSlug || lesson.lessonTitle,
                  title: lesson.lessonTitle || lesson.title || 'Untitled Lesson',
                  description: lesson.description || '',
                  estimatedMinutes: lesson.duration || lesson.estimatedMinutes,
                  contentType: 'text' as const,
                  sections: lesson.sections || lesson.contentSections || []
                }))
              )
            };
            setCourseData(transformedData);
            setIsV2Manifest(true);
            setTitle(jsonData.courseTitle);
            return;
          }
        } catch (parseError) {
          console.log('[JSONViewer] Not valid JSON, falling back to text parser');
        }
        
        // Fallback to markdown formatting for other formats
        const parsed = parseCourseJSON(rawText);
        setContent(parsed.formatted);
        if (parsed.title) {
          setTitle(parsed.title);
        }
      } catch (err) {
        console.error('Error loading JSON:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadJSON();
  }, [fileUrl]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
          <p className="text-sm text-gray-500">Parsing JSON content...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-center">
        <div>
          <p className="text-red-600 font-semibold mb-2">Error Loading JSON</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }
  
  // Render v2 manifest with CourseContentRenderer
  if (isV2Manifest && courseData) {
    return (
      <ScrollArea className="h-full">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="mb-6 pb-4 border-b">
            <h1 className="text-3xl font-bold text-foreground">{courseData.title}</h1>
            <p className="text-muted-foreground mt-2">{courseData.description}</p>
            <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
              <span>Course ID: {courseData.courseId}</span>
              <span>•</span>
              <span>{courseData.lessons.length} Lessons</span>
            </div>
          </div>
          
          {courseData.lessons.map((lesson, index) => (
            <div key={lesson.id} className="mb-8">
              <div className="bg-muted/30 px-4 py-2 rounded-t mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Lesson {lesson.id}: {lesson.title}
                </h2>
                {lesson.estimatedMinutes && (
                  <p className="text-sm text-muted-foreground mt-1">
                    ⏱️ Estimated time: {lesson.estimatedMinutes} minutes
                  </p>
                )}
              </div>
              
              <CourseContentRenderer 
                sections={lesson.sections || []}
                lessonDescription={lesson.description}
              />
              
              {index < courseData.lessons.length - 1 && (
                <div className="border-t mt-8" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  }
  
  // Fallback to markdown rendering for other formats
  return (
    <ScrollArea className="h-full">
      <div className="p-6 max-w-4xl mx-auto">
        {title && (
          <div className="mb-6 pb-4 border-b">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground mt-1">Structured Course Content</p>
          </div>
        )}
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </ScrollArea>
  );
};
