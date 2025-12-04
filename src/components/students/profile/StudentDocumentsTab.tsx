import React from 'react';
import { OrgStudent } from '@/hooks/useOrgStudents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Download, Eye } from 'lucide-react';

interface StudentDocumentsTabProps {
  student: OrgStudent;
  orgId: string;
}

export function StudentDocumentsTab({ student, orgId }: StudentDocumentsTabProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Documents & Attachments</h3>
          <p className="text-muted-foreground">Manage documents for {student.full_name}</p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Document Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transcripts</CardTitle>
            <FileText className="h-4 w-4 ml-auto" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Academic transcripts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <FileText className="h-4 w-4 ml-auto" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Completion certificates</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forms</CardTitle>
            <FileText className="h-4 w-4 ml-auto" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Administrative forms</p>
          </CardContent>
        </Card>
      </div>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>All Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Documents Uploaded</h3>
            <p className="mb-4">
              Upload documents like transcripts, certificates, and forms for {student.full_name}.
            </p>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload First Document
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Medical & Accommodation Records */}
      <Card>
        <CardHeader>
          <CardTitle>Medical & Accommodation Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Confidential Records</h3>
            <p>Medical forms and accommodation requests will be stored securely here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}