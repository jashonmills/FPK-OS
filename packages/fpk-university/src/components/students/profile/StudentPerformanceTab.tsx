import React from 'react';
import { OrgStudent } from '@/hooks/useOrgStudents';
import { useStudentStatistics } from '@/hooks/useStudentStatistics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Clock, Target, Loader2 } from 'lucide-react';

interface StudentPerformanceTabProps {
  student: OrgStudent;
  orgId: string;
}

export function StudentPerformanceTab({ student, orgId }: StudentPerformanceTabProps) {
  const { data: stats, isLoading } = useStudentStatistics(
    student.id,
    student.linked_user_id,
    orgId
  );

  const completionRate = stats && stats.coursesAssigned > 0
    ? Math.round((stats.coursesCompleted / stats.coursesAssigned) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
                <Target className="h-4 w-4 ml-auto" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.averageGrade || 0}%</div>
                <p className="text-xs text-muted-foreground">Across all courses</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <BarChart3 className="h-4 w-4 ml-auto" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.coursesCompleted || 0} of {stats?.coursesAssigned || 0} courses
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Goals Progress</CardTitle>
                <Target className="h-4 w-4 ml-auto" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.goalsCompleted || 0}/{stats?.goalsAssigned || 0}</div>
                <p className="text-xs text-muted-foreground">Goals completed</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
                <Clock className="h-4 w-4 ml-auto" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.studyHours || 0}h</div>
                <p className="text-xs text-muted-foreground">Total recorded</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Course Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Course Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Performance Data Coming Soon</h3>
            <p>Course-specific performance metrics will be available once the student completes assignments.</p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Recent Activity</h3>
            <p>Student activity and engagement data will appear here once courses are accessed.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}