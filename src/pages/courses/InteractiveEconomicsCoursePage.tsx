import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Clock, Users, Trophy } from 'lucide-react';
import { InteractiveCourseWrapper } from '@/components/course/InteractiveCourseWrapper';
import { useInteractiveCourseProgress } from '@/hooks/useInteractiveCourseProgress';
import economicsBackground from '@/assets/economics-background.jpg';

// Import micro-lesson components
import { EconomicsIntroductionMicroLesson } from '@/components/micro-lessons/economics/EconomicsIntroductionMicroLesson';
import { EconomicsSupplyDemandMicroLesson } from '@/components/micro-lessons/economics/EconomicsSupplyDemandMicroLesson';
import { EconomicsMarketStructuresMicroLesson } from '@/components/micro-lessons/economics/EconomicsMarketStructuresMicroLesson';
import { EconomicsIndicatorsMicroLesson } from '@/components/micro-lessons/economics/EconomicsIndicatorsMicroLesson';
import { EconomicsMonetaryPolicyMicroLesson } from '@/components/micro-lessons/economics/EconomicsMonetaryPolicyMicroLesson';
import { EconomicsFiscalPolicyMicroLesson } from '@/components/micro-lessons/economics/EconomicsFiscalPolicyMicroLesson';
import { EconomicsInternationalTradeMicroLesson } from '@/components/micro-lessons/economics/EconomicsInternationalTradeMicroLesson';
import { EconomicsGrowthDevelopmentMicroLesson } from '@/components/micro-lessons/economics/EconomicsGrowthDevelopmentMicroLesson';

const InteractiveEconomicsCoursePage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  
  const courseId = 'introduction-modern-economics';
  const courseTitle = 'Introduction to Modern Economics';
  const { completedLessons, saveLessonCompletion } = useInteractiveCourseProgress(courseId);

  const lessons = [
    { id: '1', title: 'Introduction to Economics', component: EconomicsIntroductionMicroLesson, unit: 1 },
    { id: '2', title: 'Supply and Demand', component: EconomicsSupplyDemandMicroLesson, unit: 1 },
    { id: '3', title: 'Market Structures', component: EconomicsMarketStructuresMicroLesson, unit: 1 },
    { id: '4', title: 'Economic Indicators', component: EconomicsIndicatorsMicroLesson, unit: 2 },
    { id: '5', title: 'Monetary Policy', component: EconomicsMonetaryPolicyMicroLesson, unit: 2 },
    { id: '6', title: 'Fiscal Policy', component: EconomicsFiscalPolicyMicroLesson, unit: 3 },
    { id: '7', title: 'International Trade', component: EconomicsInternationalTradeMicroLesson, unit: 3 },
    { id: '8', title: 'Economic Growth & Development', component: EconomicsGrowthDevelopmentMicroLesson, unit: 3 }
  ];

  const units = [
    { id: 1, title: 'Economic Foundations', color: 'from-blue-500 to-purple-600', lessons: lessons.filter(l => l.unit === 1) },
    { id: 2, title: 'Economic Measurement', color: 'from-green-500 to-teal-600', lessons: lessons.filter(l => l.unit === 2) },
    { id: 3, title: 'Economic Policy & Growth', color: 'from-orange-500 to-red-600', lessons: lessons.filter(l => l.unit === 3) }
  ];

  const currentLesson = lessons.find(lesson => lesson.id === lessonId);
  
  const handleLessonComplete = async () => {
    if (currentLesson) {
      await saveLessonCompletion(parseInt(currentLesson.id), currentLesson.title);
    }
  };

  const handleNextLesson = () => {
    const currentIndex = lessons.findIndex(lesson => lesson.id === lessonId);
    const nextLesson = lessons[currentIndex + 1];
    if (nextLesson) {
      navigate(`/courses/introduction-modern-economics/${nextLesson.id}`);
    }
  };

  const hasNextLesson = () => {
    const currentIndex = lessons.findIndex(lesson => lesson.id === lessonId);
    return currentIndex < lessons.length - 1;
  };

  // If we have a lessonId, render the lesson
  if (lessonId && currentLesson) {
    const LessonComponent = currentLesson.component;
    
    return (
      <InteractiveCourseWrapper
        courseId={courseId}
        courseTitle={courseTitle}
        currentLesson={parseInt(lessonId)}
        totalLessons={lessons.length}
      >
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate('/courses/introduction-modern-economics')}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Course Overview
              </Button>
              <h1 className="text-3xl font-bold">{currentLesson.title}</h1>
            </div>
            
            <LessonComponent
              onComplete={handleLessonComplete}
              onNext={hasNextLesson() ? handleNextLesson : undefined}
              hasNext={hasNextLesson()}
            />
          </div>
        </div>
      </InteractiveCourseWrapper>
    );
  }

  // Course overview
  return (
    <InteractiveCourseWrapper
      courseId={courseId}
      courseTitle={courseTitle}
      currentLesson={null}
      totalLessons={lessons.length}
    >
      <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${economicsBackground})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard/learner/courses')}
              className="mb-6 text-white hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Courses
            </Button>
            
            <h1 className="text-5xl font-bold text-white mb-4">
              Introduction to Modern Economics
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Master the fundamental principles of economics, from basic supply and demand to complex macroeconomic policies
            </p>
            
            <div className="flex justify-center gap-4 flex-wrap mb-8">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <BookOpen className="w-4 h-4 mr-2" />
                8 Interactive Lessons
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                Self-Paced Learning
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                Beginner Friendly
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Trophy className="w-4 h-4 mr-2" />
                Certificate Ready
              </Badge>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="mb-8">
              <AccordionItem value="overview" className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg mb-4">
                <AccordionTrigger className="text-white px-6 hover:no-underline">
                  Course Overview & Learning Objectives
                </AccordionTrigger>
                <AccordionContent className="text-white/90 px-6 pb-6">
                  <div className="space-y-4">
                    <p>
                      This comprehensive course introduces you to the fundamental concepts of modern economics. 
                      You'll learn how markets work, understand economic indicators, and explore the policies 
                      that shape our economic world.
                    </p>
                    <div>
                      <h4 className="font-semibold mb-2">Learning Objectives:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Understand basic economic principles like scarcity and opportunity cost</li>
                        <li>Analyze how supply and demand determine prices in markets</li>
                        <li>Compare different market structures and their characteristics</li>
                        <li>Interpret key economic indicators like GDP, inflation, and unemployment</li>
                        <li>Evaluate the effects of monetary and fiscal policies</li>
                        <li>Examine the benefits and challenges of international trade</li>
                        <li>Explore factors that drive economic growth and development</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="space-y-8">
              {units.map((unit) => (
                <div key={unit.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${unit.color} text-white font-semibold mb-4`}>
                    Unit {unit.id}: {unit.title}
                  </div>
                  
                  <div className="grid gap-4">
                    {unit.lessons.map((lesson) => {
                      const isCompleted = completedLessons.has(parseInt(lesson.id));
                      
                      return (
                        <div
                          key={lesson.id}
                          className={`flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer ${
                            isCompleted ? 'ring-2 ring-green-400/50' : ''
                          }`}
                          onClick={() => navigate(`/courses/introduction-modern-economics/${lesson.id}`)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                              isCompleted 
                                ? 'bg-green-500 text-white' 
                                : 'bg-white/20 text-white'
                            }`}>
                              {isCompleted ? '✓' : lesson.id}
                            </div>
                            <div>
                              <h3 className="text-white font-medium">{lesson.title}</h3>
                              <p className="text-white/70 text-sm">Interactive micro-lesson with practice exercises</p>
                            </div>
                          </div>
                          
                          <Button
                            variant={isCompleted ? "secondary" : "default"}
                            size="sm"
                          >
                            {isCompleted ? 'Review' : 'Start'}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </InteractiveCourseWrapper>
  );
};

export default InteractiveEconomicsCoursePage;