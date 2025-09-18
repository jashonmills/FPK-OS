import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserOrganizations } from '@/hooks/useUserOrganization';
import type { UserOrganizationMembership } from '@/hooks/useUserOrganization';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useOrgBranding } from '@/hooks/useOrgBranding';
import { safeLocalStorage } from '@/utils/safeStorage';

interface OrgContextType {
  currentOrg: UserOrganizationMembership | null;
  organizations: UserOrganizationMembership[];
  isLoading: boolean;
  activeOrgId: string | null;
  isPersonalMode: boolean;
  switchOrganization: (orgId: string | null) => void;
  switchToPersonal: () => void;
  // Navigation context helpers
  getNavigationContext: () => 'personal' | 'org-student' | 'org-instructor';
  getUserRole: () => 'owner' | 'instructor' | 'student' | null;
}

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export function OrgProvider({ children, orgId }: { children: React.ReactNode; orgId?: string }) {
  const { user } = useAuth();
  const { data: organizations = [], isLoading } = useUserOrganizations();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [currentOrg, setCurrentOrg] = useState<UserOrganizationMembership | null>(null);

  // Initialize activeOrgId from URL params, props, or localStorage (safe)
  useEffect(() => {
    const orgFromUrl = searchParams.get('org');
    const orgFromStorage = safeLocalStorage.getItem<string>('fpk.activeOrgId', {
      fallbackValue: null,
      logErrors: false
    });
    
    // Priority: URL param > orgId prop > localStorage
    if (orgFromUrl) {
      setActiveOrgId(orgFromUrl);
      safeLocalStorage.setItem('fpk.activeOrgId', orgFromUrl);
    } else if (orgId) {
      setActiveOrgId(orgId);
      safeLocalStorage.setItem('fpk.activeOrgId', orgId);
      // Update URL to include org parameter for consistency
      if (!searchParams.get('org')) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('org', orgId);
        setSearchParams(newSearchParams, { replace: true });
      }
    } else if (orgFromStorage && orgFromStorage !== 'null') {
      setActiveOrgId(orgFromStorage);
    } else {
      setActiveOrgId(null);
    }
  }, [searchParams, orgId]);

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
      safeLocalStorage.setItem('fpk.activeOrgId', orgId);
      // Navigate to organization portal homepage
      navigate(`/org/${orgId}`);
    } else {
      safeLocalStorage.removeItem('fpk.activeOrgId');
      // Remove org param from URL if switching to personal mode
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('org');
      setSearchParams(newSearchParams);
    }
  };

  const switchToPersonal = () => {
    switchOrganization(null);
    // Navigate to personal learner dashboard
    navigate('/dashboard/learner');
  };

  const isPersonalMode = activeOrgId === null;

  // Helper functions for navigation context
  const getNavigationContext = (): 'personal' | 'org-student' | 'org-instructor' => {
    if (isPersonalMode) {
      return 'personal';
    }
    
    if (currentOrg?.role === 'owner' || currentOrg?.role === 'instructor') {
      return 'org-instructor';
    }
    
    return 'org-student';
  };

  const getUserRole = (): 'owner' | 'instructor' | 'student' | null => {
    return currentOrg?.role || null;
  };

  return (
    <OrgContext.Provider value={{
      currentOrg,
      organizations,
      isLoading,
      activeOrgId,
      isPersonalMode,
      switchOrganization,
      switchToPersonal,
      getNavigationContext,
      getUserRole,
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