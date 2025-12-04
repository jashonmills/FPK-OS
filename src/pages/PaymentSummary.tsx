import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Printer, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface PayrollRunData {
  id: string;
  pay_period_start_date: string;
  pay_period_end_date: string;
  status: string;
  processed_at: string;
}

interface LineItemData {
  employee_user_id: string;
  total_hours: number;
  hourly_rate: number;
  total_pay: number;
}

interface TimeEntryData {
  project_name: string;
  task_title: string;
  entry_date: string;
  hours_logged: number;
  description?: string;
}

export default function PaymentSummary() {
  const { runId } = useParams<{ runId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [payrollRun, setPayrollRun] = useState<PayrollRunData | null>(null);
  const [lineItem, setLineItem] = useState<LineItemData | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntryData[]>([]);
  const [userProfile, setUserProfile] = useState<{ full_name: string; email: string } | null>(null);

  useEffect(() => {
    if (runId && user) {
      fetchPaymentSummary();
    }
  }, [runId, user]);

  const fetchPaymentSummary = async () => {
    if (!runId || !user) return;

    setLoading(true);
    try {
      // Fetch payroll run
      const { data: runData, error: runError } = await supabase
        .from('payroll_runs')
        .select('*')
        .eq('id', runId)
        .single();

      if (runError) throw runError;
      setPayrollRun(runData);

      // Fetch line item for this user
      const { data: lineData, error: lineError } = await supabase
        .from('payroll_run_line_items')
        .select('*')
        .eq('payroll_run_id', runId)
        .eq('employee_user_id', user.id)
        .single();

      if (lineError) throw lineError;
      setLineItem(lineData);

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setUserProfile(profileData);

      // Fetch detailed time entries for this period
      const { data: entriesData, error: entriesError } = await supabase
        .from('vw_payroll_report')
        .select('project_name, task_title, entry_date, hours_logged, description')
        .eq('user_id', user.id)
        .gte('entry_date', runData.pay_period_start_date)
        .lte('entry_date', runData.pay_period_end_date)
        .order('entry_date', { ascending: true });

      if (entriesError) throw entriesError;
      setTimeEntries(entriesData || []);
    } catch (error) {
      console.error('Error fetching payment summary:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payment summary',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!payrollRun || !lineItem || !userProfile) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Payment summary not found</p>
            <Button onClick={() => navigate('/payroll')} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Payroll
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Group time entries by project
  const projectGroups = timeEntries.reduce((acc, entry) => {
    if (!acc[entry.project_name]) {
      acc[entry.project_name] = [];
    }
    acc[entry.project_name].push(entry);
    return acc;
  }, {} as Record<string, TimeEntryData[]>);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="print:hidden mb-6 flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate('/payroll')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payroll
        </Button>
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print Summary
        </Button>
      </div>

      <div className="space-y-6 bg-background print:bg-white">
        {/* Header */}
        <Card>
          <CardHeader className="text-center border-b">
            <CardTitle className="text-2xl">Payment Summary</CardTitle>
            <div className="text-sm text-muted-foreground space-y-1 mt-2">
              <p>
                Pay Period: {format(new Date(payrollRun.pay_period_start_date), 'MMM dd, yyyy')} -{' '}
                {format(new Date(payrollRun.pay_period_end_date), 'MMM dd, yyyy')}
              </p>
              <p>Processed: {format(new Date(payrollRun.processed_at), 'MMM dd, yyyy HH:mm')}</p>
              <Badge variant="default">{payrollRun.status}</Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Employee Information */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{userProfile.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{userProfile.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hourly Rate</p>
                <p className="font-medium">${lineItem.hourly_rate.toFixed(2)}/hr</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="font-medium">{lineItem.total_hours.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(projectGroups).map(([projectName, entries]) => {
                const projectHours = entries.reduce((sum, e) => sum + parseFloat(e.hours_logged.toString()), 0);
                const projectPay = projectHours * lineItem.hourly_rate;
                
                return (
                  <div key={projectName} className="border-b pb-4 last:border-b-0">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{projectName}</h4>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{projectHours.toFixed(2)} hours</p>
                        <p className="font-bold">${projectPay.toFixed(2)}</p>
                      </div>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Task</TableHead>
                          <TableHead className="text-right">Hours</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {entries.map((entry, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="text-sm">
                              {format(new Date(entry.entry_date), 'MMM dd, yyyy')}
                            </TableCell>
                            <TableCell className="text-sm">
                              <div>
                                <p>{entry.task_title}</p>
                                {entry.description && (
                                  <p className="text-xs text-muted-foreground">{entry.description}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right text-sm">
                              {parseFloat(entry.hours_logged.toString()).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Payment</span>
                <span className="text-2xl">${lineItem.total_pay.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card className="print:border-0">
          <CardContent className="py-4 text-center text-sm text-muted-foreground">
            <p>This is an automated payment summary</p>
            <p className="text-xs mt-1">Generated on {format(new Date(), 'MMM dd, yyyy HH:mm:ss')}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}