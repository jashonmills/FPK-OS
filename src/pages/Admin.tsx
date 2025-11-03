import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { InviteUserDialog } from '@/components/admin/InviteUserDialog';
import { TeamMembersTable } from '@/components/admin/TeamMembersTable';
import { FeatureFlagsTable } from '@/components/admin/FeatureFlagsTable';
import { UserRatesTable } from '@/components/admin/UserRatesTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (data?.role !== 'admin') {
          toast({
            title: 'Access Denied',
            description: 'You do not have admin privileges',
            variant: 'destructive',
          });
          navigate('/');
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error('Error checking admin role:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [user, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6 w-full overflow-x-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage team members and feature flags
            </p>
          </div>
        </div>

        <Tabs defaultValue="team" className="space-y-4 md:space-y-6 w-full">
          <TabsList className="w-full md:w-auto grid grid-cols-3">
            <TabsTrigger value="team">Team Members</TabsTrigger>
            <TabsTrigger value="rates">User Rates</TabsTrigger>
            <TabsTrigger value="features">Feature Flags</TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="space-y-4 w-full overflow-x-hidden">
            <div className="flex justify-end">
              <InviteUserDialog />
            </div>
            <Card className="w-full overflow-x-hidden">
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage your team and their roles</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <TeamMembersTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rates" className="space-y-4 w-full overflow-x-hidden">
            <UserRatesTable />
          </TabsContent>

          <TabsContent value="features" className="w-full overflow-x-hidden">
            <Card className="w-full overflow-x-hidden">
              <CardHeader>
                <CardTitle>Feature Flags</CardTitle>
                <CardDescription>Control which features are enabled or disabled</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <FeatureFlagsTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Admin;
