import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserOrganizations } from '@/hooks/useUserOrganization';
import type { UserOrganizationMembership } from '@/hooks/useUserOrganization';

interface OrgContextType {
  currentOrg: UserOrganizationMembership | null;
  organizations: UserOrganizationMembership[];
  isLoading: boolean;
  switchOrganization: (orgId: string) => void;
}

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export function OrgProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { data: organizations = [], isLoading } = useUserOrganizations();
  const [currentOrg, setCurrentOrg] = useState<UserOrganizationMembership | null>(null);

  // Set the first organization as current by default
  useEffect(() => {
    if (organizations.length > 0 && !currentOrg) {
      setCurrentOrg(organizations[0]);
    }
  }, [organizations, currentOrg]);

  const switchOrganization = (orgId: string) => {
    const org = organizations.find(o => o.organization_id === orgId);
    if (org) {
      setCurrentOrg(org);
    }
  };

  return (
    <OrgContext.Provider value={{
      currentOrg,
      organizations,
      isLoading,
      switchOrganization,
    }}>
      {children}
    </OrgContext.Provider>
  );
}

export function useOrgContext() {
  const context = useContext(OrgContext);
  if (context === undefined) {
    throw new Error('useOrgContext must be used within an OrgProvider');
  }
  return context;
}