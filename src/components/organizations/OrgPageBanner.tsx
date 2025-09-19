import React from 'react';
import { useLocation } from 'react-router-dom';
import { OrgBanner } from '@/components/branding/OrgBanner';
import { useOrgContext } from './OrgContext';
export function OrgPageBanner() {
  const location = useLocation();
  const { currentOrg } = useOrgContext();

  if (!currentOrg) {
    return null;
  }
  
  return (
    <OrgBanner 
      className="h-32 sm:h-40 mb-4 sm:mb-8 rounded-lg overflow-hidden shadow-lg" 
      overlay={false}
    />
  );
}