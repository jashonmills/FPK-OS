import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, RefreshCw, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmailVerificationGateProps {
  email: string;
  organizationName?: string;
  onVerified: () => void;
}

export function EmailVerificationGate({ 
  email, 
  organizationName, 
  onVerified 
}: EmailVerificationGateProps) {
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;

      toast({
        title: 'Verification email sent',
        description: 'Please check your inbox for the verification link.',
      });
    } catch (error: any) {
      toast({
        title: 'Error sending verification email',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setIsChecking(true);
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      if (data.user?.email_confirmed_at) {
        toast({
          title: 'Email verified!',
          description: 'Your account has been verified. Redirecting...',
        });
        onVerified();
      } else {
        toast({
          title: 'Email not yet verified',
          description: 'Please check your inbox and click the verification link.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error checking verification',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a verification link to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {organizationName && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your organization <strong>{organizationName}</strong> has been created! 
                Please verify your email to access your dashboard.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Button 
              onClick={handleCheckVerification}
              disabled={isChecking}
              className="w-full"
            >
              {isChecking && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
              I've Verified My Email
            </Button>

            <Button 
              variant="outline" 
              onClick={handleResendVerification}
              disabled={isResending}
              className="w-full"
            >
              {isResending && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
              Resend Verification Email
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Check your spam folder if you don't see the email within a few minutes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}