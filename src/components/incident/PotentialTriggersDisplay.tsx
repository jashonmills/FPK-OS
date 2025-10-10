import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Target, Info } from "lucide-react";

interface PotentialTrigger {
  factor: string;
  confidence: string;
  evidence: string;
}

interface PotentialTriggersDisplayProps {
  triggers: PotentialTrigger[] | null;
}

export const PotentialTriggersDisplay = ({ triggers }: PotentialTriggersDisplayProps) => {
  if (!triggers || triggers.length === 0) {
    return null;
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getConfidenceIcon = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case "high":
        return <AlertTriangle className="h-4 w-4" />;
      case "medium":
        return <Target className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="h-5 w-5 text-primary" />
          AI-Identified Potential Triggers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {triggers.map((trigger, index) => (
            <div key={index} className="space-y-2 pb-4 border-b last:border-0">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{trigger.factor}</h4>
                <Badge 
                  variant={getConfidenceColor(trigger.confidence)}
                  className="flex items-center gap-1"
                >
                  {getConfidenceIcon(trigger.confidence)}
                  {trigger.confidence} confidence
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {trigger.evidence}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};