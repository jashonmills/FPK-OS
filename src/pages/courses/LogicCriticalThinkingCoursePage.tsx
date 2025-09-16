import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InteractiveCourseWrapper } from '@/components/course/InteractiveCourseWrapper';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Award, ChevronLeft, ChevronRight, X, Brain, Target, Lightbulb } from 'lucide-react';
import CourseHeader from '@/components/course/CourseHeader';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';
import CourseOverviewTTS from '@/components/course/CourseOverviewTTS';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { StandardCourseAudioSection } from '@/components/course/StandardCourseAudioSection';
import { StandardLessonAudioButtons } from '@/components/course/StandardLessonAudioButtons';

// Import background image
import logicBg from '@/assets/logic-background.jpg';

// Import micro-lesson components
import { LogicIntroductionMicroLesson } from '@/components/micro-lessons/logic/LogicIntroductionMicroLesson';
import { LogicArgumentsMicroLesson } from '@/components/micro-lessons/logic/LogicArgumentsMicroLesson';
import { LogicIdentificationMicroLesson } from '@/components/micro-lessons/logic/LogicIdentificationMicroLesson';
import { LogicEvaluationMicroLesson } from '@/components/micro-lessons/logic/LogicEvaluationMicroLesson';
import { LogicDeductiveMicroLesson } from '@/components/micro-lessons/logic/LogicDeductiveMicroLesson';
import { LogicFormsMicroLesson } from '@/components/micro-lessons/logic/LogicFormsMicroLesson';
import { LogicComplexMicroLesson } from '@/components/micro-lessons/logic/LogicComplexMicroLesson';
import { LogicTestingMicroLesson } from '@/components/micro-lessons/logic/LogicTestingMicroLesson';
import { LogicInductiveMicroLesson } from '@/components/micro-lessons/logic/LogicInductiveMicroLesson';

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
  { id: 1, title: "What is Critical Thinking?", description: "Explore the foundations of rational thought and learn to distinguish between automatic thinking and deliberate reasoning", component: LogicIntroductionMicroLesson, unit: "Unit 1: Foundations", unitColor: "bg-green-100 text-green-700" },
  { id: 2, title: "Arguments vs. Opinions", description: "Learn to identify and differentiate between arguments, opinions, and personal beliefs", component: LogicArgumentsMicroLesson, unit: "Unit 1: Foundations", unitColor: "bg-green-100 text-green-700" },
  { id: 3, title: "Identifying Arguments in Context", description: "Practice recognizing arguments in real-world scenarios and everyday conversations", component: LogicIdentificationMicroLesson, unit: "Unit 1: Foundations", unitColor: "bg-green-100 text-green-700" },
  { id: 4, title: "Evaluating Argument Quality", description: "Develop skills to assess the strength and validity of different arguments", component: LogicEvaluationMicroLesson, unit: "Unit 2: Analysis", unitColor: "bg-blue-100 text-blue-700" },
  { id: 5, title: "What is Deductive Reasoning?", description: "Master the principles of deductive logic and logical inference", component: LogicDeductiveMicroLesson, unit: "Unit 2: Analysis", unitColor: "bg-blue-100 text-blue-700" },
  { id: 6, title: "Basic Logical Forms", description: "Learn fundamental logical structures and patterns of reasoning", component: LogicFormsMicroLesson, unit: "Unit 2: Analysis", unitColor: "bg-blue-100 text-blue-700" },
  { id: 7, title: "Complex Deductive Arguments", description: "Tackle advanced deductive reasoning and multi-step logical arguments", component: LogicComplexMicroLesson, unit: "Unit 3: Advanced", unitColor: "bg-purple-100 text-purple-700" },
  { id: 8, title: "Testing Deductive Arguments", description: "Apply systematic methods to validate and verify logical arguments", component: LogicTestingMicroLesson, unit: "Unit 3: Advanced", unitColor: "bg-purple-100 text-purple-700" },
  { id: 9, title: "The Nature of Inductive Arguments", description: "Understand inductive reasoning and its role in critical thinking", component: LogicInductiveMicroLesson, unit: "Unit 3: Advanced", unitColor: "bg-purple-100 text-purple-700" }
];

const LogicCriticalThinkingCoursePage: React.FC = () => {
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
      navigate(`/courses/logic-critical-thinking/${nextLesson}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigate]);

  const handleLessonSelect = useCallback((lessonId: number) => {
    setCurrentLesson(lessonId);
    navigate(`/courses/logic-critical-thinking/${lessonId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const handleBackToCourses = useCallback(() => {
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
          courseId="logic-critical-thinking"
          courseTitle="Logic and Critical Thinking"
          currentLesson={currentLesson}
          totalLessons={lessons.length}
        >
          <div className="min-h-screen bg-gradient-to-br from-background to-muted/20" style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${logicBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}>
            <CourseHeader 
              onDashboard={handleDashboard} 
              onBackToCourses={handleBackToCourses}
              courseTitle="Logic and Critical Thinking"
            />
          
            <div className="container mx-auto px-4 py-8 space-y-8">
              {/* Course Title and Description */}
              <div className="text-center space-y-4">
                <div className="flex justify-center items-center gap-3 mb-4">
                  <Brain className="w-12 h-12 text-purple-400" />
                  <h1 className="text-4xl font-bold text-white drop-shadow-lg">Logic and Critical Thinking</h1>
                  <Lightbulb className="w-12 h-12 text-purple-400" />
                </div>
                <p className="text-xl text-white max-w-3xl mx-auto font-medium">
                  Master the art of rational thinking and logical reasoning. Develop critical thinking skills 
                  to analyze arguments, identify fallacies, and make sound decisions in academic and personal contexts.
                </p>
                
                {/* Course badges */}
                <div className="flex justify-center gap-4 flex-wrap">
                  <Badge variant="secondary" className="text-sm px-3 py-1 bg-white/90 text-gray-800 border-white/20">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {lessons.length} Lessons
                  </Badge>
                  <Badge variant="secondary" className="text-sm px-3 py-1 bg-white/90 text-gray-800 border-white/20">
                    <Clock className="w-4 h-4 mr-2" />
                    ~4 Hours
                  </Badge>
                  <Badge variant="secondary" className="text-sm px-3 py-1 bg-white/90 text-gray-800 border-white/20">
                    <Target className="w-4 h-4 mr-2" />
                    Critical Analysis
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
                  courseTitle="Logic and Critical Thinking"
                  courseDescription="Master the art of rational thinking and logical reasoning. Develop critical thinking skills to analyze arguments, identify fallacies, and make sound decisions in academic and personal contexts."
                />
              </div>

              {/* Individual Lesson Audio Buttons */}
              <div className="mb-8">
                <StandardLessonAudioButtons lessons={lessons} />
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
                  <AccordionItem value="course-info">
                    <AccordionTrigger className="flex items-center justify-center text-center text-xl font-semibold bg-white/30 hover:bg-white/40 px-4 py-3 rounded-lg text-white border border-white/20">
                      Course Overview &amp; Learning Objectives
                    </AccordionTrigger>
                    <AccordionContent className="prose prose-gray max-w-none text-sm relative">
                      <div className="space-y-6 pr-12">
                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-white">Why Learn Critical Thinking?</h3>
                          <p className="text-white leading-relaxed">
                            Critical thinking is the foundation of good decision-making, academic success, and effective communication. It helps you evaluate information objectively, avoid logical fallacies, and construct persuasive arguments based on evidence and reason.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-white">What You'll Master</h3>
                          <ul className="space-y-2 text-white">
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Critical Analysis:</strong> Distinguish between facts, opinions, and arguments</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Argument Evaluation:</strong> Assess the strength and validity of reasoning</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Deductive Reasoning:</strong> Master logical forms and valid inference patterns</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Inductive Reasoning:</strong> Understand probabilistic reasoning and pattern recognition</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Real-World Application:</strong> Apply logical thinking to everyday decisions and academic work</span>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-white">Interactive Learning Experience</h3>
                          <p className="text-white mb-3">This course uses a micro-lesson approach with:</p>
                          <ul className="space-y-1 text-white">
                            <li className="flex gap-3"><span className="font-medium text-foreground">•</span> Clear explanations of logical concepts and principles</li>
                            <li className="flex gap-3"><span className="font-medium text-foreground">•</span> Real-world examples from news, advertisements, and conversations</li>
                            <li className="flex gap-3"><span className="font-medium text-foreground">•</span> Practice exercises to test your understanding</li>
                            <li className="flex gap-3"><span className="font-medium text-foreground">•</span> Progressive difficulty building from basic to advanced reasoning</li>
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
            <p className="text-white mb-4 font-medium">
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
  const LessonComponent = currentLessonData.component;

  return (
    <VoiceSettingsProvider>
      <InteractiveCourseWrapper 
        courseId="logic-critical-thinking"
        courseTitle="Logic and Critical Thinking"
        currentLesson={currentLesson}
        totalLessons={lessons.length}
      >
        <div className="min-h-screen bg-background" style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${logicBg})`,
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
                onClick={() => setCurrentLesson(null)}
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
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-white">
                  {currentLesson} of {lessons.length}
                </span>
                <Progress value={(currentLesson / lessons.length) * 100} className="w-20 h-2" />
              </div>
            </div>

            <InteractiveLessonWrapper
              courseId="logic-critical-thinking"
              lessonId={currentLesson}
              lessonTitle={currentLessonData.title}
              onComplete={() => handleLessonComplete(currentLessonData.id)}
              onNext={handleNextLesson}
              hasNext={hasNext}
              totalLessons={lessons.length}
            >
              <LessonComponent 
                onComplete={() => handleLessonComplete(currentLessonData.id)}
                onNext={handleNextLesson}
                hasNext={hasNext}
              />
            </InteractiveLessonWrapper>
          </div>
        </div>
      </InteractiveCourseWrapper>
    </VoiceSettingsProvider>
  );
};

export default LogicCriticalThinkingCoursePage;