import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useFamily } from "@/contexts/FamilyContext";
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

export const CleanupOrphanedDocumentsButton = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const { toast } = useToast();
  const { selectedFamily } = useFamily();

  const handleCleanup = async () => {
    if (!selectedFamily?.id) return;

    setIsCleaningUp(true);
    try {
      const { data, error } = await supabase.functions.invoke("cleanup-orphaned-documents", {
        body: { family_id: selectedFamily.id },
      });

      if (error) throw error;

      toast({
        title: "Cleanup Complete",
        description: data.message,
      });

      if (data.deleted > 0) {
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error) {
      console.error("Cleanup error:", error);
      toast({
        title: "Cleanup Failed",
        description: error instanceof Error ? error.message : "Failed to cleanup documents",
        variant: "destructive",
      });
    } finally {
      setIsCleaningUp(false);
      setShowDialog(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setShowDialog(true)}
        disabled={isCleaningUp}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Clean Up Ghost Documents
      </Button>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clean Up Orphaned Documents?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove documents for students that no longer exist in your family (like deleted Jace Mills documents).
              Active student documents will NOT be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCleaningUp}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCleanup}
              disabled={isCleaningUp}
            >
              {isCleaningUp ? "Cleaning..." : "Clean Up Now"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};