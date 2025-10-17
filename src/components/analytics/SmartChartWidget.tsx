import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Upload, Lock, Sparkles, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChartMode, ChartConfig, ChartWidgetProps } from "@/config/chartManifest";
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
  const { data: liveData, isLoading } = useQuery({
    queryKey: ["chart-data", config.chartId, familyId, studentId, dateRange],
    queryFn: async () => {
      if (!config.rpcFunction) return null;
      
      const { data, error } = await supabase.rpc(config.rpcFunction as any, {
        p_family_id: familyId,
        p_student_id: studentId,
        p_days: 30
      });

      if (error) throw error;
      return data;
    },
    enabled: isUnlocked && hasSubscription && !!config.rpcFunction
  });

  // Determine final mode
  let finalMode: ChartMode = "locked";
  if (!hasSubscription) {
    finalMode = "locked";
  } else if (isUnlocked && liveData && Array.isArray(liveData) && liveData.length > 0) {
    finalMode = "live";
  } else if (isUnlocked) {
    finalMode = "demo";
  }

  // Get mock data for demo mode
  const mockData = MOCK_DATA_GENERATORS[config.mockDataGenerator]?.(studentName);

  // Render chart component
  const ChartComponent = config.component;

  const cardClassName = cn(
    "glass-card rounded-md transition-all duration-300 relative overflow-hidden h-full flex flex-col",
    finalMode === "live" && "chart-live border-cyan-500/30",
    finalMode === "demo" && "border-amber-400/30 shadow-[0_0_10px_rgba(251,191,36,0.15)]",
    finalMode === "locked" && "border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.15)]"
  );

  const gridColSpan = config.gridSpan?.cols || 1;
  const gridRowSpan = config.gridSpan?.rows || 1;

  return (
    <div 
      className={cn("relative", {
        "col-span-2": gridColSpan === 2,
        "col-span-3": gridColSpan === 3,
        "row-span-2": gridRowSpan === 2
      })}
    >
      <Card className={cardClassName}>
        <CardHeader className="pb-1 pt-2 px-3 flex-none">
          <div className="flex items-start justify-between gap-1">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-[11px] font-semibold flex items-center gap-1 text-cyan-100 truncate">
                <span className="truncate">{config.title}</span>
                {finalMode === "live" && (
                  <Badge variant="default" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 animate-pulse text-[8px] px-1 py-0 flex-shrink-0">
                    <TrendingUp className="h-2 w-2" />
                  </Badge>
                )}
                {finalMode === "demo" && (
                  <Badge variant="outline" className="border-amber-400/50 text-amber-400 text-[8px] px-1 py-0 flex-shrink-0">
                    <Sparkles className="h-2 w-2" />
                  </Badge>
                )}
                {finalMode === "locked" && (
                  <Badge className="badge-premium text-gray-900 text-[8px] px-1 py-0 border-0 flex-shrink-0">
                    <Lock className="h-2 w-2" />
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-[9px] mt-0 text-cyan-300/40 truncate">
                {config.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-2 px-3 flex-1 min-h-0 flex flex-col">
          {isLoading && hasSubscription ? (
            <div className="space-y-1 flex-1">
              <Skeleton className="h-full w-full bg-cyan-900/20" />
            </div>
          ) : finalMode === "locked" ? (
            // LOCKED MODE: Show blurred preview with upgrade CTA
            <div className="relative flex-1 min-h-0">
              <div className="absolute inset-0 backdrop-blur-sm bg-background/60 z-10 flex items-center justify-center rounded-md">
                <div className="text-center space-y-2 p-3 max-w-[200px]">
                  <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-purple-400" />
                  </div>
                  <h3 className="text-xs font-bold text-purple-300">Premium</h3>
                  <p className="text-[9px] text-cyan-300/60">
                    {config.subscriptionTier === "pro" ? "Pro" : "Team"} plan required
                  </p>
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-6 text-[9px] px-2"
                    onClick={() => navigate("/pricing")}
                  >
                    Upgrade
                  </Button>
                </div>
              </div>
              {/* Blurred preview */}
              <div className="blur-sm opacity-20 pointer-events-none h-full">
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
            // DEMO MODE: Show mock data with compact upload CTA
            <div className="space-y-1 flex-1 min-h-0 flex flex-col">
              <div className="relative flex-1 min-h-0">
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent pointer-events-none z-10" />
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
              <Alert className="border-amber-400/30 bg-amber-500/5 p-2">
                <AlertDescription className="text-[9px] text-amber-300/80 flex items-center justify-between gap-1">
                  <span className="truncate">Upload {config.requiredDocuments[0]}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-5 text-[8px] px-1.5 border-amber-400/30 hover:bg-amber-500/10 text-amber-400 flex-shrink-0"
                    onClick={() => navigate("/documents")}
                  >
                    Upload
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            // LIVE MODE: Show real data
            <div className="flex-1 min-h-0">
              <ChartComponent 
                familyId={familyId}
                studentId={studentId}
                dateRange={dateRange}
                mode="live"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
