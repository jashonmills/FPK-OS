import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useFamily } from "@/contexts/FamilyContext";

export const ResetAnalysisCard = () => {
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showReanalyzeDialog, setShowReanalyzeDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const { toast } = useToast();
  const { selectedFamily } = useFamily();

  const handleReset = async () => {
    if (!selectedFamily?.id) return;

    setIsResetting(true);
    try {
      const { data, error } = await supabase.functions.invoke("reset-analysis", {
        body: { family_id: selectedFamily.id },
      });

      if (error) throw error;

      toast({
        title: "Analysis Data Reset",
        description: "All AI-generated analysis data has been cleared. You can now re-upload documents for fresh analysis.",
      });

      // Reload the page to reflect the clean state
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error("Reset error:", error);
      toast({
        title: "Reset Failed",
        description: error instanceof Error ? error.message : "Failed to reset analysis data",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
      setShowResetDialog(false);
    }
  };

  const handleReanalyze = async () => {
    if (!selectedFamily?.id) return;

    setIsReanalyzing(true);
    try {
      // Step 1: Clean up orphaned documents first
      toast({
        title: "Cleaning Up Ghost Documents",
        description: "Removing documents from deleted students...",
      });

      const { error: cleanupError } = await supabase.functions.invoke("cleanup-orphaned-documents", {
        body: { family_id: selectedFamily.id },
      });

      if (cleanupError) {
        console.error("Cleanup error:", cleanupError);
        toast({
          title: "Cleanup Failed",
          description: "Failed to remove orphaned documents. Aborting re-analysis.",
          variant: "destructive",
        });
        return;
      }

      // Step 2: Clear all old analysis data
      toast({
        title: "Clearing Old Data",
        description: "Removing old metrics, insights, and chart mappings...",
      });

      const { error: clearError } = await supabase.functions.invoke("clear-family-data", {
        body: { family_id: selectedFamily.id },
      });

      if (clearError) {
        console.error("Clear error:", clearError);
        toast({
          title: "Clear Failed",
          description: "Failed to clear old data. Aborting re-analysis.",
          variant: "destructive",
        });
        return;
      }

      // Wait for clearing to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 3: Re-analyze remaining documents
      toast({
        title: "Re-Analyzing Documents",
        description: "Processing documents with improved AI prompts...",
      });

      const { data, error } = await supabase.functions.invoke("re-analyze-all-documents", {
        body: { family_id: selectedFamily.id },
      });

      if (error) throw error;

      toast({
        title: "Deep Re-Analysis Complete",
        description: `Successfully re-analyzed ${data.successful} of ${data.total_documents} documents with improved prompts.`,
      });

      // Reload to show new data
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error("Re-analysis error:", error);
      toast({
        title: "Re-Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to re-analyze documents",
        variant: "destructive",
      });
    } finally {
      setIsReanalyzing(false);
      setShowReanalyzeDialog(false);
    }
  };


  return (
    <>
      <div className="space-y-4">
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Deep Re-Analysis (Recommended)
            </CardTitle>
            <CardDescription>
              Re-extract data from existing documents with improved prompts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <p className="font-medium">This will:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                <li>Clear old metrics, insights, and chart mappings</li>
                <li>Re-analyze ALL uploaded documents using strengthened AI prompts</li>
                <li>Extract proper numeric values for chart population</li>
                <li>Preserve historical measurement dates for "time machine" view</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">
                ✅ This fixes NULL metric values and enables all-time historical chart views
              </p>
            </div>
            <Button
              variant="default"
              onClick={() => setShowReanalyzeDialog(true)}
              disabled={isReanalyzing}
              className="w-full"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isReanalyzing ? 'animate-spin' : ''}`} />
              {isReanalyzing ? "Re-analyzing Documents..." : "Run Deep Re-Analysis"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Reset Analysis Data
            </CardTitle>
            <CardDescription>
              Clear all AI-generated insights and metrics to start fresh
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <p className="font-medium">This will permanently delete:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                <li>All document metrics</li>
                <li>All AI insights</li>
                <li>All progress tracking records</li>
                <li>All imported goals</li>
                <li>All chart mappings</li>
              </ul>
              <p className="font-medium mt-4">This will NOT delete:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                <li>Student profiles</li>
                <li>Uploaded documents</li>
                <li>Activity logs (parent, educator, incident)</li>
                <li>Manually created goals</li>
              </ul>
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowResetDialog(true)}
              disabled={isResetting}
              className="w-full"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Reset All Analysis Data
            </Button>
          </CardContent>
        </Card>

      </div>

      <AlertDialog open={showReanalyzeDialog} onOpenChange={setShowReanalyzeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Run Deep Re-Analysis?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                This will automatically clean up ghost documents from deleted students, clear all old analysis data, then re-analyze your current documents.
              </p>
              <p className="font-medium text-foreground">
                This process may take 1-2 minutes.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isReanalyzing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReanalyze}
              disabled={isReanalyzing}
            >
              {isReanalyzing ? "Re-analyzing..." : "Yes, Re-Analyze All Documents"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                This action cannot be undone. This will permanently delete all AI-generated analysis data for your family.
              </p>
              <p className="font-medium text-foreground">
                Your documents will remain, but you'll need to re-upload them or manually trigger re-analysis to regenerate insights.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isResetting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              disabled={isResetting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isResetting ? "Resetting..." : "Yes, Reset Everything"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  );
};
