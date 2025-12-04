import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AIBlockersCardProps {
  blockers: string;
  onClose: () => void;
}

export const AIBlockersCard = ({ blockers, onClose }: AIBlockersCardProps) => {
  return (
    <Alert className="bg-destructive/5 border-destructive/20">
      <div className="flex items-start justify-between gap-2">
        <AlertDescription className="flex-1 text-sm whitespace-pre-wrap">
          {blockers}
        </AlertDescription>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={onClose}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </Alert>
  );
};
