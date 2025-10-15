import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useFamily } from '@/contexts/FamilyContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CreditCard, Users, GraduationCap, HardDrive, TrendingUp, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAICredits } from '@/hooks/useAICredits';

export const SubscriptionTab = () => {
  const { selectedFamily } = useFamily();
  const navigate = useNavigate();
  const { balance } = useAICredits();

  const { data: familyData } = useQuery({
    queryKey: ['family-subscription', selectedFamily?.id],
    queryFn: async () => {
      if (!selectedFamily?.id) return null;
      
      const { data, error } = await supabase
        .from('families')
        .select('*')
        .eq('id', selectedFamily.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!selectedFamily?.id,
  });

  const { data: memberCount } = useQuery({
    queryKey: ['family-member-count', selectedFamily?.id],
    queryFn: async () => {
      if (!selectedFamily?.id) return 0;
      
      const { count, error } = await supabase
        .from('family_members')
        .select('*', { count: 'exact', head: true })
        .eq('family_id', selectedFamily.id);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!selectedFamily?.id,
  });

  const { data: studentCount } = useQuery({
    queryKey: ['family-student-count', selectedFamily?.id],
    queryFn: async () => {
      if (!selectedFamily?.id) return 0;
      
      const { count, error } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('family_id', selectedFamily.id)
        .eq('is_active', true);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!selectedFamily?.id,
  });

  const handleSyncSubscription = async () => {
    try {
      toast.loading('Syncing subscription from Stripe...');
      
      const { data, error } = await supabase.functions.invoke('sync-subscription-tier', {
        body: {
          familyId: selectedFamily?.id,
        },
      });

      if (error) throw error;

      toast.dismiss();
      if (data.success) {
        toast.success(`Subscription synced! You're now on the ${data.tier} tier with ${data.max_students === -1 ? 'unlimited' : data.max_students} student slots.`);
        // Refetch family data
        window.location.reload();
      }
    } catch (error) {
      toast.dismiss();
      console.error('Sync error:', error);
      toast.error('Failed to sync subscription. Please try again or contact support.');
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-subscription', {
        body: {
          action: 'create_portal',
          familyId: selectedFamily?.id,
        },
      });

      if (error) throw error;

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Portal error:', error);
      toast.error('Failed to open subscription portal. Please try again.');
    }
  };

  if (!familyData) {
    return <div>Loading subscription details...</div>;
  }

  const tier = familyData.subscription_tier || 'free';
  const status = familyData.subscription_status || 'active';
  const maxStudents = familyData.max_students || 1;
  const maxUsers = tier === 'free' ? 2 : tier === 'team' ? 10 : -1;
  const storageLimit = familyData.storage_limit_mb || 500;

  const tierNames = {
    free: 'Family (Free)',
    team: 'Collaborative Team',
    pro: 'Insights Pro',
  };

  const tierColors = {
    free: 'bg-muted',
    team: 'bg-primary',
    pro: 'bg-purple-500',
  };

  const statusColors = {
    active: 'bg-green-500',
    past_due: 'bg-yellow-500',
    canceled: 'bg-red-500',
  };

  const studentUsage = maxStudents === -1 ? 0 : ((studentCount || 0) / maxStudents) * 100;
  const userUsage = maxUsers === -1 ? 0 : ((memberCount || 0) / maxUsers) * 100;

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Current Plan
              </CardTitle>
              <CardDescription className="mt-2">
                Manage your subscription and billing
              </CardDescription>
            </div>
            <Badge className={tierColors[tier as keyof typeof tierColors]}>
              {tierNames[tier as keyof typeof tierNames]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status</span>
            <Badge variant="outline" className={statusColors[status as keyof typeof statusColors]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>

          {tier !== 'free' && (
            <div className="space-y-2">
              <Button onClick={handleManageSubscription} className="w-full">
                Manage Subscription
              </Button>
              <Button onClick={handleSyncSubscription} variant="outline" className="w-full">
                Sync from Stripe
              </Button>
            </div>
          )}
          
          {tier === 'free' && familyData.stripe_customer_id && (
            <Button onClick={handleSyncSubscription} variant="outline" className="w-full">
              Sync Subscription from Stripe
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Usage Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Credits */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI Credits
              </span>
              <span className="font-medium">
                {balance?.total_credits?.toLocaleString() || 0} 
                <span className="text-muted-foreground text-xs ml-1">
                  (Monthly: {balance?.monthly_credits?.toLocaleString() || 0} + 
                  Purchased: {balance?.purchased_credits?.toLocaleString() || 0})
                </span>
              </span>
            </div>
            <Progress 
              value={balance?.monthly_allowance 
                ? ((balance?.monthly_credits || 0) / balance.monthly_allowance) * 100 
                : 0
              } 
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Monthly allowance resets on billing cycle</span>
              <Button 
                variant="link" 
                size="sm" 
                className="h-auto p-0"
                onClick={() => navigate('/settings?tab=credits')}
              >
                Buy More Credits
              </Button>
            </div>
          </div>

          {/* Students */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Student Profiles
              </span>
              <span className="font-medium">
                {studentCount} of {maxStudents === -1 ? '∞' : maxStudents}
              </span>
            </div>
            {maxStudents !== -1 && <Progress value={studentUsage} />}
          </div>

          {/* Users */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                User Accounts
              </span>
              <span className="font-medium">
                {memberCount} of {maxUsers === -1 ? '∞' : maxUsers}
              </span>
            </div>
            {maxUsers !== -1 && <Progress value={userUsage} />}
          </div>

          {/* Storage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                Storage
              </span>
              <span className="font-medium">
                0 MB of {storageLimit} MB
              </span>
            </div>
            <Progress value={0} />
            <p className="text-xs text-muted-foreground">
              Storage usage will be calculated based on uploaded files
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Prompt */}
      {tier === 'free' && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle>Unlock More Features</CardTitle>
            <CardDescription>
              Upgrade to Collaborative Team or Insights Pro for more students, users, and AI-powered insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => navigate('/pricing-authenticated')}>
              View Plans & Pricing
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
