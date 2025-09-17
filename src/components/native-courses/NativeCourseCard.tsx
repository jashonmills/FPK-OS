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

  const getCourseType = () => {
    if (course.title.includes('Modern Economics')) return 'Full Course Curriculum';
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
      isCompleted={enrollment?.status === 'completed'}
    />
  );
}