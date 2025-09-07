import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserOrganizations } from '@/hooks/useUserOrganization';
import type { UserOrganizationMembership } from '@/hooks/useUserOrganization';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useOrgBranding } from '@/hooks/useOrgBranding';

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

export function OrgProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { data: organizations = [], isLoading } = useUserOrganizations();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [currentOrg, setCurrentOrg] = useState<UserOrganizationMembership | null>(null);

  // Debug logging - Enhanced for troubleshooting
  console.log('OrgProvider - Current user:', user?.id, user?.email);
  console.log('OrgProvider - Organizations loaded:', organizations);
  console.log('OrgProvider - Organizations length:', organizations?.length);
  console.log('OrgProvider - Active org ID:', activeOrgId);
  console.log('OrgProvider - Current org:', currentOrg);
  console.log('OrgProvider - Is personal mode:', activeOrgId === null);

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
    console.log('Updating currentOrg - activeOrgId:', activeOrgId, 'organizations:', organizations.length);
    if (activeOrgId && organizations.length > 0) {
      const org = organizations.find(o => o.organization_id === activeOrgId);
      console.log('Found org for activeOrgId:', org);
      setCurrentOrg(org || null);
    } else {
      setCurrentOrg(null);
    }
  }, [activeOrgId, organizations]);

  const switchOrganization = (orgId: string | null) => {
    setActiveOrgId(orgId);
    
    if (orgId) {
      localStorage.setItem('fpk.activeOrgId', orgId);
      
      // Find the organization to check the user's role
      const selectedOrg = organizations.find(o => o.organization_id === orgId);
      
      // Navigate to appropriate dashboard based on role and current location
      if (window.location.pathname.includes('/dashboard/')) {
        if (selectedOrg?.role === 'owner' || selectedOrg?.role === 'instructor') {
          // Navigate to instructor dashboard with org parameter
          navigate(`/dashboard/instructor?org=${orgId}`);
        } else {
          // For students, stay on learner dashboard but add org parameter
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set('org', orgId);
          setSearchParams(newSearchParams);
        }
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