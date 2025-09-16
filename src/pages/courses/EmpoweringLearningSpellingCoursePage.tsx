import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InteractiveCourseWrapper } from '@/components/course/InteractiveCourseWrapper';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Award, ChevronLeft, ChevronRight, PenTool } from 'lucide-react';
import CourseHeader from '@/components/course/CourseHeader';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';
import CourseOverviewTTS from '@/components/course/CourseOverviewTTS';
import CourseOverviewVideo from '@/components/course/CourseOverviewVideo';
import empoweringSpellingBg from '@/assets/empowering-spelling-unique-bg.jpg';
import { SpellingCourseWrapper } from '@/components/course/SpellingCourseWrapper';
import { StandardCourseAudioSection } from '@/components/course/StandardCourseAudioSection';
import { StandardLessonAudioButtons } from '@/components/course/StandardLessonAudioButtons';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Import lesson components
import { IntroductionLesson } from '@/components/course/spelling-lessons/IntroductionLesson';
import { OptimalLearningStateLesson } from '@/components/course/spelling-lessons/OptimalLearningStateLesson';
import { EmpoweringLearningNounsLesson } from '@/components/course/spelling-lessons/EmpoweringLearningNounsLesson';
import { SpellingTechniqueLesson } from '@/components/course/spelling-lessons/SpellingTechniqueLesson';
import { FinalTipsLesson } from '@/components/course/spelling-lessons/FinalTipsLesson';
import { MindBodyConnectionLesson } from '@/components/course/spelling-lessons/MindBodyConnectionLesson';
import { VisualMemoryLesson } from '@/components/course/spelling-lessons/VisualMemoryLesson';
import { AdvancedTechniquesLesson } from '@/components/course/spelling-lessons/AdvancedTechniquesLesson';
import { CelebratingSuccessLesson } from '@/components/course/spelling-lessons/CelebratingSuccessLesson';
import { QuizLesson } from '@/components/course/spelling-lessons/QuizLesson';
import { EssayQuestionsLesson } from '@/components/course/spelling-lessons/EssayQuestionsLesson';
import { GlossaryLesson } from '@/components/course/spelling-lessons/GlossaryLesson';

interface Lesson {
  id: number;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  unit: string;
  unitColor: string;
}

const lessons: Lesson[] = [
  { id: 1, title: "Introduction", description: "Welcome to the programme with Allen O'Donoghue", component: IntroductionLesson, unit: "Welcome to the Programme", unitColor: "bg-blue-100 text-blue-700" },
  { id: 2, title: "The Optimal Learning State", description: "Learn to achieve the calm state needed for effective learning", component: OptimalLearningStateLesson, unit: "The Learning Process", unitColor: "bg-green-100 text-green-700" },
  { id: 3, title: "Empowering Learning - Nouns", description: "Foundation concepts for visual spelling with nouns", component: EmpoweringLearningNounsLesson, unit: "The Learning Process", unitColor: "bg-green-100 text-green-700" },
  { id: 4, title: "The Spelling Technique - Step by Step", description: "Master the complete visual spelling method", component: SpellingTechniqueLesson, unit: "The Learning Process", unitColor: "bg-green-100 text-green-700" },
  { id: 5, title: "Final Tips", description: "Essential tips for success with the technique", component: FinalTipsLesson, unit: "Final Tips for Success", unitColor: "bg-yellow-100 text-yellow-700" },
  { id: 6, title: "The Power of the Optimal Learning State", description: "Understanding the mind-body connection in learning", component: MindBodyConnectionLesson, unit: "The Mind-Body Connection", unitColor: "bg-purple-100 text-purple-700" },
  { id: 7, title: "The Power of Visualising", description: "Harness your visual memory for spelling success", component: VisualMemoryLesson, unit: "The Visual Memory System", unitColor: "bg-indigo-100 text-indigo-700" },
  { id: 8, title: "The Swan & The Whiteboard", description: "Advanced techniques for optimal visual learning", component: AdvancedTechniquesLesson, unit: "Advanced Techniques", unitColor: "bg-red-100 text-red-700" },
  { id: 9, title: "The Final Word", description: "Celebrating your success and next steps", component: CelebratingSuccessLesson, unit: "Celebrating Success", unitColor: "bg-orange-100 text-orange-700" },
  { id: 10, title: "Quiz - Short Answer Questions", description: "Test your understanding with focused questions", component: QuizLesson, unit: "Study Guide & Review", unitColor: "bg-gray-100 text-gray-700" },
  { id: 11, title: "Essay Format Questions", description: "Explore concepts through detailed reflection", component: EssayQuestionsLesson, unit: "Study Guide & Review", unitColor: "bg-gray-100 text-gray-700" },
  { id: 12, title: "Glossary of Key Terms", description: "Reference guide for all important concepts", component: GlossaryLesson, unit: "Study Guide & Review", unitColor: "bg-gray-100 text-gray-700" }
];

export const EmpoweringLearningSpellingCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [currentLesson, setCurrentLesson] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  // Load completed lessons from localStorage on mount
  useEffect(() => {
    const storageKey = 'spelling-course-completed-lessons';
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCompletedLessons(parsed);
        console.log('📖 Loaded completed spelling lessons:', parsed);
      } catch (error) {
        console.warn('Failed to parse stored progress:', error);
      }
    }
  }, []);

  // Save completed lessons to localStorage whenever it changes
  useEffect(() => {
    if (completedLessons.length > 0) {
      const storageKey = 'spelling-course-completed-lessons';
      localStorage.setItem(storageKey, JSON.stringify(completedLessons));
      console.log('💾 Saved completed spelling lessons:', completedLessons);
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
      navigate(`/courses/empowering-learning-spelling/${nextLesson}`);
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigate]);

  const handlePrevLesson = useCallback(() => {
    if (currentLesson !== null && currentLesson > 1) {
      const prevLesson = currentLesson - 1;
      setCurrentLesson(prevLesson);
      navigate(`/courses/empowering-learning-spelling/${prevLesson}`);
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigate]);

  const handleLessonSelect = useCallback((lessonId: number) => {
    setCurrentLesson(lessonId);
    navigate(`/courses/empowering-learning-spelling/${lessonId}`);
  }, [navigate]);

  const handleBackToCourses = useCallback(() => {
    console.log('📍 Navigating back to courses');
    navigate('/dashboard/learner/courses');
  }, [navigate]);

  const handleBackToCourseOverview = useCallback(() => {
    console.log('📍 Navigating back to course overview');
    navigate('/courses/empowering-learning-spelling');
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
          courseId="empowering-learning-spelling"
          courseTitle="Empowering Learning for Spelling"
          currentLesson={currentLesson}
          totalLessons={lessons.length}
        >
          <div 
            className="min-h-screen bg-gradient-to-br from-background to-muted/20"
            style={{
              backgroundImage: `url(${empoweringSpellingBg})`,
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
              courseTitle="Empowering Learning for Spelling"
            />
          
            <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
              {/* Course Title and Description */}
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">Empowering Learning for Spelling</h1>
                <p className="text-xl text-white/90 max-w-3xl mx-auto drop-shadow-md">
                  Master spelling through visual memory techniques and optimal learning states. A comprehensive program designed for visual learners to overcome spelling challenges.
                </p>
                
                {/* Course badges */}
                <div className="flex justify-center gap-4 flex-wrap">
                  <Badge variant="outline" className="text-sm px-3 py-1 bg-white/90 text-gray-900 border-white/50">
                    <PenTool className="w-4 h-4 mr-2" />
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

              {/* Listen to Course Overview Section */}
              <div className="mb-8">
                <StandardCourseAudioSection
                  courseTitle="Empowering Learning for Spelling"
                  courseDescription="Master spelling through visual memory techniques and optimal learning states. A comprehensive program designed for visual learners to overcome spelling challenges."
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
                          <h3 className="text-lg font-semibold mb-3">Why Learn Spelling This Way?</h3>
                          <p className="leading-relaxed text-white/90">
                            Traditional spelling methods often rely on rote memorization and phonetics alone. This visual approach harnesses your natural visual memory to create lasting spelling success through systematic visualization techniques.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3">What You'll Master</h3>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Visual Memory Techniques:</strong> Use your natural visual abilities for spelling success</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Optimal Learning State:</strong> Create the calm, focused state needed for effective learning</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Step-by-Step Method:</strong> A systematic approach to visual spelling mastery</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Confidence Building:</strong> Overcome spelling challenges with proven techniques</span>
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
                videoUrl="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/A_New_Way_to_Learn_Spelling.mp4" 
                title="Empowering Learning for Spelling"
              />

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
                          console.log('📖 Lesson not accessible yet - complete previous lesson first');
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
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
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
      <SpellingCourseWrapper
        courseId="empowering-learning-spelling"
        courseTitle="Empowering Learning for Spelling"
        currentLesson={currentLesson}
        totalLessons={lessons.length}
      >
        <InteractiveCourseWrapper 
          courseId="empowering-learning-spelling"
          courseTitle="Empowering Learning for Spelling"
          currentLesson={currentLesson}
          totalLessons={lessons.length}
        >
          <div className="min-h-screen">
            <CourseHeader 
              onBackToCourses={handleBackToCourses}
              onDashboard={handleDashboard}
              courseTitle="Empowering Learning for Spelling"
            />
            
            <div className="container mx-auto px-4 py-8 max-w-6xl">
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log('🔘 Back to Overview button clicked');
                    handleBackToCourseOverview();
                  }}
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
                courseId="empowering-learning-spelling"
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
      </SpellingCourseWrapper>
    </VoiceSettingsProvider>
  );
};

export default EmpoweringLearningSpellingCoursePage;