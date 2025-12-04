import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface TimeEntry {
  id: string;
  user_id: string;
  project_id: string;
  task_id: string | null;
  hours_logged: number;
  entry_date: string;
  created_at: string;
  profiles: {
    full_name: string;
  };
  projects: {
    name: string;
  };
  tasks: {
    title: string;
  } | null;
}

interface RecentTimeEntriesFeedProps {
  entries: TimeEntry[];
}

const EntryCard = ({ entry }: { entry: TimeEntry }) => {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <p className="font-semibold">{entry.profiles.full_name}</p>
            <span className="text-muted-foreground">•</span>
            <p className="text-sm text-muted-foreground">{entry.projects.name}</p>
          </div>
          
          {entry.tasks && (
            <p className="text-sm text-muted-foreground mb-2">
              Task: {entry.tasks.title}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{entry.hours_logged} hours</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(entry.entry_date), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <Badge variant="outline" className="mb-2">
            {entry.hours_logged}h
          </Badge>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>
    </Card>
  );
};

export const RecentTimeEntriesFeed = ({ entries }: RecentTimeEntriesFeedProps) => {
  if (entries.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Recent Entries</h3>
        <p className="text-muted-foreground">No time entries have been logged in the last 24 hours</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map(entry => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
};
