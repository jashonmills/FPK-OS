// Organization Data Fetcher for RAG
// This module handles secure retrieval of organization data for the Org Assistant mode

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

/**
 * Fetch relevant organization data based on the admin's question
 * This implements RAG (Retrieval-Augmented Generation) for org data
 */
export async function fetchOrgData(userId: string, orgId: string | undefined, question: string) {
  if (!orgId) {
    return {
      error: 'No organization context provided',
      guidance: 'Please ensure you are accessing this from within an organization.'
    };
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Verify user has admin permissions
    const { data: membership, error: membershipError } = await supabase
      .from('org_members')
      .select('role, status')
      .eq('org_id', orgId)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (membershipError || !membership || !['owner', 'instructor'].includes(membership.role)) {
      return {
        error: 'Access denied',
        guidance: 'You must be an organization owner or instructor to access this data.'
      };
    }

    // Determine what data to fetch based on the question
    const questionLower = question.toLowerCase();
    const fetchedData: any = {
      orgId,
      timestamp: new Date().toISOString(),
      dataTypes: []
    };

    // Fetch organization info
    const { data: orgInfo } = await supabase
      .from('organizations')
      .select('name, slug, plan, seat_cap, seats_used, instructor_limit, instructors_used')
      .eq('id', orgId)
      .single();

    if (orgInfo) {
      fetchedData.organization = orgInfo;
      fetchedData.dataTypes.push('organization_info');
    }

    // Check for student/member related queries
    if (questionLower.includes('student') || questionLower.includes('member') || 
        questionLower.includes('user') || questionLower.includes('learner')) {
      // Fetch org_members (students with accounts)
      const { data: members } = await supabase
        .from('org_members')
        .select(`
          id,
          user_id,
          role,
          status,
          joined_at
        `)
        .eq('org_id', orgId)
        .order('joined_at', { ascending: false })
        .limit(100);

      // Fetch org_students (profile-only students)
      const { data: profileStudents } = await supabase
        .from('org_students')
        .select(`
          id,
          student_name,
          date_of_birth,
          grade_level,
          email,
          phone,
          created_at
        `)
        .eq('org_id', orgId)
        .limit(100);

      // Fetch enrollments and progress for students
      if (members && members.length > 0) {
        const memberIds = members.map(m => m.user_id);
        const { data: enrollments } = await supabase
          .from('interactive_course_enrollments')
          .select('user_id, course_id, course_title, completion_percentage, last_accessed_at')
          .in('user_id', memberIds);

        fetchedData.studentEnrollments = enrollments || [];
      }

      if (members || profileStudents) {
        fetchedData.members = members || [];
        fetchedData.profileOnlyStudents = profileStudents || [];
        fetchedData.dataTypes.push('students');
        fetchedData.totalStudentCount = (members?.length || 0) + (profileStudents?.length || 0);
        fetchedData.activeStudents = members?.filter(m => m.status === 'active' && m.role === 'student').length || 0;
      }
    }

    // Check for course/progress related queries
    if (questionLower.includes('course') || questionLower.includes('progress') || 
        questionLower.includes('completion') || questionLower.includes('learning')) {
      const { data: courseProgress } = await supabase
        .from('course_progress')
        .select(`
          user_id,
          course_id,
          percent,
          updated_at,
          profiles:user_id (
            display_name
          )
        `)
        .eq('org_id', orgId)
        .order('updated_at', { ascending: false })
        .limit(100);

      if (courseProgress) {
        fetchedData.courseProgress = courseProgress;
        fetchedData.dataTypes.push('course_progress');
      }
    }

    // Check for invite/invitation queries
    if (questionLower.includes('invite') || questionLower.includes('invitation') || 
        questionLower.includes('join') || questionLower.includes('add')) {
      fetchedData.inviteGuidance = {
        steps: [
          '1. Navigate to your organization settings',
          '2. Go to the "Members" or "Team" section',
          '3. Click "Invite Members" or "Generate Invite Link"',
          '4. Choose the role (student or instructor)',
          '5. Share the invite code or link with your new members'
        ],
        inviteUrl: `/org/${orgId}/settings/members`
      };
      fetchedData.dataTypes.push('invite_guidance');
    }

    // Check for assignment/course assignment queries
    if (questionLower.includes('assign') && questionLower.includes('course')) {
      fetchedData.assignmentGuidance = {
        steps: [
          '1. Go to the "Courses" section in your organization',
          '2. Find the course you want to assign',
          '3. Click on "Assign to Students" or "Manage Assignments"',
          '4. Select the students or cohorts you want to assign the course to',
          '5. Set any due dates or access restrictions if needed',
          '6. Click "Assign" to complete the assignment'
        ],
        note: 'Students will be notified of new course assignments and can access them from their dashboard.'
      };
      fetchedData.dataTypes.push('assignment_guidance');
    }

    // Check for analytics/dashboard queries
    if (questionLower.includes('analytic') || questionLower.includes('report') || 
        questionLower.includes('performance') || questionLower.includes('metric') ||
        questionLower.includes('dashboard') || questionLower.includes('overview')) {
      const { data: analytics } = await supabase
        .from('analytics_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);

      // Get activity log for recent activity
      const { data: recentActivity } = await supabase
        .from('activity_log')
        .select('event, created_at, user_id, metadata')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (analytics || recentActivity) {
        fetchedData.analytics = analytics || [];
        fetchedData.recentActivity = recentActivity || [];
        fetchedData.dataTypes.push('analytics');
      }
    }

    // Check for group queries
    if (questionLower.includes('group') || questionLower.includes('cohort')) {
      const { data: groups } = await supabase
        .from('org_groups')
        .select(`
          id,
          name,
          created_at
        `)
        .eq('org_id', orgId);

      // Get group membership counts
      if (groups && groups.length > 0) {
        const groupIds = groups.map(g => g.id);
        const { data: memberships } = await supabase
          .from('org_group_members')
          .select('group_id, user_id')
          .in('group_id', groupIds);

        const groupMemberCounts = memberships?.reduce((acc: any, m: any) => {
          acc[m.group_id] = (acc[m.group_id] || 0) + 1;
          return acc;
        }, {});

        fetchedData.groups = groups.map(g => ({
          ...g,
          memberCount: groupMemberCounts?.[g.id] || 0
        }));
        fetchedData.dataTypes.push('groups');
      }
    }

    // Check for goal queries
    if (questionLower.includes('goal') || questionLower.includes('objective') ||
        questionLower.includes('target')) {
      const { data: goals } = await supabase
        .from('org_goals')
        .select(`
          id,
          title,
          description,
          status,
          progress_percentage,
          target_date,
          created_at,
          student_id
        `)
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (goals) {
        fetchedData.goals = goals;
        fetchedData.dataTypes.push('goals');
        fetchedData.activeGoalsCount = goals.filter(g => g.status === 'active').length;
        fetchedData.completedGoalsCount = goals.filter(g => g.status === 'completed').length;
      }
    }

    // Check for note queries
    if (questionLower.includes('note') || questionLower.includes('annotation')) {
      const { data: notes } = await supabase
        .from('org_notes')
        .select(`
          id,
          title,
          content,
          category,
          visibility_scope,
          created_at,
          created_by
        `)
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (notes) {
        fetchedData.notes = notes;
        fetchedData.dataTypes.push('notes');
        fetchedData.notesCount = notes.length;
      }
    }

    // Check for IEP queries  
    if (questionLower.includes('iep') || questionLower.includes('education plan') ||
        questionLower.includes('individualized')) {
      const { data: iepDocs } = await supabase
        .from('iep_documents')
        .select(`
          id,
          document_name,
          created_at,
          user_id
        `)
        .limit(50);

      if (iepDocs) {
        fetchedData.iepDocuments = iepDocs;
        fetchedData.dataTypes.push('iep');
        fetchedData.iepCount = iepDocs.length;
      }
    }

    // Check for course/curriculum queries
    if (questionLower.includes('course') || questionLower.includes('curriculum') ||
        questionLower.includes('lesson') || questionLower.includes('module')) {
      // Get course assignments
      const { data: courseAssignments } = await supabase
        .from('org_course_assignments')
        .select(`
          id,
          course_id,
          due_date,
          created_at,
          student_ids
        `)
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false })
        .limit(50);

      // Get available courses
      const { data: courses } = await supabase
        .from('courses')
        .select('id, title, description, level, duration_minutes')
        .eq('organization_id', orgId)
        .limit(100);

      if (courseAssignments || courses) {
        fetchedData.courseAssignments = courseAssignments || [];
        fetchedData.availableCourses = courses || [];
        fetchedData.dataTypes.push('courses');
      }
    }

    // Check for settings queries
    if (questionLower.includes('setting') || questionLower.includes('config') ||
        questionLower.includes('preference') || questionLower.includes('feature')) {
      const { data: branding } = await supabase
        .from('org_branding')
        .select('*')
        .eq('org_id', orgId)
        .single();

      fetchedData.settings = {
        branding: branding,
        features: {
          aiAssistantEnabled: true,
          analyticsEnabled: true,
          iepManagementEnabled: true,
          groupManagementEnabled: true
        }
      };
      fetchedData.dataTypes.push('settings');
    }

    return fetchedData;

  } catch (error: any) {
    console.error('Error fetching org data:', error);
    return {
      error: 'Failed to fetch organization data',
      details: error.message
    };
  }
}
