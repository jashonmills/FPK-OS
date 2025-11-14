import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle, Clock, ExternalLink, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WorkflowRun {
  status: 'success' | 'failure' | 'in_progress' | 'pending';
  conclusion: string | null;
  html_url: string;
  created_at: string;
  run_number: number;
}

export const CICDBadge = () => {
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowRun | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkflowStatus();
    const interval = setInterval(fetchWorkflowStatus, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchWorkflowStatus = async () => {
    try {
      // In production, this would fetch from GitHub Actions API
      // For now, we'll simulate the response
      const mockStatus: WorkflowRun = {
        status: 'success',
        conclusion: 'success',
        html_url: 'https://github.com/your-repo/actions',
        created_at: new Date().toISOString(),
        run_number: 42
      };

      setWorkflowStatus(mockStatus);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching workflow status:', error);
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (!workflowStatus) return null;

    switch (workflowStatus.status) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'failure':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'in_progress':
        return <PlayCircle className="w-4 h-4 text-primary animate-pulse" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    if (!workflowStatus) return null;

    switch (workflowStatus.status) {
      case 'success':
        return <Badge variant="default" className="gap-1">Passing</Badge>;
      case 'failure':
        return <Badge variant="destructive" className="gap-1">Failed</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="gap-1 border-primary text-primary">Running</Badge>;
      default:
        return <Badge variant="outline" className="gap-1">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="border-muted">
        <CardContent className="p-4">
          <div className="animate-pulse flex items-center gap-2">
            <div className="h-4 w-4 bg-muted rounded-full"></div>
            <div className="h-4 w-24 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-muted hover:border-primary/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">CI/CD Tests</span>
                {getStatusBadge()}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Run #{workflowStatus?.run_number} • {workflowStatus?.created_at ? 
                  new Date(workflowStatus.created_at).toLocaleTimeString() : 'N/A'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(workflowStatus?.html_url, '_blank')}
            className="gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
