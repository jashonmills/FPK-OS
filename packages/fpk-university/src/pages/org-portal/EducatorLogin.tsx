import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, LogIn, Loader2, AlertCircle } from 'lucide-react';
import { useOrgBranding } from '@/hooks/useOrgBranding';
import { useToast } from '@/hooks/use-toast';
import { OrgBanner } from '@/components/branding/OrgBanner';

export default function EducatorLogin() {
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [orgId, setOrgId] = useState<string | null>(null);
  const [orgName, setOrgName] = useState<string>('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  
  const { data: branding } = useOrgBranding(orgId);

  useEffect(() => {
    const loadOrganization = async () => {
      if (!orgSlug) {
        navigate('/');
        return;
      }

      try {
        const { data: org, error } = await supabase
          .from('organizations')
          .select('id, name')
          .eq('slug', orgSlug)
          .single();

        if (error || !org) {
          console.error('Organization not found:', error);
          navigate('/');
          return;
        }

        setOrgId(org.id);
        setOrgName(org.name);
      } catch (error) {
        console.error('Error loading organization:', error);
        navigate('/');
      } finally {
        setPageLoading(false);
      }
    };

    loadOrganization();
  }, [orgSlug, navigate]);

  useEffect(() => {
    if (branding?.theme_accent) {
      document.documentElement.style.setProperty('--org-accent', branding.theme_accent);
    }

    return () => {
      document.documentElement.style.removeProperty('--org-accent');
    };
  }, [branding]);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPin(value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (pin.length !== 6) {
      setError('PIN must be exactly 6 digits');
      return;
    }

    if (!orgId) {
      setError('Organization not found');
      return;
    }

    setLoading(true);

    try {
      const { data, error: loginError } = await supabase.functions.invoke('educator-pin-login', {
        body: {
          org_id: orgId,
          email: email.trim(),
          pin
        }
      });

      if (loginError) {
        console.error('Login error:', loginError);
        setError('Login failed. Please check your credentials and try again.');
        return;
      }

      if (!data?.success) {
        setError(data?.error || 'Invalid email or PIN');
        return;
      }

      const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token
      });

      if (sessionError) {
        console.error('Session error:', sessionError);
        setError('Failed to establish session. Please try again.');
        return;
      }

      toast({
        title: 'Login Successful',
        description: 'Redirecting to your educator dashboard...'
      });
      
      setTimeout(() => {
        navigate(`/org/${orgId}/educator-dashboard`, { replace: true });
      }, 100);
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="fixed inset-0 z-0">
          <OrgBanner className="w-full h-full" overlay={false} />
        </div>
        <div className="relative z-10">
          <Loader2 className="w-8 h-8 animate-spin text-white drop-shadow-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <OrgBanner className="w-full h-full" overlay={false} />
      </div>
      
      <div className="relative z-10 min-h-screen flex flex-col p-4 pt-8">
        <div className="w-full max-w-4xl mx-auto mb-8">
          <div className="bg-blue-500/80 backdrop-blur-md rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              {branding?.logo_url && (
                <img 
                  src={branding.logo_url} 
                  alt={`${orgName} logo`}
                  className="h-16 sm:h-20 md:h-24 object-contain mr-6"
                />
              )}
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                  Welcome to {orgName}
                </h1>
                <p className="text-white/90 text-sm sm:text-base drop-shadow-md">Educator Portal</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full max-w-md mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(`/${orgSlug}`)}
            className="mb-4 bg-white/90 hover:bg-white shadow-md"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portal
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg inline-block shadow-lg">
              {orgName}
            </h1>
            <p className="text-gray-700 mt-2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded inline-block shadow-md">Educator Login</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="Enter your email address"
                  required
                  disabled={loading}
                  className="h-12"
                />
                <p className="text-xs text-gray-500">
                  Enter the email address associated with your educator account
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pin">6-Digit PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  inputMode="numeric"
                  pattern="\d{6}"
                  value={pin}
                  onChange={handlePinChange}
                  placeholder="••••••"
                  required
                  maxLength={6}
                  disabled={loading}
                  className="h-12 text-2xl tracking-widest text-center"
                />
                <p className="text-xs text-gray-500">
                  Enter your 6-digit PIN
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg bg-blue-500 hover:bg-blue-600 text-white"
                disabled={loading || !email.trim() || pin.length !== 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Need an activation link?</p>
              <p className="mt-1">Contact your organization administrator.</p>
            </div>
          </div>

          <div className="text-center mt-6 text-sm text-gray-500">
            <p>Powered by FPK University</p>
          </div>
        </div>
      </div>
    </div>
  );
}