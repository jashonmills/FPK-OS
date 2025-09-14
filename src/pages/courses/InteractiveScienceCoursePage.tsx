import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InteractiveCourseWrapper } from '@/components/course/InteractiveCourseWrapper';
import { InteractiveLessonWrapper } from '@/components/course/InteractiveLessonWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import CourseHeader from '@/components/course/CourseHeader';
import { VoiceSettingsProvider } from '@/contexts/VoiceSettingsContext';
import CourseOverviewTTS from '@/components/course/CourseOverviewTTS';
import CourseOverviewVideo from '@/components/course/CourseOverviewVideo';

// Import lesson components
import { ScientificMethodLesson } from '@/components/course/science-lessons/ScientificMethodLesson';
import { ImportanceOfScienceLesson } from '@/components/course/science-lessons/ImportanceOfScienceLesson';
import { CellStructureLesson } from '@/components/course/science-lessons/CellStructureLesson';
import { GeneticsAndDNALesson } from '@/components/course/science-lessons/GeneticsAndDNALesson';
import { AtomsAndMoleculesLesson } from '@/components/course/science-lessons/AtomsAndMoleculesLesson';
import { PeriodicTableLesson } from '@/components/course/science-lessons/PeriodicTableLesson';
import { ForcesAndMotionLesson } from '@/components/course/science-lessons/ForcesAndMotionLesson';
import { EnergyAndWorkLesson } from '@/components/course/science-lessons/EnergyAndWorkLesson';
import { ReviewAndSummaryLesson } from '@/components/course/science-lessons/ReviewAndSummaryLesson';
import { FurtherExplorationLesson } from '@/components/course/science-lessons/FurtherExplorationLesson';
import { ShortAnswerQuestionsLesson } from '@/components/course/science-lessons/ShortAnswerQuestionsLesson';
import { StudyGuideLesson } from '@/components/course/science-lessons/StudyGuideLesson';

interface Lesson {
  id: number;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  unit: string;
  unitColor: string;
}

const lessons: Lesson[] = [
  { id: 1, title: "The Scientific Method", description: "Learn the fundamental steps of scientific inquiry and how to apply them", component: ScientificMethodLesson, unit: "Unit 1: The Scientific Method", unitColor: "bg-blue-100 text-blue-700" },
  { id: 2, title: "The Importance of Science", description: "Discover how science shapes our understanding of the world", component: ImportanceOfScienceLesson, unit: "Unit 1: The Scientific Method", unitColor: "bg-blue-100 text-blue-700" },
  { id: 3, title: "Cell Structure and Function", description: "Explore the basic building blocks of all living organisms", component: CellStructureLesson, unit: "Unit 2: Biology", unitColor: "bg-green-100 text-green-700" },
  { id: 4, title: "Genetics and DNA", description: "Understand heredity and the molecular basis of life", component: GeneticsAndDNALesson, unit: "Unit 2: Biology", unitColor: "bg-green-100 text-green-700" },
  { id: 5, title: "Atoms and Molecules", description: "Learn about the fundamental particles that make up matter", component: AtomsAndMoleculesLesson, unit: "Unit 3: Chemistry", unitColor: "bg-red-100 text-red-700" },
  { id: 6, title: "The Periodic Table", description: "Master the organization of chemical elements", component: PeriodicTableLesson, unit: "Unit 3: Chemistry", unitColor: "bg-red-100 text-red-700" },
  { id: 7, title: "Forces and Motion", description: "Discover the principles that govern how objects move", component: ForcesAndMotionLesson, unit: "Unit 4: Physics", unitColor: "bg-yellow-100 text-yellow-700" },
  { id: 8, title: "Energy and Work", description: "Understand different forms of energy and how work is done", component: EnergyAndWorkLesson, unit: "Unit 4: Physics", unitColor: "bg-yellow-100 text-yellow-700" },
  { id: 9, title: "Review and Summary", description: "Consolidate your learning with comprehensive review", component: ReviewAndSummaryLesson, unit: "Unit 5: Conclusion", unitColor: "bg-gray-100 text-gray-700" },
  { id: 10, title: "Further Exploration", description: "Explore advanced topics and real-world applications", component: FurtherExplorationLesson, unit: "Unit 5: Conclusion", unitColor: "bg-gray-100 text-gray-700" },
  { id: 11, title: "Short-Answer Questions", description: "Test your knowledge with focused practice questions", component: ShortAnswerQuestionsLesson, unit: "Unit 6: Study Guide", unitColor: "bg-purple-100 text-purple-700" },
  { id: 12, title: "Complete Study Guide", description: "Comprehensive guide for mastering all course concepts", component: StudyGuideLesson, unit: "Unit 6: Study Guide", unitColor: "bg-purple-100 text-purple-700" }
];

export const InteractiveScienceCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [currentLesson, setCurrentLesson] = useState(1);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

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

  const handleNextLesson = () => {
    if (currentLesson < lessons.length) {
      const nextLesson = currentLesson + 1;
      setCurrentLesson(nextLesson);
      navigate(`/courses/interactive-science/${nextLesson}`);
    }
  };

  const handlePrevLesson = () => {
    if (currentLesson > 1) {
      const prevLesson = currentLesson - 1;
      setCurrentLesson(prevLesson);
      navigate(`/courses/interactive-science/${prevLesson}`);
    }
  };

  const handleLessonSelect = (lessonId: number) => {
    setCurrentLesson(lessonId);
    navigate(`/courses/interactive-science/${lessonId}`);
  };

  const handleBackToCourses = () => {
    navigate('/dashboard/learner/courses');
  };

  const handleDashboard = () => {
    navigate('/dashboard/learner');
  };

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
            <Button onClick={() => navigate('/courses/interactive-science/1')}>
              Start From Beginning
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = (completedLessons.length / lessons.length) * 100;
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
        <div className="min-h-screen bg-background">
          <CourseHeader 
            onBackToCourses={handleBackToCourses}
            onDashboard={handleDashboard}
            courseTitle="Introduction to Science"
          />
          
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Course Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/dashboard/learner/courses')}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Courses
                </Button>
                <Badge className={currentLessonData.unitColor}>
                  {currentLessonData.unit}
                </Badge>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-lg shadow-sm mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Introduction to Science</h1>
                <p className="text-lg text-gray-600 mb-6">
                  Get to grips with the basics of biology, chemistry, and physics.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <span>{lessons.length} Lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span>~6 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span>Beginner Level</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-600" />
                    <span>Certificate</span>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Course Progress</span>
                    <span>{completedLessons.length}/{lessons.length} lessons completed</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>

              {/* TTS Controls */}
              <div className="mb-8">
                <CourseOverviewTTS
                  courseTitle="Introduction to Science"
                  courseDescription="Get to grips with the basics of biology, chemistry, and physics. Learn the scientific method and explore the building blocks of life and matter."
                  lessons={lessons}
                />
              </div>

              {/* Course Overview Video */}
              <div className="mb-8">
                <CourseOverviewVideo
                  videoUrl="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/A_Guide_to_the_Sciences.mp4"
                  title="A Guide to the Sciences"
                />
              </div>
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
        <div className="mb-8">
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

        {/* Lesson Navigation Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Course Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    currentLesson === lesson.id
                      ? 'bg-primary/10 border-primary'
                      : completedLessons.includes(lesson.id)
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => handleLessonSelect(lesson.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Lesson {lesson.id}</span>
                    {completedLessons.includes(lesson.id) && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{lesson.title}</h3>
                  <Badge className={`${lesson.unitColor} text-xs`}>
                    {lesson.unit}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
          </div>
        </div>
      </InteractiveCourseWrapper>
    </VoiceSettingsProvider>
  );
};

export default InteractiveScienceCoursePage;