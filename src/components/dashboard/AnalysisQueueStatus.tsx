import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useFamily } from '@/contexts/FamilyContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle2, AlertCircle, Clock, FileText, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { JobStatus, QueueStats, AnalysisJobMetadata } from '@/types/analysis';

export const AnalysisQueueStatus = () => {
  const { selectedFamily, selectedStudent } = useFamily();
  const navigate = useNavigate();
  const [liveStats, setLiveStats] = useState<any>(null);
  const [isRecovering, setIsRecovering] = useState(false);

  // Fetch current analysis jobs
  const { data: activeJobs, refetch: refetchJobs } = useQuery({
    queryKey: ['active-analysis-jobs', selectedFamily?.id],
    queryFn: async () => {
      if (!selectedFamily?.id) return null;
      
      const { data, error } = await supabase
        .from('analysis_jobs')
        .select('*')
        .eq('family_id', selectedFamily.id)
        .in('status', ['pending', 'processing'])
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      return data?.[0] || null;
    },
    enabled: !!selectedFamily?.id,
    refetchInterval: 5000 // Poll every 5 seconds
  });

  // Fetch queue stats
  const { data: queueStats, refetch: refetchStats } = useQuery({
    queryKey: ['queue-stats', selectedFamily?.id],
    queryFn: async () => {
      if (!selectedFamily?.id) return null;
      
      const { data, error } = await supabase.rpc('get_queue_stats', {
        p_family_id: selectedFamily.id
      });

      if (error) throw error;
      return data?.[0];
    },
    enabled: !!selectedFamily?.id,
    refetchInterval: 3000 // Poll every 3 seconds
  });

  // Real-time subscription to queue changes
  useEffect(() => {
    if (!selectedFamily?.id) return;

    const channel = supabase
      .channel('queue-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'analysis_queue',
          filter: `family_id=eq.${selectedFamily.id}`
        },
        (payload) => {
          console.log('Queue update:', payload);
          // Trigger refetch of stats
          setLiveStats((prev: any) => ({ ...prev, timestamp: Date.now() }));
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'analysis_jobs',
          filter: `family_id=eq.${selectedFamily.id}`
        },
        (payload) => {
          console.log('Job update:', payload);
          setLiveStats((prev: any) => ({ ...prev, timestamp: Date.now() }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedFamily?.id]);

  if (!selectedFamily || !selectedStudent) return null;

  // Don't show if no active processing
  if (!activeJobs && (!queueStats || queueStats.processing_items === 0)) return null;

  const progress = activeJobs 
    ? Math.round((activeJobs.processed_documents / activeJobs.total_documents) * 100)
    : 0;

  // CRITICAL FIX #4: Type-safe metadata access
  const metadata = activeJobs?.metadata as AnalysisJobMetadata | undefined;
  const estimatedMinutesRemaining = metadata?.estimatedMinutes && activeJobs?.started_at
    ? Math.max(0, metadata.estimatedMinutes - Math.floor((Date.now() - new Date(activeJobs.started_at).getTime()) / 60000))
    : null;

  // Detect stuck job (processing >5 min with no progress)
  const isStuck = activeJobs?.status === 'processing' && 
    activeJobs.started_at && 
    (Date.now() - new Date(activeJobs.started_at).getTime() > 5 * 60 * 1000) &&
    activeJobs.processed_documents === 0;

  const handleRecovery = async () => {
    if (!selectedFamily || !activeJobs) return;
    
    setIsRecovering(true);
    try {
      const { error } = await supabase.functions.invoke('recover-stuck-queue-items', {
        body: { 
          family_id: selectedFamily.id,
          job_id: activeJobs.id 
        }
      });

      if (error) throw error;

      toast.success('Recovery successful! Restarting analysis...');
      
      // Trigger re-analysis
      const { error: reanalyzeError } = await supabase.functions.invoke('re-analyze-all-documents', {
        body: { 
          family_id: selectedFamily.id,
          student_id: selectedStudent?.id 
        }
      });

      if (reanalyzeError) throw reanalyzeError;

      // Refetch data
      await Promise.all([refetchJobs(), refetchStats()]);
      
    } catch (error) {
      console.error('Recovery error:', error);
      toast.error('Recovery failed. Please try again.');
    } finally {
      setIsRecovering(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            AI Analysis in Progress
          </CardTitle>
          {activeJobs && (
            <Badge variant="secondary" className="text-xs">
              {activeJobs.job_type === 're-analysis' ? 'Re-Analysis' : 'Processing'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isStuck && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
            <div className="flex-1 text-sm">
              <p className="font-medium text-destructive">Analysis appears stuck</p>
              <p className="text-muted-foreground text-xs mt-1">
                No progress detected. Click to recover and retry.
              </p>
            </div>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleRecovery}
              disabled={isRecovering}
            >
              {isRecovering ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Recovering...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-3 w-3" />
                  Recover
                </>
              )}
            </Button>
          </div>
        )}

        {activeJobs && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {activeJobs.processed_documents} / {activeJobs.total_documents} documents
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            {estimatedMinutesRemaining !== null && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Estimated time remaining: {estimatedMinutesRemaining}m
              </div>
            )}
          </div>
        )}

        {queueStats && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Loader2 className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Processing</div>
                <div className="font-medium">{queueStats.processing_items || 0}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Pending</div>
                <div className="font-medium">{queueStats.pending_items || 0}</div>
              </div>
            </div>

            {(queueStats.completed_items > 0 || queueStats.failed_items > 0) && (
              <>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                    <div className="font-medium">{queueStats.completed_items || 0}</div>
                  </div>
                </div>

                {queueStats.failed_items > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-red-500/10">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Failed</div>
                      <div className="font-medium">{queueStats.failed_items}</div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => navigate('/documents')}
        >
          <FileText className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};
