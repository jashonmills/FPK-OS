import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Clock, Send } from 'lucide-react';
import { format, startOfWeek, endOfWeek, subWeeks, parseISO } from 'date-fns';
import { PayrollPeriodSelector } from '@/components/payroll/PayrollPeriodSelector';
import { TimesheetStatusBadge } from '@/components/timesheet/TimesheetStatusBadge';
import { TimesheetDailyCard } from '@/components/timesheet/TimesheetDailyCard';
import { TimesheetSubmitDialog } from '@/components/timesheet/TimesheetSubmitDialog';
import { EditTimeEntryDialog } from '@/components/payroll/EditTimeEntryDialog';
import { ContextualHelpButton } from '@/components/help/ContextualHelpButton';

interface TimeEntry {
  id: string;
  user_id: string;
  project_id: string;
  task_id: string | null;
  hours_logged: number;
  entry_date: string;
  description: string | null;
  status: 'open' | 'submitted' | 'approved' | 'rejected' | 'paid';
  projects?: { name: string };
  tasks?: { title: string } | null;
}

interface GroupedEntries {
  [date: string]: TimeEntry[];
}

const MyTimesheet = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState({
    from: startOfWeek(new Date(), { weekStartsOn: 1 }),
    to: endOfWeek(new Date(), { weekStartsOn: 1 }),
  });
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);

  const fetchTimeEntries = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .select(`
          *,
          projects:project_id (name),
          tasks:task_id (title)
        `)
        .eq('user_id', user.id)
        .gte('entry_date', format(dateRange.from, 'yyyy-MM-dd'))
        .lte('entry_date', format(dateRange.to, 'yyyy-MM-dd'))
        .order('entry_date', { ascending: true });

      if (error) throw error;

      setTimeEntries(data || []);
    } catch (error: any) {
      console.error('Error fetching time entries:', error);
      toast.error('Failed to load timesheet');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeEntries();
  }, [user, dateRange]);

  const groupedEntries: GroupedEntries = timeEntries.reduce((acc, entry) => {
    const date = entry.entry_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as GroupedEntries);

  const sortedDates = Object.keys(groupedEntries).sort();

  // Determine overall status
  const statuses = timeEntries.map(e => e.status);
  const uniqueStatuses = [...new Set(statuses)];
  let overallStatus: 'open' | 'submitted' | 'approved' | 'rejected' | 'paid' = 'open';
  
  if (uniqueStatuses.length === 0) {
    overallStatus = 'open';
  } else if (uniqueStatuses.includes('paid')) {
    overallStatus = 'paid';
  } else if (uniqueStatuses.includes('approved')) {
    overallStatus = 'approved';
  } else if (uniqueStatuses.includes('rejected')) {
    overallStatus = 'rejected';
  } else if (uniqueStatuses.includes('submitted')) {
    overallStatus = 'submitted';
  }

  const canEdit = overallStatus === 'open' || overallStatus === 'rejected';
  const canSubmit = canEdit && timeEntries.length > 0;
  const totalHours = timeEntries.reduce((sum, entry) => sum + Number(entry.hours_logged), 0);

  const handleSubmitTimesheet = async () => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('submit-timesheet', {
        body: {
          startDate: format(dateRange.from, 'yyyy-MM-dd'),
          endDate: format(dateRange.to, 'yyyy-MM-dd'),
        },
      });

      if (error) throw error;

      toast.success(`Timesheet submitted! ${data.entryCount} entries totaling ${data.totalHours.toFixed(2)} hours.`);
      setSubmitDialogOpen(false);
      fetchTimeEntries();
    } catch (error: any) {
      console.error('Error submitting timesheet:', error);
      toast.error(error.message || 'Failed to submit timesheet');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('time_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      toast.success('Time entry deleted');
      fetchTimeEntries();
    } catch (error: any) {
      console.error('Error deleting entry:', error);
      toast.error('Failed to delete entry');
    }
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-6 w-full">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Clock className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              My Timesheet
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Review and submit your hours for approval
            </p>
          </div>
          <TimesheetStatusBadge status={overallStatus} className="text-sm md:text-base" />
        </div>

        <PayrollPeriodSelector dateRange={dateRange} onChange={setDateRange} />

        {loading ? (
          <Card className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </Card>
        ) : timeEntries.length === 0 ? (
          <Card className="p-8">
            <div className="text-center space-y-2">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-semibold">No Time Entries</h3>
              <p className="text-muted-foreground">
                You haven't logged any hours for this period yet.
              </p>
            </div>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {sortedDates.map((dateStr) => (
                <TimesheetDailyCard
                  key={dateStr}
                  date={parseISO(dateStr)}
                  entries={groupedEntries[dateStr]}
                  canEdit={canEdit}
                  onEdit={setEditingEntry}
                  onDelete={handleDeleteEntry}
                />
              ))}
            </div>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Summary</h3>
                  <p className="text-2xl font-bold text-primary mt-1">
                    {totalHours.toFixed(2)} hours
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(dateRange.from, 'MMM d')} - {format(dateRange.to, 'MMM d, yyyy')}
                  </p>
                </div>
                <Button
                  onClick={() => setSubmitDialogOpen(true)}
                  disabled={!canSubmit}
                  size="lg"
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  Submit for Approval
                </Button>
              </div>
              {!canSubmit && timeEntries.length > 0 && (
                <p className="text-sm text-muted-foreground mt-4">
                  {overallStatus === 'submitted' && 'Your timesheet has been submitted and is awaiting approval.'}
                  {overallStatus === 'approved' && 'Your timesheet has been approved.'}
                  {overallStatus === 'paid' && 'This timesheet has been processed in payroll.'}
                </p>
              )}
            </Card>
          </>
        )}

        <TimesheetSubmitDialog
          open={submitDialogOpen}
          onOpenChange={setSubmitDialogOpen}
          onConfirm={handleSubmitTimesheet}
          totalHours={totalHours}
          dateRange={dateRange}
          isSubmitting={isSubmitting}
        />

        {editingEntry && (
          <EditTimeEntryDialog
            open={true}
            onOpenChange={(open) => !open && setEditingEntry(null)}
            entry={{
              time_entry_id: editingEntry.id,
              user_id: editingEntry.user_id,
              user_name: '', // Not needed for editing own entries
              project_id: editingEntry.project_id,
              project_name: editingEntry.projects?.name || '',
              task_id: editingEntry.task_id || '',
              task_title: editingEntry.tasks?.title || '',
              date: editingEntry.entry_date,
              hours: Number(editingEntry.hours_logged),
              description: editingEntry.description || undefined,
            }}
            onSuccess={() => {
              setEditingEntry(null);
              fetchTimeEntries();
            }}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default MyTimesheet;
