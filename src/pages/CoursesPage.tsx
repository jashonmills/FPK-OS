import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { usePlatformCourses } from '@/hooks/usePlatformCourses';
import { HierarchicalCourseCatalog } from '@/components/courses/HierarchicalCourseCatalog';

const CoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const { courses, isLoading } = usePlatformCourses();

  const handleEnroll = (courseId: string) => {
    navigate('/login?enroll=' + courseId);
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
                60 Courses Available
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
              Our courses are crafted for neurodiverse learners. We spend the extra time and care to go beyond traditional methods, building structured, supportive, and engaging content.
            </h2>
          </div>
        </div>
      </div>

      {/* Hierarchical Course Display */}
      <div className="container mx-auto px-6 lg:px-12 py-12">
        <HierarchicalCourseCatalog 
          courses={courses} 
          onEnroll={handleEnroll}
        />
      </div>

      {/* Call to Action Section */}
      <div className="container mx-auto px-8 pb-16">
        <div className="bg-white/20 backdrop-blur-md rounded-lg p-8 max-w-4xl mx-auto border border-white/30 shadow-lg text-center">
          <h2 className="text-3xl font-bold mb-4 text-white drop-shadow-lg">Ready to Start Learning?</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto leading-relaxed">
            Join thousands of learners who have transformed their education with our interactive courses.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/login')}
            className="bg-primary hover:bg-primary/90 px-8 py-3"
          >
            Create Your Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;