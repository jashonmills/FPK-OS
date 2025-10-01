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
      const { data: members } = await supabase
        .from('org_members')
        .select(`
          id,
          role,
          status,
          joined_at,
          profiles:user_id (
            display_name,
            email
          )
        `)
        .eq('org_id', orgId)
        .order('joined_at', { ascending: false })
        .limit(100);

      if (members) {
        fetchedData.members = members;
        fetchedData.dataTypes.push('members');
        fetchedData.memberCount = members.length;
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

    // Check for analytics queries
    if (questionLower.includes('analytic') || questionLower.includes('report') || 
        questionLower.includes('performance') || questionLower.includes('metric')) {
      const { data: analytics } = await supabase
        .from('analytics_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);

      if (analytics) {
        fetchedData.analytics = analytics;
        fetchedData.dataTypes.push('analytics');
      }
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
