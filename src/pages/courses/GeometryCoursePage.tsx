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
import { StudentGuideGallery } from '@/components/course/StudentGuideGallery';

// Import lesson components
import { PointsLinesPlanes } from '@/components/course/geometry-lessons/PointsLinesPlanes';
import { TrianglesLesson } from '@/components/course/geometry-lessons/TrianglesLesson';
import { QuadrilateralsLesson } from '@/components/course/geometry-lessons/QuadrilateralsLesson';
import { CirclesLesson } from '@/components/course/geometry-lessons/CirclesLesson';

import { ThreeDShapesLesson } from '@/components/course/geometry-lessons/ThreeDShapesLesson';
import { TransformationsLesson } from '@/components/course/geometry-lessons/TransformationsLesson';
import { CoordinateGeometryLesson } from '@/components/course/geometry-lessons/CoordinateGeometryLesson';
import { VectorsLesson } from '@/components/course/geometry-lessons/VectorsLesson';
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
  { id: 7, title: "Coordinate Geometry", description: "Apply geometry concepts to the coordinate plane", component: CoordinateGeometryLesson, unit: "Unit 5: Transformations", unitColor: "bg-red-100 text-red-700" },
  { id: 8, title: "Vectors and Vector Geometry", description: "Master vectors, operations, and geometric applications", component: VectorsLesson, unit: "Unit 6: Advanced Concepts", unitColor: "bg-indigo-100 text-indigo-700" },
  { id: 9, title: "Coming Soon", description: "Module 9 content will be available soon", component: GeometryReviewLesson, unit: "Unit 6: Advanced Concepts", unitColor: "bg-indigo-100 text-indigo-700" },
  { id: 10, title: "Review and Practice", description: "Comprehensive review of all geometry concepts", component: GeometryReviewLesson, unit: "Unit 6: Advanced Concepts", unitColor: "bg-indigo-100 text-indigo-700" }
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
                videoUrl="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/enhanced-geometry/Geometry__The_Shape_of_Everything.mp4" 
                title="Geometry Fundamentals Overview"
              />

              {/* Study Materials Section */}
              <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Study Materials & Resources</h2>
                  <p className="text-center text-muted-foreground mb-6">
                    Explore our comprehensive collection of student guides organized by module. Click any image to view in detail or open in a new tab.
                  </p>
                  
                  <StudentGuideGallery />
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
                    <AccordionTrigger className="text-left text-xl font-semibold">
                      Enhanced Comprehensive Geometry Course
                    </AccordionTrigger>
                    <AccordionContent className="prose prose-gray max-w-none text-sm relative">
                      <div className="space-y-6 pr-12">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Introduction</h3>
                          <p className="text-muted-foreground leading-relaxed">
                            Welcome to the Enhanced Comprehensive Geometry Course! This course has been specially designed to provide a thorough understanding of geometric concepts from basic principles to advanced topics. What makes this course unique is the inclusion of detailed teaching moments and comprehensive problem-solving instructions throughout each module.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3">Course Features</h3>
                          <ul className="space-y-2 text-muted-foreground">
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Enhanced Teaching Moments:</strong> Throughout each module, you'll find special "Teaching Moment" sections that provide deeper insights, historical context, real-world applications, and conceptual connections to help you truly understand the material beyond mere formulas and procedures.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Detailed Problem-Solving Approaches:</strong> Each topic includes step-by-step problem-solving frameworks that guide you through the process of tackling different types of geometric problems, building your analytical skills and confidence.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Comprehensive Examples:</strong> Worked examples demonstrate the application of concepts and problem-solving techniques, showing the thought process behind each step.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Practice Problems with Guidance:</strong> Each module includes practice problems with detailed guidance on how to approach them, including step-by-step solution paths.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Visual Resources:</strong> The course includes diagrams and visual aids to help illustrate geometric concepts and relationships.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span><strong>Presentation Slides:</strong> Summary slides for each module highlight key concepts and formulas for quick reference and review.</span>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3">Course Structure</h3>
                          <p className="text-muted-foreground mb-3">The course consists of eight modules, each building upon the previous ones to develop a comprehensive understanding of geometry:</p>
                          <ol className="space-y-1 text-muted-foreground">
                            <li className="flex gap-3"><span className="font-medium text-foreground">1.</span> Lines, Angles & Polygons: Fundamental concepts that form the building blocks of geometry</li>
                            <li className="flex gap-3"><span className="font-medium text-foreground">2.</span> Triangles and Triangle Properties: In-depth exploration of the most fundamental shape in geometry</li>
                            <li className="flex gap-3"><span className="font-medium text-foreground">3.</span> Quadrilaterals and Polygons: Properties and applications of four-sided and many-sided shapes</li>
                            <li className="flex gap-3"><span className="font-medium text-foreground">4.</span> Circles and Circle Properties: Understanding the perfect shape and its unique properties</li>
                            <li className="flex gap-3"><span className="font-medium text-foreground">5.</span> Transformations in Geometry: How shapes move, rotate, reflect, and resize in the plane</li>
                            <li className="flex gap-3"><span className="font-medium text-foreground">6.</span> Three-Dimensional Geometry: Extending geometric concepts into the third dimension</li>
                            <li className="flex gap-3"><span className="font-medium text-foreground">7.</span> Coordinate Geometry: Combining algebra and geometry through the coordinate system</li>
                            <li className="flex gap-3"><span className="font-medium text-foreground">8.</span> Vectors and Vector Geometry: Advanced tools for analyzing direction and magnitude in geometry</li>
                          </ol>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3">How to Use This Course</h3>
                          <ol className="space-y-1 text-muted-foreground">
                            <li className="flex gap-3"><span className="font-medium text-foreground">1.</span> <strong>Sequential Learning:</strong> Work through the modules in order, as each builds upon concepts from previous ones.</li>
                            <li className="flex gap-3"><span className="font-medium text-foreground">2.</span> <strong>Active Engagement:</strong> Don't just read—work through the examples and solve the practice problems.</li>
                            <li className="flex gap-3"><span className="font-medium text-foreground">3.</span> <strong>Focus on Teaching Moments:</strong> Pay special attention to the teaching moments, which provide deeper understanding and connections.</li>
                            <li className="flex gap-3"><span className="font-medium text-foreground">4.</span> <strong>Apply Problem-Solving Approaches:</strong> Practice using the structured problem-solving approaches provided for each topic.</li>
                            <li className="flex gap-3"><span className="font-medium text-foreground">5.</span> <strong>Review with Presentations:</strong> Use the presentation slides to review key concepts after studying each module.</li>
                          </ol>
                        </div>

                        <div className="bg-muted/30 p-4 rounded-lg">
                          <h4 className="font-semibold text-foreground mb-2">Getting Started</h4>
                          <p className="text-sm text-muted-foreground">
                            Begin with the course outline to get a broad overview, then start with Module 1 and progress sequentially through the course. Take your time with each module, ensuring you understand the concepts and can solve the practice problems before moving on.
                          </p>
                          <p className="text-sm text-muted-foreground mt-2 font-medium">
                            Happy learning, and enjoy your journey through the fascinating world of geometry!
                          </p>
                        </div>
                      </div>
                      
                      {/* Close Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute bottom-4 right-4 h-8 w-8 p-0 hover:bg-muted"
                        onClick={() => setAccordionOpen(undefined)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="course-outline">
                    <AccordionTrigger className="text-left text-xl font-semibold">
                      Comprehensive Geometry Course Outline
                    </AccordionTrigger>
                    <AccordionContent className="prose prose-gray max-w-none text-sm relative">
                      <div className="space-y-6 pr-12">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Course Overview</h3>
                          <p className="text-muted-foreground leading-relaxed">
                            This comprehensive geometry course covers fundamental concepts to advanced topics in geometry. The course is designed to build a strong foundation in geometric principles and develop problem-solving skills through a structured approach with enhanced teaching moments and detailed problem-solving instructions.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3">Module Structure</h3>
                          <p className="text-muted-foreground mb-3">Each module includes:</p>
                          <ul className="space-y-1 text-muted-foreground">
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span>Clear learning objectives</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span>Detailed explanations with teaching moments</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span>Step-by-step problem-solving approaches</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span>Worked examples</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span>Practice problems with guidance</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span>Summary and connections to other topics</span>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-4">Course Modules</h3>
                          
                          <div className="space-y-4">
                            <div className="border-l-2 border-primary pl-4">
                              <h4 className="font-semibold text-foreground mb-2">Module 1: Lines, Angles & Polygons</h4>
                              <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>• Introduction to basic geometric concepts</li>
                                <li>• Lines and line segments</li>
                                <li>• Angles and their properties</li>
                                <li>• Polygons and their classifications</li>
                                <li>• Enhanced teaching moments on visualizing geometric concepts</li>
                                <li>• Detailed problem-solving approaches for angle and polygon problems</li>
                              </ul>
                            </div>

                            <div className="border-l-2 border-primary pl-4">
                              <h4 className="font-semibold text-foreground mb-2">Module 2: Triangles and Triangle Properties</h4>
                              <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>• Triangle classifications</li>
                                <li>• Triangle properties and theorems</li>
                                <li>• The Pythagorean theorem and applications</li>
                                <li>• Triangle congruence and similarity</li>
                                <li>• Area and perimeter calculations</li>
                                <li>• Enhanced teaching moments on triangle applications in real-world contexts</li>
                                <li>• Detailed problem-solving approaches for triangle-related problems</li>
                              </ul>
                            </div>

                            <div className="border-l-2 border-primary pl-4">
                              <h4 className="font-semibold text-foreground mb-2">Module 3: Quadrilaterals and Polygons</h4>
                              <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>• Types of quadrilaterals and their properties</li>
                                <li>• Area and perimeter of quadrilaterals</li>
                                <li>• Regular polygons and their properties</li>
                                <li>• Polygon diagonals and interior angles</li>
                                <li>• Coordinate geometry of polygons</li>
                                <li>• Enhanced teaching moments on polygon applications in design and architecture</li>
                                <li>• Detailed problem-solving approaches for quadrilateral and polygon problems</li>
                              </ul>
                            </div>

                            <div className="border-l-2 border-primary pl-4">
                              <h4 className="font-semibold text-foreground mb-2">Module 4: Circles and Circle Properties</h4>
                              <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>• Circle basics and terminology</li>
                                <li>• Circle measurements (circumference, area)</li>
                                <li>• Circle theorems and angle properties</li>
                                <li>• Chord, tangent, and secant properties</li>
                                <li>• Circles in coordinate geometry</li>
                                <li>• Enhanced teaching moments on circles in nature and engineering</li>
                                <li>• Detailed problem-solving approaches for circle-related problems</li>
                              </ul>
                            </div>

                            <div className="border-l-2 border-primary pl-4">
                              <h4 className="font-semibold text-foreground mb-2">Module 5: Transformations in Geometry</h4>
                              <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>• Introduction to transformations</li>
                                <li>• Translations, rotations, reflections, and dilations</li>
                                <li>• Composite transformations</li>
                                <li>• Symmetry in geometric figures</li>
                                <li>• Enhanced teaching moments on transformations in art and design</li>
                                <li>• Detailed problem-solving approaches for transformation problems</li>
                              </ul>
                            </div>

                            <div className="border-l-2 border-primary pl-4">
                              <h4 className="font-semibold text-foreground mb-2">Module 6: Three-Dimensional Geometry</h4>
                              <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>• Introduction to 3D geometry</li>
                                <li>• Polyhedra, including Platonic solids</li>
                                <li>• Prisms and pyramids</li>
                                <li>• Cylinders, cones, and spheres</li>
                                <li>• Cross-sections and projections</li>
                                <li>• Enhanced teaching moments on 3D geometry in architecture and engineering</li>
                                <li>• Detailed problem-solving approaches for 3D geometry problems</li>
                              </ul>
                            </div>

                            <div className="border-l-2 border-primary pl-4">
                              <h4 className="font-semibold text-foreground mb-2">Module 7: Coordinate Geometry</h4>
                              <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>• The coordinate system</li>
                                <li>• Distance and midpoint formulas</li>
                                <li>• Equations of lines</li>
                                <li>• Circles in coordinate geometry</li>
                                <li>• Conic sections</li>
                                <li>• Applications of coordinate geometry</li>
                                <li>• Enhanced teaching moments on coordinate geometry in navigation and mapping</li>
                                <li>• Detailed problem-solving approaches for coordinate geometry problems</li>
                              </ul>
                            </div>

                            <div className="border-l-2 border-primary pl-4">
                              <h4 className="font-semibold text-foreground mb-2">Module 8: Vectors and Vector Geometry</h4>
                              <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>• Introduction to vectors</li>
                                <li>• Vector operations</li>
                                <li>• Dot product and applications</li>
                                <li>• Cross product and applications</li>
                                <li>• Vectors in geometry</li>
                                <li>• Applications of vectors in physics</li>
                                <li>• Enhanced teaching moments on vectors in physics and engineering</li>
                                <li>• Detailed problem-solving approaches for vector problems</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3">Learning Resources</h3>
                          <ul className="space-y-1 text-muted-foreground">
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span>Detailed module content with enhanced teaching moments</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span>Visual aids and diagrams</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span>Step-by-step problem-solving instructions</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span>Practice problems with guidance</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span>Presentation slides summarizing key concepts</span>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3">Assessment Approach</h3>
                          <ul className="space-y-1 text-muted-foreground">
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span>Practice problems at the end of each section</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span>Comprehensive problems at the end of each module</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span>Real-world application problems</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              <span>Step-by-step problem-solving guidance</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-muted/30 p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground font-medium">
                            This enhanced course is designed to provide a deep understanding of geometric concepts through clear explanations, meaningful teaching moments, and structured problem-solving approaches.
                          </p>
                        </div>
                      </div>
                      
                      {/* Close Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute bottom-4 right-4 h-8 w-8 p-0 hover:bg-muted"
                        onClick={() => setAccordionOpen(undefined)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
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