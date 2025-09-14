import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, ArrowRight } from 'lucide-react';
import LessonTTSControls from '@/components/course/LessonTTSControls';
import { getExtractedLessonContent, parseContentForDisplay, extractTitleFromContent } from '@/utils/algebraContentParser';

interface AlgebraLesson7Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
}

export const AlgebraLesson7: React.FC<AlgebraLesson7Props> = ({ onComplete, onNext, hasNext }) => {
  const [isCompleted, setIsCompleted] = useState(false);
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

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete();
  };

  const defaultContent = `
    <h2>Learning Objectives</h2>
    <p>By the end of this lesson, you will be able to:</p>
    <ul>
      <li>Apply algebraic concepts to real-world problems</li>
      <li>Set up and solve word problems</li>
      <li>Work with formulas and literal equations</li>
      <li>Solve mixture and motion problems</li>
    </ul>

    <h2>Setting Up Word Problems</h2>
    <p>Follow these steps to solve word problems:</p>
    <ol>
      <li>Read the problem carefully</li>
      <li>Identify what you're looking for</li>
      <li>Choose a variable to represent the unknown</li>
      <li>Write an equation based on the problem</li>
      <li>Solve the equation</li>
      <li>Check your answer in the original problem</li>
    </ol>

    <h2>Example 1: Age Problem</h2>
    <p>Sarah is 3 years older than twice her brother's age. If Sarah is 15 years old, how old is her brother?</p>
    <p>Let x = brother's age</p>
    <p>Sarah's age = 2x + 3</p>
    <p>Since Sarah is 15: 2x + 3 = 15</p>
    <p>Solve: 2x = 12, so x = 6</p>
    <p>Her brother is 6 years old.</p>

    <h2>Example 2: Geometry Problem</h2>
    <p>The length of a rectangle is 4 cm more than its width. If the perimeter is 32 cm, find the dimensions.</p>
    <p>Let w = width</p>
    <p>Then length = w + 4</p>
    <p>Perimeter = 2(length + width) = 2(w + 4 + w) = 2(2w + 4) = 4w + 8</p>
    <p>Since perimeter is 32: 4w + 8 = 32</p>
    <p>Solve: 4w = 24, so w = 6</p>
    <p>Width = 6 cm, Length = 10 cm</p>

    <h2>Working with Formulas</h2>
    <p>Sometimes we need to solve for a specific variable in a formula.</p>
    
    <h3>Example: Distance Formula</h3>
    <p>Given d = rt, solve for t:</p>
    <p>Divide both sides by r: t = d/r</p>
    
    <h3>Example: Area of Triangle</h3>
    <p>Given A = (1/2)bh, solve for h:</p>
    <p>Multiply by 2: 2A = bh</p>
    <p>Divide by b: h = 2A/b</p>
  `;

  const displayContent = lessonContent || defaultContent;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* TTS Controls */}
      <LessonTTSControls
        lessonTitle={lessonTitle}
        lessonNumber={7}
        totalLessons={7}
        contentRef={lessonContentRef}
      />

      {/* Lesson Introduction */}
      <Card ref={lessonContentRef}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">{lessonTitle}</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Apply algebraic concepts to solve real-world problems and master advanced techniques.
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
          Lesson 7 of 7 • {lessonTitle}
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