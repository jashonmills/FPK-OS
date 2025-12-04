import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useFamily } from '@/contexts/FamilyContext';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle2, XCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const AnalysisQueueStatus = () => {
  const { selectedFamily, selectedStudent } = useFamily();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch all bedrock documents for this family
  const { data: documents, isLoading } = useQuery({
    queryKey: ['bedrock-documents-status', selectedFamily?.id],
    queryFn: async () => {
      if (!selectedFamily?.id) return [];
      
      const { data, error } = await supabase
        .from('bedrock_documents')
        .select('id, file_name, status, created_at, analyzed_at')
        .eq('family_id', selectedFamily.id)
        .order('created_at', { ascending: false});

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedFamily?.id,
    refetchInterval: 3000, // Poll every 3 seconds for updates
  });

  // Real-time subscription to bedrock document changes
  useEffect(() => {
    if (!selectedFamily?.id) return;

    const channel = supabase
      .channel('bedrock-documents-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bedrock_documents',
          filter: `family_id=eq.${selectedFamily.id}`
        },
        (payload) => {
          console.log('Bedrock document update:', payload);
          // Refetch documents when changes occur
          queryClient.invalidateQueries({ queryKey: ['bedrock-documents-status', selectedFamily.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedFamily?.id, queryClient]);

  if (!selectedFamily || !selectedStudent) return null;
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">AI Analysis Status</h3>
        </div>
        <p className="text-sm text-muted-foreground">Loading status...</p>
      </Card>
    );
  }

  if (!documents || documents.length === 0) return null;

  // Calculate statistics
  const stats = {
    total: documents.length,
    uploaded: documents.filter(d => d.status === 'uploaded').length,
    analyzing: documents.filter(d => d.status === 'analyzing').length,
    completed: documents.filter(d => d.status === 'completed').length,
    failed: documents.filter(d => d.status === 'failed').length,
  };

  // Only show if there are documents being analyzed or waiting
  if (stats.analyzing === 0 && stats.uploaded === 0) {
    return null;
  }

  const progressPercentage = stats.total > 0 
    ? ((stats.completed + stats.failed) / stats.total) * 100 
    : 0;

  // Estimate time remaining (rough estimate: 2 minutes per analyzing document)
  const estimatedMinutes = stats.analyzing * 2;

  return (
    <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 text-primary animate-spin" />
          <h3 className="text-lg font-semibold">AI Analysis Status</h3>
        </div>
      </div>

      {stats.analyzing > 0 && (
        <>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">
                {stats.completed + stats.failed} / {stats.total} documents
              </span>
              <span className="text-primary font-medium">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {estimatedMinutes > 0 && (
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Estimated time remaining: {estimatedMinutes}m</span>
            </div>
          )}
        </>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10">
          <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
          <div>
            <div className="text-xs text-muted-foreground">Analyzing</div>
            <div className="text-lg font-semibold">{stats.analyzing}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10">
          <FileText className="h-4 w-4 text-amber-500" />
          <div>
            <div className="text-xs text-muted-foreground">Uploaded</div>
            <div className="text-lg font-semibold">{stats.uploaded}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <div>
            <div className="text-xs text-muted-foreground">Completed</div>
            <div className="text-lg font-semibold">{stats.completed}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10">
          <XCircle className="h-4 w-4 text-red-500" />
          <div>
            <div className="text-xs text-muted-foreground">Failed</div>
            <div className="text-lg font-semibold">{stats.failed}</div>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/documents')}
        className="w-full"
      >
        View Details
      </Button>
    </Card>
  );
};
