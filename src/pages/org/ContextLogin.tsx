import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Lock, ShieldCheck } from 'lucide-react';
interface OrgInfo {
  id: string;
  name: string;
  logo_url?: string;
}

/**
 * ContextLogin - Step-Up Authentication Page
 * 
 * This is the central hub for PIN-based organizational access.
 * Platform users must enter their organizational PIN here before accessing
 * role-specific dashboards (student portal, educator dashboard, etc.)
 * 
 * Flow:
 * 1. User is already logged into main FPK platform (email/password)
 * 2. User navigates to /{orgSlug}/context-login
 * 3. User enters their 6-digit PIN for this organization
 * 4. On success: sessionStorage flag is set, redirect to role-specific dashboard
 * 5. On failure: Show error, allow retry
 */
export default function ContextLogin() {
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [orgInfo, setOrgInfo] = useState<OrgInfo | null>(null);
  const [isLoadingOrg, setIsLoadingOrg] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  useEffect(() => {
    if (orgSlug && user) {
      fetchOrgInfo();
    }
  }, [orgSlug, user]);

  const checkAuthState = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Not logged in at all - redirect to main login
        toast({
          title: "Authentication Required",
          description: "Please log in to access this organization",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }

      // Check if this is a "student-portal" special user
      const isStudentPortalUser = session.user.email?.endsWith('@portal.fpkuniversity.com');
      
      if (isStudentPortalUser) {
        // Student-portal users should use the PIN login page instead
        navigate(`/${orgSlug}/login`, { replace: true });
        return;
      }

      setUser(session.user);
    } catch (error) {
      console.error('Auth check error:', error);
      toast({
        title: "Error",
        description: "Failed to verify authentication",
        variant: "destructive"
      });
      navigate('/login');
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const fetchOrgInfo = async () => {
    if (!orgSlug) return;
    
    setIsLoadingOrg(true);
    const { data, error } = await supabase
      .from('organizations')
      .select('id, name, logo_url')
      .eq('slug', orgSlug)
      .single();

    if (error || !data) {
      toast({
        title: "Organization Not Found",
        description: "The organization you're trying to access doesn't exist",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    setOrgInfo(data);
    setIsLoadingOrg(false);
  };

  const handlePinChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    } else if (e.key === 'Enter' && pin.every(digit => digit !== '')) {
      handleSubmit(e as any);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !orgInfo) {
      toast({
        title: "Error",
        description: "Missing required information",
        variant: "destructive"
      });
      return;
    }

    const pinString = pin.join('');
    if (pinString.length !== 6) {
      toast({
        title: "Invalid PIN",
        description: "Please enter all 6 digits",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);

    try {
      const { data, error } = await supabase.functions.invoke('verify-context-pin', {
        body: {
          userId: user.id,
          orgId: orgInfo.id,
          pin: pinString
        }
      });

      if (error) throw error;

      if (!data.success) {
        toast({
          title: "Invalid PIN",
          description: data.error || "The PIN you entered is incorrect",
          variant: "destructive"
        });
        // Clear PIN for retry
        setPin(['', '', '', '', '', '']);
        document.getElementById('pin-0')?.focus();
        return;
      }

      // Success! Set session context and redirect
      const sessionContext = {
        orgId: orgInfo.id,
        role: data.role,
        userId: user.id,
        timestamp: Date.now()
      };
      
      sessionStorage.setItem('activeOrgContext', JSON.stringify(sessionContext));

      toast({
        title: "Access Granted",
        description: `Welcome! Redirecting to your ${data.role} portal...`
      });

      // Redirect based on role
      setTimeout(() => {
        switch (data.role) {
          case 'student':
            navigate(`/${orgSlug}/student-portal`, { replace: true });
            break;
          case 'instructor':
          case 'educator':
            navigate(`/${orgSlug}/educator-dashboard`, { replace: true });
            break;
          case 'owner':
            // Owners bypass PIN, but if they somehow ended up here, send them home
            navigate(`/${orgSlug}`, { replace: true });
            break;
          default:
            navigate(`/${orgSlug}`, { replace: true });
        }
      }, 1000);

    } catch (error: any) {
      console.error('PIN verification error:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to verify PIN. Please try again.",
        variant: "destructive"
      });
      setPin(['', '', '', '', '', '']);
      document.getElementById('pin-0')?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  if (isCheckingAuth || isLoadingOrg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md border-2 shadow-xl">
        <CardHeader className="space-y-4 text-center">
          {orgInfo?.logo_url && (
            <div className="flex justify-center">
              <img 
                src={orgInfo.logo_url} 
                alt={orgInfo.name} 
                className="h-16 w-auto object-contain"
              />
            </div>
          )}
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            Enter Your PIN
          </CardTitle>
          <CardDescription className="text-base">
            {orgInfo?.name ? (
              <>Enter your 6-digit PIN for <span className="font-semibold text-foreground">{orgInfo.name}</span></>
            ) : (
              'Enter your 6-digit organizational PIN'
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PIN Input */}
            <div className="flex justify-center gap-2">
              {pin.map((digit, index) => (
                <Input
                  key={index}
                  id={`pin-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold"
                  disabled={isVerifying}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold"
              disabled={isVerifying || pin.some(d => d === '')}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-5 w-5" />
                  Verify PIN
                </>
              )}
            </Button>

            {/* Security Note */}
            <p className="text-xs text-muted-foreground text-center">
              🔒 Your PIN is securely encrypted and never stored in plain text
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
