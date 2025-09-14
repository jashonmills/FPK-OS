import React, { useState } from 'react';
import { LogicLesson1_1 } from './LogicLesson1_1';
import { LogicLesson1_2 } from './LogicLesson1_2';
import { LogicLesson2_1 } from './LogicLesson2_1';
import { LogicLesson2_2 } from './LogicLesson2_2';
import { LogicLesson3_1 } from './LogicLesson3_1';
import { LogicLesson3_2 } from './LogicLesson3_2';
import { LogicLesson4_1 } from './LogicLesson4_1';
import { LogicLesson4_2 } from './LogicLesson4_2';
import { LogicLesson5_1 } from './LogicLesson5_1';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const LogicCriticalThinkingCoursePage = () => {
  const [currentLesson, setCurrentLesson] = useState<number>(1);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());

  const lessons = [
    { id: 1, title: "What is Critical Thinking?", component: LogicLesson1_1 },
    { id: 2, title: "Arguments vs. Opinions", component: LogicLesson1_2 },
    { id: 3, title: "Identifying Arguments in Context", component: LogicLesson2_1 },
    { id: 4, title: "Evaluating Argument Quality", component: LogicLesson2_2 },
    { id: 5, title: "What is Deductive Reasoning?", component: LogicLesson3_1 },
    { id: 6, title: "Basic Logical Forms", component: LogicLesson3_2 },
    { id: 7, title: "Complex Deductive Arguments", component: LogicLesson4_1 },
    { id: 8, title: "Testing Deductive Arguments", component: LogicLesson4_2 },
    { id: 9, title: "The Nature of Inductive Arguments", component: LogicLesson5_1 },
  ];

  const handleLessonComplete = (lessonId: number) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
  };

  const handleNextLesson = () => {
    if (currentLesson < lessons.length) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  const CurrentLessonComponent = lessons[currentLesson - 1]?.component;
  const hasNext = currentLesson < lessons.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard/learner/courses">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Courses
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Brain className="w-6 h-6 text-green-600" />
                <div>
                  <h1 className="text-xl font-bold">Logic and Critical Thinking</h1>
                  <p className="text-sm text-muted-foreground">
                    Lesson {currentLesson} of {lessons.length}: {lessons[currentLesson - 1]?.title}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-muted/50 border-b">
        <div className="max-w-6xl mx-auto px-6 py-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Progress:</span>
            <div className="flex-1 bg-muted rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedLessons.size / lessons.length) * 100}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {completedLessons.size}/{lessons.length}
            </span>
          </div>
        </div>
      </div>

      {/* Lesson Navigation */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-2 flex-wrap">
              {lessons.map((lesson) => (
                <Button
                  key={lesson.id}
                  variant={currentLesson === lesson.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentLesson(lesson.id)}
                  className={completedLessons.has(lesson.id) ? "bg-green-100 dark:bg-green-900/20" : ""}
                >
                  {lesson.id}. {lesson.title}
                  {completedLessons.has(lesson.id) && " ✓"}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Lesson */}
        {CurrentLessonComponent && (
          <CurrentLessonComponent
            onComplete={() => handleLessonComplete(currentLesson)}
            onNext={handleNextLesson}
            hasNext={hasNext}
          />
        )}
      </div>
    </div>
  );
};

export default LogicCriticalThinkingCoursePage;