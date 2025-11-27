
export interface User {
  id: string;
  email: string;
  full_name: string;
  display_name: string;
  created_at: string;
  roles: Role[];
}

export type Role = 'admin' | 'instructor' | 'learner' | 'ai_coach_user';

export const AVAILABLE_ROLES: Role[] = ['admin', 'instructor', 'learner', 'ai_coach_user'];

export const getRoleBadgeVariant = (role: Role) => {
  switch (role) {
    case 'admin': return 'destructive' as const;
    case 'instructor': return 'default' as const;
    case 'learner': return 'secondary' as const;
    case 'ai_coach_user': return 'outline' as const;
  }
};
