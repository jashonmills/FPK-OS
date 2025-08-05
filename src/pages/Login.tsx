import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ArrowLeft } from 'lucide-react';
import { getSiteUrl } from '@/utils/siteUrl';

const Login = () => {
  const { tString } = useGlobalTranslation('auth');
  const [isLoading, setIsLoading] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  

  // Check for password reset tokens and redirect to dedicated reset page
  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const tokenHash = searchParams.get('token');
    const type = searchParams.get('type');
    
    // If we have recovery tokens, redirect to dedicated reset password page
    if ((accessToken && refreshToken && type === 'recovery') || (tokenHash && type === 'recovery')) {
      console.log('🔐 Redirecting to reset password page...');
      // Preserve all URL parameters for the reset page to handle
      const urlParams = new URLSearchParams(window.location.search);
      navigate(`/reset-password?${urlParams.toString()}`, { replace: true });
      return;
    }
  }, [searchParams, navigate]);

  // Redirect authenticated users immediately
  useEffect(() => {
    if (!loading && user) {
      console.log('🔄 Login: User authenticated, redirecting to dashboard');
      navigate('/dashboard/learner', { replace: true });
    }
  }, [user, loading, navigate]);

  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    displayName: '',
    confirmPassword: ''
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: signInData.email,
        password: signInData.password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      toast({
        title: tString('welcomeBack'),
        description: tString('signInSuccess'),
      });
      
      // Immediate redirect after successful sign in
      console.log('🔄 Login: Sign in successful, redirecting to dashboard');
      navigate('/dashboard/learner', { replace: true });
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (signUpData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          data: {
            full_name: signUpData.displayName,
            display_name: signUpData.displayName,
          },
          emailRedirectTo: `${getSiteUrl()}/dashboard/learner`
        }
      });

      if (error) {
        setError(error.message);
        return;
      }

      toast({
        title: tString('accountCreated'),
        description: tString('checkEmail'),
      });
      
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!signInData.email) {
      setError('Please enter your email address first.');
      return;
    }

    setIsResettingPassword(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(signInData.email, {
        redirectTo: `${getSiteUrl()}/reset-password`,
      });

      if (error) {
        setError(error.message);
        return;
      }

      toast({
        title: 'Password Reset Email Sent',
        description: 'Check your email for a link to reset your password.',
      });
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsResettingPassword(false);
    }
  };


  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fpk-purple to-fpk-amber">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fpk-purple to-fpk-amber p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{tString('title')}</h1>
              <p className="text-white/80">{tString('subtitle')}</p>
            </div>
            <div className="ml-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        <Card className="fpk-card shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="fpk-text-gradient text-2xl font-bold">
              {tString('portalTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin">{tString('signIn')}</TabsTrigger>
                  <TabsTrigger value="signup">{tString('signUp')}</TabsTrigger>
                </TabsList>

                {error && (
                  <Alert className="mb-4 border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">{tString('email')}</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder={tString('emailPlaceholder')}
                        value={signInData.email}
                        onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                        required
                        className="bg-white border-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">{tString('password')}</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder={tString('passwordPlaceholder')}
                        value={signInData.password}
                        onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                        required
                        className="bg-white border-gray-200"
                       />
                     </div>
                     
                     <div className="flex justify-end">
                       <Button
                         type="button"
                         variant="link"
                         className="p-0 h-auto text-sm text-purple-600 hover:text-purple-700"
                         onClick={handleForgotPassword}
                         disabled={isResettingPassword}
                       >
                         {isResettingPassword ? 'Sending...' : 'Forgot password?'}
                       </Button>
                     </div>

                     <Button 
                       type="submit" 
                       className="w-full fpk-gradient text-white font-semibold py-2 hover:opacity-90 transition-opacity"
                       disabled={isLoading}
                     >
                       {isLoading ? tString('signingIn') : tString('signInButton')}
                     </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">{tString('displayName')}</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder={tString('fullNamePlaceholder')}
                        value={signUpData.displayName}
                        onChange={(e) => setSignUpData({...signUpData, displayName: e.target.value})}
                        required
                        className="bg-white border-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">{tString('email')}</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder={tString('emailPlaceholder')}
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                        required
                        className="bg-white border-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">{tString('password')}</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder={tString('createPassword')}
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                        required
                        className="bg-white border-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm">{tString('confirmPassword')}</Label>
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder={tString('confirmPasswordPlaceholder')}
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData({...signUpData, confirmPassword: e.target.value})}
                        required
                        className="bg-white border-gray-200"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full fpk-gradient text-white font-semibold py-2 hover:opacity-90 transition-opacity"
                      disabled={isLoading}
                    >
                      {isLoading ? tString('creatingAccount') : tString('signUpButton')}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6 space-y-4">
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate('/choose-plan')}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
            >
              View Pricing Plans
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('https://demo.fpkuniversity.com/', '_blank')}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Home
            </Button>
          </div>
          <div className="flex gap-4 justify-center text-xs text-white/60">
            <a href="/privacy-policy" className="hover:text-white/80 underline">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="hover:text-white/80 underline">
              Terms of Service
            </a>
          </div>
          <p className="text-white/60 text-sm">
            {tString('betaVersion')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
