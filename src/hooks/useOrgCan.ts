import { useOrgContext } from '@/components/organizations/OrgContext';
import { 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions,
  isEducatorRole,
  isLeadershipRole,
  canViewAllStudents,
  isScopedToAssigned,
  Permission,
  OrgRole
} from '@/lib/org/permissions';

/**
 * Hook for checking organization permissions based on the user's effective role.
 * Supports role impersonation via the "View As" feature.
 */
export function useOrgCan() {
  const orgContext = useOrgContext();
  const effectiveRole = orgContext?.getEffectiveRole() as OrgRole | undefined;
  const actualRole = orgContext?.currentOrg?.role as OrgRole | undefined;
  const isImpersonating = orgContext?.isImpersonating ?? false;
  
  /**
   * Check if user has a specific permission
   */
  const can = (permission: Permission): boolean => {
    return hasPermission(effectiveRole, permission);
  };
  
  /**
   * Check if user has ANY of the specified permissions
   */
  const canAny = (permissions: Permission[]): boolean => {
    return hasAnyPermission(effectiveRole, permissions);
  };
  
  /**
   * Check if user has ALL of the specified permissions
   */
  const canAll = (permissions: Permission[]): boolean => {
    return hasAllPermissions(effectiveRole, permissions);
  };
  
  return {
    // Core permission check
    can,
    canAny,
    canAll,
    
    // Role info
    effectiveRole,
    actualRole,
    isImpersonating,
    
    // Role type checks
    isEducator: isEducatorRole(effectiveRole),
    isLeadership: isLeadershipRole(effectiveRole),
    isOwner: effectiveRole === 'owner',
    isAdmin: effectiveRole === 'admin',
    isInstructor: effectiveRole === 'instructor',
    isInstructorAide: effectiveRole === 'instructor_aide',
    isViewer: effectiveRole === 'viewer',
    isStudent: effectiveRole === 'student',
    
    // Scoping checks
    canViewAllStudents: canViewAllStudents(effectiveRole),
    isScopedToAssigned: isScopedToAssigned(effectiveRole),
    
    // Convenience permission checks
    // Org & Governance
    canManageBilling: () => can('org.billing'),
    canAccessDangerZone: () => can('org.dangerZone'),
    canInviteUsers: () => can('org.inviteUsers'),
    canAssignRoles: () => can('org.assignRoles'),
    
    // AI Governance
    canManageAIGovernance: () => can('ai.governance.manage'),
    canManageBYOK: () => can('ai.byok.manage'),
    canManageKnowledgeBase: () => can('ai.knowledgeBase.manage'),
    canSuggestKBContent: () => canAny(['ai.knowledgeBase.manage', 'ai.knowledgeBase.suggest']),
    
    // Students
    canCreateStudents: () => can('students.create'),
    canEditAllStudents: () => can('students.edit.all'),
    canEditAssignedStudents: () => canAny(['students.edit.all', 'students.edit.assigned']),
    canArchiveStudents: () => can('students.archive'),
    canLogStudentNotes: () => can('students.logNotes'),
    
    // Groups
    canManageAllGroups: () => can('groups.manage.all'),
    canManageAssignedGroups: () => canAny(['groups.manage.all', 'groups.manage.assigned']),
    
    // Courses
    canManageOrgCourses: () => can('courses.manage.org'),
    canManageOwnCourses: () => canAny(['courses.manage.org', 'courses.manage.own']),
    canDeleteCourses: () => can('courses.delete'),
    canAssignCourses: () => can('courses.assign'),
    canUseCourseBuilder: () => can('courses.builder'),
    
    // IEP
    canAccessIEP: () => can('iep.access'),
    canCreateIEP: () => can('iep.create'),
    canFinalizeIEP: () => can('iep.finalize'),
    canSendIEPInvites: () => can('iep.sendInvites'),
    canLogIEPNotes: () => can('iep.logNotes'),
    
    // AI Tools
    canUseStudentAITools: () => can('ai.tools.student.use'),
    canUseTeacherAITools: () => can('ai.tools.teacher.use'),
    canUseFullTeacherAITools: () => can('ai.tools.teacher.full'),
    canConfigureAITools: () => can('ai.tools.configure'),
    
    // Website
    canManageFullWebsite: () => can('website.manage.full'),
    canManageOwnWebsitePage: () => canAny(['website.manage.full', 'website.manage.own']),
    
    // Goals & Notes
    canViewOrgGoals: () => can('goals.org.view'),
    canManageOrgGoals: () => can('goals.org.manage'),
    canEditSelfGoals: () => can('goals.self.edit'),
    
    // Settings
    canViewOrgSettings: () => can('settings.org.view'),
    canEditOrgSettings: () => can('settings.org.edit'),
    canViewStudentSettings: () => can('settings.student.view'),
  };
}

/**
 * Type for the return value of useOrgCan
 */
export type OrgCanResult = ReturnType<typeof useOrgCan>;
