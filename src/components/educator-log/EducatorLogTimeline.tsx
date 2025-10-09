import { useEffect, useState } from 'react';
import { useFamily } from '@/contexts/FamilyContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, GraduationCap } from 'lucide-react';

interface EducatorLog {
  id: string;
  log_date: string;
  log_time?: string;
  log_type: string;
  educator_name: string;
  educator_role?: string;
  session_duration_minutes?: number;
  progress_notes?: string;
  behavioral_observations?: string;
  challenges?: string;
  goals_for_next_session?: string;
  performance_level?: string;
  engagement_level?: string;
}

interface EducatorLogTimelineProps {
  refreshKey?: number;
}

export const EducatorLogTimeline = ({ refreshKey }: EducatorLogTimelineProps) => {
  const { selectedFamily, selectedStudent } = useFamily();
  const [logs, setLogs] = useState<EducatorLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedFamily?.id && selectedStudent?.id) {
      fetchLogs();
    }
  }, [selectedFamily?.id, selectedStudent?.id, refreshKey]);

  const fetchLogs = async () => {
    if (!selectedFamily?.id || !selectedStudent?.id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('educator_logs')
        .select('*')
        .eq('family_id', selectedFamily.id)
        .eq('student_id', selectedStudent.id)
        .order('log_date', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching educator logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLogTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      therapy: 'bg-blue-500',
      classroom: 'bg-green-500',
      observation: 'bg-purple-500',
      behavior: 'bg-orange-500',
    };
    return colors[type] || 'bg-gray-500';
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No educator logs yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Professional logs will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <Card key={log.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <span className="text-lg capitalize">{log.log_type} Session</span>
              </div>
              <Badge className={getLogTypeColor(log.log_type)}>
                {log.log_type}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(log.log_date).toLocaleDateString()}</span>
              </div>
              {log.session_duration_minutes && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{log.session_duration_minutes} minutes</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{log.educator_name}</span>
                {log.educator_role && <span className="text-xs">({log.educator_role})</span>}
              </div>
            </div>

            {(log.performance_level || log.engagement_level) && (
              <div className="flex gap-2">
                {log.performance_level && (
                  <Badge variant="outline">Performance: {log.performance_level}</Badge>
                )}
                {log.engagement_level && (
                  <Badge variant="outline">Engagement: {log.engagement_level}</Badge>
                )}
              </div>
            )}

            {log.progress_notes && (
              <div>
                <p className="text-sm font-medium mb-1">Progress Notes</p>
                <p className="text-sm text-muted-foreground">{log.progress_notes}</p>
              </div>
            )}

            {log.behavioral_observations && (
              <div>
                <p className="text-sm font-medium mb-1">Behavioral Observations</p>
                <p className="text-sm text-muted-foreground">{log.behavioral_observations}</p>
              </div>
            )}

            {log.challenges && (
              <div>
                <p className="text-sm font-medium mb-1 text-orange-600">Challenges</p>
                <p className="text-sm text-muted-foreground">{log.challenges}</p>
              </div>
            )}

            {log.goals_for_next_session && (
              <div className="pt-2 border-t">
                <p className="text-sm font-medium mb-1 text-primary">Goals for Next Session</p>
                <p className="text-sm text-muted-foreground">{log.goals_for_next_session}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
