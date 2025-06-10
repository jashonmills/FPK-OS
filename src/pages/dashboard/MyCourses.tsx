
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus, Search, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAutoEnrollLearningState } from '@/hooks/useAutoEnrollLearningState';
import { useEnrolledCourses } from '@/hooks/useEnrolledCourses';
import { useEnrollmentProgress } from '@/hooks/useEnrollmentProgress';
import { useCourses } from '@/hooks/useCourses';
import CourseCard from '@/components/CourseCard';
import { useNavigate } from 'react-router-dom';
import DualLanguageText from '@/components/DualLanguageText';
import { useTranslation } from 'react-i18next';

const MyCourses = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Auto-enroll user in Learning State beta course
  useAutoEnrollLearningState();
  
  // Fetch enrolled courses and progress
  const { courses: enrolledCourses, loading: enrolledLoading, error: enrolledError, refetch: refetchEnrolled } = useEnrolledCourses();
  const { getCourseProgress, refetch: refetchProgress } = useEnrollmentProgress();
  
  // Fetch all available courses
  const { courses: allCourses, isLoading: allCoursesLoading, error: allCoursesError, refetch: refetchAllCourses } = useCourses({
    status: 'published'
  });

  const loading = enrolledLoading || allCoursesLoading;

  const handleCourseClick = (courseId: string, courseSlug?: string) => {
    if (courseId === 'learning-state-beta') {
      // Navigate to the new embedded Learning State course
      navigate('/dashboard/learner/course/learning-state-embed');
    } else {
      // Navigate using slug if available, otherwise use ID
      const identifier = courseSlug || courseId;
      navigate(`/dashboard/learner/course/${identifier}`);
    }
  };

  const handleRefresh = () => {
    refetchEnrolled();
    refetchProgress();
    refetchAllCourses();
  };

  // Filter courses based on search term
  const filterCourses = (courses: any[]) => {
    if (!searchTerm) return courses;
    return courses.filter(course => 
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredEnrolledCourses = filterCourses(enrolledCourses);
  const filteredAvailableCourses = filterCourses(allCourses.filter(course => 
    !enrolledCourses.some(enrolled => enrolled.id === course.id)
  ));

  const renderCoursesList = (courses: any[], showEnrollButton = false) => {
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

    if (enrolledError || allCoursesError) {
      return (
        <Card className="fpk-card border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              <DualLanguageText translationKey="courses.errorTitle" />
            </h3>
            <p className="text-gray-500 mb-4">{enrolledError || allCoursesError}</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                <DualLanguageText translationKey="common.tryAgain" />
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (courses.length === 0) {
      return (
        <Card className="fpk-card border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {showEnrollButton ? (
                <DualLanguageText translationKey="courses.noAvailableCourses" />
              ) : (
                <DualLanguageText translationKey="courses.noCourses" />
              )}
            </h3>
            <p className="text-gray-500 mb-4">
              {showEnrollButton ? (
                <DualLanguageText translationKey="courses.noAvailableCoursesDesc" />
              ) : (
                <DualLanguageText translationKey="courses.noCoursesDesc" />
              )}
            </p>
            <div className="flex gap-2 justify-center">
              <Button 
                className="fpk-gradient text-white" 
                onClick={handleRefresh}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                <DualLanguageText translationKey="courses.refreshCourses" />
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const progress = showEnrollButton ? null : getCourseProgress(course.id);
          
          return (
            <Card key={course.id} className="fpk-card border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                {course.thumbnail_url && (
                  <img 
                    src={course.thumbnail_url} 
                    alt={course.title}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {course.title}
                    </h3>
                    {course.featured && (
                      <Badge variant="secondary" className="ml-2">Featured</Badge>
                    )}
                  </div>
                  
                  {course.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {course.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {course.instructor_name && (
                      <span>By {course.instructor_name}</span>
                    )}
                    {course.duration_minutes && (
                      <span>• {course.duration_minutes} min</span>
                    )}
                    {course.difficulty_level && (
                      <Badge variant="outline" className="text-xs">
                        {course.difficulty_level}
                      </Badge>
                    )}
                  </div>

                  {progress && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{progress.completion_percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full" 
                          style={{ width: `${progress.completion_percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full fpk-gradient text-white"
                    onClick={() => handleCourseClick(course.id, course.slug)}
                  >
                    {showEnrollButton ? (
                      'Enroll Now'
                    ) : progress?.completed ? (
                      t('courses.reviewCourse')
                    ) : course.id === 'learning-state-beta' ? (
                      progress?.completion_percentage > 0
                        ? t('courses.continue')
                        : t('courses.beginCourse')
                    ) : (
                      t('courses.continue')
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            <DualLanguageText translationKey="courses.title" />
          </h1>
          <p className="text-gray-600">
            <DualLanguageText translationKey="courses.subtitle" />
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t('courses.searchPlaceholder')}
            className="pl-10 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="enrolled" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="enrolled">My Courses ({filteredEnrolledCourses.length})</TabsTrigger>
          <TabsTrigger value="available">Available Courses ({filteredAvailableCourses.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="enrolled" className="mt-6">
          {renderCoursesList(filteredEnrolledCourses, false)}
        </TabsContent>
        
        <TabsContent value="available" className="mt-6">
          {renderCoursesList(filteredAvailableCourses, true)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyCourses;
