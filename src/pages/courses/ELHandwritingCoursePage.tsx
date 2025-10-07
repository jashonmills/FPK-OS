import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useContextAwareNavigation } from '@/hooks/useContextAwareNavigation';
import { InteractiveCourseWrapper } from '@/components/course/InteractiveCourseWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Award, PenTool, ChevronLeft, ChevronRight } from 'lucide-react';
import elHandwritingBg from '@/assets/el-handwriting-bg.jpg';
import CourseHeader from '@/components/course/CourseHeader';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';
import { StandardCourseAudioSection } from '@/components/course/StandardCourseAudioSection';
import { StandardLessonAudioButtons } from '@/components/course/StandardLessonAudioButtons';
import { AdditionalResourcesSection } from '@/components/course/resources/AdditionalResourcesSection';
import { CourseOverviewAccordion } from '@/components/course/resources/CourseOverviewAccordion';

// Import lesson components
import { ELHandwritingIntroductionLesson } from '@/components/course/el-handwriting-lessons/ELHandwritingIntroductionLesson';
import { ELHandwritingOptimalStateLesson } from '@/components/course/el-handwriting-lessons/ELHandwritingOptimalStateLesson';
import { ELHandwritingTechniqueLesson } from '@/components/course/el-handwriting-lessons/ELHandwritingTechniqueLesson';
import { ELHandwritingConclusionLesson } from '@/components/course/el-handwriting-lessons/ELHandwritingConclusionLesson';
import { ELHandwritingScienceDeepDiveLesson } from '@/components/course/el-handwriting-lessons/ELHandwritingScienceDeepDiveLesson';
import { ELHandwritingOptimalStateDeepDiveLesson } from '@/components/course/el-handwriting-lessons/ELHandwritingOptimalStateDeepDiveLesson';
import { ELHandwritingEmulationDeepDiveLesson } from '@/components/course/el-handwriting-lessons/ELHandwritingEmulationDeepDiveLesson';
import { ELHandwritingBeyondDeepDiveLesson } from '@/components/course/el-handwriting-lessons/ELHandwritingBeyondDeepDiveLesson';
import { ELHandwritingFinalTestLesson } from '@/components/course/el-handwriting-lessons/ELHandwritingFinalTestLesson';

import { CourseLesson } from '@/types/course';

const lessons: CourseLesson[] = [
  { id: 1, title: "Introduction", description: "Welcome to the Empowering Learning for Handwriting programme", component: ELHandwritingIntroductionLesson, unit: "Main Course", unitColor: "bg-blue-100 text-blue-700" },
  { id: 2, title: "The Optimal Learning State", description: "Get grounded using techniques from the Learning State programme", component: ELHandwritingOptimalStateLesson, unit: "Main Course", unitColor: "bg-blue-100 text-blue-700" },
  { id: 3, title: "The Technique", description: "Learn the handwriting emulation technique with interactive practice", component: ELHandwritingTechniqueLesson, unit: "Main Course", unitColor: "bg-blue-100 text-blue-700" },
  { id: 4, title: "Conclusion", description: "Wrap up and continue your handwriting journey", component: ELHandwritingConclusionLesson, unit: "Main Course", unitColor: "bg-blue-100 text-blue-700" },
  { id: 5, title: "The Science of Learning", description: "Understanding the neuroscience behind handwriting development", component: ELHandwritingScienceDeepDiveLesson, unit: "Deep Dive", unitColor: "bg-purple-100 text-purple-700" },
  { id: 6, title: "Optimal Learning State Techniques", description: "Advanced state management for effective practice", component: ELHandwritingOptimalStateDeepDiveLesson, unit: "Deep Dive", unitColor: "bg-purple-100 text-purple-700" },
  { id: 7, title: "The Art and Science of Emulation", description: "Mirror neurons and observational learning principles", component: ELHandwritingEmulationDeepDiveLesson, unit: "Deep Dive", unitColor: "bg-purple-100 text-purple-700" },
  { id: 8, title: "Beyond Handwriting", description: "Universal learning principles for lifelong development", component: ELHandwritingBeyondDeepDiveLesson, unit: "Deep Dive", unitColor: "bg-purple-100 text-purple-700" },
  { id: 9, title: "Final Test", description: "Comprehensive assessment of core principles", component: ELHandwritingFinalTestLesson, unit: "Assessment", unitColor: "bg-gray-100 text-gray-700" }
];

const ELHandwritingCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const { goToCourses, goToDashboard } = useContextAwareNavigation();
  const { lessonId } = useParams();
  const [currentLesson, setCurrentLesson] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  // Load completed lessons from localStorage on mount
  useEffect(() => {
    const storageKey = 'el-handwriting-course-completed-lessons';
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCompletedLessons(parsed);
        console.log('✍️ Loaded completed EL handwriting lessons:', parsed);
      } catch (error) {
        console.warn('Failed to parse stored progress:', error);
      }
    }
  }, []);

  // Save completed lessons to localStorage whenever it changes
  useEffect(() => {
    if (completedLessons.length > 0) {
      const storageKey = 'el-handwriting-course-completed-lessons';
      localStorage.setItem(storageKey, JSON.stringify(completedLessons));
      console.log('💾 Saved completed EL handwriting lessons:', completedLessons);
    }
  }, [completedLessons]);

  useEffect(() => {
    if (lessonId) {
      const lesson = parseInt(lessonId);
      if (lesson >= 1 && lesson <= lessons.length) {
        setCurrentLesson(lesson);
      }
    } else {
      setCurrentLesson(null);
    }
  }, [lessonId]);

  const handleLessonComplete = (lessonId: number) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons(prev => [...prev, lessonId]);
      
      // Auto-advance to next lesson if available
      if (currentLesson !== null && currentLesson < lessons.length) {
        setTimeout(() => {
          handleNextLesson();
        }, 500);
      }
    }
  };

  const handleNextLesson = useCallback(() => {
    if (currentLesson !== null && currentLesson < lessons.length) {
      const nextLesson = currentLesson + 1;
      setCurrentLesson(nextLesson);
      navigate(`/courses/el-handwriting/${nextLesson}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigate]);

  const handlePrevLesson = useCallback(() => {
    if (currentLesson !== null && currentLesson > 1) {
      const prevLesson = currentLesson - 1;
      setCurrentLesson(prevLesson);
      navigate(`/courses/el-handwriting/${prevLesson}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigate]);

  const handleLessonSelect = useCallback((lessonId: number) => {
    setCurrentLesson(lessonId);
    const orgParam = new URLSearchParams(window.location.search).get('org');
    const url = orgParam 
      ? `/courses/el-handwriting/${lessonId}?org=${orgParam}`
      : `/courses/el-handwriting/${lessonId}`;
    navigate(url);
  }, [navigate]);

  const handleBackToCourses = useCallback(() => {
    goToCourses();
  }, [goToCourses]);

  const handleBackToCourseOverview = useCallback(() => {
    setCurrentLesson(null);
    const orgParam = new URLSearchParams(window.location.search).get('org');
    const url = orgParam 
      ? `/courses/el-handwriting?org=${orgParam}`
      : '/courses/el-handwriting';
    navigate(url);
  }, [navigate]);

  const handleDashboard = useCallback(() => {
    goToDashboard();
  }, [goToDashboard]);

  const isLessonAccessible = useCallback((lessonId: number) => {
    return lessonId === 1 || completedLessons.includes(lessonId - 1);
  }, [completedLessons]);

  const progress = useMemo(() => (completedLessons.length / lessons.length) * 100, [completedLessons.length]);

  // Course overview (lesson selection)
  if (currentLesson === null) {
    return (
      <VoiceSettingsProvider>
        <InteractiveCourseWrapper
          courseId="el-handwriting"
          courseTitle="EL Handwriting"
          currentLesson={currentLesson}
          totalLessons={lessons.length}
        >
          <div 
            className="min-h-screen bg-gradient-to-br from-background to-muted/20"
            style={{
              backgroundImage: `url(${elHandwritingBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }}
          >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
            
            <CourseHeader 
              courseTitle="EL Handwriting"
            />
          
            <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">EL Handwriting</h1>
                <p className="text-xl text-white/90 max-w-3xl mx-auto drop-shadow-md">
                  A new perspective on learning handwriting through emulation and deliberate practice.
                </p>
                
                <div className="flex justify-center gap-4 flex-wrap">
                  <Badge variant="outline" className="text-sm px-3 py-1 bg-white/90 text-gray-900 border-white/50">
                    <PenTool className="w-4 h-4 mr-2" />
                    {lessons.length} Lessons
                  </Badge>
                  <Badge variant="outline" className="text-sm px-3 py-1 bg-white/90 text-gray-900 border-white/50">
                    <Clock className="w-4 h-4 mr-2" />
                    ~4 Hours
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

              <div className="mb-8">
                <StandardCourseAudioSection
                  courseTitle="EL Handwriting"
                  courseDescription="A new perspective on learning handwriting through emulation and deliberate practice."
                />
              </div>

              <div className="mb-8">
                <StandardLessonAudioButtons lessons={lessons} />
              </div>

              <AdditionalResourcesSection title="Additional Course Resources">
                <CourseOverviewAccordion
                  whyMasterContent={{
                    title: "Why Learn This Approach?",
                    description: "This course introduces a unique handwriting method based on observation and emulation. Learn to improve handwriting through systematic visual modeling and practice."
                  }}
                  whatYouMasterContent={{
                    title: "What You'll Master",
                    objectives: [
                      {
                        title: "Visual Emulation Technique",
                        description: "Learn to model excellent handwriting examples"
                      },
                      {
                        title: "Optimal Learning States",
                        description: "Apply grounding techniques for focused practice"
                      },
                      {
                        title: "Observational Learning",
                        description: "Understand the science behind skill acquisition"
                      },
                      {
                        title: "Deliberate Practice",
                        description: "Build lasting improvement through consistent effort"
                      }
                    ]
                  }}
                />
              </AdditionalResourcesSection>

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
            <Button onClick={() => setCurrentLesson(null)}>
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
        courseId="el-handwriting"
        courseTitle="EL Handwriting"
        currentLesson={currentLesson}
        totalLessons={lessons.length}
      >
        <div 
          className="min-h-screen bg-gradient-to-br from-background to-muted/20"
          style={{
            backgroundImage: `url(${elHandwritingBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          {/* Background overlay */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
          
          <CourseHeader 
            courseTitle="EL Handwriting"
          />
          
          <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
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
            <LessonComponent 
              onComplete={() => handleLessonComplete(currentLesson)}
              onNext={hasNext ? handleNextLesson : undefined}
              hasNext={hasNext}
              lessonId={currentLesson}
              lessonTitle={currentLessonData.title}
              totalLessons={lessons.length}
            />
          </div>
        </div>
      </InteractiveCourseWrapper>
    </VoiceSettingsProvider>
  );
};

export default ELHandwritingCoursePage;