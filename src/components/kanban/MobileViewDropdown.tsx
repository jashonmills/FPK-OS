import { LayoutGrid, List, Calendar, GanttChartSquare, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ViewType } from '@/components/project-views/ViewSwitcher';

interface MobileViewDropdownProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const views = [
  { id: 'kanban' as ViewType, label: 'Kanban', icon: LayoutGrid },
  { id: 'list' as ViewType, label: 'List', icon: List },
  { id: 'calendar' as ViewType, label: 'Calendar', icon: Calendar },
  { id: 'timeline' as ViewType, label: 'Timeline', icon: GanttChartSquare },
];

export const MobileViewDropdown = ({ activeView, onViewChange }: MobileViewDropdownProps) => {
  const currentView = views.find(v => v.id === activeView);
  const CurrentIcon = currentView?.icon || Eye;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <CurrentIcon className="h-4 w-4" />
          <span className="text-xs">View</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-40 z-50 bg-popover">
        {views.map((view) => {
          const Icon = view.icon;
          return (
            <DropdownMenuItem 
              key={view.id}
              onClick={() => onViewChange(view.id)}
              className="cursor-pointer gap-2"
            >
              <Icon className="h-4 w-4" />
              <span>{view.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
