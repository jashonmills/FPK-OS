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
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Smile className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="grid grid-cols-6 gap-1">
          {COMMON_EMOJIS.map((emoji) => (
            <Button
              key={emoji}
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 text-xl hover:bg-accent"
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
