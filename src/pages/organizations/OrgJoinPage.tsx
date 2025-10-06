import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Send, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useOrganizationInvitation } from '@/hooks/useOrganizationInvitation';

const OrgJoinPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [inviteCode, setInviteCode] = useState('');
  const [inviteType, setInviteType] = useState<'code' | 'token' | null>(null);
  const { joinWithCode, joinWithToken, isJoining } = useOrganizationInvitation();

  // Check authentication and get code/token from URL parameters
  useEffect(() => {
    if (!loading && !user) {
      // Store the invite code/token and redirect to login
      const codeFromUrl = searchParams.get('code');
      const tokenFromUrl = searchParams.get('token');
      const inviteValue = tokenFromUrl || codeFromUrl;
      
      if (inviteValue) {
        localStorage.setItem('pendingInviteCode', inviteValue);
        localStorage.setItem('pendingInviteType', tokenFromUrl ? 'token' : 'code');
      }
      
      const paramName = tokenFromUrl ? 'token' : 'code';
      navigate('/auth', { 
        state: { 
          returnUrl: '/org/join' + (inviteValue ? `?${paramName}=${inviteValue}` : '') 
        } 
      });
      return;
    }

    // Get code/token from URL parameters on mount
    const codeFromUrl = searchParams.get('code');
    const tokenFromUrl = searchParams.get('token');
    
    if (tokenFromUrl) {
      setInviteCode(tokenFromUrl);
      setInviteType('token');
    } else if (codeFromUrl) {
      setInviteCode(codeFromUrl);
      setInviteType('code');
    } else {
      // Check if there's a pending invite from localStorage
      const pendingCode = localStorage.getItem('pendingInviteCode');
      const pendingType = localStorage.getItem('pendingInviteType') as 'code' | 'token' | null;
      
      if (pendingCode && pendingType) {
        setInviteCode(pendingCode);
        setInviteType(pendingType);
        localStorage.removeItem('pendingInviteCode');
        localStorage.removeItem('pendingInviteType');
      }
    }
  }, [searchParams, navigate, user, loading]);

  const handleJoinOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteCode.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid invitation code or token.",
        variant: "destructive",
      });
      return;
    }

    // Route to appropriate handler based on invite type
    if (inviteType === 'token') {
      await joinWithToken(inviteCode.trim());
    } else {
      await joinWithCode(inviteCode.trim());
    }
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="max-w-md mx-auto space-y-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

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
          <CardTitle>
            {inviteType === 'token' ? 'Email Invitation' : 'Invitation Code'}
          </CardTitle>
          <CardDescription>
            {inviteType === 'token' 
              ? 'Confirm your email invitation to join the organization'
              : 'Enter the code you received from the organization'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoinOrganization} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inviteCode">
                {inviteType === 'token' ? 'Token' : 'Code'}
              </Label>
              <Input
                id="inviteCode"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder={inviteType === 'token' ? 'Email invitation token' : 'Enter invitation code'}
                disabled={isJoining || inviteType === 'token'}
                className="text-center font-mono"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isJoining || !inviteCode.trim()}
            >
              {isJoining ? 'Joining...' : (inviteType === 'token' ? 'Accept Invitation' : 'Join Organization')}
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