import React, { useState, useEffect } from 'react';
import { InteractiveCourseWrapper } from '@/components/course/InteractiveCourseWrapper';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { LogicLesson1_1 } from './LogicLesson1_1';
import { LogicLesson1_2 } from './LogicLesson1_2';
import { LogicLesson2_1 } from './LogicLesson2_1';
import { LogicLesson2_2 } from './LogicLesson2_2';
import { LogicLesson3_1 } from './LogicLesson3_1';
import { LogicLesson3_2 } from './LogicLesson3_2';
import { LogicLesson4_1 } from './LogicLesson4_1';
import { LogicLesson4_2 } from './LogicLesson4_2';
import { LogicLesson5_1 } from './LogicLesson5_1';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, CheckCircle, BookOpen, Target, Users, Lightbulb, Trophy, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CourseHeader from '@/components/course/CourseHeader';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';
import CourseOverviewTTS from '@/components/course/CourseOverviewTTS';
import CourseOverviewVideo from '@/components/course/CourseOverviewVideo';

const LogicCriticalThinkingCoursePage = () => {
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState(new Set<number>());
  const [overallProgress, setOverallProgress] = useState(0);

  // Scroll to top when lesson changes
  useEffect(() => {
    if (currentLesson !== null) {
      window.scrollTo(0, 0);
    }
  }, [currentLesson]);

  const lessons = [
    {
      id: 1,
      title: "What is Critical Thinking?",
      description: "Explore the foundations of rational thought and learn to distinguish between automatic thinking and deliberate reasoning",
      component: LogicLesson1_1,
      icon: Lightbulb
    },
    {
      id: 2,
      title: "Arguments vs. Opinions",
      description: "Learn to identify and differentiate between arguments, opinions, and personal beliefs",
      component: LogicLesson1_2,
      icon: Target
    },
    {
      id: 3,
      title: "Identifying Arguments in Context",
      description: "Practice recognizing arguments in real-world scenarios and everyday conversations",
      component: LogicLesson2_1,
      icon: BookOpen
    },
    {
      id: 4,
      title: "Evaluating Argument Quality",
      description: "Develop skills to assess the strength and validity of different arguments",
      component: LogicLesson2_2,
      icon: CheckCircle
    },
    {
      id: 5,
      title: "What is Deductive Reasoning?",
      description: "Master the principles of deductive logic and logical inference",
      component: LogicLesson3_1,
      icon: Brain
    },
    {
      id: 6,
      title: "Basic Logical Forms",
      description: "Learn fundamental logical structures and patterns of reasoning",
      component: LogicLesson3_2,
      icon: BookOpen
    },
    {
      id: 7,
      title: "Complex Deductive Arguments",
      description: "Tackle advanced deductive reasoning and multi-step logical arguments",
      component: LogicLesson4_1,
      icon: Target
    },
    {
      id: 8,
      title: "Testing Deductive Arguments",
      description: "Apply systematic methods to validate and verify logical arguments",
      component: LogicLesson4_2,
      icon: CheckCircle
    },
    {
      id: 9,
      title: "The Nature of Inductive Arguments",
      description: "Understand inductive reasoning and its role in critical thinking",
      component: LogicLesson5_1,
      icon: Lightbulb
    },
  ];

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
    console.log('📍 Navigating back to courses');
    navigate('/dashboard/learner/courses');
  };

  const handleDashboard = () => {
    navigate('/dashboard/learner');
  };

  const getCurrentLesson = () => {
    if (currentLesson === null) return null;
    return lessons[currentLesson];
  };

  // Course overview content
  if (currentLesson === null) {
    return (
      <VoiceSettingsProvider>
        <InteractiveCourseWrapper
          courseId="logic-critical-thinking"
          courseTitle="Logic and Critical Thinking"
          currentLesson={currentLesson}
          totalLessons={lessons.length}
        >
          <div className="min-h-screen bg-background">
        <CourseHeader 
          onBackToCourses={handleBackToCourses}
          onDashboard={handleDashboard}
          courseTitle="Logic and Critical Thinking"
        />
          
          <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Course Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-primary">
              Logic and Critical Thinking
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
              Master the art of rational thinking and logical reasoning. Develop critical thinking skills 
              to analyze arguments, identify fallacies, and make sound decisions in academic and personal contexts.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <Badge variant="default" className="fpk-gradient text-white text-lg px-4 py-2">
                Interactive
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                9 Lessons
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                ~4 Hours
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
              courseTitle="Logic and Critical Thinking"
              courseDescription="Master rational thinking and logical reasoning through interactive lessons on critical thinking, argument analysis, and deductive reasoning."
              lessons={lessons}
            />
          </div>

          {/* Course Overview Video */}
          <CourseOverviewVideo
            videoUrl="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/Logic_&_Critical_Thinking.mp4"
            title="Introduction to Critical Thinking"
          />

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
                  You have successfully completed the Logic and Critical Thinking Course!
                </p>
                <p className="text-muted-foreground mb-6">
                  You've mastered critical thinking skills, logical reasoning, and argument analysis. 
                  Apply these skills to make better decisions in all areas of life!
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
      </VoiceSettingsProvider>
    );
  }

  // Individual lesson view
  const currentLessonData = getCurrentLesson();
  if (!currentLessonData) return null;

  const LessonComponent = currentLessonData.component;

  return (
    <VoiceSettingsProvider>
      <InteractiveCourseWrapper
        courseId="logic-critical-thinking"
        courseTitle="Logic and Critical Thinking"
        currentLesson={currentLesson}
        totalLessons={lessons.length}
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
            onClick={() => {
              console.log('🔘 Logic: Back to Course Overview button clicked');
              setCurrentLesson(null);
            }}
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
              {currentLesson! + 1} of {lessons.length}
            </span>
            <Progress value={((currentLesson! + 1) / lessons.length) * 100} className="w-20 h-2" />
          </div>
        </div>

        {/* Lesson Content */}
        <InteractiveLessonWrapper
          courseId="logic-critical-thinking"
          lessonId={currentLesson! + 1}
          lessonTitle={currentLessonData.title}
          onComplete={() => handleLessonComplete(currentLessonData.id)}
          onNext={handleNextLesson}
          hasNext={currentLesson! < lessons.length - 1}
          totalLessons={lessons.length}
        >
          <LessonComponent 
            onComplete={() => handleLessonComplete(currentLessonData.id)}
            onNext={handleNextLesson}
            hasNext={currentLesson! < lessons.length - 1}
          />
        </InteractiveLessonWrapper>
      </div>
      </div>
      </InteractiveCourseWrapper>
    </VoiceSettingsProvider>
  );
};

export default LogicCriticalThinkingCoursePage;