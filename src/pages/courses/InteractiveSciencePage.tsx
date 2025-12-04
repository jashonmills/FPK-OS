import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useContextAwareNavigation } from '@/hooks/useContextAwareNavigation';
import { useCourseNavigation } from '@/hooks/useCourseNavigation';
import { InteractiveCourseWrapper } from '@/components/course/InteractiveCourseWrapper';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { useInteractiveCourseProgress } from '@/hooks/useInteractiveCourseProgress';
import { useCourseEnrollment } from '@/hooks/useCourseEnrollment';
import { useInteractiveCourseEnrollmentBridge } from '@/hooks/useInteractiveCourseEnrollmentBridge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Award, ChevronLeft, ChevronRight, X } from 'lucide-react';
import CourseHeader from '@/components/course/CourseHeader';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';
import CourseOverviewTTS from '@/components/course/CourseOverviewTTS';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AdditionalResourcesSection } from '@/components/course/resources/AdditionalResourcesSection';
import { EnhancedCourseInfoAccordion } from '@/components/course/resources/EnhancedCourseInfoAccordion';

// Import background image
import interactiveScienceBg from '@/assets/interactive-science-bg.jpg';

// Import lesson components
import { ScientificMethodMicroLesson } from '@/components/micro-lessons/science/scientific-method/ScientificMethodMicroLesson';
import { ImportanceOfScienceMicroLesson } from '@/components/micro-lessons/science/importance-of-science/ImportanceOfScienceMicroLesson';
import { AtomsMoleculesMicroLesson } from '@/components/micro-lessons/science/atoms-molecules/AtomsMoleculesMicroLesson';
import { PeriodicTableMicroLesson } from '@/components/micro-lessons/science/periodic-table/PeriodicTableMicroLesson';
import { ForcesMotionMicroLesson } from '@/components/micro-lessons/science/forces-motion/ForcesMotionMicroLesson';
import { EnergyWorkMicroLesson } from '@/components/micro-lessons/science/energy-work/EnergyWorkMicroLesson';
import { CellStructureMicroLesson } from '@/components/micro-lessons/science/cell-structure/CellStructureMicroLesson';
import { GeneticsDNAMicroLesson } from '@/components/micro-lessons/science/genetics-dna/GeneticsDNAMicroLesson';
import { ReviewSummaryMicroLesson } from '@/components/micro-lessons/science/review-summary/ReviewSummaryMicroLesson';
import { ShortAnswerQuestionsMicroLesson } from '@/components/micro-lessons/science/short-answer-questions/ShortAnswerQuestionsMicroLesson';
import { StudyGuideMicroLesson } from '@/components/micro-lessons/science/study-guide/StudyGuideMicroLesson';
import { FurtherExplorationMicroLesson } from '@/components/micro-lessons/science/further-exploration/FurtherExplorationMicroLesson';

interface Lesson {
  id: number;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  unit: string;
  unitColor: string;
}

// Moved outside component to prevent recreation on every render
const lessons: Lesson[] = [
  { id: 1, title: "The Scientific Method", description: "Learn the foundation of scientific inquiry and experimentation", component: ScientificMethodMicroLesson, unit: "Unit 1: Scientific Foundations", unitColor: "bg-blue-100 text-blue-700" },
  { id: 2, title: "Why Science Matters", description: "Discover the real-world importance and applications of science", component: ImportanceOfScienceMicroLesson, unit: "Unit 1: Scientific Foundations", unitColor: "bg-blue-100 text-blue-700" },
  { id: 3, title: "Atoms and Molecules", description: "Explore the building blocks of all matter", component: AtomsMoleculesMicroLesson, unit: "Unit 2: Chemistry Basics", unitColor: "bg-purple-100 text-purple-700" },
  { id: 4, title: "The Periodic Table", description: "Master the organization of elements and their properties", component: PeriodicTableMicroLesson, unit: "Unit 2: Chemistry Basics", unitColor: "bg-purple-100 text-purple-700" },
  { id: 5, title: "Forces and Motion", description: "Understand the fundamental principles of physics", component: ForcesMotionMicroLesson, unit: "Unit 3: Physics Fundamentals", unitColor: "bg-green-100 text-green-700" },
  { id: 6, title: "Energy and Work", description: "Learn about energy transformations and conservation", component: EnergyWorkMicroLesson, unit: "Unit 3: Physics Fundamentals", unitColor: "bg-green-100 text-green-700" },
  { id: 7, title: "Cell Structure", description: "Discover the basic unit of life and its components", component: CellStructureMicroLesson, unit: "Unit 4: Biology Essentials", unitColor: "bg-orange-100 text-orange-700" },
  { id: 8, title: "Genetics and DNA", description: "Explore heredity and the molecular basis of life", component: GeneticsDNAMicroLesson, unit: "Unit 4: Biology Essentials", unitColor: "bg-orange-100 text-orange-700" },
  { id: 9, title: "Review Summary", description: "Comprehensive recap of key scientific concepts", component: ReviewSummaryMicroLesson, unit: "Unit 5: Review & Assessment", unitColor: "bg-indigo-100 text-indigo-700" },
  { id: 10, title: "Short Answer Questions", description: "Practice your understanding with guided questions", component: ShortAnswerQuestionsMicroLesson, unit: "Unit 5: Review & Assessment", unitColor: "bg-indigo-100 text-indigo-700" },
  { id: 11, title: "Study Guide", description: "Access comprehensive study materials and resources", component: StudyGuideMicroLesson, unit: "Unit 5: Review & Assessment", unitColor: "bg-indigo-100 text-indigo-700" },
  { id: 12, title: "Further Exploration", description: "Explore next steps and advanced science topics", component: FurtherExplorationMicroLesson, unit: "Unit 5: Review & Assessment", unitColor: "bg-indigo-100 text-indigo-700" }
];

export const InteractiveSciencePage: React.FC = () => {
  const navigate = useNavigate();
  const { goToCourses, goToDashboard } = useContextAwareNavigation();
  const { navigateToLesson, navigateToOverview } = useCourseNavigation('interactive-science');
  const { lessonId } = useParams();
  const [currentLesson, setCurrentLesson] = useState<number | null>(null);
  const [accordionOpen, setAccordionOpen] = useState<string | undefined>(undefined);

  // Use analytics and progress hooks
  const courseId = 'interactive-science';
  const courseTitle = 'Introduction to Science';
  const {
    completedLessons,
    isLessonCompleted,
    calculateProgress,
    saveLessonCompletion,
    progressData
  } = useInteractiveCourseProgress(courseId);
  
  const { enrollInCourse, isEnrolling } = useCourseEnrollment();
  const isEnrolled = progressData?.enrollment !== null;
  
  useInteractiveCourseEnrollmentBridge();

  useEffect(() => {
    if (lessonId) {
      const lesson = parseInt(lessonId);
      if (lesson >= 1 && lesson <= lessons.length) {
        setCurrentLesson(lesson);
      }
    } else {
      // Reset to course overview when no lesson ID is present
      setCurrentLesson(null);
    }
  }, [lessonId]);

  const handleLessonComplete = async (lessonId: number) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      await saveLessonCompletion(lessonId, lesson.title);
    }
  };

  // Memoize navigation handlers to prevent unnecessary re-renders
  const handleNextLesson = useCallback(() => {
    if (currentLesson !== null && currentLesson < lessons.length) {
      const nextLesson = currentLesson + 1;
      setCurrentLesson(nextLesson);
      navigateToLesson(nextLesson);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigateToLesson]);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigateToLesson]);

  const handleBackToCourses = useCallback(() => {
    console.log('📍 Navigating back to courses');
    goToCourses();
  }, [goToCourses]);

  const handleDashboard = useCallback(() => {
    goToDashboard();
  }, [goToDashboard]);

  // Memoize expensive calculations
  const isLessonAccessible = useCallback((lessonId: number) => {
    return lessonId === 1 || isLessonCompleted(lessonId - 1);
  }, [isLessonCompleted]);

  const progress = useMemo(() => calculateProgress(lessons.length), [calculateProgress]);

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
            className="min-h-screen bg-cover bg-center bg-fixed relative"
            style={{ backgroundImage: `url(${interactiveScienceBg})` }}
          >
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/30" />
            
            {/* Content container with relative positioning */}
            <div className="relative z-10">
              <CourseHeader 
                title={courseTitle}
              />

              <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Course Introduction */}
                <div className="mb-12 backdrop-blur-sm bg-background/95 rounded-lg p-8 border shadow-lg">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
                    <div className="flex-1">
                      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                        Introduction to Science
                      </h1>
                      <p className="text-lg text-muted-foreground mb-6">
                        Explore the fundamental concepts of science across chemistry, physics, and biology. 
                        Learn the scientific method, understand matter and energy, and discover how science shapes our world.
                      </p>
                      
                      {/* Course badges */}
                      <div className="flex flex-wrap gap-3 mb-6">
                        <Badge variant="secondary" className="px-4 py-2 text-sm">
                          <BookOpen className="w-4 h-4 mr-2" />
                          12 Lessons
                        </Badge>
                        <Badge variant="secondary" className="px-4 py-2 text-sm">
                          <Clock className="w-4 h-4 mr-2" />
                          ~6 Hours
                        </Badge>
                        <Badge variant="secondary" className="px-4 py-2 text-sm">
                          <Award className="w-4 h-4 mr-2" />
                          Beginner
                        </Badge>
                      </div>

                      {/* Progress bar */}
                      {progress > 0 && (
                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-muted-foreground">Course Progress</span>
                            <span className="text-sm font-bold text-primary">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* TTS Audio Controls */}
                  <CourseOverviewTTS
                    courseTitle={courseTitle}
                    courseDescription="Explore the fundamental concepts of science across chemistry, physics, and biology. Learn the scientific method, understand matter and energy, and discover how science shapes our world."
                    lessons={lessons}
                  />
                </div>

                {/* Additional Resources Section */}
                <AdditionalResourcesSection>
                  <EnhancedCourseInfoAccordion
                    title="📚 Enhanced Course Information"
                    introduction="This comprehensive science course takes you on a journey through the fundamental disciplines of scientific inquiry. You'll explore chemistry, physics, and biology through interactive micro-lessons designed for maximum engagement and retention."
                    features={[
                      {
                        title: "🔬 Comprehensive Coverage",
                        description: "Journey through chemistry, physics, and biology basics in one integrated course"
                      },
                      {
                        title: "🎯 Hands-On Learning",
                        description: "Interactive micro-lessons with visual demonstrations and practice exercises"
                      },
                      {
                        title: "🧪 Real-World Applications",
                        description: "Discover how scientific concepts apply to everyday life"
                      },
                      {
                        title: "📊 Progressive Structure",
                        description: "Start with the scientific method, then build knowledge across disciplines"
                      },
                      {
                        title: "💡 Critical Thinking",
                        description: "Learn to ask questions, form hypotheses, and think like a scientist"
                      }
                    ]}
                    modules={[
                      {
                        number: 1,
                        title: "Unit 1: Scientific Foundations",
                        description: "Master the scientific method and understand why science matters in our daily lives"
                      },
                      {
                        number: 2,
                        title: "Unit 2: Chemistry Basics",
                        description: "Explore atoms, molecules, and the organization of elements in the periodic table"
                      },
                      {
                        number: 3,
                        title: "Unit 3: Physics Fundamentals",
                        description: "Understand forces, motion, energy, and work through practical examples"
                      },
                      {
                        number: 4,
                        title: "Unit 4: Biology Essentials",
                        description: "Discover cell structure, genetics, and the molecular basis of life"
                      },
                      {
                        number: 5,
                        title: "Unit 5: Review & Assessment",
                        description: "Consolidate your learning with comprehensive review materials and practice questions"
                      }
                    ]}
                    accordionOpen={accordionOpen}
                    onAccordionChange={setAccordionOpen}
                  />
                </AdditionalResourcesSection>

                {/* Lessons Grid */}
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-foreground backdrop-blur-sm bg-background/80 rounded-lg p-4 border">
                    Course Lessons
                  </h2>
                  
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {lessons.map((lesson) => {
                      const isCompleted = isLessonCompleted(lesson.id);
                      const isAccessible = isLessonAccessible(lesson.id);
                      const isLocked = !isAccessible;

                      return (
                        <Card 
                          key={lesson.id}
                          className={`relative overflow-hidden transition-all backdrop-blur-sm bg-background/95 ${
                            isAccessible ? 'hover:shadow-lg cursor-pointer hover:scale-105' : 'opacity-60'
                          } ${isCompleted ? 'border-green-500 border-2' : ''}`}
                          onClick={() => isAccessible && handleLessonSelect(lesson.id)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between mb-2">
                              <Badge className={`${lesson.unitColor} text-xs`}>
                                {lesson.unit}
                              </Badge>
                              {isCompleted && (
                                <Badge variant="default" className="bg-green-500 text-white">
                                  ✓ Completed
                                </Badge>
                              )}
                              {isLocked && (
                                <Badge variant="secondary" className="bg-gray-500 text-white">
                                  🔒 Locked
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-xl">
                              Lesson {lesson.id}: {lesson.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                              {lesson.description}
                            </p>
                            <Button 
                              className="w-full" 
                              disabled={isLocked}
                              variant={isCompleted ? "outline" : "default"}
                            >
                              {isCompleted ? "Review Lesson" : isLocked ? "Complete Previous Lesson" : "Start Lesson"}
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </InteractiveCourseWrapper>
      </VoiceSettingsProvider>
    );
  }

  // Lesson view
  const lesson = lessons.find(l => l.id === currentLesson);
  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Lesson Not Found</h2>
          <Button onClick={() => navigateToOverview()}>
            Return to Course Overview
          </Button>
        </div>
      </div>
    );
  }

  const LessonComponent = lesson.component;
  const isCompleted = isLessonCompleted(currentLesson);
  const hasNext = currentLesson < lessons.length;
  const hasPrev = currentLesson > 1;

  return (
    <VoiceSettingsProvider>
      <InteractiveCourseWrapper
        courseId={courseId}
        courseTitle={courseTitle}
        currentLesson={currentLesson}
        totalLessons={lessons.length}
      >
        <InteractiveLessonWrapper
          courseId={courseId}
          lessonId={currentLesson}
          lessonTitle={lesson.title}
          onComplete={() => handleLessonComplete(currentLesson)}
        >
          <div className="min-h-screen bg-background">
            {/* Fixed Header */}
            <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-sm">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateToOverview()}
                      className="gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Course Overview
                    </Button>
                    <div className="hidden md:block">
                      <Badge className={lesson.unitColor}>
                        {lesson.unit}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground hidden sm:inline">
                      Lesson {currentLesson} of {lessons.length}
                    </span>
                    {isCompleted && (
                      <Badge variant="default" className="bg-green-500">
                        ✓ Completed
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <Progress value={progress} className="h-1" />
                </div>
              </div>
            </div>

            {/* Lesson Content */}
            <div className="container mx-auto px-4 py-8 max-w-5xl">
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {lesson.title}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {lesson.description}
                </p>
              </div>

              <LessonComponent 
                onComplete={() => handleLessonComplete(currentLesson)}
                onNext={hasNext ? handleNextLesson : undefined}
                hasNext={hasNext}
              />

              {/* Navigation Footer */}
              <div className="mt-12 pt-6 border-t">
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={handlePrevLesson}
                    disabled={!hasPrev}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous Lesson
                  </Button>
                  
                  {hasNext ? (
                    <Button
                      onClick={handleNextLesson}
                      disabled={!isLessonAccessible(currentLesson + 1)}
                      className="gap-2"
                    >
                      Next Lesson
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigateToOverview()}
                      variant="default"
                      className="gap-2"
                    >
                      Course Complete
                      <Award className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </InteractiveLessonWrapper>
      </InteractiveCourseWrapper>
    </VoiceSettingsProvider>
  );
};

export default InteractiveSciencePage;
