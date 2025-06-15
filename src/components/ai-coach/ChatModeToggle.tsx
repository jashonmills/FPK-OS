
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
  const isMobile = useIsMobile();

  const modes = [
    {
      value: 'personal' as const,
      label: 'My Data',
      icon: Lock,
      tooltip: 'Answer only from your study data',
      badge: 'Personal Data Active',
      badgeColor: 'bg-green-500/90'
    },
    {
      value: 'general' as const,
      label: 'General Knowledge',
      icon: Globe,
      tooltip: 'Answer broad questions via external APIs',
      badge: 'Web Tools Active',
      badgeColor: 'bg-blue-500/90'
    }
  ];

  const currentMode = modes.find(m => m.value === mode)!;

  // Mobile dropdown version
  if (isMobile) {
    return (
      <TooltipProvider>
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={cn("text-white hover:bg-white/20 gap-2", className)}
                >
                  <currentMode.icon className="h-3 w-3" />
                  <span className="truncate max-w-20">{currentMode.label}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>{currentMode.tooltip}</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end" className="w-48">
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
  }

  // Desktop segmented control version
  return (
    <TooltipProvider>
      <div className={cn("flex bg-white/10 rounded-lg p-1 gap-1", className)}>
        {modes.map((modeOption) => (
          <Tooltip key={modeOption.value}>
            <TooltipTrigger asChild>
              <Button
                variant={mode === modeOption.value ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onModeChange(modeOption.value)}
                className={cn(
                  "flex items-center gap-1.5 text-xs transition-all duration-200",
                  mode === modeOption.value 
                    ? "bg-white text-purple-600 hover:bg-white/90 shadow-sm" 
                    : "text-white hover:bg-white/20"
                )}
              >
                <modeOption.icon className="h-3 w-3" />
                <span className="hidden sm:inline">{modeOption.label}</span>
                <span className="sm:hidden">
                  {modeOption.value === 'personal' ? '🔒' : '🌐'}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{modeOption.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default ChatModeToggle;
