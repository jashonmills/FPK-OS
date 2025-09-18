import React from 'react';
import { Outlet, Navigate, useParams } from 'react-router-dom';
import { OrgProvider } from './OrgContext';
import OrgHeader from './OrgHeader';
import { OrgNavigation } from './OrgNavigation';
import { useAuth } from '@/hooks/useAuth';
import { EnhancedOrgThemeProvider } from '@/components/theme/EnhancedOrgThemeProvider';
import { useOrgContext } from './OrgContext';
import { Loader2 } from 'lucide-react';
import aiGeneratedOrgBg from '@/assets/ai-generated-org-bg.jpg';
import stOliversCommunityCollegeBg from '@/assets/st-olivers-community-college-bg.jpg';
import waterfordWexfordEducationBg from '@/assets/waterford-wexford-education-bg.jpg';

// Background selection component that needs access to org context
function OrgLayoutContent() {
  const { currentOrg } = useOrgContext();

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
      
      {/* Header - Fixed to top */}
      <div className="relative z-20">
        <OrgHeader />
      </div>
      
      {/* Main layout - Navigation and Content */}
      <div className="relative z-10 flex">
        {/* Navigation - Fixed to left side */}
        <div className="relative z-10">
          <OrgNavigation />
        </div>
        
        {/* Main content - Scrollable */}
        <main className="flex-1 p-6 overflow-y-auto" style={{ height: 'calc(100vh - 4rem)', paddingTop: '1.5rem' }}>
          <Outlet />
        </main>
      </div>
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