import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, DollarSign, Users } from 'lucide-react';

interface PayrollKPICardsProps {
  totalHours: number;
  totalCost: number;
  employeeCount: number;
}

export const PayrollKPICards = ({ totalHours, totalCost, employeeCount }: PayrollKPICardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Hours Logged</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalHours.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Hours worked in selected period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Labor Cost</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Total payroll for period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{employeeCount}</div>
          <p className="text-xs text-muted-foreground">
            Employees who logged time
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
