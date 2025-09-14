
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Clock, User, Search, Filter, HelpCircle, Plus, Loader2 } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { useEnrollmentProgress } from '@/hooks/useEnrollmentProgress';
import { useAutoEnrollPreloadedCourses } from '@/hooks/useAutoEnrollPreloadedCourses';
import { useNativeCourses, useNativeEnrollments, useNativeEnrollmentMutations } from '@/hooks/useNativeCourses';
import { useOrganizationCourses } from '@/hooks/useOrganizationCourses';
import { useUserPrimaryOrganization } from '@/hooks/useUserOrganization';
import { NativeCourseCard } from '@/components/native-courses/NativeCourseCard';
import { useFirstVisitVideo } from '@/hooks/useFirstVisitVideo';
import { FirstVisitVideoModal } from '@/components/common/FirstVisitVideoModal';
import { PageHelpTrigger } from '@/components/common/PageHelpTrigger';
import { Link } from 'react-router-dom';
import { useProcessLinearEquationsCourse } from '@/hooks/useLinearEquationsCourse';

// Hard-coded Interactive Courses
const INTERACTIVE_LINEAR_EQUATIONS_COURSE = {
  id: 'interactive-linear-equations',
  title: 'Interactive Linear Equations',
  description: 'Master solving linear equations through interactive lessons and practice problems. Learn step-by-step problem solving with immediate feedback.',
  thumbnail_url: null,
  difficulty_level: 'beginner',
  duration_minutes: 240,
  instructor_name: 'FPK University',
  featured: true,
  status: 'published'
};

const INTERACTIVE_TRIGONOMETRY_COURSE = {
  id: 'interactive-trigonometry',
  title: 'Interactive Trigonometry',
  description: 'Master trigonometry through interactive lessons, visual demonstrations, and practical applications. From basic SOHCAHTOA to complex real-world problem solving.',
  thumbnail_url: null,
  difficulty_level: 'intermediate',
  duration_minutes: 300,
  instructor_name: 'FPK University',
  featured: true,
  status: 'published'
};

const MyCourses = () => {
  const { t } = useTranslation('dashboard');
  
  // Get user's organization membership
  const { organization: userOrganization } = useUserPrimaryOrganization();
  
  // Fetch courses based on organization membership
  const { courses, isLoading, error } = useCourses({
    organizationId: userOrganization?.organization_id,
  });
  const { enrollments, getCourseProgress } = useEnrollmentProgress();
  
  // Native courses
  const { data: nativeCourses = [], isLoading: nativeCoursesLoading } = useNativeCourses({
    organizationId: userOrganization?.organization_id,
  });
  const { data: nativeEnrollments = [] } = useNativeEnrollments();
  const { enrollInCourse, isEnrolling } = useNativeEnrollmentMutations();
  const { mutate: processLinearCourse, isPending: isProcessingLinearCourse } = useProcessLinearEquationsCourse();
  
  // Organization-specific courses if user is in an organization
  const { data: orgCourses } = useOrganizationCourses(userOrganization?.organization_id || '');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [showVideoModal, setShowVideoModal] = useState(false);
  
  // Video storage hook
  const { shouldShowAuto, markVideoAsSeen } = useFirstVisitVideo('mycourses_intro_seen');

  // Auto-enroll in preloaded courses
  useAutoEnrollPreloadedCourses();

  // Show video modal on first visit
  useEffect(() => {
    if (shouldShowAuto() && !isLoading && courses.length > 0) {
      setShowVideoModal(true);
    }
  }, [shouldShowAuto, isLoading, courses.length]);

  const handleCloseVideo = () => {
    setShowVideoModal(false);
    markVideoAsSeen();
  };

  const handleShowVideoManually = () => {
    setShowVideoModal(true);
  };

  const enrolledCourseIds = enrollments.map(e => e.course_id);
  
  // Combine global and organization courses
  const allAvailableCourses = [
    ...courses,
    ...(orgCourses?.assignedCourses || []),
    ...(orgCourses?.organizationOwnedCourses || []),
    INTERACTIVE_LINEAR_EQUATIONS_COURSE, // Add hardcoded courses
    INTERACTIVE_TRIGONOMETRY_COURSE,
  ].filter((course, index, self) => 
    // Remove duplicates by id
    index === self.findIndex(c => c.id === course.id)
  );
  
  const enrolledCourses = allAvailableCourses.filter(course => enrolledCourseIds.includes(course.id));
  const availableCourses = allAvailableCourses.filter(course => 
    !enrolledCourseIds.includes(course.id) && course.status === 'published'
  );

  // Native course filtering
  const enrolledNativeCourseIds = nativeEnrollments.map(e => e.course_id);
  
  // Combine global and organization native courses
  const allAvailableNativeCourses = [
    ...nativeCourses,
    ...(orgCourses?.assignedNativeCourses || []),
    ...(orgCourses?.organizationOwnedNativeCourses || []),
  ].filter((course, index, self) => 
    // Remove duplicates by id
    index === self.findIndex(c => c.id === course.id)
  );
  
  const enrolledNativeCourses = allAvailableNativeCourses.filter(course => enrolledNativeCourseIds.includes(course.id));
  const availableNativeCourses = allAvailableNativeCourses.filter(course => 
    !enrolledNativeCourseIds.includes(course.id)
  );

  const filteredCourses = (courseList: typeof courses) => {
    return courseList.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'all' || course.difficulty_level === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    }).sort((a, b) => {
      // Learning State course should be first
      if (a.id === 'learning-state-beta') return -1;
      if (b.id === 'learning-state-beta') return 1;
      return 0;
    });
  };

  const filteredNativeCourses = (courseList: typeof nativeCourses) => {
    return courseList.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.summary?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  };

  const switchToAvailableTab = () => {
    const tabElement = document.querySelector('[data-state="inactive"][value="available"]') as HTMLElement;
    if (tabElement) {
      tabElement.click();
    }
  };

  if (isLoading || nativeCoursesLoading) {
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
    const isElSpellingCourse = course.id === 'el-spelling-reading';
    const isInteractiveLinearEquations = course.id === 'interactive-linear-equations';
    const isInteractiveTrigonometry = course.id === 'interactive-trigonometry';

    // Get display title for the course
    const getDisplayTitle = () => {
      if (isElSpellingCourse) {
        return course.title.replace('& Reading', '').trim();
      }
      return course.title;
    };

    // Fixed course route logic
    const getCourseRoute = () => {
      console.log('Getting course route for:', { 
        courseId: course.id, 
        slug: course.slug, 
        isLearningState: isLearningStateCourse 
      });
      
      if (isLearningStateCourse) {
        return 'https://course-start-kit-react.lovable.app/';
      }
      
      // Special case for EL Spelling & Reading course
      if (isElSpellingCourse) {
        return 'https://course-start-kit-react.lovable.app/el-spelling';
      }
      
      // Special case for Interactive courses
      if (isInteractiveLinearEquations) {
        return '/courses/interactive-linear-equations';
      }
      
      if (isInteractiveTrigonometry) {
        return '/courses/interactive-trigonometry';
      }
      
      // For other courses, use slug if available, otherwise use id
      const identifier = course.slug || course.id;
      return `/dashboard/learner/course/${identifier}`;
    };

    const courseRoute = getCourseRoute();
    console.log('Final course route:', courseRoute);

    return (
      <Card className="h-full hover:shadow-lg transition-shadow flex flex-col">
        {/* Course Image */}
        {course.thumbnail_url && (
          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Image failed to load:', course.thumbnail_url);
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        )}
        
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg">{getDisplayTitle()}</CardTitle>
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
              {(isLearningStateCourse || isElSpellingCourse || isInteractiveLinearEquations || isInteractiveTrigonometry) && (
                <Badge variant="default" className="fpk-gradient text-white">
                  {(isInteractiveLinearEquations || isInteractiveTrigonometry) ? 'Interactive' : 'Beta'}
                </Badge>
              )}
              <Badge variant="outline">
                {course.difficulty_level}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
              {course.instructor_name && !isElSpellingCourse && (
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
          </div>

          <div className="space-y-4 mt-4">
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
                {isEnrolled ? 'Continue Learning' : 'Start Course'}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-2 mb-4">
        <h1 className="text-3xl font-bold text-foreground">{t('myCourses.title')}</h1>
        <PageHelpTrigger onOpen={handleShowVideoManually} />
      </div>
      <p className="text-muted-foreground text-center mb-6">{t('myCourses.description')}</p>

      <FirstVisitVideoModal
        isOpen={showVideoModal}
        onClose={handleCloseVideo}
        title="How to Use My Courses"
        videoUrl="https://www.youtube.com/embed/aTzBu_VJ2gM?si=UcVUJGmUwbEbDGvy"
      />

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
            My Courses ({enrolledCourses.length + enrolledNativeCourses.length})
          </TabsTrigger>
          <TabsTrigger value="available">
            Available Courses ({availableCourses.length + availableNativeCourses.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled" className="space-y-6">
          {(filteredCourses(enrolledCourses).length > 0 || filteredNativeCourses(enrolledNativeCourses).length > 0) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Native Courses */}
              {filteredNativeCourses(enrolledNativeCourses).map((course) => {
                const enrollment = nativeEnrollments.find(e => e.course_id === course.id);
                return (
                  <NativeCourseCard 
                    key={course.id} 
                    course={course} 
                    enrollment={enrollment}
                  />
                );
              })}
              
              {/* Regular Courses */}
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
          {(filteredCourses(availableCourses).length > 0 || filteredNativeCourses(availableNativeCourses).length > 0) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Available Native Courses */}
              {filteredNativeCourses(availableNativeCourses).map((course) => (
                <NativeCourseCard 
                  key={course.id} 
                  course={course}
                  onEnroll={() => enrollInCourse.mutate(course.id)}
                  isEnrolling={isEnrolling}
                />
              ))}
              
              {/* Available Regular Courses */}
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
