import { useNavigate } from 'react-router-dom';
import { getActiveOrgId, isInOrgMode } from '@/lib/org/context';
import { useCallback } from 'react';
import { isLegacyCourse, getLegacyCourseRoute, getSlugByUUID } from '@/utils/legacyCourseRoutes';
import { isV2SequentialCourse } from '@/utils/v2SequentialCourses';

export function useContextAwareNavigation() {
  const navigate = useNavigate();
  const orgId = getActiveOrgId();
  const inOrgMode = isInOrgMode();

  const goToCourses = useCallback(() => {
    // Read org context fresh each time to handle dynamic URL changes
    const currentOrgId = getActiveOrgId();
    const currentInOrgMode = isInOrgMode();
    
    console.log('🔍 useContextAwareNavigation.goToCourses DEBUG:', {
      currentURL: window.location.href,
      searchParams: window.location.search,
      currentOrgId,
      currentInOrgMode,
      willNavigateTo: currentInOrgMode && currentOrgId ? `/org/${currentOrgId}/courses` : '/dashboard/learner/courses'
    });
    
    if (currentInOrgMode && currentOrgId) {
      console.log('📍 [Org Context] Navigating to org courses:', `/org/${currentOrgId}/courses`);
      navigate(`/org/${currentOrgId}/courses`);
    } else {
      console.log('📍 [Personal Context] Navigating to personal courses');
      navigate('/dashboard/learner/courses');
    }
  }, [navigate]);

  const goToDashboard = useCallback(() => {
    // Read org context fresh each time to handle dynamic URL changes
    const currentOrgId = getActiveOrgId();
    const currentInOrgMode = isInOrgMode();
    
    if (currentInOrgMode && currentOrgId) {
      console.log('📍 [Org Context] Navigating to org dashboard:', `/org/${currentOrgId}`);
      navigate(`/org/${currentOrgId}`);
    } else {
      console.log('📍 [Personal Context] Navigating to personal dashboard');
      navigate('/dashboard/learner');
    }
  }, [navigate]);

  const goToCourse = useCallback((courseId: string, slug?: string | null) => {
    // Read org context fresh each time to handle dynamic URL changes
    const currentOrgId = getActiveOrgId();
    const currentInOrgMode = isInOrgMode();
    
    // Try to get slug from UUID mapping if not provided
    const effectiveSlug = slug || getSlugByUUID(courseId);
    
    // CRITICAL: Check if course is V2 sequential FIRST
    // All V2 sequential courses MUST use the UniversalCoursePlayer
    if (effectiveSlug && isV2SequentialCourse(effectiveSlug)) {
      const route = `/courses/player/${effectiveSlug}`;
      if (currentInOrgMode && currentOrgId) {
        console.log('📍 [Org Context] V2 Sequential Course:', `${route}?org=${currentOrgId}`);
        navigate(`${route}?org=${currentOrgId}`);
      } else {
        console.log('📍 [Personal Context] V2 Sequential Course:', route);
        navigate(route);
      }
    } else if (effectiveSlug && isLegacyCourse(effectiveSlug)) {
      // Legacy courses still use old routes
      const legacyRoute = getLegacyCourseRoute(effectiveSlug);
      if (currentInOrgMode && currentOrgId) {
        console.log('📍 [Org Context] Navigating to legacy course:', `${legacyRoute}?org=${currentOrgId}`);
        navigate(`${legacyRoute}?org=${currentOrgId}`);
      } else {
        console.log('📍 [Personal Context] Navigating to legacy course:', legacyRoute);
        navigate(legacyRoute);
      }
    } else {
      // Fallback to UUID-based routing
      if (currentInOrgMode && currentOrgId) {
        console.log('📍 [Org Context] Navigating to course with org context:', `/courses/${courseId}?org=${currentOrgId}`);
        navigate(`/courses/${courseId}?org=${currentOrgId}`);
      } else {
        console.log('📍 [Personal Context] Navigating to course');
        navigate(`/courses/${courseId}`);
      }
    }
  }, [navigate]);

  const goToCoursePreview = useCallback((courseId: string) => {
    // Read org context fresh each time to handle dynamic URL changes
    const currentOrgId = getActiveOrgId();
    const currentInOrgMode = isInOrgMode();
    
    if (currentInOrgMode && currentOrgId) {
      console.log('📍 [Org Context] Navigating to course preview with org context:', `/preview/${courseId}?org=${currentOrgId}`);
      navigate(`/preview/${courseId}?org=${currentOrgId}`);
    } else {
      console.log('📍 [Personal Context] Navigating to course preview');
      navigate(`/preview/${courseId}`);
    }
  }, [navigate]);

  return { goToCourses, goToDashboard, goToCourse, goToCoursePreview, inOrgMode, orgId };
}
