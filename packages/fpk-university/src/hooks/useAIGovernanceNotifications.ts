import { supabase } from '@/integrations/supabase/client';

interface OrgMemberWithRole {
  user_id: string;
  role: string;
}

/**
 * Notify all educators (owners, admins, instructors) in an organization about a new AI request
 */
export async function notifyEducatorsOfNewAIRequest(
  orgId: string,
  studentId: string,
  studentName: string,
  task: string,
  category: string,
  priority: string
) {
  try {
    // Get all educators in the organization - cast to avoid deep type instantiation
    const client = supabase as any;
    const result = await client
      .from('org_members')
      .select('user_id, role')
      .eq('organization_id', orgId);

    if (result.error) {
      console.error('Error fetching educators:', result.error);
      return;
    }

    const allMembers = result.data as OrgMemberWithRole[];
    const educators = allMembers.filter(m => 
      ['owner', 'admin', 'instructor'].includes(m.role)
    );

    if (educators.length === 0) {
      console.log('No educators found to notify');
      return;
    }

    // Send notification to each educator
    const notificationPromises = educators.map(educator =>
      supabase.functions.invoke('notification-system', {
        body: {
          type: 'ai_request_submitted',
          userId: educator.user_id,
          data: {
            studentId,
            studentName,
            task,
            category,
            priority,
            orgId
          }
        }
      })
    );

    await Promise.all(notificationPromises);
    console.log(`Notified ${educators.length} educators about new AI request`);
  } catch (error) {
    console.error('Error notifying educators:', error);
  }
}

/**
 * Notify a student about their AI request approval/rejection
 */
export async function notifyStudentOfApprovalResult(
  studentId: string,
  task: string,
  status: 'approved' | 'rejected',
  approverName?: string,
  orgId?: string
) {
  try {
    const notificationType = status === 'approved' ? 'ai_request_approved' : 'ai_request_rejected';

    await supabase.functions.invoke('notification-system', {
      body: {
        type: notificationType,
        userId: studentId,
        data: {
          task,
          status,
          approverName,
          orgId
        }
      }
    });

    console.log(`Notified student ${studentId} of ${status} request`);
  } catch (error) {
    console.error('Error notifying student:', error);
  }
}
