import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InteractiveCourseWrapper } from '@/components/course/InteractiveCourseWrapper';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Award, ChevronLeft, ChevronRight, PenTool } from 'lucide-react';
import CourseHeader from '@/components/course/CourseHeader';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';
import CourseOverviewTTS from '@/components/course/CourseOverviewTTS';
import empoweringHandwritingBg from '@/assets/empowering-handwriting-bg.jpg';

// Import lesson components
import { HandwritingIntroductionLesson } from '@/components/course/handwriting-lessons/HandwritingIntroductionLesson';
import { HandwritingOptimalLearningStateLesson } from '@/components/course/handwriting-lessons/HandwritingOptimalLearningStateLesson';
import { HandwritingTechniqueLesson } from '@/components/course/handwriting-lessons/HandwritingTechniqueLesson';
import { HandwritingConclusionLesson } from '@/components/course/handwriting-lessons/HandwritingConclusionLesson';
import { HandwritingScienceLesson } from '@/components/course/handwriting-lessons/HandwritingScienceLesson';
import { HandwritingOptimalStateLesson } from '@/components/course/handwriting-lessons/HandwritingOptimalStateLesson';
import { HandwritingEmulationLesson } from '@/components/course/handwriting-lessons/HandwritingEmulationLesson';
import { HandwritingBeyondLesson } from '@/components/course/handwriting-lessons/HandwritingBeyondLesson';
import { HandwritingQuizLesson } from '@/components/course/handwriting-lessons/HandwritingQuizLesson';
import { HandwritingFinalTestLesson } from '@/components/course/handwriting-lessons/HandwritingFinalTestLesson';

interface Lesson {
  id: number;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  unit: string;
  unitColor: string;
}

const lessons: Lesson[] = [
  { id: 1, title: "Introduction", description: "Welcome to handwriting mastery and your learning journey", component: HandwritingIntroductionLesson, unit: "Getting Started", unitColor: "bg-blue-100 text-blue-700" },
  { id: 2, title: "The Optimal Learning State", description: "Prepare your mind and body for effective handwriting practice", component: HandwritingOptimalLearningStateLesson, unit: "Foundation Skills", unitColor: "bg-green-100 text-green-700" },
  { id: 3, title: "Core Handwriting Techniques", description: "Master essential grip, posture, and letter formation principles", component: HandwritingTechniqueLesson, unit: "Foundation Skills", unitColor: "bg-green-100 text-green-700" },
  { id: 4, title: "Celebrating Your Progress", description: "Acknowledge your achievements and plan continued growth", component: HandwritingConclusionLesson, unit: "Foundation Skills", unitColor: "bg-green-100 text-green-700" },
  { id: 5, title: "The Science of Handwriting", description: "Understanding the neuroscience behind motor skill development", component: HandwritingScienceLesson, unit: "Deep Dive: Advanced Learning", unitColor: "bg-purple-100 text-purple-700" },
  { id: 6, title: "Maintaining Your Optimal State", description: "Sustaining peak performance in daily writing practice", component: HandwritingOptimalStateLesson, unit: "Deep Dive: Advanced Learning", unitColor: "bg-purple-100 text-purple-700" },
  { id: 7, title: "Learning Through Emulation", description: "Developing skills through careful observation and practice", component: HandwritingEmulationLesson, unit: "Deep Dive: Advanced Learning", unitColor: "bg-purple-100 text-purple-700" },
  { id: 8, title: "Beyond Basic Handwriting", description: "Advanced applications and personal style development", component: HandwritingBeyondLesson, unit: "Deep Dive: Advanced Learning", unitColor: "bg-purple-100 text-purple-700" },
  { id: 9, title: "Knowledge Quiz", description: "Test your understanding of handwriting principles", component: HandwritingQuizLesson, unit: "Assessment & Review", unitColor: "bg-gray-100 text-gray-700" },
  { id: 10, title: "Final Assessment", description: "Comprehensive evaluation of your handwriting skills", component: HandwritingFinalTestLesson, unit: "Assessment & Review", unitColor: "bg-gray-100 text-gray-700" }
];

export const EmpoweringLearningHandwritingCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [currentLesson, setCurrentLesson] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  // Load completed lessons from localStorage on mount
  useEffect(() => {
    const storageKey = 'handwriting-course-completed-lessons';
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCompletedLessons(parsed);
        console.log('✍️ Loaded completed handwriting lessons:', parsed);
      } catch (error) {
        console.warn('Failed to parse stored progress:', error);
      }
    }
  }, []);

  // Save completed lessons to localStorage whenever it changes
  useEffect(() => {
    if (completedLessons.length > 0) {
      const storageKey = 'handwriting-course-completed-lessons';
      localStorage.setItem(storageKey, JSON.stringify(completedLessons));
      console.log('💾 Saved completed handwriting lessons:', completedLessons);
    }
  }, [completedLessons]);

  useEffect(() => {
    if (lessonId) {
      const lesson = parseInt(lessonId);
      if (lesson >= 1 && lesson <= lessons.length) {
        setCurrentLesson(lesson);
      }
    }
  }, [lessonId]);

  const handleLessonComplete = (lessonId: number) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons(prev => [...prev, lessonId]);
    }
  };

  // Memoize navigation handlers to prevent unnecessary re-renders
  const handleNextLesson = useCallback(() => {
    if (currentLesson !== null && currentLesson < lessons.length) {
      const nextLesson = currentLesson + 1;
      setCurrentLesson(nextLesson);
      navigate(`/courses/empowering-learning-handwriting/${nextLesson}`);
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigate]);

  const handlePrevLesson = useCallback(() => {
    if (currentLesson !== null && currentLesson > 1) {
      const prevLesson = currentLesson - 1;
      setCurrentLesson(prevLesson);
      navigate(`/courses/empowering-learning-handwriting/${prevLesson}`);
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigate]);

  const handleLessonSelect = useCallback((lessonId: number) => {
    setCurrentLesson(lessonId);
    navigate(`/courses/empowering-learning-handwriting/${lessonId}`);
  }, [navigate]);

  const handleBackToCourses = useCallback(() => {
    navigate('/dashboard/learner/courses');
  }, [navigate]);

  const handleDashboard = () => {
    navigate('/dashboard/learner');
  };

  // Memoize expensive calculations - Allow access to all lessons or sequential progression
  const isLessonAccessible = useCallback((lessonId: number) => {
    // For debugging/testing: uncomment the next line to unlock all lessons
    // return true;
    
    // Sequential progression: lesson 1 is always accessible, others need previous lesson completed
    return lessonId === 1 || completedLessons.includes(lessonId - 1);
  }, [completedLessons]);

  const progress = useMemo(() => (completedLessons.length / lessons.length) * 100, [completedLessons.length]);

  // Course overview (lesson selection)
  if (currentLesson === null) {
    return (
      <VoiceSettingsProvider>
        <InteractiveCourseWrapper
          courseId="empowering-learning-handwriting"
          courseTitle="Empowering Learning: Handwriting"
          currentLesson={currentLesson}
          totalLessons={lessons.length}
        >
          <div 
            className="min-h-screen bg-gradient-to-br from-background to-muted/20"
            style={{
              backgroundImage: `url(${empoweringHandwritingBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }}
          >
            {/* Background overlay */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
            
            <CourseHeader 
              onDashboard={handleDashboard} 
              onBackToCourses={handleBackToCourses}
              courseTitle="Empowering Learning: Handwriting"
            />
          
            <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
              {/* Course Title and Description */}
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">Empowering Learning: Handwriting</h1>
                <p className="text-xl text-white/90 max-w-3xl mx-auto drop-shadow-md">
                  Master handwriting techniques through systematic practice and understanding. 
                  Develop fluency, readability, and confidence in written communication.
                </p>
                
                {/* Course badges */}
                <div className="flex justify-center gap-4 flex-wrap">
                  <Badge variant="outline" className="text-sm px-3 py-1 bg-white/90 text-gray-900 border-white/50">
                    <PenTool className="w-4 h-4 mr-2" />
                    {lessons.length} Lessons
                  </Badge>
                  <Badge variant="outline" className="text-sm px-3 py-1 bg-white/90 text-gray-900 border-white/50">
                    <Clock className="w-4 h-4 mr-2" />
                    ~3 Hours
                  </Badge>
                  <Badge variant="outline" className="text-sm px-3 py-1 bg-white/90 text-gray-900 border-white/50">
                    <Users className="w-4 h-4 mr-2" />
                    Beginner
                  </Badge>
                </div>

                <div className="max-w-md mx-auto">
                  <Progress value={progress} className="h-2 mb-2" />
                  <p className="text-xs text-white/80 mt-1 text-center drop-shadow-sm">
                    {completedLessons.length} of {lessons.length} lessons completed
                  </p>
                </div>
              </div>

              {/* Voice Controls */}
              <div className="mb-8">
                <CourseOverviewTTS 
                  courseTitle="Empowering Learning: Handwriting"
                  courseDescription="Master handwriting techniques through systematic practice and understanding. Develop fluency, readability, and confidence in written communication."
                  lessons={lessons}
                />
              </div>

              {/* Lessons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {lessons.map((lesson) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const isAccessible = isLessonAccessible(lesson.id);

                  return (
                    <Card 
                      key={lesson.id}
                      className={`relative transition-all duration-200 cursor-pointer hover:shadow-xl ${
                        !isAccessible ? 'opacity-50 cursor-not-allowed bg-white/90 backdrop-blur-sm border-white/50 shadow-lg' : 
                        isCompleted ? 'bg-white/95 backdrop-blur-sm border-white/50 shadow-lg border-primary/50' : 
                        'bg-white/90 backdrop-blur-sm border-white/50 shadow-lg'
                      }`}
                      onClick={() => {
                        if (isAccessible) {
                          setCurrentLesson(lesson.id);
                        } else {
                          console.log('✍️ Lesson not accessible yet - complete previous lesson first');
                        }
                      }}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              isCompleted 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {isCompleted ? <Award className="w-5 h-5" /> : <PenTool className="w-5 h-5" />}
                            </div>
                            <div>
                              <Badge className={lesson.unitColor}>
                                Lesson {lesson.id}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <CardTitle className="text-lg mt-2 text-gray-900">{lesson.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 mb-4">{lesson.description}</p>
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline" className={lesson.unitColor}>
                            {lesson.unit}
                          </Badge>
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isAccessible) {
                              setCurrentLesson(lesson.id);
                            }
                          }}
                          disabled={!isAccessible}
                        >
                          {isCompleted ? 'Review Lesson' : 'Start Lesson'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </InteractiveCourseWrapper>
      </VoiceSettingsProvider>
    );
  }

  // Individual lesson view
  const currentLessonData = lessons.find(l => l.id === currentLesson);
  
  if (!currentLessonData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Lesson Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The requested lesson could not be found.
            </p>
            <Button onClick={() => navigate('/courses/empowering-learning-handwriting')}>
              Back to Course Overview
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasNext = currentLesson < lessons.length;
  const hasPrev = currentLesson > 1;
  const LessonComponent = currentLessonData.component;

  return (
    <VoiceSettingsProvider>
      <InteractiveCourseWrapper 
        courseId="empowering-learning-handwriting"
        courseTitle="Empowering Learning: Handwriting"
        currentLesson={currentLesson}
        totalLessons={lessons.length}
      >
        <div className="min-h-screen bg-background">
          <CourseHeader 
            onBackToCourses={() => navigate('/courses/empowering-learning-handwriting')}
            onDashboard={handleDashboard}
            courseTitle="Empowering Learning: Handwriting"
          />
          
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/courses/empowering-learning-handwriting')}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Overview
              </Button>
              <Badge className={currentLessonData.unitColor}>
                {currentLessonData.unit}
              </Badge>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mb-6">
              <Button
                variant="outline"
                onClick={handlePrevLesson}
                disabled={!hasPrev}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous Lesson
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Lesson {currentLesson} of {lessons.length}
                </span>
              </div>

              <Button
                variant="outline"
                onClick={handleNextLesson}
                disabled={!hasNext}
                className="flex items-center gap-2"
              >
                Next Lesson
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Lesson Content */}
            <LessonComponent onComplete={() => handleLessonComplete(currentLesson)} />
          </div>
        </div>
      </InteractiveCourseWrapper>
    </VoiceSettingsProvider>
  );
};

export default EmpoweringLearningHandwritingCoursePage;