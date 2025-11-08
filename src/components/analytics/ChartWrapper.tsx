/**
 * ChartWrapper Component
 * "No Blank Charts, Ever" - The Gold Standard
 * 
 * Intelligently handles all chart states:
 * - Loading
 * - Sufficient data (render chart)
 * - Insufficient data (show data points with message)
 * - No data in range
 * - Awaiting data (never uploaded relevant document)
 */

import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, TrendingUp, Calendar, Upload } from 'lucide-react';
import { getDataStatus } from '@/lib/chartDataUtils';

interface ChartWrapperProps {
  // Chart metadata
  title: string;
  description?: string;
  
  // Data status
  data: any[] | null | undefined;
  isLoading?: boolean;
  error?: Error | null;
  
  // Configuration
  minimumDataPoints?: number;
  requiredDocuments?: string[];
  
  // Chart rendering
  children: ReactNode;
  
  // Optional custom empty states
  customEmptyState?: ReactNode;
  customInsufficientState?: ReactNode;
}

export function ChartWrapper({
  title,
  description,
  data,
  isLoading = false,
  error = null,
  minimumDataPoints = 3,
  requiredDocuments = [],
  children,
  customEmptyState,
  customInsufficientState
}: ChartWrapperProps) {
  // Determine data status
  const status = getDataStatus(data, minimumDataPoints);

  // Error state
  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Error loading chart data: {error.message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (isLoading || status.status === 'loading') {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-[200px] w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Awaiting data state (never had data)
  if (status.status === 'awaiting') {
    if (customEmptyState) {
      return (
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
          <CardContent>
            {customEmptyState}
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">Awaiting Data</h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-4">
            To populate this chart, upload a relevant document
            {requiredDocuments.length > 0 && (
              <span className="block mt-2 font-medium">
                (e.g., {requiredDocuments.join(', ')})
              </span>
            )}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Insufficient data state (1-2 data points)
  if (status.status === 'insufficient') {
    if (customInsufficientState) {
      return (
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
          <CardContent>
            {customInsufficientState}
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">Not Enough Data for Trend Analysis</h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-4">
            {status.dataPointCount} data point{status.dataPointCount > 1 ? 's' : ''} found. 
            Need at least {minimumDataPoints} for meaningful trend visualization.
          </p>
          <p className="text-xs text-muted-foreground">
            Continue uploading documents to build trend data.
          </p>
        </CardContent>
      </Card>
    );
  }

  // No data in current range state
  if (status.status === 'no_data') {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">No Data in Selected Range</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Try expanding your date range to view historical data.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sufficient data - render the chart!
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
