import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight } from 'lucide-react';
import LessonTTSControls from '@/components/course/LessonTTSControls';
import { getExtractedLessonContent, parseContentForDisplay, extractTitleFromContent } from '@/utils/algebraContentParser';

interface AlgebraLesson6Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
}

export const AlgebraLesson6: React.FC<AlgebraLesson6Props> = ({ onComplete, onNext, hasNext }) => {
  const [isCompleted, setIsCompleted] = useState(false);
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

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete();
  };

  const defaultContent = `
    <h2>Learning Objectives</h2>
    <p>By the end of this lesson, you will be able to:</p>
    <ul>
      <li>Identify quadratic equations and their standard form</li>
      <li>Solve quadratic equations by factoring</li>
      <li>Use the quadratic formula</li>
      <li>Understand the concept of discriminant</li>
    </ul>

    <h2>What is a Quadratic Equation?</h2>
    <p>A quadratic equation is an equation of the form ax² + bx + c = 0, where a ≠ 0.</p>
    <p>Examples:</p>
    <ul>
      <li>x² - 5x + 6 = 0</li>
      <li>2x² + 3x - 2 = 0</li>
      <li>x² - 9 = 0</li>
    </ul>

    <h2>Method 1: Factoring</h2>
    <p>When possible, factor the quadratic and use the zero product property.</p>
    
    <h3>Example: x² - 5x + 6 = 0</h3>
    <p>Factor: (x - 2)(x - 3) = 0</p>
    <p>Solutions: x = 2 or x = 3</p>

    <h2>Method 2: Quadratic Formula</h2>
    <p>For any quadratic equation ax² + bx + c = 0:</p>
    <code>x = (-b ± √(b² - 4ac)) / (2a)</code>
    
    <h3>Example: 2x² + 3x - 2 = 0</h3>
    <p>Here: a = 2, b = 3, c = -2</p>
    <p>x = (-3 ± √(9 - 4(2)(-2))) / (2(2))</p>
    <p>x = (-3 ± √(9 + 16)) / 4</p>
    <p>x = (-3 ± √25) / 4</p>
    <p>x = (-3 ± 5) / 4</p>
    <p>Solutions: x = 1/2 or x = -2</p>

    <h2>The Discriminant</h2>
    <p>The discriminant b² - 4ac tells us about the nature of solutions:</p>
    <ul>
      <li>If b² - 4ac > 0: Two real solutions</li>
      <li>If b² - 4ac = 0: One real solution</li>
      <li>If b² - 4ac < 0: No real solutions</li>
    </ul>
  `;

  const displayContent = lessonContent || defaultContent;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* TTS Controls */}
      <LessonTTSControls
        lessonTitle={lessonTitle}
        lessonNumber={6}
        totalLessons={7}
        contentRef={lessonContentRef}
      />

      {/* Lesson Introduction */}
      <Card ref={lessonContentRef}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">{lessonTitle}</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Introduction to quadratic equations, their properties, and methods for solving them.
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
          Lesson 6 of 7 • {lessonTitle}
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