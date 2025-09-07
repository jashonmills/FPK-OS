import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrgInvitations } from '@/hooks/useOrgInvitations';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Users, CheckCircle, XCircle } from 'lucide-react';

export function JoinOrganization() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { processInvitation, isProcessing } = useOrgInvitations();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'ready'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    console.log('JoinOrganization: code =', code, 'user =', !!user);
    
    if (!code) {
      console.log('JoinOrganization: No code provided');
      setStatus('error');
      setErrorMessage('Invalid invitation link');
      return;
    }

    if (!user) {
      console.log('JoinOrganization: User not authenticated, redirecting to login');
      // Redirect to sign up/login with the invitation code stored
      localStorage.setItem('pendingInvitation', code);
      navigate('/login?redirect=join-organization');
      return;
    }

    console.log('JoinOrganization: Ready to process invitation');
    setStatus('ready');
  }, [code, user, navigate]);

  const handleAcceptInvitation = async () => {
    if (!code) return;

    try {
      await processInvitation({ code });
      setStatus('success');
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard/instructor');
      }, 3000);
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Failed to accept invitation');
    }
  };

  if (status === 'loading') {
    return (
      <div className="container max-w-md mx-auto mt-8">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Processing invitation...</span>
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
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Welcome!</CardTitle>
            <CardDescription>
              You've successfully joined the organization!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Redirecting to your dashboard...
            </p>
            <Button onClick={() => navigate('/dashboard/instructor')} className="w-full">
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

  return (
    <div className="container max-w-md mx-auto mt-8">
      <Card>
        <CardHeader className="text-center">
          <Users className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <CardTitle className="text-2xl">Join Organization</CardTitle>
          <CardDescription>
            You've been invited to join an organization on FPK University
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Click the button below to accept this invitation and join the organization.
          </p>
          
          <Button 
            onClick={handleAcceptInvitation}
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? (
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