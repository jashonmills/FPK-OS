
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useAIInsights } from '@/hooks/useAIInsights';

const AnomalyDashboard: React.FC = () => {
  const { anomalies, insights, isLoading, resolveAnomaly } = useAIInsights();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInsightTypeIcon = (type: string) => {
    switch (type) {
      case 'anomaly':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'performance':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'pattern':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Active Anomalies */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Active Anomalies
            {anomalies.length > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {anomalies.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {anomalies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-400" />
              <p className="font-medium">No active anomalies</p>
              <p className="text-sm">Your learning patterns are normal</p>
            </div>
          ) : (
            anomalies.map((anomaly) => (
              <div 
                key={anomaly.id} 
                className="p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(anomaly.severity)}>
                      {anomaly.severity}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(anomaly.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => resolveAnomaly(anomaly.id)}
                  >
                    Resolve
                  </Button>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">
                  {anomaly.metric.replace(/_/g, ' ').toUpperCase()}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {anomaly.message}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Value: {anomaly.value.toFixed(2)}</span>
                  <span>Threshold: {anomaly.threshold.toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            AI Insights
            {insights.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {insights.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">Generating insights...</p>
              <p className="text-sm">Continue learning to see AI-powered insights</p>
            </div>
          ) : (
            insights.slice(0, 5).map((insight) => (
              <div 
                key={insight.id} 
                className="p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-3 mb-2">
                  {getInsightTypeIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{insight.title}</h4>
                      <Badge 
                        variant="outline" 
                        className={
                          insight.priority === 'high' 
                            ? 'border-red-200 text-red-700'
                            : insight.priority === 'medium'
                            ? 'border-yellow-200 text-yellow-700'
                            : 'border-green-200 text-green-700'
                        }
                      >
                        {insight.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {insight.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Confidence: {Math.round(insight.confidence * 100)}%</span>
                      <span>{new Date(insight.timestamp).toLocaleDateString()}</span>
                      {insight.actionable && (
                        <Badge variant="outline" className="text-xs">
                          Actionable
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnomalyDashboard;
