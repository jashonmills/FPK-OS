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
  const [showDialog, setShowDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
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
      setShowDialog(false);
    }
  };

  return (
    <>
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
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
            onClick={() => setShowDialog(true)}
            disabled={isResetting}
            className="w-full"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Reset All Analysis Data
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
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
