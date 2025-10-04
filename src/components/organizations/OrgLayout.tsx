import React from 'react';
import { Outlet, Navigate, useParams } from 'react-router-dom';
import { OrgProvider } from './OrgContext';
import OrgHeader from './OrgHeader';
import { OrgNavigation } from './OrgNavigation';
import { OrgPageBanner } from './OrgPageBanner';
import { OrgWelcomeBanner } from './OrgWelcomeBanner';
import { useAuth } from '@/hooks/useAuth';
import { EnhancedOrgThemeProvider } from '@/components/theme/EnhancedOrgThemeProvider';
import { useOrgContext } from './OrgContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Loader2 } from 'lucide-react';
import aiGeneratedOrgBg from '@/assets/ai-generated-org-bg.jpg';
import stOliversCommunityCollegeBg from '@/assets/st-olivers-community-college-bg.jpg';
import waterfordWexfordEducationBg from '@/assets/waterford-wexford-education-bg.jpg';

// Background selection component that needs access to org context
function OrgLayoutContent() {
  const { currentOrg } = useOrgContext();
  const [isCollapsed, setIsCollapsed] = useLocalStorage('orgNavCollapsed', false);

  // Listen for storage changes to sync collapse state across components
  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'orgNavCollapsed' && e.newValue !== null) {
        setIsCollapsed(JSON.parse(e.newValue));
      }
    };

    // Listen for custom event from same window (localStorage doesn't fire storage event in same window)
    const handleCustomEvent = (e: CustomEvent) => {
      setIsCollapsed(e.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('orgNavCollapsedChange' as any, handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('orgNavCollapsedChange' as any, handleCustomEvent);
    };
  }, [setIsCollapsed]);

  // Determine background image to use - each organization gets its own unique background
  const getBackgroundImage = () => {
    if (!currentOrg) return aiGeneratedOrgBg;
    
    const orgName = currentOrg.organizations.name.toLowerCase();
    
    // St Oliver's Community College gets its own custom background
    if (orgName.includes("st oliver") || orgName.includes("st. oliver")) {
      return stOliversCommunityCollegeBg;
    }
    
    // Waterford and Wexford Education and Training Board gets its own custom background
    if (orgName.includes('waterford') && orgName.includes('wexford')) {
      return waterfordWexfordEducationBg;
    }
    
    // Generic AI-generated professional background for all other organizations
    return aiGeneratedOrgBg;
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: `url(${getBackgroundImage()})`
      }}
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-purple-800/10 to-purple-900/30 pointer-events-none" />
      
      {/* Fixed Header */}
      <OrgHeader />
      
      {/* Fixed Navigation */}
      <OrgNavigation />
      
      {/* Main content area - responsive margins with transition */}
      <main className={`pt-16 min-h-screen transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
        <div className="p-4 md:p-6">
          <OrgWelcomeBanner />
          <OrgPageBanner />
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default function OrgLayout() {
  const { user, loading } = useAuth();
  const { orgId } = useParams();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <OrgProvider orgId={orgId}>
      <EnhancedOrgThemeProvider>
        <OrgLayoutContent />
      </EnhancedOrgThemeProvider>
    </OrgProvider>
  );
}