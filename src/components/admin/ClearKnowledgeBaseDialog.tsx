import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

interface ClearKnowledgeBaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ClearKnowledgeBaseDialog({
  open,
  onOpenChange,
  onConfirm,
}: ClearKnowledgeBaseDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const isConfirmed = confirmText === "DELETE";

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm();
      setConfirmText("");
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Clear Entire Knowledge Base?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p className="font-semibold">
              This will permanently delete:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>All knowledge base documents</li>
              <li>All embeddings and chunks</li>
              <li>All AI knowledge from scraped sources</li>
            </ul>
            <p className="text-destructive font-medium">
              ⚠️ This action cannot be undone!
            </p>
            <div className="space-y-2 pt-4">
              <Label htmlFor="confirm-text">
                Type <span className="font-mono font-bold">DELETE</span> to confirm
              </Label>
              <Input
                id="confirm-text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type DELETE here"
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
            onClick={handleConfirm}
            disabled={!isConfirmed}
            className="bg-destructive hover:bg-destructive/90"
          >
            Delete Everything
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
