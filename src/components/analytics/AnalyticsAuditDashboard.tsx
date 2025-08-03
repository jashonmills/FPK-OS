import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  Database,
  Eye,
  BarChart3,
  Download
} from 'lucide-react';
import { useAnalyticsValidator } from '@/hooks/useAnalyticsValidator';
import { useAnalyticsEventBus } from '@/hooks/useAnalyticsEventBus';

export const AnalyticsAuditDashboard: React.FC = () => {
  const validator = useAnalyticsValidator();
  const { getEventHistory } = useAnalyticsEventBus();
  
  const [auditResult, setAuditResult] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const runAudit = async () => {
    setIsLoading(true);
    try {
      const result = validator.generateAnalyticsReport();
      setAuditResult(result);
    } catch (error) {
      console.error('Analytics audit failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportAuditReport = () => {
    if (!auditResult) return;
    
    const report = {
      timestamp: new Date().toISOString(),
      ...auditResult
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-audit-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  React.useEffect(() => {
    runAudit();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
          <span>Running analytics audit...</span>
        </div>
      </div>
    );
  }

  if (!auditResult) {
    return (
      <div className="p-6">
        <Button onClick={runAudit}>Run Analytics Audit</Button>
      </div>
    );
  }

  const { summary, validation, eventBreakdown } = auditResult;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Analytics Audit Dashboard
        </h2>
        <div className="flex gap-2">
          <Button onClick={runAudit} variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Refresh Audit
          </Button>
          <Button onClick={exportAuditReport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">System Health</p>
                <p className="text-2xl font-bold">
                  {summary.isHealthy ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-5 w-5" />
                      Healthy
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center gap-1">
                      <XCircle className="h-5 w-5" />
                      Issues
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold">{summary.totalEvents.toLocaleString()}</p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Event Types</p>
                <p className="text-2xl font-bold">{summary.uniqueEventTypes}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last Event</p>
                <p className="text-sm font-medium">
                  {summary.lastEvent === 'No events recorded' 
                    ? summary.lastEvent 
                    : new Date(summary.lastEvent).toLocaleDateString()
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Validation Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Errors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Critical Issues ({validation.errors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {validation.errors.length === 0 ? (
              <p className="text-green-600 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                No critical issues found
              </p>
            ) : (
              <div className="space-y-2">
                {validation.errors.slice(0, 5).map((error: string, index: number) => (
                  <div key={index} className="p-2 bg-red-50 border border-red-200 rounded text-sm">
                    {error}
                  </div>
                ))}
                {validation.errors.length > 5 && (
                  <p className="text-sm text-gray-600">
                    ... and {validation.errors.length - 5} more issues
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Warnings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Warnings ({validation.warnings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {validation.warnings.length === 0 ? (
              <p className="text-green-600 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                No warnings
              </p>
            ) : (
              <div className="space-y-2">
                {validation.warnings.slice(0, 5).map((warning: string, index: number) => (
                  <div key={index} className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                    {warning}
                  </div>
                ))}
                {validation.warnings.length > 5 && (
                  <p className="text-sm text-gray-600">
                    ... and {validation.warnings.length - 5} more warnings
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Missing Events */}
      {validation.missingEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Missing Critical Events ({validation.missingEvents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {validation.missingEvents.map((event: string) => (
                <Badge key={event} variant="destructive">
                  {event}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {validation.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {validation.recommendations.map((rec: string, index: number) => (
                <div key={index} className="p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                  • {rec}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Event Type Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {eventBreakdown.slice(0, 10).map((event: any, index: number) => (
              <div key={event.type}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{event.type}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{event.count}</Badge>
                    <span className="text-xs text-gray-500">
                      {event.lastOccurrence === 'Never' 
                        ? 'Never' 
                        : new Date(event.lastOccurrence).toLocaleDateString()
                      }
                    </span>
                  </div>
                </div>
                {index < eventBreakdown.slice(0, 10).length - 1 && <Separator className="mt-2" />}
              </div>
            ))}
            {eventBreakdown.length > 10 && (
              <p className="text-sm text-gray-600 pt-2">
                ... and {eventBreakdown.length - 10} more event types
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};