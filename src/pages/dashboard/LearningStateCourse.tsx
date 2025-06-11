
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '@/hooks/useAccessibility';
import CourseHeader from '@/components/course/CourseHeader';
import CourseOverview from '@/components/course/CourseOverview';
import CoursePlayer from '@/components/course/CoursePlayer';

const LearningStateCourse = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const overviewRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { getAccessibilityClasses } = useAccessibility();

  useEffect(() => {
    const overview = overviewRef.current;
    if (!overview) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCollapsed(!entry.isIntersecting);
      },
      { 
        rootMargin: '-48px 0px 0px 0px' // Matches sticky header height
      }
    );

    observer.observe(overview);

    return () => observer.disconnect();
  }, []);

  const handleBackToCourses = () => {
    navigate('/dashboard/learner/my-courses');
  };

  const handleDashboard = () => {
    navigate('/dashboard/learner');
  };

  return (
    <div className={`min-h-screen flex flex-col w-full ${getAccessibilityClasses('container')}`}>
      <CourseHeader 
        onBackToCourses={handleBackToCourses}
        onDashboard={handleDashboard}
      />

      <div className="flex-1 relative">
        <div ref={overviewRef}>
          <CourseOverview 
            onDashboard={handleDashboard}
            onBackToCourses={handleBackToCourses}
          />
        </div>

        <CoursePlayer />
      </div>
    </div>
  );
};

export default LearningStateCourse;
