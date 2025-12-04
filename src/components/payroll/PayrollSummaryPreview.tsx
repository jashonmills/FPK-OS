import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

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

interface PayrollSummaryPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: () => void;
  employees: EmployeePayrollData[];
  dateRange: { from: Date; to: Date };
  isApproving: boolean;
}

export const PayrollSummaryPreview = ({
  open,
  onOpenChange,
  onApprove,
  employees,
  dateRange,
  isApproving,
}: PayrollSummaryPreviewProps) => {
  const [expandedEmployees, setExpandedEmployees] = useState<Set<string>>(new Set());

  const toggleEmployee = (userId: string) => {
    const newExpanded = new Set(expandedEmployees);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedEmployees(newExpanded);
  };

  const totalHours = employees.reduce((sum, emp) => sum + emp.total_hours, 0);
  const totalCost = employees.reduce((sum, emp) => sum + emp.total_pay, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payroll Summary Preview</DialogTitle>
          <DialogDescription>
            Review payroll details before approval and notification
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border p-4 bg-muted/50">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Pay Period</h3>
              <p className="text-sm text-muted-foreground">
                {format(dateRange.from, 'MMM dd, yyyy')} - {format(dateRange.to, 'MMM dd, yyyy')}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm">Total Employees: {employees.length}</p>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Hours: {totalHours.toFixed(2)}</p>
                <p className="text-lg font-bold">${totalCost.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Total Pay</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <React.Fragment key={employee.user_id}>
                    <TableRow>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleEmployee(employee.user_id)}
                          className="h-6 w-6 p-0"
                        >
                          {expandedEmployees.has(employee.user_id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{employee.user_name}</p>
                          <p className="text-sm text-muted-foreground">{employee.user_email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{employee.total_hours.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${employee.hourly_rate.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-bold">${employee.total_pay.toFixed(2)}</TableCell>
                    </TableRow>
                    {expandedEmployees.has(employee.user_id) && (
                      <TableRow>
                        <TableCell colSpan={5} className="bg-muted/30">
                          <div className="space-y-3 py-2 px-4">
                            {employee.project_breakdown.map((project) => (
                              <div key={project.project_id} className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h5 className="font-medium text-sm">{project.project_name}</h5>
                                  <Badge variant="secondary">{project.hours.toFixed(2)} hrs</Badge>
                                </div>
                                <div className="ml-4 space-y-1">
                                  {project.daily_breakdown
                                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                    .map((day, index) => (
                                      <div key={index} className="text-xs grid grid-cols-[100px_60px_1fr] gap-2 py-0.5">
                                        <span className="text-muted-foreground">
                                          {format(new Date(day.date), 'MMM dd, yyyy')}
                                        </span>
                                        <span className="font-medium">{day.hours.toFixed(2)} hrs</span>
                                        <span className="text-muted-foreground truncate">
                                          {day.task_title || day.description || 'No description'}
                                        </span>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isApproving}
          >
            Cancel
          </Button>
          <Button onClick={onApprove} disabled={isApproving}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            {isApproving ? 'Approving...' : 'Approve & Send Notifications'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};