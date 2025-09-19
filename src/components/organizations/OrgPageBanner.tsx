import React from 'react';
import { useLocation } from 'react-router-dom';
import { OrgBanner } from '@/components/branding/OrgBanner';
import { useOrgContext } from './OrgContext';
export function OrgPageBanner() {
  const location = useLocation();
  const {
    currentOrg
  } = useOrgContext();

  // Don't show banner on dashboard (main org page)
  const isDashboard = location.pathname === `/org/${currentOrg?.organization_id}`;
  if (isDashboard || !currentOrg) {
    return null;
  }
  return <OrgBanner className="h-40 mb-8 rounded-lg overflow-hidden shadow-lg" overlay={true} overlayOpacity={0.4}>
      <div className="h-full flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
            {currentOrg.organizations.name}
          </h1>
          
        </div>
      </div>
    </OrgBanner>;
}