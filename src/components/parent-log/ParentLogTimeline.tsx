import { useEffect, useState } from 'react';
import { useFamily } from '@/contexts/FamilyContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Calendar, Clock, MapPin, User, Heart, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ParentLog {
  id: string;
  log_date: string;
  log_time: string;
  reporter_name: string;
  location: string;
  activity_type: string;
  observation: string;
  mood?: string;
  successes?: string;
  challenges?: string;
  strategies_used?: string;
  weather_condition?: string;
  weather_temp_f?: number;
  attachments?: any;
}

interface ParentLogTimelineProps {
  refreshKey?: number;
}

export const ParentLogTimeline = ({ refreshKey }: ParentLogTimelineProps) => {
  const { selectedFamily, selectedStudent, currentUserRole } = useFamily();
  const [logs, setLogs] = useState<ParentLog[]>([]);
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
        .from('parent_logs')
        .select('*')
        .eq('family_id', selectedFamily.id)
        .eq('student_id', selectedStudent.id)
        .order('log_date', { ascending: false })
        .order('log_time', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching parent logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (logId: string) => {
    try {
      const { error } = await supabase
        .from('parent_logs')
        .delete()
        .eq('id', logId);
      
      if (error) throw error;
      
      toast.success("Parent log deleted successfully");
      fetchLogs();
    } catch (error: any) {
      console.error('Error deleting parent log:', error);
      toast.error(error.message || "Failed to delete parent log");
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No parent observations yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Start tracking your child's activities and progress
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <Card key={log.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                <span className="text-lg">{log.activity_type}</span>
                {log.mood && (
                  <Badge variant="outline">{log.mood}</Badge>
                )}
              </CardTitle>
              {currentUserRole === 'owner' && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Parent Log</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this parent observation? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(log.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(log.log_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{log.log_time}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{log.location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{log.reporter_name}</span>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Observation</p>
              <p className="text-sm text-muted-foreground">{log.observation}</p>
            </div>

            {log.successes && (
              <div>
                <p className="text-sm font-medium mb-1 text-green-600">Successes</p>
                <p className="text-sm text-muted-foreground">{log.successes}</p>
              </div>
            )}

            {log.challenges && (
              <div>
                <p className="text-sm font-medium mb-1 text-orange-600">Challenges</p>
                <p className="text-sm text-muted-foreground">{log.challenges}</p>
              </div>
            )}

            {log.strategies_used && (
              <div>
                <p className="text-sm font-medium mb-1">Strategies Used</p>
                <p className="text-sm text-muted-foreground">{log.strategies_used}</p>
              </div>
            )}

            {log.weather_condition && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                <span>Weather: {log.weather_condition}</span>
                {log.weather_temp_f && <span>• {log.weather_temp_f}°F</span>}
              </div>
            )}

            {log.attachments && Array.isArray(log.attachments) && log.attachments.length > 0 && (
              <div className="pt-2 border-t">
                <p className="text-sm font-medium mb-2">Attachments</p>
                <div className="flex gap-2 flex-wrap">
                  {log.attachments.map((attachment: any, index: number) => (
                    <a
                      key={index}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative group"
                    >
                      <img
                        src={attachment.url}
                        alt={`Attachment ${index + 1}`}
                        className="h-20 w-20 object-cover rounded border hover:opacity-75 transition-opacity"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};