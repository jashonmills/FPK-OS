import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, RefreshCw, Copy, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { AnalysisData } from "@/types/bedrock-insights";
import { InsightCard } from "./InsightCard";
import { MetricCard } from "./MetricCard";
import { ProgressTrackingCard } from "./ProgressTrackingCard";
import { BipDataDisplay } from "./BipDataDisplay";

interface DocumentInsightsTabProps {
  documentId: string;
  analysisData: any;
  category?: string;
  onReAnalyze?: () => void;
}

export function DocumentInsightsTab({ 
  documentId, 
  analysisData, 
  category,
  onReAnalyze 
}: DocumentInsightsTabProps) {
  const [copying, setCopying] = useState(false);

  // Parse the analysis data
  const data: AnalysisData | null = analysisData ? 
    (typeof analysisData === 'string' ? JSON.parse(analysisData) : analysisData) : 
    null;

  const hasInsights = data?.insights && data.insights.length > 0;
  const hasMetrics = data?.metrics && data.metrics.length > 0;
  const hasProgress = data?.progress_tracking && data.progress_tracking.length > 0;
  const hasBipData = data?.bip_data && Object.keys(data.bip_data).length > 0;
  const hasAnyData = hasInsights || hasMetrics || hasProgress || hasBipData;

  const handleCopyAll = async () => {
    if (!data) return;
    
    setCopying(true);
    try {
      const formattedData = JSON.stringify(data, null, 2);
      await navigator.clipboard.writeText(formattedData);
      toast.success("All insights copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy insights");
    } finally {
      setCopying(false);
    }
  };

  // Empty state
  if (!data || !hasAnyData) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Structured Insights Available
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          No structured insights have been extracted for this document yet. 
          Try re-analyzing it with a specialist processor to extract detailed information.
        </p>
        {onReAnalyze && (
          <Button onClick={onReAnalyze} variant="default">
            <RefreshCw className="mr-2 h-4 w-4" />
            Re-Analyze Document
          </Button>
        )}
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Extracted Insights</h3>
          </div>
          <div className="flex items-center gap-2">
            {onReAnalyze && (
              <Button onClick={onReAnalyze} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Re-Analyze
              </Button>
            )}
            <Button 
              onClick={handleCopyAll} 
              variant="outline" 
              size="sm"
              disabled={copying}
            >
              <Copy className="mr-2 h-4 w-4" />
              {copying ? "Copying..." : "Copy All"}
            </Button>
          </div>
        </div>

        {/* Key Insights Section */}
        {hasInsights && (
          <section className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Key Insights
            </h4>
            <div className="space-y-3">
              {data.insights!.map((insight, idx) => (
                <InsightCard key={idx} insight={insight} />
              ))}
            </div>
          </section>
        )}

        {/* Metrics Section */}
        {hasMetrics && (
          <section className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Extracted Metrics
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.metrics!.map((metric, idx) => (
                <MetricCard key={idx} metric={metric} />
              ))}
            </div>
          </section>
        )}

        {/* Progress Tracking Section */}
        {hasProgress && (
          <section className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Progress Tracking
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.progress_tracking!.map((progress, idx) => (
                <ProgressTrackingCard key={idx} progress={progress} />
              ))}
            </div>
          </section>
        )}

        {/* BIP-Specific Data Section */}
        {hasBipData && (
          <section className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Behavior Intervention Plan Details
            </h4>
            <BipDataDisplay data={data.bip_data!} />
          </section>
        )}
      </div>
    </ScrollArea>
  );
}
