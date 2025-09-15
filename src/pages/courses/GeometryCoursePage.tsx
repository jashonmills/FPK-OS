import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { PointsLinesPlanes } from '@/components/course/geometry-lessons/PointsLinesPlanes';
import { TrianglesLesson } from '@/components/course/geometry-lessons/TrianglesLesson';
import { QuadrilateralsLesson } from '@/components/course/geometry-lessons/QuadrilateralsLesson';
import { CirclesLesson } from '@/components/course/geometry-lessons/CirclesLesson';
import { AreaPerimeterLesson } from '@/components/course/geometry-lessons/AreaPerimeterLesson';
import { ThreeDShapesLesson } from '@/components/course/geometry-lessons/ThreeDShapesLesson';
import { TransformationsLesson } from '@/components/course/geometry-lessons/TransformationsLesson';
import { CoordinateGeometryLesson } from '@/components/course/geometry-lessons/CoordinateGeometryLesson';
import { ProofsReasoningLesson } from '@/components/course/geometry-lessons/ProofsReasoningLesson';
import { GeometryReviewLesson } from '@/components/course/geometry-lessons/GeometryReviewLesson';

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
  { id: 1, title: "Points, Lines, and Planes", description: "Learn the fundamental building blocks of geometry", component: PointsLinesPlanes, unit: "Unit 1: Foundations", unitColor: "bg-blue-100 text-blue-700" },
  { id: 2, title: "Triangles", description: "Explore triangle types, properties, and theorems", component: TrianglesLesson, unit: "Unit 2: Polygons", unitColor: "bg-green-100 text-green-700" },
  { id: 3, title: "Quadrilaterals", description: "Study squares, rectangles, parallelograms, and more", component: QuadrilateralsLesson, unit: "Unit 2: Polygons", unitColor: "bg-green-100 text-green-700" },
  { id: 4, title: "Circles", description: "Master circle properties, parts, and calculations", component: CirclesLesson, unit: "Unit 3: Circles", unitColor: "bg-purple-100 text-purple-700" },
  { id: 5, title: "Transformations", description: "Learn about reflection, rotation, translation, and scaling", component: TransformationsLesson, unit: "Unit 5: Transformations", unitColor: "bg-red-100 text-red-700" },
  { id: 6, title: "3D Shapes and Volume", description: "Explore three-dimensional geometry and volume calculations", component: ThreeDShapesLesson, unit: "Unit 4: Measurements", unitColor: "bg-orange-100 text-orange-700" },
  { id: 7, title: "Area and Perimeter", description: "Calculate area and perimeter of various shapes", component: AreaPerimeterLesson, unit: "Unit 4: Measurements", unitColor: "bg-orange-100 text-orange-700" },
  { id: 8, title: "Coordinate Geometry", description: "Apply geometry concepts to the coordinate plane", component: CoordinateGeometryLesson, unit: "Unit 5: Transformations", unitColor: "bg-red-100 text-red-700" },
  { id: 9, title: "Proofs and Reasoning", description: "Develop logical reasoning and geometric proof skills", component: ProofsReasoningLesson, unit: "Unit 6: Advanced Concepts", unitColor: "bg-indigo-100 text-indigo-700" },
  { id: 10, title: "Review and Practice", description: "Comprehensive review of all geometry concepts", component: GeometryReviewLesson, unit: "Unit 6: Advanced Concepts", unitColor: "bg-indigo-100 text-indigo-700" }
];

export const GeometryCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [currentLesson, setCurrentLesson] = useState<number | null>(null);
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

  // Memoize navigation handlers to prevent unnecessary re-renders
  const handleNextLesson = useCallback(() => {
    if (currentLesson !== null && currentLesson < lessons.length) {
      const nextLesson = currentLesson + 1;
      setCurrentLesson(nextLesson);
      navigate(`/courses/geometry/${nextLesson}`);
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigate]);

  const handlePrevLesson = useCallback(() => {
    if (currentLesson !== null && currentLesson > 1) {
      const prevLesson = currentLesson - 1;
      setCurrentLesson(prevLesson);
      navigate(`/courses/geometry/${prevLesson}`);
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLesson, navigate]);

  const handleLessonSelect = useCallback((lessonId: number) => {
    setCurrentLesson(lessonId);
    navigate(`/courses/geometry/${lessonId}`);
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const handleBackToCourses = useCallback(() => {
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
          courseId="geometry"
          courseTitle="Geometry Fundamentals"
          currentLesson={currentLesson}
          totalLessons={lessons.length}
        >
          <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            <CourseHeader 
              onDashboard={handleDashboard} 
              onBackToCourses={handleBackToCourses}
              courseTitle="Geometry Fundamentals"
            />
          
            <div className="container mx-auto px-4 py-8 space-y-8">
              {/* Course Title and Description */}
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-foreground">Geometry Fundamentals</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Master the essential concepts of geometry, from basic shapes and angles to advanced proofs and transformations. Build a solid foundation in spatial reasoning and mathematical thinking.
                </p>
                
                {/* Course badges */}
                <div className="flex justify-center gap-4 flex-wrap">
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {lessons.length} Lessons
                  </Badge>
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    <Clock className="w-4 h-4 mr-2" />
                    ~8 Hours
                  </Badge>
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    <Users className="w-4 h-4 mr-2" />
                    Beginner to Intermediate
                  </Badge>
                </div>

                <div className="max-w-md mx-auto">
                  <Progress value={progress} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    {completedLessons.length} of {lessons.length} lessons completed
                  </p>
                </div>
              </div>

              {/* Voice Controls */}
              <div className="mb-8">
                <CourseOverviewTTS 
                  courseTitle="Geometry Fundamentals"
                  courseDescription="Master the essential concepts of geometry, from basic shapes and angles to advanced proofs and transformations. Build a solid foundation in spatial reasoning and mathematical thinking."
                  lessons={lessons}
                />
              </div>

              {/* Video Overview */}
              <CourseOverviewVideo 
                videoUrl="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/geometry_intro_video.mp4" 
                title="Geometry Fundamentals Overview"
              />

              {/* Lessons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {lessons.map((lesson) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const isAccessible = isLessonAccessible(lesson.id);

                  return (
                    <Card 
                      key={lesson.id}
                      className={`relative transition-all duration-200 cursor-pointer hover:shadow-lg ${
                        !isAccessible ? 'opacity-50' : ''
                      } ${isCompleted ? 'border-primary/50 bg-primary/5' : ''}`}
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
            <Button onClick={() => navigate('/courses/geometry')}>
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
        courseId="geometry"
        courseTitle="Geometry Fundamentals"
        currentLesson={currentLesson}
        totalLessons={lessons.length}
      >
        <div className="min-h-screen bg-background">
          <CourseHeader 
            onBackToCourses={() => navigate('/dashboard/learner/courses')}
            onDashboard={handleDashboard}
            courseTitle="Geometry Fundamentals"
          />
          
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/courses/geometry')}
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
              courseId="geometry"
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
    </VoiceSettingsProvider>
  );
};

export default GeometryCoursePage;