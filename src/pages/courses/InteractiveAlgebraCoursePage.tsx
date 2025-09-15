import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InteractiveCourseWrapper } from '@/components/course/InteractiveCourseWrapper';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Calculator, CheckCircle, PlayCircle, Trophy, ArrowLeft } from 'lucide-react';
import CourseHeader from '@/components/course/CourseHeader';
import CourseOverviewVideo from '@/components/course/CourseOverviewVideo';
import { useInteractiveCourseProgress } from '@/hooks/useInteractiveCourseProgress';
import { useInteractiveCourseEnrollmentBridge } from '@/hooks/useInteractiveCourseEnrollmentBridge';

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
  const { lesson } = useParams<{ lesson: string }>();
  const currentLesson = lesson ? parseInt(lesson) - 1 : null;
  const courseId = "interactive-algebra";
  const courseTitle = "Interactive Algebra";
  
  const { completedLessons, saveLessonCompletion } = useInteractiveCourseProgress(courseId);
  const { migrateEnrollmentData } = useInteractiveCourseEnrollmentBridge();

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

  const handleLessonComplete = (lessonNumber: number) => {
    console.log(`Algebra lesson ${lessonNumber} completed`);
    const lessonData = lessons.find(l => l.id === lessonNumber);
    saveLessonCompletion(lessonNumber, lessonData?.title || `Lesson ${lessonNumber}`);
    migrateEnrollmentData();
  };

  const handleNextLesson = () => {
    if (currentLesson !== null && currentLesson < lessons.length - 1) {
      navigate(`/courses/interactive-algebra/lesson/${currentLesson + 2}`);
    }
  };

  const handleBackToCourses = () => {
    navigate('/dashboard/learner/courses');
  };

  const handleDashboard = () => {
    navigate('/dashboard/learner');
  };

  const overallProgress = (completedLessons.size / lessons.length) * 100;

  // Course overview content
  if (currentLesson === null) {
    return (
      <InteractiveCourseWrapper
        courseId={courseId}
        courseTitle={courseTitle}
        currentLesson={currentLesson}
        totalLessons={lessons.length}
        onProgressUpdate={(completed, total) => {
          console.log(`Course progress: ${completed}/${total}`);
        }}
      >
        <div className="min-h-screen bg-background">
          <CourseHeader 
            onBackToCourses={handleBackToCourses}
            onDashboard={handleDashboard}
            courseTitle={courseTitle}
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

                return (
                  <Card 
                    key={lesson.id} 
                    className={`cursor-pointer transition-all duration-200 ${
                      isAccessible 
                        ? 'hover:shadow-lg hover:-translate-y-1' 
                        : 'opacity-50 cursor-not-allowed'
                    } ${isCompleted ? 'ring-2 ring-green-500' : ''}`}
                    onClick={() => {
                      if (isAccessible) {
                        navigate(`/courses/interactive-algebra/lesson/${lesson.id}`);
                      }
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            isCompleted 
                              ? 'bg-green-100 text-green-600' 
                              : isAccessible 
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
      </InteractiveCourseWrapper>
    );
  }

  // Individual lesson view
  const currentLessonData = lessons[currentLesson];
  if (!currentLessonData?.component) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Lesson Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The requested lesson could not be found.
            </p>
            <Button onClick={() => navigate('/courses/interactive-algebra')} variant="outline">
              Back to Course Overview
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const LessonComponent = currentLessonData.component;

  return (
    <InteractiveCourseWrapper
      courseId={courseId}
      courseTitle={courseTitle}
      currentLesson={currentLesson + 1}
      totalLessons={lessons.length}
      onProgressUpdate={(completed, total) => {
        console.log(`Course progress: ${completed}/${total}`);
      }}
    >
      <div className="min-h-screen bg-background">
        <CourseHeader 
          onBackToCourses={handleBackToCourses}
          onDashboard={handleDashboard}
          title={`Lesson ${currentLessonData.id}: ${currentLessonData.title}`}
        />

        <div className="container mx-auto px-4 py-8">
          {/* Lesson Header */}
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/courses/interactive-algebra')}
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
          <InteractiveLessonWrapper
            courseId={courseId}
            lessonId={currentLesson + 1}
            lessonTitle={currentLessonData.title}
            onComplete={() => handleLessonComplete(currentLessonData.id)}
            onNext={handleNextLesson}
            hasNext={currentLesson < lessons.length - 1}
          >
            <LessonComponent 
              onComplete={() => handleLessonComplete(currentLessonData.id)}
              onNext={handleNextLesson}
              hasNext={currentLesson < lessons.length - 1}
            />
          </InteractiveLessonWrapper>
        </div>
      </div>
    </InteractiveCourseWrapper>
  );
};

export default InteractiveAlgebraCoursePage;