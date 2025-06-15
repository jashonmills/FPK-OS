
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, RefreshCw, X, Loader2 } from 'lucide-react';
import { EPUBLoadingProgress, EPUBLoadError } from '@/hooks/useOptimizedEPUBLoader';

interface UnifiedLoadingProgressProps {
  title: string;
  progress?: EPUBLoadingProgress | null;
  error?: EPUBLoadError | null;
  onRetry?: () => void;
  onCancel?: () => void;
  type?: 'epub' | 'pdf' | 'general';
}

const UnifiedLoadingProgress: React.FC<UnifiedLoadingProgressProps> = ({
  title,
  progress,
  error,
  onRetry,
  onCancel,
  type = 'general'
}) => {
  const getIcon = () => {
    if (error) return <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-6" />;
    return <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-6" />;
  };

  const getProgressColor = () => {
    if (progress?.stage === 'downloading') return 'bg-blue-500';
    if (progress?.stage === 'processing') return 'bg-yellow-500';
    if (progress?.stage === 'ready') return 'bg-green-500';
    return 'bg-primary';
  };

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-background">
        <div className="text-center max-w-lg p-6">
          {getIcon()}
          <h3 className="text-xl font-semibold mb-4">Unable to Load</h3>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <p className="text-destructive text-sm font-medium mb-2">
              {error.type === 'timeout' ? 'Loading Timeout' : 
               error.type === 'network' ? 'Network Error' : 
               error.type === 'parsing' ? 'File Error' : 'Unknown Error'}
            </p>
            <p className="text-destructive text-sm">{error.message}</p>
          </div>
          
          <div className="mb-6 space-y-2">
            <p className="text-sm font-medium">Quick Solutions:</p>
            <ul className="text-xs text-muted-foreground space-y-1 text-left">
              <li>• Check your internet connection</li>
              <li>• Try a different book if this persists</li>
              <li>• Some books may have large file sizes</li>
              {error.recoverable && <li>• This error can usually be resolved by retrying</li>}
            </ul>
          </div>
          
          <div className="flex gap-3 justify-center">
            {error.recoverable && onRetry && (
              <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again ({error.retryCount + 1}/3)
              </Button>
            )}
            {onCancel && (
              <Button onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Close
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background">
      <div className="text-center max-w-md p-6">
        {getIcon()}
        <h3 className="text-lg font-semibold mb-2">
          Loading "{title}"
        </h3>
        
        {progress && (
          <>
            <p className="text-sm text-muted-foreground mb-4 capitalize">
              {progress.stage.replace('_', ' ')}: {progress.message}
            </p>
            
            <div className="mb-4">
              <Progress 
                value={progress.percentage} 
                className="w-full h-3"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{progress.percentage}% complete</span>
                {progress.estimatedTimeRemaining && (
                  <span>~{progress.estimatedTimeRemaining}s remaining</span>
                )}
              </div>
            </div>

            {progress.bytesLoaded && progress.totalBytes && (
              <p className="text-xs text-muted-foreground mb-4">
                {(progress.bytesLoaded / 1024 / 1024).toFixed(1)} MB / {(progress.totalBytes / 1024 / 1024).toFixed(1)} MB
              </p>
            )}
          </>
        )}
        
        <p className="text-xs text-muted-foreground">
          {type === 'epub' ? 'Preparing your reading experience...' : 'Please wait...'}
        </p>
        
        {onCancel && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCancel}
            className="mt-4"
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default UnifiedLoadingProgress;
