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
      className="py-8 sm:py-12 md:py-16 mb-4 sm:mb-8 rounded-lg overflow-hidden shadow-lg" 
      overlay={false}
    />
  );
}