import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { AnalysisMetric } from "@/types/bedrock-insights";

interface MetricCardProps {
  metric: AnalysisMetric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const getTrendIcon = () => {
    switch (metric.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getConfidenceColor = () => {
    if (!metric.confidence) return 'secondary';
    if (metric.confidence >= 0.8) return 'default';
    if (metric.confidence >= 0.6) return 'secondary';
    return 'outline';
  };

  const formatValue = () => {
    if (typeof metric.value === 'number') {
      return metric.unit ? `${metric.value.toFixed(2)} ${metric.unit}` : metric.value.toFixed(2);
    }
    return metric.value;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
          <span>{metric.name}</span>
          {metric.trend && getTrendIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-2xl font-bold text-foreground">{formatValue()}</p>
          {metric.confidence !== undefined && (
            <Badge variant={getConfidenceColor()} className="text-xs">
              {Math.round(metric.confidence * 100)}% confidence
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
