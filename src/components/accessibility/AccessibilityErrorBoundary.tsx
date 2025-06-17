
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
    console.error('Accessibility system error:', error, errorInfo);
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
              Accessibility Settings Temporarily Unavailable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-600">
              We're experiencing an issue with the accessibility system. 
              Your previous settings are preserved, but new changes may not be applied immediately.
            </p>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default AccessibilityErrorBoundary;
