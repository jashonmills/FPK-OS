/**
 * Analytics-related type definitions
 */

export interface AnalyticsData {
  id: string;
  timestamp: string;
  value: number;
  metadata?: Record<string, unknown>;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  category?: string;
  color?: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  trend?: 'up' | 'down' | 'stable';
  change?: number;
  unit?: string;
}

export interface UserPerformance {
  userId: string;
  username: string;
  score: number;
  completedSessions: number;
  totalTime: number;
  rank?: number;
}

export interface GoalCategory {
  name: string;
  count: number;
  completionRate: number;
  averageProgress: number;
}

export interface TopItem {
  id: string;
  name: string;
  count: number;
  percentage?: number;
}

export interface AnalyticsStats {
  totalUsers: number;
  totalSessions: number;
  averageSessionTime: number;
  completionRate: number;
  topBooks?: TopItem[];
  topGoals?: TopItem[];
  topContexts?: TopItem[];
  goalCategories?: GoalCategory[];
  userPerformance?: UserPerformance[];
}

export interface TimeSeriesData {
  date: string;
  value: number;
  category?: string;
}

export interface AnalyticsCard {
  id: string;
  title: string;
  component: React.ComponentType<AnalyticsCardProps>;
  featureFlag?: string;
  order?: number;
}

export interface AnalyticsCardProps {
  data?: AnalyticsData[];
  timeRange?: string;
  refreshTrigger?: number;
  className?: string;
}