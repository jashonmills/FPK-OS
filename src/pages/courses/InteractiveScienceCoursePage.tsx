import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InteractiveCourseWrapper } from '@/components/course/InteractiveCourseWrapper';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { useInteractiveCourseProgress } from '@/hooks/useInteractiveCourseProgress';
import { useCourseEnrollment } from '@/hooks/useCourseEnrollment';
import { useInteractiveCourseEnrollmentBridge } from '@/hooks/useInteractiveCourseEnrollmentBridge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import CourseHeader from '@/components/course/CourseHeader';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';
import CourseOverviewTTS from '@/components/course/CourseOverviewTTS';
import CourseOverviewVideo from '@/components/course/CourseOverviewVideo';
import { StandardCourseAudioSection } from '@/components/course/StandardCourseAudioSection';
import { StandardLessonAudioButtons } from '@/components/course/StandardLessonAudioButtons';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Import background image
import scienceCourseBg from '@/assets/science-course-background.jpg';

// Import micro-lesson components
import { ScientificMethodMicroLesson } from '@/components/micro-lessons/science/scientific-method/ScientificMethodMicroLesson';
import { ImportanceOfScienceMicroLesson } from '@/components/micro-lessons/science/importance-of-science/ImportanceOfScienceMicroLesson';
import { CellStructureMicroLesson } from '@/components/micro-lessons/science/cell-structure/CellStructureMicroLesson';
import { GeneticsDNAMicroLesson } from '@/components/micro-lessons/science/genetics-dna/GeneticsDNAMicroLesson';
import { AtomsMoleculesMicroLesson } from '@/components/micro-lessons/science/atoms-molecules/AtomsMoleculesMicroLesson';
import { PeriodicTableMicroLesson } from '@/components/micro-lessons/science/periodic-table/PeriodicTableMicroLesson';
import { ForcesMotionMicroLesson } from '@/components/micro-lessons/science/forces-motion/ForcesMotionMicroLesson';
import { EnergyWorkMicroLesson } from '@/components/micro-lessons/science/energy-work/EnergyWorkMicroLesson';
import { ReviewSummaryMicroLesson } from '@/components/micro-lessons/science/review-summary/ReviewSummaryMicroLesson';
import { FurtherExplorationMicroLesson } from '@/components/micro-lessons/science/further-exploration/FurtherExplorationMicroLesson';
import { ShortAnswerQuestionsMicroLesson } from '@/components/micro-lessons/science/short-answer-questions/ShortAnswerQuestionsMicroLesson';
import { StudyGuideMicroLesson } from '@/components/micro-lessons/science/study-guide/StudyGuideMicroLesson';

// All lessons are now converted to micro-lessons!

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
  { id: 1, title: "The Scientific Method", description: "Learn the fundamental steps of scientific inquiry and how to apply them", component: ScientificMethodMicroLesson, unit: "Unit 1: The Scientific Method", unitColor: "bg-blue-100 text-blue-700" },
  { id: 2, title: "The Importance of Science", description: "Discover how science shapes our understanding of the world", component: ImportanceOfScienceMicroLesson, unit: "Unit 1: The Scientific Method", unitColor: "bg-blue-100 text-blue-700" },
  { id: 3, title: "Cell Structure and Function", description: "Explore the basic building blocks of all living organisms", component: CellStructureMicroLesson, unit: "Unit 2: Biology", unitColor: "bg-green-100 text-green-700" },
  { id: 4, title: "Genetics and DNA", description: "Understand heredity and the molecular basis of life", component: GeneticsDNAMicroLesson, unit: "Unit 2: Biology", unitColor: "bg-green-100 text-green-700" },
  { id: 5, title: "Atoms and Molecules", description: "Learn about the fundamental particles that make up matter", component: AtomsMoleculesMicroLesson, unit: "Unit 3: Chemistry", unitColor: "bg-red-100 text-red-700" },
  { id: 6, title: "The Periodic Table", description: "Master the organization of chemical elements", component: PeriodicTableMicroLesson, unit: "Unit 3: Chemistry", unitColor: "bg-red-100 text-red-700" },
  { id: 7, title: "Forces and Motion", description: "Discover the principles that govern how objects move", component: ForcesMotionMicroLesson, unit: "Unit 4: Physics", unitColor: "bg-yellow-100 text-yellow-700" },
  { id: 8, title: "Energy and Work", description: "Understand different forms of energy and how work is done", component: EnergyWorkMicroLesson, unit: "Unit 4: Physics", unitColor: "bg-yellow-100 text-yellow-700" },
  { id: 9, title: "Review and Summary", description: "Consolidate your learning with comprehensive review", component: ReviewSummaryMicroLesson, unit: "Unit 5: Conclusion", unitColor: "bg-gray-100 text-gray-700" },
  { id: 10, title: "Further Exploration", description: "Explore advanced topics and real-world applications", component: FurtherExplorationMicroLesson, unit: "Unit 5: Conclusion", unitColor: "bg-gray-100 text-gray-700" },
  { id: 11, title: "Short-Answer Questions", description: "Test your knowledge with focused practice questions", component: ShortAnswerQuestionsMicroLesson, unit: "Unit 6: Study Guide", unitColor: "bg-purple-100 text-purple-700" },
  { id: 12, title: "Complete Study Guide", description: "Comprehensive guide for mastering all course concepts", component: StudyGuideMicroLesson, unit: "Unit 6: Study Guide", unitColor: "bg-purple-100 text-purple-700" }
];

export const InteractiveScienceCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [currentLesson, setCurrentLesson] = useState<number | null>(null);

  // Use analytics and progress hooks
  const courseId = 'interactive-science';
  const courseTitle = 'Interactive Science';
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
      navigate(`/courses/interactive-science/${nextLesson}`);
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigate]);

  const handlePrevLesson = useCallback(() => {
    if (currentLesson !== null && currentLesson > 1) {
      const prevLesson = currentLesson - 1;
      setCurrentLesson(prevLesson);
      navigate(`/courses/interactive-science/${prevLesson}`);
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigate]);

  const handleLessonSelect = useCallback((lessonId: number) => {
    setCurrentLesson(lessonId);
    navigate(`/courses/interactive-science/${lessonId}`);
  }, [navigate]);

  const handleBackToCourses = useCallback(() => {
    console.log('📍 Navigating back to courses');
    navigate('/dashboard/learner/courses');
  }, [navigate]);

  const handleDashboard = useCallback(() => {
    navigate('/dashboard/learner');
  }, [navigate]);

  // Memoize expensive calculations
  const isLessonAccessible = useCallback((lessonId: number) => {
    return lessonId === 1 || completedLessons.includes(lessonId - 1);
  }, [completedLessons]);

  const progress = useMemo(() => (completedLessons.length / lessons.length) * 100, [completedLessons.length]);

  // Course overview (lesson selection)
  if (currentLesson === null) {
    return (
      <VoiceSettingsProvider>
        <InteractiveCourseWrapper
          courseId="interactive-science"
          courseTitle="Interactive Introduction to Science"
          currentLesson={currentLesson}
          totalLessons={lessons.length}
        >
          <div 
            className="min-h-screen bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url(${scienceCourseBg})` }}
          >
            <div className="min-h-screen bg-gradient-to-br from-black/60 to-black/40">
            <CourseHeader 
              onDashboard={handleDashboard} 
              onBackToCourses={handleBackToCourses}
              courseTitle="Introduction to Science"
            />
          
            <div className="container mx-auto px-4 py-8 space-y-8">
              {/* Course Title and Description */}
              <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-white drop-shadow-lg">Interactive Introduction to Science</h1>
                <p className="text-xl text-white max-w-3xl mx-auto font-medium drop-shadow">
                  Get to grips with the basics of biology, chemistry, and physics. Learn the scientific method and explore the building blocks of life and matter.
                </p>
                
                {/* Course badges */}
                <div className="flex justify-center gap-4 flex-wrap">
                  <Badge variant="outline" className="text-sm px-3 py-1 bg-white/80 text-gray-900 border-white/50 font-semibold">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {lessons.length} Lessons
                  </Badge>
                  <Badge variant="outline" className="text-sm px-3 py-1 bg-white/80 text-gray-900 border-white/50 font-semibold">
                    <Clock className="w-4 h-4 mr-2" />
                    ~6 Hours
                  </Badge>
                  <Badge variant="outline" className="text-sm px-3 py-1 bg-white/80 text-gray-900 border-white/50 font-semibold">
                    <Users className="w-4 h-4 mr-2" />
                    Beginner
                  </Badge>
                </div>

                <div className="max-w-md mx-auto">
                  <Progress value={progress} className="h-2 mb-2" />
                  <p className="text-xs text-white/90 mt-1 text-center font-medium drop-shadow">
                    {completedLessons.length} of {lessons.length} lessons completed
                  </p>
                </div>
              </div>

              {/* Listen to Course Overview Section */}
              <div className="mb-8">
                <StandardCourseAudioSection
                  courseTitle="Introduction to Science"
                  courseDescription="Get to grips with the basics of biology, chemistry, and physics. Learn the scientific method and explore the building blocks of life and matter."
                />
              </div>

              {/* Individual Lesson Audio Buttons */}
              <div className="mb-8">
                <StandardLessonAudioButtons lessons={lessons} />
              </div>

              {/* Course Overview Section */}
              <div className="mb-8 max-w-4xl mx-auto">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="course-overview">
                    <AccordionTrigger className="flex items-center justify-center text-center text-xl font-semibold bg-white/30 hover:bg-white/40 px-4 py-3 rounded-lg text-white border border-white/20">
                      Course Overview &amp; Learning Objectives
                    </AccordionTrigger>
                    <AccordionContent className="bg-white/30 backdrop-blur-sm border border-white/10 rounded-lg p-6 mt-2">
                      <div className="space-y-6 text-white">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Why Learn Science?</h3>
                          <p className="leading-relaxed text-white/90">
                            Science provides the tools to understand the natural world around us. From the smallest atoms to the largest ecosystems, scientific knowledge helps us make informed decisions and solve real-world problems.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3">What You'll Master</h3>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Scientific Method:</strong> Learn systematic approaches to investigation and discovery</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Biology Fundamentals:</strong> Understand cells, genetics, and the building blocks of life</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Chemistry Basics:</strong> Explore atoms, molecules, and the periodic table</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Physics Principles:</strong> Master forces, motion, energy, and work</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Video Overview */}
              <CourseOverviewVideo 
                videoUrl="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/A_Guide_to_the_Sciences.mp4" 
                title="Introduction to Science"
              />

              {/* Lessons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {lessons.map((lesson) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const isAccessible = isLessonAccessible(lesson.id);

                  return (
                    <Card 
                      key={lesson.id}
                      className={`relative transition-all duration-200 cursor-pointer hover:shadow-lg bg-white/90 backdrop-blur-sm border-white/30 ${
                        !isAccessible ? 'opacity-50' : ''
                      } ${isCompleted ? 'border-primary/50 bg-white/95' : ''}`}
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
                              {isCompleted ? <Award className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                            </div>
                            <div>
                              <Badge className={lesson.unitColor}>
                                Lesson {lesson.id}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <CardTitle className="text-lg mt-2">{lesson.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">{lesson.description}</p>
                        <Badge variant="outline" className={lesson.unitColor}>
                          {lesson.unit}
                        </Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
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
        courseId="interactive-science"
        courseTitle="Introduction to Science"
        currentLesson={currentLesson}
        totalLessons={lessons.length}
      >
        <div 
          className="min-h-screen bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${scienceCourseBg})` }}
        >
          <div className="min-h-screen bg-gradient-to-br from-black/60 to-black/40">
            <CourseHeader 
              onBackToCourses={handleBackToCourses}
              onDashboard={handleDashboard}
              courseTitle="Introduction to Science"
            />
          
            <div className="container mx-auto px-4 py-8 max-w-6xl">
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log('🔘 Back to Overview button clicked');
                    setCurrentLesson(null);
                  }}
                  className="flex items-center gap-2 bg-white/10 text-white border-white/30 hover:bg-white/20"
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
                  className="flex items-center gap-2 bg-white/10 text-white border-white/30 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous Lesson
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/80 font-medium">
                    Lesson {currentLesson} of {lessons.length}
                  </span>
                </div>

                <Button
                  variant="outline"
                  onClick={handleNextLesson}
                  disabled={!hasNext}
                  className="flex items-center gap-2 bg-white/10 text-white border-white/30 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Lesson
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

            {/* Lesson Content */}
            <InteractiveLessonWrapper
              courseId="interactive-science"
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
        </div>
        </InteractiveCourseWrapper>
    </VoiceSettingsProvider>
  );
};

export default InteractiveScienceCoursePage;