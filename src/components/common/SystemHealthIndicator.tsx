import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Settings
} from 'lucide-react';
import { useSystemDiagnostics } from '@/hooks/useSystemDiagnostics';
import { cn } from '@/lib/utils';

interface SystemHealthIndicatorProps {
  showDetails?: boolean;
  showControls?: boolean;
  className?: string;
}

const SystemHealthIndicator: React.FC<SystemHealthIndicatorProps> = ({ 
  showDetails = false, 
  showControls = true,
  className 
}) => {
  const { 
    healthData, 
    isLoading, 
    criticalIssues, 
    getHealthStatus, 
    runDiagnostics 
  } = useSystemDiagnostics();

  const status = getHealthStatus();
  
  const getStatusConfig = () => {
    switch (status) {
      case 'excellent':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="h-4 w-4" />,
          label: 'Excellent',
          description: 'System running optimally'
        };
      case 'good':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <Activity className="h-4 w-4" />,
          label: 'Good',
          description: 'Minor optimizations available'
        };
      case 'warning':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <AlertTriangle className="h-4 w-4" />,
          label: 'Warning',
          description: 'Performance issues detected'
        };
      case 'critical':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <AlertTriangle className="h-4 w-4" />,
          label: 'Critical',
          description: `${criticalIssues} critical issue${criticalIssues !== 1 ? 's' : ''} found`
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <Activity className="h-4 w-4" />,
          label: 'Unknown',
          description: 'System status unknown'
        };
    }
  };

  const statusConfig = getStatusConfig();

  if (!showDetails) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Badge className={statusConfig.color}>
          <div className="flex items-center gap-1">
            {statusConfig.icon}
            <span>System: {statusConfig.label}</span>
          </div>
        </Badge>
        {showControls && (
          <Button
            variant="ghost"
            size="sm"
            onClick={runDiagnostics}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={statusConfig.color}>
                <div className="flex items-center gap-1">
                  {statusConfig.icon}
                  <span>{statusConfig.label}</span>
                </div>
              </Badge>
              {criticalIssues > 0 && (
                <Badge variant="destructive">
                  {criticalIssues} Critical
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground">
              {statusConfig.description}
            </p>
            
            {healthData && (
              <div className="grid grid-cols-3 gap-4 mt-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Health Score</span>
                  <div className="font-medium">{healthData.overallScore}%</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Memory</span>
                  <div className="font-medium">{healthData.memoryUsage.toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Performance</span>
                  <div className="font-medium">{healthData.performanceScore.toFixed(0)}</div>
                </div>
              </div>
            )}
          </div>
          
          {showControls && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={runDiagnostics}
                disabled={isLoading}
              >
                <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // This could open a detailed diagnostics modal
                  console.log('Open detailed diagnostics');
                }}
              >
                <Settings className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealthIndicator;