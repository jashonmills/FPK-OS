import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Upload, RefreshCw, Trash2, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface ProcessingHistoryTimelineProps {
  familyId: string;
  studentId: string;
}

export function ProcessingHistoryTimeline({ familyId, studentId }: ProcessingHistoryTimelineProps) {
  const { data: history, isLoading } = useQuery({
    queryKey: ['document-processing-history', familyId, studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_processing_history')
        .select(`
          *,
          document:bedrock_documents(file_name),
          user:profiles(display_name, full_name)
        `)
        .eq('family_id', familyId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
    enabled: !!familyId && !!studentId,
  });

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'upload':
        return <Upload className="h-4 w-4" />;
      case 're-classify':
      case 're-analyze':
        return <RefreshCw className="h-4 w-4" />;
      case 'delete':
        return <Trash2 className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'pending':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActionLabel = (event: any) => {
    if (event.action_type === 're-classify' && event.old_category && event.new_category) {
      return `Re-classified from "${event.old_category}" to "${event.new_category}"`;
    }
    return event.action_type === 're-analyze' ? 'Re-analyzed document' : 
           event.action_type === 'upload' ? 'Uploaded document' : 
           event.action_type === 'delete' ? 'Deleted document' : 
           event.action_type;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Processing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Processing History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {history && history.length > 0 ? (
            <div className="space-y-4">
              {history.map((event: any, index: number) => (
                <div key={event.id} className="flex gap-4">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-muted p-2">
                      {getActionIcon(event.action_type)}
                    </div>
                    {index < history.length - 1 && (
                      <div className="w-px flex-1 bg-border my-2" />
                    )}
                  </div>

                  {/* Event details */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">
                            {getActionLabel(event)}
                          </p>
                          {getStatusIcon(event.status)}
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {event.document?.file_name || 'Unknown document'}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {event.user?.display_name || event.user?.full_name || 'Unknown user'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                          </span>
                          {event.new_category && (
                            <Badge variant="secondary" className="text-xs">
                              {event.new_category}
                            </Badge>
                          )}
                        </div>

                        {event.error_message && (
                          <p className="text-xs text-destructive mt-2">
                            Error: {event.error_message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              No processing history yet. Upload or re-classify documents to see activity.
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
