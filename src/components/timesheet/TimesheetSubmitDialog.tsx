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
import { format } from 'date-fns';

interface TimesheetSubmitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  totalHours: number;
  dateRange: { from: Date; to: Date };
  isSubmitting: boolean;
}

export const TimesheetSubmitDialog = ({
  open,
  onOpenChange,
  onConfirm,
  totalHours,
  dateRange,
  isSubmitting,
}: TimesheetSubmitDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Submit Timesheet for Approval?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              You are submitting <span className="font-semibold text-foreground">{totalHours.toFixed(2)} hours</span> for
              the period{' '}
              <span className="font-semibold text-foreground">
                {format(dateRange.from, 'MMM d')} - {format(dateRange.to, 'MMM d, yyyy')}
              </span>
              .
            </p>
            <p className="text-sm">
              Once submitted, your time entries <strong>cannot be edited</strong> unless rejected by
              your manager.
            </p>
            <p className="text-sm font-medium">
              Do you confirm these hours are accurate and ready for approval?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Yes, Submit Timesheet'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
