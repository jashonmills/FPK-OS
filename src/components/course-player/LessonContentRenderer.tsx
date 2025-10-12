/**
 * Lesson Content Renderer
 * 
 * Core rendering engine for v2 (data-driven) lessons.
 * Orchestrates StandardVideoPlayer and StandardTextRenderer.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LessonContentData } from '@/types/lessonContent';
import { StandardVideoPlayer } from './StandardVideoPlayer';
import { StandardTextRenderer } from './StandardTextRenderer';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { LessonProps } from '@/types/course';

interface LessonContentRendererProps extends LessonProps {
  courseId: string;
  lessonData: LessonContentData;
}

export const LessonContentRenderer: React.FC<LessonContentRendererProps> = ({
  courseId,
  lessonData,
  onComplete,
  onNext,
  hasNext,
  lessonId,
  lessonTitle,
  totalLessons
}) => {
  const renderContent = () => {
    switch (lessonData.contentType) {
      case 'video':
        return lessonData.video ? (
          <StandardVideoPlayer 
            video={lessonData.video} 
            courseId={courseId}
            lessonId={lessonData.id}
          />
        ) : null;

      case 'text':
        return lessonData.sections ? (
          <StandardTextRenderer sections={lessonData.sections} showCard={true} />
        ) : null;

      case 'video+text':
        return (
          <>
            {lessonData.video && (
              <StandardVideoPlayer 
                video={lessonData.video} 
                courseId={courseId}
                lessonId={lessonData.id}
              />
            )}
            {lessonData.sections && lessonData.sections.length > 0 && (
              <StandardTextRenderer sections={lessonData.sections} showCard={true} />
            )}
          </>
        );

      case 'interactive':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Interactive Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Interactive lessons coming soon...
              </p>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card>
            <CardContent className="p-8">
              <p className="text-muted-foreground">Content type not supported.</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <InteractiveLessonWrapper
      courseId={courseId}
      lessonTitle={lessonTitle || lessonData.title}
      lessonId={lessonId || lessonData.id}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
      totalLessons={totalLessons}
    >
      <div className="space-y-6">
        {renderContent()}
      </div>
    </InteractiveLessonWrapper>
  );
};
