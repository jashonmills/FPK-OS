import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InteractiveCourseWrapper } from '@/components/course/InteractiveCourseWrapper';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Award, ChevronLeft, ChevronRight, X, Calculator, Target, Brain } from 'lucide-react';
import CourseHeader from '@/components/course/CourseHeader';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';
import CourseOverviewTTS from '@/components/course/CourseOverviewTTS';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { StandardCourseAudioSection } from '@/components/course/StandardCourseAudioSection';
import { StandardLessonAudioButtons } from '@/components/course/StandardLessonAudioButtons';

// Import background image
import trigBg from '@/assets/trigonometry-background.jpg';

// Import micro-lesson components
import TrigonometryIntroductionMicroLesson from '@/components/micro-lessons/trigonometry/TrigonometryIntroductionMicroLesson';
import TrigonometryRatiosMicroLesson from '@/components/micro-lessons/trigonometry/TrigonometryRatiosMicroLesson';
import TrigonometryUnitCircleMicroLesson from '@/components/micro-lessons/trigonometry/TrigonometryUnitCircleMicroLesson';
import TrigonometryGraphingMicroLesson from '@/components/micro-lessons/trigonometry/TrigonometryGraphingMicroLesson';
import TrigonometryIdentitiesMicroLesson from '@/components/micro-lessons/trigonometry/TrigonometryIdentitiesMicroLesson';
import TrigonometryEquationsMicroLesson from '@/components/micro-lessons/trigonometry/TrigonometryEquationsMicroLesson';
import TrigonometryApplicationsMicroLesson from '@/components/micro-lessons/trigonometry/TrigonometryApplicationsMicroLesson';

interface Lesson {
  id: number;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  unit: string;
  unitColor: string;
}

const lessons: Lesson[] = [
  { id: 1, title: "Introduction to Trigonometry", description: "Discover the basics of trigonometry, angles, and right triangles", component: TrigonometryIntroductionMicroLesson, unit: "Unit 1: Foundations", unitColor: "bg-green-100 text-green-700" },
  { id: 2, title: "Trigonometric Ratios", description: "Master SOHCAHTOA and the six trigonometric functions", component: TrigonometryRatiosMicroLesson, unit: "Unit 1: Foundations", unitColor: "bg-green-100 text-green-700" },
  { id: 3, title: "The Unit Circle", description: "Understand the unit circle and reference angles", component: TrigonometryUnitCircleMicroLesson, unit: "Unit 2: Circle", unitColor: "bg-blue-100 text-blue-700" },
  { id: 4, title: "Graphing Trig Functions", description: "Learn to graph sine, cosine, and tangent functions", component: TrigonometryGraphingMicroLesson, unit: "Unit 2: Circle", unitColor: "bg-blue-100 text-blue-700" },
  { id: 5, title: "Trigonometric Identities", description: "Explore fundamental trigonometric identities and proofs", component: TrigonometryIdentitiesMicroLesson, unit: "Unit 3: Advanced", unitColor: "bg-purple-100 text-purple-700" },
  { id: 6, title: "Solving Trig Equations", description: "Master techniques for solving trigonometric equations", component: TrigonometryEquationsMicroLesson, unit: "Unit 3: Advanced", unitColor: "bg-purple-100 text-purple-700" },
  { id: 7, title: "Real-World Applications", description: "Apply trigonometry to engineering, physics, and technology", component: TrigonometryApplicationsMicroLesson, unit: "Unit 4: Applications", unitColor: "bg-orange-100 text-orange-700" }
];

const InteractiveTrigonometryCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [currentLesson, setCurrentLesson] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [accordionOpen, setAccordionOpen] = useState<string | undefined>(undefined);

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
    }
  };

  const handleNextLesson = useCallback(() => {
    if (currentLesson !== null && currentLesson < lessons.length) {
      const nextLesson = currentLesson + 1;
      setCurrentLesson(nextLesson);
      navigate(`/courses/interactive-trigonometry/${nextLesson}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigate]);

  const handleLessonSelect = useCallback((lessonId: number) => {
    setCurrentLesson(lessonId);
    navigate(`/courses/interactive-trigonometry/${lessonId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const handleBackToCourses = useCallback(() => {
    console.log('📍 Navigating back to courses');
    navigate('/dashboard/learner/courses');
  }, [navigate]);

  const handleDashboard = useCallback(() => {
    navigate('/dashboard/learner');
  }, [navigate]);

  const isLessonAccessible = useCallback((lessonId: number) => {
    return lessonId === 1 || completedLessons.includes(lessonId - 1);
  }, [completedLessons]);

  const progress = useMemo(() => (completedLessons.length / lessons.length) * 100, [completedLessons.length]);

  // Course overview (lesson selection)
  if (currentLesson === null) {
    return (
      <VoiceSettingsProvider>
        <InteractiveCourseWrapper
          courseId="interactive-trigonometry"
          courseTitle="Interactive Trigonometry"
          currentLesson={currentLesson}
          totalLessons={lessons.length}
        >
          <div className="min-h-screen bg-gradient-to-br from-background to-muted/20" style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${trigBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}>
            <CourseHeader 
              onDashboard={handleDashboard} 
              onBackToCourses={handleBackToCourses}
              courseTitle="Interactive Trigonometry"
            />
          
            <div className="container mx-auto px-4 py-8 space-y-8">
              <div className="text-center space-y-4">
                <div className="flex justify-center items-center gap-3 mb-4">
                  <Calculator className="w-12 h-12 text-purple-400" />
                  <h1 className="text-4xl font-bold text-white drop-shadow-lg">Interactive Trigonometry</h1>
                  <Brain className="w-12 h-12 text-purple-400" />
                </div>
                <p className="text-xl text-white max-w-3xl mx-auto font-medium">
                  Master trigonometric functions, the unit circle, identities, and real-world applications through interactive lessons and step-by-step problem solving.
                </p>
                
                <div className="flex justify-center gap-4 flex-wrap">
                  <Badge variant="secondary" className="text-sm px-3 py-1 bg-white/90 text-gray-800 border-white/20">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {lessons.length} Lessons
                  </Badge>
                  <Badge variant="secondary" className="text-sm px-3 py-1 bg-white/90 text-gray-800 border-white/20">
                    <Clock className="w-4 h-4 mr-2" />
                    ~6 Hours
                  </Badge>
                  <Badge variant="secondary" className="text-sm px-3 py-1 bg-white/90 text-gray-800 border-white/20">
                    <Target className="w-4 h-4 mr-2" />
                    Functions & Applications
                  </Badge>
                </div>

                <div className="max-w-md mx-auto">
                  <Progress value={progress} className="h-2 mb-2" />
                  <p className="text-xs text-white mt-1 text-center font-medium">
                    {completedLessons.length} of {lessons.length} lessons completed
                  </p>
                </div>
              </div>

              {/* Listen to Course Overview Section */}
              <div className="mb-8">
                <StandardCourseAudioSection
                  courseTitle="Interactive Trigonometry"
                  courseDescription="Master trigonometric functions, the unit circle, identities, and real-world applications through interactive lessons and step-by-step problem solving."
                />
              </div>

              {/* Individual Lesson Audio Buttons */}
              <div className="mb-8">
                <StandardLessonAudioButtons lessons={lessons} />
              </div>

              {/* Course Overview Section */}
              <div className="mb-8 max-w-4xl mx-auto">
                <Accordion 
                  type="single" 
                  collapsible 
                  className="w-full space-y-4"
                  value={accordionOpen}
                  onValueChange={setAccordionOpen}
                >
                  <AccordionItem value="course-info">
                    <AccordionTrigger className="flex items-center justify-center text-center text-xl font-semibold bg-white/30 hover:bg-white/40 px-4 py-3 rounded-lg text-white border border-white/20">
                      Course Overview &amp; Learning Objectives
                    </AccordionTrigger>
                    <AccordionContent className="bg-white/30 backdrop-blur-sm border border-white/10 rounded-lg p-6 mt-2">
                      <div className="space-y-6 text-white">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Why Learn Trigonometry?</h3>
                          <p className="leading-relaxed text-white/90">
                            Trigonometry is essential for engineering, physics, computer graphics, and many other fields. It provides the mathematical foundation for understanding waves, rotations, and periodic phenomena in the real world.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3">What You'll Master</h3>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Trigonometric Ratios:</strong> Sine, cosine, tangent and their applications</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Unit Circle:</strong> Reference angles and special values</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Function Graphing:</strong> Visualizing trigonometric functions and transformations</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Real-World Applications:</strong> Engineering, physics, and technology problems</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Lessons Grid */}
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-8 text-center">Course Lessons</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lessons.map((lesson) => {
                    const isAccessible = isLessonAccessible(lesson.id);
                    const isCompleted = completedLessons.includes(lesson.id);
                    
                    return (
                      <Card 
                        key={lesson.id}
                        className={`relative transition-all duration-200 cursor-pointer hover:shadow-lg bg-card/65 backdrop-blur-sm border-border ${
                          !isAccessible ? 'opacity-50' : ''
                        } ${isCompleted ? 'border-primary/50' : 'border-border'}`}
                        onClick={() => isAccessible && handleLessonSelect(lesson.id)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className={lesson.unitColor}>
                              {lesson.unit}
                            </Badge>
                            {isCompleted && <Award className="w-5 h-5 text-primary" />}
                          </div>
                          <CardTitle className="text-lg">{lesson.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground text-sm mb-4">{lesson.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Lesson {lesson.id}</span>
                            {!isAccessible && (
                              <span className="text-xs text-muted-foreground">Complete previous lesson</span>
                            )}
                          </div>
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
            <Button onClick={() => navigate('/courses/interactive-trigonometry')}>
              Back to Course Overview
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasNext = currentLesson < lessons.length;
  const LessonComponent = currentLessonData.component;

  return (
    <VoiceSettingsProvider>
      <InteractiveCourseWrapper 
        courseId="interactive-trigonometry"
        courseTitle="Interactive Trigonometry"
        currentLesson={currentLesson}
        totalLessons={lessons.length}
      >
        <div className="min-h-screen bg-background" style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${trigBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}>
          <CourseHeader 
            onDashboard={handleDashboard} 
            onBackToCourses={handleBackToCourses}
            title={`Lesson ${currentLessonData.id}: ${currentLessonData.title}`}
          />

          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
              <Button 
                variant="outline" 
                onClick={() => navigate('/courses/interactive-trigonometry')}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Course
              </Button>
              
              <div className="text-center">
                <Badge className={currentLessonData.unitColor}>
                  {currentLessonData.unit}
                </Badge>
                <h1 className="text-2xl font-bold text-white mt-2">
                  Lesson {currentLessonData.id}: {currentLessonData.title}
                </h1>
              </div>

              <div className="w-24" />
            </div>

            <InteractiveLessonWrapper
              courseId="interactive-trigonometry"
              lessonId={currentLesson}
              lessonTitle={currentLessonData.title}
              onComplete={() => handleLessonComplete(currentLesson!)}
              onNext={hasNext ? handleNextLesson : undefined}
              hasNext={hasNext}
            >
              <LessonComponent />
            </InteractiveLessonWrapper>
          </div>
        </div>
      </InteractiveCourseWrapper>
    </VoiceSettingsProvider>
  );
};

export default InteractiveTrigonometryCoursePage;