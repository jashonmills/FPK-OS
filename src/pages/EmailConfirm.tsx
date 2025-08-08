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
        // Debug: Log all URL parameters and hash
        const allParams = Object.fromEntries(searchParams.entries());
        const hash = window.location.hash || '';
        const hashParams = new URLSearchParams(hash.replace(/^#/, ''));
        console.log('🔍 URL query params:', allParams);
        console.log('🔍 URL hash params:', Object.fromEntries(hashParams.entries()));
        
        // Handle possible error returned in URL by Supabase (e.g., invalid/expired link)
        const urlErrorDesc = searchParams.get('error_description') || searchParams.get('message');
        const urlErrorCode = searchParams.get('error_code');
        if (urlErrorDesc) {
          logger.auth('Email confirmation error from URL', { urlErrorDesc, urlErrorCode });
          setError(urlErrorCode ? `${urlErrorDesc} (${urlErrorCode})` : urlErrorDesc);
          setStatus('error');
          return;
        }

        // Preferred flow: verify token_hash for signup/confirmation links
        const tokenHash = searchParams.get('token_hash') || searchParams.get('token');
        const typeParam = (searchParams.get('type') || 'signup') as any;

        if (tokenHash) {
          logger.auth('Email confirmation via token_hash', { type: typeParam });
          const { error: verifyError } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: typeParam });
          if (verifyError) throw verifyError;
          setStatus('success');
          setTimeout(() => navigate('/dashboard/learner', { replace: true }), 1500);
          return;
        }

        // Fallback 1: OAuth/PKCE code param
        const codeParam = searchParams.get('code');
        if (codeParam) {
          logger.auth('Email/OAuth confirmation via exchangeCodeForSession');
          const { error: codeError } = await supabase.auth.exchangeCodeForSession(codeParam);
          if (codeError) throw codeError;
          setStatus('success');
          setTimeout(() => navigate('/dashboard/learner', { replace: true }), 1500);
          return;
        }

        // Fallback 2: Hash tokens (e.g., access_token in URL fragment)
        const accessTokenInHash = hashParams.get('access_token');
        const refreshTokenInHash = hashParams.get('refresh_token');
        if (accessTokenInHash && refreshTokenInHash) {
          logger.auth('Email confirmation via setSession (hash tokens)');
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessTokenInHash,
            refresh_token: refreshTokenInHash,
          });
          if (sessionError) throw sessionError;
          setStatus('success');
          setTimeout(() => navigate('/dashboard/learner', { replace: true }), 1500);
          return;
        }

        throw new Error('Missing confirmation token');
      } catch (err: any) {
        logger.auth('Email confirmation failed', { error: err.message });
        setError(err.message || 'Failed to confirm email');
        setStatus('error');
      }
    };

    confirmEmail();
  }, [searchParams, navigate]);

  const handleRetry = () => {
    navigate('/login', { replace: true });
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
            <Button onClick={handleRetry} className="w-full">
              Back to Login
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Try signing up again or contact support if the problem persists.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};