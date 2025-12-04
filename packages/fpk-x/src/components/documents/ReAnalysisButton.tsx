import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

interface ReAnalysisButtonProps {
  familyId: string;
  studentId?: string;
  onJobStarted?: (jobId: string) => void;
}

export function ReAnalysisButton({ familyId, studentId, onJobStarted }: ReAnalysisButtonProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleReAnalyze = async () => {
    setIsAnalyzing(true);
    const toastId = toast.loading("🚀 Starting re-analysis...");
    
    try {
      console.log('🔵 Invoking bedrock-re-analyze-all for family:', familyId);
      const { data, error } = await supabase.functions.invoke("bedrock-re-analyze-all", {
        body: { 
          familyId: familyId,
          studentId: studentId 
        },
      });
      console.log('🔵 Response:', { data, error });

      if (error) throw error;

      if (data?.success) {
        const estimatedTime = data.estimatedMinutes || 3;
        toast.success(
          `✅ Re-analyzing ${data.total} document(s) using Project Bedrock (est. ${estimatedTime} min)`, 
          { id: toastId, duration: 7000 }
        );
      }
    } catch (error: any) {
      console.error("Re-analysis error:", error);
      toast.error("Re-analysis failed: " + error.message, { id: toastId });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Button
      onClick={handleReAnalyze}
      disabled={isAnalyzing}
      variant="default"
      size="lg"
      className="gap-2"
    >
      <RefreshCw className={`h-5 w-5 ${isAnalyzing ? 'animate-spin' : ''}`} />
      {isAnalyzing ? "Starting..." : "Re-Analyze All Documents"}
    </Button>
  );
}
