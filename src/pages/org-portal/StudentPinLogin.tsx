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

export default function StudentPinLogin() {
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [orgId, setOrgId] = useState<string | null>(null);
  const [orgName, setOrgName] = useState<string>('');
  const [fullName, setFullName] = useState('');
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

  // Apply branding colors
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

    if (!fullName.trim()) {
      setError('Please enter your full name');
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
      const { data, error: loginError } = await supabase.functions.invoke('student-pin-login', {
        body: {
          org_id: orgId,
          full_name: fullName.trim(),
          pin
        }
      });

      if (loginError) {
        console.error('Login error:', loginError);
        setError('Login failed. Please check your credentials and try again.');
        return;
      }

      if (!data?.success) {
        setError(data?.error || 'Invalid name or PIN');
        return;
      }

      // Login successful
      toast({
        title: 'Login Successful',
        description: 'Redirecting to your dashboard...'
      });

      // Redirect to student dashboard
      navigate(data.redirect_url || `/students/dashboard?org=${orgId}`);
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <OrgBanner className="fixed inset-0 bg-cover" overlay={true} overlayOpacity={0.3} />
        <div className="relative z-10">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Full-screen background banner */}
      <OrgBanner className="fixed inset-0 bg-cover" overlay={true} overlayOpacity={0.3} />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* Banner at top */}
        <div className="w-full mb-4">
          <OrgBanner className="h-24 sm:h-32 rounded-lg overflow-hidden shadow-lg" overlay={false} />
        </div>
        
        <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(`/${orgSlug}`)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Portal
        </Button>

        {/* Logo Section */}
        <div className="text-center mb-8">
          {branding?.logo_url ? (
            <img 
              src={branding.logo_url} 
              alt={`${orgName} logo`}
              className="h-20 mx-auto mb-4 object-contain"
            />
          ) : (
            <div className="w-20 h-20 mx-auto mb-4 bg-orange-500/10 rounded-full flex items-center justify-center">
              <LogIn className="w-10 h-10 text-orange-500" />
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900">
            {orgName}
          </h1>
          <p className="text-gray-600 mt-1">Student Login</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setError(null);
                }}
                placeholder="Enter your full name"
                required
                disabled={loading}
                className="h-12"
              />
              <p className="text-xs text-gray-500">
                Enter your name exactly as it appears in the system
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
              className="w-full h-12 text-lg bg-orange-500 hover:bg-orange-600 text-white"
              disabled={loading || !fullName.trim() || pin.length !== 6}
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

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-gray-500">
            <p>Powered by FPK University</p>
          </div>
        </div>
      </div>
    </div>
  );
}