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
}

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
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Course Catalog</h1>
                <p className="text-muted-foreground">
                  Discover our comprehensive learning programs designed for every learner
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {courses.length} Courses Available
            </Badge>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="relative flex flex-col h-full hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getCategoryColor(course.category)}>
                        {course.category}
                      </Badge>
                      <Badge className={getLevelColor(course.level)}>
                        {course.level}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
                  </div>
                  <GraduationCap className="h-6 w-6 text-primary flex-shrink-0" />
                </div>
                <p className="text-sm text-muted-foreground">{course.description}</p>

                {/* Course Stats */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    <span>{course.lessons} Lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{course.level}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                {/* Course Summary Dropdown */}
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
                      className="w-full justify-between text-xs mb-3"
                    >
                      Course Details
                      {expandedCourse === course.id ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-3 mb-4">
                    <div>
                      <h4 className="font-medium text-xs mb-1">Overview</h4>
                      <p className="text-xs text-muted-foreground">{course.summary}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-xs mb-1">Key Features</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {course.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-primary rounded-full flex-shrink-0"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-xs mb-1">Learning Outcomes</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {course.learningOutcomes.map((outcome, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-primary rounded-full flex-shrink-0"></span>
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Enroll Button */}
                <div className="mt-auto pt-4">
                  <Button
                    onClick={() => handleEnroll(course.id)}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Enroll Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of learners who have transformed their education with our interactive courses. 
              Sign up today and start your learning journey with personalized progress tracking and expert guidance.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/login')}
              className="bg-primary hover:bg-primary/90"
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