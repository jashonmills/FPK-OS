
import React from 'react';
import { AlertTriangle, RefreshCw, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface PDFLoadingState {
  stage: 'initializing' | 'validating' | 'loading' | 'rendering' | 'ready' | 'error';
  message: string;
  progress: number;
  error?: string;
  retryCount: number;
}

interface PDFLoadingProgressProps {
  fileName: string;
  loadingState: PDFLoadingState;
  onRetry: () => void;
  onDownload: () => void;
  onOpenDirect: () => void;
  onClose: () => void;
}

const PDFLoadingProgress: React.FC<PDFLoadingProgressProps> = ({
  fileName,
  loadingState,
  onRetry,
  onDownload,
  onOpenDirect,
  onClose
}) => {
  if (loadingState.stage === 'error') {
    return (
      <div className="space-y-4 p-4">
        <div className="text-center">
          <h3 className="font-semibold text-lg mb-2">{fileName}</h3>
          <div className="space-y-4">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
            <div className="space-y-2">
              <p className="text-destructive font-medium">{loadingState.message}</p>
              {loadingState.error && (
                <p className="text-sm text-muted-foreground">{loadingState.error}</p>
              )}
              <Badge variant="outline" className="text-xs">
                Tried {loadingState.retryCount + 1} access method(s)
              </Badge>
            </div>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm" onClick={onRetry}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <Button variant="outline" size="sm" onClick={onDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={onOpenDirect}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Direct
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="text-center">
        <h3 className="font-semibold text-lg mb-2">{fileName}</h3>
        <div className="space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <div className="space-y-2">
            <p className="text-sm">{loadingState.message}</p>
            <Progress value={loadingState.progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {loadingState.progress.toFixed(0)}% complete
            </p>
            {loadingState.retryCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                Using method {loadingState.retryCount + 1}
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default PDFLoadingProgress;
