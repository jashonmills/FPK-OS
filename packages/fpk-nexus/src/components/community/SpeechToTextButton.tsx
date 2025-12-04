import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { SpeechToTextDialog } from "./SpeechToTextDialog";

interface SpeechToTextButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export const SpeechToTextButton = ({ onTranscript, className }: SpeechToTextButtonProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setDialogOpen(true)}
        className={cn("transition-smooth", className)}
        title="Start speech-to-text"
      >
        <Mic className="h-4 w-4" />
      </Button>

      <SpeechToTextDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={onTranscript}
      />
    </>
  );
};
