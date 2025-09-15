import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Clock, 
  Users, 
  GraduationCap,
  ArrowLeft
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Import course header images (same as in StyledCourseCard)
import courseLinearEquations from '@/assets/course-linear-equations.jpg';
import courseTrigonometry from '@/assets/course-trigonometry.jpg';
import courseAlgebra from '@/assets/course-algebra.jpg';
import courseLogic from '@/assets/course-logic.jpg';
import courseEconomics from '@/assets/course-economics.jpg';
import courseSpellingReading from '@/assets/course-spelling-reading.jpg';
import courseNeurodiversity from '@/assets/course-neurodiversity.jpg';
import courseScience from '@/assets/course-science.jpg';

interface Course {
  id: string;
  title: string;
  description: string;
  summary: string;
  duration: string;
  level: string;
  lessons: number;
  category: string;
  features: string[];
  learningOutcomes: string[];
  route?: string;
  image?: string; // Added for course header images
}

// Map course IDs to their images (same as StyledCourseCard)
const courseImageMap: Record<string, string> = {
  'empowering-learning-spelling': courseSpellingReading,
  'logic-critical-thinking': courseLogic,
  'interactive-science': courseScience,
  'interactive-algebra': courseAlgebra,
  'interactive-linear-equations': courseLinearEquations,
  'interactive-trigonometry': courseTrigonometry,
  'interactive-economics': courseEconomics,
  'interactive-neurodiversity': courseNeurodiversity,
};

// Fallback function for courses not in the map
const getCourseImage = (id: string, title: string): string => {
  // Check direct ID mapping first
  if (courseImageMap[id]) {
    return courseImageMap[id];
  }
  
  // Fallback based on title keywords
  const titleLower = title.toLowerCase();
  if (titleLower.includes('linear') || titleLower.includes('equation')) return courseLinearEquations;
  if (titleLower.includes('trigonometry') || titleLower.includes('trig')) return courseTrigonometry;
  if (titleLower.includes('algebra')) return courseAlgebra;
  if (titleLower.includes('logic') || titleLower.includes('critical')) return courseLogic;
  if (titleLower.includes('economics') || titleLower.includes('economic')) return courseEconomics;
  if (titleLower.includes('spelling') || titleLower.includes('reading') || titleLower.includes('english')) return courseSpellingReading;
  if (titleLower.includes('neurodiversity') || titleLower.includes('neurodivergent')) return courseNeurodiversity;
  if (titleLower.includes('science') || titleLower.includes('biology') || titleLower.includes('chemistry')) return courseScience;
  
  // Default fallback
  return courseScience;
};

const courses: Course[] = [
  {
    id: 'empowering-learning-spelling',
    title: 'Empowering Learning for Spelling',
    description: 'Master spelling through visual memory techniques and optimal learning states.',
    summary: 'A comprehensive program designed for visual learners to overcome spelling challenges using proven memory techniques and optimal learning states.',
    duration: '~2 Hours',
    level: 'Beginner',
    lessons: 11,
    category: 'Language Arts',
    features: ['Video Instructions', 'Visual Memory Techniques', 'Interactive Exercises', 'Progress Tracking'],
    learningOutcomes: [
      'Master the visual spelling technique',
      'Achieve optimal learning states for memory retention',
      'Build confidence in spelling abilities',
      'Apply techniques to any spelling challenge'
    ],
    route: '/courses/empowering-learning-spelling'
  },
  {
    id: 'logic-critical-thinking',
    title: 'Logic and Critical Thinking',
    description: 'Develop analytical thinking skills and logical reasoning abilities.',
    summary: 'Learn to think critically, analyze arguments, and develop sound reasoning skills through practical exercises and real-world examples.',
    duration: '~3 Hours',
    level: 'Intermediate',
    lessons: 9,
    category: 'Critical Thinking',
    features: ['Interactive Examples', 'Logical Reasoning', 'Argument Analysis', 'Critical Evaluation'],
    learningOutcomes: [
      'Identify and evaluate arguments',
      'Distinguish between deductive and inductive reasoning',
      'Recognize logical fallacies',
      'Apply critical thinking to real-world situations'
    ],
    route: '/courses/logic-critical-thinking'
  },
  {
    id: 'interactive-science',
    title: 'Introduction to Science',
    description: 'Explore the fundamentals of scientific thinking and methodology.',
    summary: 'A comprehensive introduction to scientific concepts, methods, and thinking that builds a strong foundation for further scientific study.',
    duration: '~4 Hours',
    level: 'Beginner',
    lessons: 12,
    category: 'Science',
    features: ['Scientific Method', 'Interactive Experiments', 'Cell Biology', 'Physics Concepts'],
    learningOutcomes: [
      'Understand the scientific method',
      'Learn basic concepts in biology and physics',
      'Develop scientific thinking skills',
      'Apply scientific principles to everyday life'
    ],
    route: '/courses/interactive-science'
  },
  {
    id: 'interactive-algebra',
    title: 'Interactive Algebra',
    description: 'Master algebraic concepts through interactive lessons and practice.',
    summary: 'Build a solid foundation in algebra with step-by-step guidance, interactive examples, and plenty of practice opportunities.',
    duration: '~5 Hours',
    level: 'Intermediate',
    lessons: 7,
    category: 'Mathematics',
    features: ['Step-by-Step Solutions', 'Interactive Practice', 'Visual Representations', 'Problem Solving'],
    learningOutcomes: [
      'Solve linear and quadratic equations',
      'Work with algebraic expressions',
      'Understand functions and graphs',
      'Apply algebra to real-world problems'
    ],
    route: '/courses/interactive-algebra'
  },
  {
    id: 'interactive-linear-equations',
    title: 'Interactive Linear Equations',
    description: 'Master linear equations using the SOAP method and interactive practice.',
    summary: 'Learn to solve linear equations systematically using the SOAP method with comprehensive practice and real-world applications.',
    duration: '~3 Hours',
    level: 'Intermediate',
    lessons: 7,
    category: 'Mathematics',
    features: ['SOAP Method', 'Systematic Approach', 'Interactive Practice', 'Real Applications'],
    learningOutcomes: [
      'Master the SOAP method for solving equations',
      'Solve various types of linear equations',
      'Apply linear equations to practical problems',
      'Build confidence in mathematical problem-solving'
    ],
    route: '/courses/interactive-linear-equations'
  },
  {
    id: 'interactive-trigonometry',
    title: 'Interactive Trigonometry',
    description: 'Explore trigonometric functions and relationships through interactive learning.',
    summary: 'Understand sine, cosine, tangent, and their applications using the SOHCAHTOA method and interactive visualizations.',
    duration: '~4 Hours',
    level: 'Advanced',
    lessons: 7,
    category: 'Mathematics',
    features: ['SOHCAHTOA Method', 'Visual Trigonometry', 'Interactive Graphs', 'Practical Applications'],
    learningOutcomes: [
      'Master trigonometric functions and ratios',
      'Apply SOHCAHTOA to solve triangles',
      'Understand unit circle concepts',
      'Solve real-world trigonometry problems'
    ],
    route: '/courses/interactive-trigonometry'
  },
  {
    id: 'interactive-economics',
    title: 'Interactive Economics',
    description: 'Understand economic principles and their real-world applications.',
    summary: 'Explore fundamental economic concepts, market dynamics, and decision-making processes through interactive lessons and case studies.',
    duration: '~4 Hours',
    level: 'Intermediate',
    lessons: 8,
    category: 'Social Studies',
    features: ['Market Analysis', 'Economic Models', 'Case Studies', 'Decision Making'],
    learningOutcomes: [
      'Understand supply and demand principles',
      'Analyze market structures and behavior',
      'Apply economic thinking to real situations',
      'Make informed economic decisions'
    ],
    route: '/courses/interactive-economics'
  },
  {
    id: 'interactive-neurodiversity',
    title: 'Interactive Neurodiversity',
    description: 'Explore neurodiversity with a strengths-based approach to learning differences.',
    summary: 'Learn about different neurological variations, celebrate diverse learning styles, and develop inclusive perspectives on neurodiversity.',
    duration: '~3 Hours',
    level: 'Beginner',
    lessons: 8,
    category: 'Psychology & Education',
    features: ['Strengths-Based Approach', 'Inclusive Learning', 'Diverse Perspectives', 'Practical Strategies'],
    learningOutcomes: [
      'Understand various forms of neurodiversity',
      'Appreciate different learning styles',
      'Develop inclusive attitudes and practices',
      'Support neurodiverse individuals effectively'
    ],
    route: '/courses/interactive-neurodiversity'
  }
];

const CoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  const handleEnroll = (courseId: string) => {
    // Redirect to sign up page when enrolling
    navigate('/login?enroll=' + courseId);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Language Arts': 'bg-blue-100 text-blue-700',
      'Critical Thinking': 'bg-purple-100 text-purple-700',
      'Science': 'bg-green-100 text-green-700',
      'Mathematics': 'bg-orange-100 text-orange-700',
      'Social Studies': 'bg-indigo-100 text-indigo-700',
      'Psychology & Education': 'bg-pink-100 text-pink-700'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getLevelColor = (level: string) => {
    const colors = {
      'Beginner': 'bg-emerald-100 text-emerald-700',
      'Intermediate': 'bg-yellow-100 text-yellow-700',
      'Advanced': 'bg-red-100 text-red-700'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header - Enhanced mobile text sizes */}
      <div className="bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-sm sm:text-base"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Course Catalog</h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  Discover our comprehensive learning programs designed for every learner
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm sm:text-lg px-3 sm:px-4 py-1.5 sm:py-2">
              {courses.length} Courses Available
            </Badge>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const courseImage = getCourseImage(course.id, course.title);
            
            return (
              <Card key={course.id} className="relative flex flex-col h-full hover:shadow-lg transition-all duration-200 overflow-hidden group">
                {/* AI Generated Image Header (same as StyledCourseCard) */}
                <div 
                  className="relative h-40 bg-cover bg-center overflow-hidden"
                  style={{ backgroundImage: `url(${courseImage})` }}
                >
                  {/* Dark overlay for text contrast */}
                  <div className="absolute inset-0 bg-black/40" />
                  
                  {/* Header content */}
                  <div className="relative z-10 p-4 sm:p-6 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <Badge className={`${getCategoryColor(course.category)} text-sm sm:text-base backdrop-blur-sm font-medium`}>
                        {course.category}
                      </Badge>
                      <Badge className={`${getLevelColor(course.level)} text-sm sm:text-base backdrop-blur-sm font-medium`}>
                        {course.level}
                      </Badge>
                    </div>
                    
                    <div className="flex-1 flex items-end">
                      <CardTitle className="text-white font-bold text-xl sm:text-2xl lg:text-3xl leading-tight drop-shadow-lg">
                        {course.title}
                      </CardTitle>
                    </div>
                  </div>
                </div>

                <CardContent className="flex-1 flex flex-col p-4 sm:p-6">
                  {/* Course Description */}
                  <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Course Stats - Enhanced mobile text sizes */}
                  <div className="flex items-center justify-between text-sm sm:text-base lg:text-lg text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="font-medium">{course.lessons} Lessons</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="font-medium">{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="font-medium">{course.level}</span>
                    </div>
                  </div>

                  {/* Course Summary Dropdown - Enhanced mobile text */}
                  <Collapsible
                    open={expandedCourse === course.id}
                    onOpenChange={() => 
                      setExpandedCourse(expandedCourse === course.id ? null : course.id)
                    }
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between text-base sm:text-lg lg:text-xl mb-4 hover:bg-muted/50 font-medium py-3"
                      >
                        Course Details
                        {expandedCourse === course.id ? (
                          <ChevronUp className="h-5 w-5 sm:h-6 sm:w-6" />
                        ) : (
                          <ChevronDown className="h-5 w-5 sm:h-6 sm:w-6" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-5 mb-6">
                      <div>
                        <h4 className="font-bold text-base sm:text-lg lg:text-xl mb-3">Overview</h4>
                        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">{course.summary}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-base sm:text-lg lg:text-xl mb-3">Key Features</h4>
                        <ul className="text-base sm:text-lg lg:text-xl text-muted-foreground space-y-2">
                          {course.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-primary rounded-full flex-shrink-0 mt-2.5"></span>
                              <span className="leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-base sm:text-lg lg:text-xl mb-3">Learning Outcomes</h4>
                        <ul className="text-base sm:text-lg lg:text-xl text-muted-foreground space-y-2">
                          {course.learningOutcomes.map((outcome, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-primary rounded-full flex-shrink-0 mt-2.5"></span>
                              <span className="leading-relaxed">{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Enroll Button - Enhanced mobile size */}
                  <div className="mt-auto pt-4">
                    <Button
                      onClick={() => handleEnroll(course.id)}
                      className="w-full bg-primary hover:bg-primary/90 text-base sm:text-lg lg:text-xl py-3 sm:py-4 font-bold"
                    >
                      Enroll Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action Section - Enhanced mobile text */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 sm:p-8 max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
              Join thousands of learners who have transformed their education with our interactive courses. 
              Sign up today and start your learning journey with personalized progress tracking and expert guidance.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/login')}
              className="bg-primary hover:bg-primary/90 text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-2.5 sm:py-3"
            >
              Create Your Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;