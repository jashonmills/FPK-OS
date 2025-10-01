import { Button } from '@/components/ui/button';
import { GraduationCap, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export type AdminMode = 'educational' | 'org_data';

interface AdminModeToggleProps {
  mode: AdminMode;
  onModeChange: (mode: AdminMode) => void;
  className?: string;
}

export function AdminModeToggle({ mode, onModeChange, className }: AdminModeToggleProps) {
  const modes = [
    {
      value: 'educational' as AdminMode,
      label: 'Educational Assistant',
      icon: GraduationCap,
      tooltip: 'General educational knowledge and curriculum support',
      badge: 'Knowledge',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    },
    {
      value: 'org_data' as AdminMode,
      label: 'Org Assistant',
      icon: BarChart3,
      tooltip: 'Organization data analysis and management',
      badge: 'Data',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    }
  ];

  const currentMode = modes.find(m => m.value === mode) || modes[0];

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className={`gap-2 ${className}`}
              >
                <currentMode.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{currentMode.label}</span>
                <Badge variant="secondary" className={`text-xs ${currentMode.badgeColor}`}>
                  {currentMode.badge}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>{currentMode.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="end" className="w-64">
        {modes.map((modeOption) => (
          <DropdownMenuItem
            key={modeOption.value}
            onClick={() => onModeChange(modeOption.value)}
            className="flex items-center gap-3 py-3 cursor-pointer"
          >
            <modeOption.icon className="h-5 w-5" />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{modeOption.label}</span>
                <Badge variant="secondary" className={`text-xs ${modeOption.badgeColor}`}>
                  {modeOption.badge}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                {modeOption.tooltip}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
