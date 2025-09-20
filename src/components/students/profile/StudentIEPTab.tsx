import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentIEP } from '@/hooks/useStudentIEP';
import { OrgStudent } from '@/hooks/useOrgStudents';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Printer, 
  PlayCircle, 
  Plus, 
  Calendar, 
  Users, 
  BarChart3,
  AlertCircle
} from 'lucide-react';
import { IEPDocumentViewer } from './IEPDocumentViewer';
import { IEPStatusCard } from './IEPStatusCard';

interface StudentIEPTabProps {
  student: OrgStudent;
  orgId: string;
}

export function StudentIEPTab({ student, orgId }: StudentIEPTabProps) {
  const navigate = useNavigate();
  const { iepData, isLoading, status, hasDocuments, currentStep, completionPercentage, documents } = useStudentIEP(orgId, student.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading IEP information...</div>
      </div>
    );
  }

  // No IEP State - Show prompt to start new IEP
  if (status === 'none') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>No IEP on File</CardTitle>
            <CardDescription>
              This student does not currently have an Individualized Education Program (IEP) on file.
              Start the IEP process to create a comprehensive educational plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              size="lg"
              onClick={() => navigate(`/org/${orgId}/iep/wizard?studentId=${student.id}`)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Start New IEP Process
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Has IEP State - Show IEP information and documents
  return (
    <div className="space-y-6">
      {/* IEP Status and Quick Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <IEPStatusCard 
          iepData={iepData!}
          status={status}
          completionPercentage={completionPercentage}
          currentStep={currentStep}
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              IEP Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {iepData?.cycle_start_date && (
              <div>
                <div className="text-sm font-medium">Effective Date</div>
                <div className="text-muted-foreground">
                  {new Date(iepData.cycle_start_date).toLocaleDateString()}
                </div>
              </div>
            )}
            {iepData?.cycle_end_date && (
              <div>
                <div className="text-sm font-medium">Review Date</div>
                <div className="text-muted-foreground">
                  {new Date(iepData.cycle_end_date).toLocaleDateString()}
                </div>
              </div>
            )}
            <div>
              <div className="text-sm font-medium">Last Updated</div>
              <div className="text-muted-foreground">
                {new Date(iepData?.updated_at || iepData?.created_at || '').toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>IEP Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {status === 'in_progress' && (
              <Button 
                onClick={() => navigate(`/org/${orgId}/iep/wizard?studentId=${student.id}&step=${currentStep}`)}
                className="gap-2"
              >
                <PlayCircle className="h-4 w-4" />
                Continue IEP Process
              </Button>
            )}
            
            {hasDocuments && (
              <>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download IEP Document
                </Button>
                <Button variant="outline" className="gap-2">
                  <Printer className="h-4 w-4" />
                  Print IEP
                </Button>
              </>
            )}
            
            {status === 'completed' && (
              <Button 
                variant="outline"
                onClick={() => navigate(`/org/${orgId}/iep/wizard?studentId=${student.id}&renewal=true`)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Start New IEP Cycle
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documents Section */}
      {hasDocuments && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              IEP Documents
            </CardTitle>
            <CardDescription>
              View and manage IEP-related documents and assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IEPDocumentViewer documents={documents} />
          </CardContent>
        </Card>
      )}

      {/* Progress Overview */}
      {status === 'in_progress' || status === 'completed' ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              IEP Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Completion</span>
                  <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
              
              {status === 'in_progress' && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  Currently on step {currentStep} of the IEP process
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}