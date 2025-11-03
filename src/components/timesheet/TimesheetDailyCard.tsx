import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface TimeEntry {
  id: string;
  user_id: string;
  project_id: string;
  task_id: string | null;
  hours_logged: number;
  description: string | null;
  entry_date: string;
  status: 'open' | 'submitted' | 'approved' | 'rejected' | 'paid';
  projects?: { name: string };
  tasks?: { title: string } | null;
}

interface TimesheetDailyCardProps {
  date: Date;
  entries: TimeEntry[];
  canEdit: boolean;
  onEdit: (entry: TimeEntry) => void;
  onDelete: (entryId: string) => void;
}

export const TimesheetDailyCard = ({
  date,
  entries,
  canEdit,
  onEdit,
  onDelete,
}: TimesheetDailyCardProps) => {
  const totalHours = entries.reduce((sum, entry) => sum + Number(entry.hours_logged), 0);

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between border-b pb-2">
        <div>
          <h3 className="font-semibold text-lg">
            {format(date, 'EEEE, MMMM d')}
          </h3>
          <p className="text-sm text-muted-foreground">
            {format(date, 'yyyy')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{totalHours.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">hours</p>
        </div>
      </div>

      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-start justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{entry.projects?.name || 'Unknown Project'}</span>
                {entry.tasks && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{entry.tasks.title}</span>
                  </>
                )}
              </div>
              {entry.description && (
                <p className="text-sm text-muted-foreground">{entry.description}</p>
              )}
              <p className="text-sm font-semibold text-primary">
                {Number(entry.hours_logged).toFixed(2)} hours
              </p>
            </div>

            <div className="flex gap-1 ml-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(entry)}
                disabled={!canEdit}
                className="h-8 w-8"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(entry.id)}
                disabled={!canEdit}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
