import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface AdminCopilotWidgetProps {
  onClick: () => void;
  hasUnread?: boolean;
}

export function AdminCopilotWidget({ onClick, hasUnread }: AdminCopilotWidgetProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            size="lg"
            className={cn(
              "h-14 w-14 rounded-full shadow-lg",
              "bg-gradient-to-br from-primary to-primary/80",
              "hover:from-primary/90 hover:to-primary/70",
              "transition-all duration-300 hover:scale-105",
              "flex items-center justify-center",
              hasUnread && "animate-pulse"
            )}
          >
            <Bot className="h-6 w-6 text-primary-foreground" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-card border-border">
          <p className="font-medium">Admin AI Co-pilot</p>
          <p className="text-xs text-muted-foreground">Ask me anything about your organization</p>
        </TooltipContent>
      </Tooltip>
      
      {/* Pulse ring effect */}
      <div className="absolute inset-0 -z-10 animate-ping rounded-full bg-primary/20 opacity-75" 
           style={{ animationDuration: '3s' }} />
    </div>
  );
}
