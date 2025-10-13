import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, CheckCircle2, Sparkles, Target, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import portalBackground from '@/assets/portal-background.png';

/**
 * CoachPortalLanding - Public entry point for AI Coach Portal
 * 
 * Phase 2: Standalone Access Control
 * 
 * Features:
 * - Login/Signup for AI Coach access
 * - Feature showcase
 * - Access request functionality
 */
const CoachPortalLanding: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, session } = useAuth();
  const { toast } = useToast();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  const locationMessage = (location.state as any)?.message;

  // Check if already logged in and has access
  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setHasAccess(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'ai_coach_user')
          .maybeSingle();

        if (data) {
          setHasAccess(true);
          // Redirect to portal
          navigate('/portal/ai-study-coach', { replace: true });
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error('Error checking access:', error);
        setHasAccess(false);
      }
    };

    checkAccess();
  }, [user, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Check if user has ai_coach_user role
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .eq('role', 'ai_coach_user')
          .maybeSingle();

        if (!roleData) {
          toast({
            title: 'Access Required',
            description: 'Your account does not have AI Coach access. Please request access.',
            variant: 'default',
          });
          return;
        }

        toast({
          title: 'Welcome back!',
          description: 'Redirecting to your AI Coach portal...',
        });

        navigate('/portal/ai-study-coach');
      } else {
        // Signup
        const redirectUrl = `${window.location.origin}/coach`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });

        if (error) throw error;

        toast({
          title: 'Account created!',
          description: 'Please check your email to verify your account. Once verified, contact support to request AI Coach access.',
        });

        setEmail('');
        setPassword('');
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(error.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Learning',
      description: 'Advanced AI that adapts to your learning style and pace'
    },
    {
      icon: MessageSquare,
      title: 'Socratic Dialogue',
      description: 'Learn through guided questions and exploration'
    },
    {
      icon: Target,
      title: 'Personalized Guidance',
      description: 'Tailored coaching based on your goals and progress'
    },
    {
      icon: Sparkles,
      title: 'Continuous Support',
      description: '24/7 access to your personal AI study coach'
    }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Full-screen background image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${portalBackground})` }}
      />
      
      {/* Overlay for better text readability */}
      <div className="fixed inset-0 z-0 bg-black/40" />
      
      {/* Content wrapper */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="border-b border-white/20 bg-black/30 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AI Study Coach Portal</h1>
                <p className="text-sm text-white/80">Your Personal Learning Companion</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Features & Description */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white drop-shadow-lg">
                  Unlock Your Learning Potential
                </h2>
                <p className="text-lg text-white/90 drop-shadow-md">
                  Experience personalized, AI-powered coaching that helps you master any subject with confidence.
                </p>
              </div>

              <div className="grid gap-4">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-black/40 border border-white/20 hover:border-white/40 hover:bg-black/50 transition-all backdrop-blur-sm">
                      <div className="flex-shrink-0 p-2 bg-white/10 rounded-lg">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-white">{feature.title}</h3>
                        <p className="text-sm text-white/80">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Auth Form */}
            <div>
              <Card className="shadow-2xl bg-white/95 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle>{isLogin ? 'Sign In' : 'Create Account'}</CardTitle>
                <CardDescription>
                  {isLogin 
                    ? 'Access your AI Study Coach portal'
                    : 'Get started with AI-powered learning'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {locationMessage && (
                  <Alert className="mb-4">
                    <AlertDescription>{locationMessage}</AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {hasAccess === false && user && (
                  <Alert className="mb-4">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      You're logged in, but you need AI Coach access. Please contact support to request access.
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        {isLogin ? 'Signing in...' : 'Creating account...'}
                      </>
                    ) : (
                      <>{isLogin ? 'Sign In' : 'Create Account'}</>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError(null);
                    }}
                    className="text-primary hover:underline"
                    disabled={isLoading}
                  >
                    {isLogin
                      ? "Don't have an account? Sign up"
                      : 'Already have an account? Sign in'}
                  </button>
                </div>

                {!isLogin && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground text-center">
                      After signup, you'll need to request AI Coach access. Contact support or check your email for instructions.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CoachPortalLanding;
