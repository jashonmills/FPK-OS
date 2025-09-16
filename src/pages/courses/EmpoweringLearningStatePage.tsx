import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InteractiveCourseWrapper } from '@/components/course/InteractiveCourseWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Award, ChevronLeft, ChevronRight, Brain, Headphones, Play, Volume2 } from 'lucide-react';
import CourseHeader from '@/components/course/CourseHeader';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';
import learningStateBg from '@/assets/learning-state-course-bg.jpg';

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
import { UseImaginationLesson } from '@/components/course/learning-state-lessons/UseImaginationLesson';

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
  { id: 12, title: "Working Time Limits", description: "Managing focus and concentration periods", component: WorkingTimeLimitsLesson, unit: "Learning Environment", unitColor: "bg-yellow-100 text-yellow-700" },
  { id: 13, title: "Use Their Imagination", description: "Developing visualization and creative thinking", component: UseImaginationLesson, unit: "Creativity Tools", unitColor: "bg-pink-100 text-pink-700" }
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
          <div className="min-h-screen" 
               style={{
                 backgroundImage: `url(${learningStateBg})`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat',
                 backgroundAttachment: 'fixed'
               }}>
            <CourseHeader 
              onDashboard={() => navigate('/dashboard/learner')} 
              onBackToCourses={handleBackToCourses}
              courseTitle="Empowering Learning State"
            />
          
            <div className="container mx-auto px-4 py-8 space-y-8">
              {/* Hero Section */}
              <div className="text-center space-y-6 text-white">
                <h1 className="text-5xl md:text-6xl font-bold">Empowering Learning State</h1>
                <p className="text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
                  Master techniques to achieve optimal learning states and create calm, focused
                  <br />
                  environments for effective learning.
                </p>
                
                {/* Course Stats */}
                <div className="flex justify-center gap-6 flex-wrap mt-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    <span className="font-medium">{lessons.length} Lessons</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">~3 Hours</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span className="font-medium">All Levels</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="max-w-2xl mx-auto">
                  <Progress value={progress} className="h-3 mb-2 bg-white/20" />
                  <p className="text-sm text-white/80">
                    {completedLessons.length} of {lessons.length} lessons completed
                  </p>
                </div>
              </div>

              {/* Audio Overview Section */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Headphones className="w-6 h-6 text-white" />
                  <span className="text-white text-lg font-medium">Listen to Course Overview</span>
                </div>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full flex items-center gap-2 mx-auto"
                >
                  <Play className="w-5 h-5" />
                  Play Overview
                </Button>
              </div>

              {/* Individual Lesson Audio Buttons */}
              <div className="text-center mb-8">
                <p className="text-white text-lg mb-4">Or listen to individual lesson descriptions:</p>
                <div className="flex flex-wrap justify-center gap-3 max-w-6xl mx-auto">
                  {lessons.map((lesson) => (
                    <Button 
                      key={lesson.id}
                      variant="outline" 
                      size="sm"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full flex items-center gap-2"
                    >
                      <Volume2 className="w-4 h-4" />
                      Lesson {lesson.id}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Lesson Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {lessons.map((lesson) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  return (
                    <Card key={lesson.id} className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-purple-600 text-white">Lesson {lesson.id}</Badge>
                          {isCompleted && <Award className="h-5 w-5 text-amber-500" />}
                        </div>
                        <CardTitle className="text-lg font-bold text-gray-900">{lesson.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{lesson.description}</p>
                        <Button 
                          size="sm" 
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full"
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
        <div className="min-h-screen"
             style={{
               backgroundImage: `url(${learningStateBg})`,
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               backgroundRepeat: 'no-repeat',
               backgroundAttachment: 'fixed'
             }}>
          <CourseHeader 
            onBackToCourses={handleBackToCourses}
            onDashboard={() => navigate('/dashboard/learner')}
            courseTitle="Empowering Learning State"
          />
          
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex justify-between items-center mb-6 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentLesson(null)}>
                  Back to Overview
                </Button>
                <Button variant="outline" onClick={handlePrevLesson} disabled={!hasPrev}>
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                Lesson {currentLesson} of {lessons.length}
              </span>
              <Button variant="outline" onClick={handleNextLesson} disabled={!hasNext}>
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <LessonComponent onComplete={() => handleLessonComplete(currentLesson)} />
            </div>
          </div>
        </div>
      </InteractiveCourseWrapper>
    </VoiceSettingsProvider>
  );
};

export default EmpoweringLearningStatePage;