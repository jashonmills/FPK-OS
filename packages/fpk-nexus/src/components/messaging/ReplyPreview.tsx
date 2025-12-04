import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReplyPreviewProps {
  senderName: string;
  content: string;
  onCancel: () => void;
}

export const ReplyPreview = ({ senderName, content, onCancel }: ReplyPreviewProps) => {
  return (
    <div className="bg-background/40 backdrop-blur-xl border-l-4 border-primary px-3 py-2 mb-2 flex items-start justify-between gap-2 rounded-r-lg shadow-xl shadow-primary/30 transition-all duration-300 border border-border/30 border-l-primary">
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-primary mb-1">
          Replying to {senderName}
        </div>
        <div className="text-sm text-muted-foreground truncate">
          {content}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 flex-shrink-0"
        onClick={onCancel}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};
