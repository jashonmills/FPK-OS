import React, { useRef, useEffect, useState } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';
import { getExtractedLessonContent, parseContentForDisplay, extractTitleFromContent } from '@/utils/algebraContentParser';

interface AlgebraLesson5Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
  trackInteraction?: (event: string, details: any) => void;
}

export const AlgebraLesson5: React.FC<AlgebraLesson5Props> = ({ 
  onComplete, 
  onNext, 
  hasNext,
  trackInteraction 
}) => {
  const lessonContentRef = useRef<HTMLDivElement>(null);
  const [lessonContent, setLessonContent] = useState<string>('');
  const [lessonTitle, setLessonTitle] = useState<string>('Systems of Equations');

  useEffect(() => {
    const extractedLesson = getExtractedLessonContent(5);
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
            <Calculator className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">{lessonTitle}</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Solve systems of linear equations using various methods.
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
              <h3 className="text-xl font-semibold text-primary">Systems of Equations</h3>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-foreground leading-relaxed">
                  A <strong>system of equations</strong> is a collection of two or more equations with the same variables. 
                  We solve them to find values that satisfy all equations simultaneously.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-primary">Substitution Method</h3>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                  <h4 className="font-medium mb-3">Step-by-Step Process</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Solve one equation for one variable</li>
                    <li>Substitute this expression into the other equation</li>
                    <li>Solve for the remaining variable</li>
                    <li>Substitute back to find the first variable</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};