import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

/**
 * AdminPortalBridge - Redirect handler for admin portal access
 * 
 * This component bridges the branded URL (/:orgSlug/admin-portal) to the 
 * authenticated organization dashboard (/org/:orgId/...).
 * 
 * Flow:
 * 1. Extracts orgSlug from URL
 * 2. Looks up organization ID from slug
 * 3. Verifies PIN step-up authentication
 * 4. Checks user role in the organization
 * 5. Redirects to appropriate dashboard:
 *    - Instructor/Owner → /org/:orgId/instructor
 *    - Other roles → /org/:orgId
 */
export default function AdminPortalBridge() {
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    handleRedirect();
  }, [orgSlug]);

  const handleRedirect = async () => {
    if (!orgSlug) {
      toast({
        title: "Error",
        description: "Organization not specified",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    try {
      // 1. Check authentication
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access this organization",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }

      // 2. Look up organization ID from slug
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('id, name')
        .eq('slug', orgSlug)
        .single();

      if (orgError || !orgData) {
        toast({
          title: "Organization Not Found",
          description: "The organization you're trying to access doesn't exist",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      const orgId = orgData.id;

      // 3. Verify PIN step-up authentication
      const pinVerified = sessionStorage.getItem(`org_pin_verified_${orgId}`) === 'true';
      
      if (!pinVerified) {
        // Redirect back to context login
        navigate(`/${orgSlug}/context-login`, { replace: true });
        return;
      }

      // 4. Check user's role in the organization
      const { data: memberData, error: memberError } = await supabase
        .from('org_members')
        .select('role')
        .eq('org_id', orgId)
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .single();

      if (memberError || !memberData) {
        toast({
          title: "Access Denied",
          description: "You don't have access to this organization",
          variant: "destructive"
        });
        navigate('/dashboard/learner');
        return;
      }

      // 5. Redirect based on role
      const isInstructor = ['owner', 'instructor'].includes(memberData.role);
      const targetUrl = isInstructor 
        ? `/org/${orgId}/instructor`
        : `/org/${orgId}`;

      console.log(`[AdminPortalBridge] Redirecting ${memberData.role} to:`, targetUrl);
      navigate(targetUrl, { replace: true });

    } catch (error) {
      console.error('[AdminPortalBridge] Error:', error);
      toast({
        title: "Error",
        description: "Failed to access organization dashboard",
        variant: "destructive"
      });
      navigate('/dashboard/learner');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
