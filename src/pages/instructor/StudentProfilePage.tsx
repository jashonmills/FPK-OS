import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrgStudents } from '@/hooks/useOrgStudents';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransparentTile } from '@/components/ui/transparent-tile';
import { ArrowLeft, User, BookOpen, BarChart3, MessageSquare, FileText } from 'lucide-react';
import { StudentOverviewTab } from '@/components/students/profile/StudentOverviewTab';
import { StudentCoursesTab } from '@/components/students/profile/StudentCoursesTab';
import { StudentPerformanceTab } from '@/components/students/profile/StudentPerformanceTab';
import { StudentCommunicationTab } from '@/components/students/profile/StudentCommunicationTab';
import { StudentDocumentsTab } from '@/components/students/profile/StudentDocumentsTab';

export default function StudentProfilePage() {
  const { orgId, studentId } = useParams<{ orgId: string; studentId: string }>();
  const navigate = useNavigate();
  const { currentOrg } = useOrgContext();
  const [activeTab, setActiveTab] = useState('overview');

  const { students, isLoading } = useOrgStudents(orgId!);
  const student = students.find(s => s.id === studentId);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading student profile...</div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2">Student Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested student profile could not be found.</p>
            <Button onClick={() => navigate(`/org/${orgId}/students`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Students
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/org/${orgId}/students`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Students
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{student.full_name}</h1>
              <p className="text-muted-foreground">
                Student ID: {student.student_id} • {student.grade_level || 'Grade not specified'} • {student.status}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <TransparentTile className="org-tile">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Courses
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="communication" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Communication
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documents
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="overview" className="space-y-6">
                <StudentOverviewTab student={student} orgId={orgId!} />
              </TabsContent>

              <TabsContent value="courses" className="space-y-6">
                <StudentCoursesTab student={student} orgId={orgId!} />
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <StudentPerformanceTab student={student} orgId={orgId!} />
              </TabsContent>

              <TabsContent value="communication" className="space-y-6">
                <StudentCommunicationTab student={student} orgId={orgId!} />
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                <StudentDocumentsTab student={student} orgId={orgId!} />
              </TabsContent>
            </div>
          </Tabs>
        </TransparentTile>
      </div>
    </div>
  );
}