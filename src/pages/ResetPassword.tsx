import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ResetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingToken, setIsProcessingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState('');

  // Process auth tokens on mount - prevent double processing
  useEffect(() => {
    let hasProcessed = false;
    
    const processTokens = async () => {
      if (hasProcessed) {
        console.log('🔐 Skipping token processing - already processed');
        return;
      }
      hasProcessed = true;
      
      console.log('🔐 Processing reset tokens...', { 
        url: window.location.href,
        hash: window.location.hash,
        search: window.location.search,
        timestamp: new Date().toISOString()
      });
      
      // Check for tokens in URL fragment (hash) - Supabase auth flow
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token') || searchParams.get('refresh_token');
      const type = hashParams.get('type') || searchParams.get('type');
      const errorParam = hashParams.get('error') || searchParams.get('error');
      const errorDescription = hashParams.get('error_description') || searchParams.get('error_description');
      
      console.log('🔐 Found tokens:', { 
        hasAccess: !!accessToken, 
        hasRefresh: !!refreshToken, 
        type,
        error: errorParam,
        errorDescription,
        fromHash: !!hashParams.get('access_token'),
        fromSearch: !!searchParams.get('access_token')
      });
      
      // Check for explicit error parameters first
      if (errorParam) {
        console.error('❌ Auth error in URL:', { error: errorParam, description: errorDescription });
        let errorMessage = 'Password reset link is invalid or has expired.';
        
        if (errorParam === 'access_denied') {
          errorMessage = 'Access denied. The reset link may have expired.';
        } else if (errorDescription && errorDescription.includes('expired')) {
          errorMessage = 'Password reset link has expired. Please request a new one.';
        } else if (errorDescription && errorDescription.includes('invalid')) {
          errorMessage = 'Password reset link is invalid. Please request a new one.';
        }
        
        setError(errorMessage);
        setIsProcessingToken(false);
        setTokenValid(false);
        return;
      }
      
      // If we have access_token and refresh_token (from Supabase verification redirect)
      if (accessToken && refreshToken && type === 'recovery') {
        console.log('✅ Valid recovery tokens found, attempting session setup');
        try {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            console.error('❌ Session setup error:', error);
            throw error;
          }
          
          if (data.session) {
            console.log('✅ Session established for password reset', {
              userId: data.session.user?.id,
              expiresAt: data.session.expires_at,
              tokenExpiry: new Date(data.session.expires_at * 1000).toISOString()
            });
            setTokenValid(true);
            setIsProcessingToken(false);
            
            // Clean up URL
            window.history.replaceState({}, '', window.location.pathname);
            return;
          } else {
            throw new Error('No session returned from setSession');
          }
        } catch (error: any) {
          console.error('❌ Error setting session:', error);
          
          let errorMessage = 'Failed to validate reset link. Please request a new one.';
          if (error.message?.includes('expired')) {
            errorMessage = 'Password reset link has expired. Please request a new one.';
          } else if (error.message?.includes('invalid')) {
            errorMessage = 'Password reset link is invalid. Please request a new one.';
          }
          
          setError(errorMessage);
          setIsProcessingToken(false);
          setTokenValid(false);
          return;
        }
      }
      
      // No valid tokens found
      console.log('❌ Invalid or missing tokens');
      setError('Password reset link is invalid or has expired. Please request a new one.');
      setIsProcessingToken(false);
      setTokenValid(false);
    };

    processTokens();
    
    // Cleanup function to prevent memory leaks
    return () => {
      hasProcessed = true;
    };
  }, []); // Remove searchParams dependency to prevent re-processing

  const handlePasswordChange = (field: 'newPassword' | 'confirmPassword', value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validatePasswords = () => {
    if (passwords.newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) return;
    
    setIsLoading(true);
    setError('');

    try {
      console.log('🔐 Updating password...');
      const { error } = await supabase.auth.updateUser({ 
        password: passwords.newPassword 
      });

      if (error) {
        console.error('❌ Password update failed:', error);
        setError(error.message || 'Failed to update password. Please try again.');
        return;
      }

      console.log('✅ Password updated successfully');
      toast({
        title: 'Password Updated',
        description: 'Your password has been updated successfully. You can now sign in with your new password.',
      });

      // Clean up URL parameters and redirect to login with success message
      const cleanUrl = window.location.origin + '/login?resetSuccess=true';
      window.history.replaceState({}, '', cleanUrl);
      
      // Redirect to login after a brief delay
      setTimeout(() => {
        navigate('/login', { 
          replace: true, 
          state: { resetSuccess: true, autoFocusEmail: true }
        });
      }, 2000);
    } catch (err) {
      console.error('❌ Password reset error:', err);
      setError('An error occurred while updating your password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestNewLink = () => {
    navigate('/login', { state: { showForgotPassword: true } });
  };

  if (isProcessingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-center text-muted-foreground">
                Processing your password reset request...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">Reset Link Invalid</CardTitle>
            <CardDescription>
              {error || 'This password reset link is invalid or has expired.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleRequestNewLink} className="w-full">
              Request New Reset Link
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/login')}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>
            Enter your new password below. Make sure it's secure and memorable.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword.new ? 'text' : 'password'}
                  value={passwords.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  placeholder="Enter your new password"
                  required
                  minLength={8}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword.confirm ? 'text' : 'password'}
                  value={passwords.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your new password"
                  required
                  minLength={8}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>

            <Button 
              type="button"
              variant="ghost" 
              onClick={() => navigate('/login')}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}