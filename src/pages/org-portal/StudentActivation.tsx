import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, Loader2, AlertCircle, UserCheck } from 'lucide-react';
import { useOrgBranding } from '@/hooks/useOrgBranding';
import { useToast } from '@/hooks/use-toast';
import { OrgBanner } from '@/components/branding/OrgBanner';

export default function StudentActivation() {
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const token = searchParams.get('token');
  
  const [orgId, setOrgId] = useState<string | null>(null);
  const [orgName, setOrgName] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [fullName, setFullName] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState(false);
  
  const { data: branding } = useOrgBranding(orgId);

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token || !orgSlug) {
        setError('Invalid activation link');
        setValidating(false);
        return;
      }

      try {
        // Get organization
        const { data: org, error: orgError } = await supabase
          .from('organizations')
          .select('id, name')
          .eq('slug', orgSlug)
          .single();

        if (orgError || !org) {
          setError('Organization not found');
          setValidating(false);
          return;
        }

        setOrgId(org.id);
        setOrgName(org.name);

        // Validate token
        const { data: student, error: tokenError } = await supabase
          .from('org_students')
          .select('id, full_name, activation_token, token_expires_at, activation_status')
          .eq('org_id', org.id)
          .eq('activation_token', token)
          .single();

        if (tokenError || !student) {
          setError('Invalid or expired activation link');
          setValidating(false);
          return;
        }

        if (student.activation_status !== 'pending') {
          setError('This activation link has already been used');
          setValidating(false);
          return;
        }

        const expiresAt = new Date(student.token_expires_at);
        if (expiresAt < new Date()) {
          setError('This activation link has expired');
          setValidating(false);
          return;
        }

        // Token is valid
        setStudentName(student.full_name);
        setFullName(student.full_name);
        setTokenValid(true);
      } catch (error) {
        console.error('Token validation error:', error);
        setError('Failed to validate activation link');
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [token, orgSlug]);

  // Apply branding colors
  useEffect(() => {
    if (branding?.theme_accent) {
      document.documentElement.style.setProperty('--org-accent', branding.theme_accent);
    }

    return () => {
      document.documentElement.style.removeProperty('--org-accent');
    };
  }, [branding]);

  const handlePinChange = (value: string, isConfirm: boolean) => {
    const cleanValue = value.replace(/\D/g, '').slice(0, 6);
    if (isConfirm) {
      setConfirmPin(cleanValue);
    } else {
      setPin(cleanValue);
    }
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please confirm your full name');
      return;
    }

    if (fullName.trim().toLowerCase() !== studentName.toLowerCase()) {
      setError('Name does not match. Please enter your name exactly as shown above.');
      return;
    }

    if (pin.length !== 6) {
      setError('PIN must be exactly 6 digits');
      return;
    }

    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    setLoading(true);

    try {
      const { data, error: activationError } = await supabase.functions.invoke('activate-student-account', {
        body: {
          token,
          full_name: fullName.trim(),
          pin
        }
      });

      if (activationError) {
        console.error('Activation error:', activationError);
        setError('Activation failed. Please try again.');
        return;
      }

      if (!data?.success) {
        setError(data?.error || 'Activation failed');
        return;
      }

      // Activation successful - use the auth link to authenticate
      if (data.auth_link) {
        toast({
          title: 'Account Activated!',
          description: 'Redirecting to your dashboard...'
        });

        // Navigate to the auth link which will authenticate and redirect
        setTimeout(() => {
          window.location.href = data.auth_link;
        }, 500);
      } else {
        // Fallback to login page if no auth link
        toast({
          title: 'Account Activated!',
          description: 'Redirecting to login...'
        });

        setTimeout(() => {
          navigate(`/${orgSlug}/login`);
        }, 1500);
      }
    } catch (error) {
      console.error('Activation error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <OrgBanner className="fixed inset-0 bg-cover" overlay={false} />
        <div className="relative z-10 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-white drop-shadow-lg mx-auto mb-4" />
          <p className="text-white drop-shadow-lg">Validating activation link...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center p-4">
        <OrgBanner className="fixed inset-0 bg-cover" overlay={false} />
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Invalid Activation Link
              </h2>
              <p className="text-gray-600 mb-6">
                {error || 'This activation link is invalid or has expired.'}
              </p>
              <Button
                onClick={() => navigate('/')}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Full-screen background */}
      <OrgBanner className="fixed inset-0 bg-cover" overlay={false} />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col p-4 pt-8">
        {/* Orange transparent banner at top */}
        <div className="w-full max-w-4xl mx-auto mb-8">
          <div className="bg-orange-500/80 backdrop-blur-md rounded-lg shadow-lg p-6">
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
                  {orgName}
                </h1>
                <p className="text-white/90 text-sm sm:text-base drop-shadow-md">Activate Your Account</p>
              </div>
            </div>
          </div>
        </div>
      
        <div className="w-full max-w-md mx-auto">

        {/* Activation Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900 font-medium mb-1">
              Welcome, {studentName}!
            </p>
            <p className="text-xs text-blue-700">
              Please confirm your name and create a 6-digit PIN to activate your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">Confirm Your Full Name</Label>
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
                Must match: {studentName}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin">Create 6-Digit PIN</Label>
              <Input
                id="pin"
                type="password"
                inputMode="numeric"
                pattern="\d{6}"
                value={pin}
                onChange={(e) => handlePinChange(e.target.value, false)}
                placeholder="••••••"
                required
                maxLength={6}
                disabled={loading}
                className="h-12 text-2xl tracking-widest text-center"
              />
              <p className="text-xs text-gray-500">
                Choose a memorable 6-digit PIN
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPin">Confirm PIN</Label>
              <Input
                id="confirmPin"
                type="password"
                inputMode="numeric"
                pattern="\d{6}"
                value={confirmPin}
                onChange={(e) => handlePinChange(e.target.value, true)}
                placeholder="••••••"
                required
                maxLength={6}
                disabled={loading}
                className="h-12 text-2xl tracking-widest text-center"
              />
              {pin && confirmPin && pin === confirmPin && (
                <div className="flex items-center text-green-600 text-sm">
                  <Check className="w-4 h-4 mr-1" />
                  PINs match
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg bg-orange-500 hover:bg-orange-600 text-white"
              disabled={loading || !fullName.trim() || pin.length !== 6 || pin !== confirmPin}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Activating...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Activate Account
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded inline-block shadow-md">
          <p>Powered by FPK University</p>
        </div>
        </div>
      </div>
    </div>
  );
}