import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, Info } from "lucide-react";
import { toast } from "sonner";

const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const token = searchParams.get('token');

  const [inviteData, setInviteData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchInvite = async () => {
      if (!token) {
        setError("Invalid invitation link");
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching invite with token:', token);
        
        // Fetch invite data - need to use the anon client since user isn't authenticated yet
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/invites?token=eq.${token}&select=*,families:family_id(family_name)`,
          {
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
          }
        );

        const invites = await response.json();
        console.log('Invite API result:', invites);

        if (!response.ok || !invites || invites.length === 0) {
          setError("This invitation is invalid or has expired");
          setIsLoading(false);
          return;
        }

        const data = invites[0];

        // Check status
        if (data.status !== 'pending') {
          setError(`This invitation has been ${data.status}`);
          setIsLoading(false);
          return;
        }

        // Check if expired
        if (new Date(data.expires_at) < new Date()) {
          setError("This invitation has expired");
          setIsLoading(false);
          return;
        }

        setInviteData(data);
      } catch (err) {
        console.error('Error fetching invite:', err);
        setError("Failed to load invitation");
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchInvite();
    }
  }, [token, authLoading]);

  const handleAcceptInvite = async () => {
    if (!user) {
      // Redirect to auth with return URL
      navigate(`/auth?redirect=/accept-invite?token=${token}`);
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-invite', {
        body: { token },
      });

      if (error) throw error;

      if (data.success) {
        setSuccess(true);
        toast.success(`You've joined ${data.family_name}!`);
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        throw new Error(data.error || 'Failed to accept invitation');
      }
    } catch (err) {
      console.error('Error accepting invite:', err);
      const message = err instanceof Error ? err.message : 'Failed to accept invitation';
      setError(message);
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <CardTitle>Welcome!</CardTitle>
            <CardDescription>
              You've successfully joined the family hub
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            Redirecting you to the dashboard...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Invalid Invitation</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate('/')}>
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>You're Invited!</CardTitle>
          <CardDescription>
            Join {inviteData?.families?.family_name} as a {inviteData?.role}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              {inviteData?.role === 'viewer' 
                ? "As a Viewer, you'll be able to view all data and reports, but won't be able to create or edit anything."
                : "As a Contributor, you'll be able to view all data, create and edit logs, but won't be able to delete others' entries or manage settings."}
            </AlertDescription>
          </Alert>

          {!user && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                You'll need to sign in or create an account to accept this invitation.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={handleAcceptInvite}
              disabled={isProcessing}
            >
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {user ? 'Accept Invitation' : 'Sign In to Accept'}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
            >
              Decline
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptInvite;
