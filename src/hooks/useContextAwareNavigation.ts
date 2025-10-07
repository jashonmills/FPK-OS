import { useNavigate } from 'react-router-dom';
import { getActiveOrgId, isInOrgMode } from '@/lib/org/context';
import { useCallback } from 'react';
import { isLegacyCourse, getLegacyCourseRoute } from '@/utils/legacyCourseRoutes';

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

  const goToCourse = useCallback((courseId: string, slug?: string | null) => {
    // Check if this is a legacy course that has its own dedicated route
    if (slug && isLegacyCourse(slug)) {
      const legacyRoute = getLegacyCourseRoute(slug);
      if (inOrgMode && orgId) {
        console.log('📍 [Org Context] Navigating to legacy course:', `${legacyRoute}?org=${orgId}`);
        navigate(`${legacyRoute}?org=${orgId}`);
      } else {
        console.log('📍 [Personal Context] Navigating to legacy course:', legacyRoute);
        navigate(legacyRoute);
      }
    } else {
      // Use UUID-based routing for native courses
      if (inOrgMode && orgId) {
        console.log('📍 [Org Context] Navigating to course with org context:', `/courses/${courseId}?org=${orgId}`);
        navigate(`/courses/${courseId}?org=${orgId}`);
      } else {
        console.log('📍 [Personal Context] Navigating to course');
        navigate(`/courses/${courseId}`);
      }
    }
  }, [navigate, orgId, inOrgMode]);

  const goToCoursePreview = useCallback((courseId: string) => {
    if (inOrgMode && orgId) {
      console.log('📍 [Org Context] Navigating to course preview with org context:', `/preview/${courseId}?org=${orgId}`);
      navigate(`/preview/${courseId}?org=${orgId}`);
    } else {
      console.log('📍 [Personal Context] Navigating to course preview');
      navigate(`/preview/${courseId}`);
    }
  }, [navigate, orgId, inOrgMode]);

  return { goToCourses, goToDashboard, goToCourse, goToCoursePreview, inOrgMode, orgId };
}
