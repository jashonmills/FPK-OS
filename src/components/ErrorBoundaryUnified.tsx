import React, { Component, ErrorInfo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { ErrorBoundaryProps } from '@/types/common';
import { logger } from '@/utils/logger';
import { safeNavigate } from '@/utils/navigation';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Unified Error Boundary Component
 * Consolidates ErrorBoundary and RouteBoundary into one flexible component
 */
class ErrorBoundaryUnified extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Error boundary caught error', 'ERROR_BOUNDARY', { 
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack 
    });

    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  public componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetOnPropsChange = false } = this.props;
    
    if (resetOnPropsChange && prevProps.children !== this.props.children && this.state.hasError) {
      this.handleReset();
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleGoHome = () => {
    safeNavigate('/dashboard', { replace: true });
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Something went wrong
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              This component encountered an error and couldn't render properly.
            </p>
            <div className="space-y-2">
              <Button 
                onClick={this.handleReset}
                className="w-full"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              
              <Button 
                variant="outline"
                onClick={this.handleGoHome}
                className="w-full"
                size="sm"
              >
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>

              {(this.props.showDetails || import.meta.env.DEV) && this.state.error && (
                <details className="text-xs text-left bg-muted p-2 rounded mt-4">
                  <summary className="cursor-pointer font-medium">Error Details</summary>
                  <pre className="mt-2 whitespace-pre-wrap text-destructive text-xs">
                    {this.state.error.message}
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="mt-1 whitespace-pre-wrap text-muted-foreground text-xs">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </details>
              )}
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryUnified;