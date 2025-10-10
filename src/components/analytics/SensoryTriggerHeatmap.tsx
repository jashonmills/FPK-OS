import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const SensoryTriggerHeatmap = () => {
  // Placeholder component - will be implemented with actual data later
  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sensory Trigger Heatmap</CardTitle>
            <CardDescription>Visual map of sensory triggers by time and location</CardDescription>
          </div>
          <Badge variant="secondary">AI Recommended</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              This specialized chart is being built based on your document data
            </p>
            <p className="text-sm text-muted-foreground">
              Coming soon: Interactive heatmap showing sensory trigger patterns
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};