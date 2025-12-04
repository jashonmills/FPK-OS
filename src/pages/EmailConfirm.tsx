import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { logger } from '@/utils/logger';

export const EmailConfirm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Enhanced debug logging for SMTP troubleshooting
        const allParams = Object.fromEntries(searchParams.entries());
        const hash = window.location.hash || '';
        const hashParams = new URLSearchParams(hash.replace(/^#/, ''));
        
        console.log('🔍 Email confirmation debug:', {
          url: window.location.href,
          queryParams: allParams,
          hashParams: Object.fromEntries(hashParams.entries()),
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        });
        
        // Handle possible error returned in URL by Supabase (e.g., invalid/expired link)
        const urlErrorDesc = searchParams.get('error_description') || searchParams.get('message');
        const urlErrorCode = searchParams.get('error_code');
        if (urlErrorDesc) {
          logger.auth.error('Email confirmation error from URL', { urlErrorDesc, urlErrorCode });
          setError(`Email confirmation failed: ${urlErrorDesc}${urlErrorCode ? ` (${urlErrorCode})` : ''}`);
          setStatus('error');
          return;
        }

        // Preferred flow: verify token_hash for signup/confirmation links
        const tokenHash = searchParams.get('token_hash') || searchParams.get('token');
        const typeParam = (searchParams.get('type') || 'signup') as any;

        if (tokenHash) {
          logger.auth.info('Email confirmation via token_hash', { type: typeParam });
          const { error: verifyError } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: typeParam });
          if (verifyError) {
            logger.auth.error('Token verification failed', { verifyError });
            throw verifyError;
          }
          logger.auth.info('Token verification successful');
          setStatus('success');
          
          // Check for pending invite code and redirect appropriately
          const pendingInvitation = localStorage.getItem('pendingInvitation') || localStorage.getItem('pendingInviteCode');
          if (pendingInvitation) {
            localStorage.removeItem('pendingInvitation');
            localStorage.removeItem('pendingInviteCode');
            setTimeout(() => navigate(`/join?code=${pendingInvitation}`, { replace: true }), 1500);
          } else {
            setTimeout(() => navigate('/dashboard/learner', { replace: true }), 1500);
          }
          return;
        }

        // Fallback 1: OAuth/PKCE code param
        const codeParam = searchParams.get('code');
        if (codeParam) {
          logger.auth.info('Email/OAuth confirmation via exchangeCodeForSession');
          const { error: codeError } = await supabase.auth.exchangeCodeForSession(codeParam);
          if (codeError) {
            logger.auth.error('Code exchange failed', { codeError });
            throw codeError;
          }
          logger.auth.info('Code exchange successful');
          setStatus('success');
          
          // Check for pending invite code and redirect appropriately
          const pendingInvitation = localStorage.getItem('pendingInvitation') || localStorage.getItem('pendingInviteCode');
          if (pendingInvitation) {
            localStorage.removeItem('pendingInvitation');
            localStorage.removeItem('pendingInviteCode');
            setTimeout(() => navigate(`/join?code=${pendingInvitation}`, { replace: true }), 1500);
          } else {
            setTimeout(() => navigate('/dashboard/learner', { replace: true }), 1500);
          }
          return;
        }

        // Fallback 2: Hash tokens (e.g., access_token in URL fragment)
        const accessTokenInHash = hashParams.get('access_token');
        const refreshTokenInHash = hashParams.get('refresh_token');
        if (accessTokenInHash && refreshTokenInHash) {
          logger.auth.info('Email confirmation via setSession (hash tokens)');
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessTokenInHash,
            refresh_token: refreshTokenInHash,
          });
          if (sessionError) {
            logger.auth.error('Session restoration failed', { sessionError });
            throw sessionError;
          }
          logger.auth.info('Session restoration successful');
          setStatus('success');
          
          // Check for pending invite code and redirect appropriately
          const pendingInvitation = localStorage.getItem('pendingInvitation') || localStorage.getItem('pendingInviteCode');
          if (pendingInvitation) {
            localStorage.removeItem('pendingInvitation');
            localStorage.removeItem('pendingInviteCode');
            setTimeout(() => navigate(`/join?code=${pendingInvitation}`, { replace: true }), 1500);
          } else {
            setTimeout(() => navigate('/dashboard/learner', { replace: true }), 1500);
          }
          return;
        }

        logger.auth.error('No valid confirmation token found');
        throw new Error('Missing confirmation token - this usually indicates the email was not delivered properly');
      } catch (err: any) {
        logger.auth.error('Email confirmation failed', { error: err.message });
        setError(err.message || 'Failed to confirm email');
        setStatus('error');
      }
    };

    confirmEmail();
  }, [searchParams, navigate]);

  const [isResending, setIsResending] = useState(false);

  const handleRetry = () => {
    navigate('/login', { replace: true });
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      // Get email from URL params or prompt user
      const email = searchParams.get('email');
      if (!email) {
        setError('Unable to resend - email address not found. Please try signing up again.');
        setIsResending(false);
        return;
      }

      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`
        }
      });

      if (resendError) throw resendError;

      setError('Verification email resent! Please check your inbox and spam folder.');
      setStatus('loading');
    } catch (err: any) {
      logger.auth.error('Failed to resend verification email', { error: err.message });
      setError(`Failed to resend email: ${err.message}`);
    } finally {
      setIsResending(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
            <CardTitle>Confirming Email</CardTitle>
            <CardDescription>
              Please wait while we verify your email address...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <CardTitle className="text-green-700">Email Confirmed!</CardTitle>
            <CardDescription>
              Your email has been successfully verified. You'll be redirected to your dashboard shortly.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <XCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
          <CardTitle className="text-destructive">Confirmation Failed</CardTitle>
          <CardDescription>
            We couldn't verify your email address.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            {searchParams.get('email') && (
              <Button 
                onClick={handleResendEmail} 
                variant="outline"
                className="w-full"
                disabled={isResending}
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resending...
                  </>
                ) : (
                  'Resend Verification Email'
                )}
              </Button>
            )}
            <Button onClick={handleRetry} className="w-full">
              Back to Login
            </Button>
            <div className="text-sm text-muted-foreground text-center space-y-1">
              <p>Common issues:</p>
              <ul className="list-disc list-inside text-xs">
                <li>Check your spam/junk folder</li>
                <li>Link may have expired (valid for 1 hour)</li>
                <li>Email may take a few minutes to arrive</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};