import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Clock, 
  TrendingDown,
  User,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { useRiskRadar } from '@/hooks/useRiskRadar';
import { formatDistanceToNow } from 'date-fns';
import type { RiskRadarAlert } from '@/types/ai-insights';

interface RiskRadarSectionProps {
  cohortId?: string;
  isCompact?: boolean;
}

export const RiskRadarSection: React.FC<RiskRadarSectionProps> = ({
  cohortId,
  isCompact = false
}) => {
  const [selectedRiskType, setSelectedRiskType] = useState<string>('all');
  
  const { 
    alerts, 
    highRiskStudents, 
    mediumRiskStudents, 
    isLoading, 
    resolveAlert, 
    isResolving 
  } = useRiskRadar({ cohort_id: cohortId, window: '7d', top_k: 50 });

  const getRiskTypeIcon = (riskType: string) => {
    switch (riskType) {
      case 'miss_deadline': return <Clock className="h-4 w-4" />;
      case 'drop_mastery': return <TrendingDown className="h-4 w-4" />;
      case 'engagement_drop': return <User className="h-4 w-4" />;
      case 'misconception_pattern': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-red-600 bg-red-50 border-red-200';
    if (score >= 0.6) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (score >= 0.4) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const formatRiskType = (riskType: string) => {
    return riskType.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const filteredAlerts = selectedRiskType === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.risk_type === selectedRiskType);

  const riskTypes = Array.from(new Set(alerts.map(alert => alert.risk_type)));

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">High Risk</p>
                <p className="text-2xl font-bold text-red-600">{highRiskStudents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <TrendingDown className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Medium Risk</p>
                <p className="text-2xl font-bold text-orange-600">{mediumRiskStudents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Alerts</p>
                <p className="text-2xl font-bold text-blue-600">{alerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Filter by risk type:</span>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedRiskType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedRiskType('all')}
          >
            All ({alerts.length})
          </Button>
          {riskTypes.map(type => (
            <Button
              key={type}
              variant={selectedRiskType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedRiskType(type)}
            >
              {formatRiskType(type)} ({alerts.filter(a => a.risk_type === type).length})
            </Button>
          ))}
        </div>
      </div>

      {/* Risk Alerts */}
      {filteredAlerts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No alerts found</h3>
            <p className="text-sm text-muted-foreground">
              {selectedRiskType === 'all' 
                ? 'No students are currently at risk. Great job!' 
                : `No students at risk for ${formatRiskType(selectedRiskType)}.`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className={`space-y-4 ${isCompact ? 'max-h-96 overflow-y-auto' : ''}`}>
          {filteredAlerts.map((alert) => (
            <Card key={alert.id} className={`border-l-4 ${getRiskScoreColor(alert.risk_score)}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${getRiskScoreColor(alert.risk_score)}`}>
                    {getRiskTypeIcon(alert.risk_type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">
                            Student {alert.student_mask || alert.student_id.slice(-6)}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {formatRiskType(alert.risk_type)}
                          </Badge>
                          <Badge className={`text-xs ${getRiskScoreColor(alert.risk_score)}`}>
                            Risk: {Math.round(alert.risk_score * 100)}%
                          </Badge>
                        </div>

                        {alert.next_deadline_at && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Calendar className="h-4 w-4" />
                            Next deadline: {formatDistanceToNow(new Date(alert.next_deadline_at), { addSuffix: true })}
                          </div>
                        )}

                        {/* Top Features */}
                        <div className="mb-3">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Contributing factors:</p>
                          <div className="space-y-1">
                            {alert.top_features.slice(0, isCompact ? 2 : 3).map((feature, index) => (
                              <div key={index} className="flex items-center justify-between text-xs">
                                <span className="capitalize">{feature.name.replace(/_/g, ' ')}</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono">{feature.value}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {Math.round(feature.contribution * 100)}%
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Suggested Actions */}
                        {!isCompact && alert.suggested_actions && alert.suggested_actions.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground">Suggested actions:</p>
                            <div className="flex flex-wrap gap-2">
                              {alert.suggested_actions.slice(0, 2).map((action, index) => (
                                <Button key={index} variant="outline" size="sm" className="text-xs">
                                  {action.label || action.action}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resolveAlert(alert.id)}
                        disabled={isResolving}
                        className="text-xs"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Resolve
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};