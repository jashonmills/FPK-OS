import { useNavigate } from 'react-router-dom';
import { getActiveOrgId, isInOrgMode } from '@/lib/org/context';
import { useCallback } from 'react';

export function useContextAwareNavigation() {
  const navigate = useNavigate();
  const orgId = getActiveOrgId();
  const inOrgMode = isInOrgMode();

  const goToCourses = useCallback(() => {
    if (inOrgMode && orgId) {
      console.log('📍 [Org Context] Navigating to org courses:', `/org/${orgId}/courses`);
      navigate(`/org/${orgId}/courses`);
    } else {
      console.log('📍 [Personal Context] Navigating to personal courses');
      navigate('/dashboard/learner/courses');
    }
  }, [navigate, orgId, inOrgMode]);

  const goToDashboard = useCallback(() => {
    if (inOrgMode && orgId) {
      console.log('📍 [Org Context] Navigating to org dashboard:', `/org/${orgId}`);
      navigate(`/org/${orgId}`);
    } else {
      console.log('📍 [Personal Context] Navigating to personal dashboard');
      navigate('/dashboard/learner');
    }
  }, [navigate, orgId, inOrgMode]);

  return { goToCourses, goToDashboard, inOrgMode, orgId };
}
