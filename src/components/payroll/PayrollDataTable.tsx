import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { PayrollEmployeeDetails } from './PayrollEmployeeDetails';
import { Skeleton } from '@/components/ui/skeleton';

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

interface PayrollDataTableProps {
  data: EmployeePayrollData[];
  selectedEmployees: string[];
  onSelectionChange: (selected: string[]) => void;
  loading: boolean;
}

export const PayrollDataTable = ({
  data,
  selectedEmployees,
  onSelectionChange,
  loading,
}: PayrollDataTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (userId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedRows(newExpanded);
  };

  const toggleSelectAll = () => {
    if (selectedEmployees.length === data.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map(emp => emp.user_id));
    }
  };

  const toggleSelect = (userId: string) => {
    if (selectedEmployees.includes(userId)) {
      onSelectionChange(selectedEmployees.filter(id => id !== userId));
    } else {
      onSelectionChange([...selectedEmployees, userId]);
    }
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

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No time entries found for the selected period
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedEmployees.length === data.length}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead className="w-12"></TableHead>
            <TableHead>Employee Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Total Hours</TableHead>
            <TableHead className="text-right">Hourly Rate</TableHead>
            <TableHead className="text-right">Total Pay</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((employee) => (
            <React.Fragment key={employee.user_id}>
              <TableRow>
                <TableCell>
                  <Checkbox
                    checked={selectedEmployees.includes(employee.user_id)}
                    onCheckedChange={() => toggleSelect(employee.user_id)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRow(employee.user_id)}
                  >
                    {expandedRows.has(employee.user_id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{employee.user_name}</TableCell>
                <TableCell>{employee.user_email}</TableCell>
                <TableCell className="text-right">{employee.total_hours.toFixed(2)}</TableCell>
                <TableCell className="text-right">${employee.hourly_rate.toFixed(2)}</TableCell>
                <TableCell className="text-right font-bold">${employee.total_pay.toFixed(2)}</TableCell>
              </TableRow>
              {expandedRows.has(employee.user_id) && (
                <TableRow>
                  <TableCell colSpan={7} className="bg-muted/50">
                    <PayrollEmployeeDetails employee={employee} />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
