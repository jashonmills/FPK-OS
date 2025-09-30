import { Button } from '@/components/ui/button';
import { Target, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SocraticModeToggleProps {
  enabled: boolean;
  onToggle: () => void;
  sessionActive?: boolean;
  averageScore?: number;
}

export function SocraticModeToggle({ 
  enabled, 
  onToggle, 
  sessionActive, 
  averageScore 
}: SocraticModeToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={enabled ? "default" : "outline"}
        size="sm"
        onClick={onToggle}
        className="gap-2"
      >
        {enabled ? <Target className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
        {enabled ? 'Structured Mode' : 'Free Chat'}
      </Button>
      
      {sessionActive && (
        <Badge variant="secondary" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Session Active
          {averageScore !== undefined && ` • Avg: ${averageScore.toFixed(1)}`}
        </Badge>
      )}
    </div>
  );
}
