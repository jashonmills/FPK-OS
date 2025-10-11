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
import { supabase } from '@/integrations/supabase/client';

const OrgJoinPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [inviteValue, setInviteValue] = useState('');
  const [isFromEmail, setIsFromEmail] = useState(false);
  const [hasAttemptedAutoJoin, setHasAttemptedAutoJoin] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'new_user' | 'existing_user' | 'error'>('idle');
  const [invitedEmail, setInvitedEmail] = useState<string>('');
  const [organizationName, setOrganizationName] = useState<string>('');
  const { joinOrganization, isJoining } = useOrganizationInvitation();

  // Handle authentication and invitation detection with intelligent routing
  useEffect(() => {
    const validateAndRoute = async () => {
      if (loading) return;
      
      const tokenFromUrl = searchParams.get('token');
      const codeFromUrl = searchParams.get('code');
      
      if (!tokenFromUrl && !codeFromUrl) return;

      setValidationStatus('validating');
      
      try {
        // Only validate email invitations (tokens), not code invitations
        if (tokenFromUrl) {
          // Step 1: Validate the invitation token
          const { data: validateData, error: validateError } = await supabase.functions.invoke('validate-org-invite', {
            body: { token: tokenFromUrl }
          });

          if (validateError || !validateData.valid) {
            setValidationStatus('error');
            toast({ 
              title: 'Invalid Invitation', 
              description: 'This invitation link is invalid or has expired.', 
              variant: 'destructive' 
            });
            return;
          }

          const email = validateData.invited_email;
          const orgName = validateData.organization_name;
          setInvitedEmail(email);
          setOrganizationName(orgName);

          // Step 2: Check if user exists
          const { data: existsData, error: existsError } = await supabase.functions.invoke('check-email-exists', {
            body: { email }
          });

          if (existsError) {
            console.error('Error checking email:', existsError);
            throw existsError;
          }

          // Step 3: Route accordingly
          if (existsData.exists) {
            // Existing user - check if authenticated
            if (!user) {
              localStorage.setItem('pendingInvite', tokenFromUrl);
              localStorage.setItem('pendingInviteOrgName', orgName);
              navigate('/login', { 
                state: { 
                  message: `Please sign in to join ${orgName}`,
                  returnUrl: `/org/join?token=${tokenFromUrl}`
                } 
              });
            } else {
              // Already authenticated, proceed to auto-join
              setValidationStatus('existing_user');
              setInviteValue(tokenFromUrl);
              setIsFromEmail(true);
            }
          } else {
            // New user - redirect to signup
            localStorage.setItem('pendingInvite', tokenFromUrl);
            localStorage.setItem('pendingInviteEmail', email);
            localStorage.setItem('pendingInviteOrgName', orgName);
            navigate('/signup/invitation', { replace: true });
          }
        } else if (codeFromUrl) {
          // Code-based invitations: check authentication first
          setInviteValue(codeFromUrl);
          setIsFromEmail(false);
          
          if (!user) {
            localStorage.setItem('pendingInvite', codeFromUrl);
            localStorage.setItem('pendingInviteSource', 'code');
            navigate('/login', { 
              state: { returnUrl: `/org/join?code=${codeFromUrl}` } 
            });
            return;
          }
          
          setValidationStatus('existing_user');
        }
      } catch (error: any) {
        console.error('Validation error:', error);
        setValidationStatus('error');
        toast({ 
          title: 'Error', 
          description: 'Failed to process invitation. Please try again.', 
          variant: 'destructive' 
        });
      }
    };

    validateAndRoute();
  }, [searchParams, user, loading, navigate, toast]);

  // Auto-join when authenticated with invite code/token
  useEffect(() => {
    if (user && !loading && inviteValue && !isJoining && !hasAttemptedAutoJoin) {
      console.log('[OrgJoinPage] Auto-joining with invite:', inviteValue.substring(0, 8) + '...');
      setHasAttemptedAutoJoin(true);
      joinOrganization(inviteValue.trim());
    }
  }, [user, loading, inviteValue, isJoining, hasAttemptedAutoJoin, joinOrganization]);

  const handleJoinOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    await joinOrganization(inviteValue.trim());
  };

  // Show loading while checking authentication, validating, or auto-joining
  if (loading || validationStatus === 'validating' || (user && inviteValue && !hasAttemptedAutoJoin)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <div>
                <h2 className="text-xl font-semibold">
                  {loading ? 'Checking authentication...' : 
                   validationStatus === 'validating' ? 'Validating Your Invitation' : 
                   'Joining organization...'}
                </h2>
                {organizationName && validationStatus === 'validating' && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Please wait while we verify your invitation to {organizationName}...
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state
  if (validationStatus === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Invitation Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                This invitation link is invalid or has expired. Please request a new invitation from your organization administrator.
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/login')} className="flex-1">
                Back to Login
              </Button>
              <Button onClick={() => navigate('/')} className="flex-1">
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Simple standalone header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/logo.png" alt="FPK University" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold">FPK University</h1>
              <p className="text-xs text-muted-foreground">Join Organization</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/org')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="container max-w-md mx-auto px-4 py-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Send className="h-8 w-8" />
            Join Organization
          </h2>
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
      </main>
    </div>
  );
};

export default OrgJoinPage;