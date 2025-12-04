import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Users, BookOpen, ClipboardList, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function EducatorDashboard() {
  const { orgId } = useParams<{ orgId: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [educatorData, setEducatorData] = useState<any>(null);
  const [orgData, setOrgData] = useState<any>(null);
  const [studentCount, setStudentCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);

  useEffect(() => {
    const loadEducatorData = async () => {
      if (!user || !orgId) return;

      try {
        // Get educator details
        const { data: educator, error: educatorError } = await supabase
          .from('org_educators')
          .select('*, organizations!inner(name, slug)')
          .eq('linked_user_id', user.id)
          .eq('org_id', orgId)
          .single();

        if (educatorError) throw educatorError;

        setEducatorData(educator);
        setOrgData(educator.organizations);

        // Get student count for this organization
        const { count: students } = await supabase
          .from('org_students')
          .select('*', { count: 'exact', head: true })
          .eq('org_id', orgId)
          .eq('status', 'active');

        setStudentCount(students || 0);

        // Get course enrollments count - get student user IDs first
        const { data: orgStudents } = await supabase
          .from('org_students')
          .select('linked_user_id')
          .eq('org_id', orgId)
          .not('linked_user_id', 'is', null);

        const studentUserIds = orgStudents?.map(s => s.linked_user_id).filter(Boolean) || [];
        
        if (studentUserIds.length > 0) {
          const { count: enrollments } = await supabase
            .from('enrollments')
            .select('*', { count: 'exact', head: true })
            .in('user_id', studentUserIds);

          setCourseCount(enrollments || 0);
        }
        
      } catch (error) {
        console.error('Error loading educator data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEducatorData();
  }, [user, orgId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {educatorData?.full_name}
        </h1>
        <p className="text-gray-600 mt-2">
          {orgData?.name} - Educator Dashboard
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentCount}</div>
            <p className="text-xs text-muted-foreground">
              Total students in organization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Course Enrollments</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courseCount}</div>
            <p className="text-xs text-muted-foreground">
              Active course enrollments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Role</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{educatorData?.role || 'Educator'}</div>
            <p className="text-xs text-muted-foreground">
              Your role in this organization
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Access key areas of your educator portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Link to={`/org/${orgId}/students`}>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <div>
                  <h3 className="font-medium">View Students</h3>
                  <p className="text-sm text-muted-foreground">
                    Access student roster and their progress
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Link>
            <Link to={`/org/${orgId}/courses`}>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <div>
                  <h3 className="font-medium">Manage Courses</h3>
                  <p className="text-sm text-muted-foreground">
                    Review and assign courses to students
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Link>
            <Link to={`/org/${orgId}/analytics`}>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <div>
                  <h3 className="font-medium">View Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor student performance and engagement
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}