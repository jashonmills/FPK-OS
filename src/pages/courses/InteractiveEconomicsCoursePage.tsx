import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Calculator, CheckCircle, PlayCircle, Trophy, ArrowLeft, ArrowRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CourseHeader from '@/components/course/CourseHeader';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';
import CourseOverviewTTS from '@/components/course/CourseOverviewTTS';
import CourseOverviewVideo from '@/components/course/CourseOverviewVideo';

// Import lesson components
import { EconomicsLesson1 } from '@/components/courses/economics/EconomicsLesson1';
import { EconomicsLesson2 } from '@/components/courses/economics/EconomicsLesson2';
import { EconomicsLesson3 } from '@/components/courses/economics/EconomicsLesson3';
import { EconomicsLesson4 } from '@/components/courses/economics/EconomicsLesson4';
import { EconomicsLesson5 } from '@/components/courses/economics/EconomicsLesson5';
import { EconomicsLesson6 } from '@/components/courses/economics/EconomicsLesson6';
import { EconomicsLesson7 } from '@/components/courses/economics/EconomicsLesson7';
import { EconomicsLesson8 } from '@/components/courses/economics/EconomicsLesson8';

const InteractiveEconomicsCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState(new Set<number>());
  const [overallProgress, setOverallProgress] = useState(0);

  const lessons = [
    {
      id: 1,
      title: "Introduction to Economics",
      description: "Understand the fundamental concepts and importance of economics",
      component: EconomicsLesson1,
      icon: BookOpen
    },
    {
      id: 2,
      title: "Supply and Demand",
      description: "Learn about market forces and price determination",
      component: EconomicsLesson2,
      icon: TrendingUp
    },
    {
      id: 3,
      title: "Market Structures",
      description: "Explore different types of market competition",
      component: EconomicsLesson3,
      icon: Calculator
    },
    {
      id: 4,
      title: "Economic Indicators",
      description: "Understand GDP, inflation, and unemployment",
      component: EconomicsLesson4,
      icon: PlayCircle
    },
    {
      id: 5,
      title: "Monetary Policy",
      description: "Learn about central banking and money supply",
      component: EconomicsLesson5,
      icon: Trophy
    },
    {
      id: 6,
      title: "Fiscal Policy",
      description: "Understand government spending and taxation",
      component: EconomicsLesson6,
      icon: BookOpen
    },
    {
      id: 7,
      title: "International Trade",
      description: "Explore global economics and trade relationships",
      component: EconomicsLesson7,
      icon: TrendingUp
    },
    {
      id: 8,
      title: "Economic Growth & Development",
      description: "Learn about long-term economic progress",
      component: EconomicsLesson8,
      icon: CheckCircle
    }
  ];

  const handleLessonComplete = (lessonId: number) => {
    setCompletedLessons(prev => {
      const updated = new Set(prev);
      updated.add(lessonId);
      
      // Calculate progress
      const progressPercentage = (updated.size / lessons.length) * 100;
      setOverallProgress(progressPercentage);
      
      return updated;
    });
  };

  const handleNextLesson = () => {
    if (currentLesson !== null && currentLesson < lessons.length) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  const handleBackToCourses = () => {
    navigate('/dashboard/learner/courses');
  };

  const handleDashboard = () => {
    navigate('/dashboard/learner');
  };

  const isLessonAccessible = (lessonId: number) => {
    return lessonId === 1 || completedLessons.has(lessonId - 1);
  };

  const isAllLessonsCompleted = completedLessons.size === lessons.length;

  // Course overview (lesson selection)
  if (currentLesson === null) {
    return (
      <VoiceSettingsProvider>
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
          <CourseHeader onDashboard={handleDashboard} onBackToCourses={handleBackToCourses} />
          
          <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Course Title and Description */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-foreground">Introduction to Modern Economics</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Master the fundamental principles of economics, from basic supply and demand to complex macroeconomic policies
              </p>
              
              {/* Course badges */}
              <div className="flex justify-center gap-4 flex-wrap">
                <Badge variant="outline" className="text-sm px-3 py-1">
                  <BookOpen className="w-4 h-4 mr-2" />
                  8 Lessons
                </Badge>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  <Trophy className="w-4 h-4 mr-2" />
                  Interactive
                </Badge>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Self-Paced
                </Badge>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Course Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
              <p className="text-xs text-muted-foreground mt-1 text-center">
                {completedLessons.size} of {lessons.length} lessons completed
              </p>
            </div>

            {/* Voice Controls */}
            <div className="mb-8">
              <CourseOverviewTTS 
                courseTitle="Introduction to Modern Economics"
                courseDescription="Master the fundamental principles of economics, from basic supply and demand to complex macroeconomic policies"
                lessons={lessons}
              />
            </div>

            {/* Video Overview */}
            <CourseOverviewVideo 
              videoUrl="https://example.com/economics-intro-video.mp4" 
              title="Introduction to Modern Economics"
            />

            {/* Lessons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {lessons.map((lesson) => {
                const isCompleted = completedLessons.has(lesson.id);
                const isAccessible = isLessonAccessible(lesson.id);
                const Icon = lesson.icon;

                return (
                  <Card 
                    key={lesson.id}
                    className={`relative transition-all duration-200 cursor-pointer hover:shadow-lg ${
                      !isAccessible ? 'opacity-50' : ''
                    } ${isCompleted ? 'border-primary/50 bg-primary/5' : ''}`}
                    onClick={() => isAccessible && setCurrentLesson(lesson.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            isCompleted 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                          </div>
                          <div>
                            <Badge variant="outline" className="text-xs">
                              Lesson {lesson.id}
                            </Badge>
                          </div>
                        </div>
                        {isCompleted && (
                          <Badge variant="default" className="text-xs">
                            Completed
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{lesson.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {lesson.description}
                      </p>
                      <Button 
                        variant={isCompleted ? "secondary" : "default"}
                        className="w-full"
                        disabled={!isAccessible}
                      >
                        {isCompleted ? "Review Lesson" : isAccessible ? "Start Lesson" : "Locked"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Completion Message */}
            {isAllLessonsCompleted && (
              <div className="max-w-2xl mx-auto text-center space-y-4 p-6 bg-primary/10 rounded-lg border border-primary/20">
                <Trophy className="w-12 h-12 text-primary mx-auto" />
                <h3 className="text-2xl font-bold text-primary">Congratulations! 🎉</h3>
                <p className="text-muted-foreground">
                  You've completed all lessons in Introduction to Modern Economics. 
                  You now have a solid foundation in economic principles!
                </p>
                <Button onClick={handleBackToCourses} className="mt-4">
                  Back to My Courses
                </Button>
              </div>
            )}
          </div>
        </div>
      </VoiceSettingsProvider>
    );
  }

  // Individual lesson view
  const lesson = lessons.find(l => l.id === currentLesson);
  if (!lesson) return null;

  const LessonComponent = lesson.component;
  const hasNext = currentLesson < lessons.length;

  return (
    <VoiceSettingsProvider>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        {/* Lesson Header */}
        <div className="bg-card border-b sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentLesson(null)}
                  className="flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Course Overview
                </Button>
                <div className="text-sm text-muted-foreground">
                  Lesson {currentLesson} of {lessons.length}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Progress 
                  value={(currentLesson / lessons.length) * 100} 
                  className="w-32 h-2"
                />
                <span className="text-sm font-medium">
                  {Math.round((currentLesson / lessons.length) * 100)}%
                </span>
              </div>
            </div>
            <div className="mt-2">
              <h1 className="text-xl font-semibold">{lesson.title}</h1>
              <p className="text-sm text-muted-foreground">{lesson.description}</p>
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="container mx-auto px-4 py-8">
          <LessonComponent
            onComplete={() => handleLessonComplete(currentLesson)}
            onNext={hasNext ? handleNextLesson : undefined}
            hasNext={hasNext}
          />
        </div>
      </div>
    </VoiceSettingsProvider>
  );
};

export default InteractiveEconomicsCoursePage;