import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import { getSiteUrl } from '@/utils/siteUrl';
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal';
import { ResetPasswordModal } from '@/components/auth/ResetPasswordModal';
import { FirstVisitVideoModal } from '@/components/common/FirstVisitVideoModal';
import { useFirstVisitVideo } from '@/hooks/useFirstVisitVideo';
import { PageHelpTrigger } from '@/components/common/PageHelpTrigger';

const Login = () => {
  const { tString } = useGlobalTranslation('auth');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  
  // Modal states
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [resetUserEmail, setResetUserEmail] = useState('');
  const [showVideoGuideModal, setShowVideoGuideModal] = useState(false);
  const [showSignInVideoModal, setShowSignInVideoModal] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  
  // Video guide storage hooks
  const { shouldShowAuto, markVideoAsSeen } = useFirstVisitVideo('signup_intro_seen');
  const signInVideo = useFirstVisitVideo('signin_intro_seen');

  // Check for password reset tokens and handle them
  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const tokenHash = searchParams.get('token');
    const type = searchParams.get('type');
    const resetSuccess = searchParams.get('resetSuccess');
    
    // Handle reset success message
    if (resetSuccess === 'true') {
      toast({
        title: 'Password Reset Complete',
        description: 'Your password has been updated successfully. You can now sign in with your new password.',
      });
      // Clean up URL
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('resetSuccess');
      setSearchParams(newSearchParams, { replace: true });
      return;
    }
    
    // Handle recovery tokens
    if ((accessToken && refreshToken && type === 'recovery') || (tokenHash && type === 'recovery')) {
      console.log('🔐 Processing password reset tokens...');
      
      const processTokens = async () => {
        try {
          let sessionData;
          
          // Try to set session with access/refresh tokens first
          if (accessToken && refreshToken) {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            sessionData = data;
            if (error) throw error;
          } 
          // Fallback to verify OTP with token hash
          else if (tokenHash) {
            const { data, error } = await supabase.auth.verifyOtp({
              token_hash: tokenHash,
              type: 'recovery'
            });
            sessionData = data;
            if (error) throw error;
          }

          if (sessionData?.session?.user) {
            console.log('✅ Reset session established');
            setResetUserEmail(sessionData.session.user.email || '');
            setShowResetPasswordModal(true);
            
            // Clean up URL parameters
            const newSearchParams = new URLSearchParams();
            setSearchParams(newSearchParams, { replace: true });
          }
        } catch (err) {
          console.error('❌ Reset token processing error:', err);
          setError('Password reset link is invalid or has expired. Please request a new one.');
          
          // Clean up URL parameters on error
          const newSearchParams = new URLSearchParams();
          setSearchParams(newSearchParams, { replace: true });
        }
      };

      processTokens();
    }
  }, [searchParams, setSearchParams, toast]);

  // Redirect authenticated users immediately
  useEffect(() => {
    console.log('Login: Auth check - user:', !!user, 'loading:', loading);
    
    if (!loading && user) {
      console.log('🔄 Login: User authenticated, checking for redirects');
      
      // Check for state-based return URL first
      const returnUrl = location.state?.returnUrl;
      console.log('Login: Return URL from state:', returnUrl);
      
      if (returnUrl) {
        navigate(returnUrl, { replace: true });
        return;
      }
      
      // Legacy redirect handling
      const redirect = searchParams.get('redirect');
      console.log('Login: Redirect parameter:', redirect);
      
      if (redirect === 'join-organization') {
        const pendingInvitation = localStorage.getItem('pendingInvitation');
        console.log('Login: Found pending invitation:', pendingInvitation);
        
        if (pendingInvitation) {
          localStorage.removeItem('pendingInvitation');
          navigate(`/org/join?code=${pendingInvitation}`, { replace: true });
          return;
        }
      }
      
      console.log('🔄 Login: No redirect, going to dashboard');
      navigate('/dashboard/learner', { replace: true });
    }
  }, [user, loading, navigate, searchParams, location.state]);

  // Auto-show video guide for signup tab (only once)
  useEffect(() => {
    if (activeTab === 'signup' && shouldShowAuto() && !showVideoGuideModal) {
      setShowVideoGuideModal(true);
    }
  }, [activeTab, shouldShowAuto, showVideoGuideModal]);

  // Auto-show video guide for signin tab (only once)
  useEffect(() => {
    if (activeTab === 'signin' && signInVideo.shouldShowAuto() && !showSignInVideoModal) {
      setShowSignInVideoModal(true);
    }
  }, [activeTab, signInVideo, showSignInVideoModal]);

  // Check for enrollment parameter
  const enrollCourseId = searchParams.get('enroll');
  
  const getCourseTitle = (courseId: string) => {
    const courseMap = {
      'empowering-learning-spelling': 'Empowering Learning for Spelling',
      'logic-critical-thinking': 'Logic and Critical Thinking',
      'interactive-science': 'Introduction to Science',
      'interactive-algebra': 'Interactive Algebra',
      'interactive-linear-equations': 'Interactive Linear Equations',
      'interactive-trigonometry': 'Interactive Trigonometry',
      'interactive-economics': 'Interactive Economics',
      'interactive-neurodiversity': 'Interactive Neurodiversity'
    };
    return courseMap[courseId as keyof typeof courseMap] || 'Course';
  };

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
      
      // Check for return URL after successful sign in
      const returnUrl = location.state?.returnUrl;
      if (returnUrl) {
        console.log('🔄 Login: Sign in successful, redirecting to return URL:', returnUrl);
        navigate(returnUrl, { replace: true });
      } else {
        console.log('🔄 Login: Sign in successful, redirecting to dashboard');
        navigate('/dashboard/learner', { replace: true });
      }
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
      // Check if there's a pending invitation
      const pendingInvitation = localStorage.getItem('pendingInvitation');
      const returnUrl = location.state?.returnUrl;
      
      // Set email redirect to handle confirmation with email for resend functionality
      let emailRedirectUrl = `${getSiteUrl()}/auth/confirm?email=${encodeURIComponent(signUpData.email)}`;
      if (pendingInvitation && returnUrl) {
        emailRedirectUrl = `${getSiteUrl()}/auth/confirm?email=${encodeURIComponent(signUpData.email)}&returnUrl=${encodeURIComponent(returnUrl)}`;
      }

      const { data, error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          data: {
            full_name: signUpData.displayName,
            display_name: signUpData.displayName,
          },
          emailRedirectTo: emailRedirectUrl
        }
      });

      if (error) {
        console.error('Signup error:', error);
        setError(error.message);
        return;
      }

      // If email confirmation is disabled, user is immediately authenticated
      if (data?.session && data?.user) {
        console.log('✅ User signed up and auto-confirmed, checking for pending invitation');
        
        // Check for pending invitation and redirect immediately
        if (pendingInvitation) {
          console.log('✅ Found pending invitation, redirecting to join flow');
          setTimeout(() => {
            navigate(`/org/join?code=${pendingInvitation}`, { replace: true });
          }, 500);
        } else if (returnUrl) {
          navigate(returnUrl, { replace: true });
        } else {
          navigate('/dashboard/learner', { replace: true });
        }
      } else {
        // Email confirmation required
        toast({
          title: tString('accountCreated'),
          description: tString('checkEmail'),
        });
      }
      
    } catch (err) {
      console.error('Unexpected signup error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPasswordModal(true);
  };

  const handleResetPasswordSuccess = (email?: string) => {
    setShowResetPasswordModal(false);
    if (email) {
      setSignInData(prev => ({ ...prev, email }));
    }
    
    // Add success parameter and navigate
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('resetSuccess', 'true');
    setSearchParams(newSearchParams, { replace: true });
  };

  const handleVideoGuideClose = () => {
    setShowVideoGuideModal(false);
    markVideoAsSeen();
  };

  const handleShowVideoGuide = () => {
    setShowVideoGuideModal(true);
  };

  const handleSignInVideoClose = () => {
    setShowSignInVideoModal(false);
    signInVideo.markVideoAsSeen();
  };

  const handleShowSignInVideo = () => {
    setShowSignInVideoModal(true);
  };

  // Show loading while checking auth state
  if (loading) {
    console.log('Login: Authentication still loading, showing loading screen');
    console.log('Login: Current URL:', window.location.href);
    console.log('Login: Search params:', searchParams.toString());
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fpk-purple to-fpk-amber">
        <div className="text-white flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <div>Loading...</div>
          <div className="text-sm opacity-80">Checking authentication...</div>
        </div>
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
            
            {/* Enrollment Message */}
            {enrollCourseId && (
              <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <GraduationCap className="h-5 w-5" />
                  <span className="font-medium">Ready to Enroll?</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sign up to enroll in <span className="font-medium text-foreground">"{getCourseTitle(enrollCourseId)}"</span> and start your learning journey today!
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={enrollCourseId ? "signup" : "signin"} className="w-full" onValueChange={setActiveTab}>
              {/* Default to signup tab if enrolling */}
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
                <div className="flex flex-col items-center gap-2 mb-4">
                  <PageHelpTrigger onOpen={handleShowSignInVideo} label="How this page works" />
                </div>
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
                     >
                       Forgot password?
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
                <div className="flex flex-col items-center gap-2 mb-4">
                  <PageHelpTrigger onOpen={handleShowVideoGuide} label="How this page works" />
                </div>
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

        {/* Modals */}
        <ForgotPasswordModal
          isOpen={showForgotPasswordModal}
          onClose={() => setShowForgotPasswordModal(false)}
          defaultEmail={signInData.email}
        />
        
        <ResetPasswordModal
          isOpen={showResetPasswordModal}
          onClose={() => setShowResetPasswordModal(false)}
          onSuccess={handleResetPasswordSuccess}
          userEmail={resetUserEmail}
        />
        
        <FirstVisitVideoModal
          isOpen={showVideoGuideModal}
          onClose={handleVideoGuideClose}
          title="How to Sign Up and Use Coupon Codes"
          contentHtml={`<div class="videoWrap"><iframe src="https://www.youtube.com/embed/YDGjZksEYmg?si=FSxE9q8YDFN-79LD" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><p style="text-align: center; margin-top: 16px; font-size: 14px; color: #6b7280;">Watch this quick guide to learn how to sign up and redeem coupon codes for discounts or free access.</p>`}
        />
        
        <FirstVisitVideoModal
          isOpen={showSignInVideoModal}
          onClose={handleSignInVideoClose}
          title="How to Sign In"
          contentHtml={`<div class="videoWrap"><iframe src="https://www.youtube.com/embed/mZBNpSGKITc?si=R5q0WSikYBTpmVjh" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><p style="text-align: center; margin-top: 16px; font-size: 14px; color: #6b7280;">Learn how to sign in and access your personalized learning dashboard quickly and securely.</p>`}
        />

        <div className="mt-8 flex flex-col items-center space-y-4 text-center">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Button 
              variant="link" 
              className="text-white/80 hover:text-white text-sm"
              onClick={() => navigate('/organization-signup')}
            >
              Instructor/Parent? Create an Organization
            </Button>
            <Button 
              variant="link" 
              className="text-white/80 hover:text-white text-sm"
              onClick={() => navigate('/org/join')}
            >
              Have an Invite Code?
            </Button>
            <Button 
              variant="link" 
              className="text-white/80 hover:text-white text-sm font-medium"
              onClick={() => navigate('/organization-login')}
            >
              Organization Login
            </Button>
          </div>
          
          <div className="flex space-x-6">
            <Button 
              variant="link" 
              className="text-white/80 hover:text-white text-sm"
              onClick={() => navigate('/choose-plan')}
            >
              View Pricing Plans
            </Button>
            <Button 
              variant="link" 
              className="text-white/80 hover:text-white text-sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Home
            </Button>
          </div>
          
          <div className="flex space-x-4 text-xs">
            <Button 
              variant="link" 
              className="text-white/60 hover:text-white/80 text-xs p-0 h-auto"
              onClick={() => navigate('/privacy-policy')}
            >
              Privacy Policy
            </Button>
            <span className="text-white/40">•</span>
            <Button 
              variant="link" 
              className="text-white/60 hover:text-white/80 text-xs p-0 h-auto"
              onClick={() => navigate('/terms-of-service')}
            >
              Terms of Service
            </Button>
          </div>
          
          <p className="text-white/50 text-xs">
            {tString('betaVersion')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;