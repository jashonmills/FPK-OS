import type { CourseCardModel } from '@/types/enhanced-course-card';
import type { CourseCard } from '@/types/course-card';

export function convertEnhancedCourseToCard(enhanced: CourseCardModel): CourseCard {
  return {
    id: enhanced.id,
    title: enhanced.title,
    description: enhanced.description,
    thumbnail_url: enhanced.thumbnailUrl,
    instructor_name: enhanced.instructorName,
    duration_minutes: enhanced.durationMinutes,
    difficulty_level: enhanced.difficulty,
    tags: enhanced.tags,
    source: enhanced.origin === 'platform' ? 'platform' : 'builder',
    status: enhanced.status as 'draft' | 'preview' | 'published' | 'archived',
    discoverable: enhanced.status === 'published',
    source_table: enhanced.origin === 'platform' ? 'courses' : 'org_courses',
    org_id: enhanced.orgId,
    badges: [],
    route: enhanced.route,
  };
}