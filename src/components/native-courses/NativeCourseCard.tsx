import React from 'react';
import { StyledCourseCard } from '@/components/common/StyledCourseCard';
import { NativeCourse, NativeEnrollment } from '@/hooks/useNativeCourses';

interface NativeCourseCardProps {
  course: NativeCourse;
  enrollment?: NativeEnrollment;
  onEnroll?: () => void;
  isEnrolling?: boolean;
}

export function NativeCourseCard({ 
  course, 
  enrollment, 
  onEnroll, 
  isEnrolling = false 
}: NativeCourseCardProps) {
  const isEnrolled = !!enrollment;
  
  // Get color theme based on course title
  const getColorTheme = (): 'blue' | 'orange' | 'purple' | 'green' => {
    const title = course.title.toLowerCase();
    if (title.includes('economics') || title.includes('modern')) return 'blue';
    if (title.includes('algebra')) return 'orange';
    if (title.includes('learning') || title.includes('state')) return 'purple';
    return 'green';
  };

  const getCourseType = () => {
    if (course.title.includes('Modern Economics')) return 'Full Course Curriculum';
    if (course.title.includes('Learning State')) return 'Beta Course';
    return 'Native Course';
  };

  return (
    <StyledCourseCard
      id={course.id}
      title={course.title}
      description={course.summary || ''}
      courseType={getCourseType()}
      isEnrolled={isEnrolled}
      progress={enrollment?.progress_pct || 0}
      duration={course.est_minutes}
      instructor="FPK University"
      route={`/courses/${course.slug}`}
      onEnroll={onEnroll}
      isEnrolling={isEnrolling}
      colorTheme={getColorTheme()}
      isCompleted={enrollment?.status === 'completed'}
    />
  );
}