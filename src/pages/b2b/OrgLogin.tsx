import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AppBackground } from '@/components/layout/AppBackground';
import { Building2, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const OrgLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  // If already logged in, redirect to org dashboard
  if (user && !authLoading) {
    navigate('/org/dashboard');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Please confirm your email address before signing in.');
        } else {
          setError(signInError.message);
        }
        return;
      }

      // Success - useAuth will handle navigation
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: `${window.location.origin}/org/reset-password`,
      });

      if (error) throw error;

      toast({
        title: 'Reset email sent',
        description: 'Check your inbox for password reset instructions.',
      });
      setResetDialogOpen(false);
      setResetEmail('');
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to send reset email',
        variant: 'destructive',
      });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <>
      <AppBackground />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md relative z-10">
          {/* Back to main site link */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Looking for the parent portal?
            </Link>
          </div>

          <Card className="glass-card">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--gradient-hero)' }}
                >
                  <Building2 className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl">Organization Portal</CardTitle>
              <CardDescription>
                Sign in to manage your school or district
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="flex justify-end">
                  <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="link"
                        className="px-0 text-sm"
                      >
                        Forgot password?
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                        <DialogDescription>
                          Enter your email address and we'll send you a password reset link.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handlePasswordReset} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="reset-email">Email</Label>
                          <Input
                            id="reset-email"
                            type="email"
                            placeholder="admin@school.edu"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            required
                            disabled={resetLoading}
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={resetLoading}
                        >
                          {resetLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Send Reset Link
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  New organization?{' '}
                  <Link
                    to="/org/signup"
                    className="text-primary hover:underline font-medium"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrgLogin;
