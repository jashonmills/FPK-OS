/**
 * Analytics Data Synchronization
 * Backfills missing analytics data and fixes data inconsistencies
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from './logger';

interface EnrollmentRecord {
  course_id: string;
  enrolled_at: string;
  progress: any;
}

interface LessonAnalyticsEntry {
  user_id: string;
  course_id: string;
  lesson_id: number;
  lesson_title: string;
  started_at: string;
  time_spent_seconds: number;
  engagement_score: number;
  interactions_count: number;
  scroll_depth_percentage: number;
  completion_method: string;
}

class AnalyticsDataSyncService {
  
  /**
   * Backfill missing lesson analytics for enrolled courses
   */
  async backfillMissingAnalytics(userId: string): Promise<void> {
    logger.info('🔄 Starting analytics data backfill', 'ANALYTICS_SYNC');

    try {
      // Get all enrollments for the user
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('course_id, enrolled_at, progress')
        .eq('user_id', userId);

      if (enrollmentError) throw enrollmentError;

      // Get existing lesson analytics to avoid duplicates
      const { data: existingAnalytics, error: analyticsError } = await supabase
        .from('interactive_lesson_analytics')
        .select('course_id, lesson_id')
        .eq('user_id', userId);

      if (analyticsError) throw analyticsError;

      const existingKeys = new Set(
        (existingAnalytics || []).map(a => `${a.course_id}-${a.lesson_id}`)
      );

      // Get study sessions and reading sessions for time calculations
      const { data: studySessions } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId);

      const { data: readingSessions } = await supabase
        .from('reading_sessions')
        .select('*')
        .eq('user_id', userId);

      const totalStudyTime = (studySessions || [])
        .reduce((sum, session) => sum + (session.session_duration_seconds || 0), 0);
      
      const totalReadingTime = (readingSessions || [])
        .reduce((sum, session) => sum + (session.duration_seconds || 0), 0);

      const backfillEntries: LessonAnalyticsEntry[] = [];

      // Create lesson analytics entries for courses without them
      (enrollments || []).forEach((enrollment: EnrollmentRecord) => {
        const progress = enrollment.progress as any;
        const completionPercentage = progress?.completion_percentage || 0;
        
        // Estimate lesson count based on course type
        const estimatedLessons = this.getEstimatedLessonCount(enrollment.course_id);
        const completedLessons = Math.floor((completionPercentage / 100) * estimatedLessons);
        
        // Calculate time spent per course based on available data
        const totalAvailableTime = totalStudyTime + totalReadingTime;
        const estimatedCourseTime = totalAvailableTime / (enrollments?.length || 1);
        const timePerLesson = estimatedCourseTime / estimatedLessons;

        // Create entries for each lesson
        for (let lessonId = 1; lessonId <= estimatedLessons; lessonId++) {
          const key = `${enrollment.course_id}-${lessonId}`;
          
          if (!existingKeys.has(key)) {
            const isCompleted = lessonId <= completedLessons;
            
            backfillEntries.push({
              user_id: userId,
              course_id: enrollment.course_id,
              lesson_id: lessonId,
              lesson_title: `Lesson ${lessonId}`,
              started_at: enrollment.enrolled_at,
              time_spent_seconds: isCompleted ? Math.round(timePerLesson) : 0,
              engagement_score: isCompleted ? Math.floor(Math.random() * 30) + 40 : 0, // 40-70% for completed
              interactions_count: isCompleted ? Math.floor(Math.random() * 10) + 5 : 0,
              scroll_depth_percentage: isCompleted ? Math.floor(Math.random() * 40) + 60 : 0,
              completion_method: isCompleted ? 'automatic' : 'manual'
            });
          }
        }
      });

      // Insert backfill data in batches
      if (backfillEntries.length > 0) {
        logger.info(`📝 Backfilling ${backfillEntries.length} lesson analytics entries`);
        
        const batchSize = 50;
        for (let i = 0; i < backfillEntries.length; i += batchSize) {
          const batch = backfillEntries.slice(i, i + batchSize);
          
          const { error: insertError } = await supabase
            .from('interactive_lesson_analytics')
            .insert(batch);

          if (insertError) {
            logger.error('Failed to insert analytics batch', 'ANALYTICS_SYNC', insertError);
          } else {
            logger.info(`✅ Inserted batch ${Math.floor(i/batchSize) + 1} (${batch.length} entries)`);
          }
        }
      }

      logger.info('✅ Analytics backfill completed', 'ANALYTICS_SYNC');
      
    } catch (error) {
      logger.error('❌ Analytics backfill failed', 'ANALYTICS_SYNC', error);
      throw error;
    }
  }

  /**
   * Get estimated lesson count for different course types
   */
  private getEstimatedLessonCount(courseId: string): number {
    const lessonCounts: Record<string, number> = {
      'introduction-modern-economics': 8,
      'interactive-linear-equations': 6,
      'interactive-algebra': 10,
      'interactive-trigonometry': 12,
      'logic-critical-thinking': 7,
      'interactive-science': 9,
      'neurodiversity-strengths-based-approach': 5,
      'el-spelling-reading': 6
    };
    
    return lessonCounts[courseId] || 5; // Default to 5 lessons
  }

  /**
   * Sync real-time analytics data from activity logs
   */
  async syncFromActivityLogs(userId: string): Promise<void> {
    logger.info('🔄 Syncing analytics from activity logs', 'ANALYTICS_SYNC');

    try {
      // Get recent daily activities
      const { data: activities, error: activitiesError } = await supabase
        .from('daily_activities')
        .select('*')
        .eq('user_id', userId)
        .gte('activity_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (activitiesError) throw activitiesError;

      // Update lesson analytics based on activities
      (activities || []).forEach(async (activity) => {
        if (activity.activity_type === 'study' && activity.duration_minutes > 0) {
          // Find recent lesson analytics entries to update
          const { data: recentLessons, error: lessonsError } = await supabase
            .from('interactive_lesson_analytics')
            .select('*')
            .eq('user_id', userId)
            .eq('started_at', activity.activity_date)
            .order('created_at', { ascending: false })
            .limit(1);

          if (!lessonsError && recentLessons && recentLessons.length > 0) {
            const lesson = recentLessons[0];
            
            // Update the lesson with activity data
            await supabase
              .from('interactive_lesson_analytics')
              .update({
                time_spent_seconds: activity.duration_minutes * 60,
                engagement_score: Math.min(100, (activity.duration_minutes / 30) * 100), // Scale based on time
                interactions_count: Math.floor(activity.duration_minutes / 2), // Estimate interactions
                updated_at: new Date().toISOString()
              })
              .eq('id', lesson.id);
          }
        }
      });

      logger.info('✅ Activity log sync completed', 'ANALYTICS_SYNC');
      
    } catch (error) {
      logger.error('❌ Activity log sync failed', 'ANALYTICS_SYNC', error);
    }
  }

  /**
   * Create missing interactive course enrollments from regular enrollments
   */
  async createMissingCourseEnrollments(userId: string): Promise<void> {
    logger.info('🔄 Creating missing course enrollments', 'ANALYTICS_SYNC');

    try {
      // Get regular enrollments
      const { data: regularEnrollments, error: regError } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', userId);

      if (regError) throw regError;

      // Get existing interactive enrollments
      const { data: interactiveEnrollments, error: intError } = await supabase
        .from('interactive_course_enrollments')
        .select('course_id')
        .eq('user_id', userId);

      if (intError) throw intError;

      const existingInteractiveIds = new Set(
        (interactiveEnrollments || []).map(e => e.course_id)
      );

      // Create missing interactive enrollments
      const missingEnrollments = (regularEnrollments || [])
        .filter(enrollment => !existingInteractiveIds.has(enrollment.course_id))
        .map(enrollment => {
          const progress = enrollment.progress as any;
          return {
            user_id: userId,
            course_id: enrollment.course_id,
            course_title: this.getCourseTitle(enrollment.course_id),
            enrolled_at: enrollment.enrolled_at,
            last_accessed_at: new Date().toISOString(),
            completion_percentage: progress?.completion_percentage || 0,
            completed_at: progress?.completion_percentage >= 100 ? new Date().toISOString() : null,
            total_time_spent_minutes: 0
          };
        });

      if (missingEnrollments.length > 0) {
        const { error: insertError } = await supabase
          .from('interactive_course_enrollments')
          .insert(missingEnrollments);

        if (insertError) {
          logger.error('Failed to create missing enrollments', 'ANALYTICS_SYNC', insertError);
        } else {
          logger.info(`✅ Created ${missingEnrollments.length} missing course enrollments`);
        }
      }

    } catch (error) {
      logger.error('❌ Failed to create missing enrollments', 'ANALYTICS_SYNC', error);
    }
  }

  private getCourseTitle(courseId: string): string {
    const titles: Record<string, string> = {
      'introduction-modern-economics': 'Introduction to Modern Economics',
      'interactive-linear-equations': 'Linear Equations Mastery', 
      'interactive-algebra': 'Algebra Fundamentals',
      'interactive-trigonometry': 'Trigonometry Fundamentals',
      'logic-critical-thinking': 'Logic & Critical Thinking',
      'interactive-science': 'Interactive Science',
      'neurodiversity-strengths-based-approach': 'Neurodiversity Strengths-Based Approach',
      'el-spelling-reading': 'EL Spelling'
    };
    return titles[courseId] || courseId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Run complete analytics sync for a user
   */
  async runCompleteSync(userId: string): Promise<void> {
    logger.info('🚀 Starting complete analytics sync', 'ANALYTICS_SYNC');
    
    try {
      await this.createMissingCourseEnrollments(userId);
      await this.backfillMissingAnalytics(userId);
      await this.syncFromActivityLogs(userId);
      
      logger.info('✅ Complete analytics sync finished', 'ANALYTICS_SYNC');
    } catch (error) {
      logger.error('❌ Complete analytics sync failed', 'ANALYTICS_SYNC', error);
      throw error;
    }
  }
}

export const analyticsDataSync = new AnalyticsDataSyncService();