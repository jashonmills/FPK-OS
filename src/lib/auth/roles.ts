export type AppRole = 'admin' | 'instructor' | 'learner';

export function getRoleFromUser(user?: { user_metadata?: any }): AppRole {
  const r = user?.user_metadata?.role;
  if (r === 'admin' || r === 'instructor' || r === 'learner') return r;
  return 'learner';
}

export function isAdmin(user?: { user_metadata?: any }): boolean {
  return getRoleFromUser(user) === 'admin';
}

export function isInstructor(user?: { user_metadata?: any }): boolean {
  return getRoleFromUser(user) === 'instructor';
}

export function hasRole(user: { user_metadata?: any } | undefined, role: AppRole): boolean {
  return getRoleFromUser(user) === role;
}