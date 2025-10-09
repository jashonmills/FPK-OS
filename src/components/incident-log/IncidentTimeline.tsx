import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useFamily } from '@/contexts/FamilyContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, MapPin, User } from 'lucide-react';
import { format } from 'date-fns';

interface IncidentLog {
  id: string;
  incident_date: string;
  incident_time: string;
  incident_type: string;
  severity: string;
  location: string;
  reporter_name: string;
  behavior_description: string;
  weather_condition?: string;
  weather_temp_f?: number;
  attachments?: string[];
}

interface IncidentTimelineProps {
  refreshKey?: number;
}

export const IncidentTimeline = ({ refreshKey }: IncidentTimelineProps) => {
  const [logs, setLogs] = useState<IncidentLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedFamily, selectedStudent } = useFamily();

  useEffect(() => {
    fetchLogs();
  }, [refreshKey, selectedFamily?.id, selectedStudent?.id]);

  const fetchLogs = async () => {
    if (!selectedFamily || !selectedStudent) return;

    try {
      const { data, error } = await supabase
        .from('incident_logs')
        .select('*')
        .eq('family_id', selectedFamily.id)
        .eq('student_id', selectedStudent.id)
        .order('incident_date', { ascending: false })
        .order('incident_time', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs((data || []) as IncidentLog[]);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading...</div>;
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No incident logs yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <Card key={log.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <h3 className="font-semibold">{log.incident_type}</h3>
              </div>
              <Badge variant={getSeverityColor(log.severity)}>{log.severity}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {format(new Date(log.incident_date), 'MMM d, yyyy')} at {log.incident_time}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {log.location}
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {log.reporter_name}
              </div>
            </div>

            <p className="text-sm">{log.behavior_description}</p>

            {log.weather_condition && (
              <div className="text-xs text-muted-foreground bg-accent/30 px-3 py-1.5 rounded-md">
                Weather: {log.weather_temp_f}°F, {log.weather_condition}
              </div>
            )}

            {log.attachments && log.attachments.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {log.attachments.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Attachment ${idx + 1}`}
                    className="w-20 h-20 object-cover rounded border cursor-pointer hover:opacity-80"
                    onClick={() => window.open(url, '_blank')}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
