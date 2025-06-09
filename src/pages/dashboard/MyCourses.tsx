import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAutoEnrollLearningState } from '@/hooks/useAutoEnrollLearningState';
import { useEnrolledCourses } from '@/hooks/useEnrolledCourses';
import CourseCard from '@/components/CourseCard';
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
  const navigate = useNavigate();
  
  // Auto-enroll user in Learning State beta course
  useAutoEnrollLearningState();
  
  // Fetch enrolled courses
  const { courses, loading, error } = useEnrolledCourses();

  const handleCourseClick = (courseId: string) => {
    if (courseId === 'learning-state-beta') {
      // Navigate to the Learning State beta course
      navigate('/dashboard/learner/courses/learning-state');
    } else {
      // Handle other courses
      navigate(`/dashboard/learner/courses/${courseId}`);
    }
  };

  const renderCoursesList = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="fpk-card border-0 shadow-lg animate-pulse">
              <CardContent className="p-8">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <Card className="fpk-card border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Courses</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (courses.length === 0) {
      return (
        <Card className="fpk-card border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Yet</h3>
            <p className="text-gray-500 mb-4">You haven't enrolled in any courses. Start your learning journey today!</p>
            <Button className="fpk-gradient text-white">
              Browse Courses
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            buttonLabel={course.id === 'learning-state-beta' ? 'Begin Course' : 'Continue'}
            onButtonClick={() => handleCourseClick(course.id)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600">Manage your enrolled courses and track progress</p>
        </div>
        <Button className="fpk-gradient text-white">
          <Plus className="h-4 w-4 mr-2" />
          Enroll in Course
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search courses..."
            className="pl-10 bg-white"
          />
        </div>
      </div>

      {renderCoursesList()}
    </div>
  );
};

export default MyCourses;
