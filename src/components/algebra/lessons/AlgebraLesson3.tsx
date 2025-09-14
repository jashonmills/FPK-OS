import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, ArrowRight } from 'lucide-react';
import LessonTTSControls from '@/components/course/LessonTTSControls';
import { getExtractedLessonContent, parseContentForDisplay, extractTitleFromContent } from '@/utils/algebraContentParser';

interface AlgebraLesson3Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
}

export const AlgebraLesson3: React.FC<AlgebraLesson3Props> = ({ onComplete, onNext, hasNext }) => {
  const [isCompleted, setIsCompleted] = useState(false);
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

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete();
  };

  const defaultContent = `
    <h2>Learning Objectives</h2>
    <p>By the end of this lesson, you will be able to:</p>
    <ul>
      <li>Solve one-step equations using addition, subtraction, multiplication, and division</li>
      <li>Apply the balance method to maintain equation equality</li>
      <li>Check solutions by substitution</li>
      <li>Solve real-world problems using simple equations</li>
    </ul>

    <h2>The Balance Method</h2>
    <p>Think of an equation like a balance scale. Whatever you do to one side, you must do to the other side to keep it balanced.</p>
    
    <h3>Example 1: Addition and Subtraction</h3>
    <p>Solve: x + 5 = 12</p>
    <p>To isolate x, subtract 5 from both sides:</p>
    <code>x + 5 - 5 = 12 - 5</code><br>
    <code>x = 7</code>
    
    <p><strong>Check:</strong> 7 + 5 = 12 ✓</p>

    <h3>Example 2: Multiplication and Division</h3>
    <p>Solve: 3x = 15</p>
    <p>To isolate x, divide both sides by 3:</p>
    <code>3x ÷ 3 = 15 ÷ 3</code><br>
    <code>x = 5</code>
    
    <p><strong>Check:</strong> 3(5) = 15 ✓</p>

    <h2>Practice Problems</h2>
    <p>Try solving these on your own:</p>
    <ol>
      <li>x - 8 = 15</li>
      <li>4y = 28</li>
      <li>z + 12 = 30</li>
      <li>w ÷ 6 = 4</li>
    </ol>
  `;

  const displayContent = lessonContent || defaultContent;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* TTS Controls */}
      <LessonTTSControls
        lessonTitle={lessonTitle}
        lessonNumber={3}
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
            Learn the fundamental techniques for solving algebraic equations step by step.
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
          Lesson 3 of 7 • {lessonTitle}
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