import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserOrganizations } from '@/hooks/useUserOrganization';
import type { UserOrganizationMembership } from '@/hooks/useUserOrganization';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface OrgContextType {
  currentOrg: UserOrganizationMembership | null;
  organizations: UserOrganizationMembership[];
  isLoading: boolean;
  activeOrgId: string | null;
  isPersonalMode: boolean;
  switchOrganization: (orgId: string | null) => void;
  switchToPersonal: () => void;
}

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export function OrgProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { data: organizations = [], isLoading } = useUserOrganizations();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [currentOrg, setCurrentOrg] = useState<UserOrganizationMembership | null>(null);

  // Initialize activeOrgId from URL params or localStorage
  useEffect(() => {
    const orgFromUrl = searchParams.get('org');
    const orgFromStorage = localStorage.getItem('fpk.activeOrgId');
    
    if (orgFromUrl) {
      setActiveOrgId(orgFromUrl);
      localStorage.setItem('fpk.activeOrgId', orgFromUrl);
    } else if (orgFromStorage && orgFromStorage !== 'null') {
      setActiveOrgId(orgFromStorage);
    } else {
      setActiveOrgId(null);
    }
  }, [searchParams]);

  // Update currentOrg when activeOrgId or organizations change
  useEffect(() => {
    if (activeOrgId && organizations.length > 0) {
      const org = organizations.find(o => o.organization_id === activeOrgId);
      setCurrentOrg(org || null);
    } else {
      setCurrentOrg(null);
    }
  }, [activeOrgId, organizations]);

  const switchOrganization = (orgId: string | null) => {
    setActiveOrgId(orgId);
    
    if (orgId) {
      localStorage.setItem('fpk.activeOrgId', orgId);
      // Update URL if we're in a dashboard context
      if (window.location.pathname.includes('/dashboard/')) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('org', orgId);
        setSearchParams(newSearchParams);
      }
    } else {
      localStorage.removeItem('fpk.activeOrgId');
      // Remove org param from URL
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('org');
      setSearchParams(newSearchParams);
    }
  };

  const switchToPersonal = () => {
    switchOrganization(null);
    // Navigate to learner dashboard if in org context
    if (window.location.pathname.includes('/dashboard/instructor')) {
      navigate('/dashboard/learner');
    }
  };

  const isPersonalMode = activeOrgId === null;

  return (
    <OrgContext.Provider value={{
      currentOrg,
      organizations,
      isLoading,
      activeOrgId,
      isPersonalMode,
      switchOrganization,
      switchToPersonal,
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