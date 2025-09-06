import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function OrgJoin() {
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleJoinOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteCode.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an invitation code.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get current user first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Please sign in to join an organization.');
      }

      // Find the invitation by code using type assertion since types aren't updated
      const { data: invitation, error: inviteError } = await supabase
        .from('org_invites' as any)
        .select(`
          *,
          organizations (
            id,
            name
          )
        `)
        .eq('code', inviteCode.trim())
        .gt('expires_at', new Date().toISOString())
        .single();

      if (inviteError || !invitation) {
        throw new Error('Invalid invitation code or expired invitation.');
      }

      // Check if invitation has reached max uses
      if ((invitation as any).uses_count >= (invitation as any).max_uses) {
        throw new Error('This invitation code has already been used the maximum number of times.');
      }

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('org_members' as any)
        .select('id')
        .eq('org_id', (invitation as any).org_id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingMember) {
        throw new Error('You are already a member of this organization.');
      }

      // Add user as member
      const { error: memberError } = await supabase
        .from('org_members' as any)
        .insert({
          org_id: (invitation as any).org_id,
          user_id: user.id,
          role: (invitation as any).role,
          status: 'active'
        });

      if (memberError) {
        throw memberError;
      }

      // Update invitation usage
      await supabase
        .from('org_invites' as any)
        .update({
          uses_count: ((invitation as any).uses_count || 0) + 1
        })
        .eq('id', (invitation as any).id);

      toast({
        title: 'Success!',
        description: `You have successfully joined ${(invitation as any).organizations.name}.`,
      });
      
      // Navigate to the organization portal
      navigate(`/org/${(invitation as any).org_id}`);
      
    } catch (error: any) {
      toast({
        title: 'Error joining organization',
        description: error.message || 'Invalid invitation code or expired invitation.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Join Organization</CardTitle>
          <CardDescription>
            Enter your invitation code to join an organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoinOrg} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inviteCode">Invitation Code</Label>
              <Input
                id="inviteCode"
                type="text"
                placeholder="Enter invitation code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Joining...' : 'Join Organization'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}