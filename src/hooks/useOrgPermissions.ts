import { useOptionalOrgContext } from '@/components/organizations/OrgContext';

export function useOrgPermissions() {
  const orgContext = useOptionalOrgContext();
  
  // Safe defaults when no org context available (e.g., Personal mode)
  const isPersonalMode = orgContext?.isPersonalMode ?? true;
  
  // USE EFFECTIVE ROLE (respects "View As" impersonation)
  const effectiveRole = orgContext?.getEffectiveRole?.() ?? null;

  const canManageOrg = () => {
    if (isPersonalMode) return false;
    return effectiveRole === 'owner' || effectiveRole === 'admin';
  };

  const canManageBranding = () => {
    return canManageOrg();
  };

  const canManageStudents = () => {
    if (isPersonalMode) return false;
    const educatorRoles = ['owner', 'admin', 'instructor', 'instructor_aide'];
    return educatorRoles.includes(effectiveRole || '');
  };

  const canViewOrgAnalytics = () => {
    return canManageOrg();
  };

  const isOrgOwner = () => {
    if (isPersonalMode) return false;
    return effectiveRole === 'owner';
  };

  const isOrgInstructor = () => {
    if (isPersonalMode) return false;
    return effectiveRole === 'instructor';
  };

  const isOrgStudent = () => {
    if (isPersonalMode) return false;
    return effectiveRole === 'student';
  };

  return {
    canManageOrg,
    canManageBranding,
    canManageStudents,
    canViewOrgAnalytics,
    isOrgOwner,
    isOrgInstructor,
    isOrgStudent,
  };
}
