export type OrgSubscriptionTier = 'basic' | 'standard' | 'premium' | 'beta';
export type NoteVisibilityScope = 'student-only' | 'instructor-visible' | 'org-public';
export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired';
export type MemberRole = 'owner' | 'instructor' | 'student';
export type MemberStatus = 'active' | 'paused' | 'blocked' | 'removed';

export interface Organization {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  plan: string; // This is subscription_tier in the database
  seat_cap: number; // This is seat_limit
  seats_used?: number;
  brand_primary?: string;
  brand_accent?: string;
  logo_url?: string;
  slug: string;
  is_suspended?: boolean;
  status: 'active' | 'suspended' | 'deleted';
  created_by: string;
  created_at: string;
  // Computed properties for backward compatibility
  subscription_tier?: string;
  seat_limit?: number;
}

export interface OrgMember {
  id: string;
  org_id: string;
  user_id: string;
  role: MemberRole;
  status: MemberStatus;
  invited_by?: string;
  joined_at?: string;
  access_revoked_at?: string;
  access_revoked_reason?: string;
  invitation_link?: string;
  created_at: string;
  // Join data
  profiles?: {
    full_name?: string;
    display_name?: string;
  };
}

export interface OrgInvitation {
  id: string;
  org_id: string;
  created_by: string;
  email?: string;
  code?: string;
  status: InvitationStatus;
  expires_at: string;
  max_uses?: number;
  uses_count?: number;
  role?: string;
  created_at: string;
  // Computed properties for backward compatibility
  invited_by?: string;
  invitation_code?: string;
  current_uses?: number;
  invitation_link?: string;
  is_active?: boolean;
  metadata?: Record<string, any>;
}

export interface OrgCourseAssignment {
  id: string;
  org_id: string;
  course_id: string;
  assigned_by: string;
  student_ids: string[];
  due_date?: string;
  instructions?: string;
  created_at: string;
}

export interface OrgGoal {
  id: string;
  org_id: string;
  created_by: string;
  student_id: string;
  title: string;
  description?: string;
  category?: string;
  folder_path: string;
  target_date?: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  progress_percentage: number;
  metadata: Record<string, any>;
  created_at: string;
  // Join data
  student_profile?: {
    full_name?: string;
    display_name?: string;
  };
}

export interface OrgNote {
  id: string;
  org_id: string;
  created_by: string;
  student_id: string;
  title: string;
  content: string;
  category?: string;
  folder_path: string;
  visibility_scope: NoteVisibilityScope;
  is_private: boolean;
  tags: string[];
  metadata: Record<string, any>;
  created_at: string;
  // Join data
  student_profile?: {
    full_name?: string;
    display_name?: string;
  };
}

export const SUBSCRIPTION_TIERS = {
  basic: {
    name: 'Basic',
    seats: 3,
    instructors: 1,
    price: 29,
    features: ['Up to 3 students', '1 instructor', 'Basic analytics', 'Goal tracking', 'Note management']
  },
  standard: {
    name: 'Standard',
    seats: 10,
    instructors: 3,
    price: 79,
    features: ['Up to 10 students', '3 instructors', 'Advanced analytics', 'Course assignments', 'Bulk operations']
  },
  premium: {
    name: 'Premium',
    seats: 25,
    instructors: 10,
    price: 149,
    features: ['Up to 25+ students', '10 instructors', 'Full analytics suite', 'Custom reporting', 'Priority support']
  },
  beta: {
    name: 'Beta (Free)',
    seats: 50,
    instructors: 20,
    price: 0,
    isBeta: true,
    features: ['Up to 50+ students (Beta)', '20 instructors (Beta)', 'Full analytics suite', 'Custom reporting', 'Priority support', 'Early access features', 'Free during beta period']
  }
} as const;