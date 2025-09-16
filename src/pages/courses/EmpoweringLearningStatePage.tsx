import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InteractiveCourseWrapper } from '@/components/course/InteractiveCourseWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Award, ChevronLeft, ChevronRight, Brain } from 'lucide-react';
import CourseHeader from '@/components/course/CourseHeader';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';

// Import lesson components
import { IntroductionLesson } from '@/components/course/learning-state-lessons/IntroductionLesson';
import { TechniquesLesson } from '@/components/course/learning-state-lessons/TechniquesLesson';
import { BigStrongTreeLesson } from '@/components/course/learning-state-lessons/BigStrongTreeLesson';
import { EnergyBearLesson } from '@/components/course/learning-state-lessons/EnergyBearLesson';
import { FiveFourThreeTwoOneLesson } from '@/components/course/learning-state-lessons/FiveFourThreeTwoOneLesson';
import { LabyrinthLesson } from '@/components/course/learning-state-lessons/LabyrinthLesson';
import { BreathingLesson } from '@/components/course/learning-state-lessons/BreathingLesson';
import { PhoenixBreathLesson } from '@/components/course/learning-state-lessons/PhoenixBreathLesson';
import { SandTimerLesson } from '@/components/course/learning-state-lessons/SandTimerLesson';
import { RaisingBookScreenLesson } from '@/components/course/learning-state-lessons/RaisingBookScreenLesson';
import { LookingUpLesson } from '@/components/course/learning-state-lessons/LookingUpLesson';
import { WorkingTimeLimitsLesson } from '@/components/course/learning-state-lessons/WorkingTimeLimitsLesson';

interface Lesson {
  id: number;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  unit: string;
  unitColor: string;
}

const lessons: Lesson[] = [
  { id: 1, title: "Introduction", description: "Getting Into The Most Effective Learning State", component: IntroductionLesson, unit: "Foundation", unitColor: "bg-blue-100 text-blue-700" },
  { id: 2, title: "Learning Techniques", description: "Overview of techniques for optimal learning", component: TechniquesLesson, unit: "Foundation", unitColor: "bg-blue-100 text-blue-700" },
  { id: 3, title: "Big Strong Tree", description: "Planting and grounding technique", component: BigStrongTreeLesson, unit: "Grounding Techniques", unitColor: "bg-green-100 text-green-700" },
  { id: 4, title: "Your Energy Bear", description: "Using your energy bear for grounding", component: EnergyBearLesson, unit: "Grounding Techniques", unitColor: "bg-green-100 text-green-700" },
  { id: 5, title: "5, 4, 3, 2, 1 Technique", description: "Sensory grounding method", component: FiveFourThreeTwoOneLesson, unit: "Grounding Techniques", unitColor: "bg-green-100 text-green-700" },
  { id: 6, title: "Labyrinths", description: "Using labyrinths for focus and brain integration", component: LabyrinthLesson, unit: "Focus Techniques", unitColor: "bg-purple-100 text-purple-700" },
  { id: 7, title: "Box Breathing", description: "Breathing technique for calm and control", component: BreathingLesson, unit: "Breathing Techniques", unitColor: "bg-indigo-100 text-indigo-700" },
  { id: 8, title: "Phoenix Flames Breath", description: "Empowering breath technique", component: PhoenixBreathLesson, unit: "Breathing Techniques", unitColor: "bg-indigo-100 text-indigo-700" },
  { id: 9, title: "Sand Timer", description: "Using timers for regulation and focus", component: SandTimerLesson, unit: "Regulation Tools", unitColor: "bg-orange-100 text-orange-700" },
  { id: 10, title: "Raising Book/Screen", description: "Optimal positioning for learning materials", component: RaisingBookScreenLesson, unit: "Learning Environment", unitColor: "bg-yellow-100 text-yellow-700" },
  { id: 11, title: "Looking Up", description: "Visual positioning techniques", component: LookingUpLesson, unit: "Learning Environment", unitColor: "bg-yellow-100 text-yellow-700" },
  { id: 12, title: "Working Time Limits", description: "Managing focus and concentration periods", component: WorkingTimeLimitsLesson, unit: "Learning Environment", unitColor: "bg-yellow-100 text-yellow-700" }
];

export const EmpoweringLearningStatePage: React.FC = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [currentLesson, setCurrentLesson] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  useEffect(() => {
    const storageKey = 'learning-state-completed-lessons';
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setCompletedLessons(JSON.parse(stored));
      } catch (error) {
        console.warn('Failed to parse stored progress:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (completedLessons.length > 0) {
      localStorage.setItem('learning-state-completed-lessons', JSON.stringify(completedLessons));
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

  const handleNextLesson = useCallback(() => {
    if (currentLesson !== null && currentLesson < lessons.length) {
      const nextLesson = currentLesson + 1;
      setCurrentLesson(nextLesson);
      navigate(`/courses/empowering-learning-state/${nextLesson}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigate]);

  const handlePrevLesson = useCallback(() => {
    if (currentLesson !== null && currentLesson > 1) {
      const prevLesson = currentLesson - 1;
      setCurrentLesson(prevLesson);
      navigate(`/courses/empowering-learning-state/${prevLesson}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigate]);

  const handleBackToCourses = useCallback(() => {
    navigate('/dashboard/learner/courses');
  }, [navigate]);

  const progress = useMemo(() => (completedLessons.length / lessons.length) * 100, [completedLessons.length]);

  // Course overview
  if (currentLesson === null) {
    return (
      <VoiceSettingsProvider>
        <InteractiveCourseWrapper
          courseId="empowering-learning-state"
          courseTitle="Empowering Learning State"
          currentLesson={currentLesson}
          totalLessons={lessons.length}
        >
          <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            <CourseHeader 
              onDashboard={() => navigate('/dashboard/learner')} 
              onBackToCourses={handleBackToCourses}
              courseTitle="Empowering Learning State"
            />
          
            <div className="container mx-auto px-4 py-8 space-y-8">
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">Empowering Learning State</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Master techniques to achieve optimal learning states and create calm, focused environments for effective learning.
                </p>
                
                <div className="flex justify-center gap-4 flex-wrap">
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    <Brain className="w-4 h-4 mr-2" />
                    {lessons.length} Modules
                  </Badge>
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    <Clock className="w-4 h-4 mr-2" />
                    ~3 Hours
                  </Badge>
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    <Users className="w-4 h-4 mr-2" />
                    All Levels
                  </Badge>
                </div>

                <div className="max-w-md mx-auto">
                  <Progress value={progress} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    {completedLessons.length} of {lessons.length} lessons completed
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {lessons.map((lesson) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  return (
                    <Card key={lesson.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Badge className={lesson.unitColor}>Lesson {lesson.id}</Badge>
                          {isCompleted && <Award className="h-5 w-5 text-primary" />}
                        </div>
                        <CardTitle className="text-lg">{lesson.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{lesson.description}</p>
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => setCurrentLesson(lesson.id)}
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
  if (!currentLessonData) return <div>Lesson not found</div>;

  const hasNext = currentLesson < lessons.length;
  const hasPrev = currentLesson > 1;
  const LessonComponent = currentLessonData.component;

  return (
    <VoiceSettingsProvider>
      <InteractiveCourseWrapper 
        courseId="empowering-learning-state"
        courseTitle="Empowering Learning State"
        currentLesson={currentLesson}
        totalLessons={lessons.length}
      >
        <div className="min-h-screen">
          <CourseHeader 
            onBackToCourses={() => navigate('/courses/empowering-learning-state')}
            onDashboard={() => navigate('/dashboard/learner')}
            courseTitle="Empowering Learning State"
          />
          
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <Button variant="outline" onClick={handlePrevLesson} disabled={!hasPrev}>
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Lesson {currentLesson} of {lessons.length}
              </span>
              <Button variant="outline" onClick={handleNextLesson} disabled={!hasNext}>
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <LessonComponent onComplete={() => handleLessonComplete(currentLesson)} />
          </div>
        </div>
      </InteractiveCourseWrapper>
    </VoiceSettingsProvider>
  );
};

export default EmpoweringLearningStatePage;