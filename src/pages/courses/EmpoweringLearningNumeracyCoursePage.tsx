import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InteractiveCourseWrapper } from '@/components/course/InteractiveCourseWrapper';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Award, ChevronLeft, ChevronRight, Calculator } from 'lucide-react';
import CourseHeader from '@/components/course/CourseHeader';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';
import CourseOverviewTTS from '@/components/course/CourseOverviewTTS';
import empoweringNumeracyBg from '@/assets/empowering-numeracy-bg.jpg';
import { NumeracyCourseWrapper } from '@/components/course/NumeracyCourseWrapper';

// Import lesson components
import { NumeracyIntroductionLesson } from '@/components/course/numeracy-lessons/NumeracyIntroductionLesson';
import { NumeracyOptimalLearningStateLesson } from '@/components/course/numeracy-lessons/NumeracyOptimalLearningStateLesson';
import { NumeracyNumberShapesLesson } from '@/components/course/numeracy-lessons/NumeracyNumberShapesLesson';
import { NumeracyTechniqueLesson } from '@/components/course/numeracy-lessons/NumeracyTechniqueLesson';
import { NumeracyConclusionLesson } from '@/components/course/numeracy-lessons/NumeracyConclusionLesson';
import { NumeracyIntentionalityLesson } from '@/components/course/numeracy-lessons/NumeracyIntentionalityLesson';
import { NumeracyScienceLesson } from '@/components/course/numeracy-lessons/NumeracyScienceLesson';
import { NumeracyHistoryLesson } from '@/components/course/numeracy-lessons/NumeracyHistoryLesson';
import { NumeracyTriangleLesson } from '@/components/course/numeracy-lessons/NumeracyTriangleLesson';
import { NumeracyBeyondLesson } from '@/components/course/numeracy-lessons/NumeracyBeyondLesson';
import { NumeracyQuizLesson } from '@/components/course/numeracy-lessons/NumeracyQuizLesson';
import { NumeracyFinalTestLesson } from '@/components/course/numeracy-lessons/NumeracyFinalTestLesson';

interface Lesson {
  id: number;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  unit: string;
  unitColor: string;
}

const lessons: Lesson[] = [
  { id: 1, title: "Introduction", description: "A new perspective on learning mathematics", component: NumeracyIntroductionLesson, unit: "Welcome to the Programme", unitColor: "bg-blue-100 text-blue-700" },
  { id: 2, title: "The Optimal Learning State", description: "Calm your nervous system for effective learning", component: NumeracyOptimalLearningStateLesson, unit: "The Learning Process", unitColor: "bg-green-100 text-green-700" },
  { id: 3, title: "Why Numbers Are Shaped The Way They Are", description: "Understanding number symbols and their visual meaning", component: NumeracyNumberShapesLesson, unit: "The Learning Process", unitColor: "bg-green-100 text-green-700" },
  { id: 4, title: "The Number Triangle Technique", description: "Visual method for understanding mathematical operations", component: NumeracyTechniqueLesson, unit: "The Learning Process", unitColor: "bg-green-100 text-green-700" },
  { id: 5, title: "Conclusion", description: "Celebrating your mathematical journey and next steps", component: NumeracyConclusionLesson, unit: "Final Tips for Success", unitColor: "bg-yellow-100 text-yellow-700" },
  { id: 6, title: "The Power of Intentionality", description: "Understanding focused practice in mathematics", component: NumeracyIntentionalityLesson, unit: "Deep Dive: Extended Learning", unitColor: "bg-purple-100 text-purple-700" },
  { id: 7, title: "The Science of Learning", description: "How nervous system states affect mathematical thinking", component: NumeracyScienceLesson, unit: "Deep Dive: Extended Learning", unitColor: "bg-purple-100 text-purple-700" },
  { id: 8, title: "The History of Numbers", description: "Historical context of numerical systems", component: NumeracyHistoryLesson, unit: "Deep Dive: Extended Learning", unitColor: "bg-purple-100 text-purple-700" },
  { id: 9, title: "The Number Triangle Technique", description: "Advanced applications of visual mathematics", component: NumeracyTriangleLesson, unit: "Deep Dive: Extended Learning", unitColor: "bg-purple-100 text-purple-700" },
  { id: 10, title: "Beyond Numeracy", description: "Building lifelong mathematical thinking habits", component: NumeracyBeyondLesson, unit: "Deep Dive: Extended Learning", unitColor: "bg-purple-100 text-purple-700" },
  { id: 11, title: "Mini Quiz Questions", description: "Test your understanding with focused questions", component: NumeracyQuizLesson, unit: "Study Guide & Review", unitColor: "bg-gray-100 text-gray-700" },
  { id: 12, title: "Final Knowledge Test", description: "Comprehensive assessment of mathematical principles", component: NumeracyFinalTestLesson, unit: "Study Guide & Review", unitColor: "bg-gray-100 text-gray-700" }
];

export const EmpoweringLearningNumeracyCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [currentLesson, setCurrentLesson] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  // Load completed lessons from localStorage on mount
  useEffect(() => {
    const storageKey = 'numeracy-course-completed-lessons';
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCompletedLessons(parsed);
        console.log('🔢 Loaded completed numeracy lessons:', parsed);
      } catch (error) {
        console.warn('Failed to parse stored progress:', error);
      }
    }
  }, []);

  // Save completed lessons to localStorage whenever it changes
  useEffect(() => {
    if (completedLessons.length > 0) {
      const storageKey = 'numeracy-course-completed-lessons';
      localStorage.setItem(storageKey, JSON.stringify(completedLessons));
      console.log('💾 Saved completed numeracy lessons:', completedLessons);
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
      navigate(`/courses/empowering-learning-numeracy/${nextLesson}`);
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigate]);

  const handlePrevLesson = useCallback(() => {
    if (currentLesson !== null && currentLesson > 1) {
      const prevLesson = currentLesson - 1;
      setCurrentLesson(prevLesson);
      navigate(`/courses/empowering-learning-numeracy/${prevLesson}`);
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigate]);

  const handleLessonSelect = useCallback((lessonId: number) => {
    setCurrentLesson(lessonId);
    navigate(`/courses/empowering-learning-numeracy/${lessonId}`);
  }, [navigate]);

  const handleBackToCourses = useCallback(() => {
    navigate('/dashboard/learner/courses');
  }, [navigate]);

  const handleBackToCourseOverview = useCallback(() => {
    navigate('/courses/empowering-learning-numeracy');
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
          courseId="empowering-learning-numeracy"
          courseTitle="Empowering Learning for Numeracy"
          currentLesson={currentLesson}
          totalLessons={lessons.length}
        >
          <div 
            className="min-h-screen bg-gradient-to-br from-background to-muted/20"
            style={{
              backgroundImage: `url(${empoweringNumeracyBg})`,
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
              courseTitle="Empowering Learning for Numeracy"
            />
          
            <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
              {/* Course Title and Description */}
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">Empowering Learning for Numeracy</h1>
                <p className="text-xl text-white/90 max-w-3xl mx-auto drop-shadow-md">
                  Master mathematics through visual memory techniques and number triangles. Learn addition, subtraction, multiplication and division using proven visual learning methods.
                </p>
                
                {/* Course badges */}
                <div className="flex justify-center gap-4 flex-wrap">
                  <Badge variant="outline" className="text-sm px-3 py-1 bg-white/90 text-gray-900 border-white/50">
                    <Calculator className="w-4 h-4 mr-2" />
                    {lessons.length} Lessons
                  </Badge>
                  <Badge variant="outline" className="text-sm px-3 py-1 bg-white/90 text-gray-900 border-white/50">
                    <Clock className="w-4 h-4 mr-2" />
                    ~2 Hours
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
                  courseTitle="Empowering Learning for Numeracy"
                  courseDescription="Master mathematics through visual memory techniques and number triangles. Learn addition, subtraction, multiplication and division using proven visual learning methods."
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
                          console.log('🔢 Lesson not accessible yet - complete previous lesson first');
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
                              {isCompleted ? <Award className="w-5 h-5" /> : <Calculator className="w-5 h-5" />}
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
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
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
            <Button onClick={() => navigate('/courses/empowering-learning-numeracy')}>
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
      <NumeracyCourseWrapper
        courseId="empowering-learning-numeracy"
        courseTitle="Empowering Learning for Numeracy"
        currentLesson={currentLesson}
        totalLessons={lessons.length}
      >
        <InteractiveCourseWrapper 
          courseId="empowering-learning-numeracy"
          courseTitle="Empowering Learning for Numeracy"
          currentLesson={currentLesson}
          totalLessons={lessons.length}
        >
          <div className="min-h-screen">
            <CourseHeader 
              onBackToCourses={handleBackToCourseOverview}
              onDashboard={handleDashboard}
              courseTitle="Empowering Learning for Numeracy"
            />
            
            <div className="container mx-auto px-4 py-8 max-w-6xl">
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToCourseOverview}
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
              <InteractiveLessonWrapper
                courseId="empowering-learning-numeracy"
                lessonId={currentLesson}
                lessonTitle={currentLessonData.title}
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
      </NumeracyCourseWrapper>
    </VoiceSettingsProvider>
  );
};

export default EmpoweringLearningNumeracyCoursePage;