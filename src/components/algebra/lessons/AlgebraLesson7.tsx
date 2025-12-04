import React, { useRef, useEffect, useState } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { getExtractedLessonContent, parseContentForDisplay, extractTitleFromContent } from '@/utils/algebraContentParser';

interface AlgebraLesson7Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
  trackInteraction?: (event: string, details: Record<string, unknown>) => void;
}

export const AlgebraLesson7: React.FC<AlgebraLesson7Props> = ({ 
  onComplete, 
  onNext, 
  hasNext,
  trackInteraction 
}) => {
  const lessonContentRef = useRef<HTMLDivElement>(null);
  const [lessonContent, setLessonContent] = useState<string>('');
  const [lessonTitle, setLessonTitle] = useState<string>('Advanced Applications');

  useEffect(() => {
    const extractedLesson = getExtractedLessonContent(7);
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
            <Trophy className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">{lessonTitle}</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Apply algebraic concepts to real-world problems.
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
              <h3 className="text-xl font-semibold text-primary">Real-World Applications</h3>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-foreground leading-relaxed">
                  Congratulations on completing the algebra course! You've mastered the fundamental concepts 
                  and techniques needed to solve a wide variety of mathematical problems.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-primary">Skills Mastered</h3>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                  <ul className="grid md:grid-cols-2 gap-2 text-sm">
                    <li>✓ Working with variables and expressions</li>
                    <li>✓ Combining like terms</li>
                    <li>✓ Solving linear equations</li>
                    <li>✓ Graphing linear relationships</li>
                    <li>✓ Systems of equations</li>
                    <li>✓ Quadratic equations</li>
                    <li>✓ Real-world problem solving</li>
                    <li>✓ Mathematical reasoning</li>
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