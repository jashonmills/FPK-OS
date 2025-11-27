
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCleanupDebugUI } from '@/hooks/useCleanupDebugUI';
import { useUnifiedProgressTracking } from '@/hooks/useUnifiedProgressTracking';
import { useCleanup } from '@/utils/cleanupManager';
import CourseHeader from '@/components/course/CourseHeader';
import CourseOverview from '@/components/course/CourseOverview';
import CoursePlayer from '@/components/course/CoursePlayer';
import CourseProgressSidebar from '@/components/course/CourseProgressSidebar';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import StickyMediaToolbar from '@/components/layout/StickyMediaToolbar';
import { PolishedContainer } from '@/components/common/UIPolishProvider';

const LearningStateCourse = () => {
  const cleanup = useCleanup('LearningStateCourse');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showStickyToolbar, setShowStickyToolbar] = useState(false);
  const [currentLessonId, setCurrentLessonId] = useState<string>('cognitive-load');
  const [mediaState, setMediaState] = useState({
    isPlaying: false,
    progress: 0,
    title: 'Learning State Course'
  });
  
  const overviewRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { getAccessibilityClasses } = useAccessibility();
  const isMobile = useIsMobile();
  
  // Initialize unified progress tracking
  const {
    trackInteraction,
    trackLessonCompletion,
    trackCourseCompletion,
    totalTimeSpent,
    sessionActive
  } = useUnifiedProgressTracking(
    'learning-state-course',
    'Learning State Course',
    currentLessonId,
    'Cognitive Load Theory'
  );
  
  // Track interactions when component mounts
  useEffect(() => {
    // Track scroll interactions
    const handleScroll = () => {
      trackInteraction('page_scroll', {
        scrollY: window.scrollY,
        timestamp: new Date().toISOString()
      });
    };

    // Track click interactions
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      trackInteraction('click', {
        elementType: target.tagName.toLowerCase(),
        className: target.className,
        timestamp: new Date().toISOString()
      });
    };

    // Add event listeners with throttling
    let scrollTimeout: string;
    const throttledScrollHandler = () => {
      if (scrollTimeout) cleanup.cleanup(scrollTimeout);
      scrollTimeout = cleanup.setTimeout(handleScroll, 1000); // Throttle to once per second
    };

    cleanup.addEventListener(window, 'scroll', throttledScrollHandler);
    cleanup.addEventListener(document, 'click', handleClick);
  }, [trackInteraction, cleanup]);

  // Clean up debug UI in production
  useCleanupDebugUI({
    removeDebugAttributes: true,
    removeTestIds: true,
    hideDevOnlyElements: true
  });

  useEffect(() => {
    const overview = overviewRef.current;
    const player = playerRef.current;
    
    if (!overview || !player) return;

    const observer = new IntersectionObserver(
      ([overviewEntry, playerEntry]) => {
        setIsCollapsed(!overviewEntry.isIntersecting);
        // Show sticky toolbar when player is out of view and media is active
        setShowStickyToolbar(!playerEntry.isIntersecting && mediaState.progress > 0);
      },
      { 
        rootMargin: isMobile ? '-56px 0px 0px 0px' : '-48px 0px 0px 0px',
        threshold: 0.1
      }
    );

    observer.observe(overview);
    observer.observe(player);

    return () => observer.disconnect();
  }, [isMobile, mediaState.progress]);

  // Media control handlers
  const handleMediaStateChange = (newState: Partial<typeof mediaState>) => {
    setMediaState(prev => ({ ...prev, ...newState }));
    
    // Track media interactions
    if (newState.isPlaying !== undefined) {
      trackInteraction(newState.isPlaying ? 'media_play' : 'media_pause', {
        lessonId: currentLessonId,
        progress: newState.progress || mediaState.progress
      });
    }
    
    if (newState.progress !== undefined && newState.progress > 0) {
      trackInteraction('media_progress', {
        lessonId: currentLessonId,
        progress: newState.progress
      });
    }
  };

  const handleTogglePlay = () => {
    const newPlayState = !mediaState.isPlaying;
    setMediaState(prev => ({ ...prev, isPlaying: newPlayState }));
    
    trackInteraction(newPlayState ? 'media_play' : 'media_pause', {
      lessonId: currentLessonId,
      progress: mediaState.progress
    });
  };

  const handleSkip = (seconds: number) => {
    trackInteraction('media_skip', {
      lessonId: currentLessonId,
      skipSeconds: seconds,
      currentProgress: mediaState.progress
    });
    console.log(`Skipping ${seconds} seconds`);
  };

  const handleBackToCourses = () => {
    navigate('/dashboard/learner/courses');
  };

  const handleDashboard = () => {
    navigate('/dashboard/learner');
  };

  return (
    <ResponsiveLayout
      className={getAccessibilityClasses('container')}
      stickyToolbar={
        <div className="flex flex-col">
          <CourseHeader 
            courseTitle="Learning State Course"
          />
          <StickyMediaToolbar
            isVisible={showStickyToolbar}
            isPlaying={mediaState.isPlaying}
            title={mediaState.title}
            progress={mediaState.progress}
            onTogglePlay={handleTogglePlay}
            onSkipBack={() => handleSkip(-10)}
            onSkipForward={() => handleSkip(10)}
          />
        </div>
      }
      sidebar={
        <CourseProgressSidebar
          modules={[
            {
              id: 'intro',
              title: 'Introduction to Learning State',
              duration: '15',
              type: 'video',
              isCompleted: true,
              isActive: false,
              isLocked: false,
              progress: 100
            },
            {
              id: 'cognitive-load',
              title: 'Cognitive Load Theory',
              duration: '22',
              type: 'audio',
              isCompleted: false,
              isActive: currentLessonId === 'cognitive-load',
              isLocked: false,
              progress: 65
            },
            {
              id: 'attention',
              title: 'Attention & Focus',
              duration: '18',
              type: 'video',
              isCompleted: false,
              isActive: currentLessonId === 'attention',
              isLocked: false,
              progress: 0
            },
            {
              id: 'memory',
              title: 'Memory Consolidation',
              duration: '25',
              type: 'text',
              isCompleted: false,
              isActive: currentLessonId === 'memory',
              isLocked: true,
              progress: 0
            },
            {
              id: 'metacognition',
              title: 'Metacognitive Strategies',
              duration: '20',
              type: 'pdf',
              isCompleted: false,
              isActive: currentLessonId === 'metacognition',
              isLocked: true,
              progress: 0
            }
          ]}
          courseProgress={42}
          onModuleSelect={(moduleId) => {
            setCurrentLessonId(moduleId);
            trackInteraction('lesson_select', {
              previousLessonId: currentLessonId,
              newLessonId: moduleId
            });
            console.log('Selected module:', moduleId);
          }}
        />
      }
    >
      <PolishedContainer variant="content">
        <div ref={overviewRef}>
          <CourseOverview 
            onDashboard={handleDashboard}
            onBackToCourses={handleBackToCourses}
          />
        </div>

        <div ref={playerRef} className="mt-6">
          <CoursePlayer 
            onProgress={(progress) => {
              handleMediaStateChange({ progress });
            }}
            onComplete={() => {
              trackLessonCompletion(currentLessonId, 'Cognitive Load Theory');
            }}
          />
        </div>
      </PolishedContainer>
    </ResponsiveLayout>
  );
};

export default LearningStateCourse;
