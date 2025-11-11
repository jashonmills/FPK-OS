import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { checkProfanity } from "@/utils/profanityFilter";

interface EditMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messageId: string;
  currentContent: string;
  onSuccess?: () => void;
}

export const EditMessageDialog = ({
  open,
  onOpenChange,
  messageId,
  currentContent,
  onSuccess,
}: EditMessageDialogProps) => {
  const [content, setContent] = useState(currentContent);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!content.trim() || content === currentContent) {
      onOpenChange(false);
      return;
    }

    setSaving(true);

    try {
      // Client-side profanity check
      const profanityCheck = checkProfanity(content.trim());
      if (!profanityCheck.isClean) {
        toast.error("Message blocked", {
          description: profanityCheck.reason || "Your message contains inappropriate content.",
          duration: 5000,
        });
        setSaving(false);
        return;
      }

      // Check if user is currently banned
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
          toast.error("Cannot edit message", {
            description: "Your account is currently restricted due to a policy violation.",
            duration: 5000,
          });
          setSaving(false);
          onOpenChange(false);
          return;
        }
      }

      // Check if message is AI-moderated
      const { data: message } = await supabase
        .from('messages')
        .select('is_deleted, deleted_by_ai')
        .eq('id', messageId)
        .single();

      if (message?.deleted_by_ai) {
        toast.error("Cannot edit message", {
          description: "This message was removed by AI moderation and cannot be edited.",
          duration: 5000,
        });
        setSaving(false);
        onOpenChange(false);
        return;
      }

      const { error } = await supabase
        .from('messages')
        .update({
          content: content.trim(),
          is_edited: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', messageId);

      if (error) throw error;

      toast.success("Message updated");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Error updating message:', error);
      
      if (error.message?.includes('permission denied') || error.code === '42501') {
        toast.error("Cannot edit message", {
          description: "You don't have permission to edit this message. It may have been flagged by moderation.",
          duration: 5000,
        });
      } else {
        toast.error("Failed to update message");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Message</DialogTitle>
          <DialogDescription>
            Make changes to your message. Press save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your message..."
          className="min-h-[100px]"
          disabled={saving}
        />
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !content.trim()}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
