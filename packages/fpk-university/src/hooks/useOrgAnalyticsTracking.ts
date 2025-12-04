import { useCallback } from 'react';
import { ga4 } from '@/utils/ga4Setup';
import { useAuth } from '@/hooks/useAuth';

export const useOrgAnalyticsTracking = () => {
  const { user } = useAuth();

  const trackOrgDashboardViewed = useCallback((orgId: string, viewType: string) => {
    ga4.trackCustomEvent('org_dashboard_viewed', {
      user_id: user?.id,
      org_id: orgId,
      view_type: viewType,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackStudentInvited = useCallback((orgId: string, inviteMethod: string) => {
    ga4.trackCustomEvent('student_invited', {
      user_id: user?.id,
      org_id: orgId,
      invite_method: inviteMethod,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackCourseAssigned = useCallback((orgId: string, courseId: string, assignmentType: 'individual' | 'group') => {
    ga4.trackCustomEvent('course_assigned', {
      user_id: user?.id,
      org_id: orgId,
      course_id: courseId,
      assignment_type: assignmentType,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackGroupCreated = useCallback((orgId: string, groupSize: number) => {
    ga4.trackCustomEvent('group_created', {
      user_id: user?.id,
      org_id: orgId,
      group_size: groupSize,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackOrgSettingsChanged = useCallback((orgId: string, settingType: string) => {
    ga4.trackCustomEvent('org_settings_changed', {
      user_id: user?.id,
      org_id: orgId,
      setting_type: settingType,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackWebsiteCustomized = useCallback((orgId: string, customizationType: string) => {
    ga4.trackCustomEvent('website_customized', {
      user_id: user?.id,
      org_id: orgId,
      customization_type: customizationType,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackStudentProgressViewed = useCallback((orgId: string, studentId: string) => {
    ga4.trackCustomEvent('student_progress_viewed', {
      user_id: user?.id,
      org_id: orgId,
      student_id: studentId,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackBulkActionPerformed = useCallback((orgId: string, actionType: string, affectedCount: number) => {
    ga4.trackCustomEvent('bulk_action_performed', {
      user_id: user?.id,
      org_id: orgId,
      action_type: actionType,
      affected_count: affectedCount,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  return {
    trackOrgDashboardViewed,
    trackStudentInvited,
    trackCourseAssigned,
    trackGroupCreated,
    trackOrgSettingsChanged,
    trackWebsiteCustomized,
    trackStudentProgressViewed,
    trackBulkActionPerformed
  };
};
