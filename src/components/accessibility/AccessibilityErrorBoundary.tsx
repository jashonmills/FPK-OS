import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface AccessibilityErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface AccessibilityErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  componentName?: string;
}

class AccessibilityErrorBoundary extends React.Component<
  AccessibilityErrorBoundaryProps,
  AccessibilityErrorBoundaryState
> {
  constructor(props: AccessibilityErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): AccessibilityErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`❌ Component error in ${this.props.componentName || 'Unknown'}:`, error);
    console.error('❌ Error info:', errorInfo);
    if (error?.stack) {
      console.error('❌ Error stack:', error.stack);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
              {this.props.componentName || 'Component'} Temporarily Unavailable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-600">
              We're experiencing an issue with this component. 
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-2">
                  <summary>Error Details</summary>
                  <pre className="text-xs">{this.state.error?.message}</pre>
                </details>
              )}
            </p>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default AccessibilityErrorBoundary;