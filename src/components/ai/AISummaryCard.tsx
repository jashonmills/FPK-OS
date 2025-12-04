import { Copy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface AISummaryCardProps {
  summary: string;
  onClose: () => void;
}

export const AISummaryCard = ({ summary, onClose }: AISummaryCardProps) => {
  const { toast } = useToast();

  const copySummary = () => {
    navigator.clipboard.writeText(summary);
    toast({
      title: "Copied to clipboard",
      description: "Summary has been copied",
    });
  };

  return (
    <Alert className="bg-primary/5 border-primary/20">
      <div className="flex items-start justify-between gap-2">
        <AlertDescription className="flex-1 text-sm">
          {summary}
        </AlertDescription>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={copySummary}
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={onClose}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Alert>
  );
};
