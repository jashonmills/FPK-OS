import React from 'react';
import { useLocation } from 'react-router-dom';
import { OrgBanner } from '@/components/branding/OrgBanner';
import { useOrgContext } from './OrgContext';
export function OrgPageBanner() {
  const location = useLocation();
  const { currentOrg, isLoading } = useOrgContext();

  // Don't render anything while loading to prevent flash
  if (isLoading) {
    return null;
  }

  // After loading, if no org, don't show banner
  if (!currentOrg) {
    return null;
  }
  
  return (
    <OrgBanner 
      className="h-24 sm:h-32 md:h-40 mb-4 sm:mb-8 rounded-lg overflow-hidden shadow-lg" 
      overlay={false}
    />
  );
}