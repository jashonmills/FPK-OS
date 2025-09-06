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
      // Find the invitation by code
      const { data: invitation, error: inviteError } = await supabase
        .from('org_invitations')
        .select(`
          *,
          organizations!inner (
            id,
            name
          )
        `)
        .eq('invitation_code', inviteCode.trim())
        .eq('status', 'pending')
        .single();

      if (inviteError || !invitation) {
        throw new Error('Invalid invitation code or expired invitation.');
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Please sign in to join an organization.');
      }

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('org_members')
        .select('id')
        .eq('organization_id', invitation.organization_id)
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        throw new Error('You are already a member of this organization.');
      }

      // Add user as member
      const { error: memberError } = await supabase
        .from('org_members')
        .insert({
          organization_id: invitation.organization_id,
          user_id: user.id,
          role: 'student',
          status: 'active',
          joined_at: new Date().toISOString(),
        });

      if (memberError) {
        throw memberError;
      }

      // Update invitation usage
      await supabase
        .from('org_invitations')
        .update({
          current_uses: (invitation.current_uses || 0) + 1,
          status: ((invitation.current_uses || 0) + 1) >= (invitation.max_uses || 1) ? 'accepted' : 'pending'
        })
        .eq('id', invitation.id);

      toast({
        title: 'Success!',
        description: `You have successfully joined ${invitation.organizations.name}.`,
      });
      navigate(`/org/${invitation.organization_id}`);
      
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