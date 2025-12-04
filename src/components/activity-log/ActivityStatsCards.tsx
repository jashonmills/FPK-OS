import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useFamily } from '@/contexts/FamilyContext';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Calendar, TrendingUp, AlertCircle } from 'lucide-react';

interface StatsData {
  totalLogs: number;
  todayLogs: number;
  weekLogs: number;
  mostCommon: string;
}

export const ActivityStatsCards = () => {
  const { selectedFamily, selectedStudent } = useFamily();
  const [stats, setStats] = useState<StatsData>({
    totalLogs: 0,
    todayLogs: 0,
    weekLogs: 0,
    mostCommon: 'N/A',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedFamily?.id && selectedStudent?.id) {
      fetchStats();
    }
  }, [selectedFamily?.id, selectedStudent?.id]);

  const fetchStats = async () => {
    if (!selectedFamily?.id || !selectedStudent?.id) return;
    
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Fetch all log types
      const [incidents, parentLogs, educatorLogs, sleepRecords] = await Promise.all([
        supabase
          .from('incident_logs')
          .select('incident_date, incident_type')
          .eq('family_id', selectedFamily.id)
          .eq('student_id', selectedStudent.id),
        supabase
          .from('parent_logs')
          .select('log_date')
          .eq('family_id', selectedFamily.id)
          .eq('student_id', selectedStudent.id),
        supabase
          .from('educator_logs')
          .select('log_date')
          .eq('family_id', selectedFamily.id)
          .eq('student_id', selectedStudent.id),
        supabase
          .from('sleep_records')
          .select('sleep_date')
          .eq('family_id', selectedFamily.id)
          .eq('student_id', selectedStudent.id),
      ]);

      // Calculate totals
      const incidentCount = incidents.data?.length || 0;
      const parentCount = parentLogs.data?.length || 0;
      const educatorCount = educatorLogs.data?.length || 0;
      const sleepCount = sleepRecords.data?.length || 0;
      const totalLogs = incidentCount + parentCount + educatorCount + sleepCount;

      // Calculate today's logs
      const todayIncidents = incidents.data?.filter(log => log.incident_date === today).length || 0;
      const todayParent = parentLogs.data?.filter(log => log.log_date === today).length || 0;
      const todayEducator = educatorLogs.data?.filter(log => log.log_date === today).length || 0;
      const todaySleep = sleepRecords.data?.filter(log => log.sleep_date === today).length || 0;
      const todayLogs = todayIncidents + todayParent + todayEducator + todaySleep;

      // Calculate week's logs
      const weekIncidents = incidents.data?.filter(log => log.incident_date >= weekAgo).length || 0;
      const weekParent = parentLogs.data?.filter(log => log.log_date >= weekAgo).length || 0;
      const weekEducator = educatorLogs.data?.filter(log => log.log_date >= weekAgo).length || 0;
      const weekSleep = sleepRecords.data?.filter(log => log.sleep_date >= weekAgo).length || 0;
      const weekLogs = weekIncidents + weekParent + weekEducator + weekSleep;

      // Find most common incident type
      let mostCommon = 'N/A';
      if (incidents.data && incidents.data.length > 0) {
        const typeCounts = incidents.data.reduce((acc, log) => {
          acc[log.incident_type] = (acc[log.incident_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        mostCommon = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
      }

      setStats({ totalLogs, todayLogs, weekLogs, mostCommon });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      icon: FileText,
      label: 'Total Logs',
      value: stats.totalLogs,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Calendar,
      label: 'Today',
      value: stats.todayLogs,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      icon: TrendingUp,
      label: 'This Week',
      value: stats.weekLogs,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      icon: AlertCircle,
      label: 'Most Common',
      value: stats.mostCommon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      isText: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4 sm:p-6">
              <div className="h-16 sm:h-20 animate-pulse bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {statCards.map((card) => (
        <Card key={card.label} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`p-2 sm:p-3 rounded-lg ${card.bgColor} flex-shrink-0`}>
                <card.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${card.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">{card.label}</p>
                <p className={`${card.isText ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'} font-bold truncate`} title={card.isText ? String(card.value) : undefined}>
                  {card.isText ? card.value : card.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
