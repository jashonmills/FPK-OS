import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface PayrollRun {
  id: string;
  pay_period_start_date: string;
  pay_period_end_date: string;
  status: string;
  total_hours: number;
  total_cost: number;
  processed_at: string;
  processed_by_user_id: string;
  notes?: string;
}

export const PayrollRunsHistory = () => {
  const { toast } = useToast();
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayrollRuns();
  }, []);

  const fetchPayrollRuns = async () => {
    try {
      const { data, error } = await supabase
        .from('payroll_runs')
        .select('*')
        .order('processed_at', { ascending: false });

      if (error) throw error;

      setPayrollRuns(data || []);
    } catch (error) {
      console.error('Error fetching payroll runs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payroll history',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      pending: 'secondary',
      approved: 'default',
      paid: 'default',
    };

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (payrollRuns.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No payroll runs found
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Period</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total Hours</TableHead>
            <TableHead className="text-right">Total Cost</TableHead>
            <TableHead>Processed Date</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payrollRuns.map((run) => (
            <TableRow key={run.id}>
              <TableCell className="font-medium">
                {format(new Date(run.pay_period_start_date), 'MMM dd, yyyy')} -{' '}
                {format(new Date(run.pay_period_end_date), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>{getStatusBadge(run.status)}</TableCell>
              <TableCell className="text-right">{run.total_hours.toFixed(2)}</TableCell>
              <TableCell className="text-right font-bold">${run.total_cost.toFixed(2)}</TableCell>
              <TableCell>
                {format(new Date(run.processed_at), 'MMM dd, yyyy HH:mm')}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {run.notes || '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
