import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, TrendingUp, FileText, Users } from 'lucide-react';
import { ActiveSessionsList } from './ActiveSessionsList';
import { RecentTimeEntriesFeed } from './RecentTimeEntriesFeed';
import { TimeTrackingFilters } from './TimeTrackingFilters';

interface ActiveSession {
  id: string;
  user_id: string;
  project_id: string;
  task_id: string | null;
  start_time: string;
  last_heartbeat: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
  };
  projects: {
    name: string;
    color: string;
  };
}

interface TimeEntry {
  id: string;
  user_id: string;
  project_id: string;
  task_id: string | null;
  hours_logged: number;
  entry_date: string;
  created_at: string;
  profiles: {
    full_name: string;
  };
  projects: {
    name: string;
  };
  tasks: {
    title: string;
  } | null;
}

interface KPIData {
  activeUsers: number;
  hoursToday: number;
  pendingTimesheets: number;
  avgHoursPerUser: number;
}

export const AdminTimeTrackingDashboard = () => {
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [recentEntries, setRecentEntries] = useState<TimeEntry[]>([]);
  const [kpis, setKPIs] = useState<KPIData>({
    activeUsers: 0,
    hoursToday: 0,
    pendingTimesheets: 0,
    avgHoursPerUser: 0,
  });
  const [dateRange, setDateRange] = useState({ start: new Date(), end: new Date() });

  // Fetch active sessions
  const fetchActiveSessions = async () => {
    const { data, error } = await supabase
      .from('active_time_sessions')
      .select(`
        *,
        profiles:user_id (full_name, avatar_url),
        projects:project_id (name, color)
      `)
      .order('start_time', { ascending: false });

    if (error) {
      console.error('Error fetching active sessions:', error);
      return;
    }

    if (data) {
      console.log('Fetched active sessions:', data);
      setActiveSessions(data as any);
      setKPIs(prev => ({ ...prev, activeUsers: data.length }));
    }
  };

  // Fetch recent time entries
  const fetchRecentEntries = async () => {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const { data, error } = await supabase
      .from('time_entries')
      .select(`
        *,
        profiles:user_id (full_name),
        projects:project_id (name),
        tasks:task_id (title)
      `)
      .gte('created_at', twentyFourHoursAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching recent entries:', error);
      return;
    }

    if (data) {
      console.log('Fetched recent entries:', data);
      setRecentEntries(data as any);
    }
  };

  // Fetch KPIs
  const fetchKPIs = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Hours today
    const { data: todayData, error: todayError } = await supabase
      .from('time_entries')
      .select('hours_logged')
      .eq('entry_date', today);

    if (todayError) {
      console.error('Error fetching today hours:', todayError);
    }

    const hoursToday = todayData?.reduce((sum, entry) => sum + entry.hours_logged, 0) || 0;

    // Pending timesheets
    const { data: pendingData, error: pendingError } = await supabase
      .from('time_entries')
      .select('id')
      .in('status', ['open', 'submitted']);

    if (pendingError) {
      console.error('Error fetching pending timesheets:', pendingError);
    }

    // Average hours per user this week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    
    const { data: weekData, error: weekError } = await supabase
      .from('time_entries')
      .select('user_id, hours_logged')
      .gte('entry_date', weekStart.toISOString().split('T')[0]);

    if (weekError) {
      console.error('Error fetching week data:', weekError);
    }

    const userHours = new Map<string, number>();
    weekData?.forEach(entry => {
      userHours.set(entry.user_id, (userHours.get(entry.user_id) || 0) + entry.hours_logged);
    });

    const avgHoursPerUser = userHours.size > 0 
      ? Array.from(userHours.values()).reduce((sum, hours) => sum + hours, 0) / userHours.size
      : 0;

    setKPIs(prev => ({
      ...prev,
      hoursToday: Math.round(hoursToday * 10) / 10,
      pendingTimesheets: pendingData?.length || 0,
      avgHoursPerUser: Math.round(avgHoursPerUser * 10) / 10,
    }));
  };

  // Set up realtime subscriptions
  useEffect(() => {
    fetchActiveSessions();
    fetchRecentEntries();
    fetchKPIs();

    // Subscribe to active sessions changes
    const sessionsChannel = supabase
      .channel('admin-time-tracking-sessions')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'active_time_sessions'
      }, () => {
        fetchActiveSessions();
      })
      .subscribe();

    // Subscribe to time entries changes
    const entriesChannel = supabase
      .channel('admin-time-tracking-entries')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'time_entries'
      }, () => {
        fetchRecentEntries();
        fetchKPIs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(sessionsChannel);
      supabase.removeChannel(entriesChannel);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Now</p>
              <p className="text-3xl font-bold mt-2">{kpis.activeUsers}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Hours Today</p>
              <p className="text-3xl font-bold mt-2">{kpis.hoursToday}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Timesheets</p>
              <p className="text-3xl font-bold mt-2">{kpis.pendingTimesheets}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Hrs/User (Week)</p>
              <p className="text-3xl font-bold mt-2">{kpis.avgHoursPerUser}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <TimeTrackingFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {/* Main Content */}
      <Tabs defaultValue="live" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="live">Live Sessions</TabsTrigger>
          <TabsTrigger value="recent">Recent Entries</TabsTrigger>
        </TabsList>

        <TabsContent value="live">
          <ActiveSessionsList sessions={activeSessions} />
        </TabsContent>

        <TabsContent value="recent">
          <RecentTimeEntriesFeed entries={recentEntries} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
