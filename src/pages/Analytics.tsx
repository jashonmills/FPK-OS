import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useFamily } from "@/contexts/FamilyContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Activity, Brain, BookOpen, Users, Waves, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DraggableChartGrid } from "@/components/analytics/DraggableChartGrid";
import { VideoBackground } from "@/components/analytics/VideoBackground";
import { TAB_ORDER, TAB_MANIFEST } from "@/config/tabManifest";

const TAB_ICONS = {
  overall: Activity,
  behavioral: Brain,
  academic: BookOpen,
  social: Users,
  sensory: Waves
};

const Analytics = () => {
  const navigate = useNavigate();
  const { selectedFamily, selectedStudent } = useFamily();
  const [activeTab, setActiveTab] = useState("overall");
  const [isExiting, setIsExiting] = useState(false);

  const handleExit = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate("/dashboard");
    }, 300);
  };

  // ESC key to exit
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleExit();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // Fetch critical metadata: subscription tier and unlocked charts
  // MUST be called before any conditional returns (Rules of Hooks)
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

  // Early return if no student selected (AFTER all hooks)
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
    <div className={`fixed inset-0 dark flex flex-col transition-opacity duration-300 ${isExiting ? 'opacity-0' : 'opacity-100'}`} style={{ zIndex: 9999 }}>
      {/* Layer 1: Full-Screen Video Background */}
      <VideoBackground />
      
      {/* Layer 2: UI Content */}
      {/* Exit Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-500/10"
        style={{ zIndex: 100 }}
        onClick={handleExit}
      >
        <X className="h-5 w-5" />
      </Button>

      <div className="flex-none px-4 pt-2 pb-1.5 relative" style={{ zIndex: 10 }}>
        {/* Compact Mission Control Header */}
        <div className="flex items-center justify-between mb-1.5">
          <div>
            <h1 className="text-lg font-bold tracking-tight glow-text bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Mission Control
            </h1>
            <p className="text-cyan-300/50 text-[8px]">
              {selectedStudent.student_name}
            </p>
          </div>
        </div>

        {/* Compact Tabbed Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="glass-card h-auto p-1 bg-transparent border border-cyan-500/20 w-full">
            <div className="grid grid-cols-5 w-full gap-0.5">
              {TAB_ORDER.map((tabId) => {
                const tab = TAB_MANIFEST[tabId];
                const Icon = TAB_ICONS[tabId as keyof typeof TAB_ICONS];
                return (
                  <TabsTrigger
                    key={tabId}
                    value={tabId}
                    className="flex flex-col items-center gap-0.5 py-1.5 px-1 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 data-[state=active]:shadow-[0_0_10px_rgba(6,182,212,0.3)] rounded text-cyan-300/60 data-[state=active]:font-semibold transition-all"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="text-[9px]">{tab.title.split(' ')[0]}</span>
                  </TabsTrigger>
                );
              })}
            </div>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab Content - fills remaining space */}
      <div className="flex-1 overflow-hidden px-4 pb-4 relative" style={{ zIndex: 10 }}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          {TAB_ORDER.map((tabId) => (
            <TabsContent key={tabId} value={tabId} className="h-full mt-0 data-[state=active]:flex data-[state=active]:flex-col">
              <DraggableChartGrid
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
