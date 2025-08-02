
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useIsMobile } from '@/hooks/use-mobile';
import CourseHeader from '@/components/course/CourseHeader';
import CourseOverview from '@/components/course/CourseOverview';
import CoursePlayer from '@/components/course/CoursePlayer';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import StickyMediaToolbar from '@/components/layout/StickyMediaToolbar';

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
    // This would integrate with the actual media player
    setMediaState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleSkip = (seconds: number) => {
    // This would integrate with the actual media player
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
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Course Navigation</h3>
          <div className="text-sm text-muted-foreground">
            Module navigation and progress will appear here
          </div>
        </div>
      }
    >
      <div ref={overviewRef}>
        <CourseOverview 
          onDashboard={handleDashboard}
          onBackToCourses={handleBackToCourses}
        />
      </div>

      <div ref={playerRef}>
        <CoursePlayer />
      </div>
    </ResponsiveLayout>
  );
};

export default LearningStateCourse;
