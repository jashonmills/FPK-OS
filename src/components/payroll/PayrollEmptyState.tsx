import { Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const PayrollEmptyState = () => {
  return (
    <Card className="p-12">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="rounded-full bg-primary/10 p-6">
          <Clock className="h-12 w-12 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">No Time Entries Found</h3>
          <p className="text-muted-foreground max-w-md">
            No time entries were logged during this payroll period. Employees can log time through the Time Clock widget or by tracking time on tasks in the Kanban board.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/kanban">Go to Kanban Board</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};
