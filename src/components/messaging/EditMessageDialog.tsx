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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { checkProfanity } from "@/utils/profanityFilter";
import { CaptionFormatting, CaptionStyle, getCaptionStyles } from "./CaptionFormatting";

interface EditMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messageId: string;
  currentContent: string;
  currentCaption?: string | null;
  currentCaptionStyle?: CaptionStyle | null;
  hasImage?: boolean;
  onSuccess?: () => void;
}

export const EditMessageDialog = ({
  open,
  onOpenChange,
  messageId,
  currentContent,
  currentCaption,
  currentCaptionStyle,
  hasImage,
  onSuccess,
}: EditMessageDialogProps) => {
  const [content, setContent] = useState(currentContent);
  const [caption, setCaption] = useState(currentCaption || "");
  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>(
    currentCaptionStyle || { fontFamily: "inter", fontSize: "base", color: "#000000" }
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const contentChanged = content.trim() !== currentContent;
    const captionChanged = hasImage && (
      caption !== (currentCaption || "") ||
      JSON.stringify(captionStyle) !== JSON.stringify(currentCaptionStyle || {})
    );
    
    if (!contentChanged && !captionChanged) {
      onOpenChange(false);
      return;
    }

    if (content.trim() === "" && !hasImage) {
      toast.error("Message content cannot be empty");
      return;
    }

    setSaving(true);

    try {
      // Client-side profanity check for content
      if (content.trim()) {
        const profanityCheck = checkProfanity(content.trim());
        if (!profanityCheck.isClean) {
          toast.error("Message blocked", {
            description: profanityCheck.reason || "Your message contains inappropriate content.",
            duration: 5000,
          });
          setSaving(false);
          return;
        }
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

      const updateData: any = {
        is_edited: true,
        updated_at: new Date().toISOString(),
      };

      if (contentChanged) {
        updateData.content = content.trim() || null;
      }

      if (captionChanged) {
        updateData.image_caption = caption.trim() || null;
        updateData.caption_style = caption.trim() ? captionStyle : null;
      }

      const { error } = await supabase
        .from('messages')
        .update(updateData)
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
            Make changes to your message{hasImage ? " or image caption" : ""}. Press save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="message-content">Message Content</Label>
            <Textarea
              id="message-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message..."
              className="min-h-[100px] mt-2"
              disabled={saving}
            />
          </div>
          {hasImage && (
            <div className="flex flex-col gap-2">
              <div>
                <Label htmlFor="image-caption">Image Caption (optional)</Label>
                <Input
                  id="image-caption"
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add or edit caption..."
                  maxLength={200}
                  className="mt-2"
                  disabled={saving}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {caption.length}/200 characters
                </p>
              </div>
              
              {caption && (
                <>
                  <CaptionFormatting
                    style={captionStyle}
                    onStyleChange={setCaptionStyle}
                    showTemplates={true}
                  />
                  <div className="p-3 border rounded-lg bg-background">
                    <Label className="text-xs text-muted-foreground mb-2 block">Preview:</Label>
                    <p style={getCaptionStyles(captionStyle)}>{caption}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving || (content.trim() === "" && !hasImage)}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
