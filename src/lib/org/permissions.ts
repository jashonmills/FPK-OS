export type OrgRole = 'owner' | 'admin' | 'instructor' | 'instructor_aide' | 'viewer' | 'student';

export type Permission =
  // Org & Governance
  | 'org.billing'
  | 'org.dangerZone'
  | 'org.inviteUsers'
  | 'org.assignRoles'
  // AI Governance
  | 'ai.governance.manage'
  | 'ai.byok.manage'
  | 'ai.knowledgeBase.manage'
  | 'ai.knowledgeBase.suggest'
  // People & Groups
  | 'students.view.all'
  | 'students.view.assigned'
  | 'students.create'
  | 'students.edit.all'
  | 'students.edit.assigned'
  | 'students.archive'
  | 'students.logNotes'
  | 'groups.manage.all'
  | 'groups.manage.assigned'
  // Courses
  | 'courses.view.all'
  | 'courses.view.enrolled'
  | 'courses.manage.org'
  | 'courses.manage.own'
  | 'courses.delete'
  | 'courses.assign'
  | 'courses.builder'
  // IEP
  | 'iep.access'
  | 'iep.create'
  | 'iep.finalize'
  | 'iep.sendInvites'
  | 'iep.logNotes'
  // AI Tools
  | 'ai.tools.student.use'
  | 'ai.tools.teacher.use'
  | 'ai.tools.teacher.full'
  | 'ai.tools.configure'
  // Website
  | 'website.manage.full'
  | 'website.manage.own'
  // Goals & Notes
  | 'goals.org.view'
  | 'goals.org.manage'
  | 'goals.self.edit'
  // Settings
  | 'settings.org.view'
  | 'settings.org.edit'
  | 'settings.student.view';

const ROLE_PERMISSIONS: Record<OrgRole, Permission[]> = {
  owner: [
    // Org & Governance - Full access
    'org.billing',
    'org.dangerZone',
    'org.inviteUsers',
    'org.assignRoles',
    // AI Governance - Full access
    'ai.governance.manage',
    'ai.byok.manage',
    'ai.knowledgeBase.manage',
    // People & Groups - Full access
    'students.view.all',
    'students.create',
    'students.edit.all',
    'students.archive',
    'students.logNotes',
    'groups.manage.all',
    // Courses - Full access
    'courses.view.all',
    'courses.manage.org',
    'courses.manage.own',
    'courses.delete',
    'courses.assign',
    'courses.builder',
    // IEP - Full access
    'iep.access',
    'iep.create',
    'iep.finalize',
    'iep.sendInvites',
    'iep.logNotes',
    // AI Tools - Full access
    'ai.tools.student.use',
    'ai.tools.teacher.use',
    'ai.tools.teacher.full',
    'ai.tools.configure',
    // Website - Full access
    'website.manage.full',
    'website.manage.own',
    // Goals & Notes - Full access
    'goals.org.view',
    'goals.org.manage',
    // Settings - Full access
    'settings.org.view',
    'settings.org.edit',
  ],
  
  admin: [
    // Org & Governance - No billing or danger zone
    'org.inviteUsers',
    'org.assignRoles',
    // AI Governance - Full access
    'ai.governance.manage',
    'ai.byok.manage',
    'ai.knowledgeBase.manage',
    // People & Groups - Full access except archive
    'students.view.all',
    'students.create',
    'students.edit.all',
    'students.archive',
    'students.logNotes',
    'groups.manage.all',
    // Courses - Full access except delete
    'courses.view.all',
    'courses.manage.org',
    'courses.manage.own',
    'courses.delete',
    'courses.assign',
    'courses.builder',
    // IEP - Full access
    'iep.access',
    'iep.create',
    'iep.finalize',
    'iep.sendInvites',
    'iep.logNotes',
    // AI Tools - Full access except configure
    'ai.tools.student.use',
    'ai.tools.teacher.use',
    'ai.tools.teacher.full',
    'ai.tools.configure',
    // Website - Full access
    'website.manage.full',
    'website.manage.own',
    // Goals & Notes - Full access
    'goals.org.view',
    'goals.org.manage',
    // Settings - View and edit
    'settings.org.view',
    'settings.org.edit',
  ],
  
  instructor: [
    // Org & Governance - No access
    // AI Governance - Can only suggest KB content
    'ai.knowledgeBase.suggest',
    // People & Groups - Only assigned students/groups
    'students.view.assigned',
    'students.create',
    'students.edit.assigned',
    'students.logNotes',
    'groups.manage.assigned',
    // Courses - Own courses only
    'courses.view.all',
    'courses.manage.own',
    'courses.assign',
    'courses.builder',
    // IEP - Full access for their students
    'iep.access',
    'iep.create',
    'iep.finalize',
    'iep.sendInvites',
    'iep.logNotes',
    // AI Tools - Teacher tools
    'ai.tools.student.use',
    'ai.tools.teacher.use',
    'ai.tools.teacher.full',
    // Website - Own page only
    'website.manage.own',
    // Goals & Notes - View and manage for their students
    'goals.org.view',
    'goals.org.manage',
    // Settings - View only
    'settings.org.view',
  ],
  
  instructor_aide: [
    // Org & Governance - No access
    // AI Governance - No access
    // People & Groups - Read-only for assigned, log notes only
    'students.view.assigned',
    'students.logNotes',
    'groups.manage.assigned',
    // Courses - View and assign only
    'courses.view.all',
    'courses.assign',
    // IEP - Read + log notes
    'iep.access',
    'iep.logNotes',
    // AI Tools - Limited teacher tools
    'ai.tools.student.use',
    'ai.tools.teacher.use',
    // Website - No access
    // Goals & Notes - View only
    'goals.org.view',
    // Settings - View only
    'settings.org.view',
  ],
  
  viewer: [
    // Read-only access to dashboards and analytics
    'students.view.all', // anonymized stats only
    'courses.view.all',
    'goals.org.view',
    'settings.org.view',
  ],
  
  student: [
    // Own learning only
    'courses.view.enrolled',
    'ai.tools.student.use',
    'goals.self.edit',
    'settings.student.view',
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: OrgRole | undefined | null, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Check if a role has ANY of the specified permissions
 */
export function hasAnyPermission(role: OrgRole | undefined | null, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(role, p));
}

/**
 * Check if a role has ALL of the specified permissions
 */
export function hasAllPermissions(role: OrgRole | undefined | null, permissions: Permission[]): boolean {
  return permissions.every(p => hasPermission(role, p));
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: OrgRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Check if role is an educator (owner, admin, instructor, instructor_aide)
 */
export function isEducatorRole(role: OrgRole | undefined | null): boolean {
  if (!role) return false;
  return ['owner', 'admin', 'instructor', 'instructor_aide'].includes(role);
}

/**
 * Check if role is a leadership role (owner, admin)
 */
export function isLeadershipRole(role: OrgRole | undefined | null): boolean {
  if (!role) return false;
  return ['owner', 'admin'].includes(role);
}

/**
 * Check if role can view all students (not just assigned)
 */
export function canViewAllStudents(role: OrgRole | undefined | null): boolean {
  return hasPermission(role, 'students.view.all');
}

/**
 * Check if role is scoped to assigned students/groups only
 */
export function isScopedToAssigned(role: OrgRole | undefined | null): boolean {
  if (!role) return true;
  return ['instructor', 'instructor_aide'].includes(role);
}
