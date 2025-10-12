
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

// Import course card background
import geometryCourseCardBg from '@/assets/geometry-course-card-bg.jpg';
import courseMoneyManagement from '@/assets/course-money-management.jpg';
import courseSpellingReading from '@/assets/course-spelling-reading.jpg';
import courseAlgebra from '@/assets/course-algebra.jpg';
import courseHandwritingBg from '@/assets/course-handwriting-bg.jpg';
import elHandwritingBg from '@/assets/el-handwriting-bg.jpg';
import courseNeurodiversityBg from '@/assets/course-neurodiversity-bg.jpg';
import learningStateBg from '@/assets/learning-state-course-bg.jpg';
import empoweringSpellingBg from '@/assets/empowering-spelling-unique-bg.jpg';
import courseLinearEquationsBg from '@/assets/course-linear-equations-bg.jpg';
import courseTrigonometryBg from '@/assets/course-trigonometry-bg.jpg';
import courseEconomicsBg from '@/assets/course-economics-bg.jpg';
import courseLogicBg from '@/assets/course-logic-bg.jpg';
import courseScienceBg from '@/assets/course-science-bg.jpg';
import eltBackground from '@/assets/elt-background.jpg';
import { useFirstVisitVideo } from '@/hooks/useFirstVisitVideo';
import { FirstVisitVideoModal } from '@/components/common/FirstVisitVideoModal';
import { PageHelpTrigger } from '@/components/common/PageHelpTrigger';
import { Link } from 'react-router-dom';

// Hard-coded Interactive Courses
const INTERACTIVE_LINEAR_EQUATIONS_COURSE = {
  id: 'interactive-linear-equations',
  title: 'Interactive Linear Equations',
  description: 'Master solving linear equations through interactive lessons and practice problems. Learn step-by-step problem solving with immediate feedback.',
  thumbnail_url: courseLinearEquationsBg,
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
  thumbnail_url: courseTrigonometryBg,
  difficulty_level: 'intermediate',
  duration_minutes: 300,
  instructor_name: 'FPK University',
  featured: true,
  status: 'published'
};

const INTERACTIVE_ALGEBRA_COURSE = {
  id: 'interactive-algebra',
  title: 'Interactive Algebra',
  description: 'Master algebra fundamentals through interactive lessons and practice problems. Learn algebraic expressions, equations, and problem-solving techniques.',
  thumbnail_url: courseAlgebra,
  difficulty_level: 'beginner',
  duration_minutes: 320,
  instructor_name: 'FPK University',
  featured: true,
  status: 'published'
};

const LOGIC_CRITICAL_THINKING_COURSE = {
  id: 'logic-critical-thinking',
  title: 'Logic and Critical Thinking',
  description: 'Develop essential reasoning skills through systematic study of logic and critical thinking. Learn to analyze arguments, identify fallacies, and construct sound reasoning.',
  thumbnail_url: courseLogicBg,
  difficulty_level: 'beginner',
  duration_minutes: 400,
  instructor_name: 'FPK University',
  featured: true,
  status: 'published'
};

const NEURODIVERSITY_STRENGTHS_COURSE = {
  id: 'neurodiversity-strengths-based-approach',
  title: 'Neurodiversity: A Strengths-Based Approach',
  description: 'Your guide to leveraging your unique brain for academic success. Discover how neurodivergence is an asset and learn to harness your cognitive superpowers.',
  thumbnail_url: courseNeurodiversityBg,
  difficulty_level: 'beginner',
  duration_minutes: 360,
  instructor_name: 'FPK University',
  featured: true,
  status: 'published'
};

const INTRODUCTION_TO_SCIENCE_COURSE = {
  id: 'interactive-science',
  title: 'Introduction to Science',
  description: 'Get to grips with the basics of biology, chemistry, and physics. Learn the scientific method and explore the building blocks of life and matter.',
  thumbnail_url: courseScienceBg,
  difficulty_level: 'beginner',
  duration_minutes: 360,
  instructor_name: 'FPK University',
  featured: true,
  status: 'published'
};

const ELT_EMPOWERING_LEARNING_TECHNIQUES_COURSE = {
  id: 'elt-empowering-learning-techniques',
  title: 'ELT: Empowering Learning Techniques',
  description: 'Master evidence-based learning strategies specifically designed for neurodiverse minds. Transform how you learn, study, and succeed in any academic environment.',
  thumbnail_url: eltBackground,
  difficulty_level: 'beginner',
  duration_minutes: 240,
  instructor_name: 'FPK University',
  featured: true,
  status: 'published'
};

const GEOMETRY_FUNDAMENTALS_COURSE = {
  id: 'geometry',
  title: 'Interactive Geometry Fundamentals',
  description: 'Master the essential concepts of geometry, from basic shapes and angles to advanced proofs and transformations. Build a solid foundation in spatial reasoning and mathematical thinking.',
  thumbnail_url: geometryCourseCardBg,
  difficulty_level: 'beginner',
  duration_minutes: 480,
  instructor_name: 'FPK University',
  featured: true,
  status: 'published'
};

// Additional static courses for display
const additionalCourses = [
  {
    id: 'money-management-teens',
    title: 'Money Management for Teens',
    description: 'Learn essential financial skills including budgeting, saving, investing, and credit management. Build a strong foundation for financial success.',
    instructor_name: 'FPK University',
    duration_minutes: 360,
    difficulty_level: 'beginner',
    featured: true,
    is_free: true,
    price: 0,
    tags: ['Life Skills', 'Personal Finance', 'Budgeting', 'Investing'],
    thumbnail_url: courseMoneyManagement,
  }
];

const EMPOWERING_LEARNING_READING_COURSE = {
  id: 'empowering-learning-reading',
  title: 'Empowering Learning for Reading',
  description: 'Master reading through visual memory techniques and optimal learning states. A comprehensive program designed for visual learners to overcome reading challenges.',
  instructor_name: 'FPK University',
  duration_minutes: 120,
  difficulty_level: 'beginner',
  featured: true,
  is_free: true,
  price: 0,
  tags: ['Language Arts', 'Reading', 'Visual Learning', 'Memory Techniques'],
  thumbnail_url: courseSpellingReading,
  status: 'published'
};

const EMPOWERING_LEARNING_NUMERACY_COURSE = {
  id: 'empowering-learning-numeracy',
  title: 'Empowering Learning for Numeracy',
  description: 'Master mathematics through visual memory techniques and number triangles. Learn addition, subtraction, multiplication and division using proven visual learning methods.',
  instructor_name: 'FPK University',
  duration_minutes: 120,
  difficulty_level: 'beginner',
  featured: true,
  is_free: true,
  price: 0,
  tags: ['Mathematics', 'Numeracy', 'Visual Learning', 'Number Triangles'],
  thumbnail_url: courseSpellingReading,
  status: 'published'
};

const MONEY_MANAGEMENT_COURSE = {
  id: 'money-management-teens',
  title: 'Money Management for Teens',
  description: 'Learn essential financial skills including budgeting, saving, investing, and credit management. Build a strong foundation for financial success.',
  instructor_name: 'FPK University',
  duration_minutes: 360,
  difficulty_level: 'beginner',
  featured: true,
  is_free: true,
  price: 0,
  tags: ['Life Skills', 'Personal Finance', 'Budgeting', 'Investing'],
  thumbnail_url: courseMoneyManagement,
  status: 'published'
};

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

const EMPOWERING_LEARNING_HANDWRITING_COURSE = {
  id: 'empowering-learning-handwriting',
  title: 'Empowering Learning: Handwriting',
  description: 'Master handwriting techniques through systematic practice and understanding. Develop fluency, readability, and confidence in written communication.',
  instructor_name: 'FPK University',
  duration_minutes: 180,
  difficulty_level: 'beginner',
  featured: true,
  is_free: true,
  price: 0,
  tags: ['Writing Skills', 'Handwriting', 'Motor Skills', 'Education'],
  thumbnail_url: courseHandwritingBg,
  status: 'published'
};

const EL_HANDWRITING_COURSE = {
  id: 'el-handwriting',
  title: 'EL Handwriting',
  description: 'Master handwriting through visual emulation techniques and optimal learning states. Includes deep dive modules exploring the neuroscience behind handwriting development.',
  instructor_name: 'FPK University',
  duration_minutes: 240,
  difficulty_level: 'beginner',
  featured: true,
  is_free: true,
  price: 0,
  tags: ['Writing Skills', 'Handwriting', 'Emulation Technique', 'Visual Learning', 'Neuroscience'],
  thumbnail_url: elHandwritingBg,
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
  const { enrollInCourse: enrollInInteractiveCourse, isEnrolling: isCourseEnrolling } = useCourseEnrollment();
  
  // Native courses
  const { data: nativeCourses = [], isLoading: nativeCoursesLoading } = useNativeCourses({
    organizationId: userOrganization?.organization_id,
  });
  const { data: nativeEnrollments = [] } = useNativeEnrollments();
  const { enrollInCourse } = useNativeEnrollmentMutations();
  
  // Track enrollment state per course
  const [enrollingCourseIds, setEnrollingCourseIds] = useState<Set<string>>(new Set());
  
  // Handle course enrollment with per-course state tracking
  const handleCourseEnroll = async (courseId: string) => {
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
    } catch (error) {
      console.error('Failed to enroll in course:', courseId, error);
      toast.error(`Failed to enroll in course: ${error.message}`);
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
  

const EL_SPELLING_READING_COURSE = {
  id: 'el-spelling-reading',
  title: 'EL Spelling & Reading',
  description: 'Master spelling and reading through visual memory techniques and optimal learning states. A comprehensive program designed for visual learners.',
  instructor_name: 'FPK University',
  duration_minutes: 120,
  difficulty_level: 'beginner',
  featured: true,
  is_free: true,
  price: 0,
  tags: ['Language Arts', 'Spelling', 'Reading', 'Visual Learning', 'Memory Techniques'],
  thumbnail_url: empoweringSpellingBg,
  status: 'published'
};

const OPTIMAL_LEARNING_STATE_COURSE = {
  id: 'optimal-learning-state',
  title: 'Optimal Learning State Course',
  description: 'Master the optimal learning state through calming techniques and brain integration methods. Learn essential techniques to achieve the most effective learning state.',
  instructor_name: 'FPK University',
  duration_minutes: 180,
  difficulty_level: 'beginner',
  featured: true,
  is_free: true,
  price: 0,
  tags: ['Learning Skills', 'Brain Integration', 'Focus Enhancement', 'Calming Techniques'],
  thumbnail_url: learningStateBg,
  status: 'published'
};

const VIDEO_PRODUCTION_COURSE = {
  id: 'introduction-video-production',
  title: 'Introduction to Video Production',
  description: 'Learn the fundamentals of video production from start to finish in this introductory lesson.',
  thumbnail_url: 'https://i.vimeocdn.com/video/1596743275-b4263b12c58916c739173b84e4510b423985312d41872956a59ed7a551989569-d_1920x1080',
  difficulty_level: 'beginner',
  duration_minutes: 20,
  instructor_name: 'FPK University',
  featured: false,
  is_free: true,
  price: 0,
  tags: ['Video Production', 'Media', 'Creative Skills'],
  status: 'published'
};

  // Combine global and organization courses - ensuring handwriting course is prioritized
  const allAvailableCourses = [
    EL_HANDWRITING_COURSE, // New EL Handwriting course
    EMPOWERING_LEARNING_HANDWRITING_COURSE, // Original handwriting course
    EL_SPELLING_READING_COURSE, // Add the primary EL Spelling & Reading course
    OPTIMAL_LEARNING_STATE_COURSE, // Add the new Learning State course
    ELT_EMPOWERING_LEARNING_TECHNIQUES_COURSE, // Add the new ELT course
    VIDEO_PRODUCTION_COURSE, // Add the new Video Production course
    ...courses,
    ...(orgCourses?.assignedCourses || []),
    ...(orgCourses?.organizationOwnedCourses || []),
    INTERACTIVE_LINEAR_EQUATIONS_COURSE, // Add hardcoded courses
    INTERACTIVE_TRIGONOMETRY_COURSE,
    INTERACTIVE_ALGEBRA_COURSE,
    LOGIC_CRITICAL_THINKING_COURSE,
    NEURODIVERSITY_STRENGTHS_COURSE,
    INTRODUCTION_TO_SCIENCE_COURSE,
    GEOMETRY_FUNDAMENTALS_COURSE,
    EMPOWERING_LEARNING_READING_COURSE,
    EMPOWERING_LEARNING_NUMERACY_COURSE,
    MONEY_MANAGEMENT_COURSE,
  ].filter((course, index, self) => 
    // Remove duplicates by id
    index === self.findIndex(c => c.id === course.id)
  );
  
  const enrolledCourses = allAvailableCourses.filter(course => 
    enrolledCourseIds.includes(course.id)
  );
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
      // Empowering Learning courses should be first
      const empoweringLearningIds = ['el-handwriting', 'empowering-learning-handwriting', 'empowering-learning-numeracy', 'empowering-learning-reading', 'empowering-learning-spelling', 'optimal-learning-state'];
      const aIsEmpowering = empoweringLearningIds.includes(a.id);
      const bIsEmpowering = empoweringLearningIds.includes(b.id);
      
      if (aIsEmpowering && !bIsEmpowering) return -1;
      if (!aIsEmpowering && bIsEmpowering) return 1;
      
      // Then other courses by name
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
    const isOptimalLearningState = course.id === 'optimal-learning-state';
    const isEmpoweringLearningSpelling = course.id === 'el-spelling-reading';
    const isEmpoweringLearningReading = course.id === 'empowering-learning-reading';
    const isEmpoweringLearningNumeracy = course.id === 'empowering-learning-numeracy';
    const isEmpoweringLearningHandwriting = course.id === 'empowering-learning-handwriting';
    const isInteractiveLinearEquations = course.id === 'interactive-linear-equations';
    const isInteractiveTrigonometry = course.id === 'interactive-trigonometry';
    const isInteractiveAlgebra = course.id === 'interactive-algebra';
    const isIntroductionModernEconomics = course.id === 'introduction-modern-economics';
    const isLogicCriticalThinking = course.id === 'logic-critical-thinking';
    const isNeurodiversityStrengths = course.id === 'neurodiversity-strengths-based-approach';
    const isIntroductionToScience = course.id === 'interactive-science';
    const isGeometryFundamentals = course.id === 'geometry';
    const isELTEmpoweringLearning = course.id === 'elt-empowering-learning-techniques';

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

    // Fixed course route logic
    const getCourseRoute = () => {
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
      
      if (course.id === 'money-management-teens') {
        return '/courses/money-management-teens';
      }
      
      if (isELTEmpoweringLearning) {
        return '/courses/elt-empowering-learning-techniques';
      }
      
      if (course.id === 'el-handwriting') {
        return '/courses/el-handwriting';
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
    <div className="space-y-6 pl-2 pr-6 md:pl-4 md:pr-8 lg:pl-6 lg:pr-10">
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
          {(filteredCourses(enrolledCourses).length > 0 || filteredNativeCourses(enrolledNativeCourses).length > 0) ? (
            <div className="space-y-4">
              {studentAssignments.length > 0 && (
                <h3 className="text-lg font-semibold text-white">My Other Courses</h3>
              )}
              {/* All Courses */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
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
            </div>
          ) : studentAssignments.length === 0 ? (
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
          ) : null}
        </TabsContent>

        <TabsContent value="available" className="space-y-6">
          {(filteredCourses(availableCourses).length > 0 || filteredNativeCourses(availableNativeCourses).length > 0) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {/* Available Native Courses */}
              {filteredNativeCourses(availableNativeCourses).map((course) => (
                <NativeCourseCard 
                  key={course.id} 
                  course={course}
                  onEnroll={() => handleNativeCourseEnroll(course.id)}
                  isEnrolling={enrollingCourseIds.has(course.id)}
                />
              ))}
              
              {/* Available Regular Courses */}
              {filteredCourses(availableCourses)
                .map((course) => (
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
