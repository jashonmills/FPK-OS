
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

interface ReadingProgressWidgetErrorBoundaryProps {
  children: React.ReactNode;
}

interface ReadingProgressWidgetErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ReadingProgressWidgetErrorBoundary extends React.Component<
  ReadingProgressWidgetErrorBoundaryProps,
  ReadingProgressWidgetErrorBoundaryState
> {
  constructor(props: ReadingProgressWidgetErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ReadingProgressWidgetErrorBoundaryState {
    console.error('ReadingProgressWidget Error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ReadingProgressWidget Error Details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="fpk-card border-0 shadow-md">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-blue-600" />
              Reading Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-center py-4">
              <BookOpen className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Reading data temporarily unavailable</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ReadingProgressWidgetErrorBoundary;
