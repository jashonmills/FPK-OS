import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, Search, Database, Brain, Clock } from 'lucide-react';

export interface IngestionStatus {
  stage: 'idle' | 'searching' | 'found' | 'ingesting' | 'analyzing' | 'complete' | 'error';
  message: string;
  progress: number;
  itemsFound?: number;
  itemsProcessed?: number;
  estimatedTimeLeft?: number;
}

export type IngestionStage = IngestionStatus['stage'];

interface IngestionStatusTrackerProps {
  status: IngestionStatus;
  tierName: string;
}

export function IngestionStatusTracker({ status, tierName }: IngestionStatusTrackerProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  const activeStages: IngestionStage[] = ['searching', 'found', 'ingesting', 'analyzing'];
  const isActive = activeStages.includes(status.stage);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setElapsedTime(0);
    }
  }, [status.stage, isActive]);

  if (status.stage === 'idle') return null;

  const getStatusIcon = () => {
    switch (status.stage) {
      case 'searching':
        return <Search className="h-4 w-4 animate-pulse" />;
      case 'found':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'ingesting':
        return <Database className="h-4 w-4 animate-pulse" />;
      case 'analyzing':
        return <Brain className="h-4 w-4 animate-pulse" />;
      case 'complete':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <span className="text-red-500">✕</span>;
      default:
        return <Loader2 className="h-4 w-4 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (status.stage) {
      case 'complete':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-primary';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-300/20">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="font-medium text-sm">{tierName}</span>
            <Badge variant={status.stage === 'complete' ? 'default' : 'secondary'} className="text-xs">
              {status.stage.charAt(0).toUpperCase() + status.stage.slice(1)}
            </Badge>
          </div>
          {isActive && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatTime(elapsedTime)}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{status.message}</p>
          
          {status.itemsFound !== undefined && (
            <p className="text-xs text-muted-foreground">
              Found: <span className="font-medium">{status.itemsFound}</span> items
            </p>
          )}

          {status.itemsProcessed !== undefined && status.itemsFound !== undefined && (
            <p className="text-xs text-muted-foreground">
              Processed: <span className="font-medium">{status.itemsProcessed}/{status.itemsFound}</span>
            </p>
          )}

          {status.estimatedTimeLeft !== undefined && status.estimatedTimeLeft > 0 && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Estimated time remaining: {Math.ceil(status.estimatedTimeLeft / 60)} minute(s)
            </p>
          )}

          <Progress 
            value={status.progress} 
            className="h-2"
          />
        </div>
      </CardContent>
    </Card>
  );
}
