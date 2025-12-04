import { supabase } from '@/integrations/supabase/client';

export const triggerCourseAssignmentNotification = async (
  studentIds: string[],
  courseId: string,
  courseTitle: string,
  orgId: string
) => {
  console.log('[Notifications] Sending course assignment notifications to', studentIds.length, 'students');
  
  const notifications = studentIds.map(studentId => ({
    user_id: studentId,
    type: 'course_assigned',
    title: '📚 New Course Assigned',
    message: `You've been assigned to "${courseTitle}". Start learning now!`,
    action_url: `/courses/player/${courseId}`,
    read_status: false,
    metadata: { courseId, courseTitle, orgId }
  }));

  const { error } = await supabase
    .from('notifications')
    .insert(notifications);

  if (error) {
    console.error('[Notifications] Error sending course assignment notifications:', error);
  } else {
    console.log('[Notifications] Course assignment notifications sent successfully');
  }
};

export const triggerGroupAssignmentNotification = async (
  studentIds: string[],
  groupId: string,
  groupName: string,
  orgId: string
) => {
  console.log('[Notifications] Sending group assignment notifications to', studentIds.length, 'students');
  
  const notifications = studentIds.map(studentId => ({
    user_id: studentId,
    type: 'group_assigned',
    title: '👥 Added to Group',
    message: `You've been added to the group "${groupName}".`,
    action_url: `/org/groups/${groupId}`,
    read_status: false,
    metadata: { groupId, groupName, orgId }
  }));

  const { error } = await supabase
    .from('notifications')
    .insert(notifications);

  if (error) {
    console.error('[Notifications] Error sending group assignment notifications:', error);
  } else {
    console.log('[Notifications] Group assignment notifications sent successfully');
  }
};

export const notifyInstructorsOfCourseStart = async (
  orgId: string,
  studentId: string,
  studentName: string,
  courseId: string,
  courseTitle: string
) => {
  console.log('[Notifications] Notifying instructors of course start:', courseTitle, 'by', studentName);
  
  // Get all instructors, admins, and owners for the org
  const { data: members } = await supabase
    .from('org_members')
    .select('user_id')
    .eq('org_id', orgId)
    .in('role', ['owner', 'admin', 'instructor']);

  if (members && members.length > 0) {
    const notifications = members.map(member => ({
      user_id: member.user_id,
      type: 'student_course_started',
      title: '🎓 Student Started Course',
      message: `${studentName} has started "${courseTitle}".`,
      action_url: `/org/students/${studentId}`,
      read_status: false,
      metadata: { studentId, studentName, courseId, courseTitle, orgId }
    }));

    const { error } = await supabase
      .from('notifications')
      .insert(notifications);

    if (error) {
      console.error('[Notifications] Error notifying instructors of course start:', error);
    } else {
      console.log('[Notifications] Instructors notified of course start');
    }
  }
};

export const notifyInstructorsOfCourseCompletion = async (
  orgId: string,
  studentId: string,
  studentName: string,
  courseId: string,
  courseTitle: string
) => {
  console.log('[Notifications] Notifying instructors of course completion:', courseTitle, 'by', studentName);
  
  const { data: members } = await supabase
    .from('org_members')
    .select('user_id')
    .eq('org_id', orgId)
    .in('role', ['owner', 'admin', 'instructor']);

  if (members && members.length > 0) {
    const notifications = members.map(member => ({
      user_id: member.user_id,
      type: 'student_course_completed',
      title: '🏆 Student Completed Course',
      message: `${studentName} has completed "${courseTitle}"! 🎉`,
      action_url: `/org/students/${studentId}`,
      read_status: false,
      metadata: { studentId, studentName, courseId, courseTitle, orgId }
    }));

    const { error } = await supabase
      .from('notifications')
      .insert(notifications);

    if (error) {
      console.error('[Notifications] Error notifying instructors of course completion:', error);
    } else {
      console.log('[Notifications] Instructors notified of course completion');
    }
  }
};

export const notifyInstructorsOfLessonCompletion = async (
  orgId: string,
  studentId: string,
  studentName: string,
  courseId: string,
  courseTitle: string,
  lessonId: string,
  lessonTitle: string
) => {
  console.log('[Notifications] Notifying instructors of lesson completion:', lessonTitle, 'by', studentName);
  
  const { data: members } = await supabase
    .from('org_members')
    .select('user_id')
    .eq('org_id', orgId)
    .in('role', ['owner', 'admin', 'instructor']);

  if (members && members.length > 0) {
    const notifications = members.map(member => ({
      user_id: member.user_id,
      type: 'student_lesson_completed',
      title: '✅ Lesson Completed',
      message: `${studentName} completed "${lessonTitle}" in ${courseTitle}.`,
      action_url: `/org/students/${studentId}`,
      read_status: false,
      metadata: { studentId, studentName, courseId, courseTitle, lessonId, lessonTitle, orgId }
    }));

    const { error } = await supabase
      .from('notifications')
      .insert(notifications);

    if (error) {
      console.error('[Notifications] Error notifying instructors of lesson completion:', error);
    } else {
      console.log('[Notifications] Instructors notified of lesson completion');
    }
  }
};

export const notifyInstructorsOfGoalCreation = async (
  orgId: string,
  studentId: string,
  studentName: string,
  goalId: string,
  goalTitle: string
) => {
  console.log('[Notifications] Notifying instructors of goal creation:', goalTitle, 'by', studentName);
  
  const { data: members } = await supabase
    .from('org_members')
    .select('user_id')
    .eq('org_id', orgId)
    .in('role', ['owner', 'admin', 'instructor']);

  if (members && members.length > 0) {
    const notifications = members.map(member => ({
      user_id: member.user_id,
      type: 'student_goal_created',
      title: '🎯 New Goal Created',
      message: `${studentName} created a new goal: "${goalTitle}".`,
      action_url: `/org/students/${studentId}`,
      read_status: false,
      metadata: { studentId, studentName, goalId, goalTitle, orgId }
    }));

    const { error } = await supabase
      .from('notifications')
      .insert(notifications);

    if (error) {
      console.error('[Notifications] Error notifying instructors of goal creation:', error);
    } else {
      console.log('[Notifications] Instructors notified of goal creation');
    }
  }
};

export const notifyInstructorsOfGoalCompletion = async (
  orgId: string,
  studentId: string,
  studentName: string,
  goalId: string,
  goalTitle: string
) => {
  console.log('[Notifications] Notifying instructors of goal completion:', goalTitle, 'by', studentName);
  
  const { data: members } = await supabase
    .from('org_members')
    .select('user_id')
    .eq('org_id', orgId)
    .in('role', ['owner', 'admin', 'instructor']);

  if (members && members.length > 0) {
    const notifications = members.map(member => ({
      user_id: member.user_id,
      type: 'student_goal_completed',
      title: '🎉 Goal Completed',
      message: `${studentName} completed their goal: "${goalTitle}"!`,
      action_url: `/org/students/${studentId}`,
      read_status: false,
      metadata: { studentId, studentName, goalId, goalTitle, orgId }
    }));

    const { error } = await supabase
      .from('notifications')
      .insert(notifications);

    if (error) {
      console.error('[Notifications] Error notifying instructors of goal completion:', error);
    } else {
      console.log('[Notifications] Instructors notified of goal completion');
    }
  }
};

export const triggerNoteSharedNotification = async (
  recipientId: string,
  noteId: string,
  noteTitle: string,
  sharedByName: string
) => {
  console.log('[Notifications] Sending note shared notification to', recipientId);
  
  const { error } = await supabase
    .from('notifications')
    .insert({
      user_id: recipientId,
      type: 'note_shared',
      title: '📝 Note Shared With You',
      message: `${sharedByName} shared a note: "${noteTitle}".`,
      action_url: `/org/notes/${noteId}`,
      read_status: false,
      metadata: { noteId, noteTitle, sharedByName }
    });

  if (error) {
    console.error('[Notifications] Error sending note shared notification:', error);
  } else {
    console.log('[Notifications] Note shared notification sent successfully');
  }
};

// ============= MESSAGING NOTIFICATIONS =============

export const triggerNewMessageNotification = async (
  recipientIds: string[],
  orgId: string,
  conversationId: string,
  senderName: string,
  preview: string,
  conversationName?: string
) => {
  if (recipientIds.length === 0) return;
  
  console.log('[Notifications] Sending new message notifications to', recipientIds.length, 'recipients');
  
  const notifications = recipientIds.map(recipientId => ({
    user_id: recipientId,
    type: 'new_message',
    title: '💬 New Message',
    message: `${senderName}: "${preview.substring(0, 50)}${preview.length > 50 ? '...' : ''}"`,
    action_url: `/org/${orgId}/messages/${conversationId}`,
    read_status: false,
    metadata: { orgId, conversationId, senderName, preview, conversationName }
  }));

  const { error } = await supabase
    .from('notifications')
    .insert(notifications);

  if (error) {
    console.error('[Notifications] Error sending new message notifications:', error);
  } else {
    console.log('[Notifications] New message notifications sent successfully');
  }
};

export const triggerMentionNotification = async (
  mentionedUserId: string,
  orgId: string,
  conversationId: string,
  senderName: string,
  conversationName?: string
) => {
  console.log('[Notifications] Sending mention notification to', mentionedUserId);
  
  const { error } = await supabase
    .from('notifications')
    .insert({
      user_id: mentionedUserId,
      type: 'message_mention',
      title: '🔔 You were mentioned',
      message: `${senderName} mentioned you${conversationName ? ` in ${conversationName}` : ''}`,
      action_url: `/org/${orgId}/messages/${conversationId}`,
      read_status: false,
      metadata: { orgId, conversationId, senderName, conversationName }
    });

  if (error) {
    console.error('[Notifications] Error sending mention notification:', error);
  } else {
    console.log('[Notifications] Mention notification sent successfully');
  }
};
