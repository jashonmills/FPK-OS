import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  componentName?: string;
  showDetails?: boolean;
  allowRetry?: boolean;
  allowGoHome?: boolean;
  level?: 'critical' | 'component' | 'feature';
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

class EnhancedErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, componentName, level = 'component' } = this.props;
    
    // Enhanced logging with context
    console.group(`🚨 ${level.toUpperCase()} Error in ${componentName || 'Unknown Component'}`);
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('Error Info:', errorInfo);
    console.groupEnd();

    // Store error details in state
    this.setState({ error, errorInfo });

    // Call custom error handler
    onError?.(error, errorInfo);

    // Show toast notification for non-critical errors
    if (level !== 'critical') {
      toast.error(`${componentName || 'Component'} Error`, {
        description: error.message,
        action: {
          label: 'Retry',
          onClick: () => this.handleRetry()
        }
      });
    }

    // Report to error tracking service (if available)
    this.reportError(error, errorInfo, componentName, level);
  }

  private reportError = (error: Error, errorInfo: ErrorInfo, componentName?: string, level?: string) => {
    // This could be enhanced to send to Sentry, LogRocket, etc.
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: `${componentName}: ${error.message}`,
        fatal: level === 'critical'
      });
    }
  };

  private handleRetry = () => {
    const { retryCount } = this.state;
    
    if (retryCount < this.maxRetries) {
      console.log(`🔄 Retrying component render (${retryCount + 1}/${this.maxRetries})`);
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: retryCount + 1
      });
    } else {
      toast.error('Maximum retries reached', {
        description: 'Please refresh the page to continue.'
      });
    }
  };

  private handleGoHome = () => {
    window.location.href = '/dashboard/learner';
  };

  private handleRefreshPage = () => {
    window.location.reload();
  };

  render() {
    const { hasError, error, retryCount } = this.state;
    const { 
      children, 
      fallback, 
      componentName, 
      showDetails = false,
      allowRetry = true,
      allowGoHome = true,
      level = 'component'
    } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Critical errors get full-screen treatment
      if (level === 'critical') {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full mx-auto p-8">
              <div className="text-center">
                <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Application Error
                </h1>
                <p className="text-gray-600 mb-6">
                  The application encountered a critical error and needs to be restarted.
                </p>
                
                <div className="space-y-3">
                  <Button 
                    onClick={this.handleRefreshPage}
                    className="w-full"
                    size="lg"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Application
                  </Button>
                  
                  {allowGoHome && (
                    <Button 
                      variant="outline" 
                      onClick={this.handleGoHome}
                      className="w-full"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Go to Dashboard
                    </Button>
                  )}
                </div>

                {showDetails && error && (
                  <details className="mt-6 text-left">
                    <summary className="cursor-pointer font-medium text-sm text-gray-700">
                      Technical Details
                    </summary>
                    <pre className="mt-2 text-xs text-gray-600 bg-gray-100 p-3 rounded overflow-auto max-h-32">
                      {error.message}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        );
      }

      // Component-level errors get inline treatment
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">
                {componentName ? `${componentName} Error` : 'Component Error'}
              </h3>
              <p className="text-sm text-red-700 mt-1">
                This component encountered an error and couldn't render properly.
              </p>
              
              <div className="mt-3 flex flex-wrap gap-2">
                {allowRetry && retryCount < this.maxRetries && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={this.handleRetry}
                    className="text-red-700 border-red-300 hover:bg-red-100"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Retry ({this.maxRetries - retryCount} left)
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={this.handleRefreshPage}
                  className="text-red-700 border-red-300 hover:bg-red-100"
                >
                  Refresh Page
                </Button>
              </div>

              {showDetails && error && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm font-medium text-red-800">
                    Error Details
                  </summary>
                  <pre className="mt-2 text-xs text-red-700 bg-red-100 p-2 rounded overflow-auto max-h-24">
                    {error.message}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default EnhancedErrorBoundary;