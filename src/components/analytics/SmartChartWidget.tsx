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
  isSuperAdmin?: boolean;
}

export const SmartChartWidget = ({
  config,
  familyId,
  studentId,
  dateRange,
  unlockedCharts,
  subscriptionTier,
  studentName = "Student",
  isSuperAdmin = false
}: SmartChartWidgetContainerProps) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<ChartMode>("demo");

  // Determine chart mode based on unlock status and subscription
  // Super admins bypass ALL restrictions
  const isUnlocked = isSuperAdmin || unlockedCharts.includes(config.chartId) || config.tier === "standard";
  // For now, all users can see demo data for all charts (no premium lock overlays)
  const hasSubscription = true;

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
    // Show demo mode but indicate whether it's truly "no data" or just waiting for uploads
    finalMode = "demo";
    if (error) {
      console.warn(`[${config.chartId}] DEMO MODE (RPC Error):`, error.message);
    } else if (liveData && Array.isArray(liveData) && liveData.length === 0) {
      console.log(`[${config.chartId}] DEMO MODE - Empty data (needs specific data upload)`);
    } else {
      console.log(`[${config.chartId}] DEMO MODE - No data available`);
    }
  }

  // Get mock data for demo mode
  const mockData = MOCK_DATA_GENERATORS[config.mockDataGenerator]?.(studentName);

  // Render chart component
  const ChartComponent = config.component;

  // Dark glassmorphism container with conditional neon glow
  return (
    <div 
      className={cn(
        "relative h-full w-full overflow-hidden rounded-xl border",
        finalMode === "live" && "live-chart-glow"
      )}
      style={{
        backgroundColor: 'rgba(10, 25, 47, 0.60)',  // FIXED: Much darker, more opaque glass
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderColor: finalMode === "live" ? 'rgba(56, 189, 248, 0.8)' : 'rgba(6, 182, 212, 0.3)',
        boxShadow: finalMode === "live" 
          ? '0 0 25px rgba(56, 189, 248, 0.6), 0 0 40px rgba(56, 189, 248, 0.4)'
          : '0 0 15px rgba(0, 180, 255, 0.1)'
      }}
    >
      {/* Chart Title - top left corner inside glass */}
      <div className="absolute top-3 left-3 z-20">
        <h3 
          className="text-[10px] font-bold text-cyan-100"
          style={{
            textShadow: '0 0 10px rgba(6, 182, 212, 0.6), 0 1px 2px rgba(0, 0, 0, 0.8)'
          }}
        >
          {config.title}
        </h3>
      </div>

      {/* Status badges - top right corner */}
      <div className="absolute top-1 right-1.5 z-20 flex gap-1">
        {finalMode === "live" && (
          <Badge variant="default" className="bg-cyan-500/40 text-cyan-50 border-cyan-400/60 text-[8px] px-1.5 py-0 font-bold shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
            LIVE
          </Badge>
        )}
        {finalMode === "demo" && (
          <Badge variant="outline" className="border-amber-400/60 bg-amber-500/20 text-amber-200 text-[8px] px-1 py-0">
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
                backgroundColor: 'rgba(10, 25, 47, 0.92)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                boxShadow: '0 0 25px rgba(139, 92, 246, 0.5)'
              }}
            >
              <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                <Lock className="h-5 w-5 text-purple-300" />
              </div>
              <h3 className="text-xs font-bold text-purple-200">Premium Chart</h3>
              <p className="text-[9px] text-cyan-200/70">
                {config.subscriptionTier === "pro" ? "Pro" : "Team"} plan required
              </p>
              <Button 
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-6 text-[9px] px-2 shadow-[0_0_15px_rgba(139,92,246,0.4)]"
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
          <div className="flex-none px-1.5 pb-1 border-t border-amber-400/20 bg-amber-500/10">
            <div className="text-[7px] text-amber-200/80 flex items-center justify-between gap-1 py-0.5">
              <span className="truncate font-medium">Upload to unlock live data</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-4 text-[7px] px-1.5 border border-amber-400/40 hover:bg-amber-500/20 text-amber-200 flex-shrink-0"
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
