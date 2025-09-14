import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Calculator, CheckCircle, PlayCircle, Trophy, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CourseHeader from '@/components/course/CourseHeader';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';
import CourseOverviewTTS from '@/components/course/CourseOverviewTTS';
import CourseOverviewVideo from '@/components/course/CourseOverviewVideo';
import { useExtractAlgebraZip } from '@/hooks/useExtractAlgebraZip';

// Import lesson components
import { AlgebraLesson1 } from '@/components/algebra/lessons/AlgebraLesson1';
import { AlgebraLesson2 } from '@/components/algebra/lessons/AlgebraLesson2';
import { AlgebraLesson3 } from '@/components/algebra/lessons/AlgebraLesson3';
import { AlgebraLesson4 } from '@/components/algebra/lessons/AlgebraLesson4';
import { AlgebraLesson5 } from '@/components/algebra/lessons/AlgebraLesson5';
import { AlgebraLesson6 } from '@/components/algebra/lessons/AlgebraLesson6';
import { AlgebraLesson7 } from '@/components/algebra/lessons/AlgebraLesson7';

const InteractiveAlgebraCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState(new Set<number>());
  const [overallProgress, setOverallProgress] = useState(0);
  const extractZipMutation = useExtractAlgebraZip();

  const lessons = [
    {
      id: 1,
      title: "Introduction to Algebra",
      description: "Learn the fundamental concepts of algebra and working with variables",
      component: AlgebraLesson1,
      icon: BookOpen
    },
    {
      id: 2,
      title: "Working with Variables",
      description: "Master algebraic expressions and the distributive property",
      component: AlgebraLesson2,
      icon: Calculator
    },
    {
      id: 3,
      title: "Solving Simple Equations",
      description: "Learn basic techniques for solving algebraic equations",
      component: AlgebraLesson3,
      icon: Calculator
    },
    {
      id: 4,
      title: "Linear Equations and Graphing",
      description: "Understand linear relationships and graphing techniques",
      component: AlgebraLesson4,
      icon: PlayCircle
    },
    {
      id: 5,
      title: "Systems of Equations",
      description: "Solve systems of linear equations using various methods",
      component: AlgebraLesson5,
      icon: Calculator
    },
    {
      id: 6,
      title: "Quadratic Equations",
      description: "Introduction to quadratic equations and their solutions",
      component: AlgebraLesson6,
      icon: BookOpen
    },
    {
      id: 7,
      title: "Advanced Applications",
      description: "Apply algebraic concepts to real-world problems",
      component: AlgebraLesson7,
      icon: Trophy
    }
  ];

  // Extract zip content on component mount to load real lesson content
  useEffect(() => {
    console.log('Extracting algebra course content...');
    extractZipMutation.mutate();
  }, []);

  const handleLessonComplete = (lessonId: number) => {
    const newCompleted = new Set(completedLessons);
    newCompleted.add(lessonId);
    setCompletedLessons(newCompleted);
    
    // Calculate new progress
    const newProgress = (newCompleted.size / lessons.length) * 100;
    setOverallProgress(newProgress);
    
    console.log(`Lesson ${lessonId} completed. Progress: ${newProgress}%`);
  };

  const handleNextLesson = () => {
    if (currentLesson !== null && currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
      // Scroll to top of the page when navigating to next lesson
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToCourses = () => {
    navigate('/dashboard/learner/courses');
  };

  const handleDashboard = () => {
    navigate('/dashboard/learner');
  };

  const getCurrentLesson = () => {
    if (currentLesson === null) return null;
    return lessons[currentLesson];
  };

  const isCurrentView = (view: 'overview' | 'lesson') => {
    return currentLesson === null ? view === 'overview' : view === 'lesson';
  };

  // Course overview content
  if (currentLesson === null) {
    return (
      <VoiceSettingsProvider>
        <div className="min-h-screen bg-background">
          <CourseHeader 
            onBackToCourses={handleBackToCourses}
            onDashboard={handleDashboard}
          />
          
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Course Header */}
            <header className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 text-primary">
                Interactive Algebra Course
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
                Master algebra fundamentals through interactive lessons and practice problems. 
                Learn algebraic expressions, equations, and problem-solving techniques step by step.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <Badge variant="default" className="fpk-gradient text-white text-lg px-4 py-2">
                  Interactive
                </Badge>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  7 Lessons
                </Badge>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  ~5 Hours
                </Badge>
              </div>
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Course Progress</span>
                  <span>{Math.round(overallProgress)}%</span>
                </div>
                <Progress value={overallProgress} className="h-3" />
              </div>
            </header>

            {/* TTS Controls */}
            <div className="mb-8">
              <CourseOverviewTTS
                courseTitle="Interactive Algebra Course"
                courseDescription="Master algebra fundamentals through interactive lessons and practice problems. Learn algebraic expressions, equations, and problem-solving techniques step by step."
                lessons={lessons}
              />
            </div>

            {/* Course Overview Video */}
            <div className="mb-8">
              <CourseOverviewVideo
                videoUrl="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/Algebra_s_Secret_Language.mp4"
                title="Algebra's Secret Language"
              />
            </div>

            {/* Lessons Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson, index) => {
                const Icon = lesson.icon;
                const isCompleted = completedLessons.has(lesson.id);
                const isAccessible = index === 0 || completedLessons.has(lessons[index - 1].id);
                const hasComponent = lesson.component !== null;

                return (
                  <Card 
                    key={lesson.id} 
                    className={`cursor-pointer transition-all duration-200 ${
                      isAccessible && hasComponent
                        ? 'hover:shadow-lg hover:-translate-y-1' 
                        : 'opacity-50 cursor-not-allowed'
                    } ${isCompleted ? 'ring-2 ring-green-500' : ''}`}
                    onClick={() => {
                      if (isAccessible && hasComponent) {
                        setCurrentLesson(index);
                      }
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            isCompleted 
                              ? 'bg-green-100 text-green-600' 
                              : isAccessible && hasComponent
                                ? 'bg-primary/10 text-primary'
                                : 'bg-gray-100 text-gray-400'
                          }`}>
                            {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{lesson.title}</CardTitle>
                            <Badge variant="outline" className="mt-1">
                              Lesson {lesson.id}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4">
                        {lesson.description}
                      </p>
                      {isCompleted && (
                        <Badge className="bg-green-600 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                      {!isAccessible && (
                        <Badge variant="outline">
                          Complete previous lesson to unlock
                        </Badge>
                      )}
                      {!hasComponent && isAccessible && (
                        <Badge variant="outline">
                          Coming Soon
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Course Completion */}
            {completedLessons.size === lessons.length && (
              <Card className="mt-12 text-center bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <Trophy className="h-16 w-16 text-gold-500" />
                  </div>
                  <CardTitle className="text-2xl text-green-700">
                    🎉 Congratulations! Course Complete!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-green-600 mb-4">
                    You have successfully completed the Interactive Algebra Course!
                  </p>
                  <p className="text-muted-foreground mb-6">
                    You've mastered algebraic expressions, equations, and problem-solving techniques. 
                    Keep practicing to strengthen your algebra skills!
                  </p>
                  <Button onClick={handleBackToCourses} size="lg" className="fpk-gradient text-white">
                    Return to My Courses
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </VoiceSettingsProvider>
    );
  }

  // Individual lesson view
  const currentLessonData = getCurrentLesson();
  if (!currentLessonData || !currentLessonData.component) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Lesson Coming Soon</h2>
            <p className="text-muted-foreground mb-4">
              This lesson is currently being developed and will be available soon.
            </p>
            <Button onClick={() => setCurrentLesson(null)} variant="outline">
              Back to Course Overview
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const LessonComponent = currentLessonData.component;

  return (
    <VoiceSettingsProvider>
      <div className="min-h-screen bg-background">
        <CourseHeader 
          onBackToCourses={handleBackToCourses}
          onDashboard={handleDashboard}
        />
        
        <div className="container mx-auto px-4 py-8">
          {/* Lesson Header */}
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentLesson(null)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Course Overview
            </Button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold">
                Lesson {currentLessonData.id}: {currentLessonData.title}
              </h1>
              <p className="text-muted-foreground">{currentLessonData.description}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {currentLesson + 1} of {lessons.length}
              </span>
              <Progress value={((currentLesson + 1) / lessons.length) * 100} className="w-20 h-2" />
            </div>
          </div>

          {/* Lesson Content */}
          <LessonComponent 
            onComplete={() => handleLessonComplete(currentLessonData.id)}
            onNext={handleNextLesson}
            hasNext={currentLesson < lessons.length - 1}
          />
        </div>
      </div>
    </VoiceSettingsProvider>
  );
};

export default InteractiveAlgebraCoursePage;