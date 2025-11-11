import React, { useState } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DeleteMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messageId: string;
  onSuccess?: () => void;
}

export const DeleteMessageDialog = ({
  open,
  onOpenChange,
  messageId,
  onSuccess,
}: DeleteMessageDialogProps) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);

    try {
      // First check if user is currently banned
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: activeBan } = await supabase
          .from('user_bans')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .gt('expires_at', new Date().toISOString())
          .single();

        if (activeBan) {
          toast.error("Cannot delete message", {
            description: "Your account is currently restricted due to a policy violation.",
            duration: 5000,
          });
          setDeleting(false);
          onOpenChange(false);
          return;
        }
      }

      // Check if message is already AI-moderated
      const { data: message } = await supabase
        .from('messages')
        .select('is_deleted, deleted_by_ai')
        .eq('id', messageId)
        .single();

      if (message?.deleted_by_ai) {
        toast.error("Cannot delete message", {
          description: "This message was already removed by AI moderation and cannot be manually deleted.",
          duration: 5000,
        });
        setDeleting(false);
        onOpenChange(false);
        return;
      }

      const { error } = await supabase
        .from('messages')
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString(),
        })
        .eq('id', messageId);

      if (error) throw error;

      toast.success("Message deleted");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Error deleting message:', error);
      
      // Provide specific error messages
      if (error.message?.includes('permission denied') || error.code === '42501') {
        toast.error("Cannot delete message", {
          description: "You don't have permission to delete this message. It may have been flagged by moderation.",
          duration: 5000,
        });
      } else {
        toast.error("Failed to delete message");
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Message</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this message? This will replace the message content with "Message deleted" for all participants.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
