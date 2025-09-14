import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, ArrowRight } from 'lucide-react';
import LessonTTSControls from '@/components/course/LessonTTSControls';
import { getExtractedLessonContent, parseContentForDisplay, extractTitleFromContent } from '@/utils/algebraContentParser';

interface AlgebraLesson4Props {
  onComplete: () => void;
  onNext: () => void;
  hasNext: boolean;
}

export const AlgebraLesson4: React.FC<AlgebraLesson4Props> = ({ onComplete, onNext, hasNext }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [lessonContent, setLessonContent] = useState<string>('');
  const [lessonTitle, setLessonTitle] = useState<string>('Linear Equations and Graphing');
  const lessonContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const extractedLesson = getExtractedLessonContent(4);
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* TTS Controls */}
      <LessonTTSControls
        lessonTitle={lessonTitle}
        lessonNumber={4}
        totalLessons={7}
        contentRef={lessonContentRef}
      />

      {/* Lesson Content */}
      <Card ref={lessonContentRef}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <PlayCircle className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">{lessonTitle}</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Learn to solve and graph linear equations step by step.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {lessonContent ? (
            <div 
              className="prose prose-slate max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: lessonContent }}
            />
          ) : (
            <div className="space-y-6">
              <div className="bg-card rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Learning Objectives</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Understand what linear equations represent</li>
                  <li>• Learn different forms of linear equations</li>
                  <li>• Master graphing techniques</li>
                  <li>• Solve real-world problems using linear equations</li>
                </ul>
              </div>

              <div className="bg-card rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Linear Equation Forms</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Standard Form</h3>
                    <p className="text-muted-foreground mb-2">Ax + By = C</p>
                    <p className="text-sm text-muted-foreground">Example: 2x + 3y = 6</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Slope-Intercept Form</h3>
                    <p className="text-muted-foreground mb-2">y = mx + b</p>
                    <p className="text-sm text-muted-foreground">Where m is the slope and b is the y-intercept</p>
                    <p className="text-sm text-muted-foreground">Example: y = 2x + 3</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Point-Slope Form</h3>
                    <p className="text-muted-foreground mb-2">y - y₁ = m(x - x₁)</p>
                    <p className="text-sm text-muted-foreground">Used when you know a point and the slope</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Graphing Steps</h2>
                <ol className="space-y-3 text-muted-foreground">
                  <li><strong>1. Identify the form:</strong> Determine which form your equation is in</li>
                  <li><strong>2. Find key points:</strong> Locate intercepts or use slope and a point</li>
                  <li><strong>3. Plot points:</strong> Mark at least two points on the coordinate plane</li>
                  <li><strong>4. Draw the line:</strong> Connect the points with a straight line</li>
                  <li><strong>5. Extend the line:</strong> Continue the line beyond your points</li>
                </ol>
              </div>

              <div className="bg-card rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Example Problem</h2>
                <div className="space-y-3">
                  <p><strong>Graph:</strong> y = 2x - 1</p>
                  <div className="text-muted-foreground space-y-2">
                    <p><strong>Step 1:</strong> This is in slope-intercept form (y = mx + b)</p>
                    <p><strong>Step 2:</strong> Slope (m) = 2, y-intercept (b) = -1</p>
                    <p><strong>Step 3:</strong> Start at point (0, -1) on the y-axis</p>
                    <p><strong>Step 4:</strong> From (0, -1), go up 2 units and right 1 unit to get (1, 1)</p>
                    <p><strong>Step 5:</strong> Draw a line through (0, -1) and (1, 1)</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lesson Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Lesson 4 of 7 • Linear Equations and Graphing
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