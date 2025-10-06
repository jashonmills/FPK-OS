import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserOrganizations } from '@/hooks/useUserOrganization';
import type { UserOrganizationMembership } from '@/hooks/useUserOrganization';
import { useNavigate } from 'react-router-dom';
import { useOrgBranding } from '@/hooks/useOrgBranding';
import { safeLocalStorage } from '@/utils/safeStorage';

// Utility to sanitize organization names that may contain error text
const sanitizeOrgName = (name: string): string => {
  if (!name) return '';
  
  // Extract first line before any error markers
  const firstLine = name.split(/\n|at |https?:\/\//)[0].trim();
  
  // If the first line looks like an error (contains common error patterns), return a fallback
  if (firstLine.includes('Error') || firstLine.includes('Provider') || firstLine.length > 200) {
    return 'Organization';
  }
  
  return firstLine || 'Organization';
};

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
  const { data: rawOrganizations = [], isLoading, error } = useUserOrganizations();
  const navigate = useNavigate();
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [currentOrg, setCurrentOrg] = useState<UserOrganizationMembership | null>(null);

  // Log organization loading state for debugging
  useEffect(() => {
    console.log('🏢 [OrgContext] Organization state:', {
      isLoading,
      hasError: !!error,
      error: error?.message,
      organizationsCount: rawOrganizations?.length || 0,
      organizations: rawOrganizations?.map(o => ({
        id: o.organization_id,
        name: o.organizations.name,
        role: o.role
      })),
      activeOrgId,
      currentOrg: currentOrg ? {
        id: currentOrg.organization_id,
        name: currentOrg.organizations.name,
        role: currentOrg.role
      } : null
    });
  }, [rawOrganizations, isLoading, error, activeOrgId, currentOrg]);

  // Sanitize organization names to remove any error text
  const organizations = useMemo(() => {
    return rawOrganizations.map(org => ({
      ...org,
      organizations: {
        ...org.organizations,
        name: sanitizeOrgName(org.organizations.name)
      }
    }));
  }, [rawOrganizations]);

  // Initialize activeOrgId from props or localStorage (safe)
  useEffect(() => {
    const orgFromStorage = safeLocalStorage.getItem<string>('fpk.activeOrgId', {
      fallbackValue: null,
      logErrors: false
    });
    
    // Priority: orgId prop > localStorage
    if (orgId) {
      setActiveOrgId(orgId);
      safeLocalStorage.setItem('fpk.activeOrgId', orgId);
    } else if (orgFromStorage && orgFromStorage !== 'null') {
      setActiveOrgId(orgFromStorage);
    } else {
      setActiveOrgId(null);
    }
  }, [orgId]);

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
      // Navigate to personal learner dashboard
      navigate('/dashboard/learner');
    }
  };

  const switchToPersonal = () => {
    switchOrganization(null);
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

// Safe version that returns null instead of throwing when used outside OrgProvider
export function useOptionalOrgContext() {
  const context = useContext(OrgContext);
  return context || null;
}