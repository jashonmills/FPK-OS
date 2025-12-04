import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Calendar, GanttChartSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViewType = 'kanban' | 'list' | 'calendar' | 'timeline';

interface ViewSwitcherProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const ViewSwitcher = ({ activeView, onViewChange }: ViewSwitcherProps) => {
  const views = [
    { id: 'kanban' as ViewType, label: 'Kanban', icon: LayoutGrid },
    { id: 'list' as ViewType, label: 'List', icon: List },
    { id: 'calendar' as ViewType, label: 'Calendar', icon: Calendar },
    { id: 'timeline' as ViewType, label: 'Timeline', icon: GanttChartSquare },
  ];

  return (
    <div className="flex gap-1 bg-muted p-1 rounded-lg w-full md:w-auto justify-between md:justify-start">
      {views.map((view) => {
        const Icon = view.icon;
        return (
          <Button
            key={view.id}
            variant={activeView === view.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange(view.id)}
            className={cn(
              'gap-1 md:gap-2 flex-1 md:flex-none px-2 md:px-3',
              activeView === view.id && 'shadow-sm'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden md:inline text-xs md:text-sm">{view.label}</span>
          </Button>
        );
      })}
    </div>
  );
};
