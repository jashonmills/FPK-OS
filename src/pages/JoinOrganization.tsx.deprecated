import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Users, CheckCircle, XCircle, Building2, Clock, Shield } from 'lucide-react';

interface InviteValidation {
  valid: boolean;
  inviteId?: string;
  invitedEmail?: string;
  role?: 'student' | 'instructor';
  organization?: {
    id: string;
    name: string;
    description: string | null;
    logoUrl: string | null;
    plan: string;
  };
  expiresAt?: string;
  error?: string;
}

export function JoinOrganization() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [status, setStatus] = useState<'validating' | 'ready' | 'accepting' | 'success' | 'error' | 'input'>('validating');
  const [errorMessage, setErrorMessage] = useState('');
  const [inviteData, setInviteData] = useState<InviteValidation | null>(null);
  const [manualToken, setManualToken] = useState('');
  const [acceptResult, setAcceptResult] = useState<{ orgId?: string; orgName?: string; orgSlug?: string }>({});

  // Get token from URL query params
  const token = searchParams.get('token');

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        console.log('No token provided, showing input form');
        setStatus('input');
        return;
      }

      console.log('Validating token:', token.substring(0, 8) + '...');
      setStatus('validating');

      try {
        // Call validate-org-invite edge function
        const { data, error } = await supabase.functions.invoke('validate-org-invite', {
          body: { token },
        });

        if (error) throw error;

        if (!data.valid) {
          console.error('Invalid token:', data.error);
          setErrorMessage(data.error || 'Invalid invitation link');
          setStatus('error');
          return;
        }

        console.log('Token validated successfully:', data);
        setInviteData(data);

        // Check if user is authenticated
        if (!user) {
          console.log('User not authenticated, redirecting to login');
          navigate(`/login?redirect=${encodeURIComponent(`/join?token=${token}`)}`);
          return;
        }

        // Check if user email matches invited email
        const userEmail = user.email?.toLowerCase();
        const invitedEmail = data.invitedEmail?.toLowerCase();

        if (userEmail !== invitedEmail) {
          setErrorMessage(`This invitation was sent to ${data.invitedEmail}. Please sign in with that email address.`);
          setStatus('error');
          return;
        }

        setStatus('ready');
      } catch (error: any) {
        console.error('Error validating token:', error);
        setErrorMessage(error.message || 'Failed to validate invitation');
        setStatus('error');
      }
    };

    validateToken();
  }, [token, user, navigate]);

  const handleAcceptInvitation = async () => {
    if (!token) return;

    setStatus('accepting');

    try {
      console.log('Accepting invitation with token:', token.substring(0, 8) + '...');

      const { data, error } = await supabase.functions.invoke('accept-org-invite', {
        body: { token },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to accept invitation');
      }

      console.log('Invitation accepted successfully:', data);
      setAcceptResult({
        orgId: data.orgId,
        orgName: data.orgName,
        orgSlug: data.orgSlug,
      });
      setStatus('success');

      // Redirect after 2 seconds
      setTimeout(() => {
        const dashboardPath = data.orgSlug 
          ? `/org/${data.orgSlug}/dashboard`
          : data.dashboardUrl || '/dashboard';
        navigate(dashboardPath, { replace: true });
      }, 2000);

    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      setErrorMessage(error.message || 'Failed to accept invitation');
      setStatus('error');
    }
  };

  const handleManualTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualToken.trim()) return;

    // Extract token if user pasted full URL
    let extractedToken = manualToken.trim();
    if (extractedToken.includes('token=')) {
      const urlParams = new URLSearchParams(extractedToken.split('?')[1]);
      extractedToken = urlParams.get('token') || extractedToken;
    }

    // Navigate with token parameter
    navigate(`/join?token=${extractedToken}`, { replace: true });
  };

  if (status === 'validating') {
    return (
      <div className="container max-w-md mx-auto mt-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium">Validating invitation...</p>
            <p className="text-sm text-muted-foreground text-center">
              Please wait while we verify your invitation link
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="container max-w-md mx-auto mt-8">
        <Card>
          <CardHeader className="text-center">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Welcome to {acceptResult.orgName}!</CardTitle>
            <CardDescription>
              You've successfully joined the organization
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Redirecting to your organization dashboard...
            </p>
            <Button 
              onClick={() => {
                const dashboardPath = acceptResult.orgSlug 
                  ? `/org/${acceptResult.orgSlug}/dashboard`
                  : '/dashboard';
                navigate(dashboardPath);
              }}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="container max-w-md mx-auto mt-8">
        <Card>
          <CardHeader className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Invalid Invitation</CardTitle>
            <CardDescription>
              This invitation link is not valid
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
            <Button 
              onClick={() => navigate('/dashboard')} 
              variant="outline" 
              className="w-full mt-4"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show input form when no token is provided
  if (status === 'input') {
    return (
      <div className="container max-w-md mx-auto mt-8">
        <Card>
          <CardHeader className="text-center">
            <Users className="h-16 w-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl">Join an Organization</CardTitle>
            <CardDescription>
              Enter your invitation link or token to join an organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleManualTokenSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inviteToken">Invitation Link or Token</Label>
                <Input
                  id="inviteToken"
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  placeholder="Paste invitation link or token"
                  required
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  You should have received an invitation link via email from your organization
                </p>
              </div>
              
              <Button 
                type="submit"
                disabled={!manualToken.trim()}
                className="w-full"
              >
                Continue
              </Button>

              <Button 
                type="button"
                onClick={() => navigate('/dashboard')} 
                variant="outline" 
                className="w-full"
              >
                Back to Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Ready to accept invitation
  if (!inviteData) {
    return null;
  }

  return (
    <div className="container max-w-2xl mx-auto mt-8">
      <Card>
        <CardHeader className="text-center">
          {/* Organization Logo */}
          {inviteData.organization?.logoUrl && (
            <div className="flex justify-center mb-4">
              <img 
                src={inviteData.organization.logoUrl} 
                alt={inviteData.organization.name} 
                className="h-20 w-20 object-contain rounded-lg"
              />
            </div>
          )}
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <Building2 className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Join {inviteData.organization?.name}</CardTitle>
          </div>
          
          <CardDescription className="text-base">
            You've been invited to join this organization on FPK University
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Organization Description */}
          {inviteData.organization?.description && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                {inviteData.organization.description}
              </p>
            </div>
          )}

          {/* Invitation Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Your Role</p>
                <p className="text-sm text-muted-foreground capitalize">{inviteData.role}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Expires</p>
                <p className="text-sm text-muted-foreground">
                  {inviteData.expiresAt && new Date(inviteData.expiresAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Email Confirmation */}
          <Alert>
            <AlertDescription className="text-sm">
              This invitation was sent to <strong>{inviteData.invitedEmail}</strong>
            </AlertDescription>
          </Alert>

          {/* Accept Button */}
          <Button 
            onClick={handleAcceptInvitation}
            disabled={status === 'accepting'}
            className="w-full"
            size="lg"
          >
            {status === 'accepting' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Accepting Invitation...
              </>
            ) : (
              'Accept Invitation'
            )}
          </Button>

          <Button 
            onClick={() => navigate('/dashboard')} 
            variant="outline" 
            className="w-full"
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default JoinOrganization;