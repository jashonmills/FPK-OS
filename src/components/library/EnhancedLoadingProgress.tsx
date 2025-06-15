
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, RefreshCw, X, Loader2, BookOpen, Download, FileText, Check, Wifi, Clock } from 'lucide-react';
import { EPUBStreamingProgress, EPUBStreamingError } from '@/services/epub/EPUBStreamingTypes';

interface EnhancedLoadingProgressProps {
  title: string;
  progress?: EPUBStreamingProgress | null;
  error?: EPUBStreamingError | string | null;
  onRetry?: () => void;
  onCancel?: () => void;
  type?: 'epub' | 'pdf' | 'general';
}

const EnhancedLoadingProgress: React.FC<EnhancedLoadingProgressProps> = ({
  title,
  progress,
  error,
  onRetry,
  onCancel,
  type = 'epub'
}) => {
  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'metadata':
        return <FileText className="h-5 w-5" />;
      case 'structure':
        return <BookOpen className="h-5 w-5" />;
      case 'preloading':
        return <Download className="h-5 w-5" />;
      case 'streaming':
        return <Loader2 className="h-5 w-5 animate-spin" />;
      case 'ready':
        return <Check className="h-5 w-5" />;
      default:
        return <Loader2 className="h-5 w-5 animate-spin" />;
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'metadata':
        return 'text-blue-500';
      case 'structure':
        return 'text-purple-500';
      case 'preloading':
        return 'text-orange-500';
      case 'streaming':
        return 'text-yellow-500';
      case 'ready':
        return 'text-green-500';
      default:
        return 'text-primary';
    }
  };

  const getProgressBarColor = (stage: string) => {
    switch (stage) {
      case 'metadata':
        return 'bg-blue-500';
      case 'structure':
        return 'bg-purple-500';
      case 'preloading':
        return 'bg-orange-500';
      case 'streaming':
        return 'bg-yellow-500';
      case 'ready':
        return 'bg-green-500';
      default:
        return 'bg-primary';
    }
  };

  // Handle error display with improved messaging
  if (error) {
    const normalizedError = typeof error === 'string' ? {
      type: 'unknown' as const,
      message: error,
      recoverable: true,
      retryCount: 0
    } : error;

    const getErrorIcon = () => {
      switch (normalizedError.type) {
        case 'timeout':
          return <Clock className="h-20 w-20 text-orange-500 mx-auto relative z-10" />;
        case 'network':
          return <Wifi className="h-20 w-20 text-red-500 mx-auto relative z-10" />;
        default:
          return <AlertCircle className="h-20 w-20 text-destructive mx-auto relative z-10" />;
      }
    };

    const getErrorTitle = () => {
      switch (normalizedError.type) {
        case 'timeout':
          return 'Book is Taking Longer Than Expected';
        case 'network':
          return 'Connection Issue';
        default:
          return 'Unable to Load Book';
      }
    };

    const getErrorDescription = () => {
      switch (normalizedError.type) {
        case 'timeout':
          return 'Large books sometimes take extra time to download';
        case 'network':
          return 'Having trouble connecting to the book server';
        default:
          return 'Something went wrong while loading this book';
      }
    };

    const getQuickSolutions = () => {
      const solutions = ['Check your internet connection'];
      
      if (normalizedError.type === 'timeout') {
        solutions.push('This book may be large - trying alternative servers');
        solutions.push('We automatically use faster download methods on retry');
      } else if (normalizedError.type === 'network') {
        solutions.push('The book server might be temporarily busy');
        solutions.push('We\'ll try different servers when you retry');
      } else {
        solutions.push('This book may have a large file size');
        solutions.push('The book server might be temporarily busy');
      }
      
      if (normalizedError.recoverable) {
        solutions.push('This usually resolves itself when you try again');
      }
      
      return solutions;
    };

    return (
      <div className="absolute inset-0 flex items-center justify-center bg-background">
        <div className="text-center max-w-lg p-8 space-y-6">
          <div className="relative">
            <div className={`absolute inset-0 ${normalizedError.type === 'timeout' ? 'bg-orange-500/10' : normalizedError.type === 'network' ? 'bg-red-500/10' : 'bg-destructive/10'} rounded-full animate-pulse`}></div>
            {getErrorIcon()}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{getErrorTitle()}</h3>
            <p className="text-sm text-muted-foreground">{getErrorDescription()}</p>
          </div>
          
          <div className={`${normalizedError.type === 'timeout' ? 'bg-orange-500/5 border-orange-500/20' : normalizedError.type === 'network' ? 'bg-red-500/5 border-red-500/20' : 'bg-destructive/5 border-destructive/20'} border rounded-lg p-4`}>
            <p className={`${normalizedError.type === 'timeout' ? 'text-orange-700' : normalizedError.type === 'network' ? 'text-red-700' : 'text-destructive'} text-sm`}>
              {normalizedError.message}
            </p>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <p className="text-sm font-medium text-muted-foreground">What we're doing to help:</p>
            <ul className="text-xs text-muted-foreground space-y-1 text-left">
              {getQuickSolutions().map((solution, index) => (
                <li key={index}>• {solution}</li>
              ))}
            </ul>
          </div>
          
          <div className="flex gap-3 justify-center pt-4">
            {normalizedError.recoverable && onRetry && (
              <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                {normalizedError.type === 'timeout' ? 'Try Faster Servers' : 'Try Again'} 
                {normalizedError.retryCount > 0 && ` (${normalizedError.retryCount + 1}/4)`}
              </Button>
            )}
            {onCancel && (
              <Button onClick={onCancel} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Close
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Loading state with enhanced progress
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background">
      <div className="text-center max-w-md p-8 space-y-6">
        {/* Animated loading icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
          <div className={`relative z-10 ${progress ? getStageColor(progress.stage) : 'text-primary'}`}>
            {progress ? getStageIcon(progress.stage) : <Loader2 className="h-12 w-12 animate-spin" />}
            <div className="mt-2">
              {progress ? getStageIcon(progress.stage) : <BookOpen className="h-12 w-12 mx-auto" />}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Loading "{title}"</h3>
          {progress && (
            <p className="text-sm text-muted-foreground capitalize">
              {progress.stage.replace('_', ' ')}: {progress.message}
            </p>
          )}
        </div>
        
        {progress && (
          <div className="space-y-3">
            {/* Main progress bar */}
            <div className="space-y-2">
              <Progress 
                value={progress.percentage} 
                className="w-full h-3"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{progress.percentage}% complete</span>
                {progress.estimatedTimeRemaining && progress.estimatedTimeRemaining > 0 && (
                  <span>~{Math.max(1, progress.estimatedTimeRemaining)}s remaining</span>
                )}
              </div>
            </div>

            {/* Stage indicators */}
            <div className="flex justify-center space-x-4 pt-2">
              {['metadata', 'structure', 'streaming', 'ready'].map((stage, index) => {
                const isActive = progress.stage === stage;
                const isCompleted = ['metadata', 'structure', 'streaming', 'ready'].indexOf(progress.stage) > index;
                
                return (
                  <div 
                    key={stage} 
                    className={`flex flex-col items-center space-y-1 transition-all duration-300 ${
                      isActive ? 'scale-110' : ''
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      isCompleted ? 'bg-green-500' : 
                      isActive ? getProgressBarColor(stage) : 'bg-muted'
                    }`} />
                    <span className={`text-xs transition-colors duration-300 ${
                      isActive ? getStageColor(stage) : 'text-muted-foreground'
                    }`}>
                      {stage.charAt(0).toUpperCase() + stage.slice(1)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Additional details */}
            {(progress.totalChapters || progress.chaptersLoaded) && (
              <div className="bg-muted/30 rounded-lg p-3 space-y-1">
                {progress.totalChapters && (
                  <p className="text-xs text-muted-foreground">
                    Total chapters: {progress.totalChapters}
                  </p>
                )}
                {progress.chaptersLoaded && (
                  <p className="text-xs text-muted-foreground">
                    Preloaded: {progress.chaptersLoaded} chapters
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        
        <p className="text-xs text-muted-foreground">
          {type === 'epub' ? 'We\'re optimizing your reading experience...' : 'Please wait...'}
        </p>
        
        {onCancel && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCancel}
            className="mt-4 flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default EnhancedLoadingProgress;
