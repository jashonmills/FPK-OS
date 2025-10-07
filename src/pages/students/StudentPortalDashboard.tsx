import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, BookOpen, Award, Target, LogOut } from 'lucide-react';
import { useOrgBranding } from '@/hooks/useOrgBranding';
import { toast } from 'sonner';

export default function StudentPortalDashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orgId = searchParams.get('org');
  
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<any>(null);
  const [orgData, setOrgData] = useState<any>(null);
  
  const { data: branding } = useOrgBranding(orgId);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          toast.error('Please log in to continue');
          navigate(`/`);
          return;
        }

        // Get organization data
        if (orgId) {
          const { data: org, error: orgError } = await supabase
            .from('organizations')
            .select('id, name, slug')
            .eq('id', orgId)
            .single();

          if (orgError) {
            console.error('Error loading organization:', orgError);
          } else {
            setOrgData(org);
          }

          // Get student profile
          const { data: student, error: studentError } = await supabase
            .from('org_students')
            .select('*')
            .eq('linked_user_id', user.id)
            .eq('org_id', orgId)
            .maybeSingle();

          if (studentError) {
            console.error('Error loading student:', studentError);
          } else {
            setStudentData(student);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard:', error);
        setLoading(false);
      }
    };

    loadStudentData();
  }, [orgId, navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      navigate(orgData?.slug ? `/${orgData.slug}/login` : '/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const accentColor = branding?.theme_accent || 'hsl(var(--primary))';

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5"
      style={{
        background: `linear-gradient(135deg, ${accentColor}10 0%, hsl(var(--background)) 50%, ${accentColor}05 100%)`
      }}
    >
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {branding?.logo_url && (
              <img 
                src={branding.logo_url} 
                alt={orgData?.name}
                className="h-10 w-auto"
              />
            )}
            <div>
              <h1 className="font-bold text-lg">{orgData?.name}</h1>
              <p className="text-sm text-muted-foreground">Student Portal</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <Avatar className="h-16 w-16">
              <AvatarFallback 
                className="text-xl font-semibold"
                style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
              >
                {studentData?.full_name ? getInitials(studentData.full_name) : '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-3xl font-bold">
                Welcome, {studentData?.full_name || 'Student'}!
              </h2>
              <p className="text-muted-foreground">
                {orgData?.name} Learning Portal
              </p>
            </div>
          </div>
          {studentData?.grade_level && (
            <Badge variant="secondary" className="mt-2">
              Grade {studentData.grade_level}
            </Badge>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Assigned courses
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <p className="text-xs text-muted-foreground">
                Overall completion
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Badges earned
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>
                Your assigned learning materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  No courses assigned yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Check back soon or contact your instructor
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your learning progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  No activity yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Start a course to see your progress
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Here's what you can do on your student portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Access Your Courses</h4>
                  <p className="text-sm text-muted-foreground">
                    View and complete courses assigned by your instructor
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Track Your Progress</h4>
                  <p className="text-sm text-muted-foreground">
                    Monitor your learning journey and achievements
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Award className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Earn Badges</h4>
                  <p className="text-sm text-muted-foreground">
                    Complete courses and activities to unlock achievements
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
