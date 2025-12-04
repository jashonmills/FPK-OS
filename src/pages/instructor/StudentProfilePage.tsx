import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrgStudents } from '@/hooks/useOrgStudents';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, BookOpen, BarChart3, MessageSquare, FileText, ClipboardList, Target } from 'lucide-react';
import { TransparentTile } from '@/components/ui/transparent-tile';
import { MobilePageLayout, MobileSectionHeader } from '@/components/layout/MobilePageLayout';
import { MobileOptimizedTabs } from '@/components/layout/MobileOptimizedTabs';
import { StudentOverviewTab } from '@/components/students/profile/StudentOverviewTab';
import { StudentCoursesTab } from '@/components/students/profile/StudentCoursesTab';
import { StudentPerformanceTab } from '@/components/students/profile/StudentPerformanceTab';
import { StudentCommunicationTab } from '@/components/students/profile/StudentCommunicationTab';
import { StudentDocumentsTab } from '@/components/students/profile/StudentDocumentsTab';
import { StudentIEPTab } from '@/components/students/profile/StudentIEPTab';
import { StudentGoalsTab } from '@/components/students/profile/StudentGoalsTab';
import { OrgRequireRole } from '@/components/organizations/OrgRequireRole';

function StudentProfilePageContent() {
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

  const tabsData = [
    {
      value: 'overview',
      label: 'Overview',
      icon: <User className="h-4 w-4" />,
      content: <StudentOverviewTab student={student} orgId={orgId!} />
    },
    {
      value: 'goals',
      label: 'Goals',
      icon: <Target className="h-4 w-4" />,
      content: <StudentGoalsTab student={student} orgId={orgId!} />
    },
    {
      value: 'courses',
      label: 'Courses', 
      icon: <BookOpen className="h-4 w-4" />,
      content: <StudentCoursesTab student={student} orgId={orgId!} />
    },
    {
      value: 'performance',
      label: 'Performance',
      icon: <BarChart3 className="h-4 w-4" />,
      content: <StudentPerformanceTab student={student} orgId={orgId!} />
    },
    {
      value: 'communication',
      label: 'Communication',
      icon: <MessageSquare className="h-4 w-4" />,
      content: <StudentCommunicationTab student={student} orgId={orgId!} />
    },
    {
      value: 'documents',
      label: 'Documents',
      icon: <FileText className="h-4 w-4" />,
      content: <StudentDocumentsTab student={student} orgId={orgId!} />
    },
    {
      value: 'iep',
      label: 'IEP',
      icon: <ClipboardList className="h-4 w-4" />,
      content: <StudentIEPTab student={student} orgId={orgId!} />
    }
  ];

  return (
    <MobilePageLayout>
      <MobileSectionHeader
        title={student.full_name}
        subtitle={`Student ID: ${student.student_id} • ${student.grade_level || 'Grade not specified'} • ${student.status}`}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/org/${orgId}/students`)}
            className="mobile-safe-text"
          >
            <ArrowLeft className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">Back to Students</span>
          </Button>
        }
      />

      {/* Main Content */}
      <TransparentTile className="org-tile">
        <MobileOptimizedTabs
          tabs={tabsData}
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
        />
      </TransparentTile>
    </MobilePageLayout>
  );
}

export default function StudentProfilePage() {
  return (
    <OrgRequireRole roles={['owner', 'admin', 'instructor', 'instructor_aide']}>
      <StudentProfilePageContent />
    </OrgRequireRole>
  );
}