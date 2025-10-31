import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Users, TrendingUp } from 'lucide-react';
import { TaskAnalytics } from '@/components/dashboard/TaskAnalytics';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6 w-full overflow-x-hidden">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Welcome to FPK Pulse
          </h1>
          <p className="text-sm md:text-lg text-muted-foreground">
            Your centralized command center for the Future-Proof Knowledge ecosystem
          </p>
        </div>

        <TaskAnalytics />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Briefcase className="h-8 w-8 text-primary mb-2" />
              <CardTitle>7 Active Projects</CardTitle>
              <CardDescription>Across the FPK ecosystem</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge>FPK University</Badge>
                <Badge>FPX Platform</Badge>
                <Badge>FPK Nexus</Badge>
                <Badge>FPK Studios</Badge>
                <Badge>FPK Connect</Badge>
                <Badge>FPK Analytics</Badge>
                <Badge>FPK Mobile</Badge>
              </div>
            </CardContent>
          </Card>

          <UpcomingDeadlines />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription>Real-time updates</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track progress, assign tasks, and collaborate seamlessly across all projects.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Smart Tracking</CardTitle>
              <CardDescription>Powered by feature flags</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Modular features that can be enabled or disabled based on your workflow needs.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
            <CardDescription>Get started with FPK Pulse in 3 easy steps</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                1
              </div>
              <div>
                <h4 className="font-medium">Select a Project</h4>
                <p className="text-sm text-muted-foreground">Choose from the 7 active FPK projects</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                2
              </div>
              <div>
                <h4 className="font-medium">Create Tasks</h4>
                <p className="text-sm text-muted-foreground">Add tasks to your Kanban board and track progress</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                3
              </div>
              <div>
                <h4 className="font-medium">Collaborate</h4>
                <p className="text-sm text-muted-foreground">Work with your team in real-time with instant updates</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Index;
