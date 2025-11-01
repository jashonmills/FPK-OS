import React, { useState } from 'react';
import { getCourseImage } from '@/utils/courseImages';
import { useNavigate } from 'react-router-dom';
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
import { useCourses } from '@/hooks/useCourses';

interface DisplayCourse {
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
  route: string;
  image?: string;
}

// Helper function to convert database course to display format
const convertToDisplayCourse = (dbCourse: any): DisplayCourse => {
  return {
    id: dbCourse.id,
    title: dbCourse.title || 'Untitled Course',
    description: dbCourse.description || '',
    summary: dbCourse.description || '',
    duration: dbCourse.duration_minutes ? `~${Math.ceil(dbCourse.duration_minutes / 60)} Hours` : '~2 Hours',
    level: dbCourse.difficulty_level ? dbCourse.difficulty_level.charAt(0).toUpperCase() + dbCourse.difficulty_level.slice(1) : 'Beginner',
    lessons: 10, // Default, can be enriched from manifest
    category: 'Learning Skills', // Default, can be enriched from tags
    features: dbCourse.tags || ['Interactive Learning', 'Progress Tracking'],
    learningOutcomes: ['Master key concepts', 'Build practical skills', 'Apply knowledge effectively'],
    route: `/courses/player/${dbCourse.slug}`,
    image: dbCourse.thumbnail_url
  };
};

const CoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [readingCourse, setReadingCourse] = useState<string | null>(null);
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const { settings } = useVoiceSettings();
  
  // Fetch published courses from database
  const { courses: dbCourses, isLoading } = useCourses({ status: 'published' });
  
  // Convert database courses to display format
  const courses = dbCourses.map(convertToDisplayCourse);

  const handleEnroll = (courseId: string) => {
    // Redirect to sign up page when enrolling
    navigate('/login?enroll=' + courseId);
  };

  const handleReadCourseOverview = (course: DisplayCourse) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading courses...</p>
        </div>
      </div>
    );
  }

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