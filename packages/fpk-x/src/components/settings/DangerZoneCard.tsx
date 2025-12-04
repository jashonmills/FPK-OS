import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skull, AlertTriangle } from "lucide-react";
import { useFamily } from "@/contexts/FamilyContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const DangerZoneCard = () => {
  const { selectedFamily, familyMembership, refreshFamilies } = useFamily();
  const navigate = useNavigate();
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const isOwner = familyMembership?.role === "owner";

  if (!isOwner || !selectedFamily) {
    return null;
  }

  const handleDeleteFamily = async () => {
    if (confirmText !== selectedFamily.family_name) {
      toast.error(`Please type the exact family name: "${selectedFamily.family_name}"`);
      return;
    }

    setIsDeleting(true);
    try {
      console.log('🗑️ Invoking hard-delete-family function...');

      const { data, error } = await supabase.functions.invoke('hard-delete-family', {
        body: { family_id: selectedFamily.id },
      });

      if (error) throw error;

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to delete family');
      }

      console.log('✅ Family deleted successfully:', data);

      toast.success('Family deleted permanently', {
        description: `All data for ${selectedFamily.family_name} has been erased.`,
      });

      // Wait a moment then redirect to onboarding
      setTimeout(() => {
        navigate('/onboarding');
      }, 2000);
    } catch (error: any) {
      console.error('Delete family error:', error);
      toast.error('Failed to delete family', {
        description: error.message || 'An unexpected error occurred',
      });
      setIsDeleting(false);
    }
  };

  return (
    <Card className="border-destructive bg-destructive/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <Skull className="h-5 w-5" />
          Danger Zone
        </CardTitle>
        <CardDescription className="text-destructive/80">
          Irreversible actions that will permanently delete data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-destructive/10 border-2 border-destructive/30 rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-destructive mt-0.5 flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <p className="text-sm font-bold text-destructive">
                ⚠️ PERMANENT DELETION WARNING
              </p>
              <p className="text-sm text-foreground/90 font-medium">
                This action will <span className="underline">immediately and permanently</span> delete:
              </p>
              <ul className="text-sm text-foreground/80 list-disc list-inside space-y-1 ml-2">
                <li>All students in <span className="font-semibold">{selectedFamily.family_name}</span></li>
                <li>All documents and uploaded files</li>
                <li>All activity logs, incident reports, and observations</li>
                <li>All goals, insights, and analytics data</li>
                <li>All progress tracking and metrics</li>
                <li>All family members and their access</li>
                <li className="font-bold text-destructive">Everything related to this family account</li>
              </ul>
              <p className="text-sm font-bold text-destructive mt-3">
                ⛔ This CANNOT be undone. There is NO recovery option.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-muted/70 rounded-lg p-4 border border-border">
          <p className="text-sm font-semibold mb-2">📥 Before deleting, make sure you:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>✓ Exported all important data</li>
            <li>✓ Saved copies of documents and reports</li>
            <li>✓ Notified all family members</li>
            <li>✓ Understand this action is final and irreversible</li>
          </ul>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full font-bold" size="lg">
              <Skull className="h-5 w-5 mr-2" />
              Delete "{selectedFamily.family_name}" Forever
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-lg">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-6 w-6" />
                Final Confirmation Required
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-4 text-left">
                <div className="bg-destructive/10 border border-destructive/30 rounded p-3">
                  <p className="text-destructive font-bold text-sm mb-2">
                    ⚠️ YOU ARE ABOUT TO PERMANENTLY DELETE:
                  </p>
                  <p className="text-destructive font-semibold text-base">
                    {selectedFamily.family_name}
                  </p>
                </div>

                <p className="text-sm font-medium">
                  All data, documents, logs, and files for this family will be{" "}
                  <span className="font-bold text-destructive">immediately and permanently erased</span>.
                </p>

                <p className="text-sm font-bold text-destructive">
                  This action CANNOT be reversed. There is NO way to recover the data.
                </p>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="confirm-family-name" className="text-sm font-semibold">
                    Type the exact family name to confirm:{" "}
                    <span className="font-mono font-bold text-destructive">
                      {selectedFamily.family_name}
                    </span>
                  </Label>
                  <Input
                    id="confirm-family-name"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder={selectedFamily.family_name}
                    className="font-mono border-destructive/50 focus:border-destructive"
                    autoComplete="off"
                  />
                  <p className="text-xs text-muted-foreground">
                    Case-sensitive. Must match exactly.
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel 
                onClick={() => setConfirmText("")}
                className="w-full sm:w-auto"
              >
                Cancel (Keep Family)
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteFamily}
                disabled={confirmText !== selectedFamily.family_name || isDeleting}
                className="bg-destructive hover:bg-destructive/90 w-full sm:w-auto font-bold"
              >
                {isDeleting ? (
                  <>
                    <Skull className="h-4 w-4 mr-2 animate-pulse" />
                    Deleting Permanently...
                  </>
                ) : (
                  <>
                    <Skull className="h-4 w-4 mr-2" />
                    DELETE PERMANENTLY
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
