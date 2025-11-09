import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

interface ReAnalysisButtonProps {
  familyId: string;
  onJobStarted?: (jobId: string) => void;
}

export function ReAnalysisButton({ familyId, onJobStarted }: ReAnalysisButtonProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleReAnalyze = async () => {
    setIsAnalyzing(true);
    const toastId = toast.loading("🚀 Starting smart batching...");
    
    try {
      console.log('🔵 Invoking re-analyze-all-documents for family:', familyId);
      const { data, error } = await supabase.functions.invoke("re-analyze-all-documents", {
        body: { family_id: familyId },
      });
      console.log('🔵 Response:', { data, error });

      if (error) throw error;

      if (data?.success && data?.job_id) {
        onJobStarted?.(data.job_id);
        const estimatedTime = data.estimated_time_minutes || 3;
        toast.success(
          `✅ Processing ${data.total_documents} doc(s) with smart batching (est. ${estimatedTime} min). Auto-retry enabled for rate limits.`, 
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
