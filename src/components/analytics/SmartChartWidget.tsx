import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Lock, Sparkles, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChartMode, ChartConfig } from "@/config/chartManifest";
import { MOCK_DATA_GENERATORS } from "@/lib/mockDataGenerators";

interface SmartChartWidgetContainerProps {
  config: ChartConfig;
  familyId: string;
  studentId: string;
  dateRange?: { from: Date; to: Date };
  unlockedCharts: string[];
  subscriptionTier: string;
  studentName?: string;
}

export const SmartChartWidget = ({
  config,
  familyId,
  studentId,
  dateRange,
  unlockedCharts,
  subscriptionTier,
  studentName = "Student"
}: SmartChartWidgetContainerProps) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<ChartMode>("demo");

  // Determine chart mode based on unlock status and subscription
  const isUnlocked = unlockedCharts.includes(config.chartId) || config.tier === "standard";
  const hasSubscription = 
    (config.subscriptionTier === "free") ||
    (config.subscriptionTier === "team" && ["team", "pro"].includes(subscriptionTier)) ||
    (config.subscriptionTier === "pro" && subscriptionTier === "pro");

  // Fetch live data if unlocked and has subscription
  const { data: liveData, isLoading, error } = useQuery({
    queryKey: ["chart-data", config.chartId, familyId, studentId, dateRange],
    queryFn: async () => {
      if (!config.rpcFunction) return null;
      
      const { data, error } = await supabase.rpc(config.rpcFunction as any, {
        p_family_id: familyId,
        p_student_id: studentId,
        p_days: 30
      });

      if (error) {
        console.error(`[${config.chartId}] RPC Error:`, error);
        throw error;
      }
      return data;
    },
    enabled: isUnlocked && hasSubscription && !!config.rpcFunction
  });

  // Determine final mode with robust error and data checking
  let finalMode: ChartMode = "locked";
  if (!hasSubscription) {
    finalMode = "locked";
  } else if (isUnlocked && !error && liveData && Array.isArray(liveData) && liveData.length > 0) {
    finalMode = "live";
    console.log(`[${config.chartId}] LIVE MODE - Data count: ${liveData.length}`);
  } else if (isUnlocked) {
    finalMode = "demo";
    if (error) {
      console.warn(`[${config.chartId}] DEMO MODE (RPC Error):`, error.message);
    } else {
      console.log(`[${config.chartId}] DEMO MODE - No data available`);
    }
  }

  // Get mock data for demo mode
  const mockData = MOCK_DATA_GENERATORS[config.mockDataGenerator]?.(studentName);

  // Render chart component
  const ChartComponent = config.component;

  // True glassmorphism container with conditional neon glow
  return (
    <div 
      className={cn(
        "relative h-full w-full overflow-hidden rounded-xl border",
        finalMode === "live" && "live-chart-glow"
      )}
      style={{
        backgroundColor: 'rgba(10, 25, 47, 0.15)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        borderColor: finalMode === "live" ? 'rgba(56, 189, 248, 0.8)' : 'rgba(6, 182, 212, 0.4)',
        boxShadow: finalMode === "live" 
          ? '0 0 20px rgba(56, 189, 248, 0.5), 0 0 30px rgba(56, 189, 248, 0.3)'
          : '0 0 15px rgba(0, 180, 255, 0.15)'
      }}
    >
      {/* Chart Title - top left corner inside glass */}
      <div className="absolute top-1 left-1.5 z-20">
        <h3 
          className="text-[9px] font-bold text-cyan-400/90"
          style={{
            textShadow: '0 0 8px rgba(6, 182, 212, 0.4)'
          }}
        >
          {config.title}
        </h3>
      </div>

      {/* Status badges - top right corner */}
      <div className="absolute top-1 right-1.5 z-20 flex gap-1">
        {finalMode === "live" && (
          <Badge variant="default" className="bg-cyan-500/30 text-cyan-300 border-cyan-400/50 text-[8px] px-1.5 py-0 font-bold">
            <TrendingUp className="h-2 w-2 mr-0.5" />
            LIVE
          </Badge>
        )}
        {finalMode === "demo" && (
          <Badge variant="outline" className="border-amber-400/50 text-amber-400 text-[8px] px-1 py-0">
            <Sparkles className="h-2 w-2" />
          </Badge>
        )}
        {finalMode === "locked" && (
          <Badge className="badge-premium text-gray-900 text-[8px] px-1 py-0 border-0">
            <Lock className="h-2 w-2" />
          </Badge>
        )}
      </div>

      {isLoading && hasSubscription ? (
        <div className="h-full w-full">
          <Skeleton className="h-full w-full bg-cyan-900/20" />
        </div>
      ) : finalMode === "locked" ? (
        // LOCKED MODE: Show beautiful mock data with premium overlay
        <div className="relative h-full w-full">
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="text-center space-y-2 p-3 max-w-[180px] pointer-events-auto"
              style={{
                backgroundColor: 'rgba(10, 25, 47, 0.85)',
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)'
              }}
            >
              <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <Lock className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-xs font-bold text-purple-300">Premium Chart</h3>
              <p className="text-[9px] text-cyan-300/60">
                {config.subscriptionTier === "pro" ? "Pro" : "Team"} plan required
              </p>
              <Button 
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-6 text-[9px] px-2"
                onClick={() => navigate("/pricing")}
              >
                Upgrade Now
              </Button>
            </div>
          </div>
          {/* Beautiful mock data in background */}
          <div className="opacity-30 pointer-events-none h-full p-1">
            <ChartComponent 
              familyId={familyId}
              studentId={studentId}
              dateRange={dateRange}
              sampleData={mockData}
              mode="demo"
            />
          </div>
        </div>
      ) : finalMode === "demo" ? (
        // DEMO MODE: Show mock data with subtle "Upload Data" badge at top
        <div className="h-full w-full flex flex-col pt-5">
          {/* Demo badge - top right, minimal */}
          <div className="absolute top-1 right-1.5 z-20">
            <Badge variant="outline" className="border-amber-400/50 text-amber-400 text-[7px] px-1 py-0">
              Demo Data
            </Badge>
          </div>
          <div className="flex-1 min-h-0 relative px-1 pb-1">
            <div className="h-full">
              <ChartComponent 
                familyId={familyId}
                studentId={studentId}
                dateRange={dateRange}
                sampleData={mockData}
                mode="demo"
              />
            </div>
          </div>
          {/* Compact upload CTA at bottom */}
          <div className="flex-none px-1.5 pb-1 border-t border-amber-400/10 bg-amber-500/5">
            <div className="text-[7px] text-amber-300/70 flex items-center justify-between gap-1 py-0.5">
              <span className="truncate">Upload to unlock live data</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-4 text-[7px] px-1 border-amber-400/30 hover:bg-amber-500/10 text-amber-400 flex-shrink-0"
                onClick={() => navigate("/documents")}
              >
                Upload
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // LIVE MODE: Show real data
        <div className="h-full w-full pt-5 px-1 pb-1">
          <ChartComponent 
            familyId={familyId}
            studentId={studentId}
            dateRange={dateRange}
            mode="live"
          />
        </div>
      )}
    </div>
  );
};
