import { BookOpen, Database } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

export type DataSource = 'general' | 'mydata';

interface DataSourceToggleProps {
  dataSource: DataSource;
  onDataSourceChange: (source: DataSource) => void;
  className?: string;
}

export function DataSourceToggle({ dataSource, onDataSourceChange, className }: DataSourceToggleProps) {
  const sources = [
    {
      value: 'general' as const,
      label: 'General & Platform Guide',
      icon: BookOpen,
      tooltip: 'Ask about any topic or platform features',
      badge: 'Public Knowledge',
      badgeColor: 'bg-blue-500',
    },
    {
      value: 'mydata' as const,
      label: 'My Data',
      icon: Database,
      tooltip: 'Search your personal notes, courses, and files',
      badge: 'Private',
      badgeColor: 'bg-purple-500',
    },
  ];

  const currentSource = sources.find((s) => s.value === dataSource) || sources[0];

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`gap-2 ${className}`}
              >
                <currentSource.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{currentSource.label}</span>
                <span className="sm:hidden">Data Source</span>
                <Badge className={`${currentSource.badgeColor} text-white text-xs ml-1`}>
                  {currentSource.badge}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>{currentSource.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="end" className="w-[280px]">
        {sources.map((source) => (
          <DropdownMenuItem
            key={source.value}
            onClick={() => onDataSourceChange(source.value)}
            className="flex items-start gap-3 p-3 cursor-pointer"
          >
            <source.icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{source.label}</span>
                <Badge className={`${source.badgeColor} text-white text-xs`}>
                  {source.badge}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{source.tooltip}</p>
            </div>
            {dataSource === source.value && (
              <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
