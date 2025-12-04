import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Info, Lightbulb } from "lucide-react";
import { Insight } from "@/types/bedrock-insights";

interface InsightCardProps {
  insight: Insight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const getIcon = () => {
    switch (insight.priority) {
      case 'high':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'medium':
        return <Info className="h-5 w-5 text-primary" />;
      default:
        return <Lightbulb className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getPriorityColor = () => {
    switch (insight.priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="border-l-4" style={{
      borderLeftColor: insight.priority === 'high' ? 'hsl(var(--destructive))' : 
                      insight.priority === 'medium' ? 'hsl(var(--primary))' : 
                      'hsl(var(--muted))'
    }}>
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{getIcon()}</div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={getPriorityColor()} className="text-xs">
                {insight.type}
              </Badge>
              {insight.priority && (
                <Badge variant="outline" className="text-xs">
                  {insight.priority.toUpperCase()}
                </Badge>
              )}
            </div>
            <p className="text-sm text-foreground leading-relaxed">{insight.content}</p>
            {insight.timestamp && (
              <p className="text-xs text-muted-foreground">
                {new Date(insight.timestamp).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
