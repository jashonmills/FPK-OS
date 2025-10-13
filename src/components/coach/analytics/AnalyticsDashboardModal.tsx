import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { KPICards } from './KPICards';
import { MasteryOverTimeChart } from './MasteryOverTimeChart';
import { TimeByDayChart } from './TimeByDayChart';
import { TopicBreakdownChart } from './TopicBreakdownChart';
import { ActivityHeatmapChart } from './ActivityHeatmapChart';
import { LearningStyleChart } from './LearningStyleChart';

interface AnalyticsDashboardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DashboardData {
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

export function AnalyticsDashboardModal({ open, onOpenChange }: AnalyticsDashboardModalProps) {
  const { session } = useAuth();
  const [dateRange, setDateRange] = useState<string>('last_30_days');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);

  const fetchDashboardData = async () => {
    if (!session) return;

    setLoading(true);
    try {
      const { data: dashboardData, error } = await supabase.functions.invoke(
        'get-analytics-dashboard',
        {
          body: { date_range: dateRange },
        }
      );

      if (error) throw error;

      setData(dashboardData);
    } catch (error) {
      console.error('Error fetching analytics dashboard:', error);
      toast.error('Failed to load analytics dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchDashboardData();
    }
  }, [open, dateRange, session]);

  const socraticMinutes = data?.topic_breakdown.reduce((acc: number, topic) => acc + (topic.study_time || 0), 0) ?? 0;
  const freeChatMinutes = 0; // We'll enhance this later with coach_sessions data

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Learning Analytics Dashboard</DialogTitle>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                <SelectItem value="all_time">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : data ? (
          <div className="space-y-6 py-4">
            <KPICards data={data.kpis} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MasteryOverTimeChart data={data.mastery_over_time} />
              <TimeByDayChart data={data.time_by_day} />
            </div>

            <TopicBreakdownChart data={data.topic_breakdown} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActivityHeatmapChart data={data.activity_heatmap} />
              <LearningStyleChart
                socraticMinutes={socraticMinutes}
                freeChatMinutes={freeChatMinutes}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
            No data available. Start your learning journey to see analytics!
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
