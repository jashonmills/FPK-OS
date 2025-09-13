
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Lock, Globe, ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export type ChatMode = 'personal' | 'general';

interface ChatModeToggleProps {
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  className?: string;
}

const ChatModeToggle: React.FC<ChatModeToggleProps> = ({
  mode,
  onModeChange,
  className
}) => {
  const modes = [
    {
      value: 'general' as const,
      label: 'General & Platform Guide',
      icon: Globe,
      tooltip: 'Platform help and general knowledge',
      badge: 'Smart Mode Active',
      badgeColor: 'bg-blue-500/90'
    },
    {
      value: 'personal' as const,
      label: 'My Data',
      icon: Lock,
      tooltip: 'Answer only from your study data',
      badge: 'Personal Data Active',
      badgeColor: 'bg-green-500/90'
    }
  ];

  const currentMode = modes.find(m => m.value === mode) || modes[0];

  // Always use dropdown version
  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className={cn("gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 min-w-0 w-full sm:w-auto max-w-full justify-between sm:justify-start", className)}
              >
                <currentMode.icon className="h-3 w-3" />
                <span className="truncate">{currentMode.label}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>{currentMode.tooltip}</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800">
          {modes.map((modeOption) => (
            <DropdownMenuItem
              key={modeOption.value}
              onClick={() => onModeChange(modeOption.value)}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                mode === modeOption.value && "bg-accent"
              )}
            >
              <modeOption.icon className="h-4 w-4" />
              <span>{modeOption.label}</span>
              {mode === modeOption.value && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  Active
                </Badge>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
};

export default ChatModeToggle;
