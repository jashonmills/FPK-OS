import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Menu, Clock, Target, Trophy } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export interface MicroLessonScreen {
  id: string;
  type: 'concept' | 'practice' | 'example' | 'summary';
  title: string;
  content: React.ReactNode | string;
  estimatedTime?: number; // in minutes
}

export interface MicroLessonData {
  id: string;
  moduleTitle: string;
  totalScreens: number;
  screens: MicroLessonScreen[];
}

interface MicroLessonContainerProps {
  lessonData: MicroLessonData;
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const MicroLessonContainer: React.FC<MicroLessonContainerProps> = ({
  lessonData,
  onComplete,
  onNext,
  hasNext
}) => {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [startTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentScreen = lessonData.screens[currentScreenIndex];
  const progress = ((currentScreenIndex + 1) / lessonData.screens.length) * 100;

  // Safety check - ensure currentScreen exists
  if (!currentScreen) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <CardContent className="p-6 text-center">
            <p className="text-red-700">Unable to load course content. Please refresh the page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Update time spent every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const handleNext = () => {
    if (currentScreenIndex < lessonData.screens.length - 1) {
      setCurrentScreenIndex(currentScreenIndex + 1);
    } else if (!isCompleted) {
      setIsCompleted(true);
      onComplete?.();
    }
  };

  const handlePrevious = () => {
    if (currentScreenIndex > 0) {
      setCurrentScreenIndex(currentScreenIndex - 1);
    }
  };

  const handleScreenJump = (screenIndex: number) => {
    setCurrentScreenIndex(screenIndex);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScreenIcon = (type: string) => {
    switch (type) {
      case 'concept': return '📚';
      case 'practice': return '✏️';
      case 'example': return '💡';
      case 'summary': return '📋';
      default: return '📝';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Progress */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-xl text-blue-800 flex items-center gap-2">
              <Target className="h-5 w-5" />
              {lessonData.moduleTitle}
            </CardTitle>
            <div className="flex items-center gap-3 text-sm text-white">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTime(timeSpent)}
              </div>
              <div className="text-sm">
                Screen {currentScreenIndex + 1} of {lessonData.screens.length}
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between text-sm text-white mt-2">
            <span>{Math.round(progress)}% Complete</span>
            {currentScreen.estimatedTime && (
              <span>Est. {currentScreen.estimatedTime} min</span>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Screen */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getScreenIcon(currentScreen.type)}</span>
            <CardTitle className="text-xl">{currentScreen.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {typeof currentScreen.content === 'string' ? (
            <div dangerouslySetInnerHTML={{ __html: currentScreen.content }} />
          ) : (
            currentScreen.content
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentScreenIndex === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {/* Screen Navigation Menu */}
            <div className="flex gap-1 max-w-md overflow-x-auto">
              {lessonData.screens.map((screen, index) => (
                <Button
                  key={screen.id}
                  variant={index === currentScreenIndex ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleScreenJump(index)}
                  className="min-w-[40px] h-8 text-xs"
                  title={screen.title}
                >
                  {index + 1}
                </Button>
              ))}
            </div>

            {currentScreenIndex < lessonData.screens.length - 1 ? (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={isCompleted}
                className="flex items-center gap-2"
                variant={isCompleted ? "outline" : "default"}
              >
                {isCompleted ? "Completed" : "Complete Lesson"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Completion Message with Celebration */}
      {isCompleted && (
        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-8 text-center">
            <div className="space-y-6">
              <div className="animate-bounce">
                <Trophy className="h-16 w-16 text-yellow-500 mx-auto" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-green-700">🎉 Lesson Completed! 🎉</h3>
                <p className="text-green-600 font-medium">
                  <strong>Amazing work!</strong> You've mastered all the concepts in this lesson.
                </p>
                <p className="text-sm text-green-600">
                  Total time: {formatTime(timeSpent)}
                </p>
              </div>
              {hasNext && onNext && (
                <Button 
                  onClick={onNext} 
                  size="lg" 
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Continue to Next Lesson
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};