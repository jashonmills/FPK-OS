import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Clock, Package } from "lucide-react";
import { toast } from "sonner";

interface Activity {
  title: string;
  description: string;
  materials: string[];
  duration: string;
  tip: string;
}

interface GoalActivitiesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goalId: string;
  goalTitle: string;
}

export const GoalActivitiesModal = ({ open, onOpenChange, goalId, goalTitle }: GoalActivitiesModalProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateActivities = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("suggest-goal-activities", {
        body: { goal_id: goalId },
      });

      if (error) throw error;

      setActivities(data.activities || []);
      if (data.activities.length === 0) {
        toast.info("No activities generated");
      }
    } catch (error: any) {
      toast.error("Failed to generate activities: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setActivities([]);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Activity Ideas for: {goalTitle}
          </DialogTitle>
          <DialogDescription>
            AI-generated activities to practice this goal at home
          </DialogDescription>
        </DialogHeader>

        {activities.length === 0 ? (
          <div className="py-12 text-center space-y-4">
            <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Get personalized activity ideas to work on this goal at home
              </p>
              <Button 
                onClick={handleGenerateActivities} 
                disabled={isLoading}
              >
                {isLoading ? "Generating Ideas..." : "Get Activity Ideas"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg">{activity.title}</h3>
                    <Badge variant="outline" className="flex items-center gap-1 shrink-0">
                      <Clock className="h-3 w-3" />
                      {activity.duration}
                    </Badge>
                  </div>

                  <p className="text-sm leading-relaxed">{activity.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Package className="h-4 w-4 text-primary" />
                      Materials Needed:
                    </div>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {activity.materials.map((material, i) => (
                        <li key={i}>{material}</li>
                      ))}
                    </ul>
                  </div>

                  {activity.tip && (
                    <div className="bg-primary/5 p-3 rounded-lg">
                      <p className="text-sm">
                        <span className="font-medium">💡 Tip:</span> {activity.tip}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-end">
              <Button 
                variant="outline" 
                onClick={handleGenerateActivities}
                disabled={isLoading}
              >
                {isLoading ? "Regenerating..." : "Regenerate Ideas"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};