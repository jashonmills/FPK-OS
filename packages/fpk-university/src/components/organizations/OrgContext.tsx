import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserOrganizations } from '@/hooks/useUserOrganization';
import type { UserOrganizationMembership } from '@/hooks/useUserOrganization';
import { useNavigate } from 'react-router-dom';
import { useOrgBranding } from '@/hooks/useOrgBranding';
import { safeLocalStorage } from '@/utils/safeStorage';
import { useParentalConsentStatus } from '@/hooks/useParentalConsentStatus';

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

export type MemberRole = 'owner' | 'admin' | 'instructor' | 'instructor_aide' | 'viewer' | 'student';

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
  getUserRole: () => MemberRole | null;
  // Role impersonation for development
  viewAsRole: MemberRole | null;
  setViewAsRole: (role: MemberRole | null) => void;
  getEffectiveRole: () => MemberRole | null;
  isImpersonating: boolean;
  canImpersonate: boolean;
  // COPPA compliance
  parentalConsentStatus: 'not_required' | 'pending' | 'approved' | 'denied' | null;
  isAILocked: boolean;
}

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export function OrgProvider({ children, orgId }: { children: React.ReactNode; orgId?: string }) {
  const { user } = useAuth();
  const { data: rawOrganizations = [], isLoading, error } = useUserOrganizations();
  const { data: consentData } = useParentalConsentStatus();
  const navigate = useNavigate();
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [currentOrg, setCurrentOrg] = useState<UserOrganizationMembership | null>(null);
  const [viewAsRole, setViewAsRoleState] = useState<MemberRole | null>(null);

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

  // Initialize viewAsRole from localStorage for the active org
  useEffect(() => {
    if (activeOrgId) {
      const storedRole = safeLocalStorage.getItem<MemberRole | null>(`fpk.viewAsRole.${activeOrgId}`, {
        fallbackValue: null,
        logErrors: false
      });
      setViewAsRoleState(storedRole);
    } else {
      setViewAsRoleState(null);
    }
  }, [activeOrgId]);

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
    // Clear impersonation when switching orgs
    setViewAsRoleState(null);
    
    if (orgId) {
      safeLocalStorage.setItem('fpk.activeOrgId', orgId);
      safeLocalStorage.removeItem(`fpk.viewAsRole.${orgId}`);
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

  // Role impersonation functions
  const actualRole = currentOrg?.role || null;
  const canImpersonate = actualRole === 'owner' || actualRole === 'admin';
  const isImpersonating = viewAsRole !== null && canImpersonate;

  const setViewAsRole = (role: MemberRole | null) => {
    if (!canImpersonate) return;
    
    setViewAsRoleState(role);
    if (activeOrgId) {
      if (role) {
        safeLocalStorage.setItem(`fpk.viewAsRole.${activeOrgId}`, role);
      } else {
        safeLocalStorage.removeItem(`fpk.viewAsRole.${activeOrgId}`);
      }
    }
  };

  const getEffectiveRole = (): MemberRole | null => {
    if (isImpersonating && viewAsRole) {
      return viewAsRole;
    }
    return actualRole;
  };

  // Helper functions for navigation context
  const getNavigationContext = (): 'personal' | 'org-student' | 'org-instructor' => {
    if (isPersonalMode) {
      return 'personal';
    }
    
    const effectiveRole = getEffectiveRole();
    if (effectiveRole === 'owner' || effectiveRole === 'admin' || effectiveRole === 'instructor') {
      return 'org-instructor';
    }
    
    return 'org-student';
  };

  const getUserRole = (): MemberRole | null => {
    return actualRole;
  };

  // COPPA compliance: AI is locked for students with pending parental consent
  const parentalConsentStatus = consentData?.parentalConsentStatus ?? null;
  const isAILocked = useMemo(() => {
    const effectiveRole = getEffectiveRole();
    return effectiveRole === 'student' && consentData?.needsParentalConsent === true;
  }, [consentData?.needsParentalConsent, viewAsRole, actualRole]);

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
      viewAsRole,
      setViewAsRole,
      getEffectiveRole,
      isImpersonating,
      canImpersonate,
      parentalConsentStatus,
      isAILocked,
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
