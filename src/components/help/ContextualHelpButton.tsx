import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useHelp } from '@/contexts/HelpContext';

interface ContextualHelpButtonProps {
  articleSlug: string;
  summary?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const ContextualHelpButton = ({
  articleSlug,
  summary,
  position = 'bottom',
}: ContextualHelpButtonProps) => {
  const { openHelpCenter } = useHelp();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side={position} className="w-80">
        {summary && <p className="text-sm mb-3">{summary}</p>}
        <Button
          variant="link"
          className="p-0 h-auto"
          onClick={() => openHelpCenter(articleSlug)}
        >
          Learn More →
        </Button>
      </PopoverContent>
    </Popover>
  );
};
