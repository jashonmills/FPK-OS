import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { LogIn, Loader2 } from 'lucide-react';
import { useOrgBranding } from '@/hooks/useOrgBranding';

export default function OrgPortalLanding() {
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const navigate = useNavigate();
  const [orgId, setOrgId] = useState<string | null>(null);
  const [orgName, setOrgName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { data: branding } = useOrgBranding(orgId);

  useEffect(() => {
    const loadOrganization = async () => {
      if (!orgSlug) {
        setLoading(false);
        return;
      }

      try {
        const { data: org, error } = await supabase
          .from('organizations')
          .select('id, name, description')
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
        setLoading(false);
      }
    };

    loadOrganization();
  }, [orgSlug, navigate]);

  // Apply organization branding colors
  useEffect(() => {
    if (branding?.theme_accent) {
      document.documentElement.style.setProperty('--org-accent', branding.theme_accent);
    }

    return () => {
      document.documentElement.style.removeProperty('--org-accent');
    };
  }, [branding]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          {branding?.logo_url ? (
            <img 
              src={branding.logo_url} 
              alt={`${orgName} logo`}
              className="h-24 mx-auto mb-4 object-contain"
            />
          ) : (
            <div className="w-24 h-24 mx-auto mb-4 bg-orange-500/10 rounded-full flex items-center justify-center">
              <LogIn className="w-12 h-12 text-orange-500" />
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {orgName}
          </h1>
          <p className="text-lg text-gray-600">
            Student Portal
          </p>
        </div>

        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Welcome Back!
              </h2>
              <p className="text-gray-600">
                Sign in to access your learning dashboard and track your progress.
              </p>
            </div>

            <Button
              onClick={() => navigate(`/${orgSlug}/login`)}
              className="w-full h-12 text-lg bg-orange-500 hover:bg-orange-600 text-white"
              size="lg"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Student Login
            </Button>

            <div className="text-center text-sm text-gray-500">
              <p>Need help? Contact your organization administrator.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Powered by FPK University</p>
        </div>
      </div>
    </div>
  );
}