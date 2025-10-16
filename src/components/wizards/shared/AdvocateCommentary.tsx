import { Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AdvocateCommentaryProps {
  what: string;
  why: string;
  how: string;
}

export const AdvocateCommentary = ({ what, why, how }: AdvocateCommentaryProps) => {
  return (
    <Alert className="bg-primary/5 border-primary/20 mb-6">
      <Info className="h-5 w-5 text-primary" />
      <AlertTitle className="text-primary font-semibold mb-2">Your Advocate's Guide</AlertTitle>
      <AlertDescription className="space-y-2 text-sm">
        <div>
          <span className="font-medium text-foreground">What:</span> {what}
        </div>
        <div>
          <span className="font-medium text-foreground">Why:</span> {why}
        </div>
        <div>
          <span className="font-medium text-foreground">How:</span> {how}
        </div>
      </AlertDescription>
    </Alert>
  );
};
