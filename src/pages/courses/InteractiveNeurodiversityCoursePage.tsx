import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Brain, CheckCircle, PlayCircle, Trophy, ArrowLeft, ArrowRight, Users, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CourseHeader from '@/components/course/CourseHeader';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';
import CourseOverviewTTS from '@/components/course/CourseOverviewTTS';
import CourseOverviewVideo from '@/components/course/CourseOverviewVideo';
import VideoPlaylist from '@/components/course/VideoPlaylist';
import { InteractiveCourseWrapper } from '@/components/course/InteractiveCourseWrapper';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { useInteractiveCourseProgress } from '@/hooks/useInteractiveCourseProgress';
import { useInteractiveCourseEnrollmentBridge } from '@/hooks/useInteractiveCourseEnrollmentBridge';
import { ErrorBoundary, CourseFallback } from '@/components/common/ErrorBoundary';

// Import micro-lesson components (converted)
import { WhatIsNeurodiversityMicroLesson } from '@/components/micro-lessons/neurodiversity/what-is-neurodiversity/WhatIsNeurodiversityMicroLesson';
import { BrainSuperpowersMicroLesson } from '@/components/micro-lessons/neurodiversity/brain-superpowers/BrainSuperpowersMicroLesson';
import { FoundationalLearningMicroLesson } from '@/components/micro-lessons/neurodiversity/foundational-learning/FoundationalLearningMicroLesson';
import { FpkAdvantageMicroLesson } from '@/components/micro-lessons/neurodiversity/fpk-advantage/FpkAdvantageMicroLesson';
import { ThrivingEconomicsMicroLesson } from '@/components/micro-lessons/neurodiversity/thriving-economics/ThrivingEconomicsMicroLesson';
import { LogicCriticalThinkingMicroLesson } from '@/components/micro-lessons/neurodiversity/logic-critical-thinking/LogicCriticalThinkingMicroLesson';
import { KeyConceptsReviewMicroLesson } from '@/components/micro-lessons/neurodiversity/key-concepts-review/KeyConceptsReviewMicroLesson';
import { QuizAssessmentMicroLesson } from '@/components/micro-lessons/neurodiversity/quiz-assessment/QuizAssessmentMicroLesson';
import neurodiversityBackground from '@/assets/neurodiversity-background.jpg';

// Import remaining lesson components (to be converted)

const InteractiveNeurodiversityCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState<number | null>(null);
  // Define all available videos
  const originalVideo = {
    url: "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/Your_Brain,_Your_Superpower.mp4",
    title: "Your Brain, Your Superpower - Course Introduction"
  };

  const [videos, setVideos] = useState([
    originalVideo,
    {
      url: 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/el-courses/module%200.v2.mp4',
      title: 'V0: Module 0 - Introduction'
    },
    {
      url: 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/el-courses/mod1.mp4',
      title: 'V1: Module 1 - Foundations'
    },
    {
      url: 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/el-courses/mod2.mp4',
      title: 'V2: Module 2 - Applications'
    }
  ]);

  const [currentMainVideo, setCurrentMainVideo] = useState(originalVideo);
  
  // Use analytics and progress hooks
  const courseId = 'neurodiversity-strengths-based-approach';
  const courseTitle = 'Neurodiversity: A Strengths-Based Approach';
  const {
    completedLessons,
    isLessonCompleted,
    calculateProgress,
    getNextLesson,
    getLearningStats,
    saveLessonCompletion
  } = useInteractiveCourseProgress(courseId);
  
  // Bridge old enrollment system with new analytics - delayed
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log('🔗 Initializing enrollment bridge');
    }, 5000); // Delay bridge initialization

    return () => clearTimeout(timeoutId);
  }, []);
  
  useInteractiveCourseEnrollmentBridge();

  // Scroll to top when lesson changes
  useEffect(() => {
    if (currentLesson !== null) {
      window.scrollTo(0, 0);
    }
  }, [currentLesson]);

  const lessons = [
    {
      id: 1,
      title: "What is Neurodiversity?",
      description: "Understand the fundamental concepts and paradigm shift from medical to social model",
      component: WhatIsNeurodiversityMicroLesson,
      icon: Brain
    },
    {
      id: 2,
      title: "Your Brain's Superpowers",
      description: "Discover how to reframe neurodiverse traits as powerful strengths",
      component: BrainSuperpowersMicroLesson,
      icon: Lightbulb
    },
    {
      id: 3,
      title: "Foundational Learning Strategies",
      description: "Build your personal operating system for effective learning",
      component: FoundationalLearningMicroLesson,
      icon: BookOpen
    },
    {
      id: 4,
      title: "The FPK University Advantage",
      description: "Learn how our platform is designed specifically for your brain",
      component: FpkAdvantageMicroLesson,
      icon: PlayCircle
    },
    {
      id: 5,
      title: "Thriving in Economics",
      description: "Apply your pattern recognition skills to economic concepts",
      component: ThrivingEconomicsMicroLesson,
      icon: Trophy
    },
    {
      id: 6,
      title: "Excelling in Logic & Critical Thinking",
      description: "Leverage your systematic thinking for logical reasoning",
      component: LogicCriticalThinkingMicroLesson,
      icon: Users
    },
    {
      id: 7,
      title: "Key Concepts Review",
      description: "Comprehensive review of all core concepts and ideas",
      component: KeyConceptsReviewMicroLesson,
      icon: CheckCircle
    },
    {
      id: 8,
      title: "Quiz & Assessment",
      description: "Test your knowledge with interactive quizzes and essay questions",
      component: QuizAssessmentMicroLesson,
      icon: Trophy
    }
  ];

  const handleLessonComplete = async (lessonId: number) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      await saveLessonCompletion(lessonId, lesson.title);
    }
  };

  const handleNextLesson = () => {
    if (currentLesson !== null && currentLesson < lessons.length) {
      setCurrentLesson(currentLesson + 1);
      // Scroll to top of the page
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

  const handleVideoSwap = (videoUrl: string, title: string) => {
    // Find the video being clicked in the playlist
    const clickedVideoIndex = videos.findIndex(v => v.url === videoUrl);
    if (clickedVideoIndex === -1) return;

    // Create new videos array with swapped positions
    const newVideos = [...videos];
    const currentMainIndex = videos.findIndex(v => v.url === currentMainVideo.url);
    
    if (currentMainIndex !== -1) {
      // Swap the videos
      newVideos[clickedVideoIndex] = currentMainVideo;
      newVideos[currentMainIndex] = { url: videoUrl, title };
      
      setVideos(newVideos);
    }
    
    // Update main video
    setCurrentMainVideo({ url: videoUrl, title });
  };

  const isLessonAccessible = (lessonId: number) => {
    return lessonId === 1 || isLessonCompleted(lessonId - 1);
  };

  const overallProgress = calculateProgress(lessons.length);
  const isAllLessonsCompleted = completedLessons.size === lessons.length;
  const learningStats = getLearningStats();

  // Course overview (lesson selection)
  if (currentLesson === null) {
    return (
      <ErrorBoundary fallback={CourseFallback}>
        <VoiceSettingsProvider>
          <InteractiveCourseWrapper
            courseId={courseId}
            courseTitle={courseTitle}
            currentLesson={currentLesson}
            totalLessons={lessons.length}
          >
          <div 
            className="min-h-screen relative"
            style={{
              backgroundImage: `url(${neurodiversityBackground})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed'
            }}
          >
            <CourseHeader 
              courseTitle="Neurodiversity: A Strengths-Based Approach"
            />
           
          <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
            {/* Course Title and Description */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-foreground drop-shadow-lg bg-background/80 backdrop-blur-sm rounded-lg p-4 mx-auto inline-block">Neurodiversity: A Strengths-Based Approach</h1>
              <p className="text-xl text-foreground max-w-3xl mx-auto bg-background/80 backdrop-blur-sm rounded-lg p-4 drop-shadow-lg">
                Your guide to leveraging your unique brain for academic success. Discover how neurodivergence is an asset and learn to harness your cognitive superpowers.
              </p>
              
              {/* Course badges */}
              <div className="flex justify-center gap-4 flex-wrap">
                <Badge variant="outline" className="text-sm px-3 py-1 bg-background/80 backdrop-blur-sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  8 Lessons
                </Badge>
                <Badge variant="outline" className="text-sm px-3 py-1 bg-background/80 backdrop-blur-sm">
                  <Brain className="w-4 h-4 mr-2" />
                  Strengths-Based
                </Badge>
                <Badge variant="outline" className="text-sm px-3 py-1 bg-background/80 backdrop-blur-sm">
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
              {learningStats.totalTimeSpent > 0 && (
                <p className="text-xs text-muted-foreground text-center">
                  Total time spent: {Math.floor(learningStats.totalTimeSpent / 60)}h {learningStats.totalTimeSpent % 60}m
                </p>
              )}
            </div>

            {/* Course Introduction Video */}
            <div className="mb-8">
              <CourseOverviewVideo 
                videoUrl={currentMainVideo.url}
                title={currentMainVideo.title}
              />
            </div>

            {/* Video Playlist */}
            <div className="mb-8">
              <VideoPlaylist
                currentMainVideoUrl={currentMainVideo.url}
                onVideoSwap={handleVideoSwap}
                videos={videos.slice(1)} // Pass all videos except the main one
              />
            </div>

            {/* Voice Controls */}
            <div className="mb-8">
              <CourseOverviewTTS 
                courseTitle="Neurodiversity: A Strengths-Based Approach"
                courseDescription="Your guide to leveraging your unique brain for academic success. Discover how neurodivergence is an asset and learn to harness your cognitive superpowers."
                lessons={lessons}
              />
            </div>

            {/* Course Introduction */}
            <div className="bg-card p-6 rounded-lg shadow-sm border max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">Welcome to Your FPK University Journey</h2>
              <p className="text-muted-foreground leading-relaxed">
                This course is your essential first step at FPK University. It's designed to help you understand what **neurodiversity** is and, more importantly, how you can use your unique brain as a powerful tool for learning. This isn't about overcoming challenges; it's about identifying your strengths and using them to thrive. We believe that your neurodivergence is an asset, and this course will show you how to leverage it across all your studies.
              </p>
            </div>

            {/* Lessons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {lessons.map((lesson) => {
                const isCompleted = isLessonCompleted(lesson.id);
                const isAccessible = isLessonAccessible(lesson.id);
                const Icon = lesson.icon;

                return (
                  <Card 
                    key={lesson.id}
                    className={`relative transition-all duration-200 cursor-pointer hover:shadow-lg bg-card/65 backdrop-blur-sm border-border ${
                      !isAccessible ? 'opacity-50' : ''
                    } ${isCompleted ? 'border-primary/50' : 'border-border'}`}
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
                        {lesson.id === 1 ? "Start Lesson" : isCompleted ? "Review Lesson" : isAccessible ? "Start Lesson" : "Locked"}
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
                  You've completed the Neurodiversity: A Strengths-Based Approach course. 
                  You're now equipped with the tools and mindset to leverage your unique brain for academic success!
                </p>
                <Button onClick={handleBackToCourses} className="mt-4">
                  Back to My Courses
                </Button>
              </div>
            )}
          </div>
        </div>
        </InteractiveCourseWrapper>
        </VoiceSettingsProvider>
      </ErrorBoundary>
    );
  }

  // Individual lesson view
  const lesson = lessons.find(l => l.id === currentLesson);
  if (!lesson) return null;

  const LessonComponent = lesson.component;
  const hasNext = currentLesson < lessons.length;

  return (
    <ErrorBoundary fallback={CourseFallback}>
      <VoiceSettingsProvider>
        <InteractiveCourseWrapper
          courseId={courseId}
          courseTitle={courseTitle}
          currentLesson={currentLesson}
          totalLessons={lessons.length}
        >
        <div 
          className="min-h-screen relative"
          style={{
            backgroundImage: `url(${neurodiversityBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          }}
        >
          {/* Lesson Header */}
          <div className="bg-card/95 backdrop-blur-sm border-b sticky top-0 z-20 relative">
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
          <div className="container mx-auto px-4 py-8 relative z-10">
            <InteractiveLessonWrapper
              courseId={courseId}
              lessonId={currentLesson}
              lessonTitle={lesson.title}
              onComplete={() => handleLessonComplete(currentLesson)}
              onNext={hasNext ? handleNextLesson : undefined}
              hasNext={hasNext}
              totalLessons={lessons.length}
            >
              <LessonComponent />
            </InteractiveLessonWrapper>
          </div>
        </div>
        </InteractiveCourseWrapper>
      </VoiceSettingsProvider>
    </ErrorBoundary>
  );
};

export default InteractiveNeurodiversityCoursePage;