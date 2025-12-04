import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ProgressTracking } from "@/types/bedrock-insights";

interface ProgressTrackingCardProps {
  progress: ProgressTracking;
}

export function ProgressTrackingCard({ progress }: ProgressTrackingCardProps) {
  const getTrendIcon = () => {
    switch (progress.trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getProgressColor = () => {
    if (progress.progress_percentage >= 80) return 'text-green-600';
    if (progress.progress_percentage >= 50) return 'text-primary';
    return 'text-muted-foreground';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>{progress.metric}</span>
          {progress.trend && getTrendIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Current:</span>
          <span className="font-semibold text-foreground">{progress.current_value}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Target:</span>
          <span className="font-semibold text-foreground">{progress.target_value}</span>
        </div>
        <div className="space-y-1">
          <Progress value={progress.progress_percentage} className="h-2" />
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${getProgressColor()}`}>
              {Math.round(progress.progress_percentage)}% Complete
            </span>
            {progress.trend && (
              <Badge variant="outline" className="text-xs">
                {progress.trend}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
