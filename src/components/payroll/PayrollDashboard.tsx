import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PayrollPeriodSelector } from './PayrollPeriodSelector';
import { PayrollDataTable } from './PayrollDataTable';
import { PayrollKPICards } from './PayrollKPICards';
import { PayrollEmptyState } from './PayrollEmptyState';
import { CreateManualTimeEntryDialog } from './CreateManualTimeEntryDialog';
import { CheckCircle2, Download, Plus } from 'lucide-react';
import { format, startOfWeek, endOfWeek } from 'date-fns';

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
    }>;
  }>;
}

export const PayrollDashboard = () => {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(() => {
    // Auto-select "This Week" on mount
    const now = new Date();
    return {
      from: startOfWeek(now, { weekStartsOn: 0 }),
      to: endOfWeek(now, { weekStartsOn: 0 }),
    };
  });
  const [payrollData, setPayrollData] = useState<EmployeePayrollData[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [showManualEntryDialog, setShowManualEntryDialog] = useState(false);

  useEffect(() => {
    if (dateRange) {
      fetchPayrollData();
    }
  }, [dateRange]);

  const fetchPayrollData = async () => {
    if (!dateRange) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vw_payroll_report')
        .select('*')
        .gte('entry_date', format(dateRange.from, 'yyyy-MM-dd'))
        .lte('entry_date', format(dateRange.to, 'yyyy-MM-dd'));

      if (error) throw error;

      const aggregated = aggregatePayrollData(data || []);
      setPayrollData(aggregated);
    } catch (error) {
      console.error('Error fetching payroll data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payroll data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const aggregatePayrollData = (rawData: any[]): EmployeePayrollData[] => {
    const employeeMap = new Map<string, EmployeePayrollData>();

    rawData.forEach(entry => {
      if (!employeeMap.has(entry.user_id)) {
        employeeMap.set(entry.user_id, {
          user_id: entry.user_id,
          user_name: entry.user_name,
          user_email: entry.user_email,
          total_hours: 0,
          hourly_rate: entry.hourly_rate,
          total_pay: 0,
          project_breakdown: [],
        });
      }

      const employee = employeeMap.get(entry.user_id)!;
      employee.total_hours += parseFloat(entry.hours_logged);
      employee.total_pay += parseFloat(entry.calculated_cost);

      let project = employee.project_breakdown.find(p => p.project_id === entry.project_id);
      if (!project) {
        project = {
          project_id: entry.project_id,
          project_name: entry.project_name,
          hours: 0,
          daily_breakdown: [],
        };
        employee.project_breakdown.push(project);
      }

      project.hours += parseFloat(entry.hours_logged);
      project.daily_breakdown.push({
        date: entry.entry_date,
        hours: parseFloat(entry.hours_logged),
        task_title: entry.task_title,
        description: entry.description,
      });
    });

    return Array.from(employeeMap.values());
  };

  const handleApprovePayroll = async () => {
    if (!dateRange || selectedEmployees.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select employees to include in the payroll run',
        variant: 'destructive',
      });
      return;
    }

    setIsApproving(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-payroll-run', {
        body: {
          pay_period_start_date: format(dateRange.from, 'yyyy-MM-dd'),
          pay_period_end_date: format(dateRange.to, 'yyyy-MM-dd'),
          employee_ids: selectedEmployees,
        },
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Payroll run created with ${selectedEmployees.length} employees`,
      });

      fetchPayrollData();
      setSelectedEmployees([]);
    } catch (error) {
      console.error('Error approving payroll:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve payroll run',
        variant: 'destructive',
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleExportCSV = () => {
    const selectedData = payrollData.filter(emp => selectedEmployees.includes(emp.user_id));
    
    const csvContent = [
      ['Employee Name', 'Email', 'Total Hours', 'Hourly Rate', 'Total Pay'],
      ...selectedData.map(emp => [
        emp.user_name,
        emp.user_email,
        emp.total_hours.toFixed(2),
        emp.hourly_rate.toFixed(2),
        emp.total_pay.toFixed(2),
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll_${format(dateRange?.from || new Date(), 'yyyy-MM-dd')}_to_${format(dateRange?.to || new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalHours = payrollData.reduce((sum, emp) => sum + emp.total_hours, 0);
  const totalCost = payrollData.reduce((sum, emp) => sum + emp.total_pay, 0);

  return (
    <div className="space-y-6">
      <PayrollPeriodSelector dateRange={dateRange} onChange={setDateRange} />

      {dateRange && (
        <>
          <PayrollKPICards
            totalHours={totalHours}
            totalCost={totalCost}
            employeeCount={payrollData.length}
          />

          {!loading && payrollData.length === 0 ? (
            <PayrollEmptyState />
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Employee Payroll Data</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowManualEntryDialog(true)}
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Manual Time Entry
                    </Button>
                    <Button
                      onClick={handleExportCSV}
                      disabled={selectedEmployees.length === 0}
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button
                      onClick={handleApprovePayroll}
                      disabled={selectedEmployees.length === 0 || isApproving}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {isApproving ? 'Approving...' : 'Approve for Payroll'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <PayrollDataTable
                  data={payrollData}
                  selectedEmployees={selectedEmployees}
                  onSelectionChange={setSelectedEmployees}
                  loading={loading}
                  onRefresh={fetchPayrollData}
                />
              </CardContent>
            </Card>
          )}
        </>
      )}

      <CreateManualTimeEntryDialog
        open={showManualEntryDialog}
        onOpenChange={setShowManualEntryDialog}
        onSuccess={fetchPayrollData}
      />
    </div>
  );
};
