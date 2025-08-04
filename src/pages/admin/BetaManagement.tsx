import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import QATestRunner from '@/components/beta/QATestRunner';
import BetaOnboarding from '@/components/beta/BetaOnboarding';
import FeedbackSystem from '@/components/beta/FeedbackSystem';
import SendBetaUpdate from '@/components/admin/SendBetaUpdate';
import TestFeedbackSystem from '@/components/admin/TestFeedbackSystem';
import { Users, MessageSquare, Settings, TestTube, Send, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const BetaManagement = () => {
  const { user } = useAuth();
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);

  // Fetch beta users with real-time updates
  const { data: betaUsers, refetch: refetchUsers } = useQuery({
    queryKey: ['beta-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('beta_access', true);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Real-time subscription for beta user changes
  useEffect(() => {
    const channel = supabase
      .channel('beta-users-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: 'beta_access=eq.true'
        },
        (payload) => {
          console.log('Real-time beta user update:', payload);
          refetchUsers();
          if (payload.eventType === 'INSERT') {
            toast.success('New beta user added!');
          } else if (payload.eventType === 'UPDATE') {
            toast.info('Beta user updated');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchUsers]);

  // Fetch feedback submissions with real-time updates
  const { data: feedbackList, refetch: refetchFeedback } = useQuery({
    queryKey: ['beta-feedback'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .like('category', 'beta_%')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Real-time subscription for feedback submissions
  useEffect(() => {
    const channel = supabase
      .channel('beta-feedback-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_submissions',
          filter: 'category=like.beta_%'
        },
        (payload) => {
          console.log('Real-time feedback update:', payload);
          refetchFeedback();
          toast.success('New beta feedback received!');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchFeedback]);

  const grantBetaAccess = async (email: string) => {
    try {
      // First get the user ID from auth.users
      const { data: authData, error: authError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user?.id)
        .single();

      if (authError) throw authError;

      // Grant beta access
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: authData.id,
          beta_access: true,
          beta_invite_code: 'ADMIN_GRANTED'
        } as any);

      if (error) throw error;
      
      toast.success('Beta access granted successfully');
      refetchUsers();
    } catch (error) {
      toast.error('Failed to grant beta access');
      console.error(error);
    }
  };

  const updateFeedbackStatus = async (feedbackId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', feedbackId);

      if (error) throw error;
      
      toast.success('Feedback status updated');
      refetchFeedback();
    } catch (error) {
      toast.error('Failed to update feedback status');
      console.error(error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'closed':
        return <XCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <MessageSquare className="w-4 h-4 text-orange-600" />;
    }
  };

  const getFeedbackTypeColor = (category: string) => {
    if (category.includes('bug')) return 'destructive';
    if (category.includes('feature')) return 'default';
    if (category.includes('urgent')) return 'destructive';
    return 'secondary';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Beta Program Management</h1>
          <p className="text-muted-foreground">Manage beta users, feedback, and platform testing</p>
        </div>
        <Badge variant="destructive" className="text-lg px-4 py-2">
          BETA ADMIN
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Beta Users</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="testing">QA Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Beta Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{betaUsers?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Active beta testers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Feedback Items</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{feedbackList?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Total submissions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Issues</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {feedbackList?.filter(f => f.status === 'new').length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Needs attention</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common beta management tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SendBetaUpdate />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    // Trigger onboarding modal manually
                    const onboarding = document.querySelector('[data-onboarding-trigger]');
                    if (onboarding) (onboarding as HTMLElement).click();
                  }}
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  Preview Onboarding Flow
                </Button>
                <BetaOnboarding autoShow={false} />
                <TestFeedbackSystem />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Feedback</CardTitle>
                <CardDescription>Latest submissions from beta users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {feedbackList?.slice(0, 5).map((feedback) => (
                    <div key={feedback.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(feedback.status)}
                        <div>
                          <div className="font-medium text-sm">{feedback.name}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-48">
                            {feedback.message}
                          </div>
                        </div>
                      </div>
                      <Badge variant={getFeedbackTypeColor(feedback.category)} className="text-xs">
                        {feedback.category.replace('beta_', '')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Beta User Management</CardTitle>
              <CardDescription>Manage access and permissions for beta testers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Grant Beta Access</label>
                    <div className="flex space-x-2">
                      <Input placeholder="user@example.com" />
                      <Button onClick={() => grantBetaAccess('')}>
                        Grant Access
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Current Beta Users</h3>
                  <div className="space-y-2">
                    {betaUsers?.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{user.full_name || 'Beta User'}</div>
                            <div className="text-sm text-muted-foreground">{user.id}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{user.beta_invite_code || 'MANUAL'}</Badge>
                          {user.onboarding_completed && (
                            <Badge variant="secondary">Onboarded</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Beta Feedback Management</CardTitle>
              <CardDescription>Review and respond to feedback from beta users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedbackList?.map((feedback) => (
                  <Card key={feedback.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(feedback.status)}
                        <div>
                          <div className="font-medium">{feedback.name}</div>
                          <div className="text-sm text-muted-foreground">{feedback.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getFeedbackTypeColor(feedback.category)}>
                          {feedback.category.replace('beta_', '')}
                        </Badge>
                        <Select 
                          value={feedback.status}
                          onValueChange={(value) => updateFeedbackStatus(feedback.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="text-sm mb-3">{feedback.message}</div>
                    <div className="text-xs text-muted-foreground">
                      Submitted: {new Date(feedback.created_at).toLocaleString()}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <QATestRunner />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BetaManagement;