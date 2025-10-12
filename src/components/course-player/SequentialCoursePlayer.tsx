/**
 * Sequential Course Player
 * 
 * Renders courses using the "Sequential Learning Framework" (Framework 1)
 * - Linear lesson-by-lesson progression
 * - Simple state management
 * - Standard TTS integration
 * - Progress tracking
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useContextAwareNavigation } from '@/hooks/useContextAwareNavigation';
import { useCourseNavigation } from '@/hooks/useCourseNavigation';
import { InteractiveCourseWrapper } from '@/components/course/InteractiveCourseWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import CourseHeader from '@/components/course/CourseHeader';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';
import { StandardCourseAudioSection } from '@/components/course/StandardCourseAudioSection';
import { StandardLessonAudioButtons } from '@/components/course/StandardLessonAudioButtons';
import { AdditionalResourcesSection } from '@/components/course/resources/AdditionalResourcesSection';
import { CourseOverviewAccordion } from '@/components/course/resources/CourseOverviewAccordion';
import { CourseLesson } from '@/types/course';

interface SequentialCoursePlayerProps {
  courseId: string;
  courseTitle: string;
  courseDescription: string;
  lessons: CourseLesson[];
  backgroundImage?: string;
  estimatedHours?: number;
  difficultyLevel?: string;
}

export const SequentialCoursePlayer: React.FC<SequentialCoursePlayerProps> = ({
  courseId,
  courseTitle,
  courseDescription,
  lessons,
  backgroundImage,
  estimatedHours = 4,
  difficultyLevel = 'Beginner'
}) => {
  const { goToCourses, goToDashboard } = useContextAwareNavigation();
  const { navigateToLesson, navigateToOverview } = useCourseNavigation(courseId);
  const { lessonId } = useParams();
  const [currentLesson, setCurrentLesson] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  // Load completed lessons from localStorage on mount
  useEffect(() => {
    const storageKey = `${courseId}-completed-lessons`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCompletedLessons(parsed);
        console.log(`📚 [${courseId}] Loaded completed lessons:`, parsed);
      } catch (error) {
        console.warn('Failed to parse stored progress:', error);
      }
    }
  }, [courseId]);

  // Save completed lessons to localStorage whenever it changes
  useEffect(() => {
    if (completedLessons.length > 0) {
      const storageKey = `${courseId}-completed-lessons`;
      localStorage.setItem(storageKey, JSON.stringify(completedLessons));
      console.log(`💾 [${courseId}] Saved completed lessons:`, completedLessons);
    }
  }, [completedLessons, courseId]);

  useEffect(() => {
    if (lessonId) {
      const lesson = parseInt(lessonId);
      if (lesson >= 1 && lesson <= lessons.length) {
        setCurrentLesson(lesson);
      }
    } else {
      setCurrentLesson(null);
    }
  }, [lessonId, lessons.length]);

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
      navigateToLesson(nextLesson);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigateToLesson, lessons.length]);

  const handlePrevLesson = useCallback(() => {
    if (currentLesson !== null && currentLesson > 1) {
      const prevLesson = currentLesson - 1;
      setCurrentLesson(prevLesson);
      navigateToLesson(prevLesson);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigateToLesson]);

  const handleLessonSelect = useCallback((lessonId: number) => {
    setCurrentLesson(lessonId);
    navigateToLesson(lessonId);
  }, [navigateToLesson]);

  const handleBackToCourseOverview = useCallback(() => {
    setCurrentLesson(null);
    navigateToOverview();
  }, [navigateToOverview]);

  const isLessonAccessible = useCallback((lessonId: number) => {
    return lessonId === 1 || completedLessons.includes(lessonId - 1);
  }, [completedLessons]);

  const progress = useMemo(() => (completedLessons.length / lessons.length) * 100, [completedLessons.length, lessons.length]);

  // Course overview (lesson selection)
  if (currentLesson === null) {
    return (
      <VoiceSettingsProvider>
        <InteractiveCourseWrapper
          courseId={courseId}
          courseTitle={courseTitle}
          currentLesson={currentLesson}
          totalLessons={lessons.length}
        >
          <div 
            className="min-h-screen bg-gradient-to-br from-background to-muted/20"
            style={backgroundImage ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            } : {}}
          >
            {backgroundImage && <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />}
            
            <CourseHeader courseTitle={courseTitle} />
          
            <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">{courseTitle}</h1>
                <p className="text-xl text-white/90 max-w-3xl mx-auto drop-shadow-md">
                  {courseDescription}
                </p>
                
                <div className="flex justify-center gap-4 flex-wrap">
                  <Badge variant="outline" className="text-sm px-3 py-1 bg-white/90 text-gray-900 border-white/50">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {lessons.length} Lessons
                  </Badge>
                  <Badge variant="outline" className="text-sm px-3 py-1 bg-white/90 text-gray-900 border-white/50">
                    <Clock className="w-4 h-4 mr-2" />
                    ~{estimatedHours} Hours
                  </Badge>
                  <Badge variant="outline" className="text-sm px-3 py-1 bg-white/90 text-gray-900 border-white/50">
                    <Users className="w-4 h-4 mr-2" />
                    {difficultyLevel}
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
                  courseTitle={courseTitle}
                  courseDescription={courseDescription}
                />
              </div>

              <div className="mb-8">
                <StandardLessonAudioButtons lessons={lessons} />
              </div>

              <AdditionalResourcesSection title="Additional Course Resources">
                <CourseOverviewAccordion
                  whyMasterContent={{
                    title: "Why Take This Course?",
                    description: courseDescription
                  }}
                  whatYouMasterContent={{
                    title: "What You'll Learn",
                    objectives: lessons.slice(0, 4).map(lesson => ({
                      title: lesson.title,
                      description: lesson.description
                    }))
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
                          handleLessonSelect(lesson.id);
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
                              {isCompleted ? <Award className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
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
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isAccessible) {
                              handleLessonSelect(lesson.id);
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
        courseId={courseId}
        courseTitle={courseTitle}
        currentLesson={currentLesson}
        totalLessons={lessons.length}
      >
        <div 
          className="min-h-screen bg-gradient-to-br from-background to-muted/20"
          style={backgroundImage ? {
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          } : {}}
        >
          {backgroundImage && <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />}
          
          <CourseHeader courseTitle={courseTitle} />
          
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

            <div className="flex justify-between items-center mb-6">
              <Button
                variant="outline"
                onClick={handlePrevLesson}
                disabled={!hasPrev}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="text-center">
                <h2 className="text-2xl font-bold">Lesson {currentLesson}</h2>
                <p className="text-sm text-muted-foreground">{currentLessonData.title}</p>
              </div>
              
              <Button
                variant="outline"
                onClick={handleNextLesson}
                disabled={!hasNext}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

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
