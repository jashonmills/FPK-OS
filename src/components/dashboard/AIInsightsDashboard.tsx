import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, AlertTriangle, Info, X, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

interface AIInsightsDashboardProps {
  studentId: string;
  familyId: string;
  onViewDocument?: (documentId: string) => void;
}

interface StudentInsight {
  id: string;
  created_at: string;
  insight_text: string;
  insight_type: string;
  insight_level: 'HIGH' | 'MEDIUM' | 'LOW';
  insight_category: string;
  confidence_score: number | null;
  source_document_id: string;
  document_category: string;
  source_section: string | null;
  is_dismissed: boolean;
}

export function AIInsightsDashboard({ studentId, familyId, onViewDocument }: AIInsightsDashboardProps) {
  const queryClient = useQueryClient();
  const [dismissingId, setDismissingId] = useState<string | null>(null);

  // Fetch insights
  const { data: insights, isLoading } = useQuery({
    queryKey: ['student-insights', studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_insights')
        .select('*')
        .eq('student_id', studentId)
        .eq('is_dismissed', false)
        .eq('is_archived', false)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as StudentInsight[];
    },
    enabled: !!studentId
  });

  // Dismiss insight mutation
  const dismissMutation = useMutation({
    mutationFn: async (insightId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('student_insights')
        .update({ 
          is_dismissed: true,
          dismissed_by: user?.id,
          dismissed_at: new Date().toISOString()
        })
        .eq('id', insightId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-insights', studentId] });
      toast.success('Insight dismissed');
      setDismissingId(null);
    },
    onError: (error: any) => {
      toast.error('Failed to dismiss insight: ' + error.message);
      setDismissingId(null);
    }
  });

  // Helper functions
  const getLevelIcon = (level: string) => {
    switch(level) {
      case 'HIGH': return <AlertTriangle className="h-4 w-4" />;
      case 'MEDIUM': return <Info className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getLevelColor = (level: string): "default" | "destructive" | "secondary" => {
    switch(level) {
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'default';
      default: return 'secondary';
    }
  };

  const handleDismiss = (insightId: string) => {
    setDismissingId(insightId);
    dismissMutation.mutate(insightId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Key AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights || insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Key AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No high-priority insights yet. Upload and analyze documents to see key findings here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Key AI Insights
          <Badge variant="secondary" className="ml-auto">
            {insights.length} active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className={`mt-0.5 ${insight.insight_level === 'HIGH' ? 'text-destructive' : 'text-muted-foreground'}`}>
              {getLevelIcon(insight.insight_level)}
            </div>
            
            <div className="flex-1 space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm leading-relaxed">{insight.insight_text}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => handleDismiss(insight.id)}
                  disabled={dismissingId === insight.id}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={getLevelColor(insight.insight_level)} className="text-xs">
                  {insight.insight_level}
                </Badge>
                
                {insight.insight_category && (
                  <Badge variant="outline" className="text-xs">
                    {insight.insight_category}
                  </Badge>
                )}

                {insight.confidence_score && (
                  <span className="text-xs text-muted-foreground">
                    {Math.round(insight.confidence_score * 100)}% confidence
                  </span>
                )}

                {onViewDocument && (
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs ml-auto"
                    onClick={() => onViewDocument(insight.source_document_id)}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    View Source
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
