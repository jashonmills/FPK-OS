import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Send, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const OrgJoinPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [inviteCode, setInviteCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  // Get code from URL parameters on mount
  useEffect(() => {
    const codeFromUrl = searchParams.get('code') || searchParams.get('token');
    if (codeFromUrl) {
      setInviteCode(codeFromUrl);
    }
  }, [searchParams]);

  const handleJoinOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteCode.trim()) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid invitation code.",
        variant: "destructive",
      });
      return;
    }

    setIsJoining(true);
    try {
      const { data, error } = await supabase.rpc('accept_invite', {
        p_code: inviteCode.trim()
      });

      if (error) throw error;

      const result = data as any;
      if (result?.success) {
        toast({
          title: "Successfully Joined!",
          description: "You have been added to the organization.",
        });
        
        // Route based on role
        const role = result.role;
        if (role === 'owner' || role === 'instructor') {
          navigate(`/dashboard/instructor?org=${result.org_id}`);
        } else {
          navigate(`/dashboard/learner?org=${result.org_id}`);
        }
      } else {
        throw new Error(result?.error || 'Failed to join organization');
      }
    } catch (error: any) {
      console.error('Error joining organization:', error);
      
      let errorMessage = "Please check your invitation code and try again.";
      
      if (error.message?.includes('Invalid or expired')) {
        errorMessage = "This invitation code is invalid or has expired.";
      } else if (error.message?.includes('already a member')) {
        errorMessage = "You are already a member of this organization.";
      } else if (error.message?.includes('maximum capacity')) {
        errorMessage = "This organization has reached its member limit.";
      }
      
      toast({
        title: "Failed to Join",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/org')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Send className="h-8 w-8" />
          Join Organization
        </h1>
        <p className="text-muted-foreground mt-2">
          Enter your invitation code to join an organization.
        </p>
      </div>

      {/* Join Form */}
      <Card>
        <CardHeader>
          <CardTitle>Invitation Code</CardTitle>
          <CardDescription>
            Enter the code you received from the organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoinOrganization} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inviteCode">Code</Label>
              <Input
                id="inviteCode"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Enter invitation code"
                disabled={isJoining}
                className="text-center font-mono"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isJoining || !inviteCode.trim()}
            >
              {isJoining ? 'Joining...' : 'Join Organization'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Help Information */}
      <div className="space-y-4">
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>What happens next?</strong>
            <br />
            Once you join, you'll be redirected to the appropriate dashboard based on your assigned role in the organization.
          </AlertDescription>
        </Alert>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Don't have an invitation code?</strong>
            <br />
            Ask an organization owner or instructor to send you an invitation. They can create one from their organization management dashboard.
          </AlertDescription>
        </Alert>
      </div>

      {/* Alternative Actions */}
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Don't have an organization yet?
        </p>
        <Button variant="outline" onClick={() => navigate('/org/create')}>
          Create Your Own Organization
        </Button>
      </div>
    </div>
  );
};

export default OrgJoinPage;