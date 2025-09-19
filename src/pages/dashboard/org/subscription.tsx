import React from 'react';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Users, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const SUBSCRIPTION_PLANS = {
  basic: {
    name: 'Basic',
    price: '$29/month',
    seats: 25,
    instructors: 5,
    features: ['Basic analytics', 'Course creation', 'Student management']
  },
  standard: {
    name: 'Standard',
    price: '$79/month',
    seats: 100,
    instructors: 15,
    features: ['Advanced analytics', 'Custom branding', 'Assignment tracking', 'Goals management']
  },
  premium: {
    name: 'Premium',
    price: '$149/month',
    seats: 500,
    instructors: 50,
    features: ['All Standard features', 'Advanced reporting', 'API access', 'Priority support']
  },
  beta: {
    name: 'Beta',
    price: 'Free',
    seats: 50,
    instructors: 20,
    features: ['All features', 'Beta testing', 'Direct feedback channel']
  }
};

export default function OrgSubscriptionPage() {
  const { currentOrg, getUserRole } = useOrgContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userRole = getUserRole();

  const changePlanMutation = useMutation({
    mutationFn: async (newPlan: string) => {
      if (!currentOrg) throw new Error('No organization selected');
      
      const { error } = await supabase.rpc('org_change_plan', {
        p_org_id: currentOrg.organization_id,
        p_plan: newPlan
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-organizations'] });
      toast({
        title: "Success",
        description: "Organization plan updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error changing plan:', error);
      toast({
        title: "Error",
        description: "Failed to update organization plan.",
        variant: "destructive",
      });
    },
  });

  if (!currentOrg) {
    return (
      <div className="w-full max-w-6xl mx-auto px-6 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Organization Selected</h1>
          <p className="text-muted-foreground">Please select an organization to view subscription details.</p>
        </div>
      </div>
    );
  }

  const currentPlan = SUBSCRIPTION_PLANS[currentOrg.organizations.plan as keyof typeof SUBSCRIPTION_PLANS] || SUBSCRIPTION_PLANS.basic;
  const isOwner = userRole === 'owner';

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subscription</h1>
          <p className="text-muted-foreground">Manage your organization's subscription plan</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <Crown className="h-4 w-4 mr-2" />
          {currentPlan.name}
        </Badge>
      </div>

      {/* Current Plan Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Current Plan: {currentPlan.name}
          </CardTitle>
          <CardDescription>
            {currentPlan.price} • {currentPlan.seats} seats • {currentPlan.instructors} instructors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Usage</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Students
                  </span>
                  <span>0 / {currentPlan.seats}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Instructors
                  </span>
                  <span>0 / {currentPlan.instructors}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Features</h3>
              <ul className="space-y-1">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      {isOwner && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
              <Card key={key} className={currentOrg.organizations.plan === key ? 'ring-2 ring-primary' : ''}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription className="text-2xl font-bold text-primary">
                    {plan.price}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm space-y-1">
                    <p>{plan.seats} student seats</p>
                    <p>{plan.instructors} instructors</p>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-xs">
                        <Check className="h-3 w-3 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={currentOrg.organizations.plan === key ? "secondary" : "outline"}
                    className="w-full"
                    disabled={currentOrg.organizations.plan === key || changePlanMutation.isPending}
                    onClick={() => changePlanMutation.mutate(key)}
                  >
                    {currentOrg.organizations.plan === key ? 'Current Plan' : 'Select Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!isOwner && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Only organization owners can change subscription plans.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}