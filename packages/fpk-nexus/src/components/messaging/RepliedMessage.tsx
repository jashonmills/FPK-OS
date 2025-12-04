import React from "react";
import { Reply } from "lucide-react";

interface RepliedMessageProps {
  senderName: string;
  content: string;
  onClick?: () => void;
}

export const RepliedMessage = ({ senderName, content, onClick }: RepliedMessageProps) => {
  return (
    <div 
      className="bg-background/30 backdrop-blur-md border-l-4 border-primary/70 px-3 py-2 mb-1 text-sm cursor-pointer hover:bg-background/50 transition-all duration-300 rounded shadow-lg hover:shadow-xl shadow-primary/20 border border-border/30"
      onClick={onClick}
    >
      <div className="flex items-center gap-1 mb-1">
        <Reply className="w-3 h-3 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">
          {senderName}
        </span>
      </div>
      <div className="text-xs text-muted-foreground line-clamp-2">
        {content}
      </div>
    </div>
  );
};
