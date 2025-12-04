// src/pages/Analytics.tsx

import { S3TestUploader } from "@/components/analytics/S3TestUploader";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFamily } from "@/contexts/FamilyContext";
import { useClient } from "@/hooks/useClient";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoBackground } from "@/components/analytics/VideoBackground";
import { ExtractedMetricsViewer } from "@/components/analytics/ExtractedMetricsViewer";
import { BatchExtractTrigger } from "@/components/analytics/BatchExtractTrigger";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";
// +++ Importing our newly FORGED Athena component +++
import { IntelligentChartGrid } from "@/components/analytics/IntelligentChartGrid";

const Analytics = () => {
  const navigate = useNavigate();
  const { selectedStudent } = useFamily();
  const { selectedClient, isNewModel } = useClient();
  const queryClient = useQueryClient();

  const handleExit = () => {
    navigate("/dashboard");
  };

  // ... (rest of the component logic is unchanged) ...
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleExit();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const targetId = isNewModel && selectedClient ? selectedClient.id : selectedStudent?.id;

  if (!targetId) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select a {isNewModel ? 'client' : 'student'} to view analytics.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isNewModel || !selectedClient) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Analytics dashboard is available for clients using the new data model.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <VideoBackground />

      {/* +++ RELOCATED TEST COMPONENT FOR GUARANTEED VISIBILITY +++ */}
      <div className="relative z-20 p-4">
        <S3TestUploader />
      </div>
      
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={handleExit}
          variant="secondary"
          size="icon"
          className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2 text-foreground">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Track progress and activity for {selectedClient.client_name}
            </p>
          </div>

          <Tabs defaultValue="charts" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="charts">Intelligent Charts</TabsTrigger>
              <TabsTrigger value="ai-data">AI-Extracted Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="charts">
              {/* === The Forged Athena Grid is now in command === */}
              <IntelligentChartGrid clientId={selectedClient.id} />
            </TabsContent>
            
            <TabsContent value="ai-data">
              <div className="space-y-6">
                <BatchExtractTrigger 
                  clientId={selectedClient.id}
                  onComplete={() => {
                    queryClient.invalidateQueries({ queryKey: ['extracted-metrics'] });
                  }}
                />
                <ExtractedMetricsViewer clientId={selectedClient.id} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
