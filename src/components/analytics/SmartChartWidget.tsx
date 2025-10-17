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
    "glass-card rounded-lg transition-all duration-300 relative overflow-hidden",
    finalMode === "live" && "chart-live border-primary shadow-[0_0_15px_hsl(var(--primary)/0.3)]",
    finalMode === "demo" && "border-amber-500/50 shadow-[0_0_15px_hsl(45_100%_50%/0.2)]",
    finalMode === "locked" && "border-purple-500/50 shadow-[0_0_15px_hsl(270_80%_65%/0.2)]"
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
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                {config.title}
                {finalMode === "live" && (
                  <Badge variant="default" className="bg-primary/20 text-primary border-primary/30 animate-pulse">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Live Data
                  </Badge>
                )}
                {finalMode === "demo" && (
                  <Badge variant="outline" className="border-amber-500/50 text-amber-600 dark:text-amber-400">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Sample Data
                  </Badge>
                )}
                {finalMode === "locked" && (
                  <Badge variant="outline" className="border-purple-500/50 text-purple-600 dark:text-purple-400">
                    <Lock className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                {config.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading && hasSubscription ? (
            <div className="space-y-3">
              <Skeleton className="h-[200px] w-full" />
            </div>
          ) : finalMode === "locked" ? (
            // LOCKED MODE: Show blurred preview with upgrade CTA
            <div className="relative min-h-[200px]">
              <div className="absolute inset-0 backdrop-blur-sm bg-background/60 z-10 flex items-center justify-center rounded-lg">
                <div className="text-center space-y-4 p-6 max-w-md">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <Lock className="h-8 w-8 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-bold">Premium Feature</h3>
                  <p className="text-sm text-muted-foreground">
                    Unlock {config.title} with a {config.subscriptionTier === "pro" ? "Pro" : "Team"} plan
                  </p>
                  <Button 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    onClick={() => navigate("/pricing")}
                  >
                    Upgrade to Unlock →
                  </Button>
                </div>
              </div>
              {/* Blurred preview */}
              <div className="blur-md opacity-30 pointer-events-none">
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
            // DEMO MODE: Show mock data with upload CTA
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none z-10" />
                <ChartComponent 
                  familyId={familyId}
                  studentId={studentId}
                  dateRange={dateRange}
                  sampleData={mockData}
                  mode="demo"
                />
              </div>
              <Alert className="border-amber-500/50 bg-amber-500/10">
                <Upload className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-900 dark:text-amber-100">
                  Unlock Real Data
                </AlertTitle>
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                  Upload <strong>{config.requiredDocuments[0]}</strong> to see {studentName}'s actual progress here.
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 border-amber-500/50 hover:bg-amber-500/10"
                    onClick={() => navigate("/documents")}
                  >
                    Upload Documents →
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            // LIVE MODE: Show real data
            <ChartComponent 
              familyId={familyId}
              studentId={studentId}
              dateRange={dateRange}
              mode="live"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
