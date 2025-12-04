import React from 'react';
import { OrgStudent } from '@/hooks/useOrgStudents';
import { useStudentStatistics } from '@/hooks/useStudentStatistics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TransparentTile } from '@/components/ui/transparent-tile';
import { User, Mail, Phone, Calendar, GraduationCap, CheckCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface StudentOverviewTabProps {
  student: OrgStudent;
  orgId: string;
}

export function StudentOverviewTab({ student, orgId }: StudentOverviewTabProps) {
  const { data: stats, isLoading } = useStudentStatistics(
    student.id,
    student.linked_user_id,
    orgId
  );

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'pending':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Basic Information */}
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Basic Information</CardTitle>
          <User className="h-4 w-4 ml-auto" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Full Name</p>
            <p className="font-medium">{student.full_name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Student ID</p>
            <p className="font-medium">{student.student_id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Grade</p>
            <p className="font-medium">{student.grade_level || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={getStatusBadgeVariant(student.status)}>
              {student.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
          <Mail className="h-4 w-4 ml-auto" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Parent Email</p>
            <p className="font-medium break-all">{student.parent_email || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Emergency Contact</p>
            <p className="font-medium">
              {student.emergency_contact 
                ? `${student.emergency_contact.name || 'Contact'} - ${student.emergency_contact.phone || 'No phone'}`
                : 'Not provided'
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Academic Status */}
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Academic Status</CardTitle>
          <GraduationCap className="h-4 w-4 ml-auto" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Enrollment Date</p>
            <p className="font-medium">
              {student.created_at ? format(new Date(student.created_at), 'MMM dd, yyyy') : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Activity</p>
            <p className="font-medium">
              {student.updated_at ? format(new Date(student.updated_at), 'MMM dd, yyyy') : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Account Status</p>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="font-medium">Active</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Quick Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-primary">{stats?.coursesAssigned || 0}</div>
                <div className="text-sm text-muted-foreground">Courses Assigned</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-primary">{stats?.coursesCompleted || 0}</div>
                <div className="text-sm text-muted-foreground">Completed Courses</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-primary">{stats?.goalsAssigned || 0}</div>
                <div className="text-sm text-muted-foreground">Goals Assigned</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-primary">{stats?.notesCount || 0}</div>
                <div className="text-sm text-muted-foreground">Notes</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Information */}
      {student.notes && (
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{student.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}