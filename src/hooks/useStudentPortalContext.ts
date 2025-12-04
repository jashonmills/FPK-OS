import { useAuth } from './useAuth';

export function useStudentPortalContext() {
  const { user } = useAuth();
  
  const isStudentPortalUser = user?.user_metadata?.is_student_portal === true;
  const studentOrgSlug = user?.user_metadata?.student_org_slug;
  const studentId = user?.user_metadata?.student_id;
  const orgId = user?.user_metadata?.org_id;
  
  return {
    isStudentPortalUser,
    studentOrgSlug,
    studentId,
    orgId
  };
}
