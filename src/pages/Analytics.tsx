import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFamily } from "@/contexts/FamilyContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Activity, Brain, BookOpen, Users, Waves } from "lucide-react";
import { ChartGrid } from "@/components/analytics/ChartGrid";
import { TAB_ORDER, TAB_MANIFEST } from "@/config/tabManifest";

const TAB_ICONS = {
  overall: Activity,
  behavioral: Brain,
  academic: BookOpen,
  social: Users,
  sensory: Waves
};

const Analytics = () => {
  const { selectedFamily, selectedStudent } = useFamily();
  const [activeTab, setActiveTab] = useState("overall");

  // Early return if no student selected
  if (!selectedStudent) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select a student to view analytics.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Fetch critical metadata: subscription tier and unlocked charts
  const { data: userMeta, isLoading: isLoadingMeta } = useQuery({
    queryKey: ["user-analytics-meta", selectedFamily?.id],
    queryFn: async () => {
      if (!selectedFamily?.id) return null;

      // Get unlocked charts
      const { data: charts } = await supabase.rpc("get_available_specialized_charts", {
        p_family_id: selectedFamily.id
      });

      return {
        subscriptionTier: selectedFamily.subscription_tier || "free",
        unlockedCharts: charts?.map((c: any) => c.chart_identifier) || []
      };
    },
    enabled: !!selectedFamily?.id && !!selectedStudent?.id
  });

  // Show single page loader until metadata ready
  if (isLoadingMeta || !userMeta) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading Mission Control...</p>
        </div>
      </div>
    );
  }

  const dateRange = {
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  };

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-[#0A192F] via-[#112240] to-[#0A192F]">
      <div className="container mx-auto p-4 space-y-4">
        {/* Mission Control Header */}
        <div className="space-y-2 mb-6">
          <h1 className="text-4xl font-bold tracking-tight glow-text bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Analytics Mission Control
          </h1>
          <p className="text-cyan-300/70 text-sm">
            Comprehensive progress tracking for {selectedStudent.student_name}
          </p>
        </div>

        {/* Tabbed Cockpit */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="glass-card mb-4 h-auto p-2 bg-transparent border border-cyan-500/20">
            <div className="grid grid-cols-5 w-full gap-1">
              {TAB_ORDER.map((tabId) => {
                const tab = TAB_MANIFEST[tabId];
                const Icon = TAB_ICONS[tabId as keyof typeof TAB_ICONS];
                return (
                  <TabsTrigger
                    key={tabId}
                    value={tabId}
                    className="flex flex-col items-center gap-1 py-2 px-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 data-[state=active]:shadow-[0_0_15px_rgba(6,182,212,0.3)] rounded-md transition-all"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-[10px] font-medium">{tab.title}</span>
                  </TabsTrigger>
                );
              })}
            </div>
          </TabsList>

          {TAB_ORDER.map((tabId) => (
            <TabsContent key={tabId} value={tabId} className="mt-0">
              <ChartGrid
                tabId={tabId}
                familyId={selectedFamily!.id}
                studentId={selectedStudent.id}
                dateRange={dateRange}
                unlockedCharts={userMeta.unlockedCharts}
                subscriptionTier={userMeta.subscriptionTier}
                studentName={selectedStudent.student_name}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
