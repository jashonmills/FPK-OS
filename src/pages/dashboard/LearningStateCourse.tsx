
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCleanupDebugUI } from '@/hooks/useCleanupDebugUI';
import CourseHeader from '@/components/course/CourseHeader';
import CourseOverview from '@/components/course/CourseOverview';
import CoursePlayer from '@/components/course/CoursePlayer';
import CourseProgressSidebar from '@/components/course/CourseProgressSidebar';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import StickyMediaToolbar from '@/components/layout/StickyMediaToolbar';
import { PolishedContainer } from '@/components/common/UIPolishProvider';

const LearningStateCourse = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showStickyToolbar, setShowStickyToolbar] = useState(false);
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
  };

  const handleTogglePlay = () => {
    setMediaState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleSkip = (seconds: number) => {
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
            onBackToCourses={handleBackToCourses}
            onDashboard={handleDashboard}
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
              isActive: true,
              isLocked: false,
              progress: 65
            },
            {
              id: 'attention',
              title: 'Attention & Focus',
              duration: '18',
              type: 'video',
              isCompleted: false,
              isActive: false,
              isLocked: false,
              progress: 0
            },
            {
              id: 'memory',
              title: 'Memory Consolidation',
              duration: '25',
              type: 'text',
              isCompleted: false,
              isActive: false,
              isLocked: true,
              progress: 0
            },
            {
              id: 'metacognition',
              title: 'Metacognitive Strategies',
              duration: '20',
              type: 'pdf',
              isCompleted: false,
              isActive: false,
              isLocked: true,
              progress: 0
            }
          ]}
          courseProgress={42}
          onModuleSelect={(moduleId) => console.log('Selected module:', moduleId)}
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
          <CoursePlayer />
        </div>
      </PolishedContainer>
    </ResponsiveLayout>
  );
};

export default LearningStateCourse;
