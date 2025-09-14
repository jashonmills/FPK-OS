import { supabase } from '@/integrations/supabase/client';

// Types for analytics data
export interface CourseMetrics {
  courseId: string;
  courseTitle: string;
  totalEnrollments: number;
  completionRate: number;
  averageTimeSpent: number;
  averageEngagement: number;
  dropoffPoints: number[];
  popularLessons: number[];
}

export interface LessonMetrics {
  lessonId: number;
  lessonTitle: string;
  completionRate: number;
  averageTimeSpent: number;
  averageEngagement: number;
  dropoffRate: number;
  retryRate: number;
}

export interface UserLearningPattern {
  userId: string;
  preferredLearningSpeed: 'slow' | 'normal' | 'fast';
  optimalSessionLength: number;
  bestPerformanceTimes: number[];
  learningVelocity: number;
  engagementPattern: 'visual' | 'interactive' | 'reading' | 'mixed';
}

export interface LearningInsight {
  type: 'recommendation' | 'warning' | 'achievement' | 'trend';
  title: string;
  description: string;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
  metadata: Record<string, any>;
}

// Utility functions for processing analytics data
export class InteractiveCourseAnalytics {
  
  /**
   * Calculate course-level metrics
   */
  static async getCourseMetrics(courseId: string): Promise<CourseMetrics> {
    try {
      // Get enrollment data
      const { data: enrollments } = await supabase
        .from('interactive_course_enrollments')
        .select('*')
        .eq('course_id', courseId);

      // Get lesson analytics
      const { data: lessons } = await supabase
        .from('interactive_lesson_analytics')
        .select('*')
        .eq('course_id', courseId);

      if (!enrollments || !lessons) {
        throw new Error('Failed to fetch course data');
      }

      const totalEnrollments = enrollments.length;
      const completions = enrollments.filter(e => e.completed_at).length;
      const completionRate = totalEnrollments > 0 ? (completions / totalEnrollments) * 100 : 0;

      const totalTime = enrollments.reduce((sum, e) => sum + (e.total_time_spent_minutes || 0), 0);
      const averageTimeSpent = totalEnrollments > 0 ? totalTime / totalEnrollments : 0;

      const engagementScores = lessons.map(l => l.engagement_score || 0);
      const averageEngagement = engagementScores.length > 0 ? 
        engagementScores.reduce((sum, score) => sum + score, 0) / engagementScores.length : 0;

      // Calculate dropoff points (lessons where completion rate drops significantly)
      const dropoffPoints = this.calculateDropoffPoints(lessons);
      
      // Find most popular lessons (highest completion rates)
      const popularLessons = this.findPopularLessons(lessons);

      return {
        courseId,
        courseTitle: enrollments[0]?.course_title || 'Unknown Course',
        totalEnrollments,
        completionRate: Math.round(completionRate),
        averageTimeSpent: Math.round(averageTimeSpent),
        averageEngagement: Math.round(averageEngagement),
        dropoffPoints,
        popularLessons
      };
    } catch (error) {
      console.error('Error calculating course metrics:', error);
      throw error;
    }
  }

  /**
   * Calculate lesson-level metrics
   */
  static async getLessonMetrics(courseId: string, lessonId: number): Promise<LessonMetrics> {
    try {
      const { data: lessonData } = await supabase
        .from('interactive_lesson_analytics')
        .select('*')
        .eq('course_id', courseId)
        .eq('lesson_id', lessonId);

      if (!lessonData || lessonData.length === 0) {
        throw new Error('No lesson data found');
      }

      const totalAttempts = lessonData.length;
      const completions = lessonData.filter(l => l.completed_at).length;
      const completionRate = totalAttempts > 0 ? (completions / totalAttempts) * 100 : 0;

      const totalTime = lessonData.reduce((sum, l) => sum + (l.time_spent_seconds || 0), 0);
      const averageTimeSpent = totalAttempts > 0 ? totalTime / totalAttempts / 60 : 0; // Convert to minutes

      const engagementScores = lessonData.map(l => l.engagement_score || 0);
      const averageEngagement = engagementScores.length > 0 ? 
        engagementScores.reduce((sum, score) => sum + score, 0) / engagementScores.length : 0;

      // Calculate dropoff rate (users who started but didn't complete)
      const dropoffRate = totalAttempts > 0 ? ((totalAttempts - completions) / totalAttempts) * 100 : 0;

      // Calculate retry rate (users who attempted multiple times)
      const uniqueUsers = new Set(lessonData.map(l => l.user_id)).size;
      const retryRate = uniqueUsers > 0 ? ((totalAttempts - uniqueUsers) / uniqueUsers) * 100 : 0;

      return {
        lessonId,
        lessonTitle: lessonData[0]?.lesson_title || `Lesson ${lessonId}`,
        completionRate: Math.round(completionRate),
        averageTimeSpent: Math.round(averageTimeSpent),
        averageEngagement: Math.round(averageEngagement),
        dropoffRate: Math.round(dropoffRate),
        retryRate: Math.round(retryRate)
      };
    } catch (error) {
      console.error('Error calculating lesson metrics:', error);
      throw error;
    }
  }

  /**
   * Analyze user learning patterns
   */
  static async analyzeUserLearningPattern(userId: string): Promise<UserLearningPattern> {
    try {
      // Get user's lesson analytics
      const { data: lessonData } = await supabase
        .from('interactive_lesson_analytics')
        .select('*')
        .eq('user_id', userId)
        .order('started_at');

      // Get user's session data
      const { data: sessionData } = await supabase
        .from('interactive_course_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('session_start');

      if (!lessonData || !sessionData) {
        throw new Error('Insufficient data for pattern analysis');
      }

      // Analyze learning speed
      const completedLessons = lessonData.filter(l => l.completed_at);
      const averageTimePerLesson = completedLessons.length > 0 ? 
        completedLessons.reduce((sum, l) => sum + (l.time_spent_seconds || 0), 0) / completedLessons.length / 60 : 0;

      let preferredLearningSpeed: 'slow' | 'normal' | 'fast' = 'normal';
      if (averageTimePerLesson > 30) preferredLearningSpeed = 'slow';
      else if (averageTimePerLesson < 15) preferredLearningSpeed = 'fast';

      // Analyze session patterns
      const sessionDurations = sessionData
        .filter(s => s.duration_seconds)
        .map(s => s.duration_seconds / 60);
      
      const optimalSessionLength = sessionDurations.length > 0 ? 
        Math.round(sessionDurations.reduce((sum, duration) => sum + duration, 0) / sessionDurations.length) : 30;

      // Analyze performance by time of day
      const performanceByHour = new Map<number, { total: number, completed: number }>();
      
      lessonData.forEach(lesson => {
        const hour = new Date(lesson.started_at).getHours();
        if (!performanceByHour.has(hour)) {
          performanceByHour.set(hour, { total: 0, completed: 0 });
        }
        const stats = performanceByHour.get(hour)!;
        stats.total++;
        if (lesson.completed_at) stats.completed++;
      });

      const bestPerformanceTimes = Array.from(performanceByHour.entries())
        .filter(([_, stats]) => stats.total >= 2) // Minimum attempts
        .sort(([_, a], [__, b]) => (b.completed / b.total) - (a.completed / a.total))
        .slice(0, 3)
        .map(([hour, _]) => hour);

      // Calculate learning velocity (lessons per hour)
      const totalLearningTime = sessionDurations.reduce((sum, duration) => sum + duration, 0) / 60; // Convert to hours
      const learningVelocity = totalLearningTime > 0 ? completedLessons.length / totalLearningTime : 0;

      // Analyze engagement patterns
      const avgEngagement = lessonData.length > 0 ? 
        lessonData.reduce((sum, l) => sum + (l.engagement_score || 0), 0) / lessonData.length : 0;
      
      let engagementPattern: 'visual' | 'interactive' | 'reading' | 'mixed' = 'mixed';
      if (avgEngagement > 80) engagementPattern = 'interactive';
      else if (avgEngagement > 60) engagementPattern = 'visual';
      else if (avgEngagement > 40) engagementPattern = 'reading';

      return {
        userId,
        preferredLearningSpeed,
        optimalSessionLength,
        bestPerformanceTimes,
        learningVelocity: Math.round(learningVelocity * 100) / 100,
        engagementPattern
      };
    } catch (error) {
      console.error('Error analyzing user learning pattern:', error);
      throw error;
    }
  }

  /**
   * Generate learning insights and recommendations
   */
  static async generateLearningInsights(userId: string, courseId?: string): Promise<LearningInsight[]> {
    const insights: LearningInsight[] = [];

    try {
      // Get user pattern
      const userPattern = await this.analyzeUserLearningPattern(userId);

      // Get course metrics if courseId provided
      let courseMetrics: CourseMetrics | null = null;
      if (courseId) {
        courseMetrics = await this.getCourseMetrics(courseId);
      }

      // Generate personalized recommendations
      if (userPattern.learningVelocity < 0.5) {
        insights.push({
          type: 'recommendation',
          title: 'Consider Shorter Study Sessions',
          description: `Your optimal session length appears to be ${userPattern.optimalSessionLength} minutes. Breaking study time into smaller chunks might improve retention.`,
          actionable: true,
          priority: 'medium',
          metadata: { suggestedSessionLength: userPattern.optimalSessionLength }
        });
      }

      if (userPattern.bestPerformanceTimes.length > 0) {
        insights.push({
          type: 'recommendation',
          title: 'Optimize Your Study Schedule',
          description: `You perform best during ${userPattern.bestPerformanceTimes.map(h => `${h}:00`).join(', ')}. Consider scheduling study sessions during these times.`,
          actionable: true,
          priority: 'medium',
          metadata: { optimalTimes: userPattern.bestPerformanceTimes }
        });
      }

      // Course-specific insights
      if (courseMetrics) {
        if (courseMetrics.dropoffPoints.length > 0) {
          insights.push({
            type: 'warning',
            title: 'Challenging Lessons Ahead',
            description: `Lessons ${courseMetrics.dropoffPoints.join(', ')} have higher dropout rates. Consider spending extra time on these topics.`,
            actionable: true,
            priority: 'high',
            metadata: { challengingLessons: courseMetrics.dropoffPoints }
          });
        }

        if (courseMetrics.averageEngagement < 50) {
          insights.push({
            type: 'recommendation',
            title: 'Increase Course Engagement',
            description: 'This course has lower average engagement. Try the interactive exercises and take notes to improve your learning experience.',
            actionable: true,
            priority: 'medium',
            metadata: { engagementTips: ['take notes', 'use interactive features', 'discuss with peers'] }
          });
        }
      }

      // Achievement insights
      if (userPattern.learningVelocity > 1.0) {
        insights.push({
          type: 'achievement',
          title: 'Fast Learner!',
          description: `You're completing lessons at ${userPattern.learningVelocity} lessons per hour, which is above average.`,
          actionable: false,
          priority: 'low',
          metadata: { learningVelocity: userPattern.learningVelocity }
        });
      }

      return insights;
    } catch (error) {
      console.error('Error generating learning insights:', error);
      return [];
    }
  }

  /**
   * Calculate dropoff points in a course
   */
  private static calculateDropoffPoints(lessons: any[]): number[] {
    const lessonCompletionRates = new Map<number, { total: number; completed: number }>();
    
    // Calculate completion rate for each lesson
    lessons.forEach(lesson => {
      const lessonId = lesson.lesson_id;
      if (!lessonCompletionRates.has(lessonId)) {
        lessonCompletionRates.set(lessonId, { total: 0, completed: 0 });
      }
      
      const stats = lessonCompletionRates.get(lessonId)!;
      stats.total++;
      if (lesson.completed_at) stats.completed++;
    });

    // Find lessons with significantly lower completion rates
    const rates = Array.from(lessonCompletionRates.entries())
      .map(([lessonId, stats]) => ({
        lessonId,
        rate: stats.total > 0 ? stats.completed / stats.total : 0
      }))
      .sort((a, b) => a.lessonId - b.lessonId);

    const dropoffPoints: number[] = [];
    const averageRate = rates.reduce((sum, r) => sum + r.rate, 0) / rates.length;

    rates.forEach(({ lessonId, rate }) => {
      if (rate < averageRate * 0.7) { // 30% below average
        dropoffPoints.push(lessonId);
      }
    });

    return dropoffPoints;
  }

  /**
   * Find most popular lessons
   */
  private static findPopularLessons(lessons: any[]): number[] {
    const lessonPopularity = new Map<number, { total: number; completed: number }>();
    
    lessons.forEach(lesson => {
      const lessonId = lesson.lesson_id;
      if (!lessonPopularity.has(lessonId)) {
        lessonPopularity.set(lessonId, { total: 0, completed: 0 });
      }
      
      const stats = lessonPopularity.get(lessonId)!;
      stats.total++;
      if (lesson.completed_at) stats.completed++;
    });

    return Array.from(lessonPopularity.entries())
      .map(([lessonId, stats]) => ({
        lessonId,
        rate: stats.total > 0 ? stats.completed / stats.total : 0,
        total: stats.total
      }))
      .filter(lesson => lesson.total >= 5) // Minimum attempts
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 5)
      .map(lesson => lesson.lessonId);
  }
}