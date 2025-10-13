import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, CheckCircle2, Sparkles, Target, MessageSquare, X, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { FpkUniversityAddon } from '@/components/coach/FpkUniversityAddon';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
  const { createCheckout } = useSubscription();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);
  const [selectedTier, setSelectedTier] = useState<'basic' | 'pro' | 'pro_plus' | null>(null);
  const [addFpkUniversity, setAddFpkUniversity] = useState(false);

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
      description: 'Advanced AI that adapts to your learning style and pace, providing personalized recommendations and insights tailored to your unique needs.'
    },
    {
      icon: MessageSquare,
      title: 'Socratic Dialogue',
      description: 'Learn through guided questions and exploration. Our AI coach uses the Socratic method to deepen understanding and critical thinking.'
    },
    {
      icon: Target,
      title: 'Personalized Guidance',
      description: 'Tailored coaching based on your goals and progress. Track your journey and receive custom strategies to accelerate your learning.'
    },
    {
      icon: Sparkles,
      title: 'Continuous Support',
      description: '24/7 access to your personal AI study coach. Get help whenever you need it, whether you\'re studying late at night or early in the morning.'
    }
  ];

  const subscriptionTiers = [
    {
      name: 'AI Coach Basic',
      tier: 'basic',
      price: '$29',
      period: 'month',
      badge: 'Daily Learner',
      features: [
        '1,700 AI Credits per month',
        'Approx. 15 mins of daily use',
        '2 credits per Free Chat turn',
        '3 credits per Socratic turn',
        'Full Chat History',
        'Basic Analytics',
        '7-day free trial'
      ]
    },
    {
      name: 'AI Coach Pro',
      tier: 'pro',
      price: '$49',
      period: 'month',
      badge: 'Most Popular',
      popular: true,
      features: [
        '3,500 AI Credits per month',
        'Approx. 30 mins of daily use',
        '2 credits per Free Chat turn',
        '3 credits per Socratic turn',
        'Full Chat History',
        'Advanced Analytics Dashboard',
        'Priority support',
        '7-day free trial'
      ]
    },
    {
      name: 'AI Coach Pro+',
      tier: 'pro_plus',
      price: '$99',
      period: 'month',
      badge: 'Power User',
      features: [
        '7,000 AI Credits per month',
        'Approx. 60 mins of daily use',
        '2 credits per Free Chat turn',
        '3 credits per Socratic turn',
        'Full Chat History',
        'Advanced Analytics Dashboard',
        'Custom Study Plans (Coming Soon)',
        'Dedicated support',
        '7-day free trial'
      ]
    }
  ];

  const handleSubscribe = async (tier: 'basic' | 'pro' | 'pro_plus') => {
    try {
      setIsLoading(true);
      setSelectedTier(tier);
      await createCheckout(tier, 'monthly', undefined, addFpkUniversity);
      toast({
        title: 'Redirecting to checkout...',
        description: 'Please complete your subscription in the new window.',
      });
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to start checkout. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* Hero Section - Two Column Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Column: Value Proposition & Features */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white drop-shadow-lg">
                  Unlock Your Learning Potential
                </h2>
                <p className="text-lg text-white/90 drop-shadow-md">
                  Experience personalized, AI-powered coaching that helps you master any subject with confidence.
                </p>
              </div>

              {/* 2x2 Feature Grid - Interactive Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  const isExpanded = expandedFeature === index;
                  
                  return (
                    <Collapsible
                      key={index}
                      open={isExpanded}
                      onOpenChange={(open) => setExpandedFeature(open ? index : null)}
                    >
                      <Card className="bg-white/10 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all group overflow-hidden">
                        <CollapsibleTrigger asChild>
                          <button className="w-full p-4 text-left cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                                  <IconComponent className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-semibold text-white text-sm">{feature.title}</h3>
                              </div>
                              {isExpanded && (
                                <X className="w-4 h-4 text-white/60 flex-shrink-0" />
                              )}
                            </div>
                          </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="px-4 pb-4 pt-2">
                            <p className="text-sm text-white/80 leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Auth Form with Glassmorphic Style */}
            <div className="lg:sticky lg:top-8">
              <Card className="shadow-2xl bg-white/10 backdrop-blur-lg border border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-xl">{isLogin ? 'Sign In' : 'Create Account'}</CardTitle>
                <CardDescription className="text-white/80">
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
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      minLength={6}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
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
                    className="text-white hover:text-white/80 hover:underline transition-colors"
                    disabled={isLoading}
                  >
                    {isLogin
                      ? "Don't have an account? Sign up"
                      : 'Already have an account? Sign in'}
                  </button>
                </div>

                {!isLogin && (
                  <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/20">
                    <p className="text-xs text-white/80 text-center">
                      After signup, you'll need to request AI Coach access. Contact support or check your email for instructions.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          </div>
        </div>

        {/* Subscription Tiers Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Choose Your Plan
            </h2>
            <p className="text-lg text-white/90 drop-shadow-md max-w-2xl mx-auto">
              Select the perfect plan to unlock your full learning potential with our AI-powered study coach.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {subscriptionTiers.map((tier) => (
              <Card 
                key={tier.tier}
                onClick={() => setSelectedTier(tier.tier as 'basic' | 'pro' | 'pro_plus')}
                className={`relative bg-white/10 backdrop-blur-lg border transition-all cursor-pointer ${
                  tier.popular 
                    ? 'border-white/40 ring-2 ring-white/30 shadow-2xl scale-105' 
                    : 'border-white/20 hover:border-white/30'
                } ${
                  selectedTier === tier.tier 
                    ? 'ring-2 ring-primary border-primary' 
                    : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-1">
                      {tier.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8 pt-8">
                  {!tier.popular && (
                    <Badge variant="outline" className="mb-2 mx-auto bg-white/10 text-white border-white/30">
                      {tier.badge}
                    </Badge>
                  )}
                  <CardTitle className="text-2xl font-bold text-white">{tier.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">{tier.price}</span>
                    <span className="text-white/70 ml-2">/{tier.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/90 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubscribe(tier.tier as 'basic' | 'pro' | 'pro_plus');
                    }}
                    disabled={isLoading}
                    className={`w-full mt-6 ${
                      tier.popular
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                        : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                    size="lg"
                  >
                    {isLoading ? 'Processing...' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FPK University Add-On Section */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                Supercharge Your Learning
              </h2>
              <p className="text-lg text-white/90 drop-shadow-md max-w-2xl mx-auto">
                Get the complete FPK University experience with your AI Study Coach subscription
              </p>
            </div>
            
            <FpkUniversityAddon
              selectedTier={selectedTier}
              isChecked={addFpkUniversity}
              onToggle={setAddFpkUniversity}
            />
          </div>

          {/* Credit Pack Top-up Options */}
          <div className="mt-12 max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Need More Credits?</h3>
              <p className="text-white/80 drop-shadow-md">Top up your account anytime with extra credit packs</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* 500 Credit Pack */}
              <Card className="relative bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-lg border-2 border-purple-400/40">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    <CardTitle className="text-xl font-bold text-white">500 AI Credits</CardTitle>
                  </div>
                  <CardDescription className="text-white/70">
                    One-time purchase
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <p className="text-5xl font-bold text-white">$10</p>
                    <p className="text-sm text-white/60 mt-2">Perfect for occasional top-ups</p>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    size="lg"
                  >
                    Buy Now
                  </Button>
                </CardContent>
              </Card>

              {/* 1000 Credit Pack */}
              <Card className="relative bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-lg border-2 border-blue-400/40">
                <div className="absolute -top-3 -right-3">
                  <Badge className="bg-blue-500 text-white px-3 py-1 text-sm">Better Value</Badge>
                </div>
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-blue-400" />
                    <CardTitle className="text-xl font-bold text-white">1,000 AI Credits</CardTitle>
                  </div>
                  <CardDescription className="text-white/70">
                    One-time purchase
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <p className="text-5xl font-bold text-white">$18</p>
                    <p className="text-sm text-white/60 mt-2">Save 10% with the larger pack</p>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                    size="lg"
                  >
                    Buy Now
                  </Button>
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
