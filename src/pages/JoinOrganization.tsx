import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useOrganizationInvitation } from '@/hooks/useOrganizationInvitation';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Users, CheckCircle, XCircle } from 'lucide-react';

export function JoinOrganization() {
  const { code: codeFromParams } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { joinWithCode, isJoining } = useOrganizationInvitation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'ready'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [joinResult, setJoinResult] = useState<{ org_id?: string; role?: string }>({});

  // Get invitation code from either URL params or query params
  const code = codeFromParams || searchParams.get('code') || searchParams.get('token');

  useEffect(() => {
    console.log('JoinOrganization: code =', code, 'user =', !!user);
    
    if (!code) {
      console.log('JoinOrganization: No code provided');
      setStatus('error');
      setErrorMessage('No invitation code provided. Please use the link from your invitation email or contact your organization administrator.');
      return;
    }

    if (!user) {
      console.log('JoinOrganization: User not authenticated, redirecting to login');
      // Redirect to login with the invitation code stored
      localStorage.setItem('pendingInvitation', code);
      navigate('/login', { 
        state: { 
          returnUrl: `/join?code=${code}` 
        } 
      });
      return;
    }

    console.log('JoinOrganization: Ready to process invitation');
    setStatus('ready');
  }, [code, user, navigate]);

  const handleAcceptInvitation = async () => {
    const result = await joinWithCode(code || '');
    
    if (result.success && result.org_id) {
      setJoinResult(result);
      setStatus('success');
      // Redirect to the organization they just joined
      setTimeout(() => {
        navigate(`/org/${result.org_id}`, { replace: true });
      }, 2000);
    } else {
      setStatus('error');
      setErrorMessage(result.error || 'Failed to join organization');
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
              Redirecting to your organization...
            </p>
            <Button 
              onClick={() => joinResult.org_id && navigate(`/org/${joinResult.org_id}`)} 
              className="w-full" 
              disabled={!joinResult.org_id}
            >
              Go to Organization
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
          {/* Waterford and Wexford Education and Training Board Logo */}
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/44eb3e77-c5bb-47c8-a643-8320e9261df0.png" 
              alt="Waterford and Wexford Education and Training Board" 
              className="h-16 w-16 object-contain"
            />
          </div>
          <CardTitle className="text-2xl">Join Waterford and Wexford ETB</CardTitle>
          <CardDescription>
            You've been invited to join Waterford and Wexford Education and Training Board on FPK University
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Click the button below to accept this invitation and join the organization.
          </p>
          
          <Button 
            onClick={handleAcceptInvitation}
            disabled={isJoining}
            className="w-full"
          >
            {isJoining ? (
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