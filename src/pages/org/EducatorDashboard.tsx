import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Users, BookOpen, ClipboardList } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function EducatorDashboard() {
  const { orgId } = useParams<{ orgId: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [educatorData, setEducatorData] = useState<any>(null);
  const [orgData, setOrgData] = useState<any>(null);

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

        // TODO: Load additional educator-specific data (students, courses, etc.)
        
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
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Total students assigned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Active course assignments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Pending reviews
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Welcome to your educator portal. Here are some quick actions to help you get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">View Students</h3>
                <p className="text-sm text-muted-foreground">
                  Access your assigned students and their progress
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Manage Courses</h3>
                <p className="text-sm text-muted-foreground">
                  Review and assign courses to students
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Track Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor student performance and analytics
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}