
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Clock, User, Search, Filter, HelpCircle, Plus, Loader2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { useCourses } from '@/hooks/useCourses';
import { Separator } from '@/components/ui/separator';
import { useEnrollmentProgress } from '@/hooks/useEnrollmentProgress';
import { useAutoEnrollPreloadedCourses } from '@/hooks/useAutoEnrollPreloadedCourses';
import { useCourseEnrollment } from '@/hooks/useCourseEnrollment';
import { useNativeCourses, useNativeEnrollments, useNativeEnrollmentMutations } from '@/hooks/useNativeCourses';
import { useOrganizationCourses } from '@/hooks/useOrganizationCourses';
import { useUserPrimaryOrganization } from '@/hooks/useUserOrganization';
import { useStudentAssignments } from '@/hooks/useStudentAssignments';
import { NativeCourseCard } from '@/components/native-courses/NativeCourseCard';
import { StyledCourseCard } from '@/components/common/StyledCourseCard';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { usePlatformCourses } from '@/hooks/usePlatformCourses';

import { useFirstVisitVideo } from '@/hooks/useFirstVisitVideo';
import { FirstVisitVideoModal } from '@/components/common/FirstVisitVideoModal';
import { PageHelpTrigger } from '@/components/common/PageHelpTrigger';
import { Link } from 'react-router-dom';

// FPK University Games data
const FPK_GAMES = [
  {
    id: 'prompt-play-palette',
    name: 'Imagination Builder',
    image: 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/game-cards/imagination-builder.jpg',
    url: 'https://prompt-play-palette.lovable.app/'
  },
  {
    id: 'addition-journey-quest',
    name: 'Addition Journey Quest',
    image: 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/game-cards/addition-journey.jpg',
    url: 'https://addition-journey-quest.lovable.app/'
  },
  {
    id: 'wizard-word-battle',
    name: 'Word Wizard Dual',
    image: 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/game-cards/word-wizard.jpg',
    url: 'https://preview--wizard-word-battle.lovable.app/'
  },
  {
    id: 'learn-escape-prodigy',
    name: 'Learner Escape',
    image: 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/game-cards/learn-escape.jpg',
    url: 'https://learn-escape-prodigy.lovable.app/'
  },
  {
    id: 'eco-genesis-forest-realm',
    name: 'Eco‑Genesis: Forest Realm',
    image: 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/game-cards/eco-genesis',
    url: 'https://eco-genesis-forest-realm.lovable.app/'
  },
  {
    id: 'energybear-calm-game',
    name: 'EnergyBear: Calm & Focus',
    image: 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/game-cards/energy-bear.jpg',
    url: 'https://energybear-calm-game.lovable.app/'
  },
  {
    id: 'mind-explorer-game',
    name: 'Emotion Detective',
    image: 'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-files/game-cards/emotion-detective.jpg',
    url: 'https://mind-explorer-game.lovable.app/'
  }
];

const MyCourses = () => {
  const { t } = useTranslation('dashboard');
  
  // Get user's organization membership
  const { organization: userOrganization } = useUserPrimaryOrganization();
  
  // Fetch platform courses (global published courses)
  const { courses: platformCourses, isLoading: platformLoading } = usePlatformCourses();
  
  // Fetch courses based on organization membership  
  const { courses, isLoading, error } = useCourses({
    organizationId: userOrganization?.organization_id,
  });
  const { enrollments, getCourseProgress } = useEnrollmentProgress();
  const { enrollInCourse: enrollInInteractiveCourse, isEnrolling: isCourseEnrolling } = useCourseEnrollment();
  
  // Native courses
  const { data: nativeCourses = [], isLoading: nativeCoursesLoading } = useNativeCourses({
    organizationId: userOrganization?.organization_id,
  });
  const { data: nativeEnrollments = [] } = useNativeEnrollments();
  const { enrollInCourse } = useNativeEnrollmentMutations();
  
  // Track enrollment state per course
  const [enrollingCourseIds, setEnrollingCourseIds] = useState<Set<string>>(new Set());
  
  // Handle course enrollment with per-course state tracking and validation
  const handleCourseEnroll = async (courseId: string) => {
    // Validate course exists in database before attempting enrollment
    const courseExists = platformCourses.some(c => c.id === courseId) || 
                        courses.some(c => c.id === courseId);
    
    if (!courseExists) {
      toast.error('Course not found. Please refresh the page and try again.');
      console.error('Attempted to enroll in non-existent course:', courseId);
      return;
    }
    
    setEnrollingCourseIds(prev => new Set([...prev, courseId]));
    try {
      await enrollInInteractiveCourse.mutateAsync(courseId);
      
      // After successful enrollment, switch to My Courses tab
      setTimeout(() => {
        const enrolledTab = document.querySelector('[data-state="inactive"][value="enrolled"]') as HTMLElement;
        if (enrolledTab) {
          enrolledTab.click();
        }
      }, 1000);
    } catch (error: any) {
      console.error('Failed to enroll in course:', courseId, error);
      const errorMessage = error?.message || 'Failed to enroll in course';
      toast.error(errorMessage);
    } finally {
      setEnrollingCourseIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
    }
  };
  
  // Handle native course enrollment with per-course state tracking
  const handleNativeCourseEnroll = async (courseId: string) => {
    setEnrollingCourseIds(prev => new Set([...prev, courseId]));
    try {
      await enrollInCourse.mutateAsync(courseId);
    } catch (error) {
      console.error('Failed to enroll in native course:', error);
    } finally {
      setEnrollingCourseIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
    }
  };

  // Organization-specific courses if user is in an organization
  const { data: orgCourses } = useOrganizationCourses(userOrganization?.organization_id || '');
  
  // Fetch student assignments if in an organization
  const { assignments: studentAssignments = [] } = useStudentAssignments(userOrganization?.organization_id);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isGamesOpen, setIsGamesOpen] = useState(false);
  
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

  // Combine global and organization courses from database
  const allAvailableCourses = [
    ...platformCourses, // All global published courses from database
    ...courses,
    ...(orgCourses?.assignedCourses || []),
    ...(orgCourses?.organizationOwnedCourses || []),
  ].filter((course, index, self) => 
    // Remove duplicates by id
    index === self.findIndex(c => c.id === course.id)
  );
  
  // Filter enrolled courses to only show published courses
  // This prevents users from seeing/clicking draft courses they were enrolled in during development
  const enrolledCourses = allAvailableCourses.filter(course => 
    enrolledCourseIds.includes(course.id) &&
    (!('status' in course) || course.status === 'published')
  );
  
  // Course aliases to prevent duplicates in Available Courses (based on actual DB values)
  const courseAliases: Record<string, string[]> = {
    'learning-state-beta': ['optimal-learning-state', 'empowering-learning-state'],
    'el-spelling': ['el-spelling-reading', 'empowering-learning-spelling'],
  };
  
  const availableCourses = allAvailableCourses.filter(course => {
    // Check if enrolled by exact ID match
    if (enrolledCourseIds.includes(course.id)) return false;
    
    // Check for known course aliases/duplicates
    if (courseAliases[course.id]) {
      const hasAlias = courseAliases[course.id].some(alias => 
        enrolledCourseIds.includes(alias)
      );
      if (hasAlias) return false;
    }
    
    // Platform courses don't have a 'status' property - they're always published
    // Only check status for org courses
    return !('status' in course) || course.status === 'published';
  });

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

  // The 5 EL course IDs to group at the top (including aliases)
  const EL_COURSE_IDS = [
    'optimal-learning-state',
    'learning-state-beta', // Alias for optimal-learning-state
    'empowering-learning-state', // Another alias for optimal-learning-state
    'el-handwriting',
    'el-spelling', // V2 Spelling course
    'el-spelling-reading',
    'empowering-learning-spelling', // Alias for el-spelling-reading
    '06efda03-9f0b-4c00-a064-eb65ada9fbae', // Another alias for el-spelling-reading
    'empowering-learning-reading',
    'empowering-learning-numeracy'
  ];

  // Helper function to separate EL courses from other courses
  const separateELCourses = (courseList: Array<typeof courses[0] | typeof platformCourses[0]>) => {
    const filtered = courseList.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'all' || course.difficulty_level === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    });

    const elCourses = filtered.filter(course => EL_COURSE_IDS.includes(course.id));
    const otherCourses = filtered.filter(course => !EL_COURSE_IDS.includes(course.id));

    return { elCourses, otherCourses };
  };

  const filteredCourses = (courseList: typeof courses) => {
    return courseList.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'all' || course.difficulty_level === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    }).sort((a, b) => {
      // Use centralized EL_COURSE_IDS array for consistency
      const aIsEL = EL_COURSE_IDS.includes(a.id);
      const bIsEL = EL_COURSE_IDS.includes(b.id);
      
      // EL courses come first
      if (aIsEL && !bIsEL) return -1;
      if (!aIsEL && bIsEL) return 1;
      
      // Both are EL courses - sort by position in EL_COURSE_IDS array
      // This ensures "EL Optimal Learning State" displays first
      if (aIsEL && bIsEL) {
        const aIndex = EL_COURSE_IDS.indexOf(a.id);
        const bIndex = EL_COURSE_IDS.indexOf(b.id);
        return aIndex - bIndex;
      }
      
      // Neither are EL courses - keep original order
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
    const isOptimalLearningState = course.id === 'optimal-learning-state' || course.slug === 'optimal-learning-state' || course.id === 'learning-state-beta' || course.id === 'empowering-learning-state';
    const isEmpoweringLearningSpelling = course.id === 'el-spelling-reading' || course.slug === 'el-spelling-reading';
    const isEmpoweringLearningReading = course.id === 'empowering-learning-reading' || course.slug === 'empowering-learning-reading';
    const isEmpoweringLearningNumeracy = course.id === 'empowering-learning-numeracy' || course.slug === 'empowering-learning-numeracy';
    const isEmpoweringLearningHandwriting = course.id === 'empowering-learning-handwriting' || course.slug === 'empowering-learning-handwriting';
    const isInteractiveLinearEquations = course.id === 'interactive-linear-equations' || course.slug === 'interactive-linear-equations';
    const isInteractiveTrigonometry = course.id === 'interactive-trigonometry' || course.slug === 'interactive-trigonometry';
    const isInteractiveAlgebra = course.id === 'interactive-algebra' || course.slug === 'interactive-algebra';
    const isIntroductionModernEconomics = course.id === 'introduction-modern-economics' || course.slug === 'introduction-modern-economics';
    const isLogicCriticalThinking = course.id === 'logic-critical-thinking' || course.slug === 'logic-critical-thinking';
    const isNeurodiversityStrengths = course.id === 'neurodiversity-strengths-based-approach' || course.slug === 'neurodiversity-strengths-based-approach';
    const isIntroductionToScience = course.id === 'interactive-science' || course.slug === 'interactive-science';
    const isGeometryFundamentals = course.id === 'geometry' || course.slug === 'geometry';
    const isELTEmpoweringLearning = course.id === 'elt-empowering-learning-techniques' || course.slug === 'elt-empowering-learning-techniques';
    const isVideoProduction = course.id === 'introduction-video-production' || course.slug === 'introduction-video-production';
    const isELHandwriting = course.id === 'el-handwriting' || course.slug === 'el-handwriting';
    const isMoneyManagement = course.id === 'money-management-teens' || course.slug === 'money-management-teens';

    // Handle enrollment for hardcoded courses
    const handleEnrollment = async () => {
      if (!isEnrolled) {
        await handleCourseEnroll(course.id);
      }
    };

    // Get display title for the course
    const getDisplayTitle = () => {
      if (isEmpoweringLearningSpelling) {
        return course.title;
      }
      return course.title;
    };

    // Get course type for styling
    const getCourseType = () => {
      if (isOptimalLearningState) return 'Learning Skills Course';
      if (isEmpoweringLearningSpelling) return 'Spelling Course';
      if (isEmpoweringLearningReading) return 'Reading Course';
      if (isEmpoweringLearningNumeracy) return 'Mathematics Course';
      if (isEmpoweringLearningHandwriting) return 'Writing Course';
      if (isInteractiveLinearEquations || isInteractiveTrigonometry || isInteractiveAlgebra) return 'Interactive Course';
      if (isIntroductionModernEconomics) return 'Interactive Course';
      if (isLogicCriticalThinking) return 'Philosophy Course';
      if (isNeurodiversityStrengths) return 'Foundation Course';
      if (isIntroductionToScience) return 'Science Course';
      if (isGeometryFundamentals) return 'Math Course';
      return 'Full Course Curriculum';
    };

    // Get color theme based on course
    // NOTE: Removed color theme system in favor of AI-generated images

    // Phase 3: Unified course routing with v2 Universal Player priority
    const getCourseRoute = () => {
      // Debug logging for routing decisions
      if (course.id.includes('el-') || course.id.includes('empowering-learning')) {
        console.log('[MyCourses] Routing decision for:', {
          id: course.id,
          title: course.title,
          slug: course.slug,
          framework_type: course.framework_type,
          content_version: course.content_version,
          hasFramework: !!course.framework_type,
          hasVersion: !!course.content_version,
          willUseUniversalPlayer: course.framework_type === 'sequential' && course.content_version === 'v2'
        });
      }
      
      // PRIMARY RULE: If a course is sequential and v2, ALWAYS use the universal player
      if (course.framework_type === 'sequential' && course.content_version === 'v2') {
        const route = `/courses/player/${course.slug || course.id}`;
        console.log('[MyCourses] ✓ Using Universal Player route:', route);
        return route;
      }
      
      // FALLBACK: Legacy routing for non-v2 courses (kept for backward compatibility)
      console.warn('[MyCourses] ⚠️ Falling back to legacy routing for:', course.id);
      
      if (isOptimalLearningState) {
        return '/courses/optimal-learning-state';
      }
      
      if (isEmpoweringLearningSpelling) {
        return '/courses/el-spelling-reading';
      }
      
      if (isEmpoweringLearningReading) {
        return '/courses/empowering-learning-reading';
      }
      
      if (isEmpoweringLearningNumeracy) {
        return '/courses/empowering-learning-numeracy';
      }
      
      if (isEmpoweringLearningHandwriting) {
        return '/courses/empowering-learning-handwriting';
      }
      
      if (isInteractiveLinearEquations) {
        return '/courses/interactive-linear-equations';
      }
      
      if (isInteractiveTrigonometry) {
        return '/courses/interactive-trigonometry';
      }
      
      if (isInteractiveAlgebra) {
        return '/courses/interactive-algebra';
      }
      
      if (isIntroductionModernEconomics) {
        return '/courses/introduction-modern-economics';
      }
      
      if (isLogicCriticalThinking) {
        return '/courses/logic-critical-thinking';
      }
      
      if (isNeurodiversityStrengths) {
        return '/courses/neurodiversity-strengths-based-approach';
      }
      
      if (isIntroductionToScience) {
        return '/courses/interactive-science';
      }
      
      if (isGeometryFundamentals) {
        return '/courses/geometry';
      }
      
      if (course.id === 'money-management-teens' || isMoneyManagement) {
        return '/courses/money-management-teens';
      }
      
      if (isELTEmpoweringLearning) {
        return '/courses/elt-empowering-learning-techniques';
      }
      
      if (course.id === 'el-handwriting' || isELHandwriting) {
        return '/courses/el-handwriting';
      }
      
      if (isVideoProduction) {
        return '/courses/introduction-video-production';
      }
      
      const identifier = course.slug || course.id;
      return `/dashboard/learner/course/${identifier}`;
    };

    return (
      <StyledCourseCard
        id={course.id}
        title={getDisplayTitle()}
        description={course.description}
        courseType={getCourseType()}
        isEnrolled={isEnrolled}
        progress={progress?.completion_percentage || 0}
        duration={course.duration_minutes}
        instructor={course.instructor_name}
        route={isEnrolled ? getCourseRoute() : undefined}
        isCompleted={progress?.completed || false}
        onEnroll={!isEnrolled ? handleEnrollment : undefined}
        isEnrolling={!isEnrolled ? enrollingCourseIds.has(course.id) : false}
      />
    );
  };

  return (
    <div className="space-y-6 pl-2 pr-6 md:pl-4 md:pr-8 lg:pl-6 lg:pr-10 pt-24">
      <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
        <div className="flex flex-col items-center gap-2 mb-4">
          <h1 className="text-3xl font-bold text-white">{t('myCourses.title')}</h1>
          <PageHelpTrigger onOpen={handleShowVideoManually} />
        </div>
        <p className="text-white text-center mb-6">{t('myCourses.description')}</p>
      </div>

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

      {/* FPK University Games Dropdown */}
      <div className="space-y-4">
        <Collapsible open={isGamesOpen} onOpenChange={setIsGamesOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-200"
            >
              <span className="text-lg font-semibold">🎮 FPK University Games</span>
              <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isGamesOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-4">
              {FPK_GAMES.map((game) => (
                <Card key={game.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 bg-white/90 backdrop-blur-sm border-white/20">
                  <div className="relative">
                    <img 
                      src={game.image} 
                      alt={game.name}
                      className="w-full h-64 md:h-72 lg:h-64 object-contain bg-gray-100"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">{game.name}</h3>
                    <Button 
                      onClick={() => window.open(game.url, '_blank')}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
                    >
                      Play Game
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
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
          {/* Assigned Courses Section */}
          {studentAssignments.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">Assigned by Organization</h3>
                <Badge variant="secondary">{studentAssignments.filter(a => a.type === 'course').length}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {studentAssignments
                  .filter(assignment => assignment.type === 'course')
                  .map((assignment) => {
                    // Find the course in available courses (both regular and native)
                    const course = allAvailableCourses.find(c => c.id === assignment.resource_id) ||
                                   allAvailableNativeCourses.find(c => c.id === assignment.resource_id);
                    
                    if (!course) return null;
                    
                    // Check if it's a native course
                    const isNativeCourse = allAvailableNativeCourses.some(c => c.id === assignment.resource_id);
                    const enrollment = isNativeCourse 
                      ? nativeEnrollments.find(e => e.course_id === course.id)
                      : null;
                    
                    return isNativeCourse ? (
                      <NativeCourseCard 
                        key={assignment.id} 
                        course={course as any} 
                        enrollment={enrollment}
                      />
                    ) : (
                      <CourseCard 
                        key={assignment.id} 
                        course={course} 
                        isEnrolled={enrolledCourseIds.includes(course.id)} 
                      />
                    );
                  })
                }
              </div>
            </div>
          )}
          
          {/* Enrolled Courses Section */}
          {(() => {
            const { elCourses, otherCourses } = separateELCourses(enrolledCourses);
            const filteredNative = filteredNativeCourses(enrolledNativeCourses);
            const hasAnyCourses = elCourses.length > 0 || otherCourses.length > 0 || filteredNative.length > 0;

            if (!hasAnyCourses) {
              return studentAssignments.length === 0 ? (
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
              ) : null;
            }

            return (
              <div className="space-y-6">
                {studentAssignments.length > 0 && (
                  <h3 className="text-lg font-semibold text-white">My Other Courses</h3>
                )}
                
                {/* EL Courses Section */}
                {elCourses.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                      🎓 Empowering Learning Collection
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                      {elCourses.map((course) => (
                        <CourseCard key={course.id} course={course} isEnrolled={true} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Divider between EL courses and other courses */}
                {elCourses.length > 0 && (otherCourses.length > 0 || filteredNative.length > 0) && (
                  <div className="flex items-center gap-4 py-4">
                    <Separator className="flex-1 bg-white/30" />
                    <span className="text-white/80 font-semibold text-sm uppercase tracking-wider">
                      Other Courses
                    </span>
                    <Separator className="flex-1 bg-white/30" />
                  </div>
                )}

                {/* Other Courses Section */}
                {(otherCourses.length > 0 || filteredNative.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                    {/* Native Courses */}
                    {filteredNative.map((course) => {
                      const enrollment = nativeEnrollments.find(e => e.course_id === course.id);
                      return (
                        <NativeCourseCard 
                          key={course.id} 
                          course={course} 
                          enrollment={enrollment}
                        />
                      );
                    })}
                    
                    {/* Regular Other Courses */}
                    {otherCourses.map((course) => (
                      <CourseCard key={course.id} course={course} isEnrolled={true} />
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </TabsContent>

        <TabsContent value="available" className="space-y-6">
          {(() => {
            const { elCourses, otherCourses } = separateELCourses(availableCourses);
            const filteredNative = filteredNativeCourses(availableNativeCourses);
            const hasAnyCourses = elCourses.length > 0 || otherCourses.length > 0 || filteredNative.length > 0;

            if (!hasAnyCourses) {
              return (
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
              );
            }

            return (
              <div className="space-y-6">
                {/* EL Courses Section */}
                {elCourses.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                      🎓 Empowering Learning Collection
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                      {elCourses.map((course) => (
                        <CourseCard key={course.id} course={course} isEnrolled={false} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Divider between EL courses and other courses */}
                {elCourses.length > 0 && (otherCourses.length > 0 || filteredNative.length > 0) && (
                  <div className="flex items-center gap-4 py-4">
                    <Separator className="flex-1 bg-white/30" />
                    <span className="text-white/80 font-semibold text-sm uppercase tracking-wider">
                      Other Courses
                    </span>
                    <Separator className="flex-1 bg-white/30" />
                  </div>
                )}

                {/* Other Courses Section */}
                {(otherCourses.length > 0 || filteredNative.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                    {/* Available Native Courses */}
                    {filteredNative.map((course) => (
                      <NativeCourseCard 
                        key={course.id} 
                        course={course}
                        onEnroll={() => handleNativeCourseEnroll(course.id)}
                        isEnrolling={enrollingCourseIds.has(course.id)}
                      />
                    ))}
                    
                    {/* Available Regular Other Courses */}
                    {otherCourses.map((course) => (
                      <CourseCard key={course.id} course={course} isEnrolled={false} />
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyCourses;
