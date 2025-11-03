import React, { useState } from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface EmployeePayrollData {
  user_id: string;
  user_name: string;
  user_email: string;
  total_hours: number;
  hourly_rate: number;
  total_pay: number;
  project_breakdown: Array<{
    project_id: string;
    project_name: string;
    hours: number;
    daily_breakdown: Array<{
      date: string;
      hours: number;
      task_title?: string;
      description?: string;
      time_entry_id?: string;
    }>;
  }>;
}

interface PayrollEmployeeDetailsProps {
  employee: EmployeePayrollData;
  onRefresh: () => void;
}

export const PayrollEmployeeDetails = ({ employee, onRefresh }: PayrollEmployeeDetailsProps) => {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  const handleDeleteEntry = async () => {
    if (!selectedEntryId) return;

    try {
      const { error } = await supabase
        .from('time_entries')
        .delete()
        .eq('id', selectedEntryId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Time entry deleted successfully',
      });

      onRefresh();
      setDeleteDialogOpen(false);
      setSelectedEntryId(null);
    } catch (error) {
      console.error('Error deleting time entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete time entry',
        variant: 'destructive',
      });
    }
  };

  const openDeleteDialog = (entryId: string) => {
    setSelectedEntryId(entryId);
    setDeleteDialogOpen(true);
  };
  return (
    <div className="p-4 space-y-4">
      <h4 className="font-semibold text-sm">Time Breakdown for {employee.user_name}</h4>
      
      <div className="space-y-4">
        {employee.project_breakdown.map((project) => (
          <div key={project.project_id} className="space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="font-medium text-sm flex items-center gap-2">
                {project.project_name}
                <Badge variant="secondary">{project.hours.toFixed(2)} hrs</Badge>
              </h5>
            </div>
            
            <div className="ml-4 space-y-1">
              {project.daily_breakdown
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((day, index) => (
                  <div key={index} className="text-sm grid grid-cols-[100px_80px_1fr_auto] gap-2 py-1 items-center group">
                    <span className="text-muted-foreground">
                      {format(new Date(day.date), 'MMM dd, yyyy')}
                    </span>
                    <span className="font-medium">{day.hours.toFixed(2)} hrs</span>
                    <span className="text-muted-foreground truncate">
                      {day.task_title || day.description || 'No description'}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {day.time_entry_id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(day.time_entry_id!)}
                          className="h-7 w-7 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Time Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this time entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEntry}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
