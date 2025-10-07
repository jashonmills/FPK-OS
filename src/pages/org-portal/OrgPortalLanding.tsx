import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { LogIn, Loader2 } from 'lucide-react';
import { useOrgBranding } from '@/hooks/useOrgBranding';
import { OrgBanner } from '@/components/branding/OrgBanner';

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
      <div className="min-h-screen relative flex items-center justify-center">
        <OrgBanner className="fixed inset-0 bg-cover" overlay={false} />
        <div className="relative z-10">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
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
        {/* Banner at top */}
        <div className="w-full max-w-4xl mx-auto mb-8">
          <OrgBanner className="h-24 sm:h-32 md:h-40 rounded-lg overflow-hidden shadow-lg" overlay={false}>
            <div className="h-full flex items-center px-6">
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
                <p className="text-white/90 text-sm sm:text-base drop-shadow-md">Beta Plan Organization</p>
              </div>
            </div>
          </OrgBanner>
        </div>
        
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-lg inline-block">
              {orgName}
            </h1>
            <p className="text-lg text-gray-700 mt-4 bg-white/80 backdrop-blur-sm px-4 py-2 rounded inline-block">
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
          <div className="text-center mt-6 text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded inline-block">
            <p>Powered by FPK University</p>
          </div>
        </div>
      </div>
    </div>
  );
}