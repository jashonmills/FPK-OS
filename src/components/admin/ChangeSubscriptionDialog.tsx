import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Users, Check, ArrowUpDown } from 'lucide-react';
import { useOrganizationActions } from '@/hooks/useOrganizationActions';
import { SUBSCRIPTION_TIERS } from '@/types/organization';
import type { Organization, OrgSubscriptionTier } from '@/types/organization';

interface ChangeSubscriptionDialogProps {
  organization: Organization;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const subscriptionSchema = z.object({
  new_tier: z.enum(['basic', 'standard', 'premium', 'beta']),
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

export function ChangeSubscriptionDialog({ organization, open, onOpenChange }: ChangeSubscriptionDialogProps) {
  const { changeSubscriptionTier } = useOrganizationActions();
  
  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      new_tier: organization.plan,
    },
  });

  const watchedTier = form.watch('new_tier');
  const currentTier = organization.plan;
  const isUpgrade = getTierLevel(watchedTier) > getTierLevel(currentTier);
  const isDowngrade = getTierLevel(watchedTier) < getTierLevel(currentTier);
  const isNoChange = watchedTier === currentTier;

  function getTierLevel(tier: OrgSubscriptionTier): number {
    const levels = { basic: 1, standard: 2, premium: 3, beta: 4 };
    return levels[tier] || 0;
  }

  const onSubmit = async (data: SubscriptionFormData) => {
    try {
      await changeSubscriptionTier.mutateAsync({
        organizationId: organization.id,
        tier: data.new_tier,
      });
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const getTierBadgeVariant = (tier: OrgSubscriptionTier) => {
    switch (tier) {
      case 'basic': return 'secondary';
      case 'standard': return 'default';
      case 'premium': return 'default';
      case 'beta': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-background border border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <CreditCard className="h-5 w-5" />
            Change Subscription Tier
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Modify the subscription tier for this organization. Changes will be reflected immediately.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Current Subscription Info */}
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <h4 className="font-medium text-foreground mb-3">Current Subscription</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getTierBadgeVariant(currentTier)}>
                        {SUBSCRIPTION_TIERS[currentTier].name}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        ${SUBSCRIPTION_TIERS[currentTier].price}/month
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {organization.seats_used} / {organization.seat_cap} seats used
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      <div className="font-medium">Features:</div>
                      <ul className="list-disc list-inside space-y-1 mt-1">
                        {SUBSCRIPTION_TIERS[currentTier].features.slice(0, 2).map((feature, index) => (
                          <li key={index} className="text-xs">{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tier Selection */}
              <FormField
                control={form.control}
                name="new_tier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">New Subscription Tier</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-input border-border text-foreground">
                          <SelectValue placeholder="Select new tier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background border border-border">
                        {Object.entries(SUBSCRIPTION_TIERS).map(([key, tier]) => (
                          <SelectItem key={key} value={key} className="hover:bg-muted">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2">
                                <Badge variant={getTierBadgeVariant(key as OrgSubscriptionTier)} className="text-xs">
                                  {tier.name}
                                </Badge>
                                <span className="text-sm">${tier.price}/month</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {tier.seats} seats
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Preview of Changes */}
              {!isNoChange && (
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium text-foreground">
                      {isUpgrade ? 'Upgrade' : 'Downgrade'} Preview
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-foreground mb-2">Changes:</div>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Seats: {SUBSCRIPTION_TIERS[currentTier].seats} → {SUBSCRIPTION_TIERS[watchedTier].seats}</li>
                        <li>• Price: ${SUBSCRIPTION_TIERS[currentTier].price} → ${SUBSCRIPTION_TIERS[watchedTier].price}/month</li>
                        <li className={isUpgrade ? 'text-success' : 'text-warning'}>
                          • {isUpgrade ? 'Additional features unlocked' : 'Some features may be limited'}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <div className="font-medium text-foreground mb-2">New Features:</div>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs">
                        {SUBSCRIPTION_TIERS[watchedTier].features.slice(0, 3).map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Information */}
              <div className="rounded-lg border border-info/20 bg-info/5 p-4">
                <h4 className="font-medium text-info mb-2">Billing Information:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Changes take effect immediately</li>
                  <li>• {isUpgrade ? 'Pro-rated charges will apply for the upgrade' : 'Credits will be applied for downgrade'}</li>
                  <li>• Next billing cycle: Based on current billing date</li>
                  <li>• Organization owner will receive email confirmation</li>
                </ul>
              </div>

              {/* Seat Warning */}
              {SUBSCRIPTION_TIERS[watchedTier].seats < organization.seats_used && (
                <div className="rounded-lg border border-warning/20 bg-warning/5 p-4">
                  <h4 className="font-medium text-warning mb-2">⚠️ Seat Limit Warning</h4>
                  <p className="text-sm text-muted-foreground">
                    The selected tier allows {SUBSCRIPTION_TIERS[watchedTier].seats} seats, but this organization 
                    currently has {organization.seats_used} active members. Some members may lose access.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="border-border text-muted-foreground hover:bg-muted"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isNoChange || changeSubscriptionTier.isPending}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {changeSubscriptionTier.isPending 
                  ? 'Updating...' 
                  : isNoChange 
                    ? 'No Changes'
                    : `${isUpgrade ? 'Upgrade' : 'Downgrade'} Subscription`
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}