/**
 * Analytics data structure definitions
 */

export interface EnrollmentData {
  id: string;
  user_id: string;
  course_id: string;
  course_title: string;
  enrolled_at: string;
  last_accessed_at: string;
  completion_percentage: number;
  completed_at?: string;
  total_time_spent_minutes: number;
  progress?: number; // Optional - can be derived from completion_percentage
}

export interface LessonData {
  id: string;
  course_id: string;
  lesson_id: number;
  lesson_title: string;
  time_spent_seconds: number;
  engagement_score?: number;
  completion_rate?: number;
  average_score?: number;
  completed_at?: string;
  completion_method?: string;
  created_at?: string;
  interactions_count?: number;
  user_id?: string;
}

export interface SessionData {
  id: string;
  user_id: string;
  session_type: 'reading' | 'study' | 'course' | 'quiz';
  duration_minutes: number;
  created_at: string;
  metadata?: Record<string, unknown>;
}

export interface ActivityData {
  id: string;
  user_id: string;
  activity_type: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface GoalData {
  id: string;
  user_id: string;
  title: string;
  category: string;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  created_at: string;
  completed_at?: string;
}

export interface BadgeData {
  id: string;
  user_id: string;
  badge_name: string;
  earned_at: string;
  xp_reward: number;
}

export interface StreakData {
  id: string;
  user_id: string;
  streak_type: string;
  current_count: number;
  max_count: number;
  last_activity: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  date?: string;
  category?: string;
}

export interface HeatmapData {
  day: string;
  hour: number;
  activity_count: number;
  intensity: number;
}

export interface FunnelData {
  stage: string;
  users: number;
  conversion_rate: number;
  previous_stage?: string;
}

export interface TrendData {
  period: string;
  metric: string;
  value: number;
  change_percent?: number;
}

export interface InteractionData {
  timestamp: string;
  interaction_type: string;
  component: string;
  metadata?: Record<string, unknown>;
}