import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ScormPlayerBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

interface ScormPlayerBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry?: () => void }>;
}

class ScormPlayerBoundary extends React.Component<ScormPlayerBoundaryProps, ScormPlayerBoundaryState> {
  constructor(props: ScormPlayerBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): ScormPlayerBoundaryState {
    console.error('🚨 SCORM Player Error Boundary caught error:', error);
    return {
      hasError: true,
      error,
      errorInfo: error.stack || null
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 SCORM Player Error Details:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  }

  handleRetry = () => {
    console.log('🔄 Retrying SCORM player...');
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error || undefined} retry={this.handleRetry} />;
      }

      return <ScormPlayerErrorFallback error={this.state.error} retry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

const ScormPlayerErrorFallback: React.FC<{ error?: Error; retry?: () => void }> = ({ error, retry }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-xl font-semibold">SCORM Player Error</CardTitle>
          <CardDescription>
            The SCORM player encountered an error while loading. This might be due to missing dependencies or component issues.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="text-sm bg-muted p-3 rounded-lg">
              <strong>Error:</strong> {error.message}
            </div>
          )}
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            <strong>Troubleshooting steps:</strong>
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li>Check if all SCORM components are properly imported</li>
              <li>Verify that SCORM runtime modules exist</li>
              <li>Ensure no circular import dependencies</li>
              <li>Check browser console for detailed error messages</li>
            </ul>
          </div>
          <div className="flex gap-2">
            <Button onClick={retry} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard/scorm/packages')} className="flex-1">
              <Home className="h-4 w-4 mr-2" />
              Back to Packages
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScormPlayerBoundary;