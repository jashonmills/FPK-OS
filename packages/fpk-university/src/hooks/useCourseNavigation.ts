import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { getActiveOrgId, isInOrgMode } from '@/lib/org/context';

/**
 * Hook for org-aware navigation within courses
 * Automatically preserves the ?org=... parameter when navigating between lessons
 */
export function useCourseNavigation(courseSlug: string) {
  const navigate = useNavigate();

  const navigateToLesson = useCallback((lessonId: string | number) => {
    const currentOrgId = getActiveOrgId();
    const currentInOrgMode = isInOrgMode();
    
    const basePath = `/courses/${courseSlug}/${lessonId}`;
    
    if (currentInOrgMode && currentOrgId) {
      console.log('📍 [Org Context] Navigating to lesson:', `${basePath}?org=${currentOrgId}`);
      navigate(`${basePath}?org=${currentOrgId}`);
    } else {
      console.log('📍 [Personal Context] Navigating to lesson:', basePath);
      navigate(basePath);
    }
  }, [navigate, courseSlug]);

  const navigateToOverview = useCallback(() => {
    const currentOrgId = getActiveOrgId();
    const currentInOrgMode = isInOrgMode();
    
    const basePath = `/courses/${courseSlug}`;
    
    if (currentInOrgMode && currentOrgId) {
      console.log('📍 [Org Context] Navigating to overview:', `${basePath}?org=${currentOrgId}`);
      navigate(`${basePath}?org=${currentOrgId}`);
    } else {
      console.log('📍 [Personal Context] Navigating to overview:', basePath);
      navigate(basePath);
    }
  }, [navigate, courseSlug]);

  return { navigateToLesson, navigateToOverview };
}
