import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAcceptInvitation, AcceptInviteResult } from '@/hooks/useInvitationSystem';

export default function OrgJoin() {
  const [inviteCode, setInviteCode] = useState('');
  const acceptInviteMutation = useAcceptInvitation();
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

    try {
      const result = await acceptInviteMutation.mutateAsync(inviteCode.trim());
      
      if ((result as AcceptInviteResult).success) {
        // Navigate to the organization portal
        navigate(`/org/${(result as AcceptInviteResult).org_id}`);
      }
    } catch (error) {
      // Error handled by mutation
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
                disabled={acceptInviteMutation.isPending}
              />
            </div>
            <Button type="submit" className="w-full" disabled={acceptInviteMutation.isPending}>
              {acceptInviteMutation.isPending ? 'Joining...' : 'Join Organization'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}