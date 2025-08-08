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
        // Debug: Log all URL parameters
        const allParams = Object.fromEntries(searchParams.entries());
        console.log('🔍 All URL parameters:', allParams);
        
        // Handle possible error returned in URL by Supabase (e.g., invalid/expired link)
        const urlErrorDesc = searchParams.get('error_description') || searchParams.get('message');
        const urlErrorCode = searchParams.get('error_code');
        if (urlErrorDesc) {
          logger.auth('Email confirmation error from URL', { urlErrorDesc, urlErrorCode });
          setError(urlErrorCode ? `${urlErrorDesc} (${urlErrorCode})` : urlErrorDesc);
          setStatus('error');
          return;
        }

        // Get token hash or token from URL (prefer token_hash - Supabase format)
        const tokenHash = searchParams.get('token_hash') || searchParams.get('token');
        const typeParam = searchParams.get('type') || 'signup';
        
        logger.auth('Email confirmation attempt', { 
          hasTokenHash: !!tokenHash,
          type: typeParam,
          allParams: Object.fromEntries(searchParams.entries())
        });

        if (!tokenHash) {
          throw new Error('Missing confirmation token');
        }

        // Verify the OTP token with Supabase
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: typeParam as any
        });

        if (verifyError) {
          throw verifyError;
        }

        logger.auth('Email confirmation successful');
        setStatus('success');
        
        // Redirect to dashboard after a brief delay
        setTimeout(() => {
          navigate('/dashboard/learner', { replace: true });
        }, 2000);

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