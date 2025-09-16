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
  ArrowLeft,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useVoiceSettings } from '@/contexts/VoiceSettingsContext';

// Import course header images (same as in StyledCourseCard)
import courseLinearEquations from '@/assets/course-linear-equations.jpg';
import courseTrigonometry from '@/assets/course-trigonometry.jpg';
import courseAlgebra from '@/assets/course-algebra.jpg';
import courseLogic from '@/assets/course-logic.jpg';
import courseEconomics from '@/assets/course-economics.jpg';
import courseSpellingReading from '@/assets/course-spelling-reading.jpg';
import courseNeurodiversity from '@/assets/course-neurodiversity.jpg';
import courseScience from '@/assets/course-science.jpg';
import courseMoneyManagement from '@/assets/course-money-management.jpg';
import learningStateBg from '@/assets/learning-state-bg.jpg';

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
  'empowering-learning-reading': courseSpellingReading,
  'empowering-learning-numeracy': courseSpellingReading,
  'empowering-learning-state': learningStateBg,
  'logic-critical-thinking': courseLogic,
  'interactive-science': courseScience,
  'interactive-algebra': courseAlgebra,
  'interactive-linear-equations': courseLinearEquations,
  'interactive-trigonometry': courseTrigonometry,
  'interactive-economics': courseEconomics,
  'interactive-neurodiversity': courseNeurodiversity,
  'money-management-teens': courseMoneyManagement,
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
  if (titleLower.includes('learning') && titleLower.includes('state')) return learningStateBg;
  if (titleLower.includes('neurodiversity') || titleLower.includes('neurodivergent')) return courseNeurodiversity;
  if (titleLower.includes('science') || titleLower.includes('biology') || titleLower.includes('chemistry')) return courseScience;
  if (titleLower.includes('money') || titleLower.includes('financial') || titleLower.includes('teen')) return courseMoneyManagement;
  
  // Default fallback
  return courseScience;
};

const courses: Course[] = [
  {
    id: 'empowering-learning-state',
    title: 'Empowering Learning State',
    description: 'Master the optimal learning state through calming techniques and brain integration methods.',
    summary: 'Learn essential techniques to achieve the most effective learning state, including breathing exercises, grounding methods, and brain integration activities designed to enhance focus and memory retention.',
    duration: '~3 Hours',
    level: 'Beginner',
    lessons: 12,
    category: 'Learning Skills',
    features: ['Video Instructions', 'Calming Techniques', 'Brain Integration', 'Focus Enhancement'],
    learningOutcomes: [
      'Master breathing and grounding techniques',
      'Achieve optimal learning states for better retention',
      'Apply brain integration methods for enhanced focus',
      'Build confidence and reduce learning anxiety'
    ],
    route: '/courses/empowering-learning-state'
  },
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
    id: 'empowering-learning-reading',
    title: 'Empowering Learning for Reading',
    description: 'Master reading through visual memory techniques and optimal learning states.',
    summary: 'A comprehensive program designed for visual learners to overcome reading challenges using proven memory techniques and optimal learning states.',
    duration: '~2 Hours',
    level: 'Beginner',
    lessons: 10,
    category: 'Language Arts',
    features: ['Video Instructions', 'Visual Memory techniques', 'Interactive Exercises', 'Progress Tracking'],
    learningOutcomes: [
      'Master the visual reading technique',
      'Achieve optimal learning states for comprehension',
      'Build confidence in reading abilities',
      'Apply techniques to any reading challenge'
    ],
    route: '/courses/empowering-learning-reading'
  },
  {
    id: 'empowering-learning-numeracy',
    title: 'Empowering Learning for Numeracy',
    description: 'Master mathematics through visual memory techniques and number triangles.',
    summary: 'Learn addition, subtraction, multiplication and division using number triangles and visual learning methods. A comprehensive program designed to make mathematics easier and more enjoyable.',
    duration: '~2 Hours',
    level: 'Beginner',
    lessons: 12,
    category: 'Mathematics',
    features: ['Number Triangle Technique', 'Visual Memory Methods', 'Interactive Exercises', 'Progress Tracking'],
    learningOutcomes: [
      'Master the Number Triangle technique',
      'Understand the historical origins of number shapes',
      'Build confidence in mathematical abilities',
      'Apply visual techniques to any math challenge'
    ],
    route: '/courses/empowering-learning-numeracy'
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
  },
  {
    id: 'money-management-teens',
    title: 'Money Management for Teens',
    description: 'Learn essential financial skills including budgeting, saving, investing, and credit management.',
    summary: 'Build a strong foundation for financial success with comprehensive lessons on personal finance, budgeting, smart saving strategies, and responsible money management designed specifically for teenagers.',
    duration: '~6 Hours',
    level: 'Beginner',
    lessons: 6,
    category: 'Life Skills',
    features: ['Budget Planning', 'Savings Strategies', 'Investment Basics', 'Credit Education', 'Real-World Scenarios'],
    learningOutcomes: [
      'Create and manage personal budgets effectively',
      'Understand different savings and investment options',
      'Learn responsible credit and debt management',
      'Make informed financial decisions',
      'Develop long-term financial planning skills',
      'Build healthy money habits for life'
    ],
    route: '/courses/money-management-teens'
  }
];

const CoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [readingCourse, setReadingCourse] = useState<string | null>(null);
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const { settings } = useVoiceSettings();

  const handleEnroll = (courseId: string) => {
    // Redirect to sign up page when enrolling
    navigate('/login?enroll=' + courseId);
  };

  const handleReadCourseOverview = (course: Course) => {
    if (readingCourse === course.id && isSpeaking) {
      stop();
      setReadingCourse(null);
      return;
    }

    if (!settings.hasInteracted) {
      console.warn('User interaction required for TTS');
      return;
    }

    // Create comprehensive text from course overview
    const overviewText = `Course Overview: ${course.title}. ${course.summary}. 
    Key Features include: ${course.features.join(', ')}. 
    Learning Outcomes: ${course.learningOutcomes.join('. ')}.`;

    speak(overviewText, { interrupt: true });
    setReadingCourse(course.id);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Language Arts': 'bg-blue-100 text-blue-700',
      'Learning Skills': 'bg-indigo-100 text-indigo-700',
      'Critical Thinking': 'bg-purple-100 text-purple-700',
      'Science': 'bg-green-100 text-green-700',
      'Mathematics': 'bg-orange-100 text-orange-700',
      'Social Studies': 'bg-indigo-100 text-indigo-700',
      'Psychology & Education': 'bg-pink-100 text-pink-700',
      'Life Skills': 'bg-teal-100 text-teal-700'
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
    <div 
      className="min-h-screen w-full"
      style={{
        backgroundImage: 'url(https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/home-page/home-page-background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        margin: 0,
        padding: 0
      }}
    >
      {/* Header - No overlay, just centered content with individual transparent elements */}
      <div className="border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-sm sm:text-base bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <Badge variant="secondary" className="text-base sm:text-xl px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm border-white/30">
                {courses.length} Courses Available
              </Badge>
            </div>
            
            <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 border border-white/30">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg mb-2">Course Catalog</h1>
              <p className="text-sm sm:text-base text-white/90 drop-shadow-md">
                Discover our comprehensive learning programs designed for every learner
              </p>
            </div>
          </div>
          
          {/* Hero Content - Centered */}
          <div className="mt-8 max-w-4xl mx-auto text-center">
            <h2 className="font-elegant text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-slate-900 font-bold leading-relaxed bg-yellow-100/80 backdrop-blur-sm rounded-lg p-6 border-2 border-yellow-200/60 shadow-2xl">
              Our courses are crafted for neurodiverse learners. We spend the extra time and care to go beyond traditional methods, building structured, supportive, and engaging content. Our unique methodology ensures every learner gets the most educational impact, making your learning journey both effective and empowering.
            </h2>
          </div>
        </div>
      </div>

      {/* Courses Grid - Smaller cards matching dashboard */}
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const courseImage = getCourseImage(course.id, course.title);
            
            return (
              <Card key={course.id} className="relative flex flex-col h-full hover:shadow-xl transition-all duration-300 overflow-hidden group bg-white/40 backdrop-blur-md border-white/20 shadow-lg">
                {/* AI Generated Image Header */}
                <div 
                  className="relative h-40 bg-cover bg-center overflow-hidden"
                  style={{ backgroundImage: `url(${courseImage})` }}
                >
                  {/* Dark overlay for better text contrast */}
                  <div className="absolute inset-0 bg-black/60" />
                  
                  {/* Header content */}
                  <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <Badge className={`${getCategoryColor(course.category)} text-sm backdrop-blur-sm font-medium border border-white/20`}>
                        {course.category}
                      </Badge>
                      <Badge className={`${getLevelColor(course.level)} text-sm backdrop-blur-sm font-medium border border-white/20`}>
                        {course.level}
                      </Badge>
                    </div>
                    
                    <div className="flex-1 flex items-end">
                      <CardTitle className="text-white font-bold text-lg leading-tight drop-shadow-2xl shadow-black/50">
                        {course.title}
                      </CardTitle>
                    </div>
                  </div>
                </div>

                <CardContent className="flex-1 flex flex-col p-6">
                  {/* Course Description - Better contrast */}
                  <p className="text-slate-800 text-sm mb-4 line-clamp-2 leading-relaxed font-medium">
                    {course.description}
                  </p>

                  {/* Course Stats - Better contrast */}
                  <div className="flex items-center justify-between text-sm text-slate-700 mb-4 font-medium">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" />
                      <span className="font-semibold">{course.lessons} Lessons</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span className="font-semibold">{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4" />
                      <span className="font-semibold">{course.level}</span>
                    </div>
                  </div>

                  {/* Course Summary Dropdown - Better contrast */}
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
                        className="w-full justify-between text-sm mb-4 hover:bg-white/30 font-semibold py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-slate-800"
                      >
                        Course Details
                        {expandedCourse === course.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 mb-4 bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30 relative">
                      {/* TTS Speaker Button */}
                      <Button
                        onClick={() => handleReadCourseOverview(course)}
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 p-2 bg-white/30 hover:bg-white/40 backdrop-blur-sm border border-white/30 rounded-full"
                        disabled={!settings.hasInteracted}
                      >
                        {readingCourse === course.id && isSpeaking ? (
                          <VolumeX className="h-4 w-4 text-slate-700" />
                        ) : (
                          <Volume2 className="h-4 w-4 text-slate-700" />
                        )}
                      </Button>
                      
                      <div>
                        <h4 className="font-bold text-sm mb-2 text-slate-900">Overview</h4>
                        <p className="text-sm text-slate-800 leading-relaxed font-medium">{course.summary}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-sm mb-2 text-slate-900">Key Features</h4>
                        <ul className="text-sm text-slate-800 space-y-1 font-medium">
                          {course.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-slate-700 rounded-full flex-shrink-0 mt-1.5"></span>
                              <span className="leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-sm mb-2 text-slate-900">Learning Outcomes</h4>
                        <ul className="text-sm text-slate-800 space-y-1 font-medium">
                          {course.learningOutcomes.map((outcome, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-slate-700 rounded-full flex-shrink-0 mt-1.5"></span>
                              <span className="leading-relaxed">{outcome}</span>
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
                      className="w-full bg-primary hover:bg-primary/90 text-sm py-2 font-bold shadow-lg backdrop-blur-sm text-white"
                    >
                      Enroll Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action Section - Enhanced mobile text with semi-transparent styling */}
        <div className="mt-16 text-center px-6 sm:px-8">
          <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 sm:p-8 max-w-4xl mx-auto border border-white/30 shadow-lg">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-white drop-shadow-lg">Ready to Start Learning?</h2>
            <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Join thousands of learners who have transformed their education with our interactive courses. 
              Sign up today and start your learning journey with personalized progress tracking and expert guidance.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/login')}
              className="bg-primary hover:bg-primary/90 text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-2.5 sm:py-3 shadow-lg backdrop-blur-sm"
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