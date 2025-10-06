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
  const [inviteValue, setInviteValue] = useState('');
  const [isFromEmail, setIsFromEmail] = useState(false);
  const { joinOrganization, isJoining } = useOrganizationInvitation();

  // Handle authentication and invitation detection
  useEffect(() => {
    // Load invitation from URL
    const tokenFromUrl = searchParams.get('token');
    const codeFromUrl = searchParams.get('code');
    
    if (tokenFromUrl || codeFromUrl) {
      setInviteValue(tokenFromUrl || codeFromUrl || '');
      setIsFromEmail(!!tokenFromUrl);
    }

    // If not loading and not authenticated, store invite and redirect to login
    if (!loading && !user) {
      const invite = tokenFromUrl || codeFromUrl;
      
      if (invite) {
        localStorage.setItem('pendingInvite', invite);
        localStorage.setItem('pendingInviteSource', tokenFromUrl ? 'email' : 'code');
      }
      
      navigate('/login', { 
        state: { returnUrl: `/org/join${invite ? `?${tokenFromUrl ? 'token' : 'code'}=${invite}` : ''}` } 
      });
      return;
    }

    // If authenticated, check for pending invite from localStorage
    if (user && !tokenFromUrl && !codeFromUrl) {
      const pending = localStorage.getItem('pendingInvite');
      const source = localStorage.getItem('pendingInviteSource');
      
      if (pending) {
        setInviteValue(pending);
        setIsFromEmail(source === 'email');
        localStorage.removeItem('pendingInvite');
        localStorage.removeItem('pendingInviteSource');
      }
    }
  }, [searchParams, navigate, user, loading]);

  const handleJoinOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    await joinOrganization(inviteValue.trim());
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
          <CardTitle>Join Organization</CardTitle>
          <CardDescription>
            {isFromEmail 
              ? 'Confirm your email invitation to join the organization'
              : 'Enter your invitation code or paste the link from your email'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoinOrganization} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inviteValue">Invitation Code or Token</Label>
              <Input
                id="inviteValue"
                value={inviteValue}
                onChange={(e) => setInviteValue(e.target.value)}
                placeholder="Enter invitation code or token"
                disabled={isJoining || (isFromEmail && !!inviteValue)}
                className="text-center font-mono"
              />
              {isFromEmail && inviteValue && (
                <p className="text-xs text-muted-foreground text-center">
                  ✓ Email invitation detected
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isJoining || !inviteValue.trim()}
            >
              {isJoining ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                'Join Organization'
              )}
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