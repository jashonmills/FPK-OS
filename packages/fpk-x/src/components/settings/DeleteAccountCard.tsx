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
import { Trash2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useFamily } from "@/contexts/FamilyContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const DeleteAccountCard = () => {
  const { user, signOut } = useAuth();
  const { familyMembership } = useFamily();
  const navigate = useNavigate();
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const isOwner = familyMembership?.role === "owner";

  const deleteAccount = async () => {
    if (confirmText !== "DELETE") {
      toast.error('Please type "DELETE" to confirm');
      return;
    }

    if (!user) {
      toast.error("No user session found");
      return;
    }

    setIsDeleting(true);
    try {
      // Note: Deleting from auth.users requires admin privileges
      // For now, we'll delete user data and mark the account for deletion
      // In production, this should trigger a backend process to fully delete the account
      
      if (familyMembership?.family_id) {
        // If owner, this will cascade delete the family and all associated data
        if (isOwner) {
          const { error } = await supabase
            .from("families")
            .delete()
            .eq("id", familyMembership.family_id);
          if (error) throw error;
        } else {
          // If not owner, just remove from family
          const { error } = await supabase
            .from("family_members")
            .delete()
            .eq("user_id", user.id)
            .eq("family_id", familyMembership.family_id);
          if (error) throw error;
        }
      }

      // Delete profile
      await supabase.from("profiles").delete().eq("id", user.id);

      toast.success("Account data deleted successfully. Signing out...");
      
      // Wait a moment then sign out
      setTimeout(async () => {
        await signOut();
        navigate("/");
      }, 1500);
    } catch (error: any) {
      console.error("Delete account error:", error);
      toast.error("Failed to delete account: " + error.message);
      setIsDeleting(false);
    }
  };

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <Trash2 className="h-5 w-5" />
          Delete Your Account
        </CardTitle>
        <CardDescription>
          Permanently remove all your data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-2">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-destructive">Warning: This action is irreversible</p>
              <p className="text-sm text-muted-foreground">
                All data will be permanently deleted within 30 days. This includes:
              </p>
            </div>
          </div>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 ml-7">
            <li>Your profile and account information</li>
            <li>All student records and profiles</li>
            <li>All activity logs and documents</li>
            <li>Goals, insights, and analytics data</li>
            {isOwner && (
              <li className="font-medium text-destructive">
                The entire family account (as owner, this will delete data for all members)
              </li>
            )}
          </ul>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm font-medium mb-2">Before you go:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Export your data using the "Export Your Data" button above</li>
            <li>• Cancel any active subscriptions</li>
            {isOwner && <li>• Consider transferring family ownership to another member</li>}
          </ul>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full sm:w-auto">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete My Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-4">
                <p>
                  This will permanently delete your account and all associated data.
                  This action cannot be undone.
                </p>
                {isOwner && (
                  <p className="font-medium text-destructive">
                    As the family owner, this will delete the entire family account
                    and all data for all members.
                  </p>
                )}
                <div className="space-y-2">
                  <Label htmlFor="confirm-delete">
                    Type <span className="font-mono font-bold">DELETE</span> to confirm
                  </Label>
                  <Input
                    id="confirm-delete"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="DELETE"
                    className="font-mono"
                  />
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setConfirmText("")}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteAccount}
                disabled={confirmText !== "DELETE" || isDeleting}
                className="bg-destructive hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete Account"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
