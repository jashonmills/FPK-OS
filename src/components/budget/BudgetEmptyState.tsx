import { DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const BudgetEmptyState = () => {
  return (
    <Card className="p-12">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="rounded-full bg-primary/10 p-6">
          <DollarSign className="h-12 w-12 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Select a Project</h3>
          <p className="text-muted-foreground max-w-md">
            Choose a project from the dropdown above to view its budget details, track expenses, and monitor spending.
          </p>
        </div>
      </div>
    </Card>
  );
};
