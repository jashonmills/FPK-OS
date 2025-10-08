import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, GraduationCap, Building2, Mail, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Entitlements {
  has_fpk_subscription: boolean;
  org_memberships: Array<{
    org_id: string;
    org_name: string;
    role: 'owner' | 'instructor' | 'student';
    status: string;
  }>;
  pending_invites: Array<{
    org_id: string;
    org_name: string;
    token: string;
    role: string;
    expires_at: string;
  }>;
  is_legacy_student: boolean;
}

export default function UserHub() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch entitlements
  const { data: entitlements, isLoading, refetch } = useQuery({
    queryKey: ['user-hub-entitlements', user?.id],
    queryFn: async () => {
      console.log('[UserHub] Fetching entitlements...');
      const { data, error } = await supabase.functions.invoke('get-user-hub-data');
      if (error) throw error;
      console.log('[UserHub] Entitlements received:', data);
      return data.data as Entitlements;
    },
    enabled: !!user && !authLoading,
  });

  // CRITICAL: Redirect legacy students immediately
  useEffect(() => {
    if (entitlements?.is_legacy_student && entitlements.org_memberships[0]) {
      const orgId = entitlements.org_memberships[0].org_id;
      console.log('[UserHub] Legacy student detected. Redirecting to:', `/org/${orgId}`);
      navigate(`/org/${orgId}`, { replace: true });
    }
  }, [entitlements, navigate]);

  // Accept invitation mutation
  const acceptInviteMutation = useMutation({
    mutationFn: async (token: string) => {
      const { data, error } = await supabase.functions.invoke('accept-org-invite', {
        body: { token }
      });

      if (error || !data?.success) {
        throw new Error(data?.error || 'Failed to accept invitation');
      }

      return data;
    },
    onSuccess: (_, token) => {
      const invite = entitlements?.pending_invites.find(i => i.token === token);
      toast({
        title: 'Invitation Accepted!',
        description: `You have joined ${invite?.org_name}`,
      });
      refetch();
      queryClient.invalidateQueries({ queryKey: ['org-memberships'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to Accept Invitation',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Decline invitation mutation
  const declineInviteMutation = useMutation({
    mutationFn: async (token: string) => {
      // Update the invite to mark as declined (set is_used = true)
      const { error } = await supabase
        .from('user_invites')
        .update({ is_used: true })
        .eq('invite_token', token);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Invitation Declined',
        description: 'The invitation has been removed',
      });
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to Decline',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render anything for legacy students (they'll be redirected)
  if (entitlements?.is_legacy_student) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Welcome Back!
          </h1>
          <p className="text-muted-foreground text-lg">Your Learning Dashboard</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* FPK University Subscription Card */}
          {entitlements?.has_fpk_subscription && (
            <Card className="hover:shadow-lg transition-shadow border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>FPK University</CardTitle>
                    <CardDescription>Premium Student Dashboard</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Access your personal courses, analytics, AI study coach, and more.
                </p>
                <Button
                  className="w-full"
                  onClick={() => navigate('/dashboard/learner')}
                >
                  Go to Student Dashboard
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Organization Memberships */}
          {entitlements?.org_memberships && entitlements.org_memberships.length > 0 && (
            <Card className="md:col-span-2 border-blue-200 dark:border-blue-900/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle>Your Organizations</CardTitle>
                    <CardDescription>Organizations you belong to</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {entitlements.org_memberships.map((membership) => {
                    const dashboardPath = membership.role === 'student'
                      ? `/org/${membership.org_id}`
                      : `/org/${membership.org_id}/admin`;

                    return (
                      <div
                        key={membership.org_id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div>
                          <p className="font-medium">{membership.org_name}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {membership.role}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => navigate(dashboardPath)}
                        >
                          Open
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pending Invitations */}
          {entitlements?.pending_invites && entitlements.pending_invites.length > 0 && (
            <Card className="md:col-span-2 border-green-200 dark:border-green-900/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle>Pending Invitations</CardTitle>
                    <CardDescription>Organizations waiting for your response</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {entitlements.pending_invites.map((invite, index) => (
                    <Alert key={index}>
                      <AlertTitle>Invitation to join {invite.org_name}</AlertTitle>
                      <AlertDescription>
                        <p className="mb-3">Role: <span className="font-medium capitalize">{invite.role}</span></p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => acceptInviteMutation.mutate(invite.token)}
                            disabled={acceptInviteMutation.isPending}
                          >
                            {acceptInviteMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                Accepting...
                              </>
                            ) : (
                              'Accept'
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => declineInviteMutation.mutate(invite.token)}
                            disabled={declineInviteMutation.isPending}
                          >
                            Decline
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Access State */}
          {!entitlements?.has_fpk_subscription &&
            (!entitlements?.org_memberships || entitlements.org_memberships.length === 0) &&
            (!entitlements?.pending_invites || entitlements.pending_invites.length === 0) && (
            <Card className="md:col-span-2">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">
                  You don't have access to any organizations or subscriptions yet.
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Button onClick={() => navigate('/pricing')}>
                    Get FPK University Subscription
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/org/join')}>
                    Join an Organization
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
