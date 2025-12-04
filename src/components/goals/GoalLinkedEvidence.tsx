import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, User, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface GoalLinkedEvidenceProps {
  goalId: string;
  familyId: string;
  studentId: string;
}

export function GoalLinkedEvidence({ goalId, familyId, studentId }: GoalLinkedEvidenceProps) {
  const navigate = useNavigate();

  const { data: documents, isLoading: docsLoading } = useQuery({
    queryKey: ['goal-linked-documents', familyId, studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('family_id', familyId)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
  });

  const { data: educatorLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['goal-linked-educator-logs', familyId, studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('educator_logs')
        .select('*')
        .eq('family_id', familyId)
        .eq('student_id', studentId)
        .order('log_date', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
  });

  const { data: parentLogs, isLoading: parentLogsLoading } = useQuery({
    queryKey: ['goal-linked-parent-logs', familyId, studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('parent_logs')
        .select('*')
        .eq('family_id', familyId)
        .eq('student_id', studentId)
        .order('log_date', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
  });

  if (docsLoading || logsLoading || parentLogsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const hasEvidence = (documents && documents.length > 0) || 
                      (educatorLogs && educatorLogs.length > 0) ||
                      (parentLogs && parentLogs.length > 0);

  if (!hasEvidence) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Linked Evidence</CardTitle>
          <CardDescription>
            No documents or activity logs have been found yet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            As you upload documents and create activity logs, relevant entries will automatically appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Linked Documents */}
      {documents && documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Linked Documents
            </CardTitle>
            <CardDescription>
              Recent documents that may be relevant to this goal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{doc.file_name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {doc.category && <Badge variant="outline" className="text-xs">{doc.category}</Badge>}
                      {doc.document_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(doc.document_date), 'MMM dd, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/documents')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Linked Activity Logs */}
      {educatorLogs && educatorLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Related Educator Logs
            </CardTitle>
            <CardDescription>
              Recent activity logs from educators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {educatorLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{log.educator_name}</span>
                      <Badge variant="outline" className="text-xs">{log.log_type}</Badge>
                    </div>
                    <time className="text-xs text-muted-foreground">
                      {format(new Date(log.log_date), 'MMM dd, yyyy')}
                    </time>
                  </div>
                  {log.progress_notes && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {log.progress_notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Linked Parent Logs */}
      {parentLogs && parentLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Related Parent Observations
            </CardTitle>
            <CardDescription>
              Recent observations from parents/guardians
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {parentLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{log.reporter_name}</span>
                      <Badge variant="outline" className="text-xs">{log.activity_type}</Badge>
                    </div>
                    <time className="text-xs text-muted-foreground">
                      {format(new Date(log.log_date), 'MMM dd, yyyy')}
                    </time>
                  </div>
                  {log.observation && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {log.observation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
