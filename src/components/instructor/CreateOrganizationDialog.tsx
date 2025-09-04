import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { useCreateOrganization } from '@/hooks/useOrganization';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { SUBSCRIPTION_TIERS, type OrgSubscriptionTier } from '@/types/organization';

interface CreateOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateOrganizationDialog({ 
  open, 
  onOpenChange 
}: CreateOrganizationDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTier, setSelectedTier] = useState<OrgSubscriptionTier>('basic');
  const createOrgMutation = useCreateOrganization();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create an organization.",
        variant: "destructive"
      });
      return;
    }

    try {
      await createOrgMutation.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        subscription_tier: selectedTier,
        seat_limit: SUBSCRIPTION_TIERS[selectedTier].seats,
        settings: {},
      });
      
      // Reset form
      setName('');
      setDescription('');
      setSelectedTier('basic');
      onOpenChange(false);
    } catch (error) {
      // Error handled by mutation onError callback
      console.error('Organization creation error in component:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Your Organization</DialogTitle>
          <DialogDescription>
            Set up your organization to start managing students and their learning journey.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                placeholder="Acme Learning Academy"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="A brief description of your organization..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          <div>
            <Label>Choose Your Plan</Label>
            <div className="grid gap-4 mt-3">
              {Object.entries(SUBSCRIPTION_TIERS).map(([tier, info]) => (
                <Card 
                  key={tier}
                  className={`cursor-pointer transition-all ${
                    selectedTier === tier 
                      ? 'ring-2 ring-primary border-primary' 
                      : 'hover:border-muted-foreground'
                  }`}
                  onClick={() => setSelectedTier(tier as OrgSubscriptionTier)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{info.name}</CardTitle>
                        <CardDescription>Up to {info.seats} students</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${info.price}</div>
                        <div className="text-sm text-muted-foreground">per month</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                      {info.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || createOrgMutation.isPending}
              className="flex-1"
            >
              {createOrgMutation.isPending ? 'Creating...' : 'Create Organization'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}