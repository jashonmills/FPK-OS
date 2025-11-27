
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface ErrorHandlerProps {
  error: string;
  retryCount: number;
  onRetry: () => void;
}

const ErrorHandler: React.FC<ErrorHandlerProps> = ({ error, retryCount, onRetry }) => {
  return (
    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="h-5 w-5 text-destructive" />
        <h3 className="font-semibold text-destructive">Loading Error</h3>
      </div>
      <p className="text-sm text-destructive mb-3">{error}</p>
      {retryCount > 0 && (
        <p className="text-xs text-muted-foreground mb-3">
          Retry attempt: {retryCount}/3
        </p>
      )}
      <Button onClick={onRetry} variant="outline" size="sm" className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
};

export default ErrorHandler;
