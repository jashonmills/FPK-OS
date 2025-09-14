import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, ArrowRight } from 'lucide-react';
import LessonTTSControls from '@/components/course/LessonTTSControls';
import { getExtractedLessonContent, parseContentForDisplay, extractTitleFromContent } from '@/utils/algebraContentParser';

interface AlgebraLesson5Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
}

export const AlgebraLesson5: React.FC<AlgebraLesson5Props> = ({ onComplete, onNext, hasNext }) => {
  const [isCompleted, setIsCompleted] = useState(false);
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

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete();
  };

  const defaultContent = `
    <h2>Learning Objectives</h2>
    <p>By the end of this lesson, you will be able to:</p>
    <ul>
      <li>Identify what a system of equations is</li>
      <li>Solve systems using the substitution method</li>
      <li>Solve systems using the elimination method</li>
      <li>Interpret solutions graphically</li>
    </ul>

    <h2>What is a System of Equations?</h2>
    <p>A system of equations is a set of two or more equations with the same variables. We need to find values that satisfy all equations simultaneously.</p>
    
    <h3>Example System:</h3>
    <code>x + y = 7</code><br>
    <code>2x - y = 5</code>

    <h2>Method 1: Substitution</h2>
    <p>Solve one equation for one variable, then substitute into the other equation.</p>
    
    <h3>Step-by-step example:</h3>
    <p>From equation 1: y = 7 - x</p>
    <p>Substitute into equation 2: 2x - (7 - x) = 5</p>
    <p>Simplify: 2x - 7 + x = 5</p>
    <p>Combine: 3x - 7 = 5</p>
    <p>Solve: 3x = 12, so x = 4</p>
    <p>Find y: y = 7 - 4 = 3</p>
    <p><strong>Solution: (4, 3)</strong></p>

    <h2>Method 2: Elimination</h2>
    <p>Add or subtract equations to eliminate one variable.</p>
    
    <h3>Using the same example:</h3>
    <code>x + y = 7</code><br>
    <code>2x - y = 5</code>
    <p>Add the equations: (x + y) + (2x - y) = 7 + 5</p>
    <p>Simplify: 3x = 12</p>
    <p>Solve: x = 4</p>
    <p>Substitute back: 4 + y = 7, so y = 3</p>
    <p><strong>Solution: (4, 3)</strong></p>
  `;

  const displayContent = lessonContent || defaultContent;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* TTS Controls */}
      <LessonTTSControls
        lessonTitle={lessonTitle}
        lessonNumber={5}
        totalLessons={7}
        contentRef={lessonContentRef}
      />

      {/* Lesson Introduction */}
      <Card ref={lessonContentRef}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">{lessonTitle}</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Learn to solve systems of linear equations using substitution, elimination, and graphing methods.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div 
            className="prose prose-lg max-w-none space-y-4"
            dangerouslySetInnerHTML={{ __html: displayContent }}
          />
        </CardContent>
      </Card>

      {/* Lesson Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Lesson 5 of 7 • {lessonTitle}
        </div>
        <div className="flex gap-2">
          {!isCompleted && (
            <Button onClick={handleComplete} className="fpk-gradient text-white">
              Mark as Complete
            </Button>
          )}
          {isCompleted && hasNext && (
            <Button onClick={onNext} className="fpk-gradient text-white">
              Next Lesson <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};