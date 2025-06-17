import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Clock, User, Search, Filter } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { useEnrollmentProgress } from '@/hooks/useEnrollmentProgress';
import { useAutoEnrollLearningState } from '@/hooks/useAutoEnrollLearningState';
import { Link } from 'react-router-dom';

const MyCourses = () => {
  const { t } = useTranslation();
  const { courses, isLoading, error } = useCourses();
  const { enrollments, getCourseProgress } = useEnrollmentProgress();
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  // Auto-enroll in Learning State beta course
  useAutoEnrollLearningState();

  const enrolledCourseIds = enrollments.map(e => e.course_id);
  const enrolledCourses = courses.filter(course => enrolledCourseIds.includes(course.id));
  const availableCourses = courses.filter(course => 
    !enrolledCourseIds.includes(course.id) && course.status === 'published'
  );

  const filteredCourses = (courseList: typeof courses) => {
    return courseList.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'all' || course.difficulty_level === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    });
  };

  const switchToAvailableTab = () => {
    const tabElement = document.querySelector('[data-state="inactive"][value="available"]') as HTMLElement;
    if (tabElement) {
      tabElement.click();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Error</h2>
          <p className="text-gray-600">{error.message || 'Failed to load courses'}</p>
        </div>
      </div>
    );
  }

  const CourseCard = ({ course, isEnrolled = false }: { course: any; isEnrolled?: boolean }) => {
    const progress = isEnrolled ? getCourseProgress(course.id) : null;
    const isLearningStateCourse = course.id === 'learning-state-beta';

    // Fixed course route logic
    const getCourseRoute = () => {
      console.log('Getting course route for:', { 
        courseId: course.id, 
        slug: course.slug, 
        isLearningState: isLearningStateCourse 
      });
      
      if (isLearningStateCourse) {
        return `/dashboard/learner/learning-state/${course.id}`;
      }
      
      // For other courses, use slug if available, otherwise use id
      const identifier = course.slug || course.id;
      return `/dashboard/learner/course/${identifier}`;
    };

    const courseRoute = getCourseRoute();
    console.log('Final course route:', courseRoute);

    return (
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <CardDescription className="mt-2 line-clamp-2">
                {course.description}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end space-y-1 ml-4">
              {course.featured && (
                <Badge variant="default" className="fpk-gradient text-white">
                  Featured
                </Badge>
              )}
              {isLearningStateCourse && (
                <Badge variant="default" className="fpk-gradient text-white">
                  Beta
                </Badge>
              )}
              <Badge variant="outline">
                {course.difficulty_level}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
              {course.instructor_name && (
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{course.instructor_name}</span>
                </div>
              )}
              {course.duration_minutes && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration_minutes} mins</span>
                </div>
              )}
            </div>

            {isEnrolled && progress && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-gray-600">{progress.completion_percentage}%</span>
                </div>
                <Progress value={progress.completion_percentage} className="h-2" />
                {progress.completed && (
                  <Badge variant="default" className="w-full justify-center bg-green-600">
                    Completed
                  </Badge>
                )}
              </div>
            )}

            <Link to={courseRoute}>
              <Button className="w-full fpk-gradient text-white">
                {isEnrolled ? 'Continue Learning' : 'View Course'}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.myCourses.title')}</h1>
        <p className="text-gray-600 mt-2">{t('dashboard.myCourses.description')}</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="enrolled" className="space-y-6">
        <TabsList>
          <TabsTrigger value="enrolled">
            My Courses ({enrolledCourses.length})
          </TabsTrigger>
          <TabsTrigger value="available">
            Available Courses ({availableCourses.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled" className="space-y-6">
          {filteredCourses(enrolledCourses).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses(enrolledCourses).map((course) => (
                <CourseCard key={course.id} course={course} isEnrolled={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No courses match your search' : 'No enrolled courses yet'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms or filters'
                  : 'Discover and enroll in courses to start your learning journey.'
                }
              </p>
              {!searchTerm && (
                <Button onClick={switchToAvailableTab}>
                  Browse Available Courses
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-6">
          {filteredCourses(availableCourses).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses(availableCourses).map((course) => (
                <CourseCard key={course.id} course={course} isEnrolled={false} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No courses match your search' : 'No available courses'}
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Try adjusting your search terms or filters'
                  : 'New courses will appear here when they become available.'
                }
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyCourses;
