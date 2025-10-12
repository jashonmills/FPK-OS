/**
 * Sequential Course Shell - Master Component
 * 
 * The single source of truth for all sequential course presentation.
 * Manages both Overview and Lesson states with pixel-perfect consistency.
 * 
 * Based on the "EL Handwriting" design standard.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useContextAwareNavigation } from '@/hooks/useContextAwareNavigation';
import { InteractiveCourseWrapper } from '@/components/course/InteractiveCourseWrapper';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Award, ChevronLeft, ChevronRight, PenTool } from 'lucide-react';
import CourseHeader from '@/components/course/CourseHeader';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';
import { StandardCourseAudioSection } from '@/components/course/StandardCourseAudioSection';
import { StandardLessonAudioButtons } from '@/components/course/StandardLessonAudioButtons';
import { AdditionalResourcesSection } from '@/components/course/resources/AdditionalResourcesSection';
import { CourseOverviewAccordion } from '@/components/course/resources/CourseOverviewAccordion';
import { StandardVideoPlayer } from '@/components/course-player/StandardVideoPlayer';
import { StandardTextRenderer } from '@/components/course-player/StandardTextRenderer';
import { CourseContentManifest, LessonContentData } from '@/types/lessonContent';
import { loadCourseContent, getLessonContent } from '@/utils/courseContentLoader';

interface SequentialCourseShellProps {
  courseData: {
    id: string;
    title: string;
    description: string;
    slug: string;
    background_image?: string;
    estimated_hours?: number;
    difficulty_level?: string;
    content_version?: string;
  };
}

export const SequentialCourseShell: React.FC<SequentialCourseShellProps> = ({ courseData }) => {
  const navigate = useNavigate();
  const { goToCourses, goToDashboard } = useContextAwareNavigation();
  const { lessonId } = useParams();
  const [currentLesson, setCurrentLesson] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [manifest, setManifest] = useState<CourseContentManifest | null>(null);
  const [loading, setLoading] = useState(true);

  // Load course manifest
  useEffect(() => {
    const loadManifest = async () => {
      setLoading(true);
      const content = await loadCourseContent(courseData.slug);
      if (content) {
        setManifest(content);
      }
      setLoading(false);
    };

    loadManifest();
  }, [courseData.slug]);

  // Load completed lessons from localStorage
  useEffect(() => {
    const storageKey = `${courseData.slug}-course-completed-lessons`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCompletedLessons(parsed);
      } catch (error) {
        console.warn('Failed to parse stored progress:', error);
      }
    }
  }, [courseData.slug]);

  // Save completed lessons to localStorage
  useEffect(() => {
    if (completedLessons.length > 0) {
      const storageKey = `${courseData.slug}-course-completed-lessons`;
      localStorage.setItem(storageKey, JSON.stringify(completedLessons));
    }
  }, [completedLessons, courseData.slug]);

  // Handle lesson ID from URL
  useEffect(() => {
    if (lessonId) {
      const lesson = parseInt(lessonId);
      if (manifest && lesson >= 1 && lesson <= manifest.lessons.length) {
        setCurrentLesson(lesson);
      }
    } else {
      setCurrentLesson(null);
    }
  }, [lessonId, manifest]);

  const handleLessonComplete = useCallback((lessonId: number) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons(prev => [...prev, lessonId]);
      
      // Auto-advance to next lesson if available
      if (manifest && currentLesson !== null && currentLesson < manifest.lessons.length) {
        setTimeout(() => {
          handleNextLesson();
        }, 500);
      }
    }
  }, [completedLessons, manifest, currentLesson]);

  const handleNextLesson = useCallback(() => {
    if (manifest && currentLesson !== null && currentLesson < manifest.lessons.length) {
      const nextLesson = currentLesson + 1;
      setCurrentLesson(nextLesson);
      navigate(`/courses/${courseData.slug}/${nextLesson}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, manifest, navigate, courseData.slug]);

  const handlePrevLesson = useCallback(() => {
    if (currentLesson !== null && currentLesson > 1) {
      const prevLesson = currentLesson - 1;
      setCurrentLesson(prevLesson);
      navigate(`/courses/${courseData.slug}/${prevLesson}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigate, courseData.slug]);

  const handleLessonSelect = useCallback((lessonId: number) => {
    setCurrentLesson(lessonId);
    navigate(`/courses/${courseData.slug}/${lessonId}`);
  }, [navigate, courseData.slug]);

  const handleBackToCourseOverview = useCallback(() => {
    setCurrentLesson(null);
    navigate(`/courses/${courseData.slug}`);
  }, [navigate, courseData.slug]);

  const isLessonAccessible = useCallback((lessonId: number) => {
    return lessonId === 1 || completedLessons.includes(lessonId - 1);
  }, [completedLessons]);

  const progress = useMemo(() => {
    if (!manifest) return 0;
    return (completedLessons.length / manifest.lessons.length) * 100;
  }, [completedLessons.length, manifest]);

  if (loading || !manifest) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading course content...</p>
      </div>
    );
  }

  // ========================================
  // OVERVIEW STATE
  // ========================================
  if (currentLesson === null) {
    return (
      <VoiceSettingsProvider>
        <InteractiveCourseWrapper
          courseId={courseData.id}
          courseTitle={courseData.title}
          currentLesson={currentLesson}
          totalLessons={manifest.lessons.length}
        >
          <div 
            className="min-h-screen bg-gradient-to-br from-background to-muted/20"
            style={{
              backgroundImage: courseData.background_image ? `url(${courseData.background_image})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }}
          >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
            
            <CourseHeader courseTitle={courseData.title} />
          
            <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
              {/* Header Section */}
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">{courseData.title}</h1>
                <p className="text-xl text-white/90 max-w-3xl mx-auto drop-shadow-md">
                  {courseData.description}
                </p>
                
                {/* Course Metadata Badges */}
                <div className="flex justify-center gap-4 flex-wrap">
                  <Badge variant="outline" className="text-sm px-3 py-1 bg-white/90 text-gray-900 border-white/50">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {manifest.lessons.length} Lessons
                  </Badge>
                  {courseData.estimated_hours && (
                    <Badge variant="outline" className="text-sm px-3 py-1 bg-white/90 text-gray-900 border-white/50">
                      <Clock className="w-4 h-4 mr-2" />
                      ~{courseData.estimated_hours} Hours
                    </Badge>
                  )}
                  {courseData.difficulty_level && (
                    <Badge variant="outline" className="text-sm px-3 py-1 bg-white/90 text-gray-900 border-white/50">
                      <Users className="w-4 h-4 mr-2" />
                      {courseData.difficulty_level}
                    </Badge>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="max-w-md mx-auto">
                  <Progress value={progress} className="h-2 mb-2" />
                  <p className="text-xs text-white/80 mt-1 text-center drop-shadow-sm">
                    {completedLessons.length} of {manifest.lessons.length} lessons completed
                  </p>
                </div>
              </div>

              {/* Audio Overview Section */}
              <div className="mb-8">
                <StandardCourseAudioSection
                  courseTitle={courseData.title}
                  courseDescription={courseData.description}
                />
              </div>

              {/* Individual Lesson Audio Buttons */}
              <div className="mb-8">
                <StandardLessonAudioButtons 
                  lessons={manifest.lessons.map(lesson => ({
                    id: lesson.id,
                    title: lesson.title,
                    description: lesson.description || '',
                    unit: lesson.unit || 'Main Course',
                    unitColor: lesson.unitColor || 'bg-blue-100 text-blue-700',
                    component: () => null // Not used in v2
                  }))} 
                />
              </div>

              {/* Additional Resources Section */}
              <AdditionalResourcesSection title="Additional Course Resources">
                <CourseOverviewAccordion
                  whyMasterContent={{
                    title: "Why Learn This?",
                    description: courseData.description
                  }}
                  whatYouMasterContent={{
                    title: "What You'll Master",
                    objectives: manifest.lessons.map(lesson => ({
                      title: lesson.title,
                      description: lesson.description || ''
                    }))
                  }}
                />
              </AdditionalResourcesSection>

              {/* Lesson Grid - Progressive Disclosure */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {manifest.lessons.map((lesson) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const isAccessible = isLessonAccessible(lesson.id);
                  const isActive = !isCompleted && isAccessible && 
                    (lesson.id === 1 || completedLessons.includes(lesson.id - 1));

                  return (
                    <Card 
                      key={lesson.id}
                      className={`relative transition-all duration-200 cursor-pointer hover:shadow-xl ${
                        !isAccessible ? 'opacity-50 cursor-not-allowed bg-white/90 backdrop-blur-sm border-white/50 shadow-lg' : 
                        isCompleted ? 'bg-white/95 backdrop-blur-sm border-white/50 shadow-lg border-primary/50' : 
                        isActive ? 'bg-white/90 backdrop-blur-sm border-white/50 shadow-lg' :
                        'bg-white/70 backdrop-blur-sm border-white/40 shadow-md'
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
                              {isCompleted ? <Award className="w-5 h-5" /> : <PenTool className="w-5 h-5" />}
                            </div>
                            <div>
                              <Badge className={lesson.unitColor || 'bg-blue-100 text-blue-700'}>
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
                          <Badge variant="outline" className={lesson.unitColor || 'bg-blue-100 text-blue-700'}>
                            {lesson.unit || 'Main Course'}
                          </Badge>
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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

  // ========================================
  // LESSON STATE
  // ========================================
  const currentLessonData = getLessonContent(manifest, currentLesson);
  
  if (!currentLessonData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Lesson Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The requested lesson could not be found.
            </p>
            <Button onClick={handleBackToCourseOverview}>
              Back to Course Overview
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasNext = currentLesson < manifest.lessons.length;
  const hasPrev = currentLesson > 1;

  return (
    <VoiceSettingsProvider>
      <InteractiveCourseWrapper 
        courseId={courseData.id}
        courseTitle={courseData.title}
        currentLesson={currentLesson}
        totalLessons={manifest.lessons.length}
      >
        <div 
          className="min-h-screen bg-gradient-to-br from-background to-muted/20"
          style={{
            backgroundImage: courseData.background_image ? `url(${courseData.background_image})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          {/* Background overlay */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
          
          <CourseHeader courseTitle={courseData.title} />
          
          <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
            {/* Standardized Lesson Navigation Bar */}
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
              <Badge className={currentLessonData.unitColor || 'bg-blue-100 text-blue-700'}>
                {currentLessonData.unit || 'Main Course'}
              </Badge>
            </div>

            {/* Navigation Buttons */}
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
              
              <span className="text-sm text-white/80 font-medium">
                Lesson {currentLesson} of {manifest.lessons.length}
              </span>
              
              <Button
                onClick={handleNextLesson}
                disabled={!hasNext}
                className="flex items-center gap-2"
              >
                Next Lesson
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Standardized Content Area */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-2xl">
              <InteractiveLessonWrapper
                courseId={courseData.id}
                lessonId={currentLesson}
                lessonTitle={currentLessonData.title}
                onComplete={() => handleLessonComplete(currentLesson)}
                onNext={hasNext ? handleNextLesson : undefined}
                hasNext={hasNext}
                totalLessons={manifest.lessons.length}
              >
                {/* Data-Driven Content Rendering */}
                {currentLessonData.contentType === 'video' && currentLessonData.video && (
                  <StandardVideoPlayer
                    video={currentLessonData.video}
                    courseId={courseData.id}
                    lessonId={currentLesson}
                  />
                )}
                
                {currentLessonData.contentType === 'text' && currentLessonData.sections && (
                  <StandardTextRenderer
                    sections={currentLessonData.sections}
                    showCard={false}
                  />
                )}

                {currentLessonData.contentType === 'video+text' && (
                  <>
                    {currentLessonData.video && (
                      <StandardVideoPlayer
                        video={currentLessonData.video}
                        courseId={courseData.id}
                        lessonId={currentLesson}
                      />
                    )}
                    {currentLessonData.sections && (
                      <StandardTextRenderer
                        sections={currentLessonData.sections}
                        showCard={false}
                      />
                    )}
                  </>
                )}

                {currentLessonData.contentType === 'interactive' && (
                  <div className="text-center p-8">
                    <p className="text-muted-foreground">
                      Interactive content coming soon...
                    </p>
                  </div>
                )}
              </InteractiveLessonWrapper>
            </div>

            {/* Bottom Navigation */}
            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                onClick={handlePrevLesson}
                disabled={!hasPrev}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <Button
                onClick={handleNextLesson}
                disabled={!hasNext}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </InteractiveCourseWrapper>
    </VoiceSettingsProvider>
  );
};
