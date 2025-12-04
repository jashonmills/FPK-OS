/**
 * Mock Analytics Data Generator
 * 
 * Generates realistic-looking analytics data for the "empty state" of the dashboard.
 * This serves as a preview and motivational tool for new users.
 */

export interface MockAnalyticsData {
  kpis: {
    total_study_time: number;
    total_sessions: number;
    current_streak: number;
    average_mastery: number;
  };
  activity_heatmap: Array<{ date: string; study_time: number }>;
  time_by_day: Array<{ day: string; study_time: number }>;
  time_by_hour: Array<{ hour: number; study_time: number }>;
  topic_breakdown: Array<{
    topic: string;
    study_time: number;
    mastery_score: number;
    session_count: number;
  }>;
  mastery_over_time: Array<{ date: string; avg_mastery: number }>;
}

export function generateMockAnalyticsData(): MockAnalyticsData {
  // Generate dates for the past 30 days
  const today = new Date();
  const activityHeatmap: Array<{ date: string; study_time: number }> = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Vary study time: some days off, others with good sessions
    const studyTime = i % 7 === 0 ? 0 : Math.floor(Math.random() * 90) + 30;
    activityHeatmap.push({ date: dateStr, study_time: studyTime });
  }

  // Generate mastery progression over 12 weeks
  const masteryOverTime: Array<{ date: string; avg_mastery: number }> = [];
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 84); // 12 weeks ago
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + (i * 7));
    const dateStr = date.toISOString().split('T')[0];
    
    // Gradually improve from 1.2 to 2.3 mastery
    const avgMastery = 1.2 + (i * 0.09);
    masteryOverTime.push({ 
      date: dateStr, 
      avg_mastery: parseFloat(avgMastery.toFixed(2)) 
    });
  }

  return {
    kpis: {
      total_study_time: 12500, // ~208 hours
      total_sessions: 47,
      current_streak: 5,
      average_mastery: 2.3,
    },
    activity_heatmap: activityHeatmap,
    time_by_day: [
      { day: 'Monday', study_time: 180 },
      { day: 'Tuesday', study_time: 145 },
      { day: 'Wednesday', study_time: 195 },
      { day: 'Thursday', study_time: 160 },
      { day: 'Friday', study_time: 125 },
      { day: 'Saturday', study_time: 85 },
      { day: 'Sunday', study_time: 90 },
    ],
    time_by_hour: [
      { hour: 0, study_time: 0 },
      { hour: 1, study_time: 0 },
      { hour: 2, study_time: 0 },
      { hour: 3, study_time: 0 },
      { hour: 4, study_time: 0 },
      { hour: 5, study_time: 0 },
      { hour: 6, study_time: 5 },
      { hour: 7, study_time: 15 },
      { hour: 8, study_time: 25 },
      { hour: 9, study_time: 35 },
      { hour: 10, study_time: 40 },
      { hour: 11, study_time: 45 },
      { hour: 12, study_time: 50 },
      { hour: 13, study_time: 55 },
      { hour: 14, study_time: 85 }, // Peak afternoon
      { hour: 15, study_time: 75 },
      { hour: 16, study_time: 70 },
      { hour: 17, study_time: 60 },
      { hour: 18, study_time: 50 },
      { hour: 19, study_time: 65 }, // Evening peak
      { hour: 20, study_time: 55 },
      { hour: 21, study_time: 40 },
      { hour: 22, study_time: 20 },
      { hour: 23, study_time: 5 },
    ],
    topic_breakdown: [
      { 
        topic: 'Algebra', 
        study_time: 320, 
        mastery_score: 2.4, 
        session_count: 12 
      },
      { 
        topic: 'Biology', 
        study_time: 280, 
        mastery_score: 2.1, 
        session_count: 10 
      },
      { 
        topic: 'History', 
        study_time: 195, 
        mastery_score: 2.6, 
        session_count: 8 
      },
      { 
        topic: 'Chemistry', 
        study_time: 165, 
        mastery_score: 1.9, 
        session_count: 7 
      },
      { 
        topic: 'Literature', 
        study_time: 145, 
        mastery_score: 2.2, 
        session_count: 6 
      },
      { 
        topic: 'Physics', 
        study_time: 125, 
        mastery_score: 2.0, 
        session_count: 5 
      },
      { 
        topic: 'Spanish', 
        study_time: 95, 
        mastery_score: 2.3, 
        session_count: 4 
      },
    ],
    mastery_over_time: masteryOverTime,
  };
}
