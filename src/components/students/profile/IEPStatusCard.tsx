import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { StudentIEPData } from '@/hooks/useStudentIEP';

interface IEPStatusCardProps {
  iepData: StudentIEPData;
  status: 'none' | 'in_progress' | 'completed';
  completionPercentage: number;
  currentStep: number;
}

export function IEPStatusCard({ iepData, status, completionPercentage, currentStep }: IEPStatusCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="default" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            In Progress
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Not Started
          </Badge>
        );
    }
  };

  const getStatusDescription = () => {
    switch (status) {
      case 'completed':
        return 'IEP has been finalized and is currently active';
      case 'in_progress':
        return `IEP development in progress - Step ${currentStep}`;
      default:
        return 'No IEP process has been initiated';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>IEP Status</span>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm font-medium mb-2">Status</div>
          <div className="text-muted-foreground text-sm">
            {getStatusDescription()}
          </div>
        </div>
        
        {status !== 'none' && (
          <>
            <div>
              <div className="text-sm font-medium mb-2">IEP ID</div>
              <div className="text-muted-foreground text-sm font-mono">
                {iepData.id.slice(0, 8)}...
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium mb-2">Created</div>
              <div className="text-muted-foreground text-sm">
                {new Date(iepData.created_at).toLocaleDateString()}
              </div>
            </div>
            
            {status === 'in_progress' && (
              <div>
                <div className="text-sm font-medium mb-2">Progress</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}