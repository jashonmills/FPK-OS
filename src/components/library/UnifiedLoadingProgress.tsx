
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, X, Clock, Download, Loader2 } from 'lucide-react';
import { EPUBLoadingProgress, EPUBLoadError } from '@/hooks/useEnhancedEPUBLoader';
import { PDFLoadingProgress } from '@/utils/enhancedPdfUtils';

interface UnifiedLoadingProgressProps {
  title: string;
  progress?: EPUBLoadingProgress | PDFLoadingProgress | null;
  error?: EPUBLoadError | string | null;
  onRetry?: () => void;
  onCancel?: () => void;
  type: 'epub' | 'pdf';
}

const getStageIcon = (stage: string) => {
  switch (stage) {
    case 'validating':
    case 'connecting':
      return <Loader2 className="h-4 w-4 animate-spin" />;
    case 'downloading':
      return <Download className="h-4 w-4 animate-bounce" />;
    case 'processing':
    case 'parsing':
    case 'rendering':
      return <Loader2 className="h-4 w-4 animate-spin" />;
    default:
      return <Loader2 className="h-4 w-4 animate-spin" />;
  }
};

const getStageColor = (stage: string) => {
  switch (stage) {
    case 'validating':
    case 'connecting':
      return 'text-blue-600';
    case 'downloading':
      return 'text-green-600';
    case 'processing':
    case 'parsing':
    case 'rendering':
      return 'text-amber-600';
    case 'ready':
      return 'text-emerald-600';
    default:
      return 'text-gray-600';
  }
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatTime = (seconds: number) => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

const UnifiedLoadingProgress: React.FC<UnifiedLoadingProgressProps> = ({
  title,
  progress,
  error,
  onRetry,
  onCancel,
  type
}) => {
  if (error) {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const isRecoverable = typeof error === 'object' && 'recoverable' in error ? error.recoverable : true;
    const retryCount = typeof error === 'object' && 'retryCount' in error ? error.retryCount : 0;

    return (
      <div className="flex items-center justify-center min-h-[400px] p-6">
        <div className="text-center max-w-md space-y-6">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Unable to Load Book</h3>
            <p className="text-sm text-muted-foreground">{title}</p>
          </div>
          
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm text-destructive">{errorMessage}</p>
            {retryCount > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Retry attempt: {retryCount}/3
              </p>
            )}
          </div>
          
          <div className="flex gap-3 justify-center">
            {isRecoverable && onRetry && (
              <Button onClick={onRetry} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
            {onCancel && (
              <Button onClick={onCancel} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Troubleshooting:</strong></p>
            <ul className="text-left space-y-1 list-disc list-inside">
              <li>Check your internet connection</li>
              <li>The book server might be temporarily busy</li>
              <li>Large books may take longer to download</li>
              {type === 'pdf' && <li>Some PDFs may have access restrictions</li>}
              {type === 'epub' && <li>Try refreshing the page if issues persist</li>}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Preparing to load {title}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <div className="text-center max-w-md space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Loading Book</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{title}</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className={`${getStageColor(progress.stage)}`}>
              {getStageIcon(progress.stage)}
            </div>
            <span className="text-sm font-medium capitalize">
              {progress.stage === 'parsing' ? 'Processing' : progress.stage}
            </span>
          </div>
          
          <div className="space-y-2">
            <Progress value={progress.percentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{progress.percentage.toFixed(1)}%</span>
              {progress.estimatedTimeRemaining && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(progress.estimatedTimeRemaining)}
                </span>
              )}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">{progress.message}</p>
          
          {progress.bytesLoaded && progress.totalBytes && (
            <div className="text-xs text-muted-foreground">
              {formatBytes(progress.bytesLoaded)} / {formatBytes(progress.totalBytes)}
            </div>
          )}
        </div>
        
        {onCancel && (
          <Button onClick={onCancel} variant="outline" size="sm">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        )}
        
        <div className="text-xs text-muted-foreground">
          {type === 'epub' 
            ? 'Large books may take a few moments to download and process...'
            : 'Validating PDF and preparing for viewing...'
          }
        </div>
      </div>
    </div>
  );
};

export default UnifiedLoadingProgress;
