import { useOrgContext } from '@/components/organizations/OrgContext';

export function useOrgPermissions() {
  const { currentOrg, isPersonalMode } = useOrgContext();

  const canManageOrg = () => {
    if (isPersonalMode) return false;
    return currentOrg?.role === 'owner' || currentOrg?.role === 'instructor';
  };

  const canManageBranding = () => {
    return canManageOrg();
  };

  const canManageStudents = () => {
    return canManageOrg();
  };

  const canViewOrgAnalytics = () => {
    return canManageOrg();
  };

  const isOrgOwner = () => {
    if (isPersonalMode) return false;
    return currentOrg?.role === 'owner';
  };

  const isOrgInstructor = () => {
    if (isPersonalMode) return false;
    return currentOrg?.role === 'instructor';
  };

  const isOrgStudent = () => {
    if (isPersonalMode) return false;
    return currentOrg?.role === 'student';
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