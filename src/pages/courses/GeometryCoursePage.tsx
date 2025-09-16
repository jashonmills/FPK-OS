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
import CourseOverviewVideo from '@/components/course/CourseOverviewVideo';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AdditionalResourcesSection } from '@/components/course/resources/AdditionalResourcesSection';
import { StudentGuidesAccordion } from '@/components/course/resources/StudentGuidesAccordion';
import { EnhancedCourseInfoAccordion } from '@/components/course/resources/EnhancedCourseInfoAccordion';

// Import background image
import interactiveGeometryBg from '@/assets/interactive-geometry-fundamentals-bg.jpg';

// Import lesson components
import { PointsLinesPlanesMicroLesson } from '@/components/micro-lessons/points-lines-planes/PointsLinesPlanesMicroLesson';
import { TriangleMicroLesson } from '@/components/micro-lessons/triangles/TriangleMicroLesson';
import { QuadrilateralsMicroLesson } from '@/components/micro-lessons/quadrilaterals/QuadrilateralsMicroLesson';
import { CirclesMicroLesson } from '@/components/micro-lessons/circles/CirclesMicroLesson';
import { TransformationsMicroLesson } from '@/components/micro-lessons/transformations/TransformationsMicroLesson';
import { ThreeDShapesMicroLesson } from '@/components/micro-lessons/3d-shapes/ThreeDShapesMicroLesson';
import { CoordinateGeometryMicroLesson } from '@/components/micro-lessons/coordinate-geometry/CoordinateGeometryMicroLesson';
import { VectorsMicroLesson } from '@/components/micro-lessons/vectors/VectorsMicroLesson';
import { GeometryReviewLesson } from '@/components/course/geometry-lessons/GeometryReviewLesson';
import { GeometryReviewAndRecap } from '@/components/course/geometry-lessons/GeometryReviewAndRecap';
import { GeometryCompletionLesson } from '@/components/course/geometry-lessons/GeometryCompletionLesson';

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
  { id: 1, title: "Points, Lines, and Planes", description: "Learn the fundamental building blocks of geometry", component: PointsLinesPlanesMicroLesson, unit: "Unit 1: Foundations", unitColor: "bg-blue-100 text-blue-700" },
  { id: 2, title: "Triangles", description: "Explore triangle types, properties, and theorems", component: TriangleMicroLesson, unit: "Unit 2: Polygons", unitColor: "bg-green-100 text-green-700" },
  { id: 3, title: "Quadrilaterals", description: "Study squares, rectangles, parallelograms, and more", component: QuadrilateralsMicroLesson, unit: "Unit 2: Polygons", unitColor: "bg-green-100 text-green-700" },
  { id: 4, title: "Circles", description: "Master circle properties, parts, and calculations", component: CirclesMicroLesson, unit: "Unit 3: Circles", unitColor: "bg-purple-100 text-purple-700" },
  { id: 5, title: "Transformations", description: "Learn about reflection, rotation, translation, and scaling", component: TransformationsMicroLesson, unit: "Unit 5: Transformations", unitColor: "bg-red-100 text-red-700" },
  { id: 6, title: "3D Shapes and Volume", description: "Explore three-dimensional geometry and volume calculations", component: ThreeDShapesMicroLesson, unit: "Unit 4: Measurements", unitColor: "bg-orange-100 text-orange-700" },
  { id: 7, title: "Coordinate Geometry", description: "Apply geometry concepts to the coordinate plane", component: CoordinateGeometryMicroLesson, unit: "Unit 5: Transformations", unitColor: "bg-red-100 text-red-700" },
  { id: 8, title: "Vectors and Vector Geometry", description: "Master vectors, operations, and geometric applications", component: VectorsMicroLesson, unit: "Unit 6: Advanced Concepts", unitColor: "bg-indigo-100 text-indigo-700" },
  { id: 9, title: "Geometry Review & Recap", description: "Comprehensive recap of all 8 lessons completed", component: GeometryReviewAndRecap, unit: "Course Review", unitColor: "bg-emerald-100 text-emerald-700" },
  { id: 10, title: "Course Completion & Celebration", description: "Celebrate your achievement and explore next steps", component: GeometryCompletionLesson, unit: "Course Completion", unitColor: "bg-amber-100 text-amber-700" }
];

export const GeometryCoursePage: React.FC = () => {
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
          courseId="geometry"
          courseTitle="Interactive Geometry Fundamentals"
          currentLesson={currentLesson}
          totalLessons={lessons.length}
        >
          <div className="min-h-screen bg-gradient-to-br from-background to-muted/20" style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${interactiveGeometryBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}>
            <CourseHeader 
              onDashboard={handleDashboard} 
              onBackToCourses={handleBackToCourses}
              courseTitle="Interactive Geometry Fundamentals"
            />
          
            <div className="container mx-auto px-4 py-8 space-y-8">
              {/* Course Title and Description */}
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">Interactive Geometry Fundamentals</h1>
                <p className="text-xl text-white max-w-3xl mx-auto font-medium">
                  Master the essential concepts of geometry, from basic shapes and angles to advanced proofs and transformations. Build a solid foundation in spatial reasoning and mathematical thinking.
                </p>
                
                {/* Course badges */}
                <div className="flex justify-center gap-4 flex-wrap">
                  <Badge variant="secondary" className="text-sm px-3 py-1 bg-white/90 text-gray-800 border-white/20">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {lessons.length} Lessons
                  </Badge>
                  <Badge variant="secondary" className="text-sm px-3 py-1 bg-white/90 text-gray-800 border-white/20">
                    <Clock className="w-4 h-4 mr-2" />
                    ~8 Hours
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

              {/* Voice Controls */}
              <div className="mb-8">
                <CourseOverviewTTS 
                  courseTitle="Interactive Geometry Fundamentals"
                  courseDescription="Master the essential concepts of geometry, from basic shapes and angles to advanced proofs and transformations. Build a solid foundation in spatial reasoning and mathematical thinking."
                  lessons={lessons}
                />
              </div>

              {/* Video Overview */}
                <CourseOverviewVideo 
                  videoUrl="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/Geometry__The_Shape_of_Everything.mp4" 
                  title="Interactive Geometry Fundamentals Overview"
                />

              {/* Study Materials Section */}
              <AdditionalResourcesSection>
                <StudentGuidesAccordion 
                  guideCount={21}
                  courseId="geometry"
                  description="Explore our comprehensive collection of student guides organized by module. Click any image to view in detail or open in a new tab."
                />
              </AdditionalResourcesSection>

              {/* Enhanced Course Information */}
              <div className="max-w-4xl mx-auto">
                <EnhancedCourseInfoAccordion
                  title="Enhanced Comprehensive Geometry Course"
                  introduction="Welcome to the Enhanced Comprehensive Geometry Course! This course has been specially designed to provide a thorough understanding of geometric concepts from basic principles to advanced topics. What makes this course unique is the inclusion of detailed teaching moments and comprehensive problem-solving instructions throughout each module."
                  features={[
                    {
                      title: "Enhanced Teaching Moments",
                      description: "Throughout each module, you'll find special 'Teaching Moment' sections that provide deeper insights, historical context, real-world applications, and conceptual connections to help you truly understand the material beyond mere formulas and procedures."
                    },
                    {
                      title: "Detailed Problem-Solving Approaches",
                      description: "Each topic includes step-by-step problem-solving frameworks that guide you through the process of tackling different types of geometric problems, building your analytical skills and confidence."
                    },
                    {
                      title: "Comprehensive Examples",
                      description: "Worked examples demonstrate the application of concepts and problem-solving techniques, showing the thought process behind each step."
                    },
                    {
                      title: "Practice Problems with Guidance",
                      description: "Each module includes practice problems with detailed guidance on how to approach them, including step-by-step solution paths."
                    },
                    {
                      title: "Visual Resources",
                      description: "The course includes diagrams and visual aids to help illustrate geometric concepts and relationships."
                    },
                    {
                      title: "Presentation Slides",
                      description: "Summary slides for each module highlight key concepts and formulas for quick reference and review."
                    }
                  ]}
                  modules={[
                    { number: 1, title: "Lines, Angles & Polygons", description: "Fundamental concepts that form the building blocks of geometry" },
                    { number: 2, title: "Triangles and Triangle Properties", description: "In-depth exploration of the most fundamental shape in geometry" },
                    { number: 3, title: "Quadrilaterals and Polygons", description: "Properties and applications of four-sided and many-sided shapes" },
                    { number: 4, title: "Circles and Circle Properties", description: "Understanding the perfect shape and its unique properties" },
                    { number: 5, title: "Transformations in Geometry", description: "How shapes move, rotate, reflect, and resize in the plane" },
                    { number: 6, title: "Three-Dimensional Geometry", description: "Extending geometric concepts into the third dimension" },
                    { number: 7, title: "Coordinate Geometry", description: "Combining algebra and geometry through the coordinate system" },
                    { number: 8, title: "Vectors and Vector Geometry", description: "Advanced tools for analyzing direction and magnitude in geometry" }
                  ]}
                  accordionOpen={accordionOpen}
                  onAccordionChange={setAccordionOpen}
                />
              </div>

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
                                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
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
                        <p className="text-sm text-white mb-3">{lesson.description}</p>
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
  const hasPrev = currentLesson > 1;
  const LessonComponent = currentLessonData.component;

  return (
    <VoiceSettingsProvider>
      <InteractiveCourseWrapper 
        courseId="geometry"
        courseTitle="Interactive Geometry Fundamentals"
        currentLesson={currentLesson}
        totalLessons={lessons.length}
      >
        <div className="min-h-screen bg-background" style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${interactiveGeometryBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}>
          <CourseHeader 
            onBackToCourses={() => navigate('/dashboard/learner/courses')}
            onDashboard={handleDashboard}
            courseTitle="Interactive Geometry Fundamentals"
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
                <span className="text-sm text-white font-medium">
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
              <LessonComponent 
                onComplete={() => handleLessonComplete(currentLesson)}
                onNext={hasNext ? handleNextLesson : undefined}
                hasNext={hasNext}
              />
            </InteractiveLessonWrapper>
          </div>
        </div>
      </InteractiveCourseWrapper>
    </VoiceSettingsProvider>
  );
};

export default GeometryCoursePage;