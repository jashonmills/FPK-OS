import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

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

interface PayrollEmployeeDetailsProps {
  employee: EmployeePayrollData;
}

export const PayrollEmployeeDetails = ({ employee }: PayrollEmployeeDetailsProps) => {
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
                  <div key={index} className="text-sm grid grid-cols-[100px_80px_1fr] gap-2 py-1">
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
    </div>
  );
};
