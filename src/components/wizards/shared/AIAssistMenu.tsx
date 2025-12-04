import { useState } from 'react';
import { Sparkles, Wand2, Lightbulb, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface AIAssistMenuProps {
  onAssist: (action: 'rewrite' | 'expand' | 'suggest', currentText: string) => Promise<string>;
  currentText: string;
  onUpdate: (newText: string) => void;
}

export const AIAssistMenu = ({ onAssist, currentText, onUpdate }: AIAssistMenuProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAction = async (action: 'rewrite' | 'expand' | 'suggest') => {
    setIsLoading(true);
    try {
      const result = await onAssist(action, currentText);
      onUpdate(result);
      toast({
        title: "AI Assist Complete",
        description: `Your text has been ${action === 'rewrite' ? 'rewritten' : action === 'expand' ? 'expanded' : 'generated'}.`,
      });
    } catch (error) {
      toast({
        title: "AI Assist Failed",
        description: error instanceof Error ? error.message : "Failed to process request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          AI Assist
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleAction('rewrite')}>
          <Wand2 className="mr-2 h-4 w-4" />
          Rewrite for Clarity
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('expand')}>
          <Lightbulb className="mr-2 h-4 w-4" />
          Expand with Detail
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('suggest')}>
          <Sparkles className="mr-2 h-4 w-4" />
          Suggest from Data
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
