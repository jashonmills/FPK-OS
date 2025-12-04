/** Account status enum */
export type AccountStatus = 'active' | 'suspended' | 'invited';

/** User role in the system */
export type UserRole = 'admin' | 'super_admin' | 'moderator' | 'user';

/** Role in family context */
export type FamilyRole = 'owner' | 'contributor' | 'viewer';

/** Core user profile data */
export interface IUserCoreProfile {
  userId: string;
  email: string;
  displayName: string | null;
  fullName: string | null;
  photoUrl: string | null;
  createdAt: Date;
  lastLogin: Date | null;
  accountStatus: AccountStatus;
  roles: UserRole[];
}

/** Family unit information */
export interface IFamilyInfo {
  familyId: string;
  familyName: string;
  roleInFamily: FamilyRole;
  isPrimaryAccountHolder: boolean;
  memberCount: number;
  studentCount: number;
}

/** Engagement metrics */
export interface IEngagementMetrics {
  documentsUploaded: number;
  logsCreated: number;
  aiCreditsUsed: number;
  aiInteractions: number;
  lastActivityDate: Date | null;
  hoursOnPlatform: number;
}

/** Comprehensive user view for admin UI */
export interface IUserManagementView {
  // Core Profile
  userId: string;
  email: string;
  displayName: string | null;
  fullName: string | null;
  photoUrl: string | null;
  createdAt: string; // ISO string
  lastLogin: string | null; // ISO string
  accountStatus: AccountStatus;
  roles: UserRole[];
  
  // Family & Relationships
  families: IFamilyInfo[]; // User can be in multiple families
  
  // Activity & Engagement
  engagementMetrics: IEngagementMetrics;
  
  // Audit trail
  lastModifiedBy?: string;
  lastModifiedAt?: string;
}

/** Filter options for user search */
export interface IUserFilters {
  status?: AccountStatus[];
  roles?: UserRole[];
  dateCreatedAfter?: Date;
  dateCreatedBefore?: Date;
  familyId?: string;
  hasFamily?: boolean;
}

/** Sort options */
export interface IUserSort {
  field: 'displayName' | 'email' | 'createdAt' | 'lastLogin' | 'accountStatus';
  direction: 'asc' | 'desc';
}

/** Audit log entry */
export interface IAuditLogEntry {
  id: string;
  adminUserId: string;
  adminUserName: string;
  targetUserId: string | null;
  targetUserName: string | null;
  actionType: string;
  actionDetails: Record<string, any>;
  ipAddress: string | null;
  createdAt: string;
}
