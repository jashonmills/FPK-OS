import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFamily } from "@/contexts/FamilyContext";
import { Card, CardContent } from "@/components/ui/card";
import { Sun, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export const DailyBriefingWidget = () => {
  const { selectedStudent, selectedFamily } = useFamily();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: briefing, isLoading, refetch } = useQuery({
    queryKey: ["daily-briefing", selectedStudent?.id],
    queryFn: async () => {
      if (!selectedStudent?.id) return null;
      
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from("ai_insights")
        .select("*")
        .eq("student_id", selectedStudent.id)
        .eq("insight_type", "daily_briefing")
        .gte("generated_at", `${today}T00:00:00`)
        .order("generated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!selectedStudent?.id,
  });

  const handleGenerateBriefing = async () => {
    if (!selectedFamily?.id || !selectedStudent?.id) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-daily-briefing", {
        body: { 
          family_id: selectedFamily.id,
          student_id: selectedStudent.id,
        },
      });

      if (error) throw error;

      toast.success("Daily briefing generated!");
      refetch();
    } catch (error: any) {
      toast.error("Failed to generate briefing: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!selectedStudent) return null;

  if (isLoading) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">Loading your briefing...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Sun className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 space-y-3">
            {briefing ? (
              <>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">☀️ Good Morning!</h3>
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm leading-relaxed">{briefing.content}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Generated {new Date(briefing.generated_at).toLocaleTimeString()}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleGenerateBriefing}
                    disabled={isGenerating}
                  >
                    {isGenerating ? "Refreshing..." : "Refresh Briefing"}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">☀️ Good Morning!</h3>
                <p className="text-sm text-muted-foreground">
                  Start your day with a personalized briefing based on yesterday's data and today's outlook.
                </p>
                <Button 
                  onClick={handleGenerateBriefing} 
                  disabled={isGenerating}
                  size="sm"
                >
                  {isGenerating ? "Generating..." : "Generate Today's Briefing"}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};