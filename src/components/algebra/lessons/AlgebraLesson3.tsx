import React, { useRef, useEffect, useState } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';
import { getExtractedLessonContent, parseContentForDisplay, extractTitleFromContent } from '@/utils/algebraContentParser';

interface AlgebraLesson3Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
  trackInteraction?: (event: string, details: any) => void;
}

export const AlgebraLesson3: React.FC<AlgebraLesson3Props> = ({ 
  onComplete, 
  onNext, 
  hasNext,
  trackInteraction 
}) => {
  const lessonContentRef = useRef<HTMLDivElement>(null);
  const [lessonContent, setLessonContent] = useState<string>('');
  const [lessonTitle, setLessonTitle] = useState<string>('Solving Simple Equations');

  useEffect(() => {
    const extractedLesson = getExtractedLessonContent(3);
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
            Learn basic techniques for solving algebraic equations.
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
              <h3 className="text-xl font-semibold text-primary">What is an Equation?</h3>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-foreground leading-relaxed">
                  An <strong>equation</strong> is a mathematical statement that shows two expressions are equal, 
                  separated by an equals sign (=). Unlike expressions, equations can be solved to find specific values.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-primary">Basic Equation Solving</h3>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                  <h4 className="font-medium mb-3">The Golden Rule</h4>
                  <p className="mb-4">
                    Whatever you do to one side of an equation, you must do to the other side to keep it balanced.
                  </p>
                  
                  <div className="bg-white/60 p-4 rounded-lg">
                    <h5 className="font-medium text-sm mb-2">Example: Solve x + 5 = 12</h5>
                    <div className="space-y-1 text-sm">
                      <p>x + 5 = 12</p>
                      <p>x + 5 - 5 = 12 - 5  (subtract 5 from both sides)</p>
                      <p>x = 7</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};