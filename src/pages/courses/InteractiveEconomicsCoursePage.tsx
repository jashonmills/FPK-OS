import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InteractiveCourseWrapper } from '@/components/course/InteractiveCourseWrapper';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Award, ChevronLeft, ChevronRight, X } from 'lucide-react';
import CourseHeader from '@/components/course/CourseHeader';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';
import CourseOverviewTTS from '@/components/course/CourseOverviewTTS';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { StandardCourseAudioSection } from '@/components/course/StandardCourseAudioSection';
import { StandardLessonAudioButtons } from '@/components/course/StandardLessonAudioButtons';

// Import background image
import economicsBg from '@/assets/economics-background.jpg';

// Import lesson components
import { EconomicsIntroductionMicroLesson } from '@/components/micro-lessons/economics/EconomicsIntroductionMicroLesson';
import { EconomicsSupplyDemandMicroLesson } from '@/components/micro-lessons/economics/EconomicsSupplyDemandMicroLesson';
import { EconomicsMarketStructuresMicroLesson } from '@/components/micro-lessons/economics/EconomicsMarketStructuresMicroLesson';
import { EconomicsIndicatorsMicroLesson } from '@/components/micro-lessons/economics/EconomicsIndicatorsMicroLesson';
import { EconomicsMonetaryPolicyMicroLesson } from '@/components/micro-lessons/economics/EconomicsMonetaryPolicyMicroLesson';
import { EconomicsFiscalPolicyMicroLesson } from '@/components/micro-lessons/economics/EconomicsFiscalPolicyMicroLesson';
import { EconomicsInternationalTradeMicroLesson } from '@/components/micro-lessons/economics/EconomicsInternationalTradeMicroLesson';
import { EconomicsGrowthDevelopmentMicroLesson } from '@/components/micro-lessons/economics/EconomicsGrowthDevelopmentMicroLesson';

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
  { id: 1, title: "Introduction to Economics", description: "Learn the fundamental concepts of economics and economic thinking", component: EconomicsIntroductionMicroLesson, unit: "Unit 1: Foundations", unitColor: "bg-blue-100 text-blue-700" },
  { id: 2, title: "Supply and Demand", description: "Understand market forces and price determination mechanisms", component: EconomicsSupplyDemandMicroLesson, unit: "Unit 1: Foundations", unitColor: "bg-blue-100 text-blue-700" },
  { id: 3, title: "Market Structures", description: "Explore different types of market competition and behavior", component: EconomicsMarketStructuresMicroLesson, unit: "Unit 1: Foundations", unitColor: "bg-blue-100 text-blue-700" },
  { id: 4, title: "Economic Indicators", description: "Analyze key metrics that measure economic health and performance", component: EconomicsIndicatorsMicroLesson, unit: "Unit 2: Measurement", unitColor: "bg-green-100 text-green-700" },
  { id: 5, title: "Monetary Policy", description: "Study central banking and money supply management strategies", component: EconomicsMonetaryPolicyMicroLesson, unit: "Unit 2: Measurement", unitColor: "bg-green-100 text-green-700" },
  { id: 6, title: "Fiscal Policy", description: "Understand government spending and taxation policies", component: EconomicsFiscalPolicyMicroLesson, unit: "Unit 3: Policy & Growth", unitColor: "bg-purple-100 text-purple-700" },
  { id: 7, title: "International Trade", description: "Explore global economic relationships and trade principles", component: EconomicsInternationalTradeMicroLesson, unit: "Unit 3: Policy & Growth", unitColor: "bg-purple-100 text-purple-700" },
  { id: 8, title: "Economic Growth & Development", description: "Analyze factors driving economic progress and development", component: EconomicsGrowthDevelopmentMicroLesson, unit: "Unit 3: Policy & Growth", unitColor: "bg-purple-100 text-purple-700" }
];

export const InteractiveEconomicsCoursePage: React.FC = () => {
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
      // Reset to course overview when no lesson ID is present
      setCurrentLesson(null);
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
      navigate(`/courses/introduction-modern-economics/${nextLesson}`);
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigate]);

  const handlePrevLesson = useCallback(() => {
    if (currentLesson !== null && currentLesson > 1) {
      const prevLesson = currentLesson - 1;
      setCurrentLesson(prevLesson);
      navigate(`/courses/introduction-modern-economics/${prevLesson}`);
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigate]);

  const handleLessonSelect = useCallback((lessonId: number) => {
    setCurrentLesson(lessonId);
    navigate(`/courses/introduction-modern-economics/${lessonId}`);
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          courseId="introduction-modern-economics"
          courseTitle="Introduction to Modern Economics"
          currentLesson={currentLesson}
          totalLessons={lessons.length}
        >
          <div className="min-h-screen bg-gradient-to-br from-background to-muted/20" style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${economicsBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}>
            <CourseHeader 
              onDashboard={handleDashboard} 
              onBackToCourses={handleBackToCourses}
              courseTitle="Introduction to Modern Economics"
            />
          
            <div className="container mx-auto px-4 py-8 space-y-8">
              {/* Course Title and Description */}
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">Introduction to Modern Economics</h1>
                <p className="text-xl text-white max-w-3xl mx-auto font-medium">
                  Master the fundamental principles of modern economics, from basic market mechanisms to complex policy analysis. Build a solid foundation in economic thinking and real-world applications.
                </p>
                
                {/* Course badges */}
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
                    <Users className="w-4 h-4 mr-2" />
                    Beginner to Intermediate
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
                  courseTitle="Introduction to Modern Economics"
                  courseDescription="Master the fundamental principles of modern economics, from basic market mechanisms to complex policy analysis. Build a solid foundation in economic thinking and real-world applications."
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
                    <AccordionTrigger className="flex items-center justify-center text-center text-xl font-semibold bg-white/10 hover:bg-white/20 px-4 py-3 rounded-lg text-white border border-white/20">
                      Course Overview &amp; Learning Objectives
                    </AccordionTrigger>
                    <AccordionContent className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 mt-2">
                      <div className="space-y-6 text-white">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Why Learn Economics?</h3>
                          <p className="leading-relaxed text-white/90">
                            Economics affects every aspect of our lives, from personal financial decisions to global policy. Understanding economic principles helps you make better decisions and understand how markets, governments, and societies function.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3">What You'll Master</h3>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Market Mechanics:</strong> Supply, demand, and price determination</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Economic Indicators:</strong> GDP, inflation, unemployment, and other key metrics</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Policy Analysis:</strong> Monetary and fiscal policy impacts</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Global Economics:</strong> International trade and economic development</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Lesson Grid */}
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {lessons.map((lesson) => {
                    const isCompleted = completedLessons.includes(lesson.id);
                    const isAccessible = isLessonAccessible(lesson.id);
                    
                    return (
                      <Card 
                        key={lesson.id} 
                        className={`relative overflow-hidden transition-all duration-300 cursor-pointer group h-48 ${
                          !isAccessible 
                            ? 'opacity-50 cursor-not-allowed bg-muted/50' 
                            : isCompleted 
                              ? 'ring-2 ring-green-500 bg-green-50/50 dark:bg-green-950/30' 
                              : 'hover:shadow-lg hover:-translate-y-1 bg-card/95 backdrop-blur-sm'
                        }`}
                        onClick={() => isAccessible && handleLessonSelect(lesson.id)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="secondary" className={`text-xs px-2 py-1 ${lesson.unitColor} font-medium`}>
                              {lesson.unit}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-bold text-muted-foreground">
                                {lesson.id}
                              </span>
                              {isCompleted && (
                                <Award className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                          </div>
                          <CardTitle className="text-lg font-semibold line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                            {lesson.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                            {lesson.description}
                          </p>
                          
                          <div className="absolute bottom-4 right-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                              isCompleted 
                                ? 'bg-green-500 text-white' 
                                : isAccessible 
                                  ? 'bg-primary text-primary-foreground group-hover:bg-primary/80' 
                                  : 'bg-muted text-muted-foreground'
                            }`}>
                              {isCompleted ? '✓' : lesson.id}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Enhanced Course Information */}
              <div className="max-w-4xl mx-auto">
                <Accordion 
                  type="single" 
                  collapsible 
                  className="w-full space-y-4"
                  value={accordionOpen}
                  onValueChange={setAccordionOpen}
                >
                  <AccordionItem value="enhanced-course-info">
                    <AccordionTrigger className="flex items-center justify-center text-center text-xl font-semibold bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-4 py-3 rounded-lg text-blue-900 dark:text-blue-100">
                      Enhanced Economics Course Information
                    </AccordionTrigger>
                    <AccordionContent className="prose prose-gray max-w-none text-sm relative">
                      <div className="space-y-6 pr-12">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Course Overview</h3>
                          <p className="text-white leading-relaxed">
                            This comprehensive economics course provides a thorough introduction to modern economic principles and their real-world applications. From basic market mechanisms to complex policy analysis, you'll develop the analytical skills needed to understand and evaluate economic phenomena.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3">Learning Objectives</h3>
                          <ul className="space-y-2 text-white">
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span>Understand fundamental economic concepts including scarcity, opportunity cost, and trade-offs</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span>Analyze supply and demand dynamics and their impact on market prices</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span>Evaluate different market structures and their characteristics</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span>Interpret key economic indicators and their significance</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span>Understand monetary and fiscal policy tools and their effects</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span>Analyze international trade principles and global economic relationships</span>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3">Course Structure</h3>
                          <p className="text-white mb-3">The course is organized into three progressive units:</p>
                          <div className="space-y-3">
                            <div className="bg-blue-50/10 p-3 rounded-lg">
                              <h4 className="font-semibold text-blue-200 mb-2">Unit 1: Economic Foundations</h4>
                              <p className="text-white text-sm">Introduction to Economics, Supply and Demand, Market Structures</p>
                            </div>
                            <div className="bg-green-50/10 p-3 rounded-lg">
                              <h4 className="font-semibold text-green-200 mb-2">Unit 2: Economic Measurement</h4>
                              <p className="text-white text-sm">Economic Indicators, Monetary Policy</p>
                            </div>
                            <div className="bg-purple-50/10 p-3 rounded-lg">
                              <h4 className="font-semibold text-purple-200 mb-2">Unit 3: Policy & Growth</h4>
                              <p className="text-white text-sm">Fiscal Policy, International Trade, Economic Growth & Development</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </InteractiveCourseWrapper>
      </VoiceSettingsProvider>
    );
  }

  // Individual lesson view
  const selectedLesson = lessons.find(lesson => lesson.id === currentLesson);
  if (selectedLesson) {
    const LessonComponent = selectedLesson.component;
    
    return (
      <VoiceSettingsProvider>
        <InteractiveCourseWrapper
          courseId="introduction-modern-economics"
          courseTitle="Introduction to Modern Economics"
          currentLesson={currentLesson}
          totalLessons={lessons.length}
        >
          <InteractiveLessonWrapper
            courseId="introduction-modern-economics"
            lessonId={currentLesson}
            lessonTitle={selectedLesson.title}
            onComplete={() => handleLessonComplete(currentLesson)}
            onNext={currentLesson < lessons.length ? handleNextLesson : undefined}
            hasNext={currentLesson < lessons.length}
          >
            <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
              <div className="container mx-auto px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/courses/introduction-modern-economics')}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Course
                  </Button>
                  
                  <div className="flex items-center gap-4">
                    {currentLesson > 1 && (
                      <Button
                        variant="outline"
                        onClick={handlePrevLesson}
                        className="flex items-center gap-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>
                    )}
                    
                    {currentLesson < lessons.length && (
                      <Button
                        onClick={handleNextLesson}
                        className="flex items-center gap-2"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <LessonComponent />
              </div>
            </div>
          </InteractiveLessonWrapper>
        </InteractiveCourseWrapper>
      </VoiceSettingsProvider>
    );
  }

  return null;
};

export default InteractiveEconomicsCoursePage;