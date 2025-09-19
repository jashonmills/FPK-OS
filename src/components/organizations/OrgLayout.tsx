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
      
      {/* Header - Sticky at top */}
      <OrgHeader />
      
      {/* Main layout container with proper height for sticky context */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Navigation - Sticky to left side */}
        <OrgNavigation />
        
        {/* Main content area - scrollable */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
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