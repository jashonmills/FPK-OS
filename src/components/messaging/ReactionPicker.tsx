import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";

interface ReactionPickerProps {
  onSelect: (emoji: string) => void;
}

const COMMON_EMOJIS = [
  "👍", "❤️", "😂", "😮", "😢", "😡",
  "🎉", "🔥", "💯", "👏", "🙌", "✨"
];

export const ReactionPicker = ({ onSelect }: ReactionPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 opacity-60 hover:opacity-100 group-hover:opacity-100 transition-all hover:bg-accent/50"
          title="Add reaction"
        >
          <Smile className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3 bg-card/95 backdrop-blur-xl border-border/50 shadow-xl">
        <div className="grid grid-cols-6 gap-2">
          {COMMON_EMOJIS.map((emoji) => (
            <Button
              key={emoji}
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 text-xl hover:bg-primary/20 hover:scale-110 transition-all rounded-lg"
              onClick={() => onSelect(emoji)}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
