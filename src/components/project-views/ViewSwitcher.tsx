import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Calendar, GanttChartSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViewType = 'kanban' | 'list' | 'calendar' | 'timeline';

interface ViewSwitcherProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const views = [
  { id: 'kanban' as ViewType, label: 'Kanban', icon: LayoutGrid },
  { id: 'list' as ViewType, label: 'List', icon: List },
  { id: 'calendar' as ViewType, label: 'Calendar', icon: Calendar },
  { id: 'timeline' as ViewType, label: 'Timeline', icon: GanttChartSquare },
];

export const ViewSwitcher = ({ activeView, onViewChange }: ViewSwitcherProps) => {
  return (
    <div className="flex gap-1 bg-muted p-1 rounded-lg">
      {views.map((view) => {
        const Icon = view.icon;
        return (
          <Button
            key={view.id}
            variant={activeView === view.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange(view.id)}
            className={cn(
              'gap-2',
              activeView === view.id && 'shadow-sm'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{view.label}</span>
          </Button>
        );
      })}
    </div>
  );
};
