import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Building2, Users, CreditCard, Crown, Zap } from 'lucide-react';

interface AdminOrgCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  seats: number;
  features: string[];
  icon: React.ReactNode;
  badge?: string;
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    seats: 3,
    features: ['Basic analytics', 'Course assignments', 'Email support'],
    icon: <Users className="h-4 w-4" />
  },
  {
    id: 'standard', 
    name: 'Standard',
    price: 79,
    seats: 10,
    features: ['Advanced analytics', 'Goal tracking', 'Priority support', 'Custom branding'],
    icon: <Building2 className="h-4 w-4" />
  },
  {
    id: 'premium',
    name: 'Premium', 
    price: 149,
    seats: 25,
    features: ['Full analytics suite', 'Advanced reporting', 'Dedicated support', 'API access'],
    icon: <Crown className="h-4 w-4" />
  },
  {
    id: 'beta',
    name: 'Beta',
    price: 0,
    seats: 25,
    features: ['Premium features', 'Early access', 'Beta testing', 'Direct feedback channel'],
    icon: <Zap className="h-4 w-4" />,
    badge: 'Free [Beta] - Limited Time'
  }
];

export const AdminOrgCreationModal: React.FC<AdminOrgCreationModalProps> = ({
  open,
  onOpenChange
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subscriptionTier: '',
    customSeatLimit: '',
    ownerEmail: ''
  });

  const createOrgMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      logger.info('Creating organization', 'ADMIN', { data });
      
      const selectedTier = subscriptionTiers.find(t => t.id === data.subscriptionTier);
      if (!selectedTier) throw new Error('Invalid subscription tier');

      const seatLimit = data.customSeatLimit ? 
        parseInt(data.customSeatLimit) : 
        selectedTier.seats;

      // First, find or validate the owner user
      let ownerId = null;
      if (data.ownerEmail) {
        // Try to find user by email in profiles first
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .ilike('full_name', `%${data.ownerEmail.split('@')[0]}%`)
          .limit(5);

        if (profiles && profiles.length > 0) {
          ownerId = profiles[0].id;
        } else {
          throw new Error(`No user found matching email ${data.ownerEmail}. User must have an existing profile in the system.`);
        }
      }

      // Create the organization
      const orgData = {
        name: data.name,
        description: data.description || null,
        subscription_tier: data.subscriptionTier as 'basic' | 'standard' | 'premium' | 'beta',
        seat_limit: seatLimit,
        seats_used: 0,
        owner_id: ownerId
      };

      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert(orgData)
        .select()
        .single();

      if (orgError) throw orgError;

      // If owner specified, add them as organization member
      if (ownerId) {
        const { error: memberError } = await supabase
          .from('org_members')
          .insert({
            org_id: org.id,
            user_id: ownerId,
            role: 'owner',
            status: 'active'
          });

        if (memberError) {
          console.error('Error adding owner as member:', memberError);
          // Don't throw - org was created successfully
        }
      }

      return org;
    },
    onSuccess: (org) => {
      toast({
        title: "Organization created",
        description: `${org.name} has been created successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create organization. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      subscriptionTier: '',
      customSeatLimit: '',
      ownerEmail: ''
    });
  };

  const selectedTier = subscriptionTiers.find(t => t.id === formData.subscriptionTier);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.subscriptionTier) {
      toast({
        title: "Validation Error",
        description: "Organization name and subscription tier are required.",
        variant: "destructive",
      });
      return;
    }
    createOrgMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Create New Organization</span>
          </DialogTitle>
          <DialogDescription>
            Create a new organization and assign subscription tier. You can assign an existing user as the organization owner.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Organization Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter organization name"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="ownerEmail">Owner Email</Label>
              <Input
                id="ownerEmail"
                type="email"
                value={formData.ownerEmail}
                onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                placeholder="owner@example.com (optional)"
              />
              <p className="text-xs text-muted-foreground mt-1">
                If specified, this user will be assigned as the organization owner
              </p>
            </div>
          </div>

          <Separator />

          {/* Subscription Tier Selection */}
          <div className="space-y-4">
            <Label>Subscription Tier *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subscriptionTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    formData.subscriptionTier === tier.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setFormData({ ...formData, subscriptionTier: tier.id, customSeatLimit: '' })}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {tier.icon}
                      <span className="font-medium">{tier.name}</span>
                    </div>
                    {tier.badge ? (
                      <Badge variant="secondary" className="text-xs">
                        {tier.badge}
                      </Badge>
                    ) : (
                      <div className="text-lg font-bold">
                        ${tier.price}<span className="text-sm font-normal">/mo</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1 mb-2">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {tier.seats} seats
                    </span>
                  </div>

                  <ul className="text-xs text-muted-foreground space-y-1">
                    {tier.features.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Seat Limit */}
          {selectedTier && (
            <div>
              <Label htmlFor="customSeatLimit">
                Custom Seat Limit (optional)
              </Label>
              <Input
                id="customSeatLimit"
                type="number"
                min="1"
                max="1000"
                value={formData.customSeatLimit}
                onChange={(e) => setFormData({ ...formData, customSeatLimit: e.target.value })}
                placeholder={`Default: ${selectedTier.seats} seats`}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Override the default seat limit for this organization
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createOrgMutation.isPending}
              className="fpk-gradient text-white"
            >
              {createOrgMutation.isPending ? 'Creating...' : 'Create Organization'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};