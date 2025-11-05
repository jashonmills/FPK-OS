import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AppBackground } from '@/components/layout/AppBackground';
import { Building2, ArrowLeft, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

const OrgSignup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setError('');
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/org/create`;

      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email.trim(),
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (signUpError) {
        if (signUpError.message.includes('User already registered')) {
          setError('An account with this email already exists. Please sign in instead.');
        } else if (signUpError.message.includes('Password should be')) {
          setError('Password does not meet security requirements.');
        } else {
          setError(signUpError.message);
        }
        return;
      }

      // Set flag to indicate B2B signup flow
      localStorage.setItem('b2b_signup_flow', 'true');

      // Success - user will be auto-logged in and redirected by useAuth
      toast({
        title: 'Account created!',
        description: 'Setting up your organization portal...',
      });

      // The useAuth hook will detect the b2b_signup_flow flag and redirect to /org/create
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    'Manage multiple students and staff',
    'Track progress across your organization',
    'Secure, HIPAA-compliant data storage',
    'Role-based access control',
    'Collaborative care coordination',
  ];

  return (
    <>
      <AppBackground />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-5xl relative z-10">
          {/* Back to login link */}
          <div className="mb-6">
            <Link
              to="/org/login"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Already have an account?
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Value Proposition */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-3">
                  Welcome to the Organization Portal
                </h1>
                <p className="text-lg text-muted-foreground">
                  Create your school or district account to start managing special education services with our comprehensive platform.
                </p>
              </div>

              <Card className="glass-card border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    Built for Schools & Districts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{benefit}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="text-sm text-muted-foreground">
                <p>
                  After creating your account, you'll set up your organization profile and can start adding students and staff members.
                </p>
              </div>
            </div>

            {/* Signup Form */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--gradient-hero)' }}
                  >
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Create Organization Account</CardTitle>
                <CardDescription>
                  Get started with your school or district portal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@school.edu"
                      {...register('email')}
                      disabled={loading}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      {...register('password')}
                      disabled={loading}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...register('confirmPassword')}
                      disabled={loading}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By creating an account, you agree to our{' '}
                    <Link to="/terms-of-service" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy-policy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrgSignup;
