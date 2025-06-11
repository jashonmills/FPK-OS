
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  display_name: string;
  created_at: string;
  roles: string[];
}

export type UserRole = 'admin' | 'instructor' | 'learner';

export function isValidRole(role: string): role is UserRole {
  return role === 'admin' || role === 'instructor' || role === 'learner';
}

export const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case 'admin': return 'destructive' as const;
    case 'instructor': return 'default' as const;
    case 'learner': return 'secondary' as const;
    default: return 'outline' as const;
  }
};
