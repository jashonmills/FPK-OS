import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldCheck, KeyRound } from 'lucide-react';
import { CreatePinForm } from '@/components/auth/CreatePinForm';
import { VerifyPinForm } from '@/components/auth/VerifyPinForm';
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
  
  const [mode, setMode] = useState<'loading' | 'create' | 'verify' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
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

  useEffect(() => {
    if (!isCheckingAuth && !isLoadingOrg && orgInfo && user) {
      checkPinStatus();
    }
  }, [isCheckingAuth, isLoadingOrg, orgInfo, user]);

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

  const checkPinStatus = async () => {
    if (!orgInfo) return;

    try {
      console.log('[ContextLogin] Checking PIN status for org:', orgInfo.id);
      
      const { data, error } = await supabase.functions.invoke('check-pin-status', {
        body: { orgId: orgInfo.id }
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log('[ContextLogin] PIN status:', data);
      setMode(data.hasPin ? 'verify' : 'create');

    } catch (err: any) {
      console.error('[ContextLogin] Error checking PIN status:', err);
      setErrorMessage(err.message || 'Failed to check PIN status.');
      setMode('error');
    }
  };

  const handlePinCreated = () => {
    console.log('[ContextLogin] PIN created successfully, switching to verify mode');
    setMode('verify');
  };


  if (isCheckingAuth || isLoadingOrg || mode === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (mode === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
        <Card className="w-full max-w-md border-2 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-destructive">Error</CardTitle>
            <CardDescription>{errorMessage}</CardDescription>
          </CardHeader>
        </Card>
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
              {mode === 'create' ? (
                <KeyRound className="w-8 h-8 text-primary" />
              ) : (
                <ShieldCheck className="w-8 h-8 text-primary" />
              )}
            </div>
          </div>
          <CardTitle className="text-2xl">
            {mode === 'create' ? 'Create Your PIN' : 'Enter Your PIN'}
          </CardTitle>
          <CardDescription className="text-base">
            {orgInfo?.name ? (
              <>
                {mode === 'create' 
                  ? `Create a 6-digit PIN for ${orgInfo.name}`
                  : `Enter your 6-digit PIN for ${orgInfo.name}`
                }
              </>
            ) : (
              mode === 'create' ? 'Create your 6-digit organizational PIN' : 'Enter your 6-digit organizational PIN'
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {mode === 'create' ? (
            <CreatePinForm orgId={orgInfo.id} onPinCreated={handlePinCreated} />
          ) : (
            <VerifyPinForm orgId={orgInfo.id} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
