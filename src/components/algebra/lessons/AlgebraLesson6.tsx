import React, { useRef, useEffect, useState } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { getExtractedLessonContent, parseContentForDisplay, extractTitleFromContent } from '@/utils/algebraContentParser';

interface AlgebraLesson6Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
  trackInteraction?: (event: string, details: any) => void;
}

export const AlgebraLesson6: React.FC<AlgebraLesson6Props> = ({ 
  onComplete, 
  onNext, 
  hasNext,
  trackInteraction 
}) => {
  const lessonContentRef = useRef<HTMLDivElement>(null);
  const [lessonContent, setLessonContent] = useState<string>('');
  const [lessonTitle, setLessonTitle] = useState<string>('Quadratic Equations');

  useEffect(() => {
    const extractedLesson = getExtractedLessonContent(6);
    if (extractedLesson) {
      const parsedContent = parseContentForDisplay(extractedLesson.content);
      setLessonContent(parsedContent);
      
      const title = extractTitleFromContent(extractedLesson.content);
      if (title) {
        setLessonTitle(title);
      }
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card ref={lessonContentRef}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">{lessonTitle}</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Introduction to quadratic equations and their solutions.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {lessonContent ? (
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(lessonContent) }}
            />
          ) : (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary">Quadratic Equations</h3>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-foreground leading-relaxed">
                  A <strong>quadratic equation</strong> is an equation of the form ax² + bx + c = 0, 
                  where a ≠ 0. These equations can have 0, 1, or 2 real solutions.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-primary">Standard Form</h3>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                  <h4 className="font-medium mb-3 text-lg font-mono">ax² + bx + c = 0</h4>
                  <ul className="space-y-2 text-sm">
                    <li><strong>a</strong> = coefficient of x² (quadratic term)</li>
                    <li><strong>b</strong> = coefficient of x (linear term)</li>
                    <li><strong>c</strong> = constant term</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};