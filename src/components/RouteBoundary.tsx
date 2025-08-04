
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class RouteBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Route error boundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null
    });
  };

  private handleGoHome = () => {
    // Use navigate instead of window.location to prevent full page reload
    try {
      const navigate = (window as any).__reactRouterNavigate;
      if (navigate) {
        navigate('/dashboard/learner');
      } else {
        window.location.href = '/dashboard/learner';
      }
    } catch {
      window.location.href = '/dashboard/learner';
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Page Error
            </h2>
            <p className="text-gray-600 mb-6">
              This page encountered an error. Other parts of the app should still work.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={this.handleRetry}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              
              <Button 
                variant="outline"
                onClick={this.handleGoHome}
                className="w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Error Details (Development)
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                  <pre>{this.state.error.toString()}</pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RouteBoundary;
